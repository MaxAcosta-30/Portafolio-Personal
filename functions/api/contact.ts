/**
 * POST /api/contact — Cloudflare Pages Function junto al sitio estático (output: "export"
 * no admite Server Actions ni Route Handlers). Envía el mensaje con la API de Resend.
 *
 * Secretos y variables (Cloudflare → Pages → Settings → Variables and Secrets; nunca en el repo):
 *   RESEND_API_KEY  secreto de Resend
 *   CONTACT_TO      buzón que recibe los mensajes
 *   CONTACT_FROM    remitente verificado en Resend, p. ej. "Portafolio <contacto@tu-dominio.com>"
 * Opcional: un KV namespace enlazado como CONTACT_RATE_LIMIT para que el límite por IP sea
 * global. Sin él, el límite vive en la memoria de cada instancia (mejor esfuerzo).
 */
import { HONEYPOT_FIELD, validateContact, type ContactInput } from "../../src/lib/contact-schema";

type RateStore = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

export type Env = {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  CONTACT_RATE_LIMIT?: RateStore;
};

type Context = { request: Request; env: Env };

export const RATE_LIMIT = { max: 5, windowSeconds: 600 } as const;
const MAX_BODY_BYTES = 16 * 1024;
const memory = new Map<string, { count: number; resetAt: number }>();

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } });
}

/** Cuenta un envío para la IP. Devuelve false si superó el límite de la ventana. */
async function allow(ip: string, store: RateStore | undefined, now = Date.now()): Promise<boolean> {
  const key = `contact:${ip}`;
  if (store) {
    const current = Number((await store.get(key)) ?? 0);
    if (current >= RATE_LIMIT.max) return false;
    await store.put(key, String(current + 1), { expirationTtl: RATE_LIMIT.windowSeconds });
    return true;
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowSeconds * 1000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT.max) return false;
  entry.count += 1;
  return true;
}

function emailText(data: ContactInput) {
  return [
    `Nombre: ${data.name}`,
    `Negocio: ${data.business || "—"}`,
    `Correo: ${data.email}`,
    `WhatsApp: ${data.whatsapp || "—"}`,
    `Necesita: ${data.need}`,
    `Presupuesto: ${data.budget || "—"}`,
    "",
    data.message,
  ].join("\n");
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  // Solo desde el propio sitio: el navegador siempre envía Origin en un fetch POST.
  const origin = request.headers.get("Origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: "origin" });
  if (!(request.headers.get("Content-Type") ?? "").includes("application/json")) return json(415, { ok: false, error: "content-type" });
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) return json(413, { ok: false, error: "too-large" });

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "too-large" });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("body");
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "invalid-json" });
  }

  // Honeypot: se responde como si todo hubiera ido bien para no dar pistas al bot.
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD] !== "") return json(200, { ok: true });

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!(await allow(ip, env.CONTACT_RATE_LIMIT))) return json(429, { ok: false, error: "rate-limit" }, { "Retry-After": String(RATE_LIMIT.windowSeconds) });

  const { data, errors } = validateContact(body);
  if (Object.keys(errors).length > 0) return json(422, { ok: false, error: "validation", fields: errors });

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) return json(503, { ok: false, error: "not-configured" });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: data.email,
      subject: `Cotización · ${data.need} · ${data.name}`.slice(0, 200),
      text: emailText(data),
    }),
  }).catch(() => null);

  if (!response || !response.ok) return json(502, { ok: false, error: "send-failed" });
  return json(200, { ok: true });
}

export function onRequest(): Response {
  return json(405, { ok: false, error: "method" }, { Allow: "POST" });
}

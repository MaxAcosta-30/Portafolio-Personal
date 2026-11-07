import { expect, test } from "@playwright/test";
import { onRequest, onRequestPost, RATE_LIMIT, type Env } from "../functions/api/contact";

const valid = { name: "Ana López", business: "", email: "ana@negocio.com", whatsapp: "667 123 4567", need: "Sitio web", budget: "Aún no lo sé", message: "Quiero una landing para mi negocio.", sitio_web: "" };
const env: Env = { RESEND_API_KEY: "test-key", CONTACT_TO: "dueno@example.com", CONTACT_FROM: "Portafolio <contacto@example.com>" };

function request(body: unknown, { ip = "203.0.113.1", origin = "https://example.com" } = {}) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, "CF-Connecting-IP": ip },
    body: JSON.stringify(body),
  });
}

let sent: { url: string; init: RequestInit }[] = [];
const realFetch = globalThis.fetch;
test.beforeEach(() => {
  sent = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => { sent.push({ url, init }); return new Response("{}", { status: 200 }); }) as typeof fetch;
});
test.afterEach(() => { globalThis.fetch = realFetch; });

test("envía a Resend con la clave solo en el servidor y Responder-a del cliente", async () => {
  const response = await onRequestPost({ request: request(valid, { ip: "203.0.113.10" }), env });
  expect(response.status).toBe(200);
  expect(sent).toHaveLength(1);
  expect(sent[0].url).toBe("https://api.resend.com/emails");
  expect((sent[0].init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
  const body = JSON.parse(String(sent[0].init.body));
  expect(body).toMatchObject({ to: ["dueno@example.com"], reply_to: "ana@negocio.com" });
  expect(body.text).toContain("WhatsApp: 667 123 4567");
});

test("honeypot lleno: responde ok sin enviar", async () => {
  const response = await onRequestPost({ request: request({ ...valid, sitio_web: "http://spam" }, { ip: "203.0.113.11" }), env });
  expect(response.status).toBe(200);
  expect(sent).toHaveLength(0);
});

test("rechaza otro origen, datos inválidos y métodos distintos de POST", async () => {
  expect((await onRequestPost({ request: request(valid, { origin: "https://evil.example", ip: "203.0.113.12" }), env })).status).toBe(403);
  const invalid = await onRequestPost({ request: request({ ...valid, email: "no-es-correo" }, { ip: "203.0.113.13" }), env });
  expect(invalid.status).toBe(422);
  expect((await invalid.json()).fields.email).toBeTruthy();
  expect(onRequest().status).toBe(405);
  expect(sent).toHaveLength(0);
});

test("limita los envíos por IP", async () => {
  for (let i = 0; i < RATE_LIMIT.max; i++) expect((await onRequestPost({ request: request(valid, { ip: "203.0.113.20" }), env })).status).toBe(200);
  const blocked = await onRequestPost({ request: request(valid, { ip: "203.0.113.20" }), env });
  expect(blocked.status).toBe(429);
  expect(blocked.headers.get("Retry-After")).toBe(String(RATE_LIMIT.windowSeconds));
  expect((await onRequestPost({ request: request(valid, { ip: "203.0.113.21" }), env })).status).toBe(200);
});

test("sin secretos configurados responde 503 y no llama a Resend", async () => {
  const response = await onRequestPost({ request: request(valid, { ip: "203.0.113.30" }), env: {} });
  expect(response.status).toBe(503);
  expect(sent).toHaveLength(0);
});

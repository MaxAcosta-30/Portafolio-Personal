"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Logo } from "./brand/logo";
import { BUDGETS, FIELDS, HONEYPOT_FIELD, LIMITS, NEEDS, validateContact, validateField, type ContactErrors, type ContactField, type ContactInput } from "@/lib/contact-schema";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY: ContactInput = { name: "", business: "", email: "", whatsapp: "", need: "", budget: "", message: "" };

const ERRORS: Record<string, string> = {
  "rate-limit": "Enviaste varios mensajes seguidos. Espera unos minutos o escríbeme directamente al correo.",
  "not-configured": "El envío todavía no está activo en este sitio. Escríbeme directamente al correo.",
  default: "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme directamente al correo.",
};

function FieldShell({ id, label, optional, help, error, children }: { id: ContactField; label: string; optional?: boolean; help?: string; error?: string; children: ReactNode }) {
  return <div className="form-field" data-invalid={error ? "" : undefined}>
    <label htmlFor={`contacto-${id}`}>{label}{optional && <span className="form-optional"> (opcional)</span>}</label>
    {children}
    {help && <p id={`contacto-${id}-help`} className="form-help">{help}</p>}
    <p id={`contacto-${id}-error`} className="form-error" aria-live="polite">{error}</p>
  </div>;
}

export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);

  const describedBy = (field: ContactField, help: boolean) => [help && `contacto-${field}-help`, `contacto-${field}-error`].filter(Boolean).join(" ");
  const control = (field: ContactField, help = false) => ({
    id: `contacto-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(field, help),
    // Valida al salir del campo; si ya mostraba un error, lo vuelve a comprobar mientras se corrige.
    onBlur: () => setErrors(current => ({ ...current, [field]: validateField(field, values[field]) })),
    onChange: (event: { target: { value: string } }) => {
      const value = event.target.value;
      setValues(current => ({ ...current, [field]: value }));
      if (errors[field]) setErrors(current => ({ ...current, [field]: validateField(field, value) }));
    },
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const { errors: found } = validateContact(values);
    setErrors(found);
    const first = FIELDS.find(field => found[field]);
    if (first) { form.current?.querySelector<HTMLElement>(`#contacto-${first}`)?.focus(); return; }

    setStatus("sending");
    setFailure("");
    const honeypot = (form.current?.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? "";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypot }),
      });
      const body = await response.json().catch(() => ({})) as { ok?: boolean; error?: string; fields?: ContactErrors };
      if (response.ok && body.ok) {
        setStatus("success");
        setValues(EMPTY);
        requestAnimationFrame(() => result.current?.focus());
        return;
      }
      if (body.fields) setErrors(body.fields);
      setFailure(ERRORS[body.error ?? ""] ?? ERRORS.default);
    } catch {
      setFailure(ERRORS.default);
    }
    setStatus("error");
    requestAnimationFrame(() => result.current?.focus());
  }

  if (status === "success") {
    return <div ref={result} className="form-result" tabIndex={-1} role="status">
      <p className="form-result-title">Mensaje enviado.</p>
      <p>Gracias. Te respondo al correo que dejaste.</p>
      <button type="button" className="button button-secondary" onClick={() => setStatus("idle")}>Enviar otro mensaje</button>
    </div>;
  }

  const sending = status === "sending";
  return <form ref={form} className="contact-form" noValidate onSubmit={submit} aria-describedby="contacto-privacidad" aria-busy={sending || undefined}>
    <div className="form-grid">
      <FieldShell id="name" label="Nombre" error={errors.name}>
        <input className="field" type="text" autoComplete="name" maxLength={LIMITS.name} required placeholder="Ej. Ana López" {...control("name")} />
      </FieldShell>
      <FieldShell id="business" label="Negocio" optional error={errors.business}>
        <input className="field" type="text" autoComplete="organization" maxLength={LIMITS.business} placeholder="Ej. Panadería La Espiga" {...control("business")} />
      </FieldShell>
      <FieldShell id="email" label="Correo" help="Te respondo a este correo." error={errors.email}>
        <input className="field" type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} required placeholder="Ej. ana@negocio.com" {...control("email", true)} />
      </FieldShell>
      <FieldShell id="whatsapp" label="WhatsApp" optional help="Si prefieres que te escriba por ahí." error={errors.whatsapp}>
        <input className="field" type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.whatsapp} placeholder="Ej. 667 123 4567" {...control("whatsapp", true)} />
      </FieldShell>
      <FieldShell id="need" label="Qué necesitas" error={errors.need}>
        <select className="field" required {...control("need")}>
          <option value="" disabled>Elige una opción</option>
          {NEEDS.map(need => <option key={need} value={need}>{need}</option>)}
        </select>
      </FieldShell>
      <FieldShell id="budget" label="Presupuesto aproximado" optional help="Solo para orientar la propuesta." error={errors.budget}>
        <select className="field" {...control("budget", true)}>
          <option value="">Sin indicar</option>
          {BUDGETS.map(budget => <option key={budget} value={budget}>{budget}</option>)}
        </select>
      </FieldShell>
      <div className="form-wide">
        <FieldShell id="message" label="Mensaje" help="Qué quieres lograr, para cuándo y si ya tienes algo hecho." error={errors.message}>
          <textarea className="field" rows={5} maxLength={LIMITS.message} required placeholder="Ej. Quiero una página para mostrar mi menú y recibir pedidos por WhatsApp." {...control("message", true)} />
        </FieldShell>
      </div>
    </div>
    {/* Honeypot: fuera de la vista y del orden de tabulación. */}
    <div className="form-trap" aria-hidden="true">
      <label htmlFor="contacto-trap">No llenes este campo</label>
      <input id="contacto-trap" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
    <div className="form-actions">
      <button type="submit" className="button form-submit" aria-disabled={sending || undefined}>
        {sending ? <Logo variant="deploy" size={18} label="Enviando…" /> : <>Cotiza tu proyecto<span className="button-arrow" aria-hidden="true">→</span></>}
      </button>
      <p id="contacto-privacidad" className="form-help">Al enviar aceptas el tratamiento de tus datos según el <Link className="text-link" href="/privacidad">aviso de privacidad</Link>.</p>
    </div>
    <div ref={result} tabIndex={-1} role="alert" className="form-failure">{status === "error" && <p>{failure} <a className="text-link" href={`mailto:${email}`}>{email}</a></p>}</div>
  </form>;
}

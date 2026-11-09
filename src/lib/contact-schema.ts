/**
 * Reglas del formulario de contacto. Las comparten el formulario (validación al salir del
 * campo) y la Pages Function (functions/api/contact.ts), que vuelve a validar todo.
 */

export const NEEDS = ["Sitio web", "Punto de venta", "API", "Sistema a medida", "Otro"] as const;
// Rangos definidos por el propietario (2026-11-05).
export const BUDGETS = ["Menos de $5,000 MXN", "$5,000 – $15,000 MXN", "$15,000 – $40,000 MXN", "Más de $40,000 MXN", "Aún no lo sé"] as const;

export type ContactField = "name" | "business" | "email" | "whatsapp" | "need" | "budget" | "message";
export type ContactInput = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Campo trampa: invisible para personas; si llega con texto, el envío se descarta en silencio. */
export const HONEYPOT_FIELD = "sitio_web";

export const LIMITS = { name: 100, business: 120, email: 254, whatsapp: 20, message: 2000, messageMin: 10 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]+$/;

export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "Escribe tu nombre.";
      if (value.length < 2) return "El nombre necesita al menos 2 caracteres.";
      if (value.length > LIMITS.name) return `Máximo ${LIMITS.name} caracteres.`;
      return;
    case "business":
      if (value.length > LIMITS.business) return `Máximo ${LIMITS.business} caracteres.`;
      return;
    case "email":
      if (!value) return "Escribe tu correo para poder responderte.";
      if (value.length > LIMITS.email || !EMAIL.test(value)) return "Revisa el correo: debe tener la forma nombre@dominio.com.";
      return;
    case "whatsapp": {
      if (!value) return;
      const digits = value.replace(/\D/g, "");
      if (!PHONE.test(value) || digits.length < 10 || digits.length > 15) return "Escribe un número de 10 dígitos, con lada si estás fuera de México.";
      return;
    }
    case "need":
      if (!(NEEDS as readonly string[]).includes(value)) return "Elige qué necesitas.";
      return;
    case "budget":
      if (value && !(BUDGETS as readonly string[]).includes(value)) return "Elige un rango de la lista.";
      return;
    case "message":
      if (!value) return "Cuéntame brevemente sobre tu proyecto.";
      if (value.length < LIMITS.messageMin) return `Escribe al menos ${LIMITS.messageMin} caracteres.`;
      if (value.length > LIMITS.message) return `Máximo ${LIMITS.message} caracteres.`;
      return;
  }
}

export const FIELDS: readonly ContactField[] = ["name", "business", "email", "whatsapp", "need", "budget", "message"];

export function validateContact(input: Partial<Record<string, unknown>>): { data: ContactInput; errors: ContactErrors } {
  const data = Object.fromEntries(FIELDS.map(field => [field, typeof input[field] === "string" ? (input[field] as string).trim() : ""])) as ContactInput;
  const errors: ContactErrors = {};
  for (const field of FIELDS) {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  }
  return { data, errors };
}

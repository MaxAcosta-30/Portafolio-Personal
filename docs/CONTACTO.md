# Contacto — arquitectura (actualizado el 5 de noviembre de 2026)

Sustituye a la Opción A (solo `mailto:`) del Prompt 12. Decisión del propietario: Cloudflare
Pages Function + Resend.

## Cómo funciona

- **Formulario** (`src/components/contact-form.tsx`) en la sección Contacto de la home: nombre,
  negocio (opcional), correo, WhatsApp (opcional), qué necesitas, presupuesto aproximado
  (opcional, rangos definidos por el propietario) y mensaje. Valida al salir de cada campo con
  las mismas reglas que el servidor (`src/lib/contact-schema.ts`).
- **Envío**: `POST /api/contact`, atendido por `functions/api/contact.ts`, una Pages Function que
  Cloudflare despliega junto al sitio estático (`output: "export"` no admite Server Actions ni
  Route Handlers). La función llama a la API REST de Resend; el correo llega con
  *Responder a* = correo del cliente.
- **Protección**: comprobación de `Origin`, solo JSON de hasta 16 KB, honeypot (`sitio_web`,
  fuera de la vista y del tabulador; si llega lleno responde 200 sin enviar), límite de
  5 envíos por IP cada 10 minutos (`CF-Connecting-IP`), validación completa en el servidor.
- **Alternativa**: el correo sigue visible con "Copiar correo" y "Abrir en tu app de correo".

## Configuración pendiente (la hace el propietario)

1. Crear cuenta en Resend y verificar el dominio del sitio (sin dominio verificado Resend solo
   permite enviar desde `onboarding@resend.dev` al correo de la propia cuenta).
2. En Cloudflare → Pages → el proyecto → Settings → Variables and Secrets (Production):
   - `RESEND_API_KEY` como **secreto**.
   - `CONTACT_TO`: buzón que recibe los mensajes.
   - `CONTACT_FROM`: remitente verificado, p. ej. `Portafolio <contacto@tu-dominio.com>`.
3. Opcional, recomendado: crear un KV namespace y enlazarlo como `CONTACT_RATE_LIMIT`
   (Settings → Bindings). Sin él, el límite por IP vive en la memoria de cada instancia y es
   solo de mejor esfuerzo.
4. Volver a desplegar.

Mientras falten los secretos, la función responde 503 y el formulario muestra un error con el
correo como alternativa. **Nunca** poner claves en el repositorio; para probar en local con
Wrangler se usa `.dev.vars`, ya ignorado por Git.

## Verificación

- `tests/contact-function.spec.ts`: envío a Resend (clave solo en la cabecera del servidor),
  honeypot, origen ajeno, validación, 405, límite por IP y 503 sin configuración.
- `tests/phase2.spec.ts`: validación al salir del campo, foco con borde de acento, estado
  "Enviando…" con `<Logo variant="deploy">`, éxito, error y axe sin violaciones.
- **NO VERIFICADO**: un envío real a Resend desde Cloudflare (requiere la cuenta y los secretos).

## Privacidad

Aviso de privacidad (LFPDPPP) en `/privacidad`, enlazado desde el pie y desde el formulario.
`/legal/privacidad` redirige con 301 (`public/_redirects`). Campos marcados `[POR COMPLETAR]`:
domicilio, plazo de conservación y confirmación de que no hay finalidades secundarias.
Pendiente de revisión legal.

import type { ReactNode } from "react";
import { LinkPreferenciasCookies } from "@/components/cookie-consent";
import { SiteHeader } from "@/components/portfolio";
import { contact, profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";

export const metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad integral del portafolio de Max Acosta, conforme a la LFPDPPP.",
  alternates: { canonical: `${siteMetadata.siteUrl}/privacidad` },
} as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section aria-labelledby={id} className="legal-section">
    <h2 id={id}>{title}</h2>
    {children}
  </section>;
}

export default function AvisoDePrivacidad() {
  const email = contact.email?.label ?? "";
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <SiteHeader homeLinks />
    <main id="contenido" tabIndex={-1} className="page-container legal-page">
      <header>
        <p className="mono-label">Ley Federal de Protección de Datos Personales en Posesión de los Particulares</p>
        <h1>Aviso de privacidad</h1>
        <p className="legal-meta">Última actualización: 8 de noviembre de 2026.</p>
      </header>

      <article>
        <Section id="responsable" title="Responsable">
          <p>{profile.name}, persona física, es responsable del tratamiento de los datos personales que proporcionas en este sitio.</p>
          <dl>
            <div><dt>Domicilio</dt><dd>Culiacán, Sinaloa, México. Cualquier solicitud o notificación sobre tus datos se atiende en el correo de contacto.</dd></div>
            <div><dt>Correo de contacto</dt><dd><a className="text-link" href={contact.email?.href}>{email}</a></dd></div>
          </dl>
        </Section>

        <Section id="datos" title="Datos personales que se tratan">
          <p>Cuando envías el formulario de contacto:</p>
          <ul>
            <li>Nombre.</li>
            <li>Nombre de tu negocio (opcional).</li>
            <li>Correo electrónico.</li>
            <li>Número de WhatsApp (opcional).</li>
            <li>Tipo de proyecto, presupuesto aproximado (opcional) y el mensaje que escribas.</li>
          </ul>
          <p>Para proteger el formulario contra abuso, el servidor usa tu dirección IP para limitar el número de envíos durante un periodo corto.</p>
          <p>No se solicitan datos personales sensibles. Te pido no incluirlos en el mensaje.</p>
        </Section>

        <Section id="finalidades" title="Para qué se usan">
          <p>Finalidades necesarias para atender tu solicitud:</p>
          <ul>
            <li>Responder tu mensaje y contactarte por el medio que indiques.</li>
            <li>Preparar y enviarte una propuesta o cotización.</li>
            <li>Dar seguimiento a la conversación sobre tu proyecto.</li>
          </ul>
          <p>Tus datos no se usan para publicidad ni para enviarte boletines, y no hay finalidades secundarias.</p>
        </Section>

        <Section id="encargados" title="Con quién se comparten">
          <p>No vendo ni transfiero tus datos a terceros. Para operar el sitio intervienen proveedores que los tratan por cuenta del responsable:</p>
          <ul>
            <li><strong>Resend</strong>: entrega por correo electrónico los mensajes del formulario.</li>
            <li><strong>Google (Gmail)</strong>: buzón donde se reciben y conservan esos mensajes.</li>
            <li><strong>Cloudflare</strong>: alojamiento del sitio y procesamiento del formulario; trata la dirección IP para seguridad y entrega del contenido.</li>
            <li><strong>Google Analytics</strong>: solo si aceptas la medición en el aviso de cookies.</li>
          </ul>
          <p>Algunos de estos proveedores procesan la información fuera de México.</p>
        </Section>

        <Section id="conservacion" title="Cuánto tiempo se conservan">
          <p>Los mensajes recibidos por el formulario se conservan hasta 12 meses desde su recepción y después se eliminan.</p>
        </Section>

        <Section id="arco" title="Tus derechos (ARCO) y revocación del consentimiento">
          <p>Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento, así como revocar tu consentimiento o limitar su uso, escribiendo a <a className="text-link" href={contact.email?.href}>{email}</a>.</p>
          <p>Incluye en tu solicitud:</p>
          <ul>
            <li>Tu nombre y un medio para responderte.</li>
            <li>Un documento que acredite tu identidad o, en su caso, la de tu representante.</li>
            <li>La descripción clara de los datos y del derecho que quieres ejercer.</li>
          </ul>
          <p>La respuesta se enviará al medio que indiques, en los plazos que establece la LFPDPPP.</p>
        </Section>

        <Section id="cookies" title="Cookies y medición">
          <p>Este sitio solo usa cookies de Google Analytics, y únicamente si las aceptas. El tema claro u oscuro, tu preferencia de cookies y si ya viste la animación de entrada se guardan en el almacenamiento local de tu navegador, no en un servidor. Puedes cambiar tu elección en cualquier momento.</p>
          <p><LinkPreferenciasCookies /></p>
        </Section>

        <Section id="cambios" title="Cambios a este aviso">
          <p>Cualquier cambio se publicará en esta misma página, con su fecha de actualización.</p>
        </Section>
      </article>
    </main>
  </>;
}

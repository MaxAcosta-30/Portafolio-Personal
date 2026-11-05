import { LinkPreferenciasCookies } from "@/components/cookie-consent";
import { SiteHeader } from "@/components/portfolio";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";

export const metadata = {
  title: `Política de privacidad · ${profile.name}`,
  description: "Política de privacidad del portafolio de Max Alexander Acosta Valencia.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/legal/privacidad`,
  },
} as const;

export default function Privacidad() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader homeLinks />
      <main id="contenido" tabIndex={-1} className="page-container">
        <header className="mb-[4rem] border-b border-border pb-[1.5rem]">
          <h1 className="text-display">Política de privacidad</h1>
          <p className="mt-[1rem] text-label text-muted">
            Última actualización: 29 de octubre de 2026. Pendiente de revisión por un profesional legal.
          </p>
        </header>

        <article className="max-w-measure space-y-[2rem]">
          <section>
            <h2 className="text-heading">Responsable del sitio</h2>
            <p className="text-body">
              Este sitio web es el portafolio profesional de Max Alexander Acosta Valencia, con sede en Culiacán, Sinaloa, México. El objetivo de este sitio es exhibir proyectos de ingeniería de software y no tiene fines de comercio electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Datos que recopilamos</h2>
            <p className="text-body">
              Este sitio web está diseñado como una plataforma estática. No recopilamos datos personales de forma directa, ya que no contamos con formularios de contacto, sistemas de registro de usuarios ni bases de datos propias.
            </p>
            <p className="text-body">
              Para fines estadísticos y de mejora continua, recopilamos datos técnicos y de uso de manera automatizada cuando navegas por el sitio. Estos datos incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-body text-muted">
              <li>Páginas visitadas y tiempo de interacción.</li>
              <li>Dirección IP (anonimizada).</li>
              <li>Información del dispositivo, navegador y sistema operativo.</li>
              <li>Ubicación geográfica aproximada (nivel ciudad/país).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading">Proveedores de terceros</h2>
            <p className="text-body">
              Para recopilar la información analítica y alojar el sitio, utilizamos los siguientes servicios de terceros, los cuales operan bajo sus propias políticas de privacidad:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-body text-muted">
              <li>
                <strong>Google Analytics 4</strong> (Google LLC): utilizado para medir el tráfico y la interacción de los usuarios en el sitio. Google Analytics utiliza cookies para rastrear este comportamiento.
              </li>
              <li>
                <strong>Cloudflare Pages</strong>: proveedor de alojamiento web e infraestructura (CDN). Cloudflare procesa temporalmente las direcciones IP de los visitantes para garantizar la seguridad, el rendimiento y el enrutamiento del sitio.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading">Uso de cookies</h2>
            <p className="text-body">
              Este sitio utiliza cookies exclusivamente a través de Google Analytics para funciones de medición y análisis. Al navegar por el portafolio, aceptas el uso de estas cookies de rastreo con fines estadísticos. Puedes deshabilitar las cookies en cualquier momento desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Contacto y derechos</h2>
            <p className="text-body">
              Si tienes alguna duda sobre esta política de privacidad o sobre el tratamiento de la información técnica recopilada, puedes contactarme directamente a través de mi correo electrónico:
              <a href="mailto:maxacostado3020@gmail.com" className="text-link">maxacostado3020@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Cambios a esta política</h2>
            <p className="text-body">
              Esta política puede actualizarse. Te recomendamos revisarla periódicamente. Los cambios entrarán en vigor al publicarse en esta página.
            </p>
          </section>

          <section className="mt-[2rem] border-t border-border pt-[1.5rem]">
            <h3 className="text-title">Revisión legal pendiente</h3>
            <p className="text-body text-muted">
              Este documento usa como base los datos proporcionados por el responsable del sitio. Antes de publicar, debe ser revisado por un profesional legal o por el propio responsable para confirmar su adecuación a la legislación aplicable (México). Los campos que faltan completar se indican con [POR COMPLETAR: ...].
            </p>
          </section>
        </article>
        <footer className="mt-[4rem] border-t border-border pt-[1.5rem] pb-[1.5rem]">
          <LinkPreferenciasCookies />
        </footer>
      </main>
    </>
  );
}

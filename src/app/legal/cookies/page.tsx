import { LinkPreferenciasCookies } from "@/components/cookie-consent";
import { SiteHeader } from "@/components/portfolio";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";

export const metadata = {
  title: `Política de cookies · ${profile.name}`,
  description: "Política de cookies del portafolio de Max Alexander Acosta Valencia.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/legal/cookies`,
  },
} as const;

export default function Cookies() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader homeLinks />
      <main id="contenido" tabIndex={-1} className="page-container">
        <header className="mb-[4rem] border-b border-border pb-[1.5rem]">
          <h1 className="text-display">Política de cookies</h1>
          <p className="mt-[1rem] text-label text-muted">
            Última actualización: 29 de octubre de 2026. Pendiente de revisión por un profesional legal.
          </p>
        </header>

        <article className="max-w-measure space-y-[2rem]">
          <section>
            <h2 className="text-heading">¿Qué son las cookies?</h2>
            <p className="text-body">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para recordar información sobre tu visita y mejorar tu experiencia.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Cookies que utilizamos</h2>
            <p className="text-body">
              Este sitio utiliza cookies exclusivamente a través de Google Analytics 4 para funciones de medición y análisis. Estas cookies son de terceros y se utilizan con fines estadísticos.
            </p>
            <table className="w-full border-collapse mt-[1rem] text-body text-muted">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-[0.5rem] font-semibold text-foreground">Cookie</th>
                  <th className="text-left pb-[0.5rem] font-semibold text-foreground">Proveedor</th>
                  <th className="text-left pb-[0.5rem] font-semibold text-foreground">Propósito</th>
                  <th className="text-left pb-[0.5rem] font-semibold text-foreground">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="pt-[0.5rem] font-mono text-label">_ga</td>
                  <td className="pt-[0.5rem]">Google Analytics 4</td>
                  <td className="pt-[0.5rem]">Distinguir a los usuarios únicos</td>
                  <td className="pt-[0.5rem]">2 años</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="pt-[0.5rem] font-mono text-label">_ga_*</td>
                  <td className="pt-[0.5rem]">Google Analytics 4</td>
                  <td className="pt-[0.5rem]">Mantener el estado de la sesión</td>
                  <td className="pt-[0.5rem]">2 años</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-heading">Gestión de cookies</h2>
            <p className="text-body">
              Puedes aceptar o rechazar las cookies de análisis mediante el banner de consentimiento que aparece al visitar el sitio. También puedes deshabilitar las cookies en cualquier momento desde la configuración de tu navegador. Rechazar las cookies de Google Analytics impedirá que se cargue el script de medición.
            </p>
            <p className="text-body">
              Si ya diste tu consentimiento y deseas cambiarlo, utiliza el enlace <strong>Preferencias de cookies</strong> disponible en el pie de página del sitio.
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

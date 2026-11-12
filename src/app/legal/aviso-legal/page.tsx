import { SiteFooter, SiteHeader } from "@/components/portfolio";
import { siteMetadata } from "@/content/site";

export const metadata = {
  title: "Aviso legal",
  description: "Aviso legal del portafolio de Max Acosta.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/legal/aviso-legal`,
  },
} as const;

export default function AvisoLegal() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="page-container">
        <header className="mb-[4rem] border-b border-border pb-[1.5rem]">
          <h1 className="text-display">Aviso legal</h1>
          <p className="mt-[1rem] text-label text-muted">
            Última actualización: 8 de noviembre de 2026.
          </p>
        </header>

        <article className="max-w-measure space-y-[2rem]">
          <section>
            <h2 className="text-heading">Información del responsable</h2>
            <p className="text-body">
              <strong>Nombre o razón social:</strong> Max Alexander Acosta Valencia<br />
              <strong>Sede:</strong> Culiacán, Sinaloa, México<br />
              <strong>Objetivo del sitio:</strong> Exhibir proyectos de ingeniería de software. No tiene fines de comercio electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Condiciones de uso</h2>
            <p className="text-body">
              El contenido de este sitio web tiene carácter informativo y se destina a dar a conocer el trabajo profesional de Max Alexander Acosta Valencia como desarrollador Full Stack y estudiante de Ingeniería en Sistemas Computacionales.
            </p>
            <p className="text-body">
              Los proyectos presentados son casos autodirigidos de portafolio. No se afirma uso en producción, clientes ni resultados comerciales sin evidencia reproducible. Toda afirmación sobre tecnologías y funcionalidades se sustenta en fuentes citadas (CV y repositorios públicos revisados).
            </p>
          </section>

          <section>
            <h2 className="text-heading">Propiedad intelectual</h2>
            <p className="text-body">
              El contenido de este sitio (textos, diseño, código) pertenece a Max Alexander Acosta Valencia o a sus respectivos autores cuando se cite de forma expresa. Queda prohibida la reproducción total o parcial sin autorización, salvo para uso personal y no comercial.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Exención de responsabilidad</h2>
            <p className="text-body">
              El responsable no se hace responsable de los daños y perjuicios de cualquier naturaleza derivados del uso de la información contenida en este sitio, ni de la falta de disponibilidad del mismo. Los enlaces a sitios externos (repositorios de GitHub, perfiles de LinkedIn) son proporcionados a título informativo; el responsable no controla su contenido.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Legislación aplicable y jurisdicción</h2>
            <p className="text-body">
              El presente aviso legal se rige por la legislación de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Culiacán, Sinaloa, salvo que la ley aplicable disponga otra cosa.
            </p>
          </section>

          <section>
            <h2 className="text-heading">Contacto</h2>
            <p className="text-body">
              Para cualquier duda sobre este aviso legal, puedes contactar al responsable a través del correo electrónico:
              <a href="mailto:maxacostado3020@gmail.com" className="text-link">maxacostado3020@gmail.com</a>.
            </p>
          </section>

        </article>
      </main>
      <SiteFooter />
    </>
  );
}

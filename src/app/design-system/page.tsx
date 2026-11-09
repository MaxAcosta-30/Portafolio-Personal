import { Field, Icon, Skeleton, Tag } from "@/components/ui";
import { InteractionDemo } from "./interaction-demo";
import { Navigation } from "./navigation";
import { profile } from "@/content/profile";
import { hangar } from "@/content/projects";
import { siteMetadata } from "@/content/site";

export const metadata = {
  title: "Sistema de diseño",
  description: "Referencia de desarrollo de la dirección Plano de sistemas.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/design-system`,
  },
  openGraph: {
    title: "Sistema de diseño",
    description: "Referencia de desarrollo de la dirección Plano de sistemas.",
    type: "website",
    url: `${siteMetadata.siteUrl}/design-system`,
  },
} as const;

const colors = [
  { name: "Fondo", token: "background", className: "bg-background", use: "Lienzo mineral" },
  { name: "Superficie", token: "surface", className: "bg-surface", use: "Evidencia y muestras" },
  { name: "Texto", token: "foreground", className: "bg-foreground", use: "Lectura principal" },
  { name: "Secundario", token: "muted", className: "bg-muted", use: "Contexto y notas" },
  { name: "Separador", token: "border", className: "bg-border", use: "División decorativa" },
  { name: "Control", token: "control", className: "bg-control", use: "Límites perceptibles" },
  { name: "Acento", token: "accent", className: "bg-accent", use: "Acción y foco" },
];

const typeSamples = [
  { label: "Display", token: "text-display", className: "text-display", sample: "Pensar en sistemas." },
  { label: "Heading", token: "text-heading", className: "text-heading", sample: "Decisiones que se pueden explicar." },
  { label: "Title", token: "text-title", className: "text-title", sample: "La relación entre las partes" },
  { label: "Body", token: "text-body", className: "text-body", sample: "Un sistema se entiende mejor cuando su estructura, sus decisiones y sus límites son visibles." },
  { label: "Label / Mono", token: "text-label", className: "text-label font-mono", sample: "--spacing-gutter: 1.5rem;" },
];

export default function DesignSystemPage() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-x-6 gap-y-2 px-page py-6">
          <p className="font-medium">{profile.displayName}</p>
          <p className="text-label text-muted">Plano de sistemas <span aria-hidden="true">/</span> Referencia de desarrollo</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-site gap-8 px-page py-8 lg:grid-cols-12 lg:gap-gutter lg:py-12">
        <aside className="min-w-0 lg:col-span-2"><Navigation /></aside>
        <main id="contenido" tabIndex={-1} className="min-w-0 lg:col-span-9 lg:col-start-4">
          <div className="mb-section border-b border-border pb-8">
            <h1 className="text-display">Sistema de diseño</h1>
            <p className="mt-4 max-w-measure text-muted">Precisión en la estructura. Claridad en cada estado. Una base visual para presentar el trabajo sin distraer de él.</p>
            <div className="mt-6 flex flex-wrap gap-2"><Tag>Dirección B aprobada</Tag><Tag>Fase 3 · Componentes</Tag></div>
          </div>

          <div className="space-y-section">
            <section id="fundamentos" aria-labelledby="fundamentos-title">
              <h2 id="fundamentos-title" className="section-heading">Fundamentos</h2>
              <p className="section-description">Una paleta mineral, superficies planas y un acento reservado para orientar. La separación estructura; el color señala acciones y estados.</p>
              <ul className="grid grid-cols-2 gap-x-gutter gap-y-6 md:grid-cols-4">
                {colors.map(({ name, token, className, use }) => <li key={token}>
                  <div aria-hidden="true" className={`mb-3 h-16 border border-border ${className}`} />
                  <p className="font-medium">{name}</p>
                  <code className="block break-words text-label text-muted">{token}</code>
                  <p className="mt-1 text-label text-muted">{use}</p>
                </li>)}
              </ul>
              <p className="mt-6 max-w-measure text-label text-muted">Los separadores suaves son decorativos. Los campos y controles usan un borde más oscuro; el foco conserva su propio indicador.</p>
            </section>

            <section id="tipografia" aria-labelledby="tipografia-title">
              <h2 id="tipografia-title" className="section-heading">Tipografía</h2>
              <p className="section-description">IBM Plex Sans sostiene la lectura. IBM Plex Mono se limita a código, identificadores y medidas. Ambas fuentes se sirven desde el proyecto.</p>
              <div className="divide-y divide-border border-y border-border">
                {typeSamples.map(({ label, token, className, sample }) => <div key={token} className="grid gap-3 py-6 md:grid-cols-4 md:gap-gutter">
                  <div><p className="text-label font-medium">{label}</p><code className="text-label text-muted">{token}</code></div>
                  <p className={`min-w-0 md:col-span-3 ${className}`}>{sample}</p>
                </div>)}
              </div>
              <p className="mt-4 text-label text-muted">Prueba de caracteres: Ingeniería, precisión, acción. ¿Qué cambia? ¡También la ñ!</p>
            </section>

            <section id="interaccion" aria-labelledby="interaccion-title">
              <h2 id="interaccion-title" className="section-heading">Interacción</h2>
              <p className="section-description">Hover y pulsación cambian el color; el foco se reconoce por su contorno. Prueba los controles con Tab, Enter, Espacio y las flechas del teclado.</p>
              <InteractionDemo />
            </section>

            <section id="formularios" aria-labelledby="formularios-title">
              <h2 id="formularios-title" className="section-heading">Formularios</h2>
              <p className="section-description">
                Campos con label estático arriba, helper visible siempre, foco que cambia el borde y el label al acento, y mensajes de error específicos. Un solo campo de nombre completo porque el formulario de contacto es corto y no requiere separar apellidos en el primer contacto.
              </p>
              <div className="space-y-[2rem] max-w-measure">
                <Field label="Nombre completo" id="nombre" placeholder="Juan Pérez García" helper="Nombre tal como aparece en tus documentos" />
                <Field label="Correo electrónico" id="correo" placeholder="nombre@correo.com" helper="Usa el correo donde prefieras que respondamos" type="email" />
                <Field label="Mensaje" id="mensaje" placeholder="Cuéntanos sobre tu proyecto" helper="Máximo 500 palabras" />
                <Field
                  label="Correo con error"
                  id="correo-error"
                  placeholder="nombre@correo.com"
                  helper="El formato no es válido"
                  error="Escribe una dirección de correo válida."
                  type="email"
                  aria-invalid="true"
                />
                <Field label="Campo deshabilitado" id="deshabilitado" placeholder="No disponible" disabled />
                <div className="flex items-start gap-3 text-accent">
                  <Icon name="check" />
                  <div>
                    <p className="font-semibold">Mensaje enviado.</p>
                    <p className="mt-1 text-muted">Te responderemos a la brevedad.</p>
                  </div>
                </div>
                <div className="mt-[1rem]">
                  <p className="text-label font-medium">Skeleton (dimensiones exactas, sin layout shift)</p>
                  <div className="mt-[0.5rem] flex gap-[0.75rem]">
                    <Skeleton className="w-[12rem] h-[1rem]" />
                    <Skeleton className="w-[24rem] h-[2rem]" />
                    <Skeleton className="w-[4rem] h-[4rem] rounded-control" />
                  </div>
                </div>
              </div>
            </section>

            <section id="composicion" aria-labelledby="composicion-title">
              <h2 id="composicion-title" className="section-heading">Composición</h2>
              <p className="section-description">Una retícula de doce columnas organiza el escritorio. En pantallas pequeñas, el contenido conserva su orden en una sola columna.</p>
              <div className="grid grid-cols-12 gap-1" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => <div key={index} className="h-12 bg-control" />)}
              </div>
              <dl className="mt-4 grid gap-4 border-b border-border pb-8 md:grid-cols-3">
                <div><dt className="text-label text-muted">Ancho máximo</dt><dd className="mt-1 font-mono text-label">77.5rem / 1240px</dd></div>
                <div><dt className="text-label text-muted">Separación</dt><dd className="mt-1 font-mono text-label">1.5rem / 24px</dd></div>
                <div><dt className="text-label text-muted">Lectura</dt><dd className="mt-1 font-mono text-label">Hasta 64ch</dd></div>
              </dl>
              <h3 className="mt-8 mb-4 text-title">Espacio con ritmo</h3>
              <div className="flex flex-wrap items-end gap-4" aria-label="Escala de espaciado en píxeles">
                {[{ label: "4", c: "w-1" }, { label: "8", c: "w-2" }, { label: "12", c: "w-3" }, { label: "16", c: "w-4" }, { label: "24", c: "w-6" }, { label: "32", c: "w-8" }, { label: "48", c: "w-12" }, { label: "80", c: "w-20" }].map(({ label, c }) => <div key={label}><div className={`mb-2 h-6 bg-accent ${c}`} aria-hidden="true" /><span className="font-mono text-label tabular-nums">{label}</span></div>)}
              </div>
              <article className="mt-12 border-y border-border bg-surface px-4 py-8 md:px-6" aria-labelledby="project-title">
                <div className="flex flex-wrap items-center justify-between gap-4"><h3 id="project-title" className="text-heading">{hangar.name}</h3><Tag>Muestra de composición</Tag></div>
                <p className="mt-3 max-w-measure text-muted">Candidato a caso de estudio. La descripción, la arquitectura y las tecnologías están pendientes de revisar las referencias.</p>
                <div className="mt-6 grid gap-gutter md:grid-cols-3">
                  <div className="border-y border-border bg-background p-6 md:col-span-2">
                    <p className="font-medium">Evidencia pendiente</p>
                    <p className="mt-3 text-muted">Aquí se incluirá una captura o un esquema verificado, acompañado de una explicación textual.</p>
                  </div>
                  <dl className="space-y-4">
                    <div><dt className="font-medium">Aportación</dt><dd className="mt-1 text-label text-muted">Por documentar.</dd></div>
                    <div><dt className="font-medium">Decisiones</dt><dd className="mt-1 text-label text-muted">Por contrastar con evidencia.</dd></div>
                    <div><dt className="font-medium">Límites</dt><dd className="mt-1 text-label text-muted">Por confirmar.</dd></div>
                  </dl>
                </div>
                <details className="mt-6 border-t border-border pt-4">
                  <summary className="min-h-target cursor-pointer py-3 font-medium text-accent">Cómo se utiliza esta muestra</summary>
                  <p className="mt-2 max-w-measure pb-4 text-muted">Demuestra jerarquía y relación entre evidencia y contexto. No es un caso publicado ni representa funcionalidades verificadas de Hangar.</p>
                </details>
              </article>
            </section>

            <section id="accesibilidad" aria-labelledby="accesibilidad-title">
              <h2 id="accesibilidad-title" className="section-heading">Accesibilidad como base</h2>
              <p className="section-description">Los estados tienen nombres, el contenido conserva su semántica y el movimiento no condiciona el acceso a la información.</p>
              <ul className="divide-y divide-border border-y border-border">
                {[
                  ["Teclado", "Enlace para saltar al contenido, foco visible y controles nativos sin trampas de foco."],
                  ["Lectura", "Jerarquía de títulos, regiones identificadas y mensajes de estado anunciados de forma discreta."],
                  ["Interacción táctil", "Controles de al menos 44px de alto y separación que evita áreas superpuestas."],
                  ["Movimiento reducido", "Las transiciones se desactivan según la preferencia del sistema. No hay animaciones de entrada."],
                  ["Iconografía", "Un solo trazo de 1.5px, color heredado y etiquetas de texto. Los iconos decorativos no se anuncian."],
                ].map(([title, description]) => <li key={title} className="grid gap-2 py-4 md:grid-cols-3 md:gap-gutter"><p className="font-medium">{title}</p><p className="text-muted md:col-span-2">{description}</p></li>)}
              </ul>
              <a className="text-link mt-6" href="#contenido">Volver al inicio <Icon name="arrow" /></a>
            </section>
          </div>
        </main>
      </div>
      <footer className="mt-8 border-t border-border"><div className="mx-auto max-w-site px-page py-6 text-label text-muted">Sistema de diseño en desarrollo. El contenido de los proyectos aún no está validado.</div></footer>
    </>
  );
}

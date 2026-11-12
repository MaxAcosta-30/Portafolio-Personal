import Link from "next/link";
import { ViewTransition } from "react";
import type { ReactNode } from "react";
import { SequenceList } from "@/components/sequence-list";
import { SiteFooter, SiteHeader } from "@/components/portfolio";
import { Showcase } from "@/components/showcase";
import { Icon } from "@/components/ui";
import { hitoCaseStudy as content, hitoSources } from "@/content/hito-case-study";
import { hito } from "@/content/projects";
import { portfolioLabels, siteMetadata } from "@/content/site";

export const metadata = {
  title: "Hito · Caso de estudio",
  description: content.introduction,
  alternates: { canonical: `${siteMetadata.siteUrl}/proyectos/hito` },
  openGraph: {
    title: "Hito · Caso de estudio",
    description: content.introduction,
    type: "website",
    url: `${siteMetadata.siteUrl}/proyectos/hito`,
    images: [{ url: `${siteMetadata.siteUrl}/og-hito.png`, width: 1200, height: 630, alt: "Caso de estudio: Hito" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hito · Caso de estudio · Max Acosta",
    description: content.introduction,
    images: [`${siteMetadata.siteUrl}/og-hito.png`],
  },
} as const;

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="portfolio-section">
    <h2 id={`${id}-title`} className="max-w-measure text-heading">{title}</h2>
    <div className="mt-6">{children}</div>
  </section>;
}

function SourceLinks({ sources }: { sources: readonly { label: string; source: string }[] }) {
  if (sources.length === 0) return null;
  return <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-label">
    {sources.map(source => <a key={source.source} className="text-link" href={source.source}>
      <span className="sr-only">{content.sources.label}: </span>{source.label}<Icon name="external" />
    </a>)}
  </div>;
}

export default function HitoCaseStudy() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <main id="contenido" tabIndex={-1} className="page-container">
      <Link href="/proyectos" className="text-link mt-6 text-label">{content.back}</Link>
      <header className="py-8 lg:py-12">
        <div className="grid gap-6 md:grid-cols-12 md:gap-gutter">
          <div className="md:col-span-4">
            <ViewTransition name="case-title-hito" share="case-morph" default="none"><h1 className="text-display case-title">{content.title}</h1></ViewTransition>
            <p className="mt-3 text-label text-muted">{content.kind}</p>
          </div>
          <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
            <p className="max-w-measure text-heading text-balance">{content.subtitle}</p>
            <p className="mt-4 max-w-measure text-muted">{content.introduction}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {hito.demo && <a className="button" href={hito.demo.href} target="_blank" rel="noopener noreferrer">{hito.demo.label}<span className="sr-only"> (se abre en otra pestaña)</span><Icon name="external" /></a>}
              {hito.repository && <a className="button button-secondary" href={hito.repository.href}>{content.repositoryLabel}<Icon name="external" /></a>}
            </div>
          </div>
        </div>
        <div className="mt-10 md:mt-14">
          <Showcase
            url="hito-one.vercel.app"
            motion="sello"
            wide
            priority
            back={{ name: "hito-panel", alt: "" }}
            front={{ name: "hito-landing", alt: "Landing de Hito: carpeta coral con el titular «Lo que acordaste, asentado.» y una hoja de hitos que se puede aprobar." }}
            phone={{ name: "hito-cliente", alt: "Vista del cliente en el celular: hitos con sus sellos y el botón Aprobar entrega." }}
            caption="Capturas reales de la demo: landing, panel de cobros y la vista que recibe el cliente."
          />
        </div>
      </header>
      <div className="grid lg:grid-cols-12 lg:gap-gutter">
        <aside className="border-t border-border py-6 lg:col-span-3 lg:py-section">
          <nav aria-label={content.contentsLabel} className="case-index">
            <p className="mb-3 font-medium">{content.contentsLabel}</p>
            <ul className="flex flex-wrap gap-x-4 lg:block">
              {content.navigation.map(item => <li key={item.id}><a className="text-link text-label" href={`#${item.id}`}>{item.label}</a></li>)}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 lg:col-span-9">
          <CaseSection id="problema" title={content.problem.title}>
            <p className="case-copy">{content.problem.text}</p>
            <p className="case-copy mt-4">{content.problem.objective}</p>
            {hito.contribution && <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-title">{content.problem.contributionTitle}</h3>
              <p className="case-copy mt-3">{hito.contribution.text}</p>
            </div>}
            <SourceLinks sources={content.problem.evidence} />
          </CaseSection>
          <CaseSection id="recorrido" title={content.journey.title}>
            <p className="case-copy">{content.journey.text}</p>
            <div className="mt-8"><SequenceList label={content.journey.title} steps={content.journey.steps} /></div>
            <SourceLinks sources={content.journey.evidence} />
          </CaseSection>
          <CaseSection id="reglas" title={content.rules.title}>
            <p className="case-copy">{content.rules.text}</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-gutter">
              <div><h3 className="mb-4 text-title">Proyecto</h3><SequenceList label="Estados del proyecto" steps={content.rules.project} /></div>
              <div><h3 className="mb-4 text-title">Hito</h3><SequenceList label="Estados de un hito" steps={content.rules.milestone} /></div>
            </div>
            <SourceLinks sources={content.rules.evidence} />
          </CaseSection>
          <CaseSection id="arquitectura" title={content.architecture.title}>
            <p className="case-copy">{content.architecture.text}</p>
            <div className="mt-8"><SequenceList label="Capas de la solicitud" steps={content.architecture.steps} code /></div>
            <h3 className="mt-10 mb-4 text-title">{content.architecture.pipelineTitle}</h3>
            <SequenceList label={content.architecture.pipelineTitle} steps={content.architecture.pipeline} code />
            <SourceLinks sources={content.architecture.evidence} />
          </CaseSection>
          <CaseSection id="decisiones" title={content.decisions.title}>
            <div className="divide-y divide-border">
              {hito.technicalDecisions.map(item => <article key={item.decision} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-title">{item.decision}</h3>
                <dl className="mt-4 grid gap-4 md:grid-cols-2 md:gap-gutter">
                  <div><dt className="font-medium">{content.decisions.rationaleLabel}</dt><dd className="mt-2 text-muted">{item.rationale}</dd></div>
                  <div><dt className="font-medium">{content.decisions.tradeoffLabel}</dt><dd className="mt-2 text-muted">{item.tradeoffs.join(" ")}</dd></div>
                </dl>
              </article>)}
            </div>
            <SourceLinks sources={[hitoSources.decisions]} />
          </CaseSection>
          <CaseSection id="pruebas" title={content.testing.title}>
            <p className="case-copy">{content.testing.text}</p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {content.testing.checks.map(check => <div key={check.title} className="grid gap-2 py-4 md:grid-cols-3 md:gap-gutter">
                <dt className="font-medium">{check.title}</dt><dd className="text-muted md:col-span-2">{check.detail}</dd>
              </div>)}
            </dl>
            <SourceLinks sources={content.testing.evidence} />
          </CaseSection>
          <CaseSection id="limites" title={content.limits.title}>
            <ul className="case-copy list-disc space-y-2 pl-5">{content.limits.items.map(item => <li key={item}>{item}</li>)}</ul>
            <SourceLinks sources={content.limits.evidence} />
          </CaseSection>
        </div>
      </div>
    </main>
    <section className="page-container hangar-closing" aria-label="Siguiente paso">
      <h2 className="max-w-measure text-heading">{content.closing.title}</h2>
      <p className="mt-4 max-w-measure text-muted">{content.closing.text}</p>
      <div className="project-actions">
        <Link className="cta-link" href="/contacto">{content.closing.action}<span className="button-arrow" aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/proyectos">{content.back}</Link>
      </div>
    </section>
    <SiteFooter />
  </>;
}

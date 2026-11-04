import Link from "next/link";
import type { Metadata } from "next";
import { CodeExcerpt } from "@/components/code-excerpt";
import { hangarSnippets } from "@/content/hangar-snippets";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/portfolio";
import { FlowDiagram, IsolationDiagram } from "@/components/hangar-diagrams";
import { Icon } from "@/components/ui";
import { hangarCaseStudy as content, hangarSources } from "@/content/hangar-case-study";
import { hangar } from "@/content/projects";
import { profile } from "@/content/profile";
import { portfolioLabels } from "@/content/site";

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || null;
const caseUrl = publicSiteUrl ? `${publicSiteUrl}${content.href}` : null;

export const metadata: Metadata = {
  metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : null,
  title: `Hangar · Caso de estudio · ${profile.name}`,
  description: content.introduction,
  alternates: { canonical: caseUrl },
  openGraph: {
    title: `Hangar · Caso de estudio · ${profile.name}`,
    description: content.introduction,
    type: "article",
    url: caseUrl ?? undefined,
    images: publicSiteUrl ? [{ url: `${publicSiteUrl}/og-hangar.svg`, width: 1200, height: 630, alt: `Caso de estudio: Hangar` }] : [],
  },
  twitter: {
    card: "summary_large_image",
    creator: null,
    title: `Hangar · Caso de estudio · ${profile.name}`,
    description: content.introduction,
    images: publicSiteUrl ? [`${publicSiteUrl}/og-hangar.svg`] : [],
  },
};

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="portfolio-section">
    <h2 id={`${id}-title`} className="max-w-measure text-heading">{title}</h2>
    <div className="mt-6">{children}</div>
  </section>;
}

function SourceLinks({ sources }: { sources: readonly { label: string; source: string }[] }) {
  return <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-label">
    {sources.map((source) => <a key={source.source} className="text-link" href={source.source}>
      <span className="sr-only">{content.sources.label}: </span>{source.label}<Icon name="external" />
    </a>)}
  </div>;
}

function Configuration({ items }: { items: readonly { label: string; value: string }[] }) {
  return <dl className="mt-4 divide-y divide-border border-y border-border">
    {items.map((item) => <div key={item.label} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3">
      <dt className="text-muted">{item.label}</dt>
      <dd className="font-mono tabular-nums">{item.value}</dd>
    </div>)}
  </dl>;
}

export default function HangarCaseStudy() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader homeLinks />
    <main id="contenido" tabIndex={-1} className="page-container hangar-case">
      <Link href="/#proyectos" className="text-link mt-6 text-label">{content.back}</Link>
      <header className="py-8 lg:py-12">
        <div className="grid gap-6 md:grid-cols-12 md:gap-gutter">
          <div className="md:col-span-4">
            <h1 className="text-display">{content.title}</h1>
            <p className="mt-3 text-label text-muted">{content.kind}</p>
          </div>
          <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
            <p className="max-w-measure text-heading text-balance">{content.subtitle}</p>
            <p className="mt-4 max-w-measure text-muted">{content.introduction}</p>
            <ul className="technology-line" aria-label="Stack de Hangar">{content.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {hangar.repository?.visibility === "public" ? <a className="button" href={hangar.repository.href}>{content.repositoryLabel}<Icon name="external" /></a> : <p className="text-label text-muted">{hangar.repository?.visibility === "private" ? content.repositoryPrivate : content.repositoryUnavailable}</p>}
              {hangar.demo ? <a className="text-link" href={hangar.demo.href}>{hangar.demo.label}<Icon name="external" /></a> : <p className="text-label text-muted">{content.demoUnavailable}</p>}
            </div>
          </div>
        </div>

      </header>
      <div className="grid lg:grid-cols-12 lg:gap-gutter">
        <aside className="border-t border-border py-6 lg:col-span-3 lg:py-section">
          <nav aria-label={content.contentsLabel} className="case-index">
            <p className="mb-3 font-medium">{content.contentsLabel}</p>
            <ul className="flex flex-wrap gap-x-4 lg:block">
              {content.navigation.map((item) => <li key={item.id}><a className="text-link text-label" href={`#${item.id}`}>{item.label}</a></li>)}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 lg:col-span-9">
          <CaseSection id="problema" title={content.problem.title}>
            <p className="case-copy">{content.problem.text}</p>
            <p className="case-copy mt-4">{content.problem.objective}</p>
            <p className="case-copy mt-4">{content.problem.audience}</p>
            <SourceLinks sources={content.problem.evidence} />
          </CaseSection>
          <CaseSection id="funcionamiento" title={content.operation.title}>
            <p className="case-copy">{content.operation.text}</p>
            <figure aria-labelledby="pipeline-title" className="case-diagram">
              <figcaption id="pipeline-title" className="mb-6 text-title font-medium">{content.pipeline.title}</figcaption>
              <FlowDiagram label={content.pipeline.title} nodes={content.pipeline.steps} code />
              <p className="mt-6 max-w-measure text-label text-muted">{content.pipeline.caption}</p>
            </figure>
            <SourceLinks sources={content.operation.evidence} />
          </CaseSection>
          <CaseSection id="arquitectura" title={content.architecture.title}>
            <p className="case-copy">{content.architecture.text}</p>
            <figure aria-labelledby="architecture-diagram-title" className="case-diagram">
              <figcaption id="architecture-diagram-title" className="mb-6 font-medium">{content.architecture.controlTitle}</figcaption>
              <ArchitectureDiagram id="hangar-control" label={content.architecture.controlTitle} nodes={content.architecture.control} />
              <h3 className="mt-8 mb-6 font-medium">{content.architecture.routingTitle}</h3>
              <ArchitectureDiagram id="hangar-routing" label={content.architecture.routingTitle} nodes={content.architecture.routing} />
              <p className="mt-6 max-w-measure text-label text-muted">{content.architecture.caption}</p>
            </figure>
            <h3 className="mt-6 text-title">{content.architecture.persistenceTitle}</h3>
            <p className="case-copy mt-3">{content.architecture.persistence}</p>
            <SourceLinks sources={content.architecture.evidence} />
          </CaseSection>
          <CaseSection id="workflow" title={content.workflow.title}>
            <p className="case-copy">{content.workflow.text}</p>
            <div className="case-diagram"><FlowDiagram label={content.workflow.statesLabel} nodes={content.workflow.states} code /></div>
            <h3 className="mt-8 text-title">{content.workflow.configurationTitle}</h3>
            <Configuration items={content.workflow.configuration} />
            <p className="mt-3 text-label text-muted">{content.workflow.configurationNote}</p>
            <p className="case-copy mt-6">{content.workflow.failure}</p>
            <CodeExcerpt excerpt={hangarSnippets.workflow} />
            <h3 className="mt-8 text-title">{content.workflow.limitTitle}</h3>
            <p className="case-copy mt-3">{content.workflow.limit}</p>
            <SourceLinks sources={content.workflow.evidence} />
          </CaseSection>
          <CaseSection id="aislamiento" title={content.isolation.title}>
            <p className="case-copy">{content.isolation.text}</p>
            <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
              <IsolationDiagram />
              <div><h3 className="text-title">{content.isolation.resourcesTitle}</h3>
                <Configuration items={content.isolation.resources} />
                <p className="mt-3 text-label text-muted">{content.isolation.resourcesNote}</p>
              </div>
            </div>
            <CodeExcerpt excerpt={hangarSnippets.container} />
            <div className="mt-8">
              <h3 className="text-title">{content.isolation.limitTitle}</h3>
              <p className="case-copy mt-3">{content.isolation.limit}</p>
            </div>
            <SourceLinks sources={content.isolation.evidence} />
          </CaseSection>
          <CaseSection id="logs" title={content.logs.title}>
            <p className="case-copy">{content.logs.text}</p>
            <figure aria-labelledby="logs-diagram-title" className="case-diagram">
              <figcaption id="logs-diagram-title" className="mb-6 font-medium">{content.logs.liveTitle}</figcaption>
              <FlowDiagram label={content.logs.liveTitle} nodes={content.logs.live} />
              <h3 className="mt-8 mb-6 font-medium">{content.logs.historyTitle}</h3>
              <FlowDiagram label={content.logs.historyTitle} nodes={content.logs.history} />
              <p className="mt-6 max-w-measure text-label text-muted">{content.logs.caption}</p>
            </figure>
            <h3 className="mt-8 text-title">{content.logs.limitTitle}</h3>
            <p className="case-copy mt-3">{content.logs.limit}</p>
            <CodeExcerpt excerpt={hangarSnippets.websocket} />
            <SourceLinks sources={content.logs.evidence} />
          </CaseSection>
          <CaseSection id="decisiones" title={content.decisions.title}>
            <div className="divide-y divide-border">
              {content.decisions.items.map((item) => <article key={item.title} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-title">{item.title}</h3>
                <dl className="mt-4 grid max-w-measure gap-4">
                  <div><dt className="font-medium">{content.decisions.rationaleLabel}</dt><dd className="mt-2 text-muted">{item.reason}</dd></div>
                  <div><dt className="font-medium">{content.decisions.alternativeLabel}</dt><dd className="mt-2 text-muted">{item.alternative}</dd></div>
                  <div><dt className="font-medium">{content.decisions.tradeoffLabel}</dt><dd className="mt-2 text-muted">{item.tradeoff}</dd></div>
                </dl>
                <SourceLinks sources={item.evidence} />
              </article>)}
            </div>
          </CaseSection>
          <CaseSection id="testing" title={content.testing.title}>
            <p className="case-copy">{content.testing.text}</p>
            <dl className="mt-6 max-w-measure divide-y divide-border border-y border-border">
              {content.testing.checks.map((check) => <div key={check.title} className="grid gap-2 py-4">
                <dt className="font-medium">{check.title}</dt><dd className="text-muted">{check.detail}</dd>
              </div>)}
            </dl>
            <p className="mt-6 font-medium">{content.testing.status}</p>
            <p className="case-copy mt-3">{content.testing.prerequisite}</p>
            <p className="case-copy mt-4">{content.testing.commandLabel}: <code className="case-test-command">{content.testing.command}</code></p>
            <p className="case-copy mt-3">{content.testing.result}</p>
            <SourceLinks sources={content.testing.evidence} />
          </CaseSection>
          <CaseSection id="limites" title={content.limits.title}>
            <h3 className="text-title">{content.limits.implementedLabel}</h3>
            <ul className="case-limit-list">{content.limits.implemented.map(item => <li key={item}>{item}</li>)}</ul>
            <h3 className="mt-8 text-title">{content.limits.plannedLabel}</h3>
            <ul className="case-limit-list">{content.limits.planned.map(item => <li key={item}>{item}</li>)}</ul>
            <SourceLinks sources={content.limits.evidence} />
          </CaseSection>
          <CaseSection id="fuentes" title={content.sources.title}>
            <p className="case-copy">{content.sources.description}</p>
            <details className="project-details">
              <summary>{content.sources.toggle}</summary>
              <ul className="pb-4">{Object.values(hangarSources).map((source) => <li key={source.source}><a className="text-link" href={source.source}>{source.label}<Icon name="external" /></a></li>)}</ul>
            </details>
          </CaseSection>
        </div>
      </div>
    </main>
    <footer className="page-container hangar-closing">
      <h2 className="max-w-measure text-heading">{content.closing.title}</h2>
      <p className="mt-4 max-w-measure text-muted">{content.closing.text}</p>
      <div className="project-actions">
        {hangar.repository?.visibility === "public" && <a className="text-link" href={hangar.repository.href}>{content.closing.repositoryAction}<Icon name="external" /></a>}
        <Link className="text-link" href={content.closing.otherCase.href}>{content.closing.otherCase.label}<Icon name="arrow" /></Link>
        <Link className="text-link" href="/#contacto">{content.closing.action}<Icon name="arrow" /></Link>
      </div>
    </footer>
  </>;
}

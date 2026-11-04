import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/portfolio";
import { TaskFlowDiagram, ObservabilityStack, SecurityStack } from "@/components/taskflow-diagrams";
import { Icon } from "@/components/ui";
import { taskFlowCaseStudy as content, taskFlowSources } from "@/content/taskflow-case-study";
import { taskFlowPro } from "@/content/projects";
import { profile } from "@/content/profile";
import { portfolioLabels, siteMetadata } from "@/content/site";

export const metadata = {
  title: `TaskFlow Pro · Caso de estudio · ${profile.name}`,
  description: content.introduction,
  alternates: {
    canonical: `${siteMetadata.siteUrl}/proyectos/taskflow-pro`,
  },
  openGraph: {
    title: `TaskFlow Pro · Caso de estudio · ${profile.name}`,
    description: content.introduction,
    type: "website",
    url: `${siteMetadata.siteUrl}/proyectos/taskflow-pro`,
    images: [
      {
        url: `${siteMetadata.siteUrl}/og-taskflow.svg`,
        width: 1200,
        height: 630,
        alt: `Caso de estudio: TaskFlow Pro`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `TaskFlow Pro · Caso de estudio · ${profile.name}`,
    description: content.introduction,
    images: [`${siteMetadata.siteUrl}/og-image.png`],
  },
} as const;

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

export default function TaskFlowCaseStudy() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader homeLinks />
    <main id="contenido" tabIndex={-1} className="page-container">
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
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {taskFlowPro.repository && <a className="button" href={taskFlowPro.repository.href}>{content.repositoryLabel}<Icon name="external" /></a>}
              {taskFlowPro.demo ? <a className="text-link" href={taskFlowPro.demo.href}>{taskFlowPro.demo.label}<Icon name="external" /></a> : <p className="text-label text-muted">{content.demoUnavailable}</p>}
            </div>
          </div>
        </div>
        <figure aria-labelledby="overview-title" className="mt-8 border-y border-border bg-surface px-4 py-6 md:mt-12 md:px-6">
          <figcaption id="overview-title" className="mb-6 text-title font-medium">{content.overview.title}</figcaption>
          <TaskFlowDiagram label={content.overview.title} nodes={content.overview.steps} code />
          <p className="mt-6 max-w-measure text-label text-muted">{content.overview.caption}</p>
        </figure>
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
            {taskFlowPro.contribution && <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-title">{content.problem.contributionTitle}</h3>
              <p className="case-copy mt-3">{taskFlowPro.contribution.text}</p>
            </div>}
            <SourceLinks sources={content.problem.evidence} />
          </CaseSection>
          <CaseSection id="arquitectura" title={content.architecture.title}>
            <p className="case-copy">{content.architecture.text}</p>
            <figure aria-labelledby="request-diagram-title" className="case-diagram">
              <figcaption id="request-diagram-title" className="mb-6 font-medium">{content.architecture.requestTitle}</figcaption>
              <ArchitectureDiagram id="taskflow-request" label={content.architecture.requestTitle} nodes={content.architecture.request} />
              <h3 className="mt-8 mb-6 font-medium">{content.architecture.automationTitle}</h3>
              <ArchitectureDiagram id="taskflow-automation" label={content.architecture.automationTitle} nodes={content.architecture.automation} />
              <p className="mt-6 max-w-measure text-label text-muted">{content.architecture.caption}</p>
            </figure>
            <h3 className="mt-6 text-title">{content.architecture.modelTitle}</h3>
            <p className="case-copy mt-3">{content.architecture.model}</p>
            <SourceLinks sources={content.architecture.evidence} />
          </CaseSection>
          <CaseSection id="realtime" title={content.realtime.title}>
            <p className="case-copy">{content.realtime.text}</p>
            <div className="case-diagram"><TaskFlowDiagram label={content.realtime.publishTitle} nodes={content.realtime.publish} code /></div>
            <h3 className="mt-8 text-title">{content.realtime.authTitle}</h3>
            <p className="case-copy mt-3">{content.realtime.auth}</p>
            <div className="mt-8 p-6">
              <h3 className="text-title">{content.realtime.limitTitle}</h3>
              <p className="case-copy mt-3">{content.realtime.limit}</p>
            </div>
            <SourceLinks sources={content.realtime.evidence} />
          </CaseSection>
          <CaseSection id="automatizaciones" title={content.automations.title}>
            <p className="case-copy">{content.automations.text}</p>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-title">{content.automations.layer1Title}</h3>
                <p className="case-copy mt-3">{content.automations.layer1}</p>
              </div>
              <div>
                <h3 className="text-title">{content.automations.layer2Title}</h3>
                <p className="case-copy mt-3">{content.automations.layer2}</p>
              </div>
              <div>
                <h3 className="text-title">{content.automations.layer3Title}</h3>
                <p className="case-copy mt-3">{content.automations.layer3}</p>
              </div>
            </div>
            <div className="case-diagram">
              <TaskFlowDiagram label={content.automations.flowLabel} nodes={content.automations.flow} code />
            </div>
            <h3 className="mt-8 text-title">{content.automations.workersTitle}</h3>
            <Configuration items={content.automations.workers} />
            <p className="mt-3 text-label text-muted">{content.automations.workersNote}</p>
            <div className="mt-8 p-6">
              <h3 className="text-title">{content.automations.limitTitle}</h3>
              <p className="case-copy mt-3">{content.automations.limit}</p>
            </div>
            <SourceLinks sources={content.automations.evidence} />
          </CaseSection>
          <CaseSection id="observabilidad" title={content.observability.title}>
            <p className="case-copy">{content.observability.text}</p>
            <div className="mt-8">
              <ObservabilityStack />
            </div>
            <div className="mt-8 p-6">
              <h3 className="text-title">{content.observability.limitTitle}</h3>
              <p className="case-copy mt-3">{content.observability.limit}</p>
            </div>
            <SourceLinks sources={content.observability.evidence} />
          </CaseSection>
          <CaseSection id="seguridad" title={content.security.title}>
            <p className="case-copy">{content.security.text}</p>
            <div className="mt-8">
              <SecurityStack />
            </div>
            <h3 className="mt-8 text-title">{content.security.oauthTitle}</h3>
            <p className="case-copy mt-3">{content.security.oauth}</p>
            <div className="mt-8 p-6">
              <h3 className="text-title">{content.security.limitTitle}</h3>
              <p className="case-copy mt-3">{content.security.limit}</p>
            </div>
            <SourceLinks sources={content.security.evidence} />
          </CaseSection>
          <CaseSection id="decisiones" title={content.decisions.title}>
            <div className="divide-y divide-border">
              {content.decisions.items.map((item) => <article key={item.title} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-title">{item.title}</h3>
                <dl className="mt-4 grid gap-4 md:grid-cols-2 md:gap-gutter">
                  <div><dt className="font-medium">{content.decisions.rationaleLabel}</dt><dd className="mt-2 text-muted">{item.reason}</dd></div>
                  <div><dt className="font-medium">{content.decisions.tradeoffLabel}</dt><dd className="mt-2 text-muted">{item.tradeoff}</dd></div>
                </dl>
              </article>)}
            </div>
            <SourceLinks sources={[taskFlowSources.architecture, taskFlowSources.server, taskFlowSources.socket]} />
          </CaseSection>
          <CaseSection id="testing" title={content.testing.title}>
            <p className="case-copy">{content.testing.text}</p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {content.testing.checks.map((check) => <div key={check.title} className="grid gap-2 py-4 md:grid-cols-3 md:gap-gutter">
                <dt className="font-medium">{check.title}</dt><dd className="text-muted md:col-span-2">{check.detail}</dd>
              </div>)}
            </dl>
            <p className="mt-6 font-medium">{content.testing.status}</p>
            <p className="case-copy mt-3">{content.testing.result}</p>
            <SourceLinks sources={content.testing.evidence} />
          </CaseSection>
          <CaseSection id="fuentes" title={content.sources.title}>
            <p className="case-copy">{content.sources.description}</p>
            <details className="project-details">
              <summary>{content.sources.toggle}</summary>
              <ul className="pb-4">{Object.values(taskFlowSources).map((source) => <li key={source.source}><a className="text-link" href={source.source}>{source.label}<Icon name="external" /></a></li>)}</ul>
            </details>
          </CaseSection>
        </div>
      </div>
    </main>
    <footer className="contact-surface py-section">
      <div className="page-container grid gap-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:col-span-8"><h2 className="max-w-measure text-heading">{content.closing.title}</h2><p className="mt-4 max-w-measure">{content.closing.text}</p></div>
        <div className="flex flex-wrap items-start gap-x-6 md:col-span-4 md:justify-end"><Link className="inverse-link" href="/#contacto">{content.closing.action}<Icon name="arrow" /></Link><Link className="inverse-link" href="/#proyectos">{content.back}</Link></div>
      </div>
    </footer>
  </>;
}

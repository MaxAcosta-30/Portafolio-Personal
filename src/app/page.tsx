import Link from "next/link";
import { Fragment } from "react";
import { HomeMotion } from "@/components/home-motion";
import { DeployConsole } from "@/components/deploy-console";
import { SyncBoard } from "@/components/sync-board";
import { SiteHeader } from "@/components/portfolio";
import { Icon } from "@/components/ui";
import { LinkPreferenciasCookies } from "@/components/cookie-consent";
import { CopyEmail } from "@/components/copy-email";
import type { SourcedLink } from "@/content/types";
import { contact, experience, profile, resume } from "@/content/profile";
import { engineeringSystems, featuredCaseStudies, projects } from "@/content/projects";
import { homepage, portfolioLabels, siteMetadata } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import { hangarCaseStudy } from "@/content/hangar-case-study";
import { projectPreviews } from "@/content/project-previews";
import "./home.css";

export const metadata = {
  title: { absolute: `${profile.name} · ${profile.role}` },
  description: profile.introduction.text,
  alternates: {
    canonical: `${siteMetadata.siteUrl}/`,
  },
  openGraph: {
    title: `${profile.name} · ${profile.role}`,
    description: profile.introduction.text,
    type: "website",
    url: `${siteMetadata.siteUrl}/`,
    images: [
      {
        url: `${siteMetadata.siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: `${profile.name} · Portafolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description: profile.introduction.text,
    images: [`${siteMetadata.siteUrl}/og-image.svg`],
  },
} as const;

function RepositoryLink({ repository, name }: { repository: SourcedLink | null; name: string }) {
  if (!repository || repository.visibility !== "public") return <span className="repository-status">{repository?.visibility === "private" ? "Repositorio privado" : "Repositorio no disponible"}</span>;
  return <a className="text-link row-secondary" href={repository.href}>Ver repositorio<span className="sr-only"> de {name}</span><Icon name="external" /></a>;
}

function CodeWell({ id, name }: { id: keyof typeof projectPreviews; name: string }) {
  const preview = projectPreviews[id];
  return <figure className="code-well">
    <figcaption><a className="row-secondary" href={preview.source}><span className="sr-only">Archivo fuente: </span>{preview.file}</a><span>{preview.language} · líneas {preview.startLine}–{preview.endLine}</span></figcaption>
    <pre tabIndex={0} aria-label={`Código de ${name}: ${preview.file}. Desplazamiento horizontal con las flechas del teclado.`}><code>{preview.code}</code></pre>
  </figure>;
}

/** Visual de Hangar: la política de reintentos real convertida en lectura de instrumentos. */
function HangarVisual() {
  const { configuration, configurationNote, states } = hangarCaseStudy.workflow;
  return <div className="case-visual" data-spotlight>
    <dl className="gauges">{configuration.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    <ol className="state-track" aria-label="Estados de un despliegue">{states.map(state => <li key={state.title}><span>{state.title}</span>{state.detail}</li>)}</ol>
    <p className="visual-note">{configurationNote}</p>
    <CodeWell id="hangar" name="Hangar" />
  </div>;
}

function TaskFlowVisual() {
  return <div className="case-visual">
    <SyncBoard />
    <CodeWell id="taskflow-pro" name="TaskFlow Pro" />
  </div>;
}

export default function Home() {
  const featured = featuredCaseStudies.filter(project => project.status !== "draft");
  const systems = engineeringSystems.filter(project => project.status === "ready");
  const ticker = content.services.items.map(service => service.title);
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader compact />
    <HomeMotion />
    <main id="contenido" tabIndex={-1} className="home-content">
      <section className="hero page-container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">{content.headline.split(" ").map((word, index) => <Fragment key={index}>{index > 0 && " "}<span className="word"><span>{word}</span></span></Fragment>)}</h1>
          <p className="hero-introduction">{content.introduction}</p>
          <div className="hero-actions">
            <a className="button" href={`#${homepage.hero.primaryAction.sectionId}`}>{homepage.hero.primaryAction.label}<Icon name="arrow" /></a>
            <a className="text-link" href={`#${homepage.hero.secondaryAction.sectionId}`}>{homepage.hero.secondaryAction.label}<Icon name="arrow" /></a>
          </div>
        </div>
        <DeployConsole caseHref={content.cases.hangar} />
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1].map(copy => <span key={copy}>{ticker.map(item => <Fragment key={item}>{item}<i /></Fragment>)}</span>)}</div></div>

      <section id="servicios" className="home-section services page-container" aria-labelledby="servicios-title">
        <header className="section-head"><h2 id="servicios-title">{content.services.title}</h2><p>{content.services.description}</p></header>
        <ol className="service-list">{content.services.items.map(service => <li key={service.title}>
          <span className="service-light" aria-hidden="true" />
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <div className="service-proof"><span>{content.services.proofLabel}</span><ul>
            {service.proof.map(id => projects.find(project => project.id === id)).filter(project => project !== undefined).map(project => <li key={project.id}><a className="text-link" href={`#${project.id}`}>{project.name}</a></li>)}
            {"note" in service && <li>{service.note}</li>}
          </ul></div>
        </li>)}</ol>
      </section>

      <section id="proyectos" className="home-section cases page-container" aria-labelledby="casos-title">
        <header className="section-head"><h2 id="casos-title">{content.casesTitle}</h2><p>{content.casesDescription}</p></header>
        {featured.map(project => {
          const caseHref = content.cases[project.id as keyof typeof content.cases];
          return <article id={project.id} key={project.id} className="featured-row project-row t-learn">
            <div className="featured-copy">
              <h3 aria-label={project.name}>{caseHref ? <Link className="row-primary" href={caseHref} aria-label={`${content.caseLink} de ${project.name}`}>{project.name}<span className="t-learn-chevron"><Icon name="arrow" /></span></Link> : project.name}</h3>
              {project.summary && <p className="project-description">{project.summary.text}</p>}
              <dl className="featured-facts">
                {project.problem && <div><dt>{content.caseProblem}</dt><dd>{project.problem.text}</dd></div>}
                {project.contribution && <div><dt>{portfolioLabels.contribution}</dt><dd>{project.contribution.text}</dd></div>}
              </dl>
              <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
              <div className="project-actions"><span className="case-action" aria-hidden={caseHref ? true : undefined}>{caseHref ? content.caseLink : "Próximamente"}{caseHref && <Icon name="arrow" />}</span><RepositoryLink repository={project.repository} name={project.name} /></div>
            </div>
            {project.id === "hangar" ? <HangarVisual /> : <TaskFlowVisual />}
          </article>;
        })}
      </section>

      <section id="sistemas-backend" className="home-section registry page-container" aria-labelledby="sistemas-title">
        <header className="section-head"><h2 id="sistemas-title">{content.systemsTitle}</h2><p>{content.systemsDescription}</p></header>
        <ul className="registry-list">{systems.map(project => <li id={project.id} key={project.id} className="registry-row">
          <h3>{project.name}</h3>
          <p className="registry-focus">{project.engineeringFocus?.text ?? project.summary?.text}</p>
          {project.summary && project.engineeringFocus && <p className="registry-summary">{project.summary.text}</p>}
          <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
          <RepositoryLink repository={project.repository} name={project.name} />
        </li>)}</ul>
      </section>

      <section id="sobre-mi" className="home-section about" aria-labelledby="sobre-mi-title">
        <div className="about-band"><div className="page-container">
          <h2 id="sobre-mi-title" className="sr-only">{content.about.title}</h2>
          <p className="about-statement">{content.about.paragraphs[1].text}</p>
        </div></div>
        <div className="about-grid page-container">
          <div className="about-intro">
            <p className="about-label">{content.about.title}</p>
            <div className="about-copy">{[content.about.paragraphs[0], content.about.paragraphs[2]].map(paragraph => <p key={paragraph.text}>{paragraph.text}</p>)}{resume.file && <a className="text-link" href={resume.file.href} download>{resume.label}<Icon name="arrow" /></a>}</div>
          </div>
          <section id="experiencia" aria-labelledby="experiencia-title">
            <h3 id="experiencia-title" className="about-subtitle">{content.experienceTitle}</h3>
            {experience.filter(item => item.status === "ready").map(item => <article className="experience-row" key={item.organization}>
              <div><h4>{item.organization}</h4><p>{item.dates}</p></div>
              <p className="experience-role">{item.role}</p>
              {item.description && <p className="experience-description">{item.description.text}</p>}
            </article>)}
          </section>
          <section id="tecnologias" aria-labelledby="tecnologias-title">
            <h3 id="tecnologias-title" className="about-subtitle">{content.technologies.title}</h3>
            <dl className="technology-groups">{content.technologies.groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></dd></div>)}</dl>
          </section>
        </div>
      </section>

      <section id="contacto" className="home-section contact" aria-labelledby="contacto-title">
        <div className="page-container">
          <h2 id="contacto-title" className="contact-title">{content.contactTitle}</h2>
          <div className="contact-row">
            <p className="contact-description">{content.contactDescription}</p>
            <div className="contact-actions">
              {contact.email && <>
                <p className="contact-email">{contact.email.label}</p>
                <div className="contact-buttons"><a className="button" href={contact.email.href}>{portfolioLabels.emailAction}<Icon name="arrow" /></a><CopyEmail email={contact.email.label} /></div>
              </>}
              <ul className="contact-links">{contact.professionalLinks.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}<Icon name="external" /></a></li>)}</ul>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer className="home-footer page-container"><p>{profile.name}<span>{portfolioLabels.footer}</span></p><div><LinkPreferenciasCookies /><a className="text-link text-label" href="#inicio">{portfolioLabels.backToTop}</a></div></footer>
  </>;
}

import Link from "next/link";
import { ViewTransition } from "react";
import { HomeMotion } from "@/components/home-motion";
import { HeroVisual } from "@/components/hero/hero-visual";
import { Logo } from "@/components/brand/logo";
import { repositories } from "@/content/repositories";
import { SyncBoard } from "@/components/sync-board";
import { ButtonArrow, SiteHeader } from "@/components/portfolio";
import { CountUp } from "@/components/count-up";
import { ContactForm } from "@/components/contact-form";
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
        url: `${siteMetadata.siteUrl}/og-image.png`,
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
    images: [`${siteMetadata.siteUrl}/og-image.png`],
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

/** Valor numérico con contador ("10 min" cuenta hasta 10 y conserva la unidad). */
function Metric({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  return match ? <CountUp value={Number(match[1])} suffix={match[2]} /> : value;
}

/** Visual de Hangar: la política de reintentos real convertida en lectura de instrumentos. */
function HangarVisual() {
  const { configuration, configurationNote, states } = hangarCaseStudy.workflow;
  return <div className="case-visual">
    <p className="visual-head"><span className="mono-label">hangar · política de reintentos</span><span className="mono-label visual-live">temporal</span></p>
    <dl className="gauges">{configuration.map(item => <div key={item.label}><dt>{item.label}</dt><dd><Metric value={item.value} /></dd></div>)}</dl>
    <ol className="state-track" aria-label="Estados de un despliegue">{states.map(state => <li key={state.title}><span>{state.title}</span>{state.detail}</li>)}</ol>
    <p className="visual-note">{configurationNote}</p>
    <CodeWell id="hangar" name="Hangar" />
  </div>;
}

function TaskFlowVisual() {
  return <div className="case-visual">
    <p className="visual-head"><span className="mono-label">taskflow · tablero board:42</span><span className="mono-label visual-live">socket.io</span></p>
    <SyncBoard />
    <CodeWell id="taskflow-pro" name="TaskFlow Pro" />
  </div>;
}

export default function Home() {
  const featured = featuredCaseStudies.filter(project => project.status !== "draft");
  const systems = engineeringSystems.filter(project => project.status === "ready");
  const repositoryCount = Object.keys(repositories).length;
  const words = content.headline.split(" ");
  const headlineStart = words.slice(0, -1).join(" ");
  const headlineEnd = words.at(-1);
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <HomeMotion />
    <main id="contenido" tabIndex={-1} className="home-content">
      {/* Preloader: solo en la primera visita y con movimiento permitido; CSS puro, 1.2s como máximo. */}
      <div className="intro" aria-hidden="true">
        <Logo variant="draw" size={88} />
        <p className="intro-phrase"><span>compilando ideas…</span><span>desplegando…</span></p>
      </div>
      <section className="hero page-container" aria-labelledby="hero-title">
        <div className="hero-frame">
        <span className="frame-mark" data-corner="tl" aria-hidden="true">+</span><span className="frame-mark" data-corner="tr" aria-hidden="true">+</span><span className="frame-mark" data-corner="bl" aria-hidden="true">+</span><span className="frame-mark" data-corner="br" aria-hidden="true">+</span>
        <div className="hero-copy">
          <p className="hero-badge" data-step="0"><span className="pulse-dot" aria-hidden="true" /><span className="badge-long">{content.badge}</span><span className="badge-short" aria-hidden="true">{content.badgeShort}</span></p>
          <h1 id="hero-title" className="hero-title" data-step="1">{headlineStart} <em>{headlineEnd}</em></h1>
          <p className="hero-introduction" data-step="2">{content.introduction}</p>
          <div className="hero-actions" data-step="3">
            <a className="button" href={`#${homepage.hero.primaryAction.sectionId}`}>{homepage.hero.primaryAction.label}<ButtonArrow /></a>
            <a className="button button-secondary" href={`#${homepage.hero.secondaryAction.sectionId}`}>{homepage.hero.secondaryAction.label}<ButtonArrow /></a>
          </div>
          <dl className="hero-metrics" data-step="4">
            <div><dt>proyectos en GitHub</dt><dd><CountUp value={repositoryCount} /></dd></div>
            <div><dt>casos documentados</dt><dd><CountUp value={featured.length} /></dd></div>
            <div><dt>stack principal</dt><dd className="metric-text">{content.mainStack}</dd></div>
          </dl>
        </div>
        <HeroVisual />
        </div>
      </section>

      <section id="servicios" className="services-strip" aria-labelledby="servicios-title">
        <h2 id="servicios-title" className="sr-only">{content.services.title}</h2>
        <ol className="page-container">{content.services.items.map((service, index) => <li key={service.title}>
          <span className="strip-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <div className="strip-proof"><span>{content.services.proofLabel}</span><ul>{service.proof.map(id => projects.find(project => project.id === id)).filter(project => project !== undefined).map(project => <li key={project.id}><a href={`#${project.id}`}>{project.name}</a></li>)}</ul></div>
        </li>)}</ol>
      </section>

      {/* Proyectos: editorial alternado, copy + panel técnico vivo. */}
      <section id="proyectos" className="home-section cases page-container" aria-labelledby="casos-title">
        <header className="section-head split-head"><h2 id="casos-title">{content.casesTitle}</h2><p>{content.casesDescription}</p></header>
        {featured.map((project, index) => {
          const caseHref = content.cases[project.id as keyof typeof content.cases];
          return <article id={project.id} key={project.id} className="featured-row project-row t-learn">
            <div className="featured-copy">
              <div className="case-meta"><Logo size={34} className="case-logo" /><span className="mono-label">Caso {String(index + 1).padStart(2, "0")}</span></div>
              <h3 aria-label={project.name}>{caseHref ? <Link className="row-primary" href={caseHref} aria-label={`${content.caseLink} de ${project.name}`}><ViewTransition name={`case-title-${project.id}`} share="case-morph" default="none"><span className="case-title-text">{project.name}</span></ViewTransition><span className="t-learn-chevron"><Icon name="arrow" /></span></Link> : project.name}</h3>
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

      {/* Otros sistemas: tabla densa con cabecera, no tarjetas. */}
      <section id="sistemas-backend" className="home-section registry page-container" aria-labelledby="sistemas-title">
        <header className="section-head"><h2 id="sistemas-title">{content.systemsTitle}</h2><p>{content.systemsDescription}</p></header>
        <div className="registry-head" aria-hidden="true"><span>Sistema</span><span>Decisión técnica</span><span>Stack</span><span>Código</span></div>
        <ul className="registry-list">{systems.map(project => <li id={project.id} key={project.id} className="registry-row">
          <h3>{project.name}</h3>
          <div className="registry-body">
            <p className="registry-focus">{project.engineeringFocus?.text ?? project.summary?.text}</p>
            {project.summary && project.engineeringFocus && <p className="registry-summary">{project.summary.text}</p>}
          </div>
          <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
          <RepositoryLink repository={project.repository} name={project.name} />
        </li>)}</ul>
      </section>

      {/* Proceso: línea de tiempo que se llena con el scroll. */}
      <section id="proceso" className="home-section process" aria-labelledby="proceso-title">
        <div className="page-container">
          <header className="section-head"><h2 id="proceso-title">{content.process.title}</h2><p>{content.process.description}</p></header>
          <ol className="process-list">
            <span className="process-rail" aria-hidden="true"><span /></span>
            {content.process.steps.map((step, index) => <li key={step.title}><span className="process-node mono-label" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
          </ol>
        </div>
      </section>

      {/* Sobre mí: titular + bio arriba; experiencia y tecnologías en una retícula de 3. */}
      <section id="sobre-mi" className="home-section about page-container" aria-labelledby="sobre-mi-title">
        <div className="about-top">
          <h2 id="sobre-mi-title">{content.about.title}</h2>
          <div className="about-copy">
            <p className="about-lead">{content.about.paragraphs[1].text}</p>
            {[content.about.paragraphs[0], content.about.paragraphs[2]].map(paragraph => <p key={paragraph.text}>{paragraph.text}</p>)}
            {resume.file && <a className="text-link" href={resume.file.href} download>{resume.label}<Icon name="arrow" /></a>}
          </div>
        </div>
        <div className="about-grid">
          <section id="experiencia" aria-labelledby="experiencia-title">
            <h3 id="experiencia-title" className="mono-label about-subtitle">{content.experienceTitle}</h3>
            {experience.filter(item => item.status === "ready").map(item => <article className="experience-row" key={item.organization}>
              <div><h4>{item.organization}</h4><p>{item.dates}</p></div>
              <p className="experience-role">{item.role}</p>
              {item.description && <p className="experience-description">{item.description.text}</p>}
            </article>)}
          </section>
          <section id="tecnologias" aria-labelledby="tecnologias-title">
            <h3 id="tecnologias-title" className="mono-label about-subtitle">{content.technologies.title}</h3>
            <dl className="technology-groups">{content.technologies.groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></dd></div>)}</dl>
          </section>
        </div>
      </section>

      {/* Contacto: el formulario es la acción principal; el correo queda como alternativa. */}
      <section id="contacto" className="home-section contact" aria-labelledby="contacto-title">
        <div className="page-container contact-inner">
          <div className="contact-intro">
            <p className="hero-badge"><span className="pulse-dot" aria-hidden="true" />{content.badgeShort}</p>
            <h2 id="contacto-title" className="contact-title">{content.contactTitle}</h2>
            <p className="contact-description">{content.contactDescription}</p>
            {contact.email && <div className="contact-alt">
              <p className="mono-label">{content.emailAlternative}</p>
              <p className="contact-email">{contact.email.label}</p>
              <div className="contact-buttons"><CopyEmail email={contact.email.label} /><a className="text-link contact-mailto" href={contact.email.href}>{content.emailAppAction}</a></div>
            </div>}
            <ul className="contact-links">{contact.professionalLinks.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}<Icon name="external" /></a></li>)}</ul>
          </div>
          <ContactForm email={contact.email?.label ?? ""} />
        </div>
      </section>
    </main>
    <footer className="home-footer page-container">
      <div className="footer-brand"><Logo variant="spin" size={30} /><p>{profile.name}<span>{portfolioLabels.footer}</span></p></div>
      <div><Link className="text-link" href="/privacidad">Aviso de privacidad</Link><LinkPreferenciasCookies /><a className="text-link" href="#inicio">{portfolioLabels.backToTop}</a></div>
    </footer>
  </>;
}

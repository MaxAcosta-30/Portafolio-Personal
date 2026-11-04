import Link from "next/link";
import { HomeMotion } from "@/components/home-motion";
import { ProjectTechnicalPreview } from "@/components/project-technical-preview";
import { SiteHeader } from "@/components/portfolio";
import { Icon } from "@/components/ui";
import { LinkPreferenciasCookies } from "@/components/cookie-consent";
import { CopyEmail } from "@/components/copy-email";
import type { SourcedLink } from "@/content/types";
import { contact, experience, profile, resume } from "@/content/profile";
import { engineeringSystems, featuredCaseStudies, projects } from "@/content/projects";
import { homepage, portfolioLabels, siteMetadata } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";

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

function Pipeline() {
  return <figure className="home-pipeline blueprint" aria-labelledby="pipeline-title">
    <figcaption><h2 id="pipeline-title">{content.pipeline.title}</h2><p>{content.pipeline.description}</p></figcaption>
    <ol className="pipeline-stages">
      {content.pipeline.steps.map((step, index) => <li key={step.code}>
        <div className="pipeline-track" aria-hidden="true"><span className="pipeline-point" />{index < 3 && <svg><defs><marker id={`pipeline-tip-${step.code}`} markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L6 4L0 8" /></marker></defs><line className="pipeline-base" x1="0" y1="10" x2="100%" y2="10" /><g className="pipeline-flow"><line x1="0" y1="10" x2="100%" y2="10" markerEnd={`url(#pipeline-tip-${step.code})`} /></g></svg>}{index < 3 && <span className="pipeline-mobile-flow" />}</div>
        <code>{step.code}</code><h3>{step.title}</h3><p>{step.detail}</p>
      </li>)}
    </ol>
    <ol className="pipeline-layers" aria-label="Capas del despliegue de Hangar">{content.pipeline.layers.map((layer, index) => <li key={layer.title}><div><span>{layer.title}</span><span>{layer.technology}</span></div>{index < content.pipeline.layers.length - 1 && <Icon name="arrow" />}</li>)}</ol>
    <p className="pipeline-note">{content.pipeline.note}</p>
  </figure>;
}

function RepositoryLink({ repository, name, wholeRow = false }: { repository: SourcedLink | null; name: string; wholeRow?: boolean }) {
  if (!repository || repository.visibility !== "public") return <span className="repository-status">{repository?.visibility === "private" ? "Repositorio privado" : "Repositorio no disponible"}</span>;
  return <a className={`text-link ${wholeRow ? "row-primary" : "row-secondary"}`} href={repository.href}>Ver repositorio<span className="sr-only"> de {name}</span>{wholeRow ? <span className="t-learn-chevron"><Icon name="external" /></span> : <Icon name="external" />}</a>;
}

export default function Home() {
  const featured = featuredCaseStudies.filter(project => project.status !== "draft");
  const systems = engineeringSystems.filter(project => project.status === "ready");
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader compact />
    <HomeMotion />
    <main id="contenido" tabIndex={-1} className="page-container home-content">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-eyebrow">{content.headerRole}</p>
          <h1 id="hero-title">{content.headline}</h1>
          <p className="hero-introduction">{content.introduction}</p>
          <div className="hero-actions">
            <a className="button" href={`#${homepage.hero.primaryAction.sectionId}`}>{homepage.hero.primaryAction.label}<Icon name="arrow" /></a>
            <a className="button button-secondary" href={`#${homepage.hero.secondaryAction.sectionId}`}>{homepage.hero.secondaryAction.label}</a>
          </div>
        </div>
        <Pipeline />
      </section>
      <section id="servicios" className="home-section" aria-labelledby="servicios-title">
        <div className="home-section-heading"><h2 id="servicios-title">{content.services.title}</h2><p>{content.services.description}</p></div>
        <ol className="service-list">{content.services.items.map(service => <li key={service.title}>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <div className="service-proof"><span>{content.services.proofLabel}</span><ul>
            {service.proof.map(id => projects.find(project => project.id === id)).filter(project => project !== undefined).map(project => <li key={project.id}><a className="text-link" href={`#${project.id}`}>{project.name}</a></li>)}
            {"note" in service && <li>{service.note}</li>}
          </ul></div>
        </li>)}</ol>
      </section>
      <section id="proyectos" className="home-section" aria-labelledby="casos-title">
        <div className="home-section-heading"><h2 id="casos-title">{content.casesTitle}</h2><p>{content.casesDescription}</p></div>
        {featured.map(project => {
          const caseHref = content.cases[project.id as keyof typeof content.cases];
          return <article id={project.id} key={project.id} className="featured-row project-row t-learn">
            <div className="featured-copy">
              <p className="featured-kicker">{content.caseKicker}</p>
              <h3 aria-label={project.name}>{caseHref ? <Link className="row-primary" href={caseHref} aria-label={`${content.caseLink} de ${project.name}`}>{project.name}<span className="t-learn-chevron"><Icon name="arrow" /></span></Link> : project.name}</h3>
              {project.summary && <p className="project-description">{project.summary.text}</p>}
              <dl className="featured-facts">
                {project.problem && <div><dt>{content.caseProblem}</dt><dd>{project.problem.text}</dd></div>}
                {project.contribution && <div><dt>{portfolioLabels.contribution}</dt><dd>{project.contribution.text}</dd></div>}
              </dl>
              <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
              <div className="project-actions"><span className="case-action" aria-hidden={caseHref ? true : undefined}>{caseHref ? content.caseLink : "Próximamente"}{caseHref && <Icon name="arrow" />}</span><RepositoryLink repository={project.repository} name={project.name} />{project.demo && <a className="text-link row-secondary" href={project.demo.href}>Abrir demo<Icon name="external" /></a>}</div>
            </div>
            <ProjectTechnicalPreview projectId={project.id} projectName={project.name} />
          </article>;
        })}
      </section>
      <section id="sistemas-backend" className="home-section" aria-labelledby="sistemas-title">
        <div className="home-section-heading"><h2 id="sistemas-title">{content.systemsTitle}</h2><p>{content.systemsDescription}</p></div>
        <ul className="bento">{systems.map(project => <li id={project.id} key={project.id} className="bento-cell project-row t-learn">
          <h3>{project.name}</h3>
          {project.engineeringFocus && <p className="bento-focus">{project.engineeringFocus.text}</p>}
          {project.summary && <p className="bento-summary">{project.summary.text}</p>}
          <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
          <RepositoryLink repository={project.repository} name={project.name} wholeRow />
        </li>)}</ul>
      </section>
      <section id="sobre-mi" className="home-section about-grid" aria-labelledby="sobre-mi-title">
        <div className="about-intro">
          <h2 id="sobre-mi-title">{content.about.title}</h2>
          <div className="about-copy">{content.about.paragraphs.map(paragraph => <p key={paragraph.text}>{paragraph.text}</p>)}{resume.file && <a className="text-link" href={resume.file.href} download>{resume.label}<Icon name="arrow" /></a>}</div>
        </div>
        <div className="about-side">
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
      <section id="contacto" className="home-section home-contact" aria-labelledby="contacto-title">
        <div className="contact-panel blueprint">
          <div>
            <p className="featured-kicker">{contact.title}</p>
            <h2 id="contacto-title">{content.contactTitle}</h2>
            <p className="contact-description">{content.contactDescription}</p>
          </div>
          <div className="contact-actions">
            {contact.email && <>
              <p className="contact-email">{contact.email.label}</p>
              <div className="contact-buttons"><a className="button" href={contact.email.href}>{portfolioLabels.emailAction}<Icon name="arrow" /></a><CopyEmail email={contact.email.label} /></div>
            </>}
            <ul className="contact-links">{contact.professionalLinks.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}<Icon name="external" /></a></li>)}</ul>
          </div>
        </div>
      </section>
    </main>
    <footer className="home-footer page-container"><p>{profile.name}<span>{portfolioLabels.footer}</span></p><div><LinkPreferenciasCookies /><a className="text-link text-label" href="#inicio">{portfolioLabels.backToTop}</a></div></footer>
  </>;
}

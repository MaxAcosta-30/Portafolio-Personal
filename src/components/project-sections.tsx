import Link from "next/link";
import { ViewTransition } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui";
import { Showcase } from "@/components/showcase";
import type { SourcedLink } from "@/content/types";
import { engineeringSystems, featuredCaseStudies, projects } from "@/content/projects";
import { portfolioLabels } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";

export function RepositoryLink({ repository, name }: { repository: SourcedLink | null; name: string }) {
  if (!repository || repository.visibility !== "public") return <span className="repository-status">{repository?.visibility === "private" ? "Repositorio privado" : "Repositorio no disponible"}</span>;
  return <a className="text-link row-secondary" href={repository.href}>Ver repositorio<span className="sr-only"> de {name}</span><Icon name="external" /></a>;
}

function DemoLink({ demo, name }: { demo: SourcedLink; name: string }) {
  return <a className="case-action case-action-link" href={demo.href} target="_blank" rel="noopener noreferrer">{demo.label}<span className="sr-only"> de {name} (se abre en otra pestaña)</span><Icon name="external" /></a>;
}

/** Visual de Hangar: el dashboard rediseñado con despliegues reales hechos en local. */
function HangarVisual() {
  return <Showcase
    url="hangar · demo local"
    motion="porton"
    back={{ name: "hangar-apps", alt: "" }}
    front={{ name: "hangar-despliegue", alt: "Despliegue de landing-panaderia en Hangar: las cuatro etapas Clonar, Construir, Ejecutar y Enrutar marcadas como listas sobre los logs reales del build." }}
    caption="Capturas reales: despliegues hechos en local con Temporal, Docker (Podman) y los logs del worker."
  />;
}

function HitoVisual() {
  return <Showcase
    url="hito-one.vercel.app"
    motion="sello"
    back={{ name: "hito-panel", alt: "" }}
    front={{ name: "hito-landing", alt: "Landing de Hito: carpeta coral con el titular «Lo que acordaste, asentado.» y una hoja de hitos que se puede aprobar." }}
    phone={{ name: "hito-cliente", alt: "Vista del cliente en el celular: hitos con sus sellos y el botón Aprobar entrega." }}
    caption="Capturas reales de la demo: landing, panel de cobros y la vista que recibe el cliente."
  />;
}

function TaskFlowVisual() {
  return <Showcase
    url="taskflow · demo local"
    motion="andenes"
    back={{ name: "taskflow-analitica", alt: "" }}
    front={{ name: "taskflow-tablero", alt: "Tablero de TaskFlow Pro en tema oscuro: columnas Pendiente, Por hacer, En curso y En revisión con tareas, prioridades y fechas." }}
    phone={{ name: "taskflow-login-movil", alt: "Inicio de sesión de TaskFlow Pro en el celular." }}
    caption="Capturas reales de la app corriendo en local con los datos de ejemplo del repositorio."
  />;
}

export const featuredProjects = () => featuredCaseStudies.filter(project => project.status !== "draft");
export const readySystems = () => engineeringSystems.filter(project => project.status === "ready");

/** Casos destacados: editorial alternado, copy + vitrina con capturas reales. */
export function FeaturedCases() {
  return <>{featuredProjects().map((project, index) => {
    const caseHref = content.cases[project.id as keyof typeof content.cases];
    return <article id={project.id} key={project.id} className="featured-row project-row t-learn">
      <div className="featured-copy">
        <div className="case-meta"><Logo size={34} className="case-logo" /><span className="mono-label">Caso {String(index + 1).padStart(2, "0")}</span></div>
        <h2 aria-label={project.name}>{caseHref ? <Link className="row-primary" href={caseHref} aria-label={`${content.caseLink} de ${project.name}`}><ViewTransition name={`case-title-${project.id}`} share="case-morph" default="none"><span className="case-title-text">{project.name}</span></ViewTransition><span className="t-learn-chevron"><Icon name="arrow" /></span></Link> : project.name}</h2>
        {project.summary && <p className="project-description">{project.summary.text}</p>}
        <dl className="featured-facts">
          {project.problem && <div><dt>{content.caseProblem}</dt><dd>{project.problem.text}</dd></div>}
          {project.contribution && <div><dt>{portfolioLabels.contribution}</dt><dd>{project.contribution.text}</dd></div>}
        </dl>
        <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
        <div className="project-actions"><span className="case-action" aria-hidden={caseHref ? true : undefined}>{caseHref ? content.caseLink : "Próximamente"}{caseHref && <Icon name="arrow" />}</span>{project.demo && <DemoLink demo={project.demo} name={project.name} />}<RepositoryLink repository={project.repository} name={project.name} /></div>
      </div>
      {project.id === "hito" ? <HitoVisual /> : project.id === "hangar" ? <HangarVisual /> : <TaskFlowVisual />}
    </article>;
  })}</>;
}

/** Otros sistemas: tabla densa con cabecera, no tarjetas. */
export function SystemsRegistry() {
  return <section id="sistemas-backend" className="home-section registry page-container" aria-labelledby="sistemas-title">
    <header className="section-head"><h2 id="sistemas-title">{content.systemsTitle}</h2><p>{content.systemsDescription}</p></header>
    <div className="registry-head" aria-hidden="true"><span>Sistema</span><span>Decisión técnica y stack</span><span>Código</span></div>
    <ul className="registry-list">{readySystems().map(project => <li id={project.id} key={project.id} className="registry-row">
      {/* Portada del README del repositorio (SVG estático: no necesita optimización de imagen). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="registry-cover" src={`/images/serie/${project.id}.svg`} alt="" width={1280} height={400} loading="lazy" decoding="async" />
      <div className="registry-body">
        <h3>{project.name}</h3>
        <p className="registry-focus">{project.engineeringFocus?.text ?? project.summary?.text}</p>
        {project.summary && project.engineeringFocus && <p className="registry-summary">{project.summary.text}</p>}
        <ul className="technology-line" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map(t => <li key={t.name}>{t.name}</li>)}</ul>
      </div>
      <RepositoryLink repository={project.repository} name={project.name} />
    </li>)}</ul>
  </section>;
}

/** Servicios en franja de 4 columnas. En la portada, resumen; en /servicios, con los proyectos que los respaldan. */
export function ServicesStrip({ full = false }: { full?: boolean }) {
  const Title = full ? "h2" : "h3";
  return <ol className="page-container">{content.services.items.map((service, index) => <li key={service.title}>
    <span className="strip-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    <Title>{service.title}</Title>
    <p>{service.text}</p>
    {full && <div className="strip-proof"><span>{content.services.proofLabel}</span><ul>{service.proof.map(id => projects.find(project => project.id === id)).filter(project => project !== undefined).map(project => <li key={project.id}><Link href={`/proyectos#${project.id}`}>{project.name}</Link></li>)}</ul></div>}
  </li>)}</ol>;
}

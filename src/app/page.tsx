import Link from "next/link";
import { HomeMotion } from "@/components/home-motion";
import { HeroVisual } from "@/components/hero/hero-visual";
import { Logo } from "@/components/brand/logo";
import { repositories } from "@/content/repositories";
import { ButtonArrow, SiteFooter, SiteHeader } from "@/components/portfolio";
import { CountUp } from "@/components/count-up";
import { Icon } from "@/components/ui";
import { featuredProjects, readySystems, ServicesStrip } from "@/components/project-sections";
import { profile } from "@/content/profile";
import { hito } from "@/content/projects";
import { hitoSources } from "@/content/hito-case-study";
import { homepage, portfolioLabels, siteMetadata } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import "./home.css";

export const metadata = {
  title: { absolute: `${profile.displayName} · ${profile.role}` },
  description: profile.introduction.text,
  alternates: {
    canonical: `${siteMetadata.siteUrl}/`,
  },
  openGraph: {
    title: `${profile.displayName} · ${profile.role}`,
    description: profile.introduction.text,
    type: "website",
    url: `${siteMetadata.siteUrl}/`,
    images: [
      {
        url: `${siteMetadata.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${profile.displayName} · Portafolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.displayName} · ${profile.role}`,
    description: profile.introduction.text,
    images: [`${siteMetadata.siteUrl}/og-image.png`],
  },
} as const;

export default function Home() {
  const featured = featuredProjects();
  const systems = readySystems();
  const repositoryCount = Object.keys(repositories).length;
  // README de Hito en la revisión fijada: 53 unitarias + 50 de integración.
  const hitoTests = 53 + 50;
  const githubProfile = "https://github.com/MaxAcosta-30?tab=repositories";
  const [headlineStart, headlineEnd] = content.headline.split(content.headlineEmphasis);
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
          <h1 id="hero-title" className="hero-title" data-step="1">{headlineStart}<em>{content.headlineEmphasis}</em>{headlineEnd}</h1>
          <p className="hero-introduction" data-step="2">{content.introduction}</p>
          <div className="hero-actions" data-step="3">
            <Link className="cta-link" href={homepage.hero.primaryAction.href}>{homepage.hero.primaryAction.label}<ButtonArrow /></Link>
            <Link className="text-link" href={homepage.hero.secondaryAction.href}>{homepage.hero.secondaryAction.label}<ButtonArrow /></Link>
          </div>
          {/* Datos verificables: cada cifra enlaza a su fuente pública. */}
          <dl className="hero-metrics" data-step="4">
            <div><dt>pruebas automatizadas en Hito <a className="metric-source" href={hitoSources.readme.source}>fuente<span className="sr-only">: README de Hito</span><Icon name="external" /></a></dt><dd><CountUp value={hitoTests} /></dd></div>
            <div><dt>repositorios públicos <a className="metric-source" href={githubProfile}>fuente<span className="sr-only">: perfil de GitHub</span><Icon name="external" /></a></dt><dd><CountUp value={repositoryCount} /></dd></div>
            <div><dt>sin registro <a className="metric-source" href={hito.demo!.href} target="_blank" rel="noopener noreferrer">probar<span className="sr-only"> la demo de Hito (se abre en otra pestaña)</span><Icon name="external" /></a></dt><dd className="metric-text">Hito, en vivo</dd></div>
          </dl>
        </div>
        <HeroVisual />
        </div>
      </section>

      {/* Selector de proyectos: el trabajo, a un clic del primer pantallazo. */}
      <nav className="project-picker page-container" aria-label="Elige un proyecto">
        <p className="mono-label">Elige un proyecto</p>
        <ol>
          {featured.map((project, index) => <li key={project.id}><Link href={`/proyectos#${project.id}`}><span className="picker-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{project.name}</Link></li>)}
          <li><Link href="/proyectos#sistemas-backend"><span className="picker-index" aria-hidden="true">+{systems.length}</span><span className="picker-caps">Sistemas backend</span></Link></li>
        </ol>
      </nav>

      {/* Resumen de servicios; el detalle y el proceso viven en /servicios. */}
      <section id="servicios" className="services-strip" aria-labelledby="servicios-title">
        <h2 id="servicios-title" className="sr-only">{content.services.title}</h2>
        <ServicesStrip />
      </section>

      <section className="home-next page-container" aria-label="Siguiente paso">
        <p>{content.services.description.split(". ")[0]}.</p>
        <div><Link className="text-link" href="/servicios">Servicios y proceso<ButtonArrow /></Link><Link className="text-link" href="/sobre-mi">Sobre mí<ButtonArrow /></Link></div>
      </section>
    </main>
    <SiteFooter />
  </>;
}

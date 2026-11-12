import Link from "next/link";
import { HomeMotion } from "@/components/home-motion";
import { ButtonArrow, SiteFooter, SiteHeader } from "@/components/portfolio";
import { ServicesStrip } from "@/components/project-sections";
import { navigation, portfolioLabels } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import { pageMetadata } from "@/lib/page-metadata";
import "../home.css";

export const metadata = pageMetadata("/servicios", "Servicios", content.services.description);

export default function ServicesPage() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <HomeMotion />
    <main id="contenido" tabIndex={-1} className="home-content">
      <header className="page-intro page-container section-head split-head"><h1>{content.services.title}</h1><p>{content.services.description}</p></header>
      <section id="servicios" className="services-strip services-full" aria-label={content.services.title}>
        <ServicesStrip full />
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

      <section className="home-next page-container" aria-label="Siguiente paso">
        <p>{content.contactDescription}</p>
        <div><Link className="cta-link" href={navigation.cta.href}>{navigation.cta.label}<ButtonArrow /></Link></div>
      </section>
    </main>
    <SiteFooter />
  </>;
}

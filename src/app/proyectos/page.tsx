import { HomeMotion } from "@/components/home-motion";
import { SiteFooter, SiteHeader } from "@/components/portfolio";
import { FeaturedCases, SystemsRegistry } from "@/components/project-sections";
import { portfolioLabels } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import { pageMetadata } from "@/lib/page-metadata";
import "../home.css";

export const metadata = pageMetadata("/proyectos", "Proyectos", content.casesDescription);

export default function ProjectsPage() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <HomeMotion />
    <main id="contenido" tabIndex={-1} className="home-content">
      {/* Casos: editorial alternado, copy + vitrina con capturas reales. */}
      <section id="proyectos" className="home-section page-first cases page-container" aria-labelledby="casos-title">
        <header className="section-head split-head"><h1 id="casos-title">{content.casesTitle}</h1><p>{content.casesDescription}</p></header>
        <FeaturedCases />
      </section>
      <SystemsRegistry />
    </main>
    <SiteFooter />
  </>;
}

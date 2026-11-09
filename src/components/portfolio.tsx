import { HomeNavigation } from "./home-navigation";
import { Logo } from "./brand/logo";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { navigation } from "@/content/site";

/** Flecha de los botones (texto, no icono: hereda la fuente mono del botón). */
export function ButtonArrow() {
  return <span className="button-arrow" aria-hidden="true">→</span>;
}

/** Header de marca: logo, navegación, CTA principal, tema y menú. En las páginas de caso los enlaces apuntan a la home. */
export function SiteHeader({ homeLinks = false }: { homeLinks?: boolean }) {
  return <>
    {/* Ancla fuera del header: un elemento sticky ya "está visible" y el navegador no desplaza hacia él. */}
    <div id="inicio" aria-hidden="true" />
    <header className="site-header">
      <div className="site-header-inner page-container">
        <a href={homeLinks ? "/" : "#inicio"} className="site-brand" aria-label="Max Acosta, inicio"><Logo variant="assemble" wordmark size={30} /></a>
        <HomeNavigation homeLinks={homeLinks} />
        <div className="header-actions">
          <a className="button header-cta" href={`${homeLinks ? "/" : ""}#${navigation.cta.sectionId}`}>{navigation.cta.label}<ButtonArrow /></a>
          <ThemeToggle />
          <MobileMenu homeLinks={homeLinks} />
        </div>
      </div>
    </header>
  </>;
}

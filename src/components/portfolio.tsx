import { HomeNavigation } from "./home-navigation";
import { Logo } from "./brand/logo";
import { navigation } from "@/content/site";

/** Header de marca: logo, navegación en píldora y llamada a la acción. En las páginas de caso los enlaces apuntan a la home. */
export function SiteHeader({ homeLinks = false }: { homeLinks?: boolean }) {
  return <>
    {/* Ancla fuera del header: un elemento sticky ya "está visible" y el navegador no desplaza hacia él. */}
    <div id="inicio" aria-hidden="true" />
    <header className="site-header">
      <div className="site-header-inner page-container">
        <a href={homeLinks ? "/" : "#inicio"} className="site-brand" aria-label="Max Acosta, inicio"><Logo variant="assemble" wordmark size={30} /></a>
        <HomeNavigation homeLinks={homeLinks} />
        <a className="call-cta" href={navigation.call.href} target="_blank" rel="noopener noreferrer">{navigation.call.label}<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
      </div>
    </header>
  </>;
}

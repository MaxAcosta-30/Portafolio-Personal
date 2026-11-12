import Link from "next/link";
import { HomeNavigation } from "./home-navigation";
import { Logo } from "./brand/logo";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { LinkPreferenciasCookies } from "./cookie-consent";
import { navigation, portfolioLabels } from "@/content/site";
import { contact, profile } from "@/content/profile";
import { homeDesign } from "@/content/home-design";

/** Flecha de los botones (texto, no icono: hereda la fuente mono del botón). */
export function ButtonArrow() {
  return <span className="button-arrow" aria-hidden="true">→</span>;
}

/** Header de marca: logo, navegación por apartados, CTA principal, tema y menú. */
export function SiteHeader() {
  return <>
    {/* Ancla fuera del header: un elemento sticky ya "está visible" y el navegador no desplaza hacia él. */}
    <div id="inicio" aria-hidden="true" />
    <header className="site-header">
      <div className="site-header-inner page-container">
        <Link href="/" className="site-brand" aria-label="Max Acosta, inicio"><Logo variant="assemble" wordmark size={30} /></Link>
        <HomeNavigation />
        <div className="header-actions">
          <Link className="cta-link header-cta" href={navigation.cta.href}>{navigation.cta.label}<ButtonArrow /></Link>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  </>;
}

const brandIcons = {
  GitHub: "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3",
  LinkedIn: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
} as const;

/** Pie común: marca y oferta, navegación, proyectos y contacto; abajo, avisos y derechos. */
export function SiteFooter() {
  const pages = [{ label: "Inicio", href: "/" }, ...navigation.items, { label: "Contacto", href: navigation.cta.href }];
  const work = [
    { label: "Hito", href: "/proyectos/hito" },
    { label: "Hangar", href: "/proyectos/hangar" },
    { label: "TaskFlow Pro", href: "/proyectos/taskflow-pro" },
    { label: "Otros sistemas backend", href: "/proyectos#sistemas-backend" },
  ];
  return <footer className="site-footer">
    <div className="page-container">
      <div className="footer-grid">
        <div className="footer-about">
          <Link href="/" className="footer-brand"><Logo size={36} /><span><strong>{profile.displayName}</strong><span>{profile.role}</span></span></Link>
          <p>{homeDesign.introduction.split(". ")[0]}.</p>
        </div>
        <nav aria-labelledby="footer-nav-title"><h2 id="footer-nav-title">Navegación</h2><ul>{pages.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav>
        <nav aria-labelledby="footer-work-title"><h2 id="footer-work-title">Proyectos</h2><ul>{work.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav>
        <div>
          <h2>Contacto</h2>
          <p className="footer-place">{homeDesign.badgeShort.replace("Disponible · ", "")}</p>
          {contact.email && <a className="footer-email" href={contact.email.href}>{contact.email.label}</a>}
          <ul className="footer-social">{contact.professionalLinks.map(link => <li key={link.href}><a href={link.href} aria-label={link.label}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={brandIcons[link.label as keyof typeof brandIcons]} /></svg>
          </a></li>)}</ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {profile.displayName} · {portfolioLabels.footer}</p>
        <ul>
          <li><Link href="/privacidad">Aviso de privacidad</Link></li>
          <li><Link href="/legal/cookies">Cookies</Link></li>
          <li><Link href="/legal/aviso-legal">Aviso legal</Link></li>
          <li><LinkPreferenciasCookies /></li>
          <li><a href="#inicio">{portfolioLabels.backToTop}</a></li>
        </ul>
      </div>
    </div>
  </footer>;
}

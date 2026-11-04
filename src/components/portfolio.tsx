import { HomeNavigation } from "./home-navigation";
import { ThemeToggle } from "./theme-toggle";
import { Icon } from "@/components/ui";
import { navigation, portfolioLabels } from "@/content/site";
import { resume } from "@/content/profile";

export function SiteHeader({ homeLinks = false, compact = false }: { homeLinks?: boolean; compact?: boolean }) {
  if (compact) return <><div id="inicio" aria-hidden="true" />{/* Ancla fuera del header: un elemento sticky ya "está visible" y el navegador no desplaza hacia él. */}<header className="home-header"><div className="home-header-inner page-container"><a href="#inicio" className="home-brand">Max Acosta</a><HomeNavigation /><div className="home-tools"><a className="home-github text-link" href="https://github.com/MaxAcosta-30">GitHub<Icon name="external" /></a><ThemeToggle /></div></div></header></>;
  return (
    <header id="inicio" className="border-b border-border">
      <div className="page-container flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4 md:py-6">
        <a href={navigation.brand.href} className="inline-flex min-h-target items-center font-medium">
          {navigation.brand.label}
        </a>
        <nav aria-label={portfolioLabels.navigation} className="flex flex-wrap items-center gap-1">
          {navigation.items.map((item) => (
            <a key={item.sectionId} href={`${homeLinks ? "/" : ""}#${item.sectionId}`} className="portfolio-nav-link">{item.label}</a>
          ))}
          {resume.file && <a className="text-link px-3" href={resume.file.href} download>{resume.label}</a>}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

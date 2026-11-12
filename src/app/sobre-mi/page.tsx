import { SiteFooter, SiteHeader } from "@/components/portfolio";
import { Icon } from "@/components/ui";
import { experience, resume } from "@/content/profile";
import { portfolioLabels } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import { pageMetadata } from "@/lib/page-metadata";
import "../home.css";

export const metadata = pageMetadata("/sobre-mi", "Sobre mí", content.introduction);

export default function AboutPage() {
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <main id="contenido" tabIndex={-1} className="home-content">
      {/* Sobre mí: titular + bio arriba; experiencia y tecnologías en una retícula de 3. */}
      <section id="sobre-mi" className="home-section page-first about page-container" aria-labelledby="sobre-mi-title">
        <div className="about-top">
          <h1 id="sobre-mi-title">{content.about.title}</h1>
          <div className="about-copy">
            <p className="about-lead">{content.about.paragraphs[1].text}</p>
            {[content.about.paragraphs[0], content.about.paragraphs[2]].map(paragraph => <p key={paragraph.text}>{paragraph.text}</p>)}
            {resume.file && <a className="text-link" href={resume.file.href} download>{resume.label}<Icon name="arrow" /></a>}
          </div>
        </div>
        <div className="about-grid">
          <section id="experiencia" aria-labelledby="experiencia-title">
            <h2 id="experiencia-title" className="mono-label about-subtitle">{content.experienceTitle}</h2>
            {experience.filter(item => item.status === "ready").map(item => <article className="experience-row" key={item.organization}>
              <div><h3>{item.organization}</h3><p>{item.dates}</p></div>
              <p className="experience-role">{item.role}</p>
              {item.description && <p className="experience-description">{item.description.text}</p>}
            </article>)}
          </section>
          <section id="tecnologias" aria-labelledby="tecnologias-title">
            <h2 id="tecnologias-title" className="mono-label about-subtitle">{content.technologies.title}</h2>
            <dl className="technology-groups">{content.technologies.groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></dd></div>)}</dl>
          </section>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}

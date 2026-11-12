import { SiteFooter, SiteHeader } from "@/components/portfolio";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { Icon } from "@/components/ui";
import { contact } from "@/content/profile";
import { portfolioLabels } from "@/content/site";
import { homeDesign as content } from "@/content/home-design";
import { pageMetadata } from "@/lib/page-metadata";
import "../home.css";

export const metadata = pageMetadata("/contacto", "Contacto", content.contactDescription);

export default function ContactPage() {
  const [contactStart, contactEnd] = content.contactTitle.split(content.contactTitleEmphasis);
  return <>
    <a className="skip-link" href="#contenido">{portfolioLabels.skip}</a>
    <SiteHeader />
    <main id="contenido" tabIndex={-1} className="home-content">
      {/* Contacto: el formulario es la acción principal; el correo queda como alternativa. */}
      <section id="contacto" className="home-section page-first contact" aria-labelledby="contacto-title">
        <div className="page-container contact-inner">
          <div className="contact-intro">
            <p className="hero-badge"><span className="pulse-dot" aria-hidden="true" />{content.badgeShort}</p>
            <h1 id="contacto-title" className="contact-title">{contactStart}<em>{content.contactTitleEmphasis}</em>{contactEnd}</h1>
            <p className="contact-description">{content.contactDescription}</p>
            {contact.email && <div className="contact-alt">
              <p className="mono-label">{content.emailAlternative}</p>
              <p className="contact-email">{contact.email.label}</p>
              <div className="contact-buttons"><CopyEmail email={contact.email.label} /><a className="text-link contact-mailto" href={contact.email.href}>{content.emailAppAction}</a></div>
            </div>}
            <ul className="contact-links">{contact.professionalLinks.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}<Icon name="external" /></a></li>)}</ul>
          </div>
          <ContactForm email={contact.email?.label ?? ""} />
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}

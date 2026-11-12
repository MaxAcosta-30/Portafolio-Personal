import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";
import { Analytics } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollToTop } from "@/components/scroll-to-top";
import { headScript } from "@/lib/head-script";
import "./globals.css";

// Bricolage para titulares (H1: única fuente precargada), Geist para texto, JetBrains Mono para datos y botones.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: "600", variable: "--font-display-face", display: "swap" });
const sans = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans-face", display: "swap", preload: false });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono-face", display: "swap", preload: false });

const baseUrl = siteMetadata.siteUrl;
const publicBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || null;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `%s · ${profile.displayName}`,
    default: `${profile.displayName} · ${profile.role}`,
  },
  description:
    "Portafolio de Max Acosta, estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
  authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: siteMetadata.siteName,
    title: {
      template: `%s · ${profile.displayName}`,
      default: `${profile.displayName} · ${profile.role}`,
    },
    description:
      "Portafolio de Max Acosta, desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
    type: "website",
    locale: siteMetadata.locale,
    alternateLocale: ["en-US"],
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${profile.displayName} · Portafolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.displayName} · ${profile.role}`,
    description:
      "Portafolio de Max Acosta, desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
    images: [`${baseUrl}/og-image.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteMetadata.language} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Bloqueante e inline a propósito: aplica el tema y marca html.js antes de pintar. */}
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="antialiased">
        <Analytics />
        <ScrollToTop />
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              alternateName: "Max Acosta",
              ...(publicBaseUrl ? { url: publicBaseUrl } : {}),
              email: siteMetadata.email,
              jobTitle: profile.role,
              knowsAbout: siteMetadata.keywords,
              sameAs: [
                "https://github.com/MaxAcosta-30",
                "https://www.linkedin.com/in/max-acosta-240abb352",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteMetadata.siteName,
              ...(publicBaseUrl ? { url: publicBaseUrl } : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}

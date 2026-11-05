import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";
import { Analytics } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

// R6 "Índigo nocturno": Bricolage para titulares, Geist para texto, JetBrains Mono para datos.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: "700", variable: "--font-display-face", display: "swap" });
const sans = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans-face", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap", preload: false });

const baseUrl = siteMetadata.siteUrl;
const publicBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || null;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s · ${profile.name}".replace("${profile.name}", profile.name),
    default: profile.name,
  },
  description:
    "Portafolio de Max Alexander Acosta Valencia, estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
  authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: siteMetadata.siteName,
    title: {
      template: "%s · ${profile.name}".replace("${profile.name}", profile.name),
      default: profile.name,
    },
    description:
      "Portafolio de Max Alexander Acosta Valencia, desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
    type: "website",
    locale: siteMetadata.locale,
    alternateLocale: ["en-US"],
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: `${profile.name} · Portafolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description:
      "Portafolio de Max Alexander Acosta Valencia, desarrollador Full Stack con foco en backend, APIs y sistemas en tiempo real.",
    images: ["/og-image.png"],
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
    <html lang={siteMetadata.language} className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Bloqueante a propósito: marca html.js y si la intro ya se vio, antes de pintar. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/boot.js" />
      </head>
      <body className="antialiased">
        <Analytics />
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

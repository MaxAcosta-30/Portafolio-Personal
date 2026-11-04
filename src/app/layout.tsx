import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";
import { Analytics } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const plexSans = localFont({
  src: "../assets/fonts/plex-sans-latin.woff2",
  variable: "--font-plex-sans",
  weight: "100 700",
  display: "swap",
});

const plexMono = localFont({
  src: "../assets/fonts/plex-mono-latin.woff2",
  variable: "--font-plex-mono",
  weight: "400",
  display: "swap",
  preload: false,
});

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
    <html lang={siteMetadata.language} suppressHydrationWarning>
      <head>
        {/* Bloqueante a propósito: fija data-theme antes de pintar para evitar el destello de tema. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>
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

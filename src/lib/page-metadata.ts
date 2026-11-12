import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { siteMetadata } from "@/content/site";

/** Metadatos de un apartado: título con nombre (plantilla del layout), canonical y tarjeta para redes. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${siteMetadata.siteUrl}${path}`;
  const image = `${siteMetadata.siteUrl}/og-image.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} · ${profile.displayName}`, description, type: "website", url, images: [{ url: image, width: 1200, height: 630, alt: `${profile.displayName} · Portafolio` }] },
    twitter: { card: "summary_large_image", title: `${title} · ${profile.displayName}`, description, images: [image] },
  };
}

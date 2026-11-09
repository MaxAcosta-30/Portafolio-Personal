import type { MetadataRoute } from "next";
import { siteMetadata } from "@/content/site";

export const dynamic = "force-static";

/** Todo el sitio es rastreable; las páginas indexables están en sitemap.ts. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { siteMetadata } from "@/content/site";

export const dynamic = "force-static";

/** Todo el sitio es rastreable; /design-system y /muestra se excluyen con noindex en su metadata (no aquí: si se bloquean, Google no ve el noindex). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}

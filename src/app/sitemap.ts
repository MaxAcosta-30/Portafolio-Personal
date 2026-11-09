import type { MetadataRoute } from "next";
import { siteMetadata } from "@/content/site";

export const dynamic = "force-static";

/** Páginas indexables. Al agregar un caso de estudio o una página pública, agregarla aquí.
 *  Sin lastModified: una fecha que cambia en cada build le miente a Google sobre qué cambió. */
const routes = ["/", "/proyectos/hito", "/proyectos/hangar", "/proyectos/taskflow-pro", "/privacidad", "/legal/cookies", "/legal/aviso-legal"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({ url: `${siteMetadata.siteUrl}${route === "/" ? "" : route}` }));
}

import { contact, profile, resume } from "./profile";
import { cvEvidence, supported } from "./evidence";

/** Un apartado por página (antes, anclas de una sola página larga). */
export const navigation = {
  brand: { label: profile.displayName, href: "/" },
  items: [
    { label: "Proyectos", href: "/proyectos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Sobre mí", href: "/sobre-mi" },
  ],
  /** CTA principal del sitio (único texto: "Cotiza tu proyecto"). Lleva al formulario de contacto. */
  cta: { label: "Cotiza tu proyecto", href: "/contacto" },
  resumeLabel: resume.label,
};

export const homepage = {
  hero: {
    name: profile.displayName,
    role: profile.role,
    education: `${profile.education.status} de ${profile.education.program}`,
    headline: "Desarrollo Full Stack con foco en backend y APIs.",
    introduction: profile.introduction,
    specialty: profile.focus,
    primaryAction: { label: "Cotiza tu proyecto", href: "/contacto" },
    secondaryAction: { label: "Ver casos", href: "/proyectos" },
  },
  projects: {
    id: "proyectos",
    title: "Proyectos",
    introduction: "Proyectos autodirigidos: despliegue de aplicaciones, colaboración en tiempo real y sistemas backend.",
    featured: {
      id: "casos-de-estudio",
      title: "Casos de estudio",
      projectIds: ["hito", "hangar", "taskflow-pro"],
      presentation: "case-study-sections",
    },
    engineering: {
      id: "sistemas-backend",
      title: "Ingeniería y sistemas backend",
      projectIds: ["secure-vault", "safeledger", "fortressid", "secure-inventory", "sentinel-iot", "freelanceguard-erp"],
      presentation: "compact-list",
    },
  },
  about: { id: "sobre-mi", title: profile.about.title },
  experience: { id: "experiencia", title: "Experiencia profesional" },
  education: { title: "Formación" },
  skills: {
    id: "tecnologias",
    title: "Tecnologías por función",
    introduction: "Herramientas y prácticas que aplico en mis proyectos. El stack de cada sistema se detalla junto a su trabajo.",
  },
  contact: { id: "contacto", title: contact.title, invitation: contact.invitation },
};

export const portfolioLabels = {
  skip: "Saltar al contenido",
  navigation: "Navegación principal",
  contribution: "Mi aportación",
  technicalDetails: "Detalles técnicos",
  architecture: "Arquitectura",
  stack: "Tecnologías",
  profiles: "También puedes encontrarme en",
  backToTop: "Volver arriba",
  footer: "Desarrollo Full Stack · Backend y APIs",
};

export const hangarFlow = {
  title: "Del código al despliegue",
  caption: "Flujo de Hangar",
  projectId: "hangar",
  action: "Explorar Hangar",
  description: supported("Un workflow orquestado con Temporal.io, con reanudación desde el último paso completado.", cvEvidence("Página 1 · Hangar")),
  steps: [
    { code: "clone", label: "Código fuente" },
    { code: "build", label: "Construcción" },
    { code: "run", label: "Ejecución" },
    { code: "route", label: "Enrutamiento" },
  ],
  evidence: [cvEvidence("Página 1 · Hangar: pipeline clone → build → run → route")],
};

/** Labels and order belong to content, not to the future case-study template. */
export const caseStudySections = [
  { field: "context", label: "Contexto" },
  { field: "problem", label: "Problema" },
  { field: "contribution", label: "Mi aportación" },
  { field: "architecture", label: "Arquitectura" },
  { field: "technicalDecisions", label: "Decisiones técnicas" },
  { field: "stack", label: "Stack y responsabilidad de cada tecnología" },
  { field: "operation", label: "Funcionamiento" },
  { field: "challenges", label: "Desafíos" },
  { field: "testing", label: "Testing" },
  { field: "security", label: "Seguridad" },
  { field: "infrastructure", label: "Infraestructura" },
  { field: "results", label: "Resultados comprobables" },
] as const;


/**
 * Metadata de sitio. siteUrl sale de NEXT_PUBLIC_SITE_URL (canonical, sitemap, robots y Open Graph);
 * en Cloudflare Pages el build falla si falta (ver next.config.ts). El respaldo solo sirve en local.
 */
export const siteMetadata = {
  siteName: `${profile.displayName} · Portafolio`,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "http://127.0.0.1:3000",
  language: "es",
  locale: "es-MX",
  author: {
    name: profile.displayName,
    url: "https://github.com/MaxAcosta-30",
  },
  email: contact.email?.href ?? null,
  keywords: [
    "desarrollador full stack",
    "backend",
    "APIs",
    "sistemas en tiempo real",
    "Go",
    "Node.js",
    "TypeScript",
    "Next.js",
    "Temporal.io",
    "Docker",
    "portafolio",
  ],
} as const;

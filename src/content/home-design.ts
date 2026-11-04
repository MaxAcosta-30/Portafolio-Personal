import { cvEvidence, supported } from "./evidence";
import { repositoryEvidence } from "./repositories";
import { hangarCaseStudy } from "./hangar-case-study";
import { taskFlowCaseStudy } from "./taskflow-case-study";

export const homeDesign = {
  headline: "Desarrollo de software: backend, APIs y sistemas en tiempo real.",
  headerRole: "Desarrollador de software Full Stack",
  about: {
    title: "Sobre mí",
    paragraphs: [
      supported("Soy Max Acosta, estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack.", cvEvidence("Resumen y Educación")),
      supported("Construyo aplicaciones web, APIs y sistemas en tiempo real, con foco técnico en backend e integración de sistemas.", cvEvidence("Página 1 · Resumen, Hangar y TaskFlow Pro")),
      supported("En mis proyectos trabajo decisiones de arquitectura, seguridad y pruebas.", cvEvidence("Páginas 1–2 · Proyectos y Habilidades")),
    ],
  },
  technologies: {
    title: "Tecnologías por función",
    groups: [
      { label: "Backend", items: [".NET / ASP.NET Core", "Go / Fiber", "Node.js / TypeScript"], evidence: [cvEvidence("Página 1 · Proyectos")] },
      { label: "Tiempo real", items: ["WebSockets", "Socket.io", "Redis Pub/Sub"], evidence: [repositoryEvidence("taskflow-pro", "ARCHITECTURE.md")] },
      { label: "Datos", items: ["PostgreSQL", "SQL Server", "Redis"], evidence: [cvEvidence("Páginas 1–2 · Proyectos")] },
      { label: "Seguridad", items: ["OAuth", "OpenID Connect", "JWT"], evidence: [cvEvidence("Páginas 1–2 · Proyectos y Habilidades")] },
      { label: "Infraestructura", items: ["Docker", "Temporal.io", "Traefik"], evidence: [repositoryEvidence("hangar")] },
      { label: "Calidad y pruebas", items: ["Vitest", "Playwright", "Pruebas de integración", "Observabilidad"], evidence: [repositoryEvidence("taskflow-pro", "package.json"), cvEvidence("Página 2 · Habilidades")] },
    ],
  },
  introduction: "Soy Max Acosta, estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack.",
  pipeline: {
    title: "Hangar: del repositorio a la aplicación",
    description: "Un pipeline de despliegue autoalojado, coordinado con Go y Temporal.",
    steps: [
      { code: "clone", title: "Obtener el código", detail: "Repositorio Git y Dockerfile" },
      { code: "build", title: "Construir la imagen", detail: "Docker y logs de construcción" },
      { code: "run", title: "Ejecutar la aplicación", detail: "Contenedor, red y recursos" },
      { code: "route", title: "Conectar el acceso", detail: "Subdominio y Traefik" },
    ],
    // Capa de control: handler/apps.go inicia Temporal; el worker usa Docker
    // y RunContainer configura las etiquetas y red de Traefik (ver fuentes del caso).
    layers: [
      { title: "API", technology: "Go / Fiber" },
      { title: "Workflow", technology: "Temporal" },
      { title: "Contenedor", technology: "Docker" },
      { title: "Enrutamiento", technology: "Traefik" },
    ],
    note: "El routing se configura dentro de RunContainer. Esquema del código, no una ejecución en vivo.",
  },
  cases: { hangar: hangarCaseStudy.href, "taskflow-pro": taskFlowCaseStudy.href },
  caseAction: "Ver caso: Hangar",
  caseLink: "Leer caso",
  caseKicker: "Caso de estudio",
  caseProblem: "Problema",
  casesTitle: "Trabajo seleccionado",
  casesDescription: "Dos proyectos autodirigidos. La arquitectura, las decisiones y los límites, explicados en detalle.",
  systemsTitle: "Otros proyectos",
  // Resumen de los dominios ya respaldados en projects.ts (engineeringFocus de cada sistema).
  systemsDescription: "APIs y servicios backend centrados en seguridad, concurrencia, identidad y telemetría. Cada uno destaca la decisión técnica que lo define.",
  experienceTitle: "Experiencia profesional",
  contactTitle: "Conversemos sobre tu próximo proyecto.",
  contactDescription: "Backend, una plataforma web o una integración. Cuéntame qué necesitas construir.",
} as const;

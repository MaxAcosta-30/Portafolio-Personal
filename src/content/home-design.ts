import { cvEvidence, supported } from "./evidence";
import { repositoryEvidence } from "./repositories";
import { hangarCaseStudy } from "./hangar-case-study";
import { taskFlowCaseStudy } from "./taskflow-case-study";

export const homeDesign = {
  // Propuesta de valor definida por Max (servicios que ofrece, no proyectos previos).
  headline: "Software que se siente futuro.",
  // Confirmados por el propietario (2026-11-04).
  badge: "Disponible para proyectos · Culiacán y remoto",
  badgeShort: "Disponible · Culiacán y remoto",
  mainStack: "Go · .NET · Next.js",
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
  introduction: "Sitios web, landing pages, puntos de venta, APIs y sistemas a medida. Soy Max Acosta, desarrollador Full Stack y estudiante de Ingeniería en Sistemas Computacionales.",
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
  caseLink: "Leer caso",
  caseProblem: "Problema",
  // Oferta de servicios definida por Max. "proof" apunta a ids reales de projects.ts;
  // no implica clientes ni trabajos comerciales previos.
  // Pasos definidos por el propietario.
  process: {
    title: "Proceso",
    description: "Cinco pasos, del diagnóstico a la entrega.",
    steps: [
      { title: "Diagnóstico", text: "Entiendo tu negocio y lo que necesitas." },
      { title: "Propuesta", text: "Alcance, tiempos y cotización por escrito." },
      { title: "Diseño", text: "Ves cómo va a quedar antes de programar." },
      { title: "Desarrollo", text: "Avances semanales que puedes probar." },
      { title: "Entrega y soporte", text: "Publicación, capacitación y ajustes." },
    ],
  },
  services: {
    title: "Qué construyo",
    description: "Software a medida para negocios. Cada servicio se apoya en proyectos que puedes revisar aquí mismo.",
    proofLabel: "Lo respaldan",
    items: [
      { title: "Sitios web y landing pages", text: "Páginas rápidas, accesibles y fáciles de mantener, pensadas para presentar tu negocio y convertir visitas en contactos.", proof: ["taskflow-pro"], note: "Este portafolio (Next.js)" },
      { title: "Puntos de venta y sistemas de gestión", text: "Inventario, ventas, usuarios y permisos, con datos consistentes aunque varias personas operen al mismo tiempo.", proof: ["secure-inventory", "safeledger", "freelanceguard-erp"] },
      { title: "APIs e integraciones", text: "APIs documentadas y seguras para conectar tu sistema con aplicaciones web, móviles u otros servicios.", proof: ["secure-vault", "fortressid", "sentinel-iot"] },
      { title: "Aplicaciones en tiempo real", text: "Tableros, notificaciones y automatizaciones que se actualizan solas, con colas y procesos en segundo plano.", proof: ["taskflow-pro", "hangar"] },
    ],
  },
  casesTitle: "Trabajo seleccionado",
  casesDescription: "Dos proyectos autodirigidos. La arquitectura, las decisiones y los límites, explicados en detalle.",
  systemsTitle: "Otros proyectos",
  // Resumen de los dominios ya respaldados en projects.ts (engineeringFocus de cada sistema).
  systemsDescription: "APIs y servicios backend centrados en seguridad, concurrencia, identidad y telemetría. Cada uno destaca la decisión técnica que lo define.",
  experienceTitle: "Experiencia profesional",
  contactTitle: "Conversemos sobre tu próximo proyecto.",
  emailAlternative: "¿Prefieres el correo?",
  emailAppAction: "Abrir en tu app de correo",
  contactDescription: "Una landing page, un sitio web, un punto de venta o una API. Cuéntame qué necesitas y te propongo cómo construirlo.",
} as const;

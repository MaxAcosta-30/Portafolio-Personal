import { repositories } from "./repositories";

/** Caso de Hito. Cada afirmación apunta a un archivo del repositorio fijado a una revisión. */
const base = `https://github.com/MaxAcosta-30/${repositories.hito.name}/blob/${repositories.hito.revision}`;
export const hitoSources = {
  readme: { label: "README.md", source: `${base}/README.md` },
  domain: { label: "src/Hito.Domain", source: `https://github.com/MaxAcosta-30/${repositories.hito.name}/tree/${repositories.hito.revision}/src/Hito.Domain` },
  decisions: { label: "docs/decisiones (ADR)", source: `https://github.com/MaxAcosta-30/${repositories.hito.name}/tree/${repositories.hito.revision}/docs/decisiones` },
} as const;

export const hitoCaseStudy = {
  href: "/proyectos/hito",
  back: "Volver a proyectos",
  title: "Hito",
  kind: "Caso de estudio · .NET 10 + React · 2026",
  subtitle: "Cada entrega aprobada, cada cobro claro.",
  introduction: "Un freelancer acuerda hitos con su cliente, registra cada entrega y aprobación, y sabe en todo momento cuánto le deben. El cliente no crea cuenta: abre un enlace privado desde su celular.",
  repositoryLabel: "Ver repositorio",
  contentsLabel: "En este caso",
  navigation: [
    { id: "problema", label: "Problema" },
    { id: "recorrido", label: "Recorrido" },
    { id: "reglas", label: "Reglas de estado" },
    { id: "arquitectura", label: "Arquitectura" },
    { id: "decisiones", label: "Decisiones" },
    { id: "pruebas", label: "Pruebas" },
    { id: "limites", label: "Límites" },
  ],
  problem: {
    title: "Los acuerdos se pierden en el chat",
    text: "El alcance de un proyecto freelance suele vivir en mensajes de WhatsApp: cambia sin registro, nadie sabe qué está aprobado y el cobro se discute al final.",
    objective: "Hito separa lo acordado de lo que pasa después: el alcance aceptado queda congelado, cada entrega se aprueba o se rechaza con un comentario y el panel dice qué se debe.",
    contributionTitle: "Mi aportación",
    evidence: [hitoSources.readme],
  },
  journey: {
    title: "El recorrido completo",
    text: "Es el mismo flujo que recorre la prueba end-to-end, con el freelancer y el cliente en navegadores separados.",
    steps: [
      { title: "Crear el proyecto", detail: "Hitos con título, monto en MXN, fecha y entregable; el total se calcula en el servidor." },
      { title: "Enviar el enlace", detail: "Privado, con vencimiento y revocable; en la base solo se guarda el hash del token." },
      { title: "El cliente acepta", detail: "Hitos y montos quedan congelados; un cambio posterior es una versión nueva." },
      { title: "Entregar", detail: "El freelancer agrega la URL de evidencia (solo http o https)." },
      { title: "Aprobar o pedir cambios", detail: "Pedir cambios exige un comentario." },
      { title: "Registrar el pago", detail: "Solo sobre un hito aprobado y sin pagar de más." },
    ],
    evidence: [],
  },
  rules: {
    title: "Reglas de estado en el dominio",
    text: "Las transiciones viven en el dominio y tienen pruebas unitarias; una transición inválida responde 409.",
    project: [
      { title: "Borrador", detail: "Se arma el alcance." },
      { title: "Enviado", detail: "El cliente tiene el enlace." },
      { title: "Aceptado", detail: "El alcance queda congelado." },
      { title: "Completado", detail: "También puede pasar a Cancelado; los pagos registrados conservan su historial." },
    ],
    milestone: [
      { title: "Pendiente", detail: "Aún sin entregar." },
      { title: "Entregado", detail: "Con evidencia; puede volver de Cambios solicitados." },
      { title: "Aprobado", detail: "Ya se puede cobrar." },
      { title: "Pagado", detail: "El pago no puede exceder el monto." },
    ],
    evidence: [hitoSources.domain],
  },
  architecture: {
    title: "Arquitectura",
    text: "React en Vercel llama por rewrite a una API ASP.NET Core en Render, con PostgreSQL en Supabase. La API está en capas: Domain, Application, Infrastructure y Api.",
    steps: [
      { title: "React + TanStack Query", detail: "Vercel Hobby; /api/* se reescribe hacia la API." },
      { title: "ASP.NET Core (.NET 10)", detail: "Render Free con el Dockerfile del repositorio." },
      { title: "EF Core + Npgsql", detail: "Migraciones versionadas; dinero en numeric(18,2)." },
      { title: "PostgreSQL", detail: "Supabase Free por el session pooler." },
    ],
    pipelineTitle: "Despliegue automático",
    pipeline: [
      { title: "build-test", detail: "Unitarias e integración con PostgreSQL real." },
      { title: "kind", detail: "Rollout en Kubernetes local con sondas live/ready." },
      { title: "Migraciones", detail: "Bundle de EF Core contra Supabase." },
      { title: "Deploy hook", detail: "Render publica la versión nueva." },
    ],
    evidence: [hitoSources.readme],
  },
  decisions: {
    title: "Decisiones y lo que cuestan",
    rationaleLabel: "Por qué",
    tradeoffLabel: "Costo",
  },
  testing: {
    title: "Pruebas",
    text: "Cantidades tomadas del README en la revisión fijada.",
    checks: [
      { title: "Unitarias (xUnit) · 53", detail: "Transiciones de estado, cálculo de totales, reglas de pago, panel de cobros e historial mensual." },
      { title: "Integración (Testcontainers) · 50", detail: "API con PostgreSQL real, incluido el aislamiento entre usuarios y pagos simultáneos." },
      { title: "E2E (Playwright) · 1", detail: "El flujo crítico completo, con freelancer y cliente en navegadores separados." },
      { title: "Kubernetes (kind) · 1", detail: "Rollout con sondas live/ready, migraciones y llamada real a la API." },
    ],
    evidence: [hitoSources.readme],
  },
  limits: {
    title: "Límites",
    items: [
      "Es una demo de portafolio: Render Free se duerme y la interfaz avisa mientras despierta.",
      "Supabase Free no incluye respaldos automáticos.",
      "Kubernetes se prueba en kind dentro de CI; no es un despliegue en producción.",
      "No hay cobros con tarjeta, facturación ni correos: están fuera del alcance.",
    ],
    evidence: [],
  },
  sources: { title: "Fuentes", label: "Fuente", description: "Archivos del repositorio público, fijados a la revisión que se revisó." },
  closing: {
    title: "¿Necesitas algo así para tu negocio?",
    text: "Puedo construir el flujo completo: desde lo que acuerdas con tu cliente hasta lo que te pagan.",
    action: "Escríbeme",
  },
} as const;

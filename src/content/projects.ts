import type { EngineeringSystem, FeaturedCaseStudy, Project } from "./types";
import { cvEvidence, supported } from "./evidence";
import { repositoryEvidence, repositoryLink } from "./repositories";

const hitoReadme = repositoryEvidence("hito");
const hitoInstructions = repositoryEvidence("hito", "CLAUDE.md");
const hitoDemo = { source: "https://hito-one.vercel.app", location: "Demo pública · revisada el 7 de noviembre de 2026", kind: "demo" } as const;
const hangarSource = cvEvidence("Página 1 · Hangar");
const taskFlowSource = cvEvidence("Página 1 · TaskFlow Pro");
const seriesSource = cvEvidence("Página 1 · Desarrollo Full Stack — Proyectos de Portafolio Técnico");
const vaultSource = cvEvidence("Página 1 · Secure Vault API");
const ledgerSource = cvEvidence("Página 1 · SafeLedger API");
const identitySource = cvEvidence("Página 1 · FortressID");
const inventorySource = cvEvidence("Páginas 1–2 · Secure Inventory API");
const iotSource = cvEvidence("Página 2 · Sentinel IoT");
const hangarActivities = repositoryEvidence("hangar", "api/internal/activities/deploy_activities.go");
const hangarDecision = repositoryEvidence("hangar", "docs/adr/001-por-que-go-y-temporal.md");
const taskFlowArchitecture = repositoryEvidence("taskflow-pro", "ARCHITECTURE.md");
const taskFlowPackage = repositoryEvidence("taskflow-pro", "package.json");
const erpSource = repositoryEvidence("freelanceguard-erp");
const erpPersistence = repositoryEvidence("freelanceguard-erp", "src/FreelanceGuard.Api/Repositories/EmployeeRepository.cs");

// Ready means enough sourced content to publish, not production validation.
export const hito: FeaturedCaseStudy = {
  id: "hito",
  name: "Hito",
  aliases: [],
  kind: "case-study",
  status: "ready",
  nameEvidence: [hitoReadme],
  summary: supported("Sistema para que un freelancer acuerde hitos con su cliente, registre cada entrega y aprobación, y sepa qué le deben. El cliente aprueba desde un enlace, sin cuenta.", hitoReadme),
  contribution: supported("Diseñé y construí todo el sistema: la API en capas con .NET 10, la interfaz en React, las pruebas y el despliegue automático a costo cero.", hitoReadme),
  context: supported("Proyecto autodirigido de portafolio para puestos full stack .NET + React, publicado con una demo de un clic.", hitoInstructions),
  problem: supported("Los acuerdos y cobros de un freelancer viven en chats: el alcance cambia sin registro y nadie sabe qué está aprobado ni qué se debe.", hitoInstructions),
  architecture: supported("React con TanStack Query en Vercel llama por rewrite a una API ASP.NET Core en Render, con PostgreSQL en Supabase. Las reglas de estado viven en el dominio y se prueban sin base de datos.", hitoInstructions),
  technicalDecisions: [
    {
      decision: "Congelar el alcance aceptado en versiones.",
      rationale: "Un cambio posterior crea una versión nueva que el cliente debe aceptar; nada acordado se edita.",
      alternatives: ["Editar los hitos con bitácora de cambios"],
      tradeoffs: ["Más tablas y consultas por versión."],
      evidence: [hitoInstructions],
    },
    {
      decision: "Enlace privado para el cliente, guardando solo el hash del token.",
      rationale: "El cliente no necesita cuenta; el enlace expira y se puede revocar.",
      alternatives: ["Cuenta de cliente con contraseña"],
      tradeoffs: ["Quien tenga el enlace vigente puede aprobar; por eso vence y se revoca."],
      evidence: [hitoInstructions],
    },
  ],
  stack: [
    { name: ".NET 10 / ASP.NET Core", usage: "API en capas: Domain, Application, Infrastructure y Api.", evidence: [hitoReadme] },
    { name: "EF Core / PostgreSQL", usage: "Migraciones versionadas; dinero en numeric(18,2).", evidence: [hitoInstructions] },
    { name: "React 19 / TanStack Query", usage: "Panel del freelancer y vista del cliente en el celular.", evidence: [hitoReadme] },
    { name: "Identity / JWT", usage: "Access token en memoria y refresh token en cookie httpOnly.", evidence: [hitoInstructions] },
    { name: "xUnit / Testcontainers / Playwright", usage: "Unitarias, integración con PostgreSQL real y un e2e del flujo de cobro.", evidence: [hitoReadme] },
    { name: "GitHub Actions / kind", usage: "Pruebas, prueba en Kubernetes local y migraciones antes del deploy.", evidence: [hitoInstructions] },
  ],
  operation: supported("Crear proyecto → enviar enlace → el cliente acepta → entregar → aprobar → registrar pago. Cada acción queda en un historial que la API no deja editar.", hitoInstructions),
  challenges: [],
  testing: supported("Pruebas unitarias de transiciones y pagos, integración con PostgreSQL real mediante Testcontainers (incluido el aislamiento entre usuarios) y un e2e con Playwright del flujo completo.", hitoReadme),
  security: supported("Permisos validados en el servidor, límite de intentos en inicio de sesión y enlaces públicos, URLs de evidencia solo http(s) y secretos fuera del repositorio.", hitoInstructions),
  infrastructure: supported("Vercel Hobby, Render Free y Supabase Free, sin tarjeta: una demo de portafolio, no producción.", hitoInstructions),
  results: [],
  repository: repositoryLink("hito"),
  demo: { label: "Probar la demo", href: "https://hito-one.vercel.app", evidence: [hitoDemo] },
};

export const hangar: FeaturedCaseStudy = {
  id: "hangar",
  name: "Hangar",
  aliases: [],
  kind: "case-study",
  status: "ready",
  nameEvidence: [hangarSource],
  summary: supported("Plataforma de despliegue autoalojada: convierte repositorios Git en contenedores con subdominio y logs en tiempo real.", repositoryEvidence("hangar")),
  contribution: supported("Diseñé el pipeline de despliegue, configuré redes y límites de recursos por aplicación, e implementé streaming de logs, la API REST y el dashboard.", hangarSource),
  context: supported("Proyecto autodirigido de portafolio técnico para practicar arquitecturas de nivel producción.", seriesSource),
  problem: supported("Gestionar despliegues desde Git con control sobre la infraestructura y retomar workflows interrumpidos por un reinicio del servidor.", hangarDecision),
  architecture: supported("La API Go/Fiber y los workers de Temporal.io coordinan la construcción y ejecución de contenedores. PostgreSQL guarda aplicaciones, despliegues y logs; Redis Pub/Sub alimenta el WebSocket del dashboard Next.js. Traefik configura el enrutamiento mediante etiquetas Docker.", repositoryEvidence("hangar")),
  technicalDecisions: [
    {
      decision: "Orquestar el pipeline con Temporal.io.",
      rationale: "Permitir la reanudación desde el último paso completado.",
      alternatives: ["Node.js con BullMQ", "Tareas programadas con cron"],
      tradeoffs: ["Requiere un proceso worker separado de la API.", "Los workflows deben mantener determinismo; las operaciones de entrada/salida se delegan a actividades."],
      evidence: [hangarDecision],
    },
    {
      decision: "Usar Redis Pub/Sub entre Temporal y el handler WebSocket.",
      rationale: "Desacoplar la emisión de logs de despliegue y su entrega en vivo al dashboard.",
      alternatives: [], tradeoffs: ["El handler consulta periódicamente el estado final; el historial se lee antes de la suscripción a Redis y no garantiza una transición sin pérdidas."], evidence: [repositoryEvidence("hangar", "api/internal/handler/ws.go")],
    },
  ],
  stack: [
    { name: "Go / Fiber", usage: "API REST con graceful shutdown y handler WebSocket.", evidence: [hangarSource] },
    { name: "Next.js 14", usage: "Dashboard con App Router y Server Components.", evidence: [hangarSource] },
    { name: "Temporal.io", usage: "Orquestación del pipeline de despliegue.", evidence: [hangarSource] },
    { name: "Redis", usage: "Pub/Sub para streaming de logs.", evidence: [hangarSource] },
    { name: "Docker / cgroups", usage: "Red por aplicación y límites de memoria y CPU en los contenedores.", evidence: [hangarActivities] },
    { name: "PostgreSQL / Traefik", usage: "Persistencia de despliegues y logs; enrutamiento por etiquetas Docker.", evidence: [repositoryEvidence("hangar"), hangarActivities] },
  ],
  operation: {
    text: "El despliegue recorre clone → build → run → route. El routing se configura dentro de RunContainer; los logs de las actividades y del build se envían por WebSocket. Temporal coordina las actividades y sus reintentos.",
    evidence: [hangarActivities, repositoryEvidence("hangar", "api/internal/workflows/deploy_workflow.go"), repositoryEvidence("hangar", "api/internal/handler/ws.go")],
  },
  challenges: [],
  testing: supported("El repositorio contiene pruebas de integración para la API y el despliegue con servicios reales. Requieren Docker, PostgreSQL, Redis, Temporal y un repositorio de prueba local. Se revisó el código de las pruebas, sin ejecutarlas.", repositoryEvidence("hangar", "api/tests/deploy_integration_test.go")),
  security: supported("Se configura una red por aplicación y límites de recursos. Los contenedores también se conectan a la red compartida de Traefik; esta implementación no basta para afirmar aislamiento lateral entre tenants.", hangarActivities),
  infrastructure: supported("Infraestructura autoalojada con Docker, PostgreSQL, Redis, Temporal.io y Traefik; el repositorio documenta el arranque local con Docker Compose.", repositoryEvidence("hangar")),
  results: [],
  repository: repositoryLink("hangar"),
  demo: null,
};

export const taskFlowPro: FeaturedCaseStudy = {
  id: "taskflow-pro",
  name: "TaskFlow Pro",
  aliases: [],
  kind: "case-study",
  status: "ready",
  nameEvidence: [taskFlowSource],
  summary: supported("Plataforma de gestión de tareas con tableros sincronizados entre usuarios y automatizaciones por horarios, cambios de estado y webhooks.", taskFlowSource),
  contribution: supported("Implementé la sincronización de tableros, el motor de automatización, la observabilidad y los controles de autenticación y autorización; añadí pruebas unitarias y end-to-end del flujo crítico.", taskFlowSource),
  context: supported("Proyecto autodirigido de portafolio técnico para practicar arquitecturas de nivel producción.", seriesSource),
  problem: supported("Los cambios en los tableros deben llegar a todo el equipo sin recargar la página, y las automatizaciones deben ejecutarse sin bloquear la interfaz ni requerir que el usuario tenga la aplicación abierta.", taskFlowSource),
  architecture: supported("Un servidor Node.js comparte HTTP entre Next.js y Socket.io. Las rutas API publican eventos en Redis y Socket.io los retransmite a los tableros. Prisma conecta con PostgreSQL; workers separados procesan automatizaciones con BullMQ. Prometheus, Grafana, Sentry y Pino aportan observabilidad.", taskFlowArchitecture),
  technicalDecisions: [
    {
      decision: "Sincronizar los tableros con Socket.io y su adaptador Redis.",
      rationale: "Propagar cambios entre múltiples usuarios.",
      alternatives: [],
      tradeoffs: ["La reconexión no recupera automáticamente los eventos perdidos durante una desconexión, según la documentación."],
      evidence: [taskFlowArchitecture],
    },
    {
      decision: "Procesar automatizaciones con BullMQ.",
      rationale: "Ejecutar de forma asíncrona tareas activadas por Cron, cambios de estado y webhooks.",
      alternatives: ["pg-boss", "AWS SQS"],
      tradeoffs: ["El scheduler requiere una única instancia o coordinación mediante locks para evitar ejecuciones duplicadas."],
      evidence: [taskFlowArchitecture],
    },
  ],
  stack: [
    { name: "Node.js / Next.js / TypeScript", usage: "Servidor HTTP compartido para la aplicación y Socket.io.", evidence: [repositoryEvidence("taskflow-pro", "server.ts"), taskFlowPackage] },
    { name: "PostgreSQL / Prisma", usage: "Persistencia de usuarios, tableros, tareas y automatizaciones.", evidence: [taskFlowArchitecture] },
    { name: "Socket.io / Redis", usage: "Sincronización de tableros entre usuarios.", evidence: [taskFlowSource] },
    { name: "BullMQ", usage: "Procesamiento asíncrono de automatizaciones.", evidence: [taskFlowSource] },
    { name: "Prometheus / Grafana", usage: "Observabilidad del sistema.", evidence: [taskFlowSource] },
    { name: "Sentry / Pino", usage: "Observabilidad y logging estructurado.", evidence: [taskFlowSource] },
    { name: "Vitest / Playwright", usage: "Pruebas unitarias y end-to-end del flujo crítico.", evidence: [taskFlowSource] },
  ],
  operation: supported("Los cambios de los tableros se sincronizan entre usuarios. El motor de automatización procesa eventos de Cron, cambios de estado y webhooks mediante BullMQ.", taskFlowSource),
  challenges: [],
  testing: supported("Los scripts actuales usan Vitest y Playwright. El código E2E incluye registro, acceso, tableros, tareas, automatizaciones y sincronización entre usuarios. Estas pruebas no se ejecutaron durante la revisión del portafolio.", repositoryEvidence("taskflow-pro", "tests/e2e/flows.test.ts")),
  security: supported("El repositorio documenta JWT con rotación de refresh tokens y revocación en Redis. Se verificó la existencia del flujo OAuth de GitHub; no se presenta Google como proveedor implementado en esta versión.", taskFlowArchitecture),
  infrastructure: supported("Aplicación y workers separados, con infraestructura Docker Compose para PostgreSQL, Redis, Nginx, Prometheus y Grafana.", taskFlowArchitecture),
  results: [],
  repository: repositoryLink("taskflow-pro"),
  demo: null,
};

export const featuredCaseStudies: readonly FeaturedCaseStudy[] = [hito, hangar, taskFlowPro];

export const engineeringSystems: readonly EngineeringSystem[] = [
  {
    id: "secure-vault", name: "Secure Vault", aliases: ["Secure Vault API"],
    kind: "engineering-system", status: "ready", nameEvidence: [vaultSource],
    summary: supported("API de gestión de secretos con cifrado de datos en reposo y control de acceso basado en JWT.", vaultSource),
    contribution: supported("Diseñé el motor criptográfico con AES-256 e IVs únicos, implementé control de acceso y documenté la API.", vaultSource),
    engineeringFocus: supported("Cifrado en reposo, control de acceso y separación mediante Clean Architecture.", vaultSource),
    stack: [
      { name: ".NET 10", usage: "API con Clean Architecture y motor criptográfico AES-256.", evidence: [vaultSource] },
      { name: "JWT", usage: "Control de acceso.", evidence: [vaultSource] },
      { name: "Swagger / OpenAPI", usage: "Documentación de la API.", evidence: [vaultSource] },
      { name: "EF Core / SQL Server", usage: "Persistencia de secretos cifrados.", evidence: [repositoryEvidence("secure-vault")] },
    ], repository: repositoryLink("secure-vault"), demo: null,
  },
  {
    id: "safeledger", name: "SafeLedger", aliases: ["SafeLedger API"],
    kind: "engineering-system", status: "ready", nameEvidence: [ledgerSource],
    summary: supported("API de transferencias con un modelo de dominio encapsulado, bloqueos de fila en SQL Server y caché de respuestas por clave de idempotencia.", repositoryEvidence("safeledger")),
    contribution: supported("Estructuré la solución con Clean Architecture y diseñé un Rich Domain Model con persistencia mediante Entity Framework Core y SQL Server.", ledgerSource),
    engineeringFocus: supported("Control de concurrencia con UPDLOCK/ROWLOCK y encapsulamiento del acceso a cuentas.", repositoryEvidence("safeledger", "src/SafeLedger.Infrastructure/Repositories/AccountRepository.cs")),
    stack: [
      { name: "Entity Framework Core", usage: "Persistencia del modelo de dominio.", evidence: [ledgerSource] },
      { name: "SQL Server", usage: "Base de datos del sistema.", evidence: [ledgerSource] },
    ], repository: repositoryLink("safeledger"), demo: null,
  },
  {
    id: "fortressid", name: "FortressID", aliases: [],
    kind: "engineering-system", status: "ready", nameEvidence: [identitySource],
    summary: supported("Servidor de identidad centralizado con OpenID Connect y flujo Authorization Code con PKCE.", identitySource),
    contribution: supported("Implementé el proveedor de identidad con OpenIddict, rotación de refresh tokens y middleware de autorización personalizado.", identitySource),
    engineeringFocus: supported("Flujos de identidad y renovación de credenciales.", identitySource),
    stack: [
      { name: "OpenIddict", usage: "Proveedor de identidad OpenID Connect con Authorization Code y PKCE.", evidence: [identitySource] },
      { name: "ASP.NET Core Identity", usage: "Gestión de usuarios y autenticación por cookies.", evidence: [repositoryEvidence("fortressid")] },
    ], repository: repositoryLink("fortressid"), demo: null,
  },
  {
    id: "secure-inventory", name: "Secure Inventory", aliases: ["Secure Inventory API"],
    kind: "engineering-system", status: "ready", nameEvidence: [inventorySource],
    summary: supported("API RESTful en contenedores con caché Redis, acceso a datos mediante Dapper y autorización por roles.", inventorySource),
    contribution: supported("Implementé Cache-Aside con invalidación, acceso a datos críticos con Dapper, JWT basado en roles y hashing con BCrypt.", inventorySource),
    engineeringFocus: supported("Caché con invalidación y acceso a datos, junto con controles de autenticación.", inventorySource),
    stack: [
      { name: "Redis", usage: "Caché con patrón Cache-Aside e invalidación.", evidence: [inventorySource] },
      { name: "Docker Compose", usage: "Entorno en contenedores.", evidence: [inventorySource] },
      { name: "Dapper", usage: "Acceso a datos críticos.", evidence: [inventorySource] },
      { name: "JWT / BCrypt", usage: "Autorización por roles y hashing.", evidence: [inventorySource] },
    ], repository: repositoryLink("secure-inventory"), demo: null,
  },
  {
    id: "sentinel-iot", name: "Sentinel IoT", aliases: [],
    kind: "engineering-system", status: "ready", nameEvidence: [iotSource],
    summary: supported("Sistema de telemetría con arquitectura híbrida gRPC/REST y autenticación mutua mediante certificados.", iotSource),
    contribution: supported("Diseñé la comunicación con mTLS y certificados X.509, desarrollé la arquitectura gRPC/REST y migré la capa de datos a SQLite en Linux.", iotSource),
    engineeringFocus: supported("Autenticación entre dispositivos y comunicación mediante gRPC.", iotSource),
    stack: [
      { name: ".NET 10 / gRPC", usage: "Comunicación y arquitectura híbrida gRPC/REST.", evidence: [iotSource] },
      { name: "mTLS / X.509", usage: "Autenticación mutua mediante certificados.", evidence: [iotSource] },
      { name: "SQLite / Linux", usage: "Capa de datos migrada a SQLite en entorno Linux.", evidence: [iotSource] },
    ], repository: repositoryLink("sentinel-iot"), demo: null,
  },
  {
    id: "freelanceguard-erp", name: "FreelanceGuard ERP", aliases: ["FreelanceGuard-ERP"],
    kind: "engineering-system", status: "ready", nameEvidence: [erpSource],
    summary: supported("API de gestión de empleados con validación remota de licencias y estado de acceso almacenado en Redis.", erpSource),
    contribution: null,
    engineeringFocus: supported("Un servicio en segundo plano consulta la licencia y actualiza Redis; el middleware utiliza ese estado para controlar el acceso.", erpSource),
    stack: [
      { name: ".NET 8", usage: "Web API y servicio de verificación de licencias.", evidence: [repositoryEvidence("freelanceguard-erp", "src/FreelanceGuard.Api/FreelanceGuard.Api.csproj")] },
      { name: "Dapper / SQL Server", usage: "Consulta y creación de empleados.", evidence: [erpPersistence] },
      { name: "Redis / Docker Compose", usage: "Estado de licencia e infraestructura local.", evidence: [erpSource] },
    ], repository: repositoryLink("freelanceguard-erp"), demo: null,
  },
];

export const projects: readonly Project[] = [...featuredCaseStudies, ...engineeringSystems];

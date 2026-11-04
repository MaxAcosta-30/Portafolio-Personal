# Hangar — comprobación de contenido (fase 6R)

## Fuente y alcance

Repositorio público accesible: [MaxAcosta-30/Setup-hangar](https://github.com/MaxAcosta-30/Setup-hangar). Código revisado mediante copia local temporal; revisión fijada a `62f02735668eb66e65a06041eb4277525399f174`. Todos los enlaces de evidencia de la página apuntan a esa revisión, no a una rama mutable. Las rutas siguientes pertenecen a ese repositorio, no al portafolio.

La implementación se puede comprobar leyendo el código. Su ejecución distribuida **NO VERIFICADA**: no se levantaron sus servicios ni se ejecutó su suite de integración. No se presentan resultados comerciales, usuarios, clientes ni cifras de rendimiento. Los límites de recursos y los reintentos son configuración, no mediciones.

## Afirmación → archivo

| Afirmación publicada | Archivo y líneas | Alcance / límite |
| --- | --- | --- |
| Proyecto de aprendizaje para desplegar aplicaciones desde Git, alternativa autoalojada | `README.md:3–5` | Intención documentada, no producto con clientes acreditados. |
| API en Go / Fiber; dashboard Next.js 14 | `api/go.mod:1–14`; `api/cmd/server/main.go:71–81`; `dashboard/package.json` | Dependencias y arranque; no confundir con Next.js 16 del portafolio. |
| API crea despliegue pendiente y responde 202 tras iniciar workflow | `api/internal/handler/apps.go:144–195` | Respuesta asíncrona, no confirmación de disponibilidad HTTP. |
| Worker registra workflow y actividades | `api/cmd/worker/main.go:57–63` | Cola `hangar-deploy`, proceso separado. |
| Pipeline clone → build → run → route | `api/internal/workflows/deploy_workflow.go:54–87`; `api/internal/activities/deploy_activities.go:59–225` | Route es configuración de Traefik dentro de RunContainer, no una cuarta actividad Temporal. |
| Clone superficial y requisito Dockerfile | `api/internal/activities/deploy_activities.go:59–85` | Git clone depth 1. No checkout del CommitSha recibido. |
| Build mediante SDK Docker; salida de construcción al sistema de logs | `api/internal/activities/deploy_activities.go:89–117,249–280` | No se prueba aquí una construcción real. |
| Contenedor, etiquetas Traefik y subdominio | `api/internal/activities/deploy_activities.go:132–225` | No readiness probe. Un fallo al conectar la red compartida solo genera aviso. |
| PostgreSQL almacena apps, deployments y deploy_logs | `api/internal/db/migrations/001_initial.sql:1–31` | No contiene usuarios, propietarios u organizaciones. |
| Temporal configura timeout 10 min por actividad, 3 intentos y backoff | `api/internal/workflows/deploy_workflow.go:36–44` | Valores configurados, no duración medida ni promesa de recuperación probada. |
| Fallos en actividades intentan marcar failed; finalización intenta success | `api/internal/workflows/deploy_workflow.go:47–87` | No rollback/saga. Algunos errores al actualizar estado se ignoran; el fallo inicial al marcar running retorna error. |
| Red bridge por aplicación y conexión a red compartida de Traefik | `api/internal/activities/deploy_activities.go:135–159,179–218,285–287` | Internal false. No afirmar aislamiento lateral probado o frontera fuerte de seguridad. |
| Memoria 128 MiB y cuota CPU equivalente a 0,25 núcleo | `api/internal/activities/deploy_activities.go:185–197` | Configuración Docker. No es consumo medido. Se conserva el comentario original del extracto. |
| Limpieza al eliminar aplicaciones | `api/internal/handler/apps.go:111–141`; `api/internal/activities/deploy_activities.go:231–245` | La eliminación en base de datos puede continuar tras un error de limpieza. |
| No hay separación por identidad o autenticación implementada en estas rutas | `api/cmd/server/main.go:76–93`; `api/internal/db/migrations/001_initial.sql`; `README.md:291–298` | No presentar multi-tenancy con usuarios/roles como resuelto. Autenticación aparece en roadmap. |
| Logs: actividad → Redis Pub/Sub → WebSocket Fiber → dashboard | `api/internal/activities/deploy_activities.go:249–280`; `api/internal/rdb/client.go:30–35`; `api/internal/handler/ws.go:90–135`; `dashboard/app/components/LogStream.tsx:23–46` | Canal por deployment, no stream general de stdout del contenedor en ejecución. |
| Al conectar se envía primero historial PostgreSQL | `api/internal/handler/ws.go:61–105` | Lectura anterior a suscripción: existe ventana de pérdida. |
| Se comprueba estado periódicamente y se comunica done | `api/internal/handler/ws.go:80–135` | No implica confirmación HTTP de la aplicación. |
| No se garantiza entrega sin pérdidas ni reconexión automática | `api/internal/activities/deploy_activities.go:249–255`; `api/internal/handler/ws.go:61–105,146–153`; `dashboard/app/components/LogStream.tsx:23–46` | Errores ignorados/logueados y sin reconexión implementada en el cliente. |
| Go frente a Node.js + BullMQ: alternativa documentada | `docs/adr/001-por-que-go-y-temporal.md:14–43`; `README.md:275` | Razones del autor; no benchmarks ni superioridad medida. |
| Temporal frente a BullMQ/cron y coste del servicio/worker | `docs/adr/001-por-que-go-y-temporal.md:25–43`; `api/cmd/worker/main.go` | No repetir como hecho una comparación absoluta de pérdida de estado con otras herramientas. |
| Alternativas de red compartida o Internal true | `docs/adr/003-aislamiento-tenants.md:18–36,91–96`; `api/internal/activities/deploy_activities.go:150–218` | La implementación prevalece ante afirmaciones más fuertes del README/ADR. |
| Integración: salud, creación, pipeline, subdominios y 404 | `api/tests/deploy_integration_test.go:115–137,140–164,169–245,268–309` | Existencia y alcance comprobados por lectura; ejecución NO VERIFICADA. |
| Prueba de red Docker condicional | `api/tests/deploy_integration_test.go:247–260` | Puede omitirse si Docker TCP no está disponible; no prueba aislamiento entre apps. |
| El test de despliegue consulta BD y mensajes, sin petición HTTP a la app | `api/tests/deploy_integration_test.go:169–245` | No equivale a smoke test de disponibilidad pública. |
| Suite requiere servicios y fixture local | `api/tests/deploy_integration_test.go:8,13,33–35,68–106`; `infra/docker-compose.yml` | Fixture ausente en este entorno. Su ruta personal y valores de configuración sensibles no se publican. |
| GitHub webhooks, variables por app, logs post-deploy, métricas, autenticación y CLI | `README.md:291–298` | **Planeado**, separado de lo implementado. |

## Extractos exactos y revisión de privacidad

En `src/content/hangar-snippets.ts` se conservan tres bloques contiguos, sin reformatear ni cambiar tabulaciones:

| Archivo original | Líneas | Cantidad | Propósito |
| --- | --- | --- | --- |
| `api/internal/workflows/deploy_workflow.go` | 36–44 | 9 | Política de actividades. |
| `api/internal/activities/deploy_activities.go` | 185–197 | 13 | Recursos y red del contenedor. |
| `api/internal/handler/ws.go` | 90–105 | 16 | Suscripción a logs y consulta de estado. |

Se compararon literalmente con el checkout fijado. Revisión de contenido y búsqueda de credenciales, claves privadas, tokens, correos y rutas personales: sin hallazgos en estos extractos. No se incorporaron configuraciones privadas ni el repositorio completo al portafolio.

## Enlaces y metadata

- Repositorio público comprobado mediante clonación; enlaces de evidencia fijados al commit revisado.
- Demo pública no acreditada: se muestra «Demo no disponible», sin URL inventada.
- Título y descripción propios de Hangar. Canonical, URL Open Graph e imagen absoluta quedan pendientes hasta conocer el dominio público de Cloudflare. No se utiliza un dominio supuesto para esta página.
- Enlace a TaskFlow Pro conserva la ruta existente; no se desarrolló la fase 7R.

## Verificación del portafolio

Controles del portafolio ejecutados:

- `npm run lint`, `npm run typecheck`, `npm run build`: correctos. Exportación estática generada, incluida `/proyectos/hangar`.
- `npm test`: 48 pruebas correctas. Incluye navegación desde home, accesibilidad Axe WCAG AA, teclado/foco, targets, lectura sin JavaScript, movimiento reducido y anchos 320, 390, 768, 1024 y 1920 px.
- A 390 × 844: los tres bloques conservan `white-space: pre`, `overflow-x: auto`, `scrollWidth > clientWidth` y responden a flechas del teclado. Los extractos coinciden literalmente con la revisión fijada.
- Metadata renderizada de Hangar: título/descripcion propios; sin canonical ni og:url/og:image inventados mientras falta dominio.
- Capturas completas generadas con Playwright y examinadas visualmente (incluidos recortes a tamaño legible): `screenshots/hangar-6r-desktop.png` (1440 × 13108) y `screenshots/hangar-6r-mobile.png` (390 × 17859). En móvil los recorridos se muestran verticales; código desplazable sin reformatear y sin desbordamiento de la página.

No se modificó el contenido ni el diseño de home o TaskFlow Pro durante esta fase. Se corrigió además metadata compartida que atribuía una relación laboral y una identidad social no acreditadas, y una acción de búsqueda inexistente. Estas comprobaciones corresponden al portafolio; la suite distribuida de Hangar permanece **NO VERIFICADA** por los requisitos descritos arriba.

Pendiente de Max: revisar lectura y diagramas de Hangar, aprobar la fase 6R y proporcionar el dominio cuando publique en Cloudflare. La fase 7R no se inició.

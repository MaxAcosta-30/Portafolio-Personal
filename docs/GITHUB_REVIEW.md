# Revisión de GitHub para el portafolio

Fecha: 28 de octubre de 2026. Perfil: [MaxAcosta-30](https://github.com/MaxAcosta-30).

Ampliación de contenido solicitada después de la fase 5. Se revisaron los 12
repositorios públicos devueltos por la búsqueda del propietario: secciones de
README de cada uno, árboles completos de los 11 proyectos y archivos seleccionados de
implementación, arquitectura y pruebas. El repositorio restante es el perfil.
No se ejecutó código remoto, no se levantaron servicios y no se modificó GitHub.
No es una auditoría integral de seguridad ni una validación de funcionamiento.

Las fuentes incorporadas a los datos usan URLs con revisión fija, centralizadas
en `src/content/repositories.ts`. El botón «Ver repositorio» lleva a la versión
actual del proyecto; las evidencias conservan la revisión leída.

## Incorporado

| Portafolio | Repositorio | Contenido aprovechado |
| --- | --- | --- |
| Hangar | [Setup-hangar](https://github.com/MaxAcosta-30/Setup-hangar) | Enlace de código, finalidad autoalojada, PostgreSQL y Traefik, ADR de Go/Temporal, organización de actividades y pruebas de integración |
| TaskFlow Pro | [Taskflow-pro](https://github.com/MaxAcosta-30/Taskflow-pro) | Enlace, servidor HTTP compartido, Redis Pub/Sub, TypeScript, Prisma/PostgreSQL, decisiones de BullMQ, infraestructura y alcance de tests |
| Secure Vault | [SecureVault](https://github.com/MaxAcosta-30/SecureVault) | Enlace y persistencia con EF Core/SQL Server descrita en el README |
| SafeLedger | [SafeLedger-API](https://github.com/MaxAcosta-30/SafeLedger-API) | Enlace, bloqueos UPDLOCK/ROWLOCK y caché de respuestas por Idempotency-Key; sin prometer ausencia de duplicados bajo cualquier concurrencia |
| FortressID | [FortressID](https://github.com/MaxAcosta-30/FortressID) | Enlace y ASP.NET Core Identity documentado junto con OpenIddict |
| Secure Inventory | [SecureInventory-API](https://github.com/MaxAcosta-30/SecureInventory-API) | Enlace; README coherente con Redis, Cache-Aside, Dapper y SQL Server |
| Sentinel IoT | [SentinelIoT](https://github.com/MaxAcosta-30/SentinelIoT) | Enlace; corresponde al sistema .NET/gRPC/mTLS del CV |
| FreelanceGuard ERP | [FreelanceGuard-ERP](https://github.com/MaxAcosta-30/FreelanceGuard-ERP) | Enlace, gestión de empleados y licencias, .NET 8, Dapper/SQL Server y Redis |

Se mantiene la jerarquía visual: dos proyectos destacados y seis sistemas
compactos. No se añaden tarjetas, dependencias ni páginas por cada repositorio.

## Discrepancias que afectan a la redacción

**Hangar: redes por aplicación no equivale a aislamiento lateral comprobado.**
`api/internal/activities/deploy_activities.go` crea una red por aplicación y
conecta cada contenedor a la red compartida de Traefik. Por ello se eliminó la
promesa de aislamiento entre tenants del resumen y se describen los mecanismos
observados. El apartado de seguridad conserva esa limitación explícita. Los
límites de CPU/RAM son configuración, no resultados de una prueba de seguridad.

**Hangar: mediciones y estado.** El README incluye tiempos y rendimiento, pero
esta revisión no los reproduce ni encuentra suficiente material de medición
para convertirlos en resultados verificados. `results` continúa vacío. Sus
enlaces locales `.local` y `localhost` no son demos públicas. El ADR de Temporal
sí aporta alternativas y compromisos; no se copió su fecha de plantilla ni se
convirtió un argumento comparativo en una garantía universal sobre BullMQ.

**TaskFlow: documentación y código no siempre coinciden.** La tabla del README
menciona Jest; `package.json` usa Vitest en los scripts actuales y Playwright
para E2E. Se conservó Vitest. El CV menciona Google OAuth, pero la versión
revisada presenta el flujo de GitHub. Google no se publica como implementado.
`ARCHITECTURE.md` aporta límites sobre reconexión y coordinación del scheduler;
se registran como compromisos documentados. No se reproducen sus afirmaciones
generales sobre Next.js/serverless ni cifras de latencia como hechos validados.

**FreelanceGuard: el repositorio difiere del CV.** El CV describe EF Core
Code-First; el `.csproj` apunta a `net8.0` y declara Dapper. `EmployeeRepository.cs`
consulta e inserta empleados mediante SQL Server, y `LicenseCheckerService.cs`
consulta una licencia externa y guarda su estado en Redis. Se prioriza esta
versión observable para propósito y stack. La aportación personal específica
queda `null` hasta aclarar si el CV corresponde a otra versión; la lista compacta
describe el sistema sin inventar una historia de autoría. No se usa el badge
«Production» del README como prueba de uso real.

## Otros repositorios evaluados

| Repositorio | Hallazgo | Decisión |
| --- | --- | --- |
| [CheckoutSystem](https://github.com/MaxAcosta-30/CheckoutSystem) | Código de reserva atómica con Lua/Redis, ledger de partida doble, outbox/RabbitMQ y tests de concurrencia. La solución referencia `src/BuildingBlocks/CheckoutSystem.SharedKernel` y `CheckoutSystem.Observability`, ausentes del árbol público revisado. El README dice .NET 10; el proyecto Application leído apunta a net9.0 | Candidato para un futuro caso sobre concurrencia; no se añade como sistema completo ni se publican resultados de sus tests. Primero completar las dependencias referenciadas y validar build/pruebas |
| [iot-sentinel-dashboard](https://github.com/MaxAcosta-30/iot-sentinel-dashboard) | Proyecto distinto del Sentinel .NET: árbol con backend Java, simulador Go y frontend React. `frontend/src/App.jsx` carga el historial una vez al montar, aunque el README lo describe como real-time | No mezclar ambos Sentinel ni atribuir actualización continua al dashboard. Se reserva como candidato separado |
| [inventory-saas](https://github.com/MaxAcosta-30/inventory-saas) | README de plantilla; el worker Go utiliza Colly para leer precios de productos periódicamente. Hay carpetas frontend duplicadas y falta explicación propia de alcance | No inferir un SaaS terminado por su nombre. Documentar producto, estado y recorrido antes de añadirlo |
| [MaxAcosta-30](https://github.com/MaxAcosta-30/MaxAcosta-30) | README de perfil que coincide con contacto y enfoque general | No tratarlo como proyecto de software ni usar badges como prueba de tecnologías en un proyecto concreto |

Revisiones de candidatos: CheckoutSystem `03717b9e2a039e36d5e45789d816b30e818ffdaa`,
iot-sentinel-dashboard `f4d806778aea88a4e82cb81bab6a7c17b935d032`,
inventory-saas `f869b250f74f43a2d98669e9b52ba813596e5c06`.

## Límites y pendientes

- La presencia de pruebas no demuestra que pasen. No se ejecutaron los tests de
  Hangar, TaskFlow, CheckoutSystem ni los de los demás repositorios.
- Los datos de ejemplo de READMEs no se copiaron al proyecto. No se guardaron
  credenciales, archivos de entorno ni claves.
- No se encontró una URL de demo pública sustentada en el material revisado.
- Continúan pendientes capturas reales, resultados reproducibles, CV público
  descargable y relatos completos. Encontrar documentación permite enriquecer
  los datos, pero no autoriza construir automáticamente otra fase.
- La validación de este cambio comprueba el portafolio: lint, tipos, build
  estático, enlaces renderizados y la suite responsive/accesibilidad existente.

## Verificación del portafolio

- Lint, typecheck y build estático completados sin errores.
- Suite de 18 pruebas completada correctamente; el registro final de Playwright
  indica `passed` sin pruebas fallidas. Incluye enlaces a repositorios,
  navegación con teclado, accesibilidad y tamaños de móvil, tablet y escritorio.
- La comprobación de la pestaña local abierta en la aplicación quedó pendiente:
  la revisión automática bloqueó su acceso por un límite de uso. Recargar y
  revisar visualmente los enlaces y detalles de proyectos en esa pestaña.


## Revalidación para R2 · 29 de octubre de 2026

La consulta del propietario mediante el conector de GitHub devolvió 13 repositorios públicos. Los ocho proyectos ya presentados siguen figurando con visibilidad pública; se registró esta condición explícitamente para los enlaces de la home. El repositorio adicional respecto a la revisión anterior es Portafolio-Personal: no se convierte en un nuevo proyecto destacado. Esta revalidación no ejecuta los proyectos ni acredita demos o métricas. Las referencias de implementación mantienen las revisiones fijadas en la auditoría anterior.


## Fragmentos para la home · ajuste de vistas técnicas

Al no encontrarse copias locales, el propietario confirmó usar su GitHub MaxAcosta-30. Se leyeron los archivos públicos mediante el conector GitHub, sin ejecutar el código ni copiar repositorios completos.

| Proyecto | Archivo | Revisión | Líneas |
| --- | --- | --- | --- |
| Hangar | api/internal/workflows/deploy_workflow.go | 62f02735668eb66e65a06041eb4277525399f174 | 36–44: 9 líneas |
| TaskFlow Pro | lib/socket/publisher.ts | 9b8a54b9c89a8f7d1b7e8ddc29e6d47a347c1c79 | 7–16: 10 líneas |

Fragmentos contiguos conservados literalmente en src/content/project-previews.ts, con enlaces a sus líneas exactas. Revisión manual y búsqueda de patrones de credenciales en los dos fragmentos: sin secretos encontrados. El primero contiene opciones de timeout/reintentos; el segundo, imports, tipos y una función de publicación Redis con parámetros. No se copiaron valores de entorno ni configuración de conexión.

Los diagramas compactos usan los nodos ya sustentados en los casos: Next.js → Go/Fiber → Temporal → Docker para la solicitud de despliegue; Usuario → API Route → Redis Pub/Sub → Socket.io para cambios del tablero. Routing de Hangar sigue explicado por separado en su caso; no se inventa una actividad independiente de Temporal.

Verificación del ajuste: lint, typecheck, build y 46 pruebas del portafolio aprobados. Sin desbordamientos a 320, 390, 768, 1024 y 1920px; etiquetas de diagramas de al menos 13px efectivos. Sobre mí y home-design.ts comparados con la versión previa al ajuste: intactos. Capturas completas actualizadas en screenshots/full-desktop.png y screenshots/full-mobile.png.

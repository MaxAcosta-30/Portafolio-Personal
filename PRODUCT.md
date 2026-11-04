# Portafolio de Max Alexander Acosta Valencia

<!-- impeccable:product-schema 1 -->

Estado: contexto de producto actualizado en la fase 2M. Recoge hechos del brief del propietario y del repositorio; las decisiones abiertas se identifican expresamente. El propietario autorizó la implementación del rediseño oscuro del Prompt R, basado en xmcp y Tequs; la revisión visual final queda a su criterio. `DESIGN.md` documenta su implementación.

## Platform

web

## Users

- Clientes potenciales que necesitan evaluar a un desarrollador para plataformas web, backend, APIs, sistemas administrativos, automatización, integraciones, aplicaciones real-time o infraestructura de aplicaciones.
- Reclutadores y equipos técnicos que necesitan evaluar conocimiento, arquitectura, calidad de proyectos, stack, capacidad de aprendizaje y profundidad técnica.

El propietario pide atender a ambos públicos. No se ha establecido una prioridad comercial entre ellos. La lectura debe permitir una evaluación rápida y otra técnica más profunda sin exigir conocimientos especializados para orientarse.

## Product Purpose

Presentar el trabajo profesional de Max y facilitar conversaciones sobre proyectos u oportunidades laborales. El resultado buscado es que el visitante comprenda qué ha construido, qué aportó personalmente, cómo razona y cómo contactarlo.

El éxito se expresa como comprensión y acceso al contacto; no se han definido objetivos numéricos, tasas de conversión ni métricas comerciales.

## Positioning

Según el propietario, Max Alexander Acosta Valencia es estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack. Quiere comunicar ambición técnica, criterio de producto y atención al detalle mediante evidencia de su trabajo. No se presenta como agencia ni como experto absoluto en todas las tecnologías. La madurez buscada es calidad de juicio, no una atribución de seniority.

Hangar y TaskFlow Pro son los casos prioritarios declarados por el propietario. El CV describe Hangar como plataforma de despliegue multi-tenant y TaskFlow Pro como gestión de tareas real-time. Son proyectos autodirigidos de portafolio; no se ha comprobado uso en producción, clientes ni resultados comerciales.

## Operating Context

El portafolio será una web pública, consultable en escritorio y móvil. Los visitantes podrán recorrer proyectos y, cuando existan destinos comprobados, acceder a documentación, repositorios, CV y un canal de contacto confirmado.

Los datos profesionales proceden del brief y del CV local revisado en la fase 4. Outlier corresponde a experiencia como Entrenador de Inteligencia Artificial, remoto, mayo–julio de 2025, separado de los proyectos de software.

## Capabilities and Constraints

- Base existente: Next.js con App Router, TypeScript, Tailwind CSS, ESLint y `src/`.
- Exportación estática para Cloudflare Pages. Despliegue pendiente; no afirmar que el sitio ya está publicado.
- Evitar sobreingeniería. No hay una necesidad confirmada de CMS, base de datos, autenticación, formulario con backend ni infraestructura de animación.
- Fases explícitas: la fase 3 construyó `/design-system`; la fase 4 preparó arquitectura de información y contenido en `src/content/`; la fase 5 implementa la página principal. La fase 6 añade el caso de Hangar en `/proyectos/hangar`. El caso de TaskFlow Pro y el despliegue siguen pendientes. No avanzar automáticamente.
- No inventar experiencia, métricas, clientes, usuarios, contribuciones, funcionalidades, tecnologías por proyecto ni garantías de seguridad.
- No almacenar secretos, credenciales ni tokens en el repositorio. Los originales privados de las referencias pertenecen a `references/raw/`, excluido de Git.
- Mantener la aplicación ejecutable y realizar verificaciones pertinentes a cada cambio. Una propuesta visual no equivale a una implementación validada.
- Idioma público: pendiente de confirmación. El brief y la documentación están en español y el layout existente declara `lang="es"`; eso no autoriza a inferir una decisión definitiva sobre una versión bilingüe. No añadir i18n todavía.
- Correo, GitHub y LinkedIn proceden de la cabecera del CV. Disponibilidad laboral, dominio y versión pública del CV descargable: pendientes.

## Brand Commitments

Nombre del propietario: Max Alexander Acosta Valencia.

Comunicar ingeniería, precisión, sistemas, profundidad técnica, madurez, movimiento controlado y atención al detalle. Voz propuesta a partir del brief: directa, concreta y personal, sin superlativos ni jerga como sustituto de evidencia.

Restricciones expresas: evitar SaaS genérico, estética hacker, Matrix, cyberpunk, neón excesivo, terminal falsa como diseño principal y un portafolio artístico que dificulte evaluar ingeniería. También evitar gradientes arbitrarios, tarjetas anidadas, cuadrículas interminables de cards, redondeados excesivos, iconos repetidos en cajas, blobs, glassmorphism indiscriminado, tipografía enorme sin intención, dashboards decorativos y movimiento que perjudique lectura o UX.

Dirección vigente: oscura, minimalista y con el mecanismo real de Hangar como protagonista. Fondo casi negro, texto claro, un acento verde legible, Plex local, espacio, filas editoriales y movimiento discreto. Tequs sustituye a Tamal Sen; xmcp guía la composición. Los detalles de la implementación están centralizados en los tokens y documentados en `DESIGN.md`.

## Evidence on Hand

- Prompts del propietario: identidad, audiencias, restricciones y lista de proyectos a evaluar.
- `docs/PORTFOLIO_STRATEGY.md`: estrategia histórica de fase 1.
- `CV_MAX-2.pdf`: documento de dos páginas leído en fase 4; fuente declarativa de perfil, proyectos y experiencia. Original local ignorado, no descargable.
- `docs/CONTENT_ARCHITECTURE.md`: decisiones actuales, modelo y vacíos editoriales.
- `docs/GITHUB_REVIEW.md`: revisión posterior de 12 repositorios públicos; ocho enlaces incorporados y fuentes fijadas por revisión en `src/content/repositories.ts`.
- `references/README.md`: inventario. No hay repositorios, reportes, imágenes ni videos de proyectos disponibles localmente para contrastar el CV.
- `src/app/page.tsx`: homepage con navegación, hero, trabajo destacado, sistemas backend, perfil, Outlier, tecnologías y contacto.
- `/design-system`: referencia de tokens, componentes y estados de la dirección aprobada, preservada como documentación de desarrollo.
- `/proyectos/hangar`: pipeline, arquitectura, workflow, redes, logs, decisiones y testing explicados con diagramas semánticos y fuentes públicas.
- `/proyectos/taskflow-pro`: arquitectura, sincronización real-time, automatizaciones, observabilidad, seguridad, decisiones y testing.
- Skills solicitadas detectadas en la sesión: Impeccable, transitions.dev, make-interfaces-feel-better y las oficiales de GSAP. Su disponibilidad no significa que sus librerías estén instaladas ni que deban usarse todas.

Los nombres secundarios proporcionados son Secure Vault API, SafeLedger API, FortressID, Secure Inventory API, Sentinel IoT y FreelanceGuard-ERP. Sus resúmenes y stacks se han extraído de los apartados correspondientes del CV. Las fuentes se registran por afirmación; no equivalen a una auditoría integral de código o seguridad.

## Product Principles

1. Demostrar capacidad mediante trabajo verificable y atribución precisa.
2. Facilitar la lectura tanto a quien contrata como a quien evalúa técnicamente.
3. Mostrar decisiones y límites; distinguir aprendizaje, implementación y uso real.
4. Mantener la solución sencilla y proporcional al contenido disponible.
5. Priorizar comprensión, legibilidad y control del visitante sobre efectos visuales.

## Open Decisions

- Revisión visual del sistema implementado, manteniendo la dirección minimalista aprobada.
- Alcance de idioma: español o español e inglés.
- Material que permitirá confirmar el orden, alcance y tratamiento de los casos.
- Revisión de los enlaces de contacto, repositorios, demos y CV descargable.
- La siguiente fase y su alcance requieren un nuevo prompt explícito.

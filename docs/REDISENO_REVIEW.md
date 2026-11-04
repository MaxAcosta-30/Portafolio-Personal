# Revisión UI/UX — Prompt R

Fecha: 29 de octubre de 2026. Scope: home, navegación compacta, contraste y consentimiento.
El propietario autorizó implementar tras el análisis de referencias. Exportación
estática, sin nuevas dependencias ni páginas ni publicación.

## Referencias y decisiones

- xmcp: titular centrado contenido, navegación discreta, espacio y un visual principal.
- Tequs: protagonismo de un mecanismo real y explicación directa. Se aplica a
  Hangar, con responsabilidades por etapa, sin renders o datos de otra empresa.
- Core-A: no se tomó un elemento porque ninguno aportaba una función necesaria.
- Tamal Sen deja de ser referencia. No se heredan numeraciones o mayúsculas ornamentales.
- Se conservó Plex Sans/Mono local frente a añadir una familia nueva: cubre lectura
  e identificadores con carácter y evita otra dependencia.
- Titular seleccionado: «Backend, APIs y sistemas en tiempo real.» Es más compacto
  que el anterior y deja espacio al mecanismo. Perfil y proyectos sustentan ese foco.
- Cookies: panel en flujo al final, alineado a la derecha. Es una adaptación explícita
  del panel flotante solicitado para no tapar contenido ni controles, también en móvil.

## make-interfaces-feel-better — full

Framework: Next.js/React. Estilos: Tailwind 4, CSS compartido y tokens existentes.
Revisión visual de home en desktop/mobile; regresión automatizada de casos y
sistema de diseño. No auditoría del código remoto de los proyectos.

| Categoría | Evidencia | Resultado |
| --- | --- | --- |
| Tipografía | Capturas 1440×800, 390×844, 320/768/1920px; tamaños y medidas en tokens | Titular 32/48px, pesos 400/500/600, texto del flujo conserva tamaño en móvil |
| Superficies | Filas editoriales, líneas, botones y consentimiento | Sin tarjetas anidadas o sombras; targets y contraste pasan axe/pruebas |
| Animaciones | CSS de entrada de home y controles; reduced-motion automatizado | Solo opacity/transform en entrada, color en estados; sin movimiento repetitivo |
| Iconos | Icon SVG existente y flechas geométricas del pipeline | currentColor o tokens; decoración oculta a lectores; texto como significado |
| Rendimiento | Build export, fuentes locales, lista semántica, sin paquetes nuevos | Sin servicio o biblioteca añadida; Lighthouse y producción NO VERIFICADO |

### Problemas corregidos

| Severidad | Ubicación | Antes | Después | Motivo |
| --- | --- | --- | --- | --- |
| HIGH | `src/styles/tokens.css`, enlaces/foco | Acento oscuro 2.54:1 sobre negro | Verde claro para texto/foco y fill profundo para botón blanco | Contraste legible sin perder el único acento |
| HIGH | `src/app/globals.css`, selección | Blanco sobre verde claro | Tinta oscura sobre verde claro, comprobada en navegador | Texto seleccionado legible |
| HIGH | `src/app/page.tsx` | CTA llevaba a ancla; «Leer caso» abría GitHub | Casos internos y repositorios diferenciados | Acción coherente con su nombre |
| HIGH | `src/components/cookie-consent.tsx` | Banda fija tapaba visual y controles | Región no modal en flujo; decisiones equivalentes y reapertura con foco | Lectura y teclado sin obstrucción |
| MEDIUM | `src/app/page.tsx`, pipeline | SVG completo reducía también las etiquetas | Lista HTML con SVG geométrico de conexión; flujo apilado | Legibilidad en móvil |
| MEDIUM | `src/components/portfolio.tsx`, home header | GitHub quedaba aislado al envolver | Identidad/GitHub en primera fila y anclas en segunda para móvil | Agrupación y jerarquía |
| MEDIUM | `src/content/home-design.ts` | Relato y medidas repetidos en JSX | Contenido de home centralizado, CSS con escala compartida | Evitar divergencia entre páginas y datos |

### Candidatos descartados

| Candidato | Por qué |
| --- | --- |
| Diagrama con zoom o biblioteca de grafos | Cuatro etapas no lo necesitan; HTML conserva lectura y semántica |
| Flujo animado perpetuo | No representa una ejecución real y distrae; entrada única discreta |
| Panel flotante de consentimiento | Puede cubrir trabajo y controles; se prioriza documento accesible |

## Verificación ejecutada

- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado; corregido el acceso al resumen nullable.
- `npm run build`: aprobado; exportación estática conservada para Cloudflare.
- `npm test`: **32 passed**. Dos workers para evitar timeouts de la primera ejecución con once.
- Axe: sin infracciones en home, sistema de diseño y ambos casos, incluyendo estados de formularios.
- Navegación con teclado, skip link, foco, apertura de casos, anclas, repositorios y contacto.
- Consentimiento: rechazo/aceptación, persistencia, reapertura, foco y ausencia de superposición fija.
- Sin overflow y con objetivos táctiles a 320/390/768/1024/1920px.
- Detector Impeccable: `[]` en la pasada estática del alcance visual.
- Capturas finales en `screenshots/`, ignoradas por Git: desktop 1440×800 y móvil
  390×844, páginas completas y primeros viewports adicionales. Se abrieron para revisión.

No verificado: dispositivos físicos, Safari/Firefox, lector de pantalla real,
Lighthouse, recepción en GA real, publicación en Cloudflare ni previews sociales.
Referencia técnica: [actualización del consentimiento de Google](https://developers.google.com/tag-platform/security/guides/consent#update-consent-state).
El cambio de consentimiento actualiza el estado local y comunica denegación al
Google tag si ya estaba presente; no se afirma certificación legal ni de medición.

## Revisión independiente

Impeccable: revisión inicial de las siete capturas y código. Tipografía,
material, fondo, hero, filas, navegación y adaptación de cookies acordes al
contrato. Detectó una corrección material: contraste de selección de texto.

Se aplicó tinta oscura sobre verde claro. Prueba en navegador y capturas de
selección en desktop/mobile; el revisor calificó esa corrección como **resolved**
y emitió **ship**, limitado a la corrección evaluada. No se declara una auditoría
nueva de todo el sitio a partir de ese verdict pass.

Documenter independiente: `DESIGN.md` y `.impeccable/design.json` reconciliados
con paleta, escala, estados y componentes reales. Sin diferencias pendientes
en el alcance muestreado. No hubo publicación ni ejecución de GA de producción.

## Ajustes solicitados tras revisión visual

Se conserva dirección, paleta, tokens y textos existentes. Cambios limitados a
`src/app/page.tsx`, clases del hero/pipeline en `src/app/globals.css`, datos de
capas en `src/content/home-design.ts` y comprobación en `tests/homepage.spec.ts`.

- Título y descripción del pipeline centrados; acciones después del subtítulo,
  antes del visual. Separación medida de 96px en escritorio (escala existente).
- Header y main conservan `page-container`: mismos límites, máximo y padding;
  comprobado por geometría y estilos del navegador.
- Cuatro columnas en escritorio; se conserva la adaptación vertical en móvil.
- Descripciones de etapas de 13px, nota de 12px. Texto secundario sobre el fondo:
  contraste calculado en navegador de aproximadamente 8.33:1.
- Nodos de 12px con borde de 2px. Los tres conectores llegan al centro del nodo
  siguiente, incluido route; la prueba compara sus coordenadas.
- Capas API/Go-Fiber, workflow/Temporal, contenedor/Docker y enrutamiento/Traefik
  sustentadas en las fuentes ya revisadas del caso Hangar: handler de apps,
  workflow y RunContainer. Son una lectura del sistema, no nuevas actividades
  del workflow. Se conserva la nota que sitúa route dentro de RunContainer.

Comparación visual: se abrió `references/design/xmcp.png` y las capturas nuevas
`portfolio-desktop-first.png` (1440×800) y `portfolio-mobile-first.png` (390×844),
además de ambas páginas completas. Se comparó con el sitio dentro de la galería,
no con su marco. Coinciden el eje central del titular, el tratamiento compacto
de navegación y la separación del visual. Se conservan textos técnicos más
explícitos que la referencia; en móvil el diagrama continúa debajo del primer
viewport, sin recortar contenido ni reducir sus etiquetas.

Verificación: lint, typecheck y build aprobados; **34 pruebas aprobadas**;
detector de layout `[]`. Sin cambios a los tokens. Pendiente únicamente la
revisión visual del propietario; dispositivos físicos y otros navegadores:
NO VERIFICADO. Se detiene el trabajo tras esta comparación.

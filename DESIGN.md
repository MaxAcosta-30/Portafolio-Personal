---
name: Brasa (Noche) · Día
description: Portafolio de Max Acosta — dos temas con el mismo tratamiento de profundidad y paleta propia; cubo isométrico (M + A en acento) y hero 3D
colors:
  dark:  { bg-deep: "#0C0A09", bg: "#110E0C", surface: "#1A1613", surface-raised: "#221D19", line: "#2A241F", line-strong: "#40372F", text: "#F4EFE8", muted: "#A59B91", accent: "#FF6A2E", accent-fill: "#FF5A1F" }
  light: { bg-deep: "#F2F5FC", bg: "#FFFFFF", surface: "#F6F8FE", surface-raised: "#FFFFFF", line: "#E6EAF3", line-strong: "#C9D2E6", text: "#050505", muted: "#585D68", accent: "#1A64FF", accent-fill: "#548CFF" }
typography:
  display: { fontFamily: "Bricolage Grotesque 600", fontSize: "clamp(44px, 5vw, 68px)", lineHeight: 1, letterSpacing: "-0.04em" }
  heading: { fontFamily: "Bricolage Grotesque 600", fontSize: "clamp(30px, 3.2vw, 46px)", letterSpacing: "-0.03em" }
  cta: { fontFamily: "Bricolage Grotesque 600", fontSize: "18px", textDecoration: "underline 2px accent-fill, offset 0.3em" }
  body: { fontFamily: "Geist 400", fontSize: "16px" }
  eyebrow: { fontFamily: "JetBrains Mono", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }
rounded:
  control: "0.625rem"
  surface: "1rem"
  pill: "999px"
---

# Sistema de diseño — Ingeniería a la vista

## Overview

**Creative North Star: "Ingeniería a la vista"** — evolucionada en R3 para vender.

La ingeniería sigue explicándose con contenido real (pipeline, diagramas,
fragmentos de código fijados a una revisión), pero ahora con jerarquía y
profundidad: titular grande, paneles elevados y un bento para los sistemas.
Plex y el acento verde-agua se conservan como identidad.

**Key Characteristics:**

- Tema oscuro por defecto y tema claro según `prefers-color-scheme`.
- Dos niveles de elevación con sombras multicapa; glass solo en el header.
- Plex Sans para lectura y Mono para identificadores, etiquetas y stack.
- Movimiento discreto: elevación en hover, entrada de secciones, pipeline una vez.

## Colors

Fuente única: `src/styles/tokens.css`. El frontmatter refleja el tema oscuro.
El tema claro redefine los mismos tokens dentro de
`@media (prefers-color-scheme: light)`: fondo `#f6f7f6`, superficie `#ffffff`,
texto `#151716`, muted `#5a5e5c`, acento `#1d6b5f` (oscurecido para AA sobre
blanco). `accent` es para texto, foco y líneas; `accent-fill` para botones con
texto blanco. No intercambiarlos. No hay botón de tema: sigue al sistema.

## Typography

Plex Sans y Mono locales. Display y heading son fluidos con `clamp()`.

| Rol | Valor | Interlineado |
| --- | --- | --- |
| Display | clamp(2.5rem, 1.6rem + 4vw, 4.75rem), 600, -0.03em | 1.04 |
| Heading | clamp(1.5rem, 1.3rem + 0.9vw, 2rem) | 1.2 |
| Title | 20px | 1.35 |
| Body | 17px | 1.6 |
| Label | 12px (mínimo 13px en descripciones técnicas) | 1.5 |

Etiquetas de sección (`featured-kicker`, `about-subtitle`, eyebrow) en Mono
12px con acento. Hero alineado a la izquierda, máximo 18ch; lectura hasta 64ch.

## Layout

Base de 4px, gutter 24px, margen de página 20px (40px desde lg), ancho máximo
1240px. Breakpoints 768px y 1024px.

- Hero: eyebrow, titular, introducción y acciones a la izquierda; debajo, el
  pipeline de Hangar en un panel elevado (96px de separación en escritorio).
- Casos destacados: copy 5/12 sobre el fondo y panel técnico 7/12; el lado
  alterna en lg. Diagrama compacto horizontal solo desde 80rem.
- Otros proyectos: bento asimétrico de 12 columnas, filas 7/5 y 5/7.
- Sobre mí: intro fija (sticky) 5/12; experiencia y tecnologías 6/12.
- Contacto: panel de cierre 7/5 con correo visible, acciones y enlaces.

## Elevation & Depth

- `--shadow-raised`: celdas del bento y panel técnico en reposo.
- `--shadow-floating`: paneles del hero y contacto, y estado hover.
- En oscuro, cada sombra lleva un filo de luz interior superior; en claro son
  sombras suaves tintadas.
- Se usan con `box-shadow: var(--shadow-*)`, no con utilidades de Tailwind,
  para que cambien con el tema.
- `.blueprint`: retícula de puntos con máscara, solo en los paneles del hero y
  contacto.
- Header: glass (`color-mix` 72% + blur 14px) y fijo desde md. Fondo sólido si
  no hay `backdrop-filter` o con `prefers-reduced-transparency`.

## Shapes

Dos radios concéntricos: `control` 8px (botones, campos, bloque de código) y
`surface` 14px (paneles y celdas). Sin tarjetas anidadas: el código es un pozo
hundido dentro del panel, no otra tarjeta. Los SVG de diagramas aún usan
`rx="2"` (pendiente de alinear).

## Components

- Botones de 44px mínimo. En hover suben 1px, ganan `shadow-raised` y la
  flecha avanza 2px; en active vuelven a 0 con `scale(0.98)`.
- Celdas del bento y casos: toda la fila es enlace (`row-primary`); en hover
  el panel sube 2–3px, la sombra pasa a `floating` y el borde toma tinte del
  acento.
- Pipeline, cookies y copiar correo mantienen el comportamiento de R2.
- Movimiento (escala transitions.dev): entrada de secciones 400ms/12px con
  `--ease-smooth-out` (GSAP `power4.out`) y contenido escalonado 40ms (80ms en
  piezas grandes, total < 300ms); hover de elevación entra en 200ms y sale en
  250ms; indicador de navegación 250ms; pipeline una vez por sesión.
  Con `prefers-reduced-motion` las duraciones van a 0. Sin `transition: all`.

## Do's and Don'ts

- Mantener los hechos en contenido estructurado y las medidas en tokens.
- Mostrar fuentes, limitaciones e identidad personal; no inventar métricas.
- Preservar lectura móvil, foco y HTML semántico.
- No copiar fotografías industriales, cifras, logos, prensa, chatbot ni 3D de Tequs.
- No introducir nuevas páginas, servicios o despliegues en esta fase.


## R2 · Fase A

Se conserva la dirección oscura y minimalista y todos los tokens. Se amplía la home con Sobre mí (borrador del CV) y seis filas de tecnologías por función, sin tarjetas ni rankings. La navegación añade Sobre mí y un subrayado estático para la sección activa, con anclas nativas y desplazamiento suave desactivado al reducir movimiento. Las filas tienen un enlace primario extendido con foco en su perímetro; repositorios y demos conservan enlaces independientes. El pie reproduce el divisor interior del header. Copiar correo anuncia éxito o recuperación en una región viva. Las fotografías editoriales autorizadas se documentan en docs/R2_IMAGE_SOURCES.md para la Fase B; no se integran ni se añaden animaciones en esta fase.


## R2 · Fase B

La composición, la paleta y los tokens tipográficos existentes se conservan. Tras el ajuste del propietario, las filas ya no usan fotografías, créditos ni avisos editoriales. Presentan un diagrama SVG compacto y un fragmento real de código de 8 a 20 líneas, con archivo y fuente fijada a una revisión. Estos recursos permanecen visibles en el flujo normal: no hay una fila ni una altura reservadas para previews ocultas. Leer caso y Ver repositorio comparten tamaño de cuerpo y peso semibold. Sobre mí y su etiqueta de borrador se conservan intactos.

El único momento secuenciado es el pipeline de la home: tres conectores y cuatro nodos, 960ms nominales, una vez por sesión cuando el almacenamiento está disponible. Los tokens de movimiento se centralizan en src/styles/tokens.css. Las secciones entran en 400ms y 12px sin ocultación previa a cargar GSAP. El hover usa 4px y 180ms de transitions.dev y el indicador de navegación solo opacity/transform. Reduced motion cancela las animaciones; sin JavaScript el HTML y los recursos técnicos siguen legibles.

Los casos Hangar y TaskFlow Pro incorporan diagramas SVG de las secuencias ya documentadas, con alternativa textual ordenada para lectores de pantalla y trazado vertical en móvil. No se añaden servicios, conexiones ni promesas de aislamiento.


### Ajuste de lectura de las vistas técnicas

Los bloques de código conservan whitespace e indentación de la fuente, sin wrap, con scroll horizontal nativo, tabindex 0, aria-label y foco visible. Los diagramas compactos de las filas siguen el orden del flujo en una fila horizontal desde 1024px y una columna vertical por debajo; los casos detallados no cambian. Las etiquetas pequeñas mantienen al menos 12px y usan los colores semánticos legibles existentes.


## R3 · Rediseño para vender

Se evoluciona la dirección plana: tema claro y oscuro, elevación, radios de
8/14px y tipografía fluida. Se rediseñan el hero, los casos (con Problema y
Mi aportación ya respaldados en `projects.ts`), el bento de sistemas, el bloque
Sobre mí, el contacto y el header. Se retira la etiqueta de borrador de Sobre
mí. Las páginas de caso heredan los tokens; su maquetación aún es la de R2.


## R4 · Sistema vivo (vigente)

Sustituye a las direcciones anteriores donde contradigan.

- **Paleta monocroma:** negro `#050505` / blanco `#ffffff` y grises; sin color
  de acento (decisión del propietario). El "acento" es el propio texto; los
  enlaces se distinguen por subrayado. Botón principal: blanco sobre negro en
  oscuro, negro sobre blanco en claro.
- **Tema:** oscuro por defecto, claro por `prefers-color-scheme`, y elección
  manual con `ThemeToggle` que persiste en `localStorage` y se aplica antes de
  pintar con `public/theme-init.js` (archivo externo por la CSP). El cambio se
  revela en círculo desde el botón con View Transitions; sin animación con
  movimiento reducido o sin soporte.
- **Momento firmado:** el titular sube palabra a palabra tras una máscara
  (solo transform), seguido de introducción y acciones (desplazamiento y
  desenfoque, sin opacidad: el texto es legible desde el primer fotograma).
- **Riel del sistema** (≥80rem): línea fija en el margen interior que se llena
  con el scroll; un nodo por sección se enciende al alcanzarla. Decorativo
  (`aria-hidden`).
- **Entradas por tipo de sección:** servicios deslizan, celdas del bento se
  descubren con máscara, cada caso entra al aparecer con el panel técnico
  desde su lado y desenfoque, el contacto se enfoca. 400ms, `power4.out`.
- **Luz bajo el cursor** en celdas, paneles técnicos y contacto
  (`data-spotlight`), 7% del color del texto.
- **Sin etiquetas sobre títulos** ni numeración de secciones; Mono solo para
  código, stack, rutas y el correo.
- Títulos de sección fluidos hasta 48px; display hasta 96px.


## R5 · Hangar en vivo (vigente; sustituye R3 y R4)

Brief: negocios locales y reclutadores técnicos deben sentir **asombro de ver
software funcionando**; personalidad *maquinista*; recuerdo: "su portafolio
desplegaba una app mientras lo leía".

- **Elemento firma (primer viewport):** `DeployConsole`. Simula el flujo real
  de Hangar (202 → pending → DeployWorkflow → CloneRepository →
  BuildDockerImage → RunContainer 128 MiB / 0.25 CPU → Traefik Host → success)
  y el visitante despliega el nombre de su negocio como
  `<slug>.hangar.local`. Rotulado como simulación. Consola oscura en ambos
  temas (instrumento físico); sangra por la derecha desde 64rem.
  El propietario pidió expresamente este recurso: anula para esta dirección la
  prohibición de "terminal falsa como recurso principal".
- **Tipografía:** Big Shoulders 800 en mayúsculas para display (hasta 144px,
  >6:1 frente a 17px), Instrument Sans para lectura, JetBrains Mono solo para
  datos. Fuentes de Google autoalojadas por `next/font`; las variables se
  declaran en `<html>` y se publican en `:root` para el CSS plano.
- **Color:** asfalto + amarillo señal dominante en acciones y estados; verde
  solo para éxito. Claro diseñado: hormigón, tinta y ocre `#7a5d00` para
  texto; el relleno de botón sigue amarillo con texto tinta.
- **Ritmo y roturas de retícula:** consola a sangre, cinta de servicios a
  sangre, banda amarilla en Sobre mí, contacto monumental. Cada sección tiene
  forma propia: tablero de señalética (servicios), casos con visual vivo
  (instrumentos de reintentos reales + estados para Hangar; tablero Ana/Luis
  sincronizado vía `board:{id}` para TaskFlow), registro denso (sistemas).
- **Movimiento:** entrada orquestada del hero (palabras tras máscara, consola,
  registro que se escribe con clip-path); scroll: cinta con scrub, servicios
  que entran en servicio al cruzar el 62% (una vez), registro escalonado,
  desplazamiento de la banda. Todo sin opacidad sobre texto visible.
- **Calidad:** sin JS se ve el despliegue terminado y todo encendido; con
  movimiento reducido igual. Registro enfocable. Tokens de hover separados
  para texto (`accent-hover`) y relleno (`accent-fill-hover`).
- Estilos de la home en `src/app/home.css`; `globals.css` conserva lo
  compartido con las páginas de caso.


## R6 · Índigo nocturno (vigente; sustituye R3–R5)

- **Marca solo oscura.** Tokens de paleta en `src/styles/tokens.css`; glows
  iris 16% arriba a la derecha y ámbar 8% abajo a la izquierda (en `body`).
- **Logo:** cubo isométrico; M en iris, A en ámbar, aristas ocultas `#3A4052`.
  `<Logo variant="static|draw|assemble|deploy|spin">` en `components/brand`.
  draw = intro de la primera visita; assemble = header; split de la A al
  llegar a cada caso (ScrollTrigger); deploy = "Copiar correo"; spin = pie y 404.
- **Jerarquía:** solo el H1 es grande. Etiquetas en mono 11px mayúsculas.
- **Hero:** escena React Three Fiber (placas repo/build/live, cubo-logo con
  M y A de igual grosor y halo, órbita ámbar, parallax, separación al hacer
  scroll). Se monta con la primera interacción, DPR ≤ 2, pausa fuera de
  pantalla; alternativa SVG estática sin JS, sin WebGL o con movimiento reducido.
- **Secciones, cada una con su forma:** franja de servicios con divisores de
  1px (en móvil, filas compactas); casos editoriales alternados con panel
  técnico vivo; tabla densa de otros sistemas; línea de tiempo de Proceso que
  se llena con el scroll; Sobre mí en 4/8 + retícula de tecnologías; contacto
  centrado. Páginas de caso: listas de secuencia en lugar de cajas con flechas.
- **Móvil:** menú `<dialog>` a pantalla completa (enlaces Bricolage 32px), CTA
  "Agendar", badge corto. Sin JS vuelve la píldora de navegación.
- **Movimiento:** GSAP + ScrollTrigger + Lenis, cargados con la primera
  interacción. Botones con altura mínima de 44px (área táctil).
- **Lighthouse (build estático, local):** móvil 90/100/100/100, escritorio
  100/100/100/100 (rendimiento/accesibilidad/buenas prácticas/SEO).


## R7 · Noche / Día (vigente; sustituye la paleta de R6)

- **Dos temas con acento propio** en `html[data-theme]` (`src/styles/tokens.css`):
  Noche (por defecto) negro + naranja Flame `#FF5101` (6.43:1 sobre negro); Día blanco +
  azul Cornflower oscurecido a `#4562F0` (el `#4F6BFF` pedido daba 4.30:1 sobre blanco; el
  nuevo da 4.93:1 sobre `--bg` y 4.54:1 sobre `--surface`). Tokens: `--bg --surface --line
  --line-strong --text --muted --accent --btn-bg --btn-fg`, más `--field-line` (borde de
  campos, ≥3:1). Iris y ámbar ya no existen.
- **Monocromo**: el acento solo va en la A del logo, "futuro.", el botón principal, el punto
  de "Disponible" y el foco. Métricas en `--text`. Sin glows ni sombras.
- **Tema**: primera visita según `prefers-color-scheme`; la elección se guarda en
  `localStorage` y la aplica un script inline en `<head>` (`src/lib/head-script.ts`) antes del
  primer pintado. `ThemeToggle` (44px) en el header: la A del logo sube y cae (560ms) y el
  tema cambia a la mitad del salto; los colores pasan en 300ms. Movimiento reducido: instantáneo.
- **Botones** cuadrados, JetBrains Mono 11px en mayúsculas (0.08em) con flecha →, 44px de alto.
  CTA únicos: principal "Cotiza tu proyecto" (al formulario), secundario "Ver casos".
- **Hero** enmarcado con líneas de 1px y marcadores "+" en las esquinas; la escena 3D usa los
  tokens del tema (placas monocromas, placa superior con borde de acento, cubo M/A del logo).
  El SVG estático es su skeleton (mismo cuadro, brillo sutil mientras carga; CLS 0).
- **Contacto**: formulario como acción principal (`docs/CONTACTO.md`); correo como alternativa.
- **Movimiento nuevo**: contador de métricas con desenfoque que se aclara; preloader solo en la
  primera visita (1.2s, frase mono rotativa sin opacidad); View Transition del título del caso
  (tarjeta → página del caso).
- **Rendimiento**: GSAP, Lenis y three se cargan con import dinámico tras la primera
  interacción; la escena no hace setState por fotograma, pasa a `frameloop="demand"` fuera de
  pantalla y baja el DPR a 1 si cae el FPS. Las etiquetas de las placas son spans proyectados
  por ref (las raíces de `<Html>` de drei cancelaban la View Transition). Solo se precarga la
  fuente del H1. Lighthouse móvil (Slow 4G, CPU 4×, build local): 99/100/100/100.


## R8 · Brasa (Noche) y Día

Problema que resuelve: con negro y blanco puros y un acento de un solo valor, todo vivía en un plano
(las sombras estaban en `none` y la superficie casi no se distinguía del fondo). Se mantienen tres
colores por tema, pero cada uno es una familia. Fuente única: `src/styles/tokens.css`.

- **Mismo tratamiento, paleta propia.** Noche: negro cálido · marfil · naranja. Día: `#FFFFFF` ·
  `#050505` · `#548CFF` (paleta definida por Max).
- **Fondo en capas:** `--bg-deep` → `--bg` → `--surface` → `--surface-raised`. Sombras activas
  (`--shadow-raised`, `--shadow-floating`): en Noche con filo de luz interior, en Día tintadas de azul.
- **El acento como luz:** `--glow` detrás del cubo del hero (`.hero-frame::before`), `--glow-soft` muy
  tenue en el cuerpo, halo en el punto "Disponible".
- **Dos tonos de acento:** `--accent-fill` es el color de marca visible (titular, subrayado del CTA,
  A del logo, cubo 3D, punto); `--accent` es la versión para texto chico con AA. En Día, `#548CFF`
  da 3.2:1 sobre blanco, así que el texto chico usa `#1A64FF` (4.9:1).
- **Grano:** `body::after` fijo, `--grain-opacity` 7 % en Noche y 4 % en Día; se apaga con
  `prefers-reduced-transparency` y `forced-colors`.
- **CTA «Cotiza tu proyecto» = `.cta-link`:** texto subrayado sin caja (elección de Max: sin degradado
  ni botón lleno). Bricolage 600, subrayado de 2 px en `--accent-fill`, flecha en `--accent`, 44 px de
  alto. Se usa en el encabezado, el menú móvil, el hero, el cierre de cada caso y el envío del
  formulario. "Ver casos" pasa a `.text-link` para no pesar más que el principal. `.button` queda para
  acciones secundarias (probar demo, repositorio, copiar correo, cookies).

### El acento con funciones fijas (opción B)

El acento tiene trabajos concretos y se repite en toda la portada, no solo en el hero:

- **Señales (texto chico, `--accent`):** número de cada servicio, índice del selector de proyectos,
  «CASO 0N», nodos del proceso.
- **Señales (grande o gráfico, `--accent-fill`):** cifras del hero (28 px), punto final de cada título
  de sección (`.section-head h2::after`, oculto a lectores de pantalla), relleno de la línea del
  proceso al hacer scroll, subrayado de la sección activa del menú, subrayado de los enlaces (55 %),
  selección de texto (con texto `#050505`).
- **Momento:** la sección de contacto repite la luz del hero (`--glow`), con línea superior de 2 px en
  acento y «tu próximo proyecto» resaltado. La página abre y cierra con el mismo gesto.
- No usar el acento como fondo de bloques ni en degradados de botones.

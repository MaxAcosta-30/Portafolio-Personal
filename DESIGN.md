---
name: Hangar en vivo
description: Portafolio de Max Acosta — señalética industrial con un despliegue real de Hangar como elemento firma
colors:
  background: "#111210"
  surface: "#1a1b18"
  foreground: "#e9e6dd"
  muted: "#a3a097"
  accent: "#f2c230"
  accent-fill: "#f2c230"
  on-accent: "#111210"
  success: "#4ade80"
  light-background: "#eceae3"
  light-surface: "#f6f4ee"
  light-foreground: "#16150f"
  light-muted: "#5a574d"
  light-accent-text: "#7a5d00"
  light-success: "#15803d"
typography:
  display:
    fontFamily: "Big Shoulders (variable, opsz), mayúsculas, 800"
    fontSize: "clamp(3.5rem, 0.6rem + 8.2vw, 9rem)"
    lineHeight: 0.9
  body:
    fontFamily: "Instrument Sans"
    fontSize: "17px"
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono (código, registro, stack, correo)"
rounded:
  control: "0.25rem"
  surface: "0.375rem"
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

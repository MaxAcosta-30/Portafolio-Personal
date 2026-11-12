# Estado del proyecto

**Fase:** 9 · Entregar (pre-publicación en Cloudflare Pages). Actualizado: 2026-11-08.

## Rama `optimizacion/pre-deploy` (sobre `rediseno/brasa`)

Medido con Lighthouse 13.6 móvil (simulado) sobre el build estático:

| Página | Antes | Después |
|---|---|---|
| `/` | 98 | 97–99 (variación de la máquina) |
| `/proyectos/hito` | 93 | 89–92 (LCP simulado 3.0 s; con estrangulamiento real 1.7 s) |
| `/proyectos/hangar` | 95 | 95–96 |
| `/proyectos/taskflow-pro` | 97 | 96 |

Accesibilidad, buenas prácticas y SEO: 100 en las cuatro.

Datos móviles (recorrer toda la portada a 390 px, transferencia comprimida): **759 KB**; con ahorro de datos activado **504 KB** (no se descarga el 3D).

Hecho:
- `sizes` de la vitrina medidos por contexto (portada / caso) y anchos 320 y 480 nuevos: el celular ya no baja capturas de 1600 px para huecos de 263 px.
- Captura principal de `/proyectos/hito` con `fetchpriority="high"` y sin lazy.
- Ahorro de datos: con Save-Data, red 2G/3G o `prefers-reduced-data` el hero 3D no se descarga (queda el SVG).
- SEO: `robots.txt` y `sitemap.xml` generados desde `NEXT_PUBLIC_SITE_URL` (antes decían `tu-dominio.com` y el sitemap tenía mal el namespace); el build falla en Cloudflare si falta la variable.
- Imágenes para redes en PNG con la paleta Brasa y el titular vigente (antes: «Software que se siente futuro.» y SVG que las redes no muestran).
- Caché de una semana para `/images/*` y `og-*.png`.
- Retiradas `/design-system`, `/muestra` y las fuentes Plex que solo usaban ellas (decisión de Max).
- 3D de bajo consumo (se mantiene en todos los dispositivos, decisión de Max): 30 FPS con `frameloop="demand"` y un limitador, sin fotogramas fuera de pantalla, resolución máx. 1.5× (1× en equipos de ≤ 4 núcleos o ≤ 4 GB). Medido en celular emulado con la escena a la vista: CPU 94 % → 45 %, dibujos/s 296 → 151, lienzo 632² → 474² px (render por software: vale la proporción, no el absoluto).
- Arreglo de causa: si el visitante tocaba la página antes de que React arrancara, el 3D no montaba hasta otra interacción (8/8 en celular emulado; era la prueba intermitente «View Transition»). `headScript` anota `data-interacted` y HeroVisual lo lee: 0/8.
- Se descartó `experimental.inlineCss`: el HTML de la portada pasaba de 21 a 59 KB comprimido en cada visita.

## Rama `rediseno/paginas` (2026-11-11, sin commit)

Pedido de Max: menos scroll, un apartado por página; y correcciones del revisor (capturas en `~/Desktop/cambios`).

- Portada (`/`): hero, selector de proyectos y resumen de servicios. Apartados nuevos: `/proyectos` (casos + otros sistemas), `/servicios` (servicios con respaldos + proceso), `/sobre-mi` (bio, experiencia, tecnologías) y `/contacto` (formulario). Navegación con `aria-current="page"`; los casos cuentan como Proyectos.
- «+6 SISTEMAS BACKEND» en mayúsculas en el selector.
- Quitada la sección «Fuentes» de Hito, Hangar y TaskFlow (las fuentes siguen junto a cada dato).
- Aviso de cookies en ventana emergente centrada (`<dialog>` modal). Arreglo de causa: al hidratar se abría y cerraba para quien ya había elegido y le robaba el foco a la página.
- Caso Hito: sin enlaces al `CLAUDE.md` del repo (decisión de Max); «Límites declarados» pasa a «Límites».
- Pie nuevo en todas las páginas (referencias en `~/Desktop/cambios`): marca y oferta, Navegación, Proyectos y Contacto (ubicación, correo, GitHub y LinkedIn); barra inferior con © y avisos. Sin WhatsApp: no hay número en el contenido.
- Cambiar de apartado siempre abre arriba (`ScrollToTop` en el layout + `data-scroll-behavior="smooth"`): Next 16 ya no anula el scroll suave al navegar y la subida animada se cortaba a medias. Prueba de regresión en `homepage.spec.ts`.
- Sitemap con los apartados nuevos. 76/76 pruebas, lint, tipos y build en verde.
- Hito (otro repo, `repos-portafolio/Hito`, rama `ui/landing-centrado`, sin commit): «Tu cliente aprueba desde su celular» y «Quién lo hizo» centrados, letra de 19–22 px y menos aire. Build y oxlint en verde.

## Pendientes

- Publicar: Cloudflare Pages + `NEXT_PUBLIC_SITE_URL`, luego Search Console, Bing Webmaster Tools, Analytics y sitemap (ver `docs/SEO_SETUP.md`).

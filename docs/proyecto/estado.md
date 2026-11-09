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

## Pendientes

- Publicar: Cloudflare Pages + `NEXT_PUBLIC_SITE_URL`, luego Search Console, Bing Webmaster Tools, Analytics y sitemap (ver `docs/SEO_SETUP.md`).

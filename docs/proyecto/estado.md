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
- Se descartó `experimental.inlineCss`: el HTML de la portada pasaba de 21 a 59 KB comprimido en cada visita.

## Pendientes

- Prueba inestable que ya existía: «View Transition» en `mobile` falla 2 de 3 veces también en `rediseno/brasa` (el 3D por software tarda en montar).
- Decidir: `/muestra` (página de una dirección vieja) y `/design-system` se publican con `noindex`; ¿se quitan del build?
- Publicar: Cloudflare Pages + `NEXT_PUBLIC_SITE_URL`, luego Search Console, Bing Webmaster Tools, Analytics y sitemap (ver `docs/SEO_SETUP.md`).

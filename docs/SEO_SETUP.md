# SEO técnico — configuración del portafolio (Prompt 10)

Fecha: 29 de octubre de 2026.

## Qué se implementó

### Metadatos por página

Todas las rutas estáticas tienen `title` y `description` únicos, sin keyword stuffing:

| Ruta | Título | Description | Indexar |
| --- | --- | --- | --- |
| `/` | Max Alexander Acosta Valencia · Desarrollador Full Stack | Intro del perfil | Sí |
| `/proyectos/hangar` | Hangar · Caso de estudio · Max Alexander Acosta Valencia | Introducción del caso Hangar | Sí |
| `/proyectos/taskflow-pro` | TaskFlow Pro · Caso de estudio · Max Alexander Acosta Valencia | Introducción del caso TaskFlow | Sí |
| `/design-system` | Sistema de diseño · Max Alexander Acosta Valencia | Referencia de desarrollo | No (noindex, nofollow) |

### Canonical URLs

Cada página declara su URL canónica absoluta en `alternates.canonical`, basada en `siteMetadata.siteUrl`.

### Open Graph

Cada página incluye `og:title`, `og:description`, `og:type`, `og:url` y `og:image` (URL absoluta basada en `siteMetadata.siteUrl`, que a su vez usa la variable de entorno `NEXT_PUBLIC_SITE_URL`). Las imágenes son SVG estáticos de 1200×630 px:

| Ruta | Imagen OG |
| --- | --- |
| `/` | `/og-image.svg` |
| `/proyectos/hangar` | `/og-hangar.svg` |
| `/proyectos/taskflow-pro` | `/og-taskflow.svg` |
| `/design-system` | Sin imagen OG (no indexar) |

Diseño minimalista: fondo liso (`#f7f5f0`), mucho espacio vacío, el nombre de Max, su rol real ("Desarrollador Full Stack") y una línea de acento sutil (`#195c52`). Sin texto diminuto ni decoración.

### Twitter/X cards

Cada página incluye `twitter:card: summary_large_image`, título, descripción e imagen (misma imagen OG absoluta).

### Twitter/X cards

Cada página incluye `twitter:card: summary_large_image`, título, descripción e imagen.

### robots.txt

`src/app/robots.ts` genera `/robots.txt`: permite rastrear todo y apunta al sitemap con `NEXT_PUBLIC_SITE_URL`. `/design-system` y `/muestra` no se bloquean ahí sino con `noindex` en su metadata (si robots las bloqueara, Google no podría leer el `noindex`).

### sitemap.xml

`src/app/sitemap.ts` genera `/sitemap.xml` con las 7 páginas públicas (portada, 3 casos y 3 legales), sin `lastmod` (cambiaría en cada build). Al publicar una página nueva, agregarla ahí. Imágenes para redes: `og-*.png` 1200×630 generadas con `node scripts/og-images.mjs` (PNG porque WhatsApp, LinkedIn y X no muestran SVG).

### Favicon

`public/favicon.svg`: ícono vectorial de 32×32 con la paleta del sistema (acento verde profundo).

### Web manifest

`public/site.webmanifest`: nombre, descripción, start_url, colores, icono SVG y `lang: es`.

### Structured data (JSON-LD)

En `layout.tsx`, dos bloques:

1. `Person`: nombre, URL, email, cargo, organización (Tecnológico Nacional de México), áreas de conocimiento y enlaces mismos (GitHub, LinkedIn).
2. `WebSite`: nombre del sitio, URL y acción de búsqueda potencial.

### HTML semántico

Ya existente: `lang="es"`, encabezados jerárquicos (h1/h2/h3/h4), `skip-link`, regiones `main`, `nav`, `footer`, `article`, `section`, `details`/`summary`, `aria-label`, `aria-labelledby`, `aria-current`, `aria-invalid`, `aria-describedby`, `aria-hidden` en iconos decorativos.

### Alt text

Las imágenes que existan (`og-image.png`, favicon) incluyen `alt`. No hay imágenes de contenido sin texto alternativo.

## Qué el propietario debe proveer / configurar

| Dato | Cómo usarlo | Nota |
| --- | --- | --- |
| Dominio real | Variable `NEXT_PUBLIC_SITE_URL` en Cloudflare Pages (obligatoria: el build falla sin ella); canonical, robots, sitemap y Open Graph salen de ahí | No se asume posesión de dominio (Prompt 13) |
| `public/og-image.svg` | Imagen OG ya generada (1200×630, SVG, < 300 KB) | Puede reemplazarse por un PNG optimizado si se prefiere |
| `public/og-hangar.svg` | Imagen OG del caso Hangar (1200×630, SVG) | Ya generada |
| `public/og-taskflow.svg` | Imagen OG del caso TaskFlow Pro (1200×630, SVG) | Ya generada |
| Google Analytics | Measurement ID (Prompt 14) | No se conectó aún (requiere cuenta del usuario) |
| Google Search Console | Token de verificación o TXT DNS (Prompt 14) | No se conectó aún |
| CV público descargable | `public/CV_MAX-2.pdf` o similar | No se publicó automáticamente el PDF local |

## IMPORTANTE

- **No se conectó Google Analytics ni Search Console.** Esos servicios requieren credenciales de cuenta del propietario (Prompt 10: "Todavía NO conectes Google Analytics ni Search Console"). Queda documentado exactamente qué identificadores no secretos se necesitarán en el Prompt 14.
- No se inventó ubicación, empresa ni servicio. La URL pública sale de `NEXT_PUBLIC_SITE_URL`; en local el respaldo es `http://127.0.0.1:3000`.
- No hay keyword stuffing: las descripciones son reales y extraídas del contenido del portafolio.

## Verificación

- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm run build`: correcto; exportación estática con todas las rutas.
- `npm test`: 30 pruebas aprobadas.

## Siguiente paso pendiente

El SEO técnico está cerrado. Sigue pendiente el **Prompt 11 — Performance + Accesibilidad** (Lighthouse, Core Web Vitals, carga inicial, imágenes, fonts, CLS, LCP, INP, accesibilidad, reduced motion, etc.), que requiere un nuevo prompt explícito antes de avanzar.

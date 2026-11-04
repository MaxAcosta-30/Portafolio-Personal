# R2 · Fase B — imágenes y movimiento

> Registro histórico: las fotografías se retiraron a petición del propietario. La home actual muestra diagramas y código real; ver GITHUB_REVIEW.md, sección de fragmentos para la home.


Fecha: 29 de octubre de 2026. Alcance: dirección oscura y minimalista existente, sin rediseño ni despliegue.

## Cambios y archivos

- `src/content/project-images.ts`, `src/components/project-photo.tsx`, `public/images/editorial/`: dos fotografías aprobadas, locales, con crédito y aviso editorial. Hover o foco en escritorio; debajo del texto en móvil. Procedencia, licencia y hashes en `docs/R2_IMAGE_SOURCES.md`.
- `src/components/home-motion.tsx`, `src/app/page.tsx`: GSAP core importado de forma asíncrona, contexto acotado y limpieza al desmontar. Pipeline de 960ms nominales, una vez por sesión cuando sessionStorage está disponible; sin almacenamiento, una vez por montaje. Secciones de 400ms y 12px, sin ocultarlas antes de iniciar la animación.
- `src/styles/tokens.css`, `src/app/globals.css`: tokens de movimiento, hover de 4px/180ms según transitions.dev, indicador de navegación con opacity/transform, recorte contenido de la fotografía de código y soporte reduced motion. Se elimina la entrada anterior del hero para concentrar la secuencia en el pipeline. No se cambian los valores de paleta, tipografía, espaciado ni layout existentes.
- `src/components/architecture-diagram.tsx`, ambas páginas de casos: SVG de trazo fino con disposición vertical en móvil y alternativa textual ordenada. Los nodos y descripciones proceden de los arrays de arquitectura existentes y conservan sus fuentes. Hangar separa despliegue de routing; TaskFlow separa cambios del tablero de automatizaciones.
- `tests/home-motion.spec.ts`, `tests/homepage.spec.ts`, `playwright.config.ts`: pruebas de la fase y capturas completas actualizadas.
- `DESIGN.md`: comportamiento final documentado.

## Verificación

- `npm run lint`: aprobado, sin advertencias de ESLint.
- `npm run typecheck`: aprobado.
- `npm run build`: aprobado; exportación estática conservada para Cloudflare.
- `npm test`: 48 pruebas aprobadas en Chromium, escritorio y móvil.
- Secuencia del pipeline: comprobación del estado intermedio y de su finalización entre 800 y 1500ms; sin repetición al regresar ni al recargar dentro de la sesión.
- Fotografías: carga diferida, dimensiones explícitas, hover, foco por teclado, crédito y presentación móvil comprobados.
- Imágenes retenidas antes de cargar y liberadas después: geometría idéntica y suma de layout shifts observados igual a 0. Esta medición aísla la carga de imágenes después de las fuentes; no es una afirmación de CLS de campo del sitio completo.
- Lectura y anclas probadas con JavaScript desactivado; contenido visible con reduced motion. Su activación cancela y revierte las animaciones en curso.
- Sin desbordamiento horizontal en 320, 390, 768, 1024 y 1920px. Conservados foco, salto al contenido y navegación de la Fase A.
- Revisión visual de las filas con fotos y los diagramas a 1440 y 390px: aprobado dentro del alcance. No se añaden tarjetas, sombras, gradientes ni recursos decorativos.

## Peso de JavaScript

Medición sobre los archivos de producción locales. Se suman los scripts referenciados por el HTML de la home antes y después, incluyendo el polyfill heredado, que no cambió. Gzip local por archivo, nivel 9; no representa una medición de transferencia de Cloudflare.

| Medida | Bytes sin comprimir | Bytes gzip |
| --- | ---: | ---: |
| Scripts iniciales, Fase A | 595399 | 185125 |
| Scripts iniciales, Fase B | 611978 | 191507 |
| Diferencia inicial, incluido next/image y orquestación | 16579 | 6382 |
| Núcleo GSAP asíncrono compartido | 51569 | 19724 |
| Incremento total de la home con GSAP, sin caché | 68148 | 26106 |

GSAP: **19.3 KiB gzip**. Incremento total: **25.5 KiB gzip**. La dependencia ya existía para Hangar; se reutiliza su chunk, no se instala otro paquete ni ScrollTrigger. El incremento inicial incluye next/image. Chunk GSAP: `out/_next/static/chunks/c15bf2b0-182b384b62e205ff.js`.

## Capturas para revisión

- `screenshots/full-desktop.png`: 1440 × 5263, página completa.
- `screenshots/full-mobile.png`: 390 × 7303, página completa.
- `screenshots/preview-hangar-desktop.png`, `screenshots/preview-taskflow-pro-desktop.png`: fotos reveladas en escritorio.
- `screenshots/preview-hangar-mobile.png`, `screenshots/preview-taskflow-pro-mobile.png`: disposición móvil.
- `screenshots/no-js-desktop.png`, `screenshots/no-js-mobile.png`: contenido sin JavaScript.
- `screenshots/reduced-motion-desktop.png`, `screenshots/reduced-motion-mobile.png`: movimiento reducido.

## Límites y pendientes

Las fotografías no sustituyen evidencia de producto. Las capturas reales de Hangar y TaskFlow Pro siguen sin estar disponibles; no se solicitan para completar esta fase ni se simulan.

Safari, Firefox, dispositivos físicos y transferencia tras publicar en Cloudflare: **NO VERIFICADO**. No quedan errores de las comprobaciones ejecutadas. El borrador de Sobre mí y el CV público pendientes de la Fase A no se modifican.

Revisar visualmente el encuadre de ambas fotografías, su aparición por hover/foco y la secuencia del pipeline. La Fase B termina aquí.

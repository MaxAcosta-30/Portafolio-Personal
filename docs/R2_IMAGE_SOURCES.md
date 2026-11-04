# Fotografías editoriales · R2, Fase B

> Registro histórico: las fotografías se retiraron a petición del propietario. La home actual muestra diagramas y código real; ver GITHUB_REVIEW.md, sección de fragmentos para la home.


El propietario aprobó ambas fotografías el 29 de octubre de 2026, en sustitución de capturas de programas que no puede ejecutar. Se identifican expresamente como fotografías editoriales: no son interfaces de Hangar o TaskFlow Pro ni evidencia de su funcionamiento.

| Uso | Autor y fotografía | Fuente |
| --- | --- | --- |
| Fila de Hangar | Rob Wingate · Code on a computer screen | https://unsplash.com/photos/code-on-a-computer-screen-LnzSzH24XS8 |
| Fila de TaskFlow Pro | Bernd Dittrich · Computer screen displaying code and project files | https://unsplash.com/photos/computer-screen-displaying-code-and-project-files-A9jp72Owzvs |

Ambas fichas indican la [licencia Unsplash](https://unsplash.com/license), que permite uso comercial y modificación. Se conservan crédito visible y enlace a la fotografía original.

Descarga: CDN oficial images.unsplash.com, 1200px de ancho, formato WebP, calidad 78. Inspección visual realizada sobre los dos archivos locales. La segunda fotografía se encuadra mediante CSS en el código JavaScript, dejando fuera el panel de terminal y la marca del proyecto ajeno. Los archivos conservan la fotografía original completa.

Se sirven desde el propio sitio, sin solicitudes de imágenes a Unsplash durante la visita. next/image usa dimensiones explícitas y unoptimized porque los WebP ya están preparados y el sitio se exporta estáticamente para Cloudflare. Carga diferida y espacio reservado con aspect-ratio.

| Archivo | Dimensiones | Peso | SHA-256 |
| --- | --- | --- | --- |
| `public/images/editorial/software-code.webp` | 1200 × 800 | 260,078 bytes | `ac83de39aff2f5d1cecff5062f4a408c9e07bab49b9af5f201304a944d897823` |
| `public/images/editorial/workspace-code.webp` | 1200 × 800 | 353,918 bytes | `6505898bacd2a7961e7a511cb5df0065c7f595eaf5f25d711d04ea1ae499abda` |

Datos editoriales centralizados en src/content/project-images.ts. En escritorio con cursor aparecen al pasar por la fila o enfocarla por teclado; en dispositivos táctiles y móvil se mantienen visibles debajo del texto. Las capturas reales de las aplicaciones siguen sin estar disponibles; no se simulan.

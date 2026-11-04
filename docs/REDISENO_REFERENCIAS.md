# Rediseño — análisis de referencias y estado

Fecha: 29 de octubre de 2026. Registro del análisis del Paso 1. Después, el propietario autorizó trabajar
en la UI/UX. La implementación y verificaciones posteriores están en
[REDISENO_REVIEW.md](REDISENO_REVIEW.md). Las observaciones siguientes describen
el borrador anterior, no el resultado final.

## Referencias vigentes

| Referencia | Papel | Evidencia observada |
| --- | --- | --- |
| [xmcp](https://minimal.gallery/xmcp/) | Principal: composición, jerarquía y espacio | Captura local observada y ficha consultada; analizar el sitio dentro de la galería, no el marco de Minimal Gallery |
| [Tequs](https://www.tequs.com/) | Secundaria: protagonismo del producto y comunicación técnica | Página abierta en navegador; primer viewport y estructura de contenido observados |
| [Core-A](https://www.siteinspire.com/website/13646-core-a-studios) | Terciaria: detalle funcional muy limitado | Captura local observada; acceso web mediante extractor no disponible |

Tequs sustituye a Tamal Sen. `references/design/tamal-sen.png` queda como material
histórico; no se eliminó. No existe todavía una captura local de Tequs.

## Qué se observa y qué se propone tomar

**xmcp.** La captura muestra una navegación compacta, un pequeño indicador de
versión, un titular centrado en dos líneas y un visual monocromo protagonista
con mucho espacio alrededor. Propuesta: mantener la contención del titular,
una navegación discreta y un único mecanismo visual relacionado con Hangar.
La ilustración concreta de xmcp no es arquitectura de Max ni debe copiarse.

**Tequs.** En el viewport observado: marca a la izquierda; enlaces agrupados
hacia el centro y contacto a la derecha; un equipo industrial grande ocupa el
centro y la derecha. El titular está alineado a la izquierda y explica producto
y beneficio en varias líneas. Un texto de apoyo identifica usos, seguido de
indicadores y una acción. Fondo oscuro, texto claro y azul en acciones. El
banner de cookies aparece como panel a la derecha. No es el mismo esquema
centrado de xmcp.

Propuesta: tomar de Tequs la relación entre trabajo real, explicación y acción.
En Max, hacer que el pipeline explique qué entra, qué transforma cada etapa y
qué obtiene el usuario. Mantener xmcp como base; no mezclar ambas composiciones
literalmente ni superponer texto sobre un diagrama que debe leerse.

**Core-A.** La captura muestra una pieza audiovisual dominante y navegación
experimental alrededor. Su utilidad aquí es muy limitada: un detalle de esquina
solo si resuelve una necesidad. No tomar vídeo, navegación rotatoria o lenguaje
de agencia audiovisual.

No se propone trasladar cifras, certificaciones, clientes, logos, prensa,
inversores, renders, chatbot o configurador de Tequs. Tampoco se conservan como
requisito las etiquetas numeradas ni las mayúsculas heredadas de Tamal Sen.
Animaciones y comportamiento móvil de las referencias: **NO VERIFICADO**.

## Estado visual observado del portafolio

Se abrió `http://127.0.0.1:3000/` y se observó el primer viewport de escritorio.
El fondo oscuro, el titular centrado y la reducción de secciones ya están en el
código. El titular explica backend y tiempo real; Outlier sigue separado de los
proyectos. Son avances aprovechables del borrador.

Problemas visibles o constatados en el código:

- El titular tiene mucho más protagonismo que el mecanismo de Hangar. El visual
  actual son cuatro puntos y líneas; los nombres de las etapas aportan secuencia,
  pero no explican responsabilidades, entradas o salidas.
- La insignia queda aislada a la izquierda mientras el resto del hero se centra.
- El banner ocupa todo el borde inferior y tapa parte del diagrama y las acciones.
  No cumple el papel discreto de esquina descrito por el prompt.
- La navegación conserva su composición anterior y no incluye acción de GitHub.
- «Ver caso de estudio» apunta a `#proyectos`. Los enlaces «Leer el caso» apuntan
  a GitHub en vez de a las páginas internas existentes.
- Los tokens parten de 48px para display en móvil, aunque el documento propone
  28–34px; el SVG reduce sus etiquetas al escalar. Móvil actual: **NO VERIFICADO**.
- El acento `#195c52` sobre `#0a0a0a` tiene contraste calculado de 2.54:1, insuficiente
  para texto normal y para el foco actual. El secundario `#a8a8a8` da 8.33:1;
  el cálculo anterior de 5.25:1 en este reporte era incorrecto.
- Los tokens son globales: modifican también casos de estudio, formularios y
  documentación visual. Ese efecto debe controlarse antes de aprobar la home.
- Hay contenido y medidas directamente en `page.tsx`, mientras `src/content/site.ts`
  conserva textos de otra versión. Falta consolidación del sistema y el contenido.

`DESIGN.md` describe el borrador oscuro, pero aún menciona Tamal Sen. `PRODUCT.md`
y README conservan referencias a direcciones anteriores. No se actualizaron en
este análisis: primero debe cerrarse la intención visual del Paso 1.

## Verificación y siguiente límite

Comprobaciones técnicas de la revisión inmediatamente anterior: lint aprobado;
typecheck fallido en `src/app/page.tsx:118` por posible `project.summary === null`.
No se repitieron ni se corrigieron en este análisis. Build, suite del rediseño,
contraste renderizado, producción y ciclo de capturas 1440×800 / 390×844:
**NO VERIFICADO**. No existe evidencia local del ciclo final en `screenshots/`.

Conclusión de diseño: hay una exploración implementada parcialmente, pero la
selección de principios de referencia sigue abierta. Lo siguiente es cerrar
qué se toma de xmcp y Tequs y la función del visual de Hangar; después revisar
las propuestas de los pasos 2–6. Este análisis no avanza esos pasos ni modifica
la UI.

# Portafolio digital — Max Alexander Acosta Valencia

## Estado actual: rediseño de la home (Prompt R)

Dirección actual: **oscura y minimalista**, basada en xmcp y Tequs.
Revisión y capturas: [REDISENO_REVIEW.md](docs/REDISENO_REVIEW.md).
El propietario tiene pendiente la revisión visual final. `/` contiene la página principal:
navegación, hero, proyectos destacados, seis sistemas backend, perfil, formación,
Outlier como experiencia profesional, tecnologías por función y contacto directo.
El sistema visual vigente está en `DESIGN.md`.

El contenido está centralizado en `src/content/`, con fuentes del CV y del brief.
Hangar tiene un caso completo en `/proyectos/hangar` (`ready`), con diagramas HTML,
fuentes de código y límites explícitos. TaskFlow Pro tiene su caso completo en
`/proyectos/taskflow-pro` (`ready`), con diagramas de arquitectura, real-time,
automatizaciones, observabilidad y seguridad. Los seis sistemas compactos están
listos editorialmente (`ready`). Se revisaron documentación y archivos
seleccionados de GitHub para completar enlaces y corregir descripciones. Esto no
equivale a una auditoría integral de código o resultados.
Los detalles técnicos usan disclosure nativo; no se añadieron dependencias ni
componentes cliente para la homepage.

## Ejecutar localmente

Node.js 24 (`.nvmrc`), npm y Git. Entorno comprobado: Node 24.21.0, npm 11.19.0,
Git 2.56.0. Next.js App Router, TypeScript, Tailwind CSS y estructura `src/`.

```bash
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000/. Si está ejecutándose la previsualización
con `npm start`, detenerla antes para liberar el puerto 3000.

Para previsualizar la exportación de producción:

```bash
npm run build
npm start
```

`start` sirve `out/`. El build usa Webpack porque Turbopack presentó restricciones
de puertos internos en este entorno. No se desactivaron comprobaciones de tipos.
Dentro del sandbox de Codex, los servidores y navegadores requieren ejecución
autorizada fuera del sandbox.

## Verificar

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium --only-shell
npm test
```

La instalación del navegador se necesita una sola vez por entorno. Los tests
sirven la exportación en el puerto 3100 y cierran ese servidor al terminar;
volver a compilar antes de ejecutarlos si cambió la UI. No requieren cuentas,
credenciales ni servicios externos. Opcionalmente,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` permite usar un Chromium ya instalado.

La suite incluye 32 pruebas: 4 de contenido, 8 del sistema de diseño, 8 de la
homepage, 6 de Hangar y 6 de TaskFlow Pro. Comprueba escritorio y móvil, axe en estados cerrados/abiertos,
navegación por teclado, anclas, contacto, targets táctiles y desbordamientos a
320, 390, 768, 1024 y 1920px. Las pruebas de contenido comprueban
coherencia y trazabilidad; no reemplazan la revisión de fuentes ni verifican
disponibilidad de enlaces. Revisión visual realizada en la fase 3:
[alcance, correcciones y limitaciones](docs/DESIGN_SYSTEM_REVIEW.md).
Revisión quick de la homepage de fase 5:
[cobertura, evidencia, decisiones y límites](docs/PORTFOLIO_REVIEW.md).
La fase 6 añade navegación entre páginas, lectura sin JavaScript y revisión de
los diagramas: [caso de Hangar](docs/HANGAR_REVIEW.md).

## Organización

- [PRODUCT.md](PRODUCT.md): contexto y límites de producto.
- [DESIGN.md](DESIGN.md): sistema vigente de la dirección B.
- [docs/CONTENT_ARCHITECTURE.md](docs/CONTENT_ARCHITECTURE.md): navegación,
  jerarquía, modelo de casos, criterios de publicación y material pendiente.
- [src/content/](src/content/): perfil, proyectos, navegación, tipos y fuentes;
  datos locales sin CMS, independientes de componentes visuales.
- [src/content/repositories.ts](src/content/repositories.ts): repositorios públicos
  y revisiones fijas de las fuentes consultadas.
- [docs/GITHUB_REVIEW.md](docs/GITHUB_REVIEW.md): material incorporado, diferencias
  con el CV y otros proyectos evaluados.
- [src/app/page.tsx](src/app/page.tsx): composición de la homepage.
- [src/app/proyectos/hangar/page.tsx](src/app/proyectos/hangar/page.tsx): caso de Hangar.
- [src/content/hangar-case-study.ts](src/content/hangar-case-study.ts): relato,
  diagramas y fuentes fijadas a una revisión pública.
- [src/components/hangar-diagrams.tsx](src/components/hangar-diagrams.tsx): flujos
  con orden de lectura semántico y topología de redes.
- [src/components/portfolio.tsx](src/components/portfolio.tsx): navegación y
  presentación de proyectos.
- [tests/homepage.spec.ts](tests/homepage.spec.ts): pruebas de la portada y capturas
  locales de revisión en `.impeccable/review/` (ignoradas por Git).
- [tests/content.spec.ts](tests/content.spec.ts): integridad de los datos.
- [src/styles/tokens.css](src/styles/tokens.css): fuente única de valores CSS,
  integrada directamente con Tailwind 4.
- [src/app/globals.css](src/app/globals.css): estilos base y componentes compartidos.
- [src/components/ui.tsx](src/components/ui.tsx): Button, Tag e iconos SVG.
- [docs/VISUAL_DIRECTIONS.md](docs/VISUAL_DIRECTIONS.md): exploración histórica;
  no usar sus alternativas como sistema vigente.

No hay biblioteca de componentes o animación adicional, backend, CMS ni base de
datos. GSAP se añade únicamente en la fase 8 para la animación narrativa del
pipeline de Hangar (reveal de pasos al entrar en viewport, sin layout shifts y
respetando `prefers-reduced-motion`).

## Cloudflare

La aplicación conserva `output: "export"`. En Cloudflare Pages:

- Raíz: raíz del repositorio.
- Comando: `npm run build`.
- Salida: `out`.
- Node: 24.

Variable obligatoria: `NEXT_PUBLIC_SITE_URL` (ver `docs/DEPLOYMENT.md`).
`/design-system` y `/muestra` se retiraron antes de publicar (8 nov 2026).

La exportación estática no admite lógica dinámica de servidor ni Server Actions.
Revisar alojamiento solo si una fase posterior lo requiere. No se agregó Wrangler
ni un adaptador de runtime. Referencias:
[Next.js](https://nextjs.org/docs/app/guides/static-exports) y
[Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## Git, skills y referencias

Repositorio en `main`, sin commits creados por esta sesión. `.gitignore` excluye
secretos de entorno, dependencias, compilaciones, temporales, `.impeccable/`,
`references/raw/`, `.wrangler/`, `.dev.vars*` y reportes de pruebas. Nunca colocar
secretos en archivos versionados; `.env.example` debe contener solo ejemplos.

Las skills solicitadas siguen detectadas: Impeccable, transitions-dev,
transitions-polish, make-interfaces-feel-better y las oficiales de GSAP. No hace
falta reinstalarlas. La fase 3 aplicó Impeccable y la revisión full de
make-interfaces-feel-better. El sidecar local `.impeccable/design.json` documenta
componentes para Impeccable; la aplicación no depende de ese archivo ignorado.

El CV local `CV_MAX-2.pdf` ya fue leído y está ignorado por Git. Se extrajeron
descripciones, tecnologías por proyecto, formación, Outlier y contacto; no se
copió a `public/`. Los ocho proyectos ya enlazan sus repositorios públicos.
Siguen pendientes demos públicas, imágenes, videos, mediciones y el despliegue en Cloudflare Pages.
Ver [revisión de GitHub](docs/GITHUB_REVIEW.md) y [material pendiente](references/README.md).
La redacción actual es española; no se implementó una versión bilingüe.

No avanzar a la fase siguiente sin un nuevo prompt explícito del propietario.

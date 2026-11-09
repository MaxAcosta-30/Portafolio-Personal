# Deployment — portafolio en Cloudflare Pages (Prompt 13)

Fecha: 29 de octubre de 2026. Dirección vigente: B, Plano de sistemas.

## Resumen

El portafolio es una aplicación Next.js con **exportación estática** (`output: "export"`) diseñada para desplegarse en **Cloudflare Pages**. No hay Server Actions, ni base de datos, ni adaptador de runtime. El build genera la carpeta `out/` que se sube como sitio estático. La única pieza de servidor es la Pages Function `functions/api/contact.ts` (formulario de contacto), que Cloudflare detecta y despliega sola desde la raíz del repositorio; ver `docs/CONTACTO.md`.

## Estado actual

- Repositorio en rama `main`, sin secrets versionados.
- `.gitignore` excluye `.env`, `.env.*`, `.dev.vars`, `.dev.vars.*`, `node_modules/`, `.next/`, `out/`, `test-results/`, `playwright-report/`, `.impeccable/`, `references/raw/`, `CV_MAX-2.pdf`.
- Build válido: `npm run build` genera `out/` con las rutas `/`, `/proyectos/hangar`, `/proyectos/taskflow-pro`, `/design-system`, `/_not-found`.
- `npm test`: 30 pruebas aprobadas.
- `npm run lint` y `npm run typecheck`: correctos.

## Qué hace el propietario (tú)

Estos pasos requieren tu cuenta y no deben ser realizados por mí:

1. **Iniciar sesión** en Cloudflare (dash.cloudflare.com).
2. **Crear o conectar** una cuenta de Cloudflare Pages.
3. **Elegir el repositorio** `MaxAcosta-30/Portafolio Digital` (o el nombre que uses) en GitHub.
4. **Autorizar GitHub** para que Cloudflare Pages lea el repositorio.
5. **Comprar o agregar un dominio** (opcional; si no tienes dominio, se usa el subdominio gratuito de Pages `*.pages.dev`).
6. **Modificar DNS** si usas un dominio propio (agregar CNAME o A record según indique Cloudflare).
7. **Agregar secrets** si en el futuro se requiere algún variable de entorno (hoy no hay ninguno necesario para el sitio estático).
8. **Confirmar el deployment** tras revisar la configuración de build.

## Qué yo ya hice (documentado aquí)

- Validé que el build funciona con `npm run build`.
- Preparé la configuración de Cloudflare Pages en `next.config.ts` (`output: "export"`).
- Verifiqué que `.gitignore` excluye secretos y artefactos locales.
- Generé este documento con los pasos exactos.
- Revisé la limpieza del repositorio (todo en `main`, sin commits pendientes).

## Configuración de Cloudflare Pages

| Campo | Valor |
| --- | --- |
| Proveedor de Git | GitHub |
| Repositorio | `MaxAcosta-30/Portafolio Digital` |
| Rama de producción | `main` |
| Comando de build | `npm run build` |
| Directorio de salida | `out` |
| Versión de Node | 24 (ver `.nvmrc`) |
| Framework preset | Next.js (detectado automáticamente) |
| Variables de entorno | `NEXT_PUBLIC_SITE_URL` **obligatoria** (URL pública sin `/` final, p. ej. `https://tu-proyecto.pages.dev`); sin ella el build falla a propósito. Más las del formulario (`docs/CONTACTO.md`) y Analytics |

## Pasos exactos de deployment

1. Ve a **Cloudflare Dashboard → Workers & Pages → Pages → Create a project**.
2. Conecta con **GitHub** y autoriza la aplicación.
3. Selecciona el repositorio `MaxAcosta-30/Portafolio Digital`.
4. En la configuración de build, confirma:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: 24
5. (Opcional) Agrega un dominio personalizado en **Pages → Tu proyecto → Custom domains**.
   - Si usas dominio propio, Cloudflare te dará los registros DNS (CNAME/A) que debes agregar en tu proveedor de DNS.
   - Sin dominio, el sitio estará disponible en `https://tu-proyecto.pages.dev`.
6. Haz clic en **Save and Deploy**.
7. Cloudflare ejecutará el build y publicará el sitio. Revisa que el deployment termine sin errores.

## Variables de entorno

El formulario de contacto necesita `RESEND_API_KEY` (secreto), `CONTACT_TO` y `CONTACT_FROM`, y opcionalmente el KV `CONTACT_RATE_LIMIT`; están detallados en `docs/CONTACTO.md`. Si en el futuro agregas alguna (por ejemplo, en el Prompt 14 para Analytics), deberás agregarla en **Cloudflare Pages → Tu proyecto → Settings → Environment variables** y volver a desplegar. Nunca agregues valores reales en el repositorio; `.env.local` está ignorado por Git.

## Notas importantes

- No se ha desplegado aún. Este documento prepara el proyecto para que tú lo hagas.
- No supongo que ya poseas un dominio. Si no tienes uno, el sitio funciona con el subdominio gratuito de Cloudflare Pages.
- `/design-system` se exporta con `noindex, nofollow`; es documentación de desarrollo, no control de acceso. Antes de publicar, decidir si se conserva como ruta pública o se retira.
- La exportación estática no admite lógica dinámica de servidor ni Server Actions; el formulario usa una Pages Function. No se agregó un adaptador de runtime.
- Caché (`public/_headers`): HTML con `max-age=0, must-revalidate`; `/_next/static/*` (JS, CSS y fuentes) con `max-age=31536000, immutable`.

## Verificación post-deployment (tú)

Tras confirmar el deployment, revisa:
- El sitio carga en la URL asignada (subdominio `*.pages.dev` o tu dominio).
- Las rutas `/proyectos/hangar` y `/proyectos/taskflow-pro` responden correctamente.
- Los enlaces de repositorios (GitHub) abren bien.
- El enlace de correo ("Escríbeme") abre tu cliente de correo.
- No hay errores en la consola del navegador.

## Siguiente paso pendiente

El despliegue está preparado. Sigue pendiente el **Prompt 14 — Google Analytics + Search Console** (integrar Analytics con Measurement ID que tú proporcionarás, verificar Search Console, generar `docs/ANALYTICS_SEARCH_CONSOLE.md`), que requiere un nuevo prompt explícito antes de avanzar.

---

## Integración continua — CI/CD con GitHub Actions (Prompt 13B)

Se añadió `.github/workflows/ci.yml` que se ejecuta en `push` y `pull_request` sobre la rama `main`.

### Jobs del workflow

| Job | Qué hace | Cuándo se ejecuta |
|-----|----------|-------------------|
| `lint-typecheck-build` | `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` | Siempre (push y PR) |
| `tests-unitarios-contenido` | `npx playwright test content.spec.ts` | Después de lint-typecheck-build |
| `tests-e2e` | `npm run build` + `npm test` (Playwright desktop y mobile; instala Chromium) | Después de lint-typecheck-build |
| `audit` | `npm ci` + `npm audit --audit-level=moderate` (no bloquea si hay vulnerabilidades bajas) | Solo en `push`, después de lint-typecheck-build |

### Variables de entorno en CI

El workflow usa valores falsos (no secretos reales) para las variables que el build pudiera necesitar:
- `NEXT_PUBLIC_SITE_URL=https://ci-example.pages.dev`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- `NEXT_PUBLIC_GSC_VERIFICATION=ci-verification-token`

Nunca se usan secretos reales en el workflow. Si en el futuro el sitio requiere variables de entorno para el build, se agregan como secrets de repositorio de GitHub y se inyectan en el job correspondiente sin escribirlas en el archivo YAML.

### Permisos

El workflow declara `permissions: contents: read` (mínimo necesario para checkout).

### CD (despliegue continuo)

El sitio se despliega en **Cloudflare Pages**, que se conecta directamente al repositorio de GitHub y despliega automáticamente cada push a `main`. Por eso **no hay un job de deploy en GitHub Actions**: duplicarlo sería innecesario.

Si CI falla, para evitar que se publique una rama defectuosa, protege la rama `main` en GitHub:

1. Ve a **Settings → Branches → Add branch protection rule**.
2. Patrón de rama: `main`.
3. Marca **Require a pull request before merging**.
4. Marca **Require status checks to pass before merging** y agrega los checks del workflow:
   - `lint-typecheck-build`
   - `tests-unitarios-contenido`
   - `tests-e2e`
   - `audit` (opcional; si se marca como requerido, ten en cuenta que `continue-on-error` está activado para vulnerabilidades bajas, así que no bloqueará por ellas).

### Cómo ver los resultados del workflow

1. Ve a tu repositorio en GitHub → **Actions**.
2. Selecciona el workflow **CI**.
3. Haz clic en una ejecución para ver el detalle de cada job y sus logs.
4. Las pruebas E2E suben trazas (`trace: retain-on-failure`) y capturas en caso de fallo; se pueden descargar como artefactos desde la ejecución.

### Secretos de repositorio que podrías necesitar

Hoy el sitio estático **no requiere ningún secreto de repositorio** (no hay formulario con API key, ni backend, ni variables de entorno secretas). Si en el futuro agregas alguna (por ejemplo, Analytics con consentimiento en el Prompt 14B), deberás:

1. Agregar el secreto en **GitHub → Settings → Secrets and variables → Actions**.
2. Referenciarlo en el job correspondiente de `.github/workflows/ci.yml` (nunca escribir el valor real en el YAML).
3. Agregarlo también en **Cloudflare Pages → Settings → Environment variables** para que el despliegue en producción tenga acceso al mismo valor.

### Verificación

- No se puede ejecutar GitHub Actions localmente de forma fiable. Se validó la sintaxis del YAML y se ejecutaron localmente los mismos comandos que corre el workflow (`npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`), todos aprobados.
- Marcar como **NO VERIFICADO** que el workflow corre en GitHub hasta que subas el código y se ejecute la primera vez.


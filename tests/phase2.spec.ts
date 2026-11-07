import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { repositories } from "../src/content/repositories";

const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ page }) => {
  // Sin preloader ni banner de cookies: estos tests miden la interfaz, no la primera visita.
  await page.addInitScript(() => { localStorage.setItem("visited", "1"); localStorage.setItem("cookie_consent_v1", "false"); });
});

test("CTA únicos: 'Cotiza tu proyecto' y 'Ver casos'; sin 'Escríbeme' ni 'Agendar'", async ({ page }) => {
  for (const path of ["/", "/proyectos/hangar", "/proyectos/taskflow-pro", "/privacidad"]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text, path).not.toMatch(/Escríbeme|Agenda una llamada|Agendar/i);
    await expect(page.locator(".site-header").getByRole("link", { name: "Cotiza tu proyecto" })).toHaveAttribute("href", path === "/" ? "#contacto" : "/#contacto");
  }
});

test("formulario: valida al salir del campo, envía y muestra éxito", async ({ page }) => {
  let payload: Record<string, string> = {};
  await page.route("**/api/contact", async route => {
    payload = route.request().postDataJSON();
    await new Promise(resolve => setTimeout(resolve, 400));
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/#contacto");
  const name = page.getByRole("textbox", { name: "Nombre" });
  await name.focus();
  await page.getByRole("textbox", { name: "Correo" }).focus();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#contacto-name-error")).toHaveText("Escribe tu nombre.");
  await name.fill("Ana López");
  await expect(name).not.toHaveAttribute("aria-invalid");
  // Foco visible con borde de acento.
  const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
  await page.getByRole("textbox", { name: "Correo" }).focus();
  const accentRgb = await page.evaluate(color => { const probe = document.createElement("i"); probe.style.color = color; document.body.append(probe); const value = getComputedStyle(probe).color; probe.remove(); return value; }, accent);
  await expect(page.getByRole("textbox", { name: "Correo" })).toHaveCSS("border-top-color", accentRgb);

  // Enviar con errores enfoca el primer campo inválido y no llama al servidor.
  await page.getByRole("button", { name: "Cotiza tu proyecto" }).click();
  await expect(page.getByRole("textbox", { name: "Correo" })).toBeFocused();
  expect(payload).toEqual({});

  await page.getByRole("textbox", { name: "Correo" }).fill("ana@negocio.com");
  await page.getByRole("combobox", { name: "Qué necesitas" }).selectOption("Punto de venta");
  await page.getByRole("combobox", { name: /Presupuesto aproximado/ }).selectOption("$5,000 – $15,000 MXN");
  await page.getByRole("textbox", { name: "Mensaje" }).fill("Necesito un punto de venta para dos sucursales.");
  await page.getByRole("button", { name: "Cotiza tu proyecto" }).click();
  // Estado cargando: el botón usa el logo en variante deploy con "Enviando…".
  await expect(page.locator(".form-submit .logo[data-variant='deploy']")).toContainText("Enviando…");
  await expect(page.locator(".form-result")).toContainText("Mensaje enviado.");
  await expect(page.locator(".form-result")).toBeFocused();
  expect(payload).toMatchObject({ name: "Ana López", email: "ana@negocio.com", need: "Punto de venta", budget: "$5,000 – $15,000 MXN", sitio_web: "" });
});

test("formulario: muestra error con el correo como alternativa", async ({ page }) => {
  await page.route("**/api/contact", route => route.fulfill({ status: 429, json: { ok: false, error: "rate-limit" } }));
  await page.goto("/#contacto");
  await page.getByRole("textbox", { name: "Nombre" }).fill("Ana López");
  await page.getByRole("textbox", { name: "Correo" }).fill("ana@negocio.com");
  await page.getByRole("combobox", { name: "Qué necesitas" }).selectOption("API");
  await page.getByRole("textbox", { name: "Mensaje" }).fill("Quiero conectar mi tienda con mi inventario.");
  await page.getByRole("button", { name: "Cotiza tu proyecto" }).click();
  const alert = page.locator(".form-failure");
  await expect(alert).toContainText("Enviaste varios mensajes seguidos");
  await expect(alert.getByRole("link")).toHaveAttribute("href", /^mailto:/);
  await expect(alert).toBeFocused();
  // El honeypot existe pero está fuera del orden de tabulación y del árbol accesible.
  await expect(page.locator("input[name='sitio_web']")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator(".form-trap")).toHaveAttribute("aria-hidden", "true");
  const result = await new AxeBuilder({ page }).include("#contacto").withTags(tags).analyze();
  expect(result.violations).toEqual([]);
});

test("tema: respeta prefers-color-scheme, guarda la elección y aplica antes de pintar", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  await context.addInitScript(() => localStorage.setItem("visited", "1"));
  const page = await context.newPage();
  // El atributo ya está en el primer HTML pintado: lo fija el script inline de <head>.
  const response = await page.goto("/");
  expect(await response!.text()).toContain('localStorage.getItem("theme")');
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const toggle = page.locator(".site-header .theme-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Cambiar a modo oscuro");
  const box = (await toggle.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  // La A del logo salta y el tema cambia a la mitad del salto.
  await expect(page.locator("html")).toHaveAttribute("data-theme-hop", "");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-label", "Cambiar a modo claro");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await context.close();
});

test("tema con movimiento reducido: cambio instantáneo y contraste AA en ambos temas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  let result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations).toEqual([]);
  await page.locator(".site-header .theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme-hop", "");
  result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations).toEqual([]);
});

test("aviso de privacidad: enlazado desde el pie y el formulario, accesible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-footer").getByRole("link", { name: "Aviso de privacidad" })).toHaveAttribute("href", "/privacidad");
  await expect(page.locator("#contacto form").getByRole("link", { name: "aviso de privacidad" })).toHaveAttribute("href", "/privacidad");
  await page.goto("/privacidad");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Aviso de privacidad");
  for (const heading of ["Responsable", "Datos personales que se tratan", "Para qué se usan", "Con quién se comparten", "Tus derechos (ARCO) y revocación del consentimiento"]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
  }
  const result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations).toEqual([]);
});

test("métricas: cuentan hasta su valor y sin movimiento quedan fijas", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-metrics .count-up")).toHaveText([String(Object.keys(repositories).length), "2"]);
  await expect(page.locator(".hero-metrics .count-up").first()).toHaveAttribute("data-counted", "");
  await expect(page.locator(".hero-metrics .count-up").first()).toHaveCSS("filter", /none|blur\(0px\)/);
  const color = await page.locator(".hero-metrics dd").first().evaluate(el => getComputedStyle(el).color);
  const text = await page.evaluate(() => getComputedStyle(document.body).color);
  expect(color).toBe(text);
});

test("skeleton del hero: mismo cuadro antes y después de cargar la escena (CLS 0)", async ({ page }) => {
  await page.goto("/");
  // Solo la ventana skeleton → escena (el cambio de fuente de la carga inicial se mide con Lighthouse).
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver(list => { for (const entry of list.getEntries() as unknown as { value: number }[]) (window as unknown as { __cls: number }).__cls += entry.value; }).observe({ type: "layout-shift" });
  });
  // Caja de layout (sin transforms de la animación de entrada).
  const layoutBox = () => page.locator(".hero-stage").evaluate(el => { const node = el as HTMLElement; return [node.offsetLeft, node.offsetTop, node.offsetWidth, node.offsetHeight]; });
  const before = await layoutBox();
  await page.mouse.move(200, 300);
  await page.mouse.move(400, 320);
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
  expect(await layoutBox()).toEqual(before);
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBe(0);
});

test("View Transition: el título del caso viaja de la tarjeta a la página del caso", async ({ page }) => {
  const watch = () => page.evaluate(() => {
    const seen = new Set<string>();
    (window as unknown as { __vt: Set<string> }).__vt = seen;
    const until = performance.now() + 1500;
    const poll = () => { for (const animation of document.getAnimations()) { const pseudo = (animation.effect as KeyframeEffect | null)?.pseudoElement; if (pseudo) seen.add(pseudo); } if (performance.now() < until) requestAnimationFrame(poll); };
    requestAnimationFrame(poll);
  });
  const seen = () => page.evaluate(() => [...(window as unknown as { __vt: Set<string> }).__vt]);
  await page.goto("/");
  // Con la escena 3D montada (sus raíces no deben cancelar la transición).
  await page.mouse.move(200, 300);
  await page.mouse.move(400, 320);
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
  await page.locator("#hangar").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // prefetch del caso
  await watch();
  await page.locator("#hangar a.row-primary").click();
  await page.waitForURL("**/proyectos/hangar");
  await expect.poll(seen).toContain("::view-transition-group(case-title-hangar)");
  await expect.poll(seen).toContain("::view-transition-new(case-title-hangar)");
});

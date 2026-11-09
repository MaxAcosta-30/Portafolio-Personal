import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { contact, profile } from "../src/content/profile";
import { repositories } from "../src/content/repositories";
import { homeDesign } from "../src/content/home-design";
import { projects } from "../src/content/projects";

const captureDirectory = "screenshots";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("contenido, accesibilidad y capturas de la portada", async ({ page }, testInfo) => {
  await expect(page).toHaveTitle(`${profile.displayName} · ${profile.role}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(homeDesign.headline);
  for (const project of projects) {
    await expect(page.getByRole("heading", { name: project.name, exact: true })).toBeVisible();
  }
  for (const system of projects.filter((p) => p.kind === "engineering-system")) {
    if (system.repository) {
      await expect(page.locator(`#${system.id}`).getByRole("link", { name: /Ver repositorio/ })).toHaveAttribute("href", system.repository.href);
    }
  }
  await expect(page.locator("#proyectos")).not.toContainText("Outlier");
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await mkdir(captureDirectory, { recursive: true });
  await page.screenshot({ path: `${captureDirectory}/full-${testInfo.project.name}.png`, fullPage: true });
  await page.screenshot({ path: `${captureDirectory}/portfolio-${testInfo.project.name}-first.png` });
  await page.evaluate(() => scrollTo(0, 0));
  const selection = await page.locator("h1").evaluate(element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    // R8: la selección usa el color de marca del tema (--accent-fill) con texto #050505.
    const probe = document.createElement("span");
    probe.style.color = "var(--accent-fill)";
    document.body.append(probe);
    const accent = getComputedStyle(probe).color;
    probe.remove();
    const pseudo = getComputedStyle(element, "::selection");
    return { text: pseudo.color, background: pseudo.backgroundColor, accent };
  });
  expect(selection.text).toBe("rgb(5, 5, 5)");
  expect(selection.background).toBe(selection.accent);
  await page.screenshot({ path: `${captureDirectory}/portfolio-${testInfo.project.name}-selection.png` });
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
});

test("navegación, detalles, contacto y targets accesibles", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const label of ["Proyectos", "Proceso", "Sobre mí"]) {
    if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "Abrir menú" }).press("Enter");
    const link = page.getByRole("navigation").getByRole("link", { name: label, exact: true });
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    const href = await link.getAttribute("href");
    await page.keyboard.press("Enter");
    expect(new URL(page.url()).hash).toBe(href);
    const top = await page.locator(href!).evaluate((element) => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
  }
  const openState = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(openState.violations).toEqual([]);
  // El formulario es la acción principal; el correo queda como alternativa.
  await expect(page.locator("#contacto form")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Abrir en tu app de correo" })).toHaveAttribute("href", contact.email!.href);
  await expect(page.getByRole("button", { name: "Copiar correo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar CV" })).toHaveCount(0);
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => !document.getElementById(href.slice(1))));
  expect(brokenAnchors).toEqual([]);
  const smallTargets = await page.locator("a, summary").evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && (box.width < 44 || box.height < 44);
  }).map((element) => element.textContent));
  expect(smallTargets).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".nav-pill-link").first()).toHaveCSS("transition-duration", /^0s(, 0s)*$/);
  await mkdir(captureDirectory, { recursive: true });
  await page.locator("#contacto-name").focus();
  await page.locator("#contacto").screenshot({ path: `${captureDirectory}/portfolio-${testInfo.project.name}-contact.png` });
});

test("sin desbordamientos en móvil estrecho, tablet y pantalla grande", async ({ page }, testInfo) => {
  const widths = testInfo.project.name === "mobile" ? [320, 390] : [768, 1024, 1920];
  await mkdir(captureDirectory, { recursive: true });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    // Las etiquetas de la escena 3D se recolocan en el siguiente fotograma tras el resize.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const overflow = await page.locator("body *").evaluateAll((elements) => elements.filter((element) => {
      if (element.closest("details:not([open])") && !element.closest("summary")) return false;
      if (element.classList.contains("skip-link") || element.classList.contains("sr-only")) return false;
      // La cinta de servicios desborda a propósito dentro de un contenedor recortado.
      if (element.closest(".ticker")) return false;
      // La navegación en píldora se desplaza horizontalmente a propósito en pantallas estrechas.
      if (element.closest(".nav-pill")) return false;
      const scroller = element.closest(".technical-code pre, .code-well pre");
      if (scroller && element !== scroller && getComputedStyle(scroller).overflowX === "auto") return false;
      const box = element.getBoundingClientRect();
      return box.width > 0 && (box.right > innerWidth + 1 || box.left < -1);
    }).map((element) => `${element.tagName}.${element.className}`));
    expect(overflow, `Overflow at ${width}px`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const diagramSizes = await page.locator(".compact-architecture text").evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().width > 0).map(element => {
      const text = element as SVGTextElement;
      return parseFloat(getComputedStyle(text).fontSize) * text.getScreenCTM()!.a;
    }));
    diagramSizes.forEach(size => expect(size, `Diagram text at ${width}px`).toBeGreaterThanOrEqual(13));
    if ([320, 768, 1920].includes(width)) {
      await page.screenshot({ path: `${captureDirectory}/portfolio-${width}.png`, fullPage: true });
      await page.screenshot({ path: `${captureDirectory}/portfolio-${width}-first.png` });
    }
  }
});


test("consentimiento y preferencias sin cubrir el contenido", async ({ page }) => {
  const panel = page.getByRole("complementary", { name: "Tú decides sobre la medición" });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS("position", "static");
  await page.getByRole("button", { name: "Rechazar", exact: true }).click();
  await expect(panel).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("cookie_consent_v1"))).toBe("false");
  await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
  await expect(panel).toBeVisible();
  await page.getByRole("button", { name: "Aceptar", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("cookie_consent_v1"))).toBe("true");
  await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tú decides sobre la medición" })).toBeFocused();
  await page.getByRole("button", { name: "Rechazar", exact: true }).click();
  await page.reload();
  await expect(panel).toHaveCount(0);
});

test("hero: marca, métricas reales, escena 3D con alternativa y CTA", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".hero .badge-long")).toHaveText("Disponible para proyectos · Culiacán y remoto");
  await expect(page.locator(".hero .badge-short")).toHaveText("Disponible · Culiacán y remoto");
  await expect(page.locator(".hero-title em")).toHaveText("tu negocio");
  await expect(page.locator(".hero-metrics dd")).toHaveText(["103", String(Object.keys(repositories).length), "Hito, en vivo"]);
  await expect(page.getByRole("navigation", { name: "Elige un proyecto" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator(".hero-actions").getByRole("link", { name: "Cotiza tu proyecto" })).toHaveAttribute("href", "#contacto");
  await expect(page.locator(".hero-actions").getByRole("link", { name: "Ver casos" })).toHaveAttribute("href", "#proyectos");
  // La alternativa SVG está en el HTML; la escena WebGL la sustituye cuando carga.
  await expect(page.locator(".hero-fallback")).toHaveCount(1);
  // La escena 3D se monta con la primera interacción (no bloquea la carga).
  await page.waitForTimeout(500);
  await expect(page.locator(".hero-canvas")).toHaveCount(0);
  await page.mouse.move(200, 300);
  await page.mouse.move(400, 320);
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
  const box = (await page.locator(".hero-stage").boundingBox())!;
  if (testInfo.project.name === "desktop") expect(box.y).toBeLessThan(page.viewportSize()!.height);
  await expect(page.locator(".logs-card")).toContainText("✓ live");
  await expect(page.locator(".services-strip > ol > li")).toHaveCount(4);
});

test("ahorro de datos: con Save-Data el 3D no se descarga y queda la alternativa SVG", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, effectiveType: "4g" } }));
  await page.goto("/");
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1500);
  await expect(page.locator(".hero-canvas")).toHaveCount(0);
  await expect(page.locator(".hero-fallback")).toBeVisible();
  // Lo que el navegador de verdad descargó (el registro de la página, no un escucha externo).
  const chunks = await page.evaluate(() => performance.getEntriesByType("resource").map(entry => entry.name).filter(name => /\/chunks\/.+\.js$/.test(name)));
  const sources = await Promise.all(chunks.map(url => page.request.get(url).then(response => response.text())));
  expect(chunks.filter((_, i) => sources[i].includes("WebGLRenderer"))).toEqual([]);
});

test("R2: secciones, navegación activa, filas completas y borde del pie", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByText("Borrador para revisión", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Otros proyectos", exact: true })).toBeVisible();
  for (const label of ["Backend", "Tiempo real", "Datos", "Seguridad", "Infraestructura", "Calidad y pruebas"]) {
    await expect(page.locator(".technology-groups dt").filter({ hasText: new RegExp(`^${label}$`) })).toBeVisible();
  }
  for (const id of ["proyectos", "proceso", "sobre-mi"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.locator(`#${id}`).evaluate(element => element.scrollIntoView());
    await expect(page.locator(`.nav-pill a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
  }
  const footer = await page.locator(".home-footer").evaluate(element => ({
    padding: getComputedStyle(element).paddingInlineStart,
    inset: getComputedStyle(element, "::before").left,
    width: element.getBoundingClientRect().width,
  }));
  expect(footer.inset).toBe(footer.padding);
  expect(footer.width).toBe(await page.locator("main .page-container").first().evaluate(element => element.getBoundingClientRect().width));
  expect(await page.locator("a a").count()).toBe(0);
  await page.locator("#hangar .row-primary").focus();
  await expect(page.locator("#hangar")).toHaveCSS("outline-style", "solid");
  // The bottom padding is outside the title: it must still open the case.
  const row = page.locator("#hangar");
  await row.evaluate(element => element.scrollIntoView({ block: "end", behavior: "instant" }));
  const box = (await row.boundingBox())!;
  await page.mouse.click(box.x + 8, box.y + box.height - 8);
  await expect(page).toHaveURL(/\/proyectos\/hangar\/?$/);
});

test("R2: copiar correo confirma éxito y permite recuperarse de un rechazo", async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value: string) => { Object.assign(window, { copiedEmail: value }); } } }));
  await page.getByRole("button", { name: "Copiar correo", exact: true }).click();
  await expect(page.locator(".copy-email [role=status]")).toHaveText("Correo copiado.");
  expect(await page.evaluate(() => (window as Window & { copiedEmail?: string }).copiedEmail)).toBe(contact.email!.label);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Permission denied"); } } }));
  await expect(page.getByRole("button", { name: "Copiar correo", exact: true })).toHaveText("Copiar correo");
  await page.getByRole("button", { name: "Copiar correo", exact: true }).click();
  await expect(page.locator(".copy-email [role=status]")).toContainText(`No se pudo copiar. Puedes seleccionar el correo: ${contact.email!.label}`);
  await expect(page.getByRole("button", { name: "Copiar correo", exact: true })).toBeEnabled();
});

test("navegación: cada enlace lleva a su sección y la marca vuelve al inicio", async ({ page }, testInfo) => {
  await page.goto("/");
  const offset = testInfo.project.name === "desktop" ? 88 : 24;
  for (const id of ["proceso", "servicios", "sobre-mi", "proyectos"]) {
    if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.locator(`${testInfo.project.name === "mobile" ? ".mobile-menu" : ".nav-pill"} a[href="#${id}"]`).click();
    await expect.poll(() => page.locator(`#${id}`).evaluate(element => Math.round(element.getBoundingClientRect().top)), { timeout: 4000 }).toBe(offset);
  }
  await page.getByRole("link", { name: "Max Acosta" }).click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 4000 }).toBe(0);
});

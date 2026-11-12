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
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  // Proyectos vive en su propia página.
  await page.goto("/proyectos");
  for (const project of projects) {
    await expect(page.getByRole("heading", { name: project.name, exact: true })).toBeVisible();
  }
  for (const system of projects.filter((p) => p.kind === "engineering-system")) {
    if (system.repository) {
      await expect(page.locator(`#${system.id}`).getByRole("link", { name: /Ver repositorio/ })).toHaveAttribute("href", system.repository.href);
    }
  }
  await expect(page.locator("#proyectos")).not.toContainText("Outlier");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.goto("/");
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
  // Cada apartado es una página: el enlace lleva a ella y la marca como actual.
  for (const [label, path] of [["Proyectos", "/proyectos"], ["Servicios", "/servicios"], ["Sobre mí", "/sobre-mi"]]) {
    if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "Abrir menú" }).press("Enter");
    const link = page.getByRole("navigation", { name: testInfo.project.name === "mobile" ? "Menú principal" : "Navegación principal" }).getByRole("link", { name: label, exact: true });
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await page.waitForURL(new RegExp(`${path}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (testInfo.project.name !== "mobile") await expect(page.locator(".nav-pill").getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await page.goto("/contacto");
  const openState = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(openState.violations).toEqual([]);
  // El formulario es la acción principal; el correo queda como alternativa.
  await expect(page.locator("#contacto form")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Abrir en tu app de correo" })).toHaveAttribute("href", contact.email!.href);
  await expect(page.getByRole("button", { name: "Copiar correo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar CV" })).toHaveCount(0);
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => !document.getElementById(href.slice(1))));
  expect(brokenAnchors).toEqual([]);
  const smallTargets = await page.locator("a:not(.skip-link), summary").evaluateAll((elements) => elements.filter((element) => {
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


test.describe("primera visita", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("aviso de cookies en ventana emergente y preferencias", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const dialog = page.getByRole("dialog", { name: "Tú decides sobre la medición" });
    await expect(dialog).toBeVisible();
    // Centrado sobre la página, como ventana emergente.
    const box = (await dialog.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(2);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: "Rechazar", exact: true }).click();
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("cookie_consent_v1"))).toBe("false");
    await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tú decides sobre la medición" })).toBeFocused();
    await page.getByRole("button", { name: "Aceptar", exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem("cookie_consent_v1"))).toBe("true");
    // Escape cierra sin guardar nada; Preferencias lo vuelve a abrir.
    await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("cookie_consent_v1"))).toBeNull();
    await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
    await page.getByRole("button", { name: "Rechazar", exact: true }).click();
    await page.reload();
    await expect(dialog).toBeHidden();
  });
});

test("hero: marca, métricas reales, escena 3D con alternativa y CTA", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".hero .badge-long")).toHaveText("Disponible para proyectos · Culiacán y remoto");
  await expect(page.locator(".hero .badge-short")).toHaveText("Disponible · Culiacán y remoto");
  await expect(page.locator(".hero-title em")).toHaveText("tu negocio");
  await expect(page.locator(".hero-metrics dd")).toHaveText(["103", String(Object.keys(repositories).length), "Hito, en vivo"]);
  await expect(page.getByRole("navigation", { name: "Elige un proyecto" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator(".hero-actions").getByRole("link", { name: "Cotiza tu proyecto" })).toHaveAttribute("href", "/contacto");
  await expect(page.locator(".hero-actions").getByRole("link", { name: "Ver casos" })).toHaveAttribute("href", "/proyectos");
  await expect(page.locator(".picker-caps")).toHaveCSS("text-transform", "uppercase");
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

test("R2: apartados, navegación activa, filas completas y borde del pie", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByText("Borrador para revisión", { exact: true })).toHaveCount(0);
  await page.goto("/sobre-mi");
  for (const label of ["Backend", "Tiempo real", "Datos", "Seguridad", "Infraestructura", "Calidad y pruebas"]) {
    await expect(page.locator(".technology-groups dt").filter({ hasText: new RegExp(`^${label}$`) })).toBeVisible();
  }
  await page.goto("/servicios");
  await expect(page.getByRole("heading", { name: "Proceso", exact: true })).toBeVisible();
  await expect(page.locator(".strip-proof").first()).toBeVisible();
  await page.goto("/proyectos");
  await expect(page.getByRole("heading", { name: "Otros proyectos", exact: true })).toBeVisible();
  if (page.viewportSize()!.width >= 768) await expect(page.locator('.nav-pill a[href="/proyectos"]')).toHaveAttribute("aria-current", "page");
  // Pie en columnas: navegación, proyectos y contacto, alineado con el contenido.
  const footer = page.locator(".site-footer");
  for (const name of ["Navegación", "Proyectos", "Contacto"]) await expect(footer.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/MaxAcosta-30");
  expect(await footer.locator(".page-container").evaluate(element => element.getBoundingClientRect().width)).toBe(await page.locator("main .page-container").first().evaluate(element => element.getBoundingClientRect().width));
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
  await page.goto("/contacto");
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

test("navegación: el selector lleva a cada proyecto y la marca vuelve al inicio", async ({ page }) => {
  await page.goto("/");
  for (const id of ["hito", "sistemas-backend"]) {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Elige un proyecto" }).locator(`a[href="/proyectos#${id}"]`).click();
    await page.waitForURL(new RegExp(`/proyectos/?#${id}$`));
    await expect.poll(() => page.locator(`#${id}`).evaluate(element => Math.round(element.getBoundingClientRect().top)), { timeout: 4000 }).toBeLessThan(200);
  }
  await page.getByRole("link", { name: "Max Acosta, inicio" }).click();
  await page.waitForURL(/127\.0\.0\.1:3100\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("cambiar de apartado siempre abre la página desde arriba", async ({ page }, testInfo) => {
  const go = async (label: string, path: string) => {
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Abrir menú" }).click();
      await page.getByRole("navigation", { name: "Menú principal" }).getByRole("link", { name: label, exact: true }).click();
    } else {
      await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: label, exact: true }).click();
    }
    await page.waitForURL(new RegExp(`${path}/?$`));
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => scrollY), `${label} debe abrir arriba`).toBe(0);
  };
  await page.goto("/servicios");
  for (const [label, path] of [["Proyectos", "/proyectos"], ["Servicios", "/servicios"], ["Sobre mí", "/sobre-mi"], ["Proyectos", "/proyectos"]]) {
    // Con la página a medias o hasta abajo, y con la rueda (activa el scroll suave).
    await page.mouse.move(300, 300);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(300);
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(200);
    await go(label, path);
  }
});

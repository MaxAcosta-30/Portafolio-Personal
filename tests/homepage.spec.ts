import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { contact, profile } from "../src/content/profile";
import { homeDesign } from "../src/content/home-design";
import { projects } from "../src/content/projects";

const captureDirectory = "screenshots";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("contenido, accesibilidad y capturas de la portada", async ({ page }, testInfo) => {
  await expect(page).toHaveTitle(`${profile.name} · ${profile.role}`);
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
    return { text: getComputedStyle(element, "::selection").color, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(selection.text).toBe(selection.background);
  await page.screenshot({ path: `${captureDirectory}/portfolio-${testInfo.project.name}-selection.png` });
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
});

test("navegación, detalles, contacto y targets accesibles", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const label of ["Proyectos", "Sobre mí", "Contacto"]) {
    const link = page.getByRole("navigation").getByRole("link", { name: label, exact: true });
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    const href = await link.getAttribute("href");
    expect(new URL(page.url()).hash).toBe(href);
    const top = await page.locator(href!).evaluate((element) => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
  }
  const openState = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(openState.violations).toEqual([]);
  await expect(page.getByRole("link", { name: "Escríbeme", exact: true })).toHaveAttribute("href", contact.email!.href);
  await expect(page.getByRole("link", { name: "Descargar CV" })).toHaveCount(0);
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => !document.getElementById(href.slice(1))));
  expect(brokenAnchors).toEqual([]);
  const smallTargets = await page.locator("a, summary").evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && (box.width < 44 || box.height < 44);
  }).map((element) => element.textContent));
  expect(smallTargets).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("link", { name: "Contacto", exact: true }).first()).toHaveCSS("transition-duration", "0s");
  await mkdir(captureDirectory, { recursive: true });
  await page.getByRole("link", { name: "Escríbeme", exact: true }).focus();
  await page.locator("#contacto").screenshot({ path: `${captureDirectory}/portfolio-${testInfo.project.name}-contact.png` });
});

test("sin desbordamientos en móvil estrecho, tablet y pantalla grande", async ({ page }, testInfo) => {
  const widths = testInfo.project.name === "mobile" ? [320, 390] : [768, 1024, 1920];
  await mkdir(captureDirectory, { recursive: true });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.locator("body *").evaluateAll((elements) => elements.filter((element) => {
      if (element.closest("details:not([open])") && !element.closest("summary")) return false;
      if (element.classList.contains("skip-link") || element.classList.contains("sr-only")) return false;
      // La cinta de servicios desborda a propósito dentro de un contenedor recortado.
      if (element.closest(".ticker")) return false;
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

test("hero: la consola de Hangar despliega el negocio del visitante", async ({ page }, testInfo) => {
  await page.goto("/");
  const deploy = page.locator(".deploy");
  await expect(deploy).toHaveAttribute("data-state", "success", { timeout: 10_000 });
  // El elemento firma está en el primer viewport.
  const box = (await deploy.boundingBox())!;
  expect(box.y).toBeLessThan(page.viewportSize()!.height * (testInfo.project.name === "desktop" ? 0.5 : 1.6));
  await page.getByLabel("Nombre de tu negocio").fill("Panadería Lupita");
  await page.getByRole("button", { name: "Desplegar" }).click();
  await expect(deploy).toHaveAttribute("data-state", "running");
  await expect(deploy).toHaveAttribute("data-state", "success", { timeout: 10_000 });
  await expect(deploy.locator(".result-url")).toHaveText("panaderia-lupita.hangar.local");
  await expect(deploy.locator(".deploy-log li")).toHaveCount(11);
  await expect(deploy.locator(".deploy-stages li[data-state='done']")).toHaveCount(4);
});

test("R2: secciones, navegación activa, filas completas y borde del pie", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByText("Borrador para revisión", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Otros proyectos", exact: true })).toBeVisible();
  for (const label of ["Backend", "Tiempo real", "Datos", "Seguridad", "Infraestructura", "Calidad y pruebas"]) {
    await expect(page.locator(".technology-groups dt").filter({ hasText: new RegExp(`^${label}$`) })).toBeVisible();
  }
  for (const id of ["proyectos", "sobre-mi", "contacto"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.locator(`#${id}`).evaluate(element => element.scrollIntoView());
    await expect(page.locator(`nav a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
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
  await expect(page.getByRole("status")).toHaveText("Correo copiado.");
  expect(await page.evaluate(() => (window as Window & { copiedEmail?: string }).copiedEmail)).toBe(contact.email!.label);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Permission denied"); } } }));
  await page.getByRole("button", { name: "Copiar correo", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(`No se pudo copiar. Puedes seleccionar el correo: ${contact.email!.label}`);
  await expect(page.getByRole("button", { name: "Copiar correo", exact: true })).toBeEnabled();
});

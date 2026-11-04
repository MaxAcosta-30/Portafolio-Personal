import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { hangarSnippets } from "../src/content/hangar-snippets";
import { mkdir } from "node:fs/promises";
import { hangarCaseStudy as content, hangarSources } from "../src/content/hangar-case-study";

const captureDirectory = "screenshots";
const reviewDirectory = ".impeccable/review";

test("recorrido desde la portada, fuentes y navegación con teclado", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Leer caso de Hangar" }).click();
  await expect(page).toHaveURL(/\/proyectos\/hangar\/?$/);
  await expect(page).toHaveTitle(/Hangar · Caso de estudio/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hangar");
  await page.reload();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const item of content.navigation) {
    const link = page.getByRole("navigation", { name: content.contentsLabel }).getByRole("link", { name: item.label, exact: true });
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    expect(new URL(page.url()).hash).toBe(`#${item.id}`);
    expect(await page.locator(`#${item.id}`).evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
  }
  await page.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details")).toHaveAttribute("open", "");
  for (const source of Object.values(hangarSources)) {
    await expect(page.locator("details").getByRole("link", { name: source.label })).toHaveAttribute("href", source.source);
  }
  await expect(page.getByRole("link", { name: content.repositoryLabel })).toHaveAttribute("href", "https://github.com/MaxAcosta-30/Setup-hangar");
  await expect(page.getByText(content.demoUnavailable, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /demo/i })).toHaveCount(0);
  await expect(page.getByText(content.testing.status, { exact: true })).toBeVisible();
  await expect(page.getByText(content.isolation.limit, { exact: true })).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Contacto", exact: true }).click();
  expect(new URL(page.url()).pathname).toBe("/");
  expect(new URL(page.url()).hash).toBe("#contacto");
  await expect(page.getByRole("link", { name: "Escríbeme", exact: true })).toBeVisible();
});

test("diagramas legibles, accesibilidad y capturas responsive", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(content.href);
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
  await expect(page.getByRole("list", { name: content.pipeline.title }).locator("li p:first-child")).toHaveText(["clone", "build", "run", "route"]);
  await mkdir(captureDirectory, { recursive: true });
  await mkdir(reviewDirectory, { recursive: true });
  // Axe restores focus. Reset it before resting-state captures of tall sections.
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({ path: `${captureDirectory}/hangar-6r-${testInfo.project.name}.png`, fullPage: true });
  await page.screenshot({ path: `${reviewDirectory}/hangar-${testInfo.project.name}-first.png` });
  for (const id of ["arquitectura", "workflow", "aislamiento", "logs", "decisiones", "testing"]) {
    // A tall element capture can misplace offscreen fixed elements in Chromium.
    // Capture the real viewport; full-page evidence above preserves the rest.
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.screenshot({ path: `${reviewDirectory}/hangar-${testInfo.project.name}-${id}.png` });
  }
  const widths = testInfo.project.name === "mobile" ? [320, 390] : [768, 1024, 1920];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.locator("body *").evaluateAll((elements) => elements.filter((el) => {
      if (el.closest(".technical-code pre")) return false;
      if (el.closest("details:not([open])") && !el.closest("summary")) return false;
      if (el.classList.contains("skip-link") || el.classList.contains("sr-only")) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
    }).map((el) => `${el.tagName}.${el.className}`));
    expect(overflow, `Overflow at ${width}px`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallTargets = await page.locator("a, summary").evaluateAll((elements) => elements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.width < 44 || rect.height < 44);
    }).map((el) => el.textContent));
    expect(smallTargets, `Targets at ${width}px`).toEqual([]);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${reviewDirectory}/hangar-${width}-first.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("link", { name: content.repositoryLabel })).toHaveCSS("transition-duration", "0s");
});

test("lectura y fuentes disponibles sin JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:3100${content.href}`);
  await expect(page.getByRole("heading", { name: content.logs.title })).toBeVisible();
  await page.locator("summary").click();
  await expect(page.locator("details")).toHaveAttribute("open", "");
  await expect(page.locator("details").getByRole("link", { name: hangarSources.tests.label })).toBeVisible();
  await context.close();
});


test("extractos fieles, desplazamiento accesible y metadata sin dominio inventado", async ({ page }, testInfo) => {
  await page.goto(content.href);
  await expect(page.locator(".case-code")).toHaveCount(3);
  for (const snippet of Object.values(hangarSnippets)) {
    const figure = page.getByRole("figure", { name: snippet.title, exact: true });
    const pre = figure.locator("pre");
    expect(await pre.textContent()).toBe(snippet.code);
    expect(snippet.code.split("\n").length).toBeGreaterThanOrEqual(8);
    expect(snippet.code.split("\n").length).toBeLessThanOrEqual(25);
    await expect(pre).toHaveCSS("white-space", "pre");
    await expect(pre).toHaveCSS("overflow-x", "auto");
    await expect(pre).toHaveAttribute("tabindex", "0");
    await expect(pre).toHaveAttribute("aria-label", /Desplazamiento horizontal/);
    await pre.focus();
    await expect(pre).toHaveCSS("outline-style", "solid");
    if (testInfo.project.name === "mobile") {
      expect(await pre.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => pre.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    }
    await expect(figure.getByRole("link")).toHaveAttribute("href", snippet.source);
  }
  await expect(page.locator("#limites")).toBeVisible();
  await expect(page.getByRole("link", { name: content.closing.otherCase.label, exact: true })).toHaveAttribute("href", "/proyectos/taskflow-pro");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Hangar/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", content.introduction);
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  }
});

import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { taskFlowCaseStudy as content, taskFlowSources } from "../src/content/taskflow-case-study";

const captureDirectory = ".impeccable/review";

test("recorrido desde la portada, fuentes y navegación con teclado", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Leer caso de TaskFlow Pro" }).click();
  await expect(page).toHaveURL(/\/proyectos\/taskflow-pro\/?$/);
  await expect(page).toHaveTitle(/TaskFlow Pro · Caso de estudio/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TaskFlow Pro");
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
  for (const source of Object.values(taskFlowSources)) {
    await expect(page.locator("details").getByRole("link", { name: source.label })).toHaveAttribute("href", source.source);
  }
  await expect(page.getByRole("link", { name: content.repositoryLabel })).toHaveAttribute("href", "https://github.com/MaxAcosta-30/Taskflow-pro");
  await expect(page.getByText(content.demoUnavailable, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /demo/i })).toHaveCount(0);
  await expect(page.getByText(content.testing.status, { exact: true })).toBeVisible();
  await expect(page.getByText(content.realtime.limit, { exact: true })).toBeVisible();
  await expect(page.getByText(content.automations.limit, { exact: true })).toBeVisible();
  await expect(page.getByText(content.observability.limit, { exact: true })).toBeVisible();
  await expect(page.getByText(content.security.limit, { exact: true })).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
  await page.locator('a[href="/#contacto"]').first().click();
  await page.waitForURL(/\/#contacto$/);
  expect(new URL(page.url()).pathname).toBe("/");
  expect(new URL(page.url()).hash).toBe("#contacto");
  await expect(page.getByRole("link", { name: "Escríbeme por Gmail (se abre en una pestaña nueva)" })).toBeVisible();
});

test("diagramas legibles, accesibilidad y capturas responsive", async ({ page }, testInfo) => {
  await page.goto(content.href);
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
  await expect(page.getByRole("list", { name: content.overview.title }).locator("li p:first-child")).toHaveText([
    "Next.js + Socket.io",
    "Workers BullMQ",
    "Infraestructura Docker",
  ]);
  await mkdir(captureDirectory, { recursive: true });
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({ path: `${captureDirectory}/taskflow-${testInfo.project.name}.png`, fullPage: true });
  await page.screenshot({ path: `${captureDirectory}/taskflow-${testInfo.project.name}-first.png` });
  for (const id of ["arquitectura", "realtime", "automatizaciones", "observabilidad", "seguridad", "decisiones", "testing"]) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.screenshot({ path: `${captureDirectory}/taskflow-${testInfo.project.name}-${id}.png` });
  }
  const widths = testInfo.project.name === "mobile" ? [320, 390] : [768, 1024, 1920];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.locator("body *").evaluateAll((elements) => elements.filter((el) => {
      if (el.closest(".nav-pill")) return false;
      if (el.closest("details:not([open])") && !el.closest("summary")) return false;
      if (el.classList.contains("skip-link") || el.classList.contains("sr-only")) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
    }).map((el) => `${el.tagName}.${el.className}`));
    expect(overflow, `Overflow at ${width}px`).toEqual([]);
    const smallTargets = await page.locator("a, summary").evaluateAll((elements) => elements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.width < 44 || rect.height < 44);
    }).map((el) => el.textContent));
    expect(smallTargets, `Targets at ${width}px`).toEqual([]);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${captureDirectory}/taskflow-${width}-first.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("link", { name: content.repositoryLabel })).toHaveCSS("transition-duration", "0s");
});

test("lectura y fuentes disponibles sin JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:3100${content.href}`);
  await expect(page.getByRole("heading", { name: content.realtime.title })).toBeVisible();
  await page.locator("summary").click();
  await expect(page.locator("details")).toHaveAttribute("open", "");
  await expect(page.locator("details").getByRole("link", { name: taskFlowSources.tests.label })).toBeVisible();
  await context.close();
});

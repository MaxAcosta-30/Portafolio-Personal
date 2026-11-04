import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { projectPreviews } from "../src/content/project-previews";

test("fragmentos reales, diagramas y acciones consistentes, sin fotos ni espacio oculto", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".featured-row img")).toHaveCount(0);
  await expect(page.locator('a[href*="unsplash.com"]')).toHaveCount(0);
  for (const id of ["hangar", "taskflow-pro"] as const) {
    const preview = projectPreviews[id];
    const row = page.locator(`#${id}`);
    const technical = row.locator(".project-technical");
    await expect(row).not.toContainText("Fotografía editorial");
    await row.scrollIntoViewIfNeeded();
    await expect(technical).toBeVisible();
    await expect(technical).toHaveCSS("opacity", "1");
    await expect(technical.locator("svg:visible")).toHaveCount(1);
    expect(await technical.locator("ol li").count()).toBe(4);
    const code = await technical.locator("pre code").textContent();
    expect(code).toBe(preview.code);
    const codeBlock = technical.locator("pre");
    await expect(codeBlock).toHaveAttribute("tabindex", "0");
    await expect(codeBlock).toHaveAttribute("aria-label", new RegExp(preview.file.replaceAll(".", "\\.")));
    await expect(codeBlock).toHaveCSS("white-space", "pre");
    await expect(codeBlock).toHaveCSS("overflow-x", "auto");
    if (await codeBlock.evaluate(element => element.scrollWidth > element.clientWidth)) {
      await codeBlock.focus();
      await expect(codeBlock).toHaveCSS("outline-style", "solid");
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => codeBlock.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
      await codeBlock.evaluate(element => { element.scrollLeft = 0; element.blur(); });
    }
    const geometry = await technical.locator("svg:visible rect").evaluateAll(elements => elements.map(element => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y };
    }));
    for (let i = 1; i < geometry.length; i++) {
      if (testInfo.project.name === "desktop") {
        expect(geometry[i].y).toBeCloseTo(geometry[0].y);
        expect(geometry[i].x).toBeGreaterThan(geometry[i - 1].x);
      } else {
        expect(geometry[i].x).toBeCloseTo(geometry[0].x);
        expect(geometry[i].y).toBeGreaterThan(geometry[i - 1].y);
      }
    }
    const labels = await technical.locator("figcaption, figcaption a, figcaption span:not(.sr-only)").evaluateAll(elements => {
      function luminance(color: string) {
        const values = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => { const s = n / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      }
      const background = luminance(getComputedStyle(document.body).backgroundColor);
      return elements.map(element => {
        const style = getComputedStyle(element);
        const foreground = luminance(style.color);
        return { size: parseFloat(style.fontSize), contrast: (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05) };
      });
    });
    labels.forEach(label => { expect(label.size).toBeGreaterThanOrEqual(12); expect(label.contrast).toBeGreaterThanOrEqual(4.5); });
    expect(code!.split("\n").length).toBeGreaterThanOrEqual(8);
    expect(code!.split("\n").length).toBeLessThanOrEqual(20);
    await expect(technical.getByRole("link", { name: `Archivo fuente: ${preview.file}` })).toHaveAttribute("href", preview.source);
    const styles = await row.evaluate(element => {
      const caseStyle = getComputedStyle(element.querySelector(".case-action")!);
      const repoStyle = getComputedStyle(element.querySelector(".project-actions > a")!);
      return { caseSize: caseStyle.fontSize, repoSize: repoStyle.fontSize, caseWeight: caseStyle.fontWeight, repoWeight: repoStyle.fontWeight };
    });
    expect(styles.caseSize).toBe(styles.repoSize);
    expect(styles.caseWeight).toBe(styles.repoWeight);
    const before = await row.boundingBox();
    await row.hover();
    const after = await row.boundingBox();
    expect(after!.height).toBe(before!.height);
    await expect(technical).toBeVisible();
    await mkdir("screenshots", { recursive: true });
    const viewport = page.viewportSize()!;
    // Fit tall rows in the viewport to avoid Chromium's fixed-element clipping artifact.
    if (after!.height > viewport.height) await page.setViewportSize({ width: viewport.width, height: Math.ceil(after!.height) + 1 });
    await row.screenshot({ path: `screenshots/preview-${id}-${testInfo.project.name}.png` });
  }
});

test("pipeline: secuencia menor de 1.5s, sin repetir al volver", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const state = { runs: 0, duration: 0, started: 0 };
    Object.assign(window, { pipelineTiming: state });
    new MutationObserver(records => {
      for (const record of records) {
        const element = record.target as HTMLElement;
        if (!element.matches?.(".home-pipeline")) continue;
        if (element.dataset.motion === "playing") { state.runs++; state.started = performance.now(); }
        if (element.dataset.motion === "complete") state.duration = performance.now() - state.started;
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-motion"] });
  });
  await page.goto("/");
  await page.locator(".home-pipeline").scrollIntoViewIfNeeded();
  await expect(page.locator(".home-pipeline")).toHaveAttribute("data-motion", "playing");
  const connector = page.locator(testInfo.project.name === "mobile" ? ".pipeline-mobile-flow" : ".pipeline-flow").first();
  await expect(connector).not.toHaveCSS("transform", "none");
  await expect(page.locator(".home-pipeline")).toHaveAttribute("data-motion", "complete");
  const timing = () => page.evaluate(() => (window as Window & { pipelineTiming?: { runs: number; duration: number } }).pipelineTiming!);
  expect((await timing()).runs).toBe(1);
  await testInfo.attach("pipeline-timing", { body: JSON.stringify(await timing()), contentType: "application/json" });
  expect((await timing()).duration).toBeGreaterThan(800);
  expect((await timing()).duration).toBeLessThan(1500);
  await page.locator("#contacto").scrollIntoViewIfNeeded();
  await page.locator(".home-pipeline").scrollIntoViewIfNeeded();
  expect((await timing()).runs).toBe(1);
  await page.reload();
  await page.locator(".home-pipeline").scrollIntoViewIfNeeded();
  await expect(page.locator(".home-pipeline")).not.toHaveAttribute("data-motion");
  expect(await page.evaluate(() => sessionStorage.getItem("portfolio-hangar-pipeline-seen"))).toBe("true");
});

test("lectura sin JavaScript y con movimiento reducido", async ({ browser, page }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: page.viewportSize()! });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3100/");
  for (const selector of ["h1", ".home-pipeline", ...["proyectos", "sobre-mi", "tecnologias", "experiencia", "contacto"].map(id => `#${id}`)]) {
    await expect(staticPage.locator(selector)).toBeVisible();
    await expect(staticPage.locator(selector)).toHaveCSS("opacity", "1");
  }
  await staticPage.getByRole("navigation").getByRole("link", { name: "Sobre mí" }).click();
  await expect(staticPage).toHaveURL(/#sobre-mi$/);
  await staticPage.screenshot({ path: `screenshots/no-js-${testInfo.project.name}.png`, fullPage: true });
  await context.close();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#hangar").hover();
  await expect(page.locator("#hangar .t-learn-chevron")).toHaveCSS("transform", "none");
  await expect(page.locator("#hangar .t-learn-chevron")).toHaveCSS("transition-duration", "0s");
  await expect(page.locator(".home-pipeline")).not.toHaveAttribute("data-motion");
  for (const section of await page.locator(".home-section").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("transform", "none");
  }
  await page.screenshot({ path: `screenshots/reduced-motion-${testInfo.project.name}.png`, fullPage: true });
});

test("diagramas SVG legibles y con alternativa textual en ambos casos", async ({ page }) => {
  for (const project of ["hangar", "taskflow-pro"]) {
    await page.goto(`/proyectos/${project}`);
    const diagrams = page.locator(".architecture-diagram");
    await expect(diagrams).toHaveCount(2);
    for (const diagram of await diagrams.all()) {
      expect(await diagram.locator("ol[aria-label] li").count()).toBeGreaterThan(2);
      const smallText = await diagram.locator("svg text").evaluateAll(elements => elements.filter(element => {
        const text = element as SVGTextElement;
        const matrix = text.getScreenCTM();
        return element.getBoundingClientRect().width > 0 && matrix && parseFloat(getComputedStyle(text).fontSize) * matrix.a < 13;
      }).map(element => element.textContent));
      expect(smallText).toEqual([]);
    }
  }
});

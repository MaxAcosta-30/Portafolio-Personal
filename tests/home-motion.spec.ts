import { expect, test } from "@playwright/test";
import { projectPreviews } from "../src/content/project-previews";

test("casos: fragmentos reales, código accesible y acciones consistentes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const id of ["hangar", "taskflow-pro"] as const) {
    const preview = projectPreviews[id];
    const row = page.locator(`#${id}`);
    await row.scrollIntoViewIfNeeded();
    const codeBlock = row.locator(".code-well pre");
    expect(await codeBlock.locator("code").textContent()).toBe(preview.code);
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
    await expect(row.getByRole("link", { name: `Archivo fuente: ${preview.file}` })).toHaveAttribute("href", preview.source);
    const styles = await row.evaluate(element => {
      const caseStyle = getComputedStyle(element.querySelector(".case-action")!);
      const repoStyle = getComputedStyle(element.querySelector(".project-actions > a")!);
      return { caseSize: caseStyle.fontSize, repoSize: repoStyle.fontSize, caseWeight: caseStyle.fontWeight, repoWeight: repoStyle.fontWeight };
    });
    expect(styles.caseSize).toBe(styles.repoSize);
    expect(styles.caseWeight).toBe(styles.repoWeight);
  }
  // Hangar muestra la política de reintentos real del código.
  await expect(page.locator("#hangar .gauges dd")).toHaveText(["3", "10 min", "5 s", "2"]);
});

test("TaskFlow: mover una tarjeta en el tablero de Ana la sincroniza en el de Luis", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const board = page.getByRole("group", { name: "Demostración de sincronización de TaskFlow Pro" });
  await board.scrollIntoViewIfNeeded();
  await board.getByRole("button", { name: "Mover «Revisar diseño» a la siguiente columna" }).click();
  const luisInProgress = board.locator('[data-owner="luis"] .sync-column').nth(1);
  await expect(luisInProgress).toContainText("Revisar diseño");
});

test("lectura sin JavaScript y con movimiento reducido", async ({ browser, page }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: page.viewportSize()! });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3100/");
  for (const selector of ["h1", ".deploy", ...["servicios", "proyectos", "sobre-mi", "tecnologias", "experiencia", "contacto"].map(id => `#${id}`)]) {
    await expect(staticPage.locator(selector)).toBeVisible();
    await expect(staticPage.locator(selector)).toHaveCSS("opacity", "1");
  }
  // Sin JS el despliegue se ve terminado y los servicios encendidos.
  await expect(staticPage.locator(".deploy-log li")).toHaveCount(11);
  await expect(staticPage.locator(".deploy-result")).toBeVisible();
  await expect(staticPage.locator(".service-list")).not.toHaveAttribute("data-live");
  await staticPage.getByRole("navigation").getByRole("link", { name: "Sobre mí" }).click();
  await expect(staticPage).toHaveURL(/#sobre-mi$/);
  await staticPage.screenshot({ path: `screenshots/no-js-${testInfo.project.name}.png`, fullPage: true });
  await context.close();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".deploy")).toHaveAttribute("data-state", "success");
  await expect(page.locator(".service-list")).not.toHaveAttribute("data-live");
  await page.locator("#hangar").hover();
  await expect(page.locator("#hangar .t-learn-chevron")).toHaveCSS("transform", "none");
  for (const section of await page.locator(".home-section").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS("opacity", "1");
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

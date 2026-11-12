import { expect, test } from "@playwright/test";

test("casos: vitrinas con capturas reales, texto alternativo y acciones consistentes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/proyectos");
  for (const id of ["hito", "hangar", "taskflow-pro"] as const) {
    const row = page.locator(`#${id}`);
    await row.scrollIntoViewIfNeeded();
    const showcase = row.locator("[data-showcase]");
    await expect(showcase).toBeVisible();
    // La captura principal describe lo que muestra; la del fondo es decorativa.
    const front = showcase.locator(".device-front img");
    await expect(front).toHaveAttribute("alt", /.{20,}/);
    await expect(showcase.locator(".device-back img")).toHaveAttribute("alt", "");
    await expect(showcase.locator("figcaption")).toContainText("Capturas reales");
    await expect.poll(() => front.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const styles = await row.evaluate(element => {
      const caseStyle = getComputedStyle(element.querySelector(".case-action")!);
      const repoStyle = getComputedStyle(element.querySelector(".project-actions > a:last-child")!);
      return { caseSize: caseStyle.fontSize, repoSize: repoStyle.fontSize, caseWeight: caseStyle.fontWeight, repoWeight: repoStyle.fontWeight };
    });
    expect(styles.caseSize).toBe(styles.repoSize);
  }
  // Hito es el único con demo pública.
  await expect(page.locator("#hito").getByRole("link", { name: /Probar la demo/ })).toHaveAttribute("href", "https://hito-one.vercel.app");
});

test("lectura sin JavaScript y con movimiento reducido", async ({ browser, page }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: page.viewportSize()! });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3100/");
  for (const selector of ["h1", ".hero-visual", ".hero-fallback", "#servicios"]) {
    await expect(staticPage.locator(selector)).toBeVisible();
    await expect(staticPage.locator(selector)).toHaveCSS("opacity", "1");
  }
  // Cada apartado se lee completo sin JavaScript.
  for (const [path, ids] of [["/proyectos", ["proyectos", "hito", "sistemas-backend"]], ["/servicios", ["servicios", "proceso"]], ["/sobre-mi", ["sobre-mi", "experiencia", "tecnologias"]], ["/contacto", ["contacto"]]] as const) {
    await staticPage.goto(`http://127.0.0.1:3100${path}`);
    for (const id of ids) {
      await expect(staticPage.locator(`#${id}`)).toBeVisible();
      await expect(staticPage.locator(`#${id}`)).toHaveCSS("opacity", "1");
    }
  }
  await staticPage.goto("http://127.0.0.1:3100/");
  // Sin JS: logo estático, sin intro ni lienzo 3D.
  await expect(staticPage.locator(".intro")).toBeHidden();
  await expect(staticPage.locator(".hero-canvas")).toHaveCount(0);
  await staticPage.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Sobre mí" }).click();
  await expect(staticPage).toHaveURL(/\/sobre-mi\/?$/);
  await staticPage.screenshot({ path: `screenshots/no-js-${testInfo.project.name}.png`, fullPage: true });
  await context.close();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Movimiento reducido: sin intro y sin escena 3D (se queda el SVG estático).
  await expect(page.locator(".intro")).toBeHidden();
  await page.waitForTimeout(1500);
  await expect(page.locator(".hero-canvas")).toHaveCount(0);
  await page.goto("/proyectos");
  await page.locator("#hangar").hover();
  await expect(page.locator("#hangar .t-learn-chevron")).toHaveCSS("transform", "none");
  for (const section of await page.locator(".home-section").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS("opacity", "1");
  }
  await page.screenshot({ path: `screenshots/reduced-motion-${testInfo.project.name}.png`, fullPage: true });
});

test("páginas de caso: secuencias en lista ordenada, sin cajas con flechas", async ({ page }) => {
  for (const project of ["hangar", "taskflow-pro"]) {
    await page.goto(`/proyectos/${project}`);
    const sequences = page.locator("ol.sequence[aria-label]");
    expect(await sequences.count()).toBeGreaterThanOrEqual(3);
    for (const sequence of await sequences.all()) {
      expect(await sequence.locator("li").count()).toBeGreaterThanOrEqual(3);
      const sizes = await sequence.locator(".sequence-title, .sequence-detail").evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
      sizes.forEach(size => expect(size).toBeGreaterThanOrEqual(13));
    }
    await expect(page.locator(".case-flow-arrow, .architecture-diagram svg, .isolation-svg")).toHaveCount(0);
  }
});

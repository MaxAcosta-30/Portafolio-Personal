import { expect, test } from "@playwright/test";

// Lo que Google y las redes leen: título con nombre y servicio, canonical, og:image en PNG (no SVG),
// robots.txt que no bloquea y sitemap con las páginas públicas.
const pages = [
  { path: "/", og: "og-image.png" },
  { path: "/proyectos/hito", og: "og-hito.png" },
  { path: "/proyectos/hangar", og: "og-hangar.png" },
  { path: "/proyectos/taskflow-pro", og: "og-taskflow.png" },
];

for (const { path, og } of pages) {
  test(`metadatos de ${path}`, async ({ page, request }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(/Max Acosta/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path === "/" ? "" : path}/?$`));
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const url = await page.locator(selector).first().getAttribute("content");
      expect(url).toMatch(new RegExp(`/${og.replace(".", "\\.")}$`));
      const image = await request.get(new URL(url!).pathname);
      expect(image.headers()["content-type"]).toBe("image/png");
    }
  });
}

test("robots.txt permite rastrear y apunta al sitemap", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).not.toMatch(/Disallow: \/\s*$/m);
  expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("sitemap.xml lista las páginas públicas y no las internas", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const { path } of pages) expect(sitemap).toContain(`${path === "/" ? "" : path}</loc>`);
  expect(sitemap).not.toContain("design-system");
  expect(sitemap).not.toContain("muestra");
});

test("los avisos legales no muestran campos pendientes", async ({ page }) => {
  for (const path of ["/privacidad", "/legal/cookies", "/legal/aviso-legal"]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(/POR COMPLETAR|Pendiente de revisión|Revisión legal pendiente/);
  }
});

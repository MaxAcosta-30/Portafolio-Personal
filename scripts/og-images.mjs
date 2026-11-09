// Genera las imágenes para redes (Open Graph, 1200×630 PNG) con la paleta Brasa y los titulares aprobados.
// Uso: node scripts/og-images.mjs   (necesita red para las fuentes de Google y el Chromium de Playwright)
// PNG y no SVG: WhatsApp, LinkedIn, X y Facebook no muestran og:image en SVG.
import { chromium } from "@playwright/test";

// Cubo del logo (mismos trazados que src/components/brand/logo.tsx) con los colores del tema Brasa.
const LOGO = `<svg class="logo" viewBox="0 0 100 100" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
  <path d="M50 50 V92 M15.4 72 L50 92 L84.6 72" stroke="#40372f"/>
  <path d="M15.4 72 V30 L50 50 L84.6 30 V72" stroke="#f4efe8"/>
  <path d="M15.4 30 L50 10 L84.6 30" stroke="#ff5a1f"/>
</svg>`;

const cards = [
  { file: "og-image.png", title: "Construyo el software que <em>tu negocio</em> usa todos los días.", kicker: "Max Acosta · Desarrollador de Software" },
  { file: "og-hito.png", title: "Hito: cada entrega aprobada, <em>cada cobro claro.</em>", kicker: "Caso de estudio · Max Acosta" },
  { file: "og-hangar.png", title: "Hangar: de un repositorio Git a una <em>aplicación desplegada.</em>", kicker: "Caso de estudio · Max Acosta" },
  { file: "og-taskflow.png", title: "TaskFlow Pro: tableros <em>sincronizados</em> entre usuarios.", kicker: "Caso de estudio · Max Acosta" },
];

const html = ({ title, kicker }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600&family=JetBrains+Mono&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body { position: relative; overflow: hidden; background: #110e0c; color: #f4efe8; font-family: "Bricolage Grotesque", sans-serif; }
  .glow { position: absolute; left: -160px; top: -220px; width: 760px; height: 620px; background: radial-gradient(closest-side, rgb(255 90 31 / 0.22), transparent); }
  .frame { position: absolute; inset: 40px; border: 1px solid #2a241f; }
  .logo { position: absolute; left: 96px; top: 92px; width: 84px; height: 84px; }
  h1 { position: absolute; left: 96px; right: 120px; bottom: 150px; margin: 0; font-size: 76px; line-height: 1.02; letter-spacing: -0.035em; font-weight: 600; text-wrap: balance; }
  em { font-style: normal; color: #ff6a2e; }
  p { position: absolute; left: 96px; bottom: 88px; margin: 0; font: 24px/1 "JetBrains Mono", monospace; color: #a59b91; }
</style></head><body><div class="glow"></div><div class="frame"></div>${LOGO}<h1>${title}</h1><p>${kicker}</p></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/${card.file}`, type: "png" });
  console.log(`public/${card.file}`);
}
await browser.close();

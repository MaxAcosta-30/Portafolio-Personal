// Mide la portada y los casos como los vería un celular de gama baja: CPU 4× más lenta y
// red "4G lenta" o "3G" emuladas por Chrome (DevTools Protocol). Es laboratorio: la verdad
// final son los datos de campo (Search Console → Core Web Vitals).
//
// Uso: npm run build && npm start   (en otra terminal)
//      node scripts/medir-red-lenta.mjs [url-base] [4g|3g]
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const perfil = process.argv[3] ?? "4g";
// Valores de los perfiles de Lighthouse/DevTools (RTT en ms, bajada y subida en bytes/s).
const REDES = {
  "4g": { latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
  "3g": { latency: 300, downloadThroughput: (700 * 1024) / 8, uploadThroughput: (700 * 1024) / 8 },
};
const RUTAS = ["/", "/proyectos/hito/", "/proyectos/hangar/", "/proyectos/taskflow-pro/"];

const navegador = await chromium.launch();
console.log(`Perfil: CPU 4×, red ${perfil} · ${base}\n`);
console.log("ruta".padEnd(28), "LCP (s)".padStart(8), "CLS".padStart(7), "KB".padStart(7));
for (const ruta of RUTAS) {
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const pagina = await contexto.newPage();
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, ...REDES[perfil] });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  let bytes = 0;
  cdp.on("Network.loadingFinished", e => { bytes += e.encodedDataLength; });

  await pagina.goto(base + ruta, { waitUntil: "load", timeout: 120_000 });
  await pagina.waitForTimeout(3000); // deja asentar LCP y CLS
  const { lcp, cls } = await pagina.evaluate(() => new Promise(resolver => {
    let lcp = 0, cls = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolver({ lcp, cls }), 100);
  }));
  console.log(ruta.padEnd(28), (lcp / 1000).toFixed(2).padStart(8), cls.toFixed(3).padStart(7), String(Math.round(bytes / 1024)).padStart(7));
  await contexto.close();
}
await navegador.close();

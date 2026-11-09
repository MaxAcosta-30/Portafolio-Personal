// Genera apple-icon.png y og-image.png con la paleta Noche (negro + naranja Flame).
// Uso: node scripts/brand-icons.mjs
import sharp from "sharp";

const M = "M15.4 72 V30 L50 50 L84.6 30 V72";
const A = "M15.4 30 L50 10 L84.6 30";
const H = "M50 50 V92 M15.4 72 L50 92 L84.6 72";
const mark = (x, y, scale, width = 8) => `<g fill="none" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${x} ${y}) scale(${scale})"><path d="${H}" stroke="#3a3a3a"/><path d="${M}" stroke="#ffffff"/><path d="${A}" stroke="#ff5101"/></g>`;

const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#000"/>${mark(27, 27, 1.26)}</svg>`;
await sharp(Buffer.from(apple)).png().toFile("src/app/apple-icon.png");

// OG: marco de 1px con marcadores "+", como el hero. Texto en trazos del sistema (sharp no carga las fuentes web).
const plus = (x, y) => `<path d="M${x - 7} ${y}h14M${x} ${y - 7}v14" stroke="#a3a3a3" stroke-width="1.5"/>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#000"/>
<rect x="48.5" y="48.5" width="1103" height="533" fill="none" stroke="#222"/>
${plus(48.5, 48.5)}${plus(1151.5, 48.5)}${plus(48.5, 581.5)}${plus(1151.5, 581.5)}
${mark(110, 110, 1.1, 7)}
<text x="110" y="370" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="76" letter-spacing="-3" fill="#fff">Software que se siente</text>
<text x="110" y="458" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="76" letter-spacing="-3" fill="#ff5101">futuro.</text>
<text x="110" y="530" font-family="DejaVu Sans Mono, monospace" font-size="20" letter-spacing="2" fill="#a3a3a3">MAX ACOSTA · DESARROLLO FULL STACK</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og-image.png");
console.log("apple-icon.png y og-image.png generados");

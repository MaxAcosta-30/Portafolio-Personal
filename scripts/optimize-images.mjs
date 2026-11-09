// Convierte las capturas de images/source/ a AVIF + WebP en 320, 480, 640, 1024 y 1600 px de ancho
// (320 y 480: el celular de la vitrina y las ventanas en pantallas de 390 px).
// Uso: npm run images   (salida en public/images/optimized/ y un manifiesto con dimensiones)
// Nunca amplía: si el original es más estrecho que un ancho, ese ancho se omite.
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "images/source";
const OUTPUT = "public/images/optimized";
const MANIFEST = "src/content/image-manifest.json";
const WIDTHS = [320, 480, 640, 1024, 1600];
const INPUT = /\.(png|jpe?g|webp|avif|tiff?)$/i;

await mkdir(SOURCE, { recursive: true });
await mkdir(OUTPUT, { recursive: true });
const files = (await readdir(SOURCE)).filter(file => INPUT.test(file)).sort();
const manifest = {};

for (const file of files) {
  const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const input = sharp(path.join(SOURCE, file));
  const { width, height } = await input.metadata();
  const widths = WIDTHS.filter(w => w <= width);
  if (widths.length === 0) widths.push(width);
  for (const w of widths) {
    const resized = input.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(OUTPUT, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 78 }).toFile(path.join(OUTPUT, `${name}-${w}.webp`));
  }
  manifest[name] = { width, height, widths };
  console.log(`${file} → ${widths.map(w => `${w}w`).join(", ")} (avif + webp)`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(files.length ? `${files.length} imagen(es) optimizada(s).` : `No hay imágenes en ${SOURCE}/. Manifiesto vacío.`);

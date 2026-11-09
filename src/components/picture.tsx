import manifest from "@/content/image-manifest.json";

type Entry = { width: number; height: number; widths: number[] };
const images = manifest as Record<string, Entry>;

/**
 * Captura optimizada por scripts/optimize-images.mjs: <picture> con AVIF y WebP en srcset,
 * width/height explícitos (sin CLS) y lazy salvo en el primer viewport: `priority` (la imagen LCP:
 * eager + fetchpriority alta) o `eager` (visible al abrir, pero sin competir con la LCP).
 */
export function Picture({ name, alt, sizes = "(width >= 64rem) 50vw, 100vw", priority = false, eager = false, className }: { name: string; alt: string; sizes?: string; priority?: boolean; eager?: boolean; className?: string }) {
  const image = images[name];
  if (!image) throw new Error(`Imagen "${name}" sin optimizar: ejecuta npm run images.`);
  const srcset = (format: "avif" | "webp") => image.widths.map(w => `/images/optimized/${name}-${w}.${format} ${w}w`).join(", ");
  const fallback = `/images/optimized/${name}-${image.widths.at(-1)}.webp`;
  return <picture className={className}>
    <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
    <img src={fallback} alt={alt} width={image.width} height={image.height} loading={priority || eager ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
  </picture>;
}

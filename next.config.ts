import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true", openAnalyzer: false });

// En Cloudflare Pages (CF_PAGES=1) sin la URL pública, canonical, sitemap y Open Graph apuntarían a localhost.
if (process.env.CF_PAGES && !process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  throw new Error("Falta NEXT_PUBLIC_SITE_URL en Cloudflare Pages (Settings → Variables). Ej.: https://tu-dominio.com");
}

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: process.cwd(),
  },
};

export default withBundleAnalyzer(nextConfig);

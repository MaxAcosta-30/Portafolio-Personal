"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, portfolioLabels } from "@/content/site";

/** El apartado actual se marca con aria-current="page"; los casos (/proyectos/…) cuentan como Proyectos. */
export function isCurrent(pathname: string | null, href: string) {
  const path = (pathname ?? "/").replace(/\/+$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}

export function HomeNavigation() {
  const pathname = usePathname();
  return <nav className="nav-pill" aria-label={portfolioLabels.navigation}>{navigation.items.map(item =>
    <Link key={item.href} className="nav-pill-link" href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>{item.label}</Link>
  )}</nav>;
}

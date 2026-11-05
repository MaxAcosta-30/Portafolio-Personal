"use client";

import { useEffect, useState } from "react";
import { navigation, portfolioLabels } from "@/content/site";

export function HomeNavigation({ homeLinks = false }: { homeLinks?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (homeLinks) return;
    const sections = navigation.items.map(item => document.getElementById(item.sectionId));
    let frame = 0;
    function update() {
      frame = 0;
      // Keep the current section selected across its supporting sections.
      const current = sections.filter(section => section && section.getBoundingClientRect().top <= innerHeight / 3).at(-1);
      setActive(current?.id ?? null);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [homeLinks]);

  return <nav className="nav-pill" aria-label={portfolioLabels.navigation}>{navigation.items.map(item =>
    <a key={item.sectionId} className="nav-pill-link" href={`${homeLinks ? "/" : ""}#${item.sectionId}`} aria-current={active === item.sectionId ? "location" : undefined}>{item.label}</a>
  )}</nav>;
}

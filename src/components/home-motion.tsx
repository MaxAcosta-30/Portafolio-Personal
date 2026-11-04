"use client";

import { useEffect } from "react";

/** Progressive enhancement: nothing is hidden while GSAP loads or if it fails. */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-content");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches) return;

    let disposed = false;
    let cleanup = () => {};
    async function enhance() {
      try {
        const { gsap } = await import("gsap");
        if (disposed || preference.matches) return;
        const styles = getComputedStyle(root!);
        // The production CSS optimizer can normalize 280ms to .28s.
        const seconds = (token: string) => {
          const value = styles.getPropertyValue(token).trim();
          return parseFloat(value) / (value.endsWith("ms") ? 1000 : 1);
        };
        const context = gsap.context(() => {}, root!);
        const seenKey = "portfolio-hangar-pipeline-seen";
        let seen = false;
        try { seen = sessionStorage.getItem(seenKey) === "true"; } catch { /* Storage is optional. */ }

        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            const element = entry.target as HTMLElement;
            context.add(() => {
              if (element.matches(".home-pipeline")) {
                if (seen) return;
                seen = true;
                try { sessionStorage.setItem(seenKey, "true"); } catch { /* No replay within this mount either. */ }
                const nodes = element.querySelectorAll(".pipeline-point");
                const lines = element.querySelectorAll(".pipeline-flow");
                const mobileLines = element.querySelectorAll(".pipeline-mobile-flow");
                const step = seconds("--duration-pipeline-step");
                const node = seconds("--duration-pipeline-node");
                const timeline = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: () => { element.dataset.motion = "complete"; } });
                element.dataset.motion = "playing";
                nodes.forEach((point, index) => {
                  timeline.fromTo(point, { opacity: 0.35 }, { opacity: 1, duration: node, clearProps: "opacity" }, index * step);
                  if (lines[index]) timeline.fromTo(lines[index], { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: step, clearProps: "transform,transformOrigin" }, index * step);
                  if (mobileLines[index]) timeline.fromTo(mobileLines[index], { scaleY: 0, transformOrigin: "center top" }, { scaleY: 1, duration: step, clearProps: "transform,transformOrigin" }, index * step);
                });
              } else {
                // Hide only at the instant a visible section starts its 400ms reveal.
                // Excluding an already visible section avoids a hydration flash.
                // Contenido en bloques escalonados (40ms; 80ms para piezas grandes, total < 300ms).
                const items = element.querySelectorAll(":scope > .home-section-heading, .service-list > li, .featured-row, .bento > li, .about-intro, .about-side > section, .contact-panel");
                const targets = items.length ? items : element;
                const stagger = seconds(items.length > 4 ? "--duration-stagger" : "--duration-micro");
                // power4.out = quint out, el equivalente GSAP de --ease-smooth-out.
                gsap.fromTo(targets, { opacity: 0, y: parseFloat(styles.getPropertyValue("--distance-reveal")) }, { opacity: 1, y: 0, duration: seconds("--duration-reveal"), ease: "power4.out", stagger, clearProps: "opacity,transform" });
              }
            });
          }
        }, { threshold: 0.05 });

        const pipeline = root!.querySelector(".home-pipeline");
        if (pipeline && !seen) observer.observe(pipeline);
        root!.querySelectorAll<HTMLElement>(".home-section").forEach(section => {
          if (section.getBoundingClientRect().top >= innerHeight) observer.observe(section);
        });

        cleanup = () => { observer.disconnect(); context.revert(); };
      } catch {
        // Network/import failures preserve the server-rendered content.
      }
    }
    const stop = () => { if (preference.matches) { disposed = true; cleanup(); } };
    preference.addEventListener("change", stop);
    void enhance();
    return () => { disposed = true; preference.removeEventListener("change", stop); cleanup(); };
  }, []);

  return null;
}

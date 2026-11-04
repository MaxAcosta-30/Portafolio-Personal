"use client";

import { useEffect } from "react";

/** Progressive enhancement: nothing is hidden while GSAP loads or if it fails. */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-content");
    if (!root) return;
    const spotlight = (event: PointerEvent) => {
      const surface = (event.target as Element).closest<HTMLElement>("[data-spotlight]");
      if (!surface) return;
      const box = surface.getBoundingClientRect();
      surface.style.setProperty("--mx", `${event.clientX - box.left}px`);
      surface.style.setProperty("--my", `${event.clientY - box.top}px`);
    };
    root.addEventListener("pointermove", spotlight, { passive: true });
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return () => root.removeEventListener("pointermove", spotlight);

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
              } else if (element.matches(".featured-row")) {
                // Cada caso entra cuando él mismo aparece; el panel técnico llega desde su lado.
                const index = [...element.parentElement!.querySelectorAll(".featured-row")].indexOf(element);
                const duration = seconds("--duration-reveal");
                const distance = parseFloat(styles.getPropertyValue("--distance-reveal"));
                const settle = { opacity: 1, x: 0, y: 0, filter: "blur(0px)", ease: "power4.out", clearProps: "opacity,transform,filter" };
                gsap.timeline()
                  .fromTo(element.querySelector(".featured-copy"), { opacity: 0, y: distance }, { ...settle, duration }, 0)
                  .fromTo(element.querySelector(".project-technical"), { opacity: 0, x: (index % 2 ? -1 : 1) * distance * 3, filter: "blur(8px)" }, { ...settle, duration: duration * 1.5 }, 0.08);
              } else {
                // Cada tipo de sección tiene su propia entrada; todas parten de 400ms y smooth-out.
                const duration = seconds("--duration-reveal");
                const distance = parseFloat(styles.getPropertyValue("--distance-reveal"));
                const stagger = seconds("--duration-stagger");
                const settle = { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0% round 14px)", duration, ease: "power4.out", clearProps: "opacity,transform,filter,clipPath" };
                const timeline = gsap.timeline();
                const heading = element.querySelector(":scope > .home-section-heading");
                if (heading) timeline.fromTo(heading, { opacity: 0, y: distance }, { ...settle }, 0);
                const services = element.querySelectorAll(".service-list > li");
                const cells = element.querySelectorAll(".bento > li");
                const contact = element.querySelector(".contact-panel");
                if (services.length) timeline.fromTo(services, { opacity: 0, x: -distance * 2 }, { ...settle, stagger: stagger * 2 }, 0.08);
                else if (cells.length) timeline.fromTo(cells, { opacity: 0, y: distance * 2, clipPath: "inset(0% 0% 24% 0% round 14px)" }, { ...settle, stagger }, 0.08);
                else if (element.querySelector(".featured-row")) { /* Los casos se observan por separado. */ }
                else if (contact) timeline.fromTo(contact, { opacity: 0, scale: 0.97, filter: "blur(10px)" }, { ...settle, duration: duration * 1.5 }, 0.08);
                else timeline.fromTo(element.querySelectorAll(".about-intro, .about-side > section"), { opacity: 0, y: distance }, { ...settle, stagger: stagger * 2 }, 0);
              }
            });
          }
        }, { threshold: 0.05 });

        const pipeline = root!.querySelector(".home-pipeline");
        if (pipeline && !seen) observer.observe(pipeline);
        root!.querySelectorAll<HTMLElement>(".home-section, .featured-row").forEach(section => {
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
    return () => { disposed = true; root.removeEventListener("pointermove", spotlight); preference.removeEventListener("change", stop); cleanup(); };
  }, []);

  return null;
}

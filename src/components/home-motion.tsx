"use client";

import { useEffect } from "react";

/**
 * Movimiento ligado al scroll de la home (mejora progresiva: sin JS o con
 * movimiento reducido todo queda visible y encendido).
 * - Las filas del registro se encienden en secuencia al aparecer.
 * - La frase de Sobre mí se desplaza con el scroll.
 */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-content");
    if (!root) return;

    // Luz bajo el cursor en superficies [data-spotlight] (no es movimiento: siempre activa).
    const spotlight = (event: PointerEvent) => {
      const surface = (event.target as Element).closest<HTMLElement>("[data-spotlight]");
      if (!surface) return;
      const box = surface.getBoundingClientRect();
      surface.style.setProperty("--mx", `${event.clientX - box.left}px`);
      surface.style.setProperty("--my", `${event.clientY - box.top}px`);
    };
    root.addEventListener("pointermove", spotlight, { passive: true });

    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let revert = () => {};
    let disposed = false;

    async function enhance() {
      if (preference.matches) return;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (disposed || preference.matches) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          ScrollTrigger.batch(".registry-row", {
            start: "top 88%", once: true,
            onEnter: rows => gsap.fromTo(rows, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, ease: "power4.out", stagger: 0.06, clearProps: "opacity,transform" }),
          });

          gsap.fromTo(".about-statement", { xPercent: 6 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".about-band", start: "top bottom", end: "center center", scrub: 0.6 } });
        }, root!);
        revert = () => context.revert();
      } catch {
        // Si GSAP no carga, el HTML ya está completo y encendido.
      }
    }
    const stop = () => { if (preference.matches) { disposed = true; revert(); } };
    preference.addEventListener("change", stop);
    void enhance();
    return () => { disposed = true; root.removeEventListener("pointermove", spotlight); preference.removeEventListener("change", stop); revert(); };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/**
 * Movimiento de la home (mejora progresiva: sin JS o con movimiento reducido
 * todo queda visible, estático y con scroll nativo).
 * - Lenis para el scroll suave, sincronizado con ScrollTrigger; las anclas calculan su destino con scroll-margin.
 * - Proyectos: la A del logo de cada caso se separa y vuelve a encajar al llegar.
 * - Proceso: el raíl se llena con el scroll.
 * - Otros sistemas: las filas entran escalonadas.
 */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-content");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches) return;
    let disposed = false;
    let revert = () => {};

    async function enhance() {
      try {
        const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]);
        if (disposed || preference.matches) return;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ duration: 1.1 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Anclas internas: desplazamiento suave hasta el borde definido por scroll-margin.
        const onClick = (event: MouseEvent) => {
          const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
          const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
          if (!target) return;
          event.preventDefault();
          // Posición explícita (con scroll-margin) para que el destino sea exacto en cualquier viewport.
          const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          lenis.scrollTo(Math.max(0, target.getBoundingClientRect().top + scrollY - margin));
          history.pushState(null, "", link.hash);
        };
        document.addEventListener("click", onClick);

        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".featured-row").forEach(row => {
            const logo = row.querySelector<HTMLElement>(".case-logo");
            if (!logo) return;
            let timer = 0;
            const pop = () => { logo.dataset.split = ""; clearTimeout(timer); timer = window.setTimeout(() => delete logo.dataset.split, 700); };
            ScrollTrigger.create({ trigger: row, start: "top 65%", onEnter: pop, onEnterBack: pop });
          });

          const rail = root!.querySelector(".process-rail > span");
          if (rail) {
            const horizontal = matchMedia("(width >= 64rem)").matches;
            gsap.fromTo(rail, horizontal ? { scaleX: 0 } : { scaleY: 0 }, { ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }), ease: "none", scrollTrigger: { trigger: ".process-list", start: "top 75%", end: "bottom 55%", scrub: 0.5 } });
          }

          ScrollTrigger.batch(".registry-row", {
            start: "top 90%", once: true,
            onEnter: rows => gsap.fromTo(rows, { y: 16, filter: "blur(4px)" }, { y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out", stagger: 0.06, clearProps: "transform,filter" }),
          });
        }, root!);

        revert = () => {
          context.revert();
          document.removeEventListener("click", onClick);
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      } catch {
        // Si GSAP o Lenis no cargan, el HTML ya está completo y el scroll es nativo.
      }
    }
    const stop = () => { if (preference.matches) { disposed = true; revert(); } };
    preference.addEventListener("change", stop);
    // GSAP, ScrollTrigger y Lenis solo hacen falta al moverse por la página: se cargan con la primera interacción.
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const start = () => { events.forEach(name => removeEventListener(name, start)); void enhance(); };
    events.forEach(name => addEventListener(name, start, { passive: true, once: true }));
    return () => { disposed = true; events.forEach(name => removeEventListener(name, start)); preference.removeEventListener("change", stop); revert(); };
  }, []);

  return null;
}

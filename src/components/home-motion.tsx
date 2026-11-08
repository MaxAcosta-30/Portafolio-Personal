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

          // Vitrina: el scroll endereza los equipos al llegar y el cursor los inclina (solo puntero fino).
          gsap.utils.toArray<HTMLElement>("[data-showcase] .showcase-stage").forEach(stage => {
            const tilt = { rx: 8, ry: -12, px: 0, py: 0 };
            const paint = () => { stage.style.setProperty("--rx", `${tilt.rx + tilt.py}deg`); stage.style.setProperty("--ry", `${tilt.ry + tilt.px}deg`); };
            gsap.fromTo(tilt, { rx: 22, ry: -26 }, { rx: 6, ry: -9, ease: "none", onUpdate: paint, scrollTrigger: { trigger: stage, start: "top 95%", end: "center 45%", scrub: 0.6 } });
            if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
            const toX = gsap.quickTo(tilt, "px", { duration: 0.6, ease: "power3.out", onUpdate: paint });
            const toY = gsap.quickTo(tilt, "py", { duration: 0.6, ease: "power3.out", onUpdate: paint });
            stage.addEventListener("pointermove", event => {
              const box = stage.getBoundingClientRect();
              toX(((event.clientX - box.left) / box.width - 0.5) * 10);
              toY(-((event.clientY - box.top) / box.height - 0.5) * 8);
            });
            stage.addEventListener("pointerleave", () => { toX(0); toY(0); });
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

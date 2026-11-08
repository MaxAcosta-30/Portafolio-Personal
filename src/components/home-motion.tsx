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

          // Vitrinas: cada proyecto entra a su manera; el cursor las inclina a todas (solo puntero fino).
          gsap.utils.toArray<HTMLElement>("[data-showcase]").forEach(figure => {
            const stage = figure.querySelector<HTMLElement>(".showcase-stage");
            if (!stage) return;
            const [back, front, phone] = [".device-back", ".device-front", ".device-phone"].map(s => stage.querySelector<HTMLElement>(s));
            const devices = [back, front, phone].filter((d): d is HTMLElement => d !== null);
            const motion = figure.dataset.showcase;
            if (motion === "sello") {
              // Hito: las ventanas caen en su sitio y el celular se estampa con un golpe seco (una vez).
              const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
              tl.from([back, front].filter(Boolean), { "--ty": "-48px", opacity: 0, duration: 0.6, stagger: 0.08 });
              if (phone) tl.from(phone, { "--s": 1.45, "--rz": "-9deg", opacity: 0, duration: 0.42, ease: "expo.out" }, "-=0.15")
                .to(stage, { "--ry": "-13.5deg", duration: 0.09, yoyo: true, repeat: 1, ease: "power1.out" }, "<0.32");
              ScrollTrigger.create({ trigger: stage, start: "top 70%", once: true, onEnter: () => tl.play() });
            } else if (motion === "porton") {
              // Hangar: un portón que sube; las pantallas se revelan de abajo hacia arriba con el scroll.
              gsap.fromTo(devices, { "--clip": "100%" }, { "--clip": "0%", ease: "none", stagger: 0.25, scrollTrigger: { trigger: stage, start: "top 90%", end: "center 55%", scrub: 0.6 } });
            } else if (motion === "andenes") {
              // TaskFlow: las pantallas cambian de columna como una tarjeta, y el celular llega al final.
              const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 90%", end: "center 50%", scrub: 0.6 } });
              if (back) tl.fromTo(back, { "--tx": "-140px", opacity: 0 }, { "--tx": "0px", opacity: 0.9, ease: "none" }, 0);
              if (front) tl.fromTo(front, { "--tx": "140px", opacity: 0 }, { "--tx": "0px", opacity: 1, ease: "none" }, 0.1);
              if (phone) tl.fromTo(phone, { "--tx": "90px", opacity: 0 }, { "--tx": "0px", opacity: 1, ease: "none" }, 0.45);
            }
            if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
            const tilt = { px: 0, py: 0 };
            const base = { rx: parseFloat(getComputedStyle(stage).getPropertyValue("--rx")) || 8, ry: parseFloat(getComputedStyle(stage).getPropertyValue("--ry")) || -12 };
            const paint = () => { stage.style.setProperty("--rx", `${base.rx + tilt.py}deg`); stage.style.setProperty("--ry", `${base.ry + tilt.px}deg`); };
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

          // Otros proyectos: cada ficha se desliza en su archivero (la portada barre de izquierda a derecha).
          ScrollTrigger.batch(".registry-row", {
            start: "top 88%", once: true,
            onEnter: rows => {
              gsap.fromTo(rows.map(row => row.querySelector(".registry-cover")), { clipPath: "inset(0 100% 0 0 round 8px)" }, { clipPath: "inset(0 0% 0 0 round 8px)", duration: 0.7, ease: "power4.out", stagger: 0.08, clearProps: "clipPath" });
              gsap.fromTo(rows.map(row => row.querySelector(".registry-body")), { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.12, clearProps: "transform,opacity" });
            },
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

"use client";

import type { MouseEvent } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Ambos iconos viven en el DOM; CSS muestra el del tema activo, así no hay desajuste de hidratación. */
export function ThemeToggle() {
  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch { /* Preferencia solo para esta visita. */ }
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("startViewTransition" in document)) return apply();
    // Revelado circular desde el botón: el nuevo tema se expande sobre el anterior.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2, y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => {});
  }

  return <button type="button" className="theme-toggle" onClick={toggle} aria-label="Cambiar entre tema claro y oscuro">
    <svg className="theme-icon theme-icon-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="3.5" /><path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" /></svg>
    <svg className="theme-icon theme-icon-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M16.5 12.2A6.8 6.8 0 0 1 7.8 3.5a6.8 6.8 0 1 0 8.7 8.7Z" /></svg>
  </button>;
}

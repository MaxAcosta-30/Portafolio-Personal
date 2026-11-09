"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/head-script";

type Theme = "dark" | "light";

/** Duración del salto de la A (logo.css: logo-theme-hop). El tema cambia en la mitad. */
const HOP_MS = 560;
const THEME_MS = 300;

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

let hopTimer = 0;
let switchTimer = 0;
let fadeTimer = 0;

function applyTheme(next: Theme) {
  const root = document.documentElement;
  try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* La elección dura solo esta visita. */ }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.dataset.theme = next;
    return;
  }
  // Salto de la A; a la mitad cambia el tema y los colores del sitio pasan en 300ms.
  [hopTimer, switchTimer, fadeTimer].forEach(clearTimeout);
  delete root.dataset.themeHop;
  void root.offsetWidth; // Reinicia la animación si se pulsa dos veces seguidas.
  root.dataset.themeHop = "";
  switchTimer = window.setTimeout(() => {
    root.classList.add("theme-transition");
    root.dataset.theme = next;
    fadeTimer = window.setTimeout(() => root.classList.remove("theme-transition"), THEME_MS + 50);
  }, HOP_MS / 2);
  hopTimer = window.setTimeout(() => { delete root.dataset.themeHop; }, HOP_MS);
}

export function ThemeToggle() {
  // null en el servidor: el tema real solo existe en el navegador (lo fija el script de <head>).
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);
  const next: Theme = theme === "light" ? "dark" : "light";
  const label = theme === null ? "Cambiar tema" : theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return <button type="button" className="theme-toggle" aria-label={label} onClick={() => applyTheme(next)}>
    <svg className="theme-icon-sun" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.75M10 15.75v1.75M2.5 10h1.75M15.75 10h1.75M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M4.7 15.3l1.24-1.24M14.06 5.94l1.24-1.24" />
    </svg>
    <svg className="theme-icon-moon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M16.5 12.2A6.75 6.75 0 0 1 7.8 3.5a6.75 6.75 0 1 0 8.7 8.7Z" />
    </svg>
  </button>;
}

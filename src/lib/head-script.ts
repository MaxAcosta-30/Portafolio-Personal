/**
 * Script bloqueante de <head>, inline para que corra antes del primer pintado (sin parpadeo):
 * - html.js: hay JavaScript (mejora progresiva).
 * - data-theme: elección guardada en localStorage o, en la primera visita, prefers-color-scheme.
 * - intro-seen: el preloader solo se muestra en la primera visita y con movimiento permitido.
 */
export const THEME_STORAGE_KEY = "theme";
export const VISITED_STORAGE_KEY = "visited";

export const headScript = `(function(){var d=document.documentElement;d.classList.add("js");var t=null;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.setAttribute("data-theme",t);try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||localStorage.getItem("${VISITED_STORAGE_KEY}")){d.classList.add("intro-seen")}else{localStorage.setItem("${VISITED_STORAGE_KEY}","1")}}catch(e){d.classList.add("intro-seen")}})();`;

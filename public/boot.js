// Archivo externo (la CSP no permite scripts inline de autor): prepara clases antes del primer pintado.
var root = document.documentElement;
root.classList.add("js");
try {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || sessionStorage.getItem("intro-seen")) root.classList.add("intro-seen");
  else sessionStorage.setItem("intro-seen", "1");
} catch {
  root.classList.add("intro-seen");
}

// Aplica el tema elegido antes del primer pintado (archivo externo: la CSP bloquea scripts inline).
try {
  var theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch { /* Sin almacenamiento: se usa la preferencia del sistema. */ }

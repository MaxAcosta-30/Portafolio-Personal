"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Cada cambio de apartado abre la página nueva desde arriba, sin animación.
 *  Next 16 ya no anula el `scroll-behavior: smooth` al navegar: la subida quedaba animada y se cortaba
 *  a la mitad cuando la página nueva cambiaba de alto. Si el enlace lleva ancla (/proyectos#hito), manda el ancla. */
export function ScrollToTop() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (location.hash) return;
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    reset();
    // Un fotograma después: el contenido nuevo ya pintó y una animación previa (Lenis) ya no lo mueve.
    const frame = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}

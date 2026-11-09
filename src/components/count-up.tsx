"use client";

import { useEffect, useRef } from "react";

const DURATION = 900;

/**
 * Número que cuenta de 0 a su valor al entrar en pantalla, con un desenfoque que se aclara.
 * El HTML ya trae el valor final (sin JS, lectores de pantalla y movimiento reducido lo ven
 * tal cual); con JS, el CSS lo desenfoca hasta que empieza a contar para que no "salte" del
 * valor a 0. Solo escribe en el DOM por ref: no hay setState por fotograma.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const done = () => { node.textContent = `${value}${suffix}`; node.dataset.counted = ""; node.style.filter = ""; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || value === 0) { done(); return; }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      node.dataset.counted = "";
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        node.textContent = `${Math.round(value * eased)}${suffix}`;
        node.style.filter = `blur(${(1 - eased) * 6}px)`;
        if (t < 1) frame = requestAnimationFrame(tick); else done();
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, suffix]);

  return <span ref={ref} className="count-up">{value}{suffix}</span>;
}

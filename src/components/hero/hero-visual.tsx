"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroFallback } from "./hero-fallback";
import { LogsCard } from "./logs-card";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

function webglAvailable() {
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
}

/**
 * Lado derecho del hero. El SVG estático siempre está en el HTML; la escena 3D
 * se monta tras la primera interacción, si hay WebGL y el movimiento está permitido,
 * y se pausa al salir del viewport.
 */
export function HeroVisual() {
  const box = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !webglAvailable()) return;
    // La escena (three.js + WebGL) se monta con la primera interacción: no bloquea la carga inicial.
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 50));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    let handle = 0;
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const start = () => { events.forEach(name => removeEventListener(name, start)); handle = idle(() => setMount(true)); };
    events.forEach(name => addEventListener(name, start, { passive: true, once: true }));
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (box.current) observer.observe(box.current);
    const stop = () => { if (reduce.matches) { setMount(false); setReady(false); } };
    reduce.addEventListener("change", stop);
    return () => { cancel(handle); events.forEach(name => removeEventListener(name, start)); observer.disconnect(); reduce.removeEventListener("change", stop); };
  }, []);

  return <div ref={box} className="hero-visual" data-ready={ready || undefined}>
    <div className="hero-stage">
      <HeroFallback />
      {mount && <div className="hero-canvas"><HeroScene active={visible} onReady={() => setReady(true)} /></div>}
    </div>
    <LogsCard />
  </div>;
}

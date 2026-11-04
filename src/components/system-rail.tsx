"use client";

import { useEffect, useRef, useState } from "react";

/** Riel decorativo del "sistema vivo": la línea se llena con el scroll y cada nodo se enciende al alcanzar su sección. */
export function SystemRail({ sections }: { sections: readonly string[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      rail.current?.style.setProperty("--rail-progress", String(max > 0 ? Math.min(1, scrollY / max) : 0));
      setReached(sections.filter(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= innerHeight * 0.5).length);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [sections]);

  return <div ref={rail} className="system-rail" aria-hidden="true">
    <span className="rail-fill" />
    {sections.map((id, index) => <span key={id} className="rail-node" data-reached={index < reached || undefined} />)}
  </div>;
}

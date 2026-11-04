"use client";

import { useEffect, useRef, useState } from "react";

const COLUMNS = ["Pendiente", "En curso", "Hecho"] as const;
type Card = { id: string; title: string; column: number };

const INITIAL: readonly Card[] = [
  { id: "a", title: "Revisar diseño", column: 0 },
  { id: "b", title: "Conectar API", column: 0 },
  { id: "c", title: "Publicar sitio", column: 1 },
];

/**
 * Ilustra el mecanismo real de TaskFlow Pro: la API publica en Redis (`board:{id}`)
 * y Socket.io retransmite a los demás clientes del tablero. Ana mueve; Luis recibe.
 */
export function SyncBoard() {
  const [ana, setAna] = useState<readonly Card[]>(INITIAL);
  const [luis, setLuis] = useState<readonly Card[]>(INITIAL);
  const [pulse, setPulse] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const timers = useRef<number[]>([]);

  function move(id: string) {
    const next = ana.map(card => card.id === id ? { ...card, column: (card.column + 1) % COLUMNS.length } : card);
    setAna(next);
    setLast(id);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPulse(value => value + 1);
    timers.current.push(window.setTimeout(() => setLuis(next), reduce ? 0 : 650));
  }

  // Demostración automática mientras está a la vista, hasta que el visitante toma el control.
  useEffect(() => {
    const element = root.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval = 0;
    const order = ["b", "a", "b", "c", "a"];
    let step = 0;
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(interval);
      if (!entry.isIntersecting) return;
      interval = window.setInterval(() => {
        if (touched.current) return clearInterval(interval);
        document.getElementById(`ana-${order[step++ % order.length]}`)?.click();
      }, 2200);
    }, { threshold: 0.4 });
    observer.observe(element);
    const pending = timers.current;
    return () => { observer.disconnect(); clearInterval(interval); pending.forEach(clearTimeout); };
  }, []);

  const board = (owner: "ana" | "luis", cards: readonly Card[]) => <div className="sync-screen" data-owner={owner}>
    <p className="sync-user">{owner === "ana" ? "Ana" : "Luis"}<span>{owner === "ana" ? "mueve tarjetas" : "recibe sin recargar"}</span></p>
    <div className="sync-columns">
      {COLUMNS.map((column, index) => <div key={column} className="sync-column">
        <p>{column}</p>
        <ul>{cards.filter(card => card.column === index).map(card => <li key={card.id} data-fresh={card.id === last || undefined}>
          {owner === "ana"
            ? <button id={`ana-${card.id}`} type="button" onClick={event => { if (event.isTrusted) touched.current = true; move(card.id); }} aria-label={`Mover «${card.title}» a la siguiente columna`}>{card.title}</button>
            : <span>{card.title}</span>}
        </li>)}</ul>
      </div>)}
    </div>
  </div>;

  return <div ref={root} className="sync-board" role="group" aria-label="Demostración de sincronización de TaskFlow Pro">
    {board("ana", ana)}
    <div className="sync-channel" aria-hidden="true">
      <span key={pulse} className="sync-pulse" data-active={pulse > 0 || undefined} />
      <code>redis.publish(&quot;board:42&quot;)</code>
    </div>
    {board("luis", luis)}
    <p className="sync-note">Demostración: pulsa una tarjeta en el tablero de Ana. En TaskFlow Pro, <code>publishToBoard()</code> publica en Redis y Socket.io retransmite a los clientes del tablero.</p>
  </div>;
}

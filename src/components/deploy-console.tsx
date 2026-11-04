"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Stage = "clone" | "build" | "run" | "route";
type Event = { at: number; stage: Stage | null; text: (slug: string) => string };

const STAGES: readonly Stage[] = ["clone", "build", "run", "route"];

/** Guion basado en el flujo real de Hangar (handler → DeployWorkflow → actividades → Traefik). */
const SCRIPT: readonly Event[] = [
  { at: 0, stage: null, text: slug => `POST /api/apps/${slug}/deploy → 202 Accepted` },
  { at: 350, stage: null, text: () => "deployment pending · DeployWorkflow iniciado en Temporal" },
  { at: 700, stage: "clone", text: () => "CloneRepository · clonando el repositorio Git" },
  { at: 1250, stage: "clone", text: () => "Dockerfile encontrado" },
  { at: 1600, stage: "build", text: slug => `BuildDockerImage · docker build -t ${slug}` },
  { at: 2300, stage: "build", text: () => "salida de docker build → Redis Pub/Sub → dashboard" },
  { at: 2900, stage: "build", text: () => "imagen construida" },
  { at: 3250, stage: "run", text: () => "RunContainer · red bridge propia · 128 MiB · 0.25 CPU" },
  { at: 3800, stage: "run", text: () => "contenedor conectado a la red de Traefik" },
  { at: 4200, stage: "route", text: slug => `Traefik · Host(\`${slug}.hangar.local\`)` },
  { at: 4700, stage: null, text: () => "deployment success" },
];
const END = SCRIPT.length;

function slugify(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28) || "tu-negocio";
}

function stageState(stage: Stage, shown: number) {
  let last: Stage | null = null;
  for (const event of SCRIPT.slice(0, shown)) if (event.stage) last = event.stage;
  const order = STAGES.indexOf(stage);
  const current = last ? STAGES.indexOf(last) : -1;
  if (shown >= END || order < current) return "done";
  if (order === current) return "running";
  return "queued";
}

const LABEL = { queued: "en cola", running: "ejecutando", done: "listo" } as const;

/**
 * Elemento firma: Hangar "despliega" el negocio del visitante.
 * Sin JavaScript se ve el despliegue terminado; con movimiento reducido, también.
 */
export function DeployConsole({ caseHref }: { caseHref: string }) {
  const [name, setName] = useState("tu-negocio");
  const [slug, setSlug] = useState("tu-negocio");
  const [shown, setShown] = useState(END);
  const [hydrated, setHydrated] = useState(false);
  const timers = useRef<number[]>([]);
  const log = useRef<HTMLOListElement>(null);

  function run(nextSlug: string) {
    timers.current.forEach(clearTimeout);
    setSlug(nextSlug);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(END);
    setShown(0);
    timers.current = SCRIPT.map((event, index) => window.setTimeout(() => setShown(index + 1), event.at + 200));
  }

  useEffect(() => {
    // Arranca en el siguiente frame: el HTML del servidor ya mostró el estado final.
    const frame = requestAnimationFrame(() => { setHydrated(true); run("tu-negocio"); });
    const pending = timers;
    return () => { cancelAnimationFrame(frame); pending.current.forEach(clearTimeout); };
  }, []);

  // Solo el registro se desplaza; nunca la página.
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [shown]);

  function submit(event: FormEvent) {
    event.preventDefault();
    run(slugify(name));
  }

  const deploying = shown < END;
  return <figure className="deploy" data-hydrated={hydrated || undefined} data-state={deploying ? "running" : "success"} aria-labelledby="deploy-caption">
    <div className="deploy-bar">
      <span className="deploy-brand">hangar</span>
      <span className="deploy-repo">{slug}</span>
      <span className="deploy-status" aria-live="polite">{deploying ? "desplegando…" : "success"}</span>
    </div>
    <form className="deploy-form" onSubmit={submit}>
      <label htmlFor="deploy-name">Nombre de tu negocio</label>
      <div>
        <input id="deploy-name" value={name} onChange={event => setName(event.target.value)} maxLength={40} autoComplete="off" spellCheck={false} />
        <button type="submit" disabled={deploying}>Desplegar</button>
      </div>
    </form>
    <ol className="deploy-stages" aria-label="Etapas del despliegue">
      {STAGES.map(stage => {
        const state = stageState(stage, shown);
        return <li key={stage} data-state={state}><span className="stage-name">{stage}</span><span className="stage-bar" aria-hidden="true"><span /></span><span className="stage-label">{LABEL[state]}</span></li>;
      })}
    </ol>
    <ol ref={log} className="deploy-log" aria-label="Registro del despliegue" tabIndex={0}>
      {SCRIPT.slice(0, shown).map((event, index) => <li key={index} data-stage={event.stage ?? "api"}>
        <span className="log-time">{(event.at / 1000).toFixed(2).padStart(5, "0")}s</span>
        <span className="log-tag">{event.stage ?? "api"}</span>
        <span className="log-text">{event.text(slug)}</span>
      </li>)}
    </ol>
    <div className="deploy-result" aria-hidden={deploying || undefined}>
      <span className="result-dot" aria-hidden="true" />
      <span className="result-url">{slug}.hangar.local</span>
      <span className="result-note">desplegado</span>
    </div>
    <figcaption id="deploy-caption">
      Simulación del flujo real de Hangar: DeployWorkflow en Temporal, CloneRepository, BuildDockerImage, RunContainer y Traefik. <Link href={caseHref}>Ver cómo funciona</Link>
    </figcaption>
  </figure>;
}

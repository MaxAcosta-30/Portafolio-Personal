const LINES = [
  { cmd: "git clone", detail: "repo → worker" },
  { cmd: "docker build", detail: "imagen lista" },
  { cmd: "temporal workflow", detail: "ok" },
  { cmd: "traefik route", detail: "host aplicado" },
  { cmd: "✓ live", detail: "en línea" },
] as const;

/** Tarjeta de logs: los pasos reales del pipeline de Hangar suben en bucle. */
export function LogsCard() {
  const list = (hidden: boolean) => <ol aria-hidden={hidden || undefined}>{LINES.map(line => <li key={line.cmd} data-live={line.cmd.startsWith("✓") || undefined}><span>{line.cmd}</span><span>{line.detail}</span></li>)}</ol>;
  return <figure className="logs-card" aria-label="Pasos del pipeline de Hangar">
    <figcaption><span>hangar · logs</span><span className="logs-live"><span aria-hidden="true" />live</span></figcaption>
    <div className="logs-window"><div className="logs-track">{list(false)}{list(true)}</div></div>
  </figure>;
}

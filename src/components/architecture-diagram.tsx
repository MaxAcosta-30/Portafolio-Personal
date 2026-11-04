type Node = { title: string; detail: string };

/** Ordered flow: horizontal on desktop, vertical on mobile. */
export function CompactArchitectureDiagram({ id, label, nodes }: { id: string; label: string; nodes: readonly Node[] }) {
  return <div className="architecture-diagram compact-architecture">
    <ol className="sr-only" aria-label={label}>{nodes.map(node => <li key={node.title}>{node.title}: {node.detail}</li>)}</ol>
    {([false, true] as const).map(vertical => {
      const step = vertical ? 80 : 160;
      const marker = `${id}-${vertical ? "vertical" : "horizontal"}-tip`;
      return <svg key={marker} className={vertical ? "compact-flow-vertical" : "compact-flow-horizontal"} viewBox={`0 0 ${vertical ? 320 : nodes.length * step} ${vertical ? nodes.length * step : 72}`} aria-hidden="true" focusable="false">
        <defs><marker id={marker} markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L6 4L0 8" fill="none" stroke="currentColor" /></marker></defs>
        {nodes.map((node, index) => {
          const x = vertical ? 24 : index * step + 8;
          const y = vertical ? index * step + 8 : 8;
          const width = vertical ? 272 : 136;
          return <g key={node.title}>
            <rect x={x} y={y} width={width} height="48" rx="2" />
            <text x={x + width / 2} y={y + 30} className="architecture-node-title">{node.title}</text>
            {index < nodes.length - 1 && <line x1={vertical ? 160 : x + width + 4} y1={vertical ? y + 52 : y + 24} x2={vertical ? 160 : x + step - 4} y2={vertical ? y + step - 4 : y + 24} markerEnd={`url(#${marker})`} />}
          </g>;
        })}
      </svg>;
    })}
  </div>;
}

function wrap(text: string) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    if (lines.length && `${lines.at(-1)} ${word}`.length <= 24) lines[lines.length - 1] += ` ${word}`;
    else lines.push(word);
  }
  return lines;
}

/** The two geometric layouts share one accessible, ordered text alternative. */
export function ArchitectureDiagram({ id, label, nodes }: { id: string; label: string; nodes: readonly Node[] }) {
  return <div className="architecture-diagram">
    <ol className="sr-only" aria-label={label}>{nodes.map(node => <li key={node.title}>{node.title}: {node.detail}</li>)}</ol>
    {([false, true] as const).map(vertical => {
      const step = vertical ? 132 : 208;
      const width = vertical ? 320 : nodes.length * step;
      const height = vertical ? nodes.length * step : 100;
      const marker = `${id}-${vertical ? "mobile" : "desktop"}-tip`;
      return <svg key={marker} className={vertical ? "architecture-mobile" : "architecture-desktop"} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
        <defs><marker id={marker} markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L6 4L0 8" fill="none" stroke="currentColor" /></marker></defs>
        {nodes.map((node, index) => {
          const x = vertical ? 24 : index * step + 8;
          const y = vertical ? index * step + 8 : 8;
          const w = vertical ? 272 : 176;
          return <g key={node.title}>
            <rect x={x} y={y} width={w} height={vertical ? 100 : 72} rx="2" />
            <text x={x + w / 2} y={y + (vertical ? 29 : 45)} className="architecture-node-title">{node.title}</text>
            {vertical && <text x={x + w / 2} y={y + 54} className="architecture-node-detail">{wrap(node.detail).map((line, lineIndex) => <tspan key={lineIndex} x={x + w / 2} dy={lineIndex ? 18 : 0}>{line}</tspan>)}</text>}
            {index < nodes.length - 1 && <line x1={vertical ? 160 : x + w + 4} y1={vertical ? y + 104 : y + 36} x2={vertical ? 160 : x + step - 4} y2={vertical ? y + step - 4 : y + 36} markerEnd={`url(#${marker})`} />}
          </g>;
        })}
      </svg>;
    })}
  </div>;
}

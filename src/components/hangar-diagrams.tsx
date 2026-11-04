import { Icon } from "@/components/ui";
import { hangarCaseStudy as content, type FlowNode } from "@/content/hangar-case-study";

/** DOM order is the flow order, including when the layout stacks on small screens. */
export function FlowDiagram({ nodes, label, code = false }: { nodes: readonly FlowNode[]; label: string; code?: boolean }) {
  return (
    <ol aria-label={label} className="case-flow">
      {nodes.map((node, index) => <li key={node.title} className="case-flow-step">
        <div className="min-w-0 flex-1">
          <p className={code ? "font-mono text-title text-accent" : "font-medium"}>{node.title}</p>
          <p className="mt-2 text-label text-muted">{node.detail}</p>
        </div>
        {index < nodes.length - 1 && <span className="case-flow-arrow"><Icon name="arrow" /></span>}
      </li>)}
    </ol>
  );
}

export function IsolationDiagram() {
  const data = content.isolation;
  return <figure aria-labelledby="isolation-diagram-title" className="min-w-0">
    <figcaption id="isolation-diagram-title" className="mb-6 font-medium">{data.diagramTitle}</figcaption>
    <svg className="isolation-svg" viewBox="0 0 280 250" role="img" aria-labelledby="isolation-svg-title isolation-svg-description">
      <title id="isolation-svg-title">{data.diagramTitle}</title>
      <desc id="isolation-svg-description">{data.text} {data.limit}</desc>
      <defs><marker id="isolation-tip" markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L6 4L0 8" /></marker></defs>
      {data.apps.map((app, index) => {
        const x = index === 0 ? 4 : 152;
        return <g key={app.title}>
          <rect x={x} y="8" width="124" height="82" rx="2" />
          <text x={x + 62} y="39">{app.title}</text>
          <text x={x + 62} y="63" className="isolation-network-label">{app.network}</text>
          <line x1={x + 62} y1="94" x2={x + 62} y2="150" markerEnd="url(#isolation-tip)" />
        </g>;
      })}
      <rect x="4" y="156" width="272" height="78" rx="2" />
      <text x="140" y="187">{data.sharedNetwork}</text>
      <text x="140" y="211" className="isolation-network-label">{data.sharedDetail}</text>
    </svg>
    <p className="mt-4 text-label text-muted">{data.caption}</p>
  </figure>;
}

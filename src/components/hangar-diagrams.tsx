import { SequenceList } from "./sequence-list";
import { hangarCaseStudy as content, type FlowNode } from "@/content/hangar-case-study";

export function FlowDiagram({ nodes, label, code = false }: { nodes: readonly FlowNode[]; label: string; code?: boolean }) {
  return <SequenceList steps={nodes} label={label} code={code} />;
}

/** Topología de redes como lista: cada app con su red y la red compartida de Traefik. */
export function IsolationDiagram() {
  const data = content.isolation;
  return <figure aria-labelledby="isolation-diagram-title" className="min-w-0">
    <figcaption id="isolation-diagram-title" className="mb-6 font-medium">{data.diagramTitle}</figcaption>
    <ul className="network-list">
      {data.apps.map(app => <li key={app.title}><p className="sequence-title">{app.title}</p><p className="sequence-detail">{app.network}</p></li>)}
      <li data-shared><p className="sequence-title">{data.sharedNetwork}</p><p className="sequence-detail">{data.sharedDetail}</p></li>
    </ul>
    <p className="mt-4 text-label text-muted">{data.caption}</p>
  </figure>;
}

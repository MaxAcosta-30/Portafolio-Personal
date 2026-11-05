import { SequenceList } from "./sequence-list";

type Node = { title: string; detail: string };

/** Arquitectura como secuencia ordenada (antes: SVG de cajas con flechas). */
export function ArchitectureDiagram({ id, label, nodes }: { id: string; label: string; nodes: readonly Node[] }) {
  return <div className="architecture-sequence" id={`${id}-sequence`}><SequenceList steps={nodes} label={label} /></div>;
}

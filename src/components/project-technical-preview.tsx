import { CompactArchitectureDiagram } from "./architecture-diagram";
import { projectPreviews } from "@/content/project-previews";

export function ProjectTechnicalPreview({ projectId, projectName }: { projectId: string; projectName: string }) {
  const preview = projectPreviews[projectId as keyof typeof projectPreviews];
  if (!preview) return null;
  return <div className="project-technical" data-spotlight>
    <figure className="technical-flow">
      <figcaption>{preview.diagramLabel}</figcaption>
      <CompactArchitectureDiagram id={`preview-${projectId}`} label={preview.diagramLabel} nodes={preview.nodes} />
    </figure>
    <figure className="technical-code">
      <figcaption><a className="row-secondary" href={preview.source}><span className="sr-only">Archivo fuente: </span>{preview.file}</a><span>{preview.language} · líneas {preview.startLine}–{preview.endLine}</span></figcaption>
      <pre tabIndex={0} aria-label={`Código de ${projectName}:${preview.file}. Desplazamiento horizontal con las flechas del teclado.`}><code>{preview.code}</code></pre>
    </figure>
  </div>;
}

type Excerpt = {
  id: string;
  title: string;
  context: string;
  file: string;
  startLine: number;
  endLine: number;
  source: string;
  code: string;
};

export function CodeExcerpt({ excerpt }: { excerpt: Excerpt }) {
  return <figure className="technical-code case-code" aria-labelledby={`code-${excerpt.id}-title`}>
    <figcaption>
      <h3 id={`code-${excerpt.id}-title`} className="text-title text-foreground">{excerpt.title}</h3>
      <p className="case-copy mt-3 mb-4">{excerpt.context}</p>
      <a href={excerpt.source}><span className="sr-only">Archivo fuente: </span>{excerpt.file}</a>
      <span>Go · líneas {excerpt.startLine}–{excerpt.endLine}</span>
    </figcaption>
    <pre tabIndex={0} aria-label={`Código de ${excerpt.file}. Desplazamiento horizontal con las flechas del teclado.`}><code>{excerpt.code}</code></pre>
  </figure>;
}

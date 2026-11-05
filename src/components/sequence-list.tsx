type Step = { title: string; detail: string };

/** Secuencia numerada con raíl vertical: sustituye a los diagramas de cajas con flechas. El orden del DOM es el del flujo. */
export function SequenceList({ steps, label, code = false }: { steps: readonly Step[]; label: string; code?: boolean }) {
  return <ol aria-label={label} className="sequence" data-code={code || undefined}>
    {steps.map((step, index) => <li key={step.title}>
      <span className="sequence-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <p className="sequence-title">{step.title}</p>
        <p className="sequence-detail">{step.detail}</p>
      </div>
    </li>)}
  </ol>;
}

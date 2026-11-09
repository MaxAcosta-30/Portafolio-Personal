export const metadata = {
  title: "Muestra de dirección visual",
  description: "Página de muestra estática para validar la dirección minimalista con propósito.",
  robots: { index: false, follow: false },
} as const;

const proyectos = [
  {
    nombre: "Hangar",
    anio: "2025",
    descripcion: "Plataforma de despliegue autoalojada: convierte repositorios Git en contenedores con subdominio y logs en tiempo real.",
    stack: ["Go / Fiber", "Next.js", "Temporal.io", "Redis", "Docker"],
  },
  {
    nombre: "TaskFlow Pro",
    anio: "2025",
    descripcion: "Gestión de tareas con tableros sincronizados entre usuarios y automatizaciones por horarios, cambios de estado y webhooks.",
    stack: ["Node.js", "Next.js", "Socket.io", "Redis", "BullMQ"],
  },
  {
    nombre: "Secure Vault API",
    anio: "2024",
    descripcion: "API de gestión de secretos con cifrado de datos en reposo y control de acceso basado en JWT.",
    stack: [".NET 10", "AES-256", "JWT", "SQL Server"],
  },
];

export default function Muestra() {
  return (
    <main
      className="min-h-screen bg-[#f7f5f0] text-[#1a1a18] antialiased"
      style={{ fontFamily: 'var(--font-plex-sans), Arial, sans-serif' }}
    >
      <a
        href="#contenido"
        className="fixed top-3 left-3 -translate-y-full bg-[#ffffff] border border-[#d8d6d0] px-4 py-3 text-[#195c52] underline focus:translate-y-0 transition-transform duration-150 z-10"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto max-w-[77.5rem] px-[1.25rem] py-[4rem]">
        <header className="mb-[4rem] border-b border-[#d8d6d0] pb-[1.5rem]">
          <h1 className="text-[#1a1a18]" style={{ fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.2 }}>
            Muestra de dirección visual
          </h1>
          <p className="mt-[0.75rem] text-[#5a5a55]" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
            Minimalista con propósito. Cada elemento visible debe justificar su existencia.
          </p>
        </header>

        <section id="contenido" aria-labelledby="tipografia-title" className="mb-[4rem]">
          <h2 id="tipografia-title" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, marginBottom: "1rem" }}>
            Tipografía y escala
          </h2>
          <div className="space-y-[1.5rem]">
            <div>
              <p style={{ fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
                Display · 2.25rem · peso 600
              </p>
            </div>
            <div>
              <p style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, margin: 0 }}>
                Heading · 1.5rem · peso 600
              </p>
            </div>
            <div>
              <p style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.35, margin: 0 }}>
                Title · 1.125rem · peso 600
              </p>
            </div>
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.7, maxWidth: "64ch", margin: 0 }}>
                Body · 1rem · peso 400 · interlineado 1.7. Un párrafo de lectura dentro de una medida cómoda de 60 a 70 caracteres por línea. El contraste lo da el tamaño y el peso, no el color.
              </p>
            </div>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace' }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5, margin: 0, color: "#5a5a55" }}>
                Label · Mono · 0.875rem · peso 400 · para detalles técnicos, stack, rutas y comandos
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="espaciado-title" className="mb-[4rem]">
          <h2 id="espaciado-title" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, marginBottom: "1rem" }}>
            Espaciado
          </h2>
          <p className="mb-[1.5rem] text-[#5a5a55]" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
            Ritmo vertical generoso basado en una escala única (base 4px). El espacio vacío es parte del diseño, no un hueco por rellenar.
          </p>
          <div className="flex flex-wrap gap-[1rem]">
            {[
              { label: "4px", c: "w-[0.25rem]" },
              { label: "8px", c: "w-[0.5rem]" },
              { label: "12px", c: "w-[0.75rem]" },
              { label: "16px", c: "w-[1rem]" },
              { label: "24px", c: "w-[1.5rem]" },
              { label: "32px", c: "w-[2rem]" },
              { label: "48px", c: "w-[3rem]" },
              { label: "80px", c: "w-[5rem]" },
            ].map(({ label, c }) => (
              <div key={label} className="flex flex-col items-center gap-[0.25rem]">
                <div className={`h-[0.375rem] bg-[#195c52] ${c}`} />
                <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: "0.875rem", color: "#5a5a55" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="proyectos-title" className="mb-[4rem]">
          <h2 id="proyectos-title" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, marginBottom: "1rem" }}>
            Proyectos (lista editorial)
          </h2>
          <p className="mb-[2rem] text-[#5a5a55]" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
            Presentados como listas editoriales (título, una línea de descripción, stack en mono, año) en lugar de cuadrículas de tarjetas.
          </p>
          <ul className="space-y-[1rem] border-y border-[#d8d6d0] pt-[1rem] pb-[1rem]">
            {proyectos.map((p) => (
              <li key={p.nombre} className="py-[1rem] border-b border-[#d8d6d0] last:border-b-0">
                <div className="flex flex-wrap items-baseline gap-[1rem]">
                  <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1a1a18" }}>{p.nombre}</span>
                  <span style={{ fontSize: "0.875rem", color: "#5a5a55" }}>{p.anio}</span>
                </div>
                <p className="mt-[0.5rem] text-[#1a1a18]" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "64ch" }}>
                  {p.descripcion}
                </p>
                <div style={{ fontFamily: 'var(--font-plex-mono), monospace', marginTop: "0.75rem" }}>
                  {p.stack.map((s) => (
                    <span key={s} className="inline-block mr-[0.75rem] mb-[0.5rem] px-[0.5rem] py-[0.2rem] border border-[#d8d6d0] text-[#5a5a55]" style={{ fontSize: "0.875rem", borderRadius: "0.125rem" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-[#d8d6d0] pt-[1.5rem]">
          <p style={{ fontSize: "0.875rem", color: "#5a5a55", margin: 0 }}>
            Página de muestra estática. Ningún elemento se incluye sin pasar la prueba del propósito.
          </p>
        </footer>
      </div>
    </main>
  );
}

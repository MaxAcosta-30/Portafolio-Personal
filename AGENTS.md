<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas de ejecución (Promts_extra.md — Prompt 0B)

1. Haz SOLO lo que pide esta fase. No adelantes fases futuras.
2. Si te falta información, pregúntame. No la inventes.
3. No inventes datos personales, métricas, clientes, ubicación ni textos legales.
4. Antes de afirmar que algo funciona, ejecútalo. Si no pudiste probarlo, escribe "NO VERIFICADO".
5. Al terminar, detente y entrega: qué hiciste, archivos modificados, qué verificaste, qué falta, qué debo revisar yo.
6. Nunca escribas secretos reales en el repositorio.

# Prohibiciones de diseño genérico (Promts.md)

El sitio no debe tener apariencia genérica producida por IA. Evita específicamente:

- landing SaaS genérica;
- gradientes morado/azul usados porque sí;
- tarjetas dentro de tarjetas;
- cuadrículas infinitas de cards idénticas;
- abuso de border-radius;
- iconos dentro de cuadrados redondeados repetidos;
- blobs decorativos;
- glassmorphism indiscriminado;
- textos enormes sin intención;
- animaciones gratuitas;
- estética de dashboard para secciones que no son dashboards;
- terminal falsa como recurso visual principal;
- efectos que reduzcan legibilidad;
- sacrificar UX por demostrar animaciones.

# Regla de no inventar información (Promts.md)

- No inventes información sobre Max.
- No inventes métricas de proyectos.
- No inventes clientes.
- No inventes experiencia laboral.
- No afirmes que una tecnología se utilizó en un proyecto si las referencias no lo sustentan.

# Habilidades detectadas (Prompt 0B)

| Skill | Detectada | Cómo se usará | Evidencia |
|-------|-----------|---------------|-----------|
| Impeccable | Sí | Critique, audit, polish, distill, document, animate, typeset, layout del proyecto | `SKILL.md` en `/home/maxa/.agents/skills/impeccable/SKILL.md` |
| Make interfaces feel better | Sí | Revisión de detalle de interfaz (tipografía, superficies, animaciones, iconos, performance) | `SKILL.md` en `/home/maxa/.agents/skills/make-interfaces-feel-better/SKILL.md` |
| Transitions.dev | Sí | Transiciones CSS (`transitions-dev`) y ajuste de motion tokens (`transitions-polish`) | `SKILL.md` en `/home/maxa/.agents/skills/transitions-dev/` y `transitions-polish/`, enlazadas en `~/.claude/skills/` |
| GSAP skills | Sí | Animaciones de scroll y timelines con GSAP (ya es dependencia del proyecto) | `SKILL.md` en `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`, enlazadas en `~/.claude/skills/` |

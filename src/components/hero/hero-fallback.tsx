import { LOGO_PATHS } from "../brand/logo";

/**
 * Composición estática de la escena: alternativa sin JS, sin WebGL o con movimiento reducido,
 * y skeleton mientras carga el 3D (ocupa exactamente el mismo cuadro). Colores por tokens.
 */
export function HeroFallback() {
  const plate = (cy: number, label: string, top = false) => {
    const w = 170, h = 98;
    return <g key={label}>
      <path className="fb-plate" data-top={top || undefined} d={`M250 ${cy - h} L${250 + w} ${cy} L250 ${cy + h} L${250 - w} ${cy} Z`} />
      <text x={250 - w + 36} y={cy + 6} className="fallback-label">{label}</text>
    </g>;
  };
  return <svg className="hero-fallback" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    {plate(370, "taskflow")}
    {plate(325, "hangar")}
    {plate(280, "hito", true)}
    <ellipse className="fb-orbit" cx="250" cy="185" rx="175" ry="58" />
    <g transform="translate(180 105) scale(1.4)" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path className="fb-hidden" d={LOGO_PATHS.hidden} />
      <path className="fb-m" d={LOGO_PATHS.m} />
      <path className="fb-a" d={LOGO_PATHS.a} />
    </g>
  </svg>;
}

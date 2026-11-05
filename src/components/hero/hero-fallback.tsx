import { LOGO_PATHS } from "../brand/logo";

/** Composición estática de la escena (sin JS, movimiento reducido o sin WebGL). */
export function HeroFallback() {
  const plate = (cy: number, stroke: string, label: string) => {
    const w = 170, h = 98;
    return <g key={label}>
      <path d={`M250 ${cy - h} L${250 + w} ${cy} L250 ${cy + h} L${250 - w} ${cy} Z`} fill="#161A23" fillOpacity="0.72" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <text x={250 - w + 36} y={cy + 6} className="fallback-label">{label}</text>
    </g>;
  };
  return <svg className="hero-fallback" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    {plate(370, "#3b3f6e", "repo")}
    {plate(325, "#5d63b0", "build")}
    {plate(280, "#8B92FF", "live")}
    <ellipse cx="250" cy="185" rx="175" ry="58" fill="none" stroke="#F0B67F" strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round" opacity="0.8" />
    <g transform="translate(180 105) scale(1.4)" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d={LOGO_PATHS.hidden} stroke="#3A4052" />
      <path d={LOGO_PATHS.m} stroke="#8B92FF" />
      <path d={LOGO_PATHS.a} stroke="#F0B67F" />
    </g>
  </svg>;
}

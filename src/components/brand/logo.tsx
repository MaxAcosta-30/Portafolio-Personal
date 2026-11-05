import "./logo.css";

export type LogoVariant = "static" | "draw" | "assemble" | "deploy" | "spin";

/** Trazados del cubo isométrico (viewBox 0 0 100 100). La A es la protagonista. */
export const LOGO_PATHS = {
  m: "M15.4 72 V30 L50 50 L84.6 30 V72",
  a: "M15.4 30 L50 10 L84.6 30",
  hidden: "M50 50 V92 M15.4 72 L50 92 L84.6 72",
} as const;

type Props = {
  variant?: LogoVariant;
  size?: number | string;
  wordmark?: boolean;
  /** Texto del estado de carga en la variante "deploy". */
  label?: string;
  className?: string;
};

/**
 * Logo de Max Acosta. Sin JS o con movimiento reducido, todas las variantes
 * se muestran como el logo estático (el CSS solo anima con motion permitido).
 */
export function Logo({ variant = "static", size = 32, wordmark = false, label = "desplegando…", className = "" }: Props) {
  const mark = <svg className="logo-mark" viewBox="0 0 100 100" width={size} height={size} fill="none" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {variant === "assemble" && <g className="logo-waves"><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="30" /></g>}
    <path className="logo-hidden" d={LOGO_PATHS.hidden} pathLength={100} />
    <path className="logo-m" d={LOGO_PATHS.m} pathLength={100} />
    <path className="logo-a" d={LOGO_PATHS.a} pathLength={100} />
  </svg>;

  return <span className={`logo ${className}`} data-variant={variant}>
    {variant === "spin" ? <span className="logo-spin-stage">{mark}</span> : mark}
    {wordmark && <span className="logo-word">max acosta</span>}
    {variant === "deploy" && <span className="logo-label">{label}</span>}
  </span>;
}

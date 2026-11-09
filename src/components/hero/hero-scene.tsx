"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, OrthographicCamera, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { Vector3, type Group, type Mesh } from "three";

/** Ancla de la etiqueta de cada placa, en coordenadas locales de la placa. */
const LABEL_ANCHOR = new Vector3(2.6, 0.05, -1.5);
type Refs<T> = RefObject<(T | null)[]>;

/** Colores de la escena: los mismos tokens CSS del tema activo (cambian con data-theme). */
type Palette = { surface: string; line: string; lineStrong: string; text: string; muted: string; accent: string };
const TOKENS = { surface: "--surface", line: "--line", lineStrong: "--line-strong", text: "--text", muted: "--muted", accent: "--accent-fill" } as const;
const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const themeSnapshot = () => document.documentElement.dataset.theme ?? "dark";
function usePalette(): Palette {
  const theme = useSyncExternalStore(subscribeTheme, themeSnapshot, () => "dark");
  return useMemo(() => {
    void theme; // recalcula al cambiar de tema
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(Object.entries(TOKENS).map(([key, name]) => [key, styles.getPropertyValue(name).trim()])) as Palette;
  }, [theme]);
}

type V = [number, number, number];
/** Vértices del cubo vistos en isometría: coinciden con los trazados 2D del logo. */
const C = {
  frontTop: [1, 1, 1], leftTop: [-1, 1, 1], backTop: [-1, 1, -1], rightTop: [1, 1, -1],
  frontBottom: [1, -1, 1], leftBottom: [-1, -1, 1], backBottom: [-1, -1, -1], rightBottom: [1, -1, -1],
} satisfies Record<string, V>;
const M_EDGES: V[][] = [[C.leftBottom, C.leftTop, C.frontTop, C.rightTop, C.rightBottom]];
const A_EDGES: V[][] = [[C.leftTop, C.backTop, C.rightTop]];
const HIDDEN_EDGES: V[][] = [[C.frontTop, C.frontBottom], [C.leftBottom, C.frontBottom, C.rightBottom]];
const FAINT_EDGES: V[][] = [[C.backTop, C.backBottom], [C.leftBottom, C.backBottom, C.rightBottom]];

/** Contorno redondeado de la cara superior de una placa. */
function roundedOutline(size: number, radius: number, y: number): V[] {
  const half = size / 2, inner = half - radius, points: V[] = [];
  const corners: [number, number, number][] = [[inner, inner, 0], [-inner, inner, Math.PI / 2], [-inner, -inner, Math.PI], [inner, -inner, Math.PI * 1.5]];
  for (const [cx, cz, start] of corners) for (let i = 0; i <= 6; i++) {
    const angle = start + (i / 6) * (Math.PI / 2);
    points.push([cx + Math.cos(angle) * radius, y, cz + Math.sin(angle) * radius]);
  }
  points.push(points[0]);
  return points;
}

const PLATES = [
  { label: "repo", y: -2.35, spread: 1.1, opacity: 0.7 },
  { label: "build", y: -1.75, spread: 0.55, opacity: 0.78 },
  { label: "live", y: -1.15, spread: 0, opacity: 0.86 },
] as const;

/** Placas monocromas; solo la superior lleva el borde de acento. */
function Plate({ plate, index, progress, palette }: { plate: (typeof PLATES)[number]; index: number; progress: { current: number }; palette: Palette }) {
  const group = useRef<Group>(null);
  const outline = useMemo(() => roundedOutline(4.2, 0.35, 0.07), []);
  const top = index === PLATES.length - 1;
  useFrame(() => { if (group.current) group.current.position.y = plate.y - plate.spread * progress.current; });
  return <group ref={group} name={`plate-${index}`} position={[0, plate.y, 0]}>
    <RoundedBox args={[4.2, 0.14, 4.2]} radius={0.06} smoothness={3}>
      <meshBasicMaterial color={palette.surface} transparent opacity={plate.opacity} />
    </RoundedBox>
    <Line points={outline} color={top ? palette.accent : palette.lineStrong} lineWidth={top ? 2 : 1.4} toneMapped={false} />
  </group>;
}

/**
 * Etiquetas de las placas: spans del DOM (fuera del Canvas) que siguen el ancla 3D proyectada.
 * Se escriben por ref en cada fotograma; sin raíces de React adicionales (las de drei <Html>
 * cancelaban la View Transition al salir de la home) y sin setState.
 */
function LabelProjector({ labels }: { labels: Refs<HTMLSpanElement> }) {
  const point = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size, scene }) => {
    PLATES.forEach((_, index) => {
      const plate = scene.getObjectByName(`plate-${index}`);
      const label = labels.current[index];
      if (!plate || !label) return;
      point.copy(LABEL_ANCHOR);
      plate.localToWorld(point).project(camera);
      label.style.transform = `translate3d(${((point.x + 1) / 2) * size.width}px, ${((1 - point.y) / 2) * size.height}px, 0) translate(-50%, -50%)`;
    });
  });
  return null;
}

/** Arista: halo ancho y tenue + núcleo, idénticos para M y A. */
function GlowEdge({ points, color }: { points: V[]; color: string }) {
  return <>
    <Line points={points} color={color} lineWidth={11} transparent opacity={0.12} toneMapped={false} depthWrite={false} />
    <Line points={points} color={color} lineWidth={4.5} toneMapped={false} />
  </>;
}

/** Cubo-logo con los tokens del logo 2D: M en --text, A en --accent, aristas ocultas en --line-strong. */
function CubeLogo({ palette }: { palette: Palette }) {
  const a = useRef<Group>(null);
  useFrame(({ clock }) => { if (a.current) a.current.position.y = 0.12 + Math.sin(clock.elapsedTime * 1.6) * 0.06; });
  return <group scale={0.62} position={[0, 0.35, 0]}>
    <mesh><boxGeometry args={[2, 2, 2]} /><meshBasicMaterial color={palette.text} transparent opacity={0.04} depthWrite={false} /></mesh>
    {FAINT_EDGES.map((points, i) => <Line key={`f${i}`} points={points} color={palette.line} lineWidth={1.5} />)}
    {HIDDEN_EDGES.map((points, i) => <Line key={`h${i}`} points={points} color={palette.lineStrong} lineWidth={2.5} />)}
    {/* M y A comparten grosor, halo e intensidad: la A destaca por color y posición, no por peso. */}
    {M_EDGES.map((points, i) => <GlowEdge key={`m${i}`} points={points} color={palette.text} />)}
    <group ref={a}>{A_EDGES.map((points, i) => <GlowEdge key={`a${i}`} points={points} color={palette.accent} />)}</group>
  </group>;
}

function Orbit({ palette }: { palette: Palette }) {
  const dot = useRef<Mesh>(null);
  const points = useMemo(() => Array.from({ length: 97 }, (_, i): V => { const t = (i / 96) * Math.PI * 2; return [Math.cos(t) * 2.5, 0, Math.sin(t) * 2.5]; }), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.5;
    dot.current?.position.set(Math.cos(t) * 2.5, 0, Math.sin(t) * 2.5);
  });
  return <group position={[0, 0.35, 0]} rotation={[0.18, 0, -0.12]}>
    <Line points={points} color={palette.muted} lineWidth={1.6} dashed dashSize={0.05} gapSize={0.16} transparent opacity={0.8} />
    <mesh ref={dot}><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color={palette.text} toneMapped={false} /></mesh>
  </group>;
}

/** Cámara isométrica cuyo zoom se ajusta al tamaño del lienzo. */
function IsoCamera() {
  const size = useThree(state => state.size);
  return <OrthographicCamera makeDefault position={[10, 10, 10]} near={0.1} far={100} zoom={Math.min(size.width, size.height) / 8.2} onUpdate={camera => camera.lookAt(0, -0.6, 0)} />;
}

function Rig({ progress, labels }: { progress: { current: number }; labels: Refs<HTMLSpanElement> }) {
  const palette = usePalette();
  const group = useRef<Group>(null);
  const pointer = useThree(state => state.pointer);
  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    // Rotación lenta oscilante (mantiene la lectura isométrica del logo) + parallax al ratón.
    g.rotation.y += ((Math.sin(t * 0.22) * 0.35 + pointer.x * 0.18) - g.rotation.y) * Math.min(1, delta * 3);
    g.rotation.x += ((-pointer.y * 0.08) - g.rotation.x) * Math.min(1, delta * 3);
  });
  return <group ref={group}>
    {PLATES.map((plate, index) => <Plate key={plate.label} plate={plate} index={index} progress={progress} palette={palette} />)}
    <LabelProjector labels={labels} />
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}><CubeLogo palette={palette} /><Orbit palette={palette} /></Float>
  </group>;
}

/**
 * Escena 3D del hero. La carga HeroVisual con import dinámico y solo si hay movimiento permitido.
 * Rendimiento: ningún setState en useFrame (todo por refs); fuera de pantalla frameloop="demand"
 * (solo re-pinta si algo lo invalida); si el FPS cae, PerformanceMonitor baja el DPR a 1.
 */
export default function HeroScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const progress = useRef(0);
  const [dpr, setDpr] = useState(() => Math.min(2, window.devicePixelRatio || 1));
  useEffect(() => {
    // Al hacer scroll las placas se separan: el cubo "se despliega".
    const update = () => { progress.current = Math.min(1, scrollY / (innerHeight * 0.8)); };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  return <div className="hero-scene-layer"><Canvas
    dpr={dpr}
    frameloop={active ? "always" : "demand"}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    onCreated={() => onReady()}
    aria-hidden="true"
  >
    <PerformanceMonitor onDecline={() => setDpr(1)} />
    <IsoCamera />
    <Rig progress={progress} labels={labels} />
  </Canvas>
    <div className="plate-labels" aria-hidden="true">
      {PLATES.map((plate, index) => <span key={plate.label} ref={node => { labels.current[index] = node; }} className="plate-label" data-top={index === PLATES.length - 1 || undefined}>{plate.label}</span>)}
    </div>
  </div>;
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Line, OrthographicCamera, RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";

const IRIS = "#8B92FF";
const AMBER = "#F0B67F";
const HIDDEN = "#3A4052";
const FAINT = "#262B37";

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
  { label: "repo", y: -2.35, spread: 1.1, edge: "#3b3f6e", opacity: 0.55 },
  { label: "build", y: -1.75, spread: 0.55, edge: "#5d63b0", opacity: 0.62 },
  { label: "live", y: -1.15, spread: 0, edge: IRIS, opacity: 0.72 },
] as const;

function Plate({ plate, index, progress }: { plate: (typeof PLATES)[number]; index: number; progress: { current: number } }) {
  const group = useRef<Group>(null);
  const outline = useMemo(() => roundedOutline(4.2, 0.35, 0.07), []);
  const top = index === PLATES.length - 1;
  useFrame(() => { if (group.current) group.current.position.y = plate.y - plate.spread * progress.current; });
  return <group ref={group} position={[0, plate.y, 0]}>
    <RoundedBox args={[4.2, 0.14, 4.2]} radius={0.06} smoothness={3}>
      <meshStandardMaterial color="#161A23" transparent opacity={plate.opacity} emissive={IRIS} emissiveIntensity={top ? 0.18 : 0.02} />
    </RoundedBox>
    <Line points={outline} color={plate.edge} lineWidth={top ? 2.2 : 1.4} toneMapped={false} />
    <Html position={[2.6, 0.05, -1.5]} center zIndexRange={[1, 0]} className="plate-label" data-top={top || undefined}>{plate.label}</Html>
  </group>;
}

function CubeLogo() {
  const a = useRef<Group>(null);
  useFrame(({ clock }) => { if (a.current) a.current.position.y = 0.12 + Math.sin(clock.elapsedTime * 1.6) * 0.06; });
  return <group scale={0.62} position={[0, 0.35, 0]}>
    <mesh><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color={IRIS} transparent opacity={0.06} depthWrite={false} /></mesh>
    {FAINT_EDGES.map((points, i) => <Line key={`f${i}`} points={points} color={FAINT} lineWidth={1.5} />)}
    {HIDDEN_EDGES.map((points, i) => <Line key={`h${i}`} points={points} color={HIDDEN} lineWidth={2.5} />)}
    {M_EDGES.map((points, i) => <Line key={`m${i}`} points={points} color={IRIS} lineWidth={5} toneMapped={false} />)}
    <group ref={a}>{A_EDGES.map((points, i) => <Line key={`a${i}`} points={points} color={AMBER} lineWidth={5} toneMapped={false} />)}</group>
  </group>;
}

function Orbit() {
  const dot = useRef<Mesh>(null);
  const points = useMemo(() => Array.from({ length: 97 }, (_, i): V => { const t = (i / 96) * Math.PI * 2; return [Math.cos(t) * 2.5, 0, Math.sin(t) * 2.5]; }), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.5;
    dot.current?.position.set(Math.cos(t) * 2.5, 0, Math.sin(t) * 2.5);
  });
  return <group position={[0, 0.35, 0]} rotation={[0.18, 0, -0.12]}>
    <Line points={points} color={AMBER} lineWidth={1.6} dashed dashSize={0.05} gapSize={0.16} transparent opacity={0.8} />
    <mesh ref={dot}><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color={AMBER} toneMapped={false} /></mesh>
  </group>;
}

/** Cámara isométrica cuyo zoom se ajusta al tamaño del lienzo. */
function IsoCamera() {
  const size = useThree(state => state.size);
  return <OrthographicCamera makeDefault position={[10, 10, 10]} near={0.1} far={100} zoom={Math.min(size.width, size.height) / 8.2} onUpdate={camera => camera.lookAt(0, -0.6, 0)} />;
}

function Rig({ progress }: { progress: { current: number } }) {
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
    {PLATES.map((plate, index) => <Plate key={plate.label} plate={plate} index={index} progress={progress} />)}
    <pointLight position={[0, -0.6, 0]} color={IRIS} intensity={6} distance={5} />
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}><CubeLogo /><Orbit /></Float>
  </group>;
}

/** Escena 3D del hero. La carga HeroVisual con import dinámico y solo si hay movimiento permitido. */
export default function HeroScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const progress = useRef(0);
  useEffect(() => {
    // Al hacer scroll las placas se separan: el cubo "se despliega".
    const update = () => { progress.current = Math.min(1, scrollY / (innerHeight * 0.8)); };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return <Canvas
    dpr={[1, 2]}
    frameloop={active ? "always" : "never"}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    onCreated={() => onReady()}
    aria-hidden="true"
  >
    <IsoCamera />
    <ambientLight intensity={0.7} />
    <directionalLight position={[4, 8, 6]} intensity={1.1} />
    <Rig progress={progress} />
  </Canvas>;
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls, Environment, Float, Grid, Html, Lightformer,
  PointMaterial, Points, QuadraticBezierLine, Sparkles
} from "@react-three/drei";
import { Component, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { CategoryKey, CategoryResult } from "@/types/audit";

const POSITIONS: Record<CategoryKey, [number, number, number]> = {
  technical: [-4.7, 2.45, 0.2], content: [4.15, 2.75, -0.7], metadata: [-5.0, -0.8, -1.55],
  links: [4.8, -0.6, -1.15], performance: [-3.35, -3.25, 0.7], indexability: [3.15, -3.15, 0.2],
  accessibility: [-1.3, 4.15, -1.35], mobile: [1.45, 4.05, 0.1], structuredData: [-0.55, -4.45, -1.0], security: [5.15, 1.15, 1.0]
};

const ORBITAL_DUST_POSITIONS = (() => {
  const data = new Float32Array(260 * 3);
  for (let i = 0; i < 260; i += 1) {
    const radius = 2.8 + ((i * 37) % 101) / 100 * 6.2;
    const angle = i * 2.399963229728653;
    data[i * 3] = Math.cos(angle) * radius;
    data[i * 3 + 1] = (((i * 67) % 211) / 210 - 0.5) * 8.5;
    data[i * 3 + 2] = Math.sin(angle) * radius * 0.42 - 1;
  }
  return data;
})();
const ORBITAL_DUST_LOW = ORBITAL_DUST_POSITIONS.slice(0, 120 * 3);

function stateColor(category: CategoryResult) {
  return category.status === "critical" ? "#E11D48" : category.status === "warning" ? "#D7A84A" : category.score >= 92 ? "#B98CFF" : "#8B5CF6";
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}

function isConstrainedDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
}

function NeuralFallback({ categories, score, selected, onSelect }: { categories: CategoryResult[]; score: number; selected: CategoryKey | null; onSelect: (key: CategoryKey) => void }) {
  return <div className="neural-fallback" role="img" aria-label={`Accessible SEO signal map. Overall score ${score} out of 100.`}>
    <div className="fallback-core"><span>{score}</span><small>SEO CORE</small></div>
    <div className="fallback-nodes">{categories.map(category => <button key={category.key} className={`${category.status} ${selected === category.key ? "active" : ""}`} onClick={() => onSelect(category.key)} aria-pressed={selected === category.key}>
      <i style={{ background: stateColor(category), boxShadow: `0 0 14px ${stateColor(category)}` }} /><span>{category.label}</span><b>{category.score}</b>
    </button>)}</div>
    <p>3D rendering is unavailable in this browser. The complete audit remains accessible.</p>
  </div>;
}

class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.warn("[SYNAPSE_3D_FALLBACK] WebGL scene unavailable; accessible signal map activated."); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function connectionMid(end: [number, number, number], index: number): [number, number, number] {
  const bend = index % 2 === 0 ? 0.72 : -0.72;
  return [end[0] * 0.48, end[1] * 0.48 + bend, end[2] * 0.45 + 0.65];
}

function OrbitalDust({ reduced, economy }: { reduced: boolean; economy: boolean }) {
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.z -= delta * 0.006;
  });
  return <Points ref={ref} positions={economy ? ORBITAL_DUST_LOW : ORBITAL_DUST_POSITIONS} stride={3} frustumCulled>
    <PointMaterial transparent color="#B98CFF" size={0.032} sizeAttenuation depthWrite={false} opacity={0.52} />
  </Points>;
}

function EnergyStream({ end, mid, color, speed, delay = 0 }: { end: [number, number, number]; mid: [number, number, number]; color: string; speed: number; delay?: number }) {
  const head = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...mid), new THREE.Vector3(...end)), [end, mid]);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * speed + delay;
    const t = time - Math.floor(time);
    const tailT = Math.max(0, t - 0.035);
    head.current?.position.copy(curve.getPoint(t));
    tail.current?.position.copy(curve.getPoint(tailT));
  });
  return <group>
    <mesh ref={tail}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color={color} transparent opacity={0.34} toneMapped={false} /></mesh>
    <mesh ref={head}><sphereGeometry args={[0.072, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
  </group>;
}

function RotatingRing({ radius, tube, color, rotation, speed, opacity, reduced }: { radius: number; tube: number; color: string; rotation: [number, number, number]; speed: number; opacity: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.z += delta * speed;
    ref.current.rotation.y += delta * speed * 0.32;
  });
  return <mesh ref={ref} rotation={rotation}>
    <torusGeometry args={[radius, tube, 10, 160]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.25} metalness={0.72} roughness={0.2} transparent opacity={opacity} />
  </mesh>;
}

function SeoCore({ score, reduced }: { score: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const glow = score < 55 ? "#E11D48" : score < 80 ? "#D7A84A" : "#8B5CF6";
  useFrame(({ clock }, delta) => {
    if (group.current && !reduced) {
      group.current.rotation.y += delta * 0.075;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.07;
    }
    if (inner.current && !reduced) {
      inner.current.rotation.x -= delta * 0.16;
      inner.current.rotation.z += delta * 0.11;
    }
  });
  return <group ref={group} scale={hovered ? 1.055 : 1}>
    <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <sphereGeometry args={[1.53, 48, 48]} />
      <meshPhysicalMaterial color="#0c0914" emissive={glow} emissiveIntensity={0.42} metalness={0.18} roughness={0.08} transmission={0.78} thickness={2.6} ior={1.32} transparent opacity={0.68} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
    <mesh scale={1.18}><icosahedronGeometry args={[1.23, 3]} /><meshBasicMaterial color={glow} wireframe transparent opacity={0.18} /></mesh>
    <mesh ref={inner} scale={0.92}><torusKnotGeometry args={[0.63, 0.17, 128, 18, 2, 3]} /><meshStandardMaterial color="#B98CFF" emissive={glow} emissiveIntensity={2.9} metalness={0.85} roughness={0.16} /></mesh>
    <mesh scale={0.52}><icosahedronGeometry args={[1, 3]} /><meshStandardMaterial color="#e7d9ff" emissive={glow} emissiveIntensity={4.1} metalness={0.65} roughness={0.12} /></mesh>
    <RotatingRing radius={1.82} tube={0.025} color={glow} rotation={[0.35, 0.2, 0.1]} speed={0.17} opacity={0.8} reduced={reduced} />
    <RotatingRing radius={2.16} tube={0.016} color="#D8D8E0" rotation={[1.04, 0.25, 0.55]} speed={-0.12} opacity={0.52} reduced={reduced} />
    <RotatingRing radius={2.48} tube={0.012} color="#8B5CF6" rotation={[0.58, 1.15, 0.15]} speed={0.08} opacity={0.4} reduced={reduced} />
    <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[2.7, 2.72, 128]} /><meshBasicMaterial color={glow} transparent opacity={0.14} side={THREE.DoubleSide} /></mesh>
    <pointLight color={glow} intensity={hovered ? 28 : 21} distance={12} decay={2} />
    <Html center distanceFactor={7.8} position={[0, -0.03, 1.58]} className="core-label"><span>{score}</span><small>SEO CORE</small><i>LIVE SIGNAL</i></Html>
  </group>;
}

function CategoryNode({ category, selected, onSelect, reduced, index }: { category: CategoryResult; selected: boolean; onSelect: () => void; reduced: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const color = stateColor(category);
  const scale = 0.58 + category.score / 240;
  useFrame(({ clock }, delta) => {
    if (group.current && !reduced) {
      group.current.position.y = POSITIONS[category.key][1] + Math.sin(clock.elapsedTime * 0.72 + index * 0.85) * 0.11;
      group.current.rotation.y += delta * (0.08 + index * 0.006);
    }
    if (shell.current && !reduced) shell.current.rotation.z -= delta * 0.08;
  });
  return <group ref={group} position={POSITIONS[category.key]}>
    <Float speed={reduced ? 0 : 1.15} rotationIntensity={reduced ? 0 : 0.2} floatIntensity={reduced ? 0 : 0.16}>
      <group scale={selected ? scale * 1.17 : hovered ? scale * 1.09 : scale}>
        <mesh onPointerOver={event => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }} onClick={event => { event.stopPropagation(); onSelect(); }}>
          <icosahedronGeometry args={[0.77, 3]} />
          <meshPhysicalMaterial color="#15111f" emissive={color} emissiveIntensity={selected || hovered ? 2.2 : 0.82} metalness={0.78} roughness={0.2} transmission={0.24} thickness={1.1} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        <mesh scale={0.58}><icosahedronGeometry args={[0.77, 2]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected || hovered ? 4.4 : 2.2} metalness={0.7} roughness={0.12} /></mesh>
        <mesh ref={shell} scale={1.16}><icosahedronGeometry args={[0.78, 2]} /><meshBasicMaterial color={color} wireframe transparent opacity={selected ? 0.48 : hovered ? 0.34 : 0.18} /></mesh>
        <mesh rotation={[Math.PI / 2, index * 0.3, 0]}><torusGeometry args={[1.02, 0.015, 8, 80]} /><meshBasicMaterial color={color} transparent opacity={selected ? 0.75 : 0.28} /></mesh>
        <mesh position={[0.92, 0.15, 0]}><sphereGeometry args={[0.065, 10, 10]} /><meshBasicMaterial color="#F4F4F8" toneMapped={false} /></mesh>
        <pointLight color={color} intensity={selected || hovered ? 5 : 1.5} distance={3.5} decay={2} />
      </group>
    </Float>
    <Html center distanceFactor={9.5} position={[0, -1.18, 0]} className={`node-label ${selected ? "is-selected" : ""}`}><i /><span>{category.label}</span><strong>{category.score}</strong></Html>
    {hovered && <Html center distanceFactor={8.7} position={[0, 1.62, 0]} className="node-tooltip"><small>{category.label}</small><b>{category.score} / 100</b><span>{category.status} · {category.issueCount} issues · {category.opportunityCount} opportunities</span><em>CLICK TO FOCUS</em></Html>}
  </group>;
}

function Scene({ categories, score, selected, onSelect, resetSignal }: { categories: CategoryResult[]; score: number; selected: CategoryKey | null; onSelect: (key: CategoryKey) => void; resetSignal: number }) {
  const controls = useRef<React.ElementRef<typeof CameraControls>>(null);
  const system = useRef<THREE.Group>(null);
  const [reduced, setReduced] = useState(false);
  const [economy] = useState(() => isConstrainedDevice());
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update); return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const node = selected ? POSITIONS[selected] : null;
    if (node) controls.current?.setLookAt(node[0] * 1.38, node[1] * 1.25, node[2] + 6.2, node[0], node[1], node[2], true);
  }, [selected]);
  useEffect(() => { controls.current?.setLookAt(0, 0.25, 11.8, 0, 0, 0, true); }, [resetSignal]);
  useFrame(({ pointer }) => {
    if (!system.current || reduced) return;
    system.current.rotation.y = THREE.MathUtils.lerp(system.current.rotation.y, pointer.x * 0.045, 0.025);
    system.current.rotation.x = THREE.MathUtils.lerp(system.current.rotation.x, -pointer.y * 0.025, 0.025);
  });
  const lines = useMemo(() => categories.map((category, index) => ({ category, end: POSITIONS[category.key], mid: connectionMid(POSITIONS[category.key], index), color: stateColor(category), index })), [categories]);
  return <>
    <ambientLight intensity={0.28} />
    <directionalLight position={[6, 8, 8]} color="#e9dcff" intensity={1.55} />
    <directionalLight position={[-6, -2, 4]} color="#8B5CF6" intensity={0.9} />
    <Environment resolution={64}>
      <Lightformer form="ring" intensity={2.1} color="#8B5CF6" scale={5} position={[0, 4, -6]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.4} color="#D8D8E0" scale={[3, 3, 3]} position={[5, 1, 4]} target={[0, 0, 0]} />
    </Environment>
    <group ref={system}>
      <SeoCore score={score} reduced={reduced} />
      {lines.map(({ category, end, mid, color, index }) => <group key={category.key}>
        <QuadraticBezierLine start={[0, 0, 0]} end={end} mid={mid} color={color} transparent opacity={selected === category.key ? 0.85 : 0.2 + category.score / 340} lineWidth={selected === category.key ? 2.25 : 0.72} />
        {!reduced && category.score > 35 && <><EnergyStream end={end} mid={mid} color={color} speed={0.1 + category.score / 440} delay={index * 0.12} />{selected === category.key && <EnergyStream end={end} mid={mid} color="#F4F4F8" speed={0.18 + category.score / 420} delay={0.55} />}</>}
        <CategoryNode category={category} selected={selected === category.key} onSelect={() => onSelect(category.key)} reduced={reduced} index={index} />
      </group>)}
      <OrbitalDust reduced={reduced} economy={economy} />
    </group>
    <Sparkles count={reduced ? 42 : economy ? 72 : 150} scale={[15, 11, 9]} size={1.35} speed={reduced ? 0 : economy ? 0.1 : 0.18} color="#B98CFF" opacity={0.38} />
    <Grid position={[0, -5.35, 0]} args={[28, 28]} cellColor="#21192f" sectionColor="#8B5CF6" cellSize={0.55} sectionSize={2.75} fadeDistance={19} fadeStrength={1.45} infiniteGrid />
    <CameraControls ref={controls} minDistance={4.8} maxDistance={19} smoothTime={0.72} dollySpeed={0.58} truckSpeed={0.42} />
  </>;
}

export default function NeuralWeb({ categories, score, selected, onSelect, resetSignal = 0 }: { categories: CategoryResult[]; score: number; selected: CategoryKey | null; onSelect: (key: CategoryKey) => void; resetSignal?: number }) {
  const [webgl, setWebgl] = useState(() => typeof document !== "undefined" && canUseWebGL());
  const [economy] = useState(() => typeof window !== "undefined" && isConstrainedDevice());
  const fallback = <NeuralFallback categories={categories} score={score} selected={selected} onSelect={onSelect} />;
  if (!webgl) return <div className="neural-canvas">{fallback}</div>;
  return <div className="neural-canvas" role="img" aria-label={`Interactive SEO neural web. Overall score ${score} out of 100. Use the category list for an accessible text alternative.`}>
    <CanvasBoundary fallback={fallback}><Canvas dpr={economy ? [0.8, 1] : [1, 1.5]} camera={{ position: [0, 0.25, 11.8], fov: 44 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.12 }} onCreated={({ gl }) => {
      gl.domElement.addEventListener("webglcontextlost", event => { event.preventDefault(); setWebgl(false); }, { once: true });
    }}>
      <fog attach="fog" args={["#050507", 12, 25]} />
      <Scene categories={categories} score={score} selected={selected} onSelect={onSelect} resetSignal={resetSignal} />
    </Canvas></CanvasBoundary>
  </div>;
}

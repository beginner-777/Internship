"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Grid, Html, Line, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { CategoryKey, CategoryResult } from "@/types/audit";

const POSITIONS: Record<CategoryKey, [number, number, number]> = {
  technical: [-4.5, 2.4, 0.4], content: [4.1, 2.8, -0.6], metadata: [-5.1, -0.6, -1.8],
  links: [4.8, -0.5, -1.1], performance: [-3.2, -3.2, 0.8], indexability: [3.1, -3.1, 0.3],
  accessibility: [-1.2, 4.2, -1.6], mobile: [1.5, 4.1, 0.2], structuredData: [-0.5, -4.5, -1.2], security: [5.1, 1.3, 1.1]
};

function stateColor(category: CategoryResult) {
  return category.status === "critical" ? "#E11D48" : category.status === "warning" ? "#D7A84A" : category.score >= 92 ? "#D8D8E0" : "#8B5CF6";
}

function EnergyStream({ end, color, speed }: { end: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed) % 1;
    ref.current.position.set(end[0] * t, end[1] * t, end[2] * t);
  });
  return <mesh ref={ref}><sphereGeometry args={[0.055, 8, 8]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>;
}

function SeoCore({ score, reduced }: { score: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (group.current && !reduced) group.current.rotation.y += delta * 0.09; });
  const glow = score < 55 ? "#E11D48" : score < 80 ? "#D7A84A" : "#8B5CF6";
  return (
    <group ref={group}>
      <mesh><icosahedronGeometry args={[1.25, 4]} /><meshPhysicalMaterial color="#171225" emissive={glow} emissiveIntensity={1.8} roughness={0.18} metalness={0.45} transmission={0.3} thickness={1.4} transparent opacity={0.84} /></mesh>
      <mesh scale={0.68}><octahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#B98CFF" emissive={glow} emissiveIntensity={3.5} metalness={0.8} roughness={0.12} /></mesh>
      {[1.8, 2.15, 2.48].map((radius, index) => <mesh key={radius} rotation={[index * 0.65, index * 0.82, index * 0.3]}><torusGeometry args={[radius, 0.018 + index * 0.009, 8, 120]} /><meshBasicMaterial color={index === 1 ? "#D8D8E0" : glow} transparent opacity={0.62 - index * 0.12} /></mesh>)}
      <pointLight color={glow} intensity={18} distance={11} decay={2} />
      <Html center distanceFactor={8} position={[0, -0.02, 1.5]} className="core-label"><span>{score}</span><small>SEO CORE</small></Html>
    </group>
  );
}

function CategoryNode({ category, selected, onSelect, reduced }: { category: CategoryResult; selected: boolean; onSelect: () => void; reduced: boolean }) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const color = stateColor(category);
  const scale = 0.54 + category.score / 220;
  useFrame(({ clock }) => {
    if (group.current && !reduced) group.current.position.y = POSITIONS[category.key][1] + Math.sin(clock.elapsedTime * 0.8 + category.score) * 0.08;
  });
  return (
    <group ref={group} position={POSITIONS[category.key]}>
      <mesh scale={selected ? scale * 1.18 : scale} onPointerOver={event => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }} onClick={event => { event.stopPropagation(); onSelect(); }}>
        <dodecahedronGeometry args={[0.72, 1]} />
        <meshPhysicalMaterial color="#100e18" emissive={color} emissiveIntensity={selected || hovered ? 3.4 : 1.7} metalness={0.7} roughness={0.18} transmission={0.2} transparent opacity={0.92} />
      </mesh>
      <mesh scale={scale * 1.2}><sphereGeometry args={[0.76, 20, 20]} /><meshBasicMaterial color={color} wireframe transparent opacity={selected ? 0.26 : 0.1} /></mesh>
      <Html center distanceFactor={10} position={[0, -1.05, 0]} className={`node-label ${selected ? "is-selected" : ""}`}><span>{category.label}</span><strong>{category.score}</strong></Html>
      {hovered && <Html center distanceFactor={9} position={[0, 1.55, 0]} className="node-tooltip"><small>{category.label}</small><b>{category.score} / 100</b><span>{category.status} · {category.issueCount} issues · {category.opportunityCount} opportunities</span></Html>}
    </group>
  );
}

function Scene({ categories, score, selected, onSelect, resetSignal }: { categories: CategoryResult[]; score: number; selected: CategoryKey | null; onSelect: (key: CategoryKey) => void; resetSignal: number }) {
  const controls = useRef<React.ElementRef<typeof CameraControls>>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update); return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const node = selected ? POSITIONS[selected] : null;
    if (node) controls.current?.setLookAt(node[0] * 1.55, node[1] * 1.35, node[2] + 6.5, node[0], node[1], node[2], true);
  }, [selected]);
  useEffect(() => { controls.current?.setLookAt(0, 0.4, 12.5, 0, 0, 0, true); }, [resetSignal]);
  const lines = useMemo(() => categories.map(category => ({ category, end: POSITIONS[category.key], color: stateColor(category) })), [categories]);
  return <>
    <ambientLight intensity={0.38} />
    <directionalLight position={[5, 7, 8]} color="#D8D8E0" intensity={1.1} />
    <SeoCore score={score} reduced={reduced} />
    {lines.map(({ category, end, color }) => <group key={category.key}>
      <Line points={[[0, 0, 0], end]} color={color} transparent opacity={0.25 + category.score / 300} lineWidth={selected === category.key ? 1.8 : 0.7} />
      {!reduced && category.score > 45 && <EnergyStream end={end} color={color} speed={0.12 + category.score / 400} />}
      <CategoryNode category={category} selected={selected === category.key} onSelect={() => onSelect(category.key)} reduced={reduced} />
    </group>)}
    <Sparkles count={reduced ? 35 : 110} scale={[14, 10, 8]} size={1.3} speed={reduced ? 0 : 0.22} color="#B98CFF" opacity={0.42} />
    <Grid position={[0, -5.3, 0]} args={[24, 24]} cellColor="#2a203c" sectionColor="#8B5CF6" cellSize={0.6} sectionSize={3} fadeDistance={18} fadeStrength={1.3} infiniteGrid />
    <CameraControls ref={controls} minDistance={5} maxDistance={20} smoothTime={0.65} dollySpeed={0.6} truckSpeed={0.5} />
  </>;
}

export default function NeuralWeb({ categories, score, selected, onSelect, resetSignal = 0 }: { categories: CategoryResult[]; score: number; selected: CategoryKey | null; onSelect: (key: CategoryKey) => void; resetSignal?: number }) {
  return <div className="neural-canvas" role="img" aria-label={`Interactive SEO neural web. Overall score ${score} out of 100. Use the category list for an accessible text alternative.`}>
    <Canvas dpr={[1, 1.65]} camera={{ position: [0, 0.4, 12.5], fov: 46 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <fog attach="fog" args={["#050507", 13, 24]} />
      <Scene categories={categories} score={score} selected={selected} onSelect={onSelect} resetSignal={resetSignal} />
    </Canvas>
  </div>;
}

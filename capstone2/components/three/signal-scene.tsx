"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, QuadraticBezierLine } from "@react-three/drei";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";

type SceneKind = "hero" | "analysis" | "header" | "map";

function useMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(prefersReducedMotion(media));
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

const nodePositions: Array<[number, number, number]> = [
  [-2.05, .75, .18], [1.95, 1.02, -.12], [-1.65, -1.25, .35],
  [1.7, -1.15, .18], [0, 1.75, -.35], [0, -1.82, -.18],
];

const signalPaths = [
  { start: nodePositions[0], mid: [-.65, 1.7, .7] as [number, number, number], end: nodePositions[1] },
  { start: nodePositions[2], mid: [0, -.15, 1.2] as [number, number, number], end: nodePositions[1] },
  { start: nodePositions[4], mid: [1.35, .1, .65] as [number, number, number], end: nodePositions[3] },
  { start: nodePositions[5], mid: [-1.25, -.25, .75] as [number, number, number], end: nodePositions[0] },
];

function SignalPulse({ path, offset, reduced }: { path: typeof signalPaths[number]; offset: number; reduced: boolean }) {
  const pulse = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...path.start),
    new THREE.Vector3(...path.mid),
    new THREE.Vector3(...path.end),
  ), [path]);
  useFrame(({ clock }) => {
    if (!pulse.current || reduced) return;
    pulse.current.position.copy(curve.getPoint((clock.getElapsedTime() * .12 + offset) % 1));
  });
  return <mesh ref={pulse} position={path.start}><sphereGeometry args={[.055, 12, 12]} /><meshBasicMaterial color="#f6dc91" toneMapped={false} /></mesh>;
}

function SignalCore({ kind, severity = 2, reduced }: { kind: SceneKind; severity?: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const points = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < 220; i += 1) {
      const t = (i / 220) * Math.PI * 2;
      const radius = 2.35 + Math.sin(t * 6) * .06;
      result.push(Math.cos(t) * radius, Math.sin(t * 3) * .22, Math.sin(t) * radius);
    }
    return new Float32Array(result);
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reduced) return;
    const time = clock.getElapsedTime();
    group.current.rotation.y = time * .045 + pointer.x * .09;
    group.current.rotation.x = .08 + Math.sin(time * .12) * .035 + pointer.y * .055;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(time * (1 + severity * .12)) * .035);
  });

  const scale = kind === "header" ? 1.22 : kind === "map" ? .95 : 1.32;
  return (
    <group ref={group} scale={scale} rotation={[.08, .15, -.06]}>
      <Float speed={reduced ? 0 : .75} rotationIntensity={reduced ? 0 : .07} floatIntensity={reduced ? 0 : .16}>
        <mesh ref={core}>
          <icosahedronGeometry args={[.72, 5]} />
          <MeshTransmissionMaterial
            color={severity >= 3 ? "#d6a84b" : "#e8c66f"}
            thickness={1.1}
            roughness={.12}
            transmission={.9}
            ior={1.42}
            chromaticAberration={.018}
          />
        </mesh>
        <mesh scale={[1.15, .62, 1]} rotation={[Math.PI / 2, 0, .25]}>
          <torusGeometry args={[1.52, .018, 8, 150]} />
          <meshBasicMaterial color="#f0d79a" transparent opacity={.72} />
        </mesh>
        <mesh scale={[1, .72, 1.18]} rotation={[.68, .18, -.55]}>
          <torusGeometry args={[1.72, .012, 8, 150]} />
          <meshBasicMaterial color="#b7862d" transparent opacity={.46} />
        </mesh>
      </Float>
      {signalPaths.map((path, index) => (
        <group key={index}>
          <QuadraticBezierLine start={path.start} mid={path.mid} end={path.end} color={index % 2 ? "#bd8c35" : "#e4c26f"} transparent opacity={.58} lineWidth={1.15} />
          <SignalPulse path={path} offset={index * .23} reduced={reduced} />
        </group>
      ))}
      {nodePositions.map((position, index) => (
        <group key={index} position={position}>
          <mesh><sphereGeometry args={[.13, 20, 20]} /><meshStandardMaterial color={index === 2 ? "#87966c" : "#d6a84b"} emissive={index === 2 ? "#4d5a3d" : "#8c651f"} emissiveIntensity={.7} roughness={.24} /></mesh>
          <mesh><sphereGeometry args={[.24, 16, 16]} /><meshBasicMaterial color={index === 2 ? "#9aaa83" : "#f0d79a"} transparent opacity={.08} side={THREE.BackSide} /></mesh>
        </group>
      ))}
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
        <pointsMaterial size={.027} color="#f0d79a" transparent opacity={.62} sizeAttenuation />
      </points>
    </group>
  );
}

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function SignalScene({ kind = "hero", severity = 2 }: { kind?: SceneKind; severity?: number }) {
  const reduced = useMotionPreference();
  const visible = useVisible();
  const [lowPower] = useState(() => {
    if (typeof window === "undefined") return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return window.innerWidth < 560 && (memory ?? 4) < 4;
  });
  const fallback = <div className="scene-fallback" role="img" aria-label="Abstract incident signal visualization fallback" />;
  if (lowPower) return fallback;
  return (
    <WebGLErrorBoundary fallback={fallback}>
      <Canvas
        className="scene-canvas"
        aria-hidden="true"
        dpr={[1, 1.5]}
        frameloop={!visible || reduced ? "demand" : "always"}
        camera={{ position: [0, 0, kind === "header" ? 8 : 7], fov: 48 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[3, 4, 5]} color="#f0d79a" intensity={35} />
        <pointLight position={[-4, -2, 3]} color="#9a6e25" intensity={25} />
        <SignalCore kind={kind} severity={severity} reduced={reduced} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

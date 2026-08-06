import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore, MODE_PROFILES } from '../../store/useStore';

const UNIT_COUNT = 8;

// Deterministic pseudo-random telemetry seeded by rack id so values are
// stable across re-renders but differ per rack.
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function heatColor(load) {
  // blue -> green -> yellow -> orange -> red
  const stops = [
    [0.1, 0.4, 1],
    [0.15, 0.9, 0.5],
    [0.95, 0.85, 0.15],
    [0.95, 0.55, 0.1],
    [0.95, 0.2, 0.25],
  ];
  const scaled = Math.min(0.999, Math.max(0, load)) * (stops.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = stops[i];
  const b = stops[Math.min(i + 1, stops.length - 1)];
  return new THREE.Color(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

export default function ServerRack({ rack, quality }) {
  const groupRef = useRef();
  const ledRefs = useRef([]);
  const [hovered, setHovered] = useState(false);
  const workloadMode = useStore((s) => s.workloadMode);
  const heatmapEnabled = useStore((s) => s.heatmapEnabled);
  const setSelectedObject = useStore((s) => s.setSelectedObject);
  const requestCameraMove = useStore((s) => s.requestCameraMove);
  const setAssistantMessage = useStore((s) => s.setAssistantMessage);
  const selectedObject = useStore((s) => s.selectedObject);

  const profile = MODE_PROFILES[workloadMode];
  const rand = useMemo(() => seededRandom(rack.id), [rack.id]);
  const baseLoad = useMemo(() => 0.3 + rand() * 0.5, [rand]);
  const isSelected = selectedObject?.id === rack.id;

  const telemetry = useMemo(() => {
    const load = Math.min(1, baseLoad * (0.5 + profile.power));
    return {
      gpu: Math.round(load * 100),
      cpu: Math.round(load * 85 + 8),
      memory: Math.round(40 + load * 55),
      storage: Math.round(30 + rand() * 60),
      temp: Math.round(24 + load * profile.heat * 55),
      power: Math.round(2.2 + load * 5.4 * profile.power * 10) / 10,
      cooling: Math.round(70 + (1 - load) * 25),
      network: Math.round(load * 92 + 5),
      model: rack.model,
      health: load > 0.92 ? 'Warning' : 'Healthy',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseLoad, profile, rack.model]);

  const rackColor = heatmapEnabled ? heatColor(telemetry.gpu / 100) : new THREE.Color('#161b24');

  useFrame((state) => {
    ledRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime * (2 + profile.power * 4) + i * 1.3 + rand() * 5;
      const on = Math.sin(t) > (workloadMode === 'maintenance' ? 0.8 : -0.2);
      mesh.material.emissiveIntensity = on ? 1.6 : 0.15;
    });
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedObject({ type: 'rack', id: rack.id, data: telemetry });
    const [x, , z] = rack.position;
    const dir = new THREE.Vector3(x, 0, z).normalize();
    requestCameraMove({
      position: [x + dir.x * 4, 3.2, z + dir.z * 4],
      lookAt: [x, 1.6, z],
    });
    setAssistantMessage({
      title: `${rack.id} — ${rack.model}`,
      body: `Running ${rack.model} at ${telemetry.gpu}% GPU utilization in ${profile.label} mode. Power draw is ${telemetry.power} kW with cooling efficiency at ${telemetry.cooling}%. Status: ${telemetry.health}.`,
    });
  };

  return (
    <group
      ref={groupRef}
      position={rack.position}
      rotation={rack.rotation}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
        handleClick(e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Chassis */}
      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <boxGeometry args={[1.6, 3.6, 1]} />
        <meshStandardMaterial
          color={rackColor}
          emissive={hovered || isSelected ? '#00e5ff' : '#000000'}
          emissiveIntensity={hovered || isSelected ? 0.3 : 0}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Outline on hover/select */}
      {(hovered || isSelected) && (
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[1.68, 3.68, 1.08]} />
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.5} />
        </mesh>
      )}

      {/* LED units */}
      {Array.from({ length: UNIT_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (ledRefs.current[i] = el)}
          position={[0.55, 0.35 + i * 0.42, 0.51]}
        >
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <meshStandardMaterial color={profile.ledColor} emissive={profile.ledColor} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* Vertical status strip */}
      <mesh position={[-0.75, 1.8, 0.3]}>
        <boxGeometry args={[0.04, 3.4, 0.04]} />
        <meshStandardMaterial
          color={telemetry.health === 'Warning' ? '#ff4d5e' : '#22ffb0'}
          emissive={telemetry.health === 'Warning' ? '#ff4d5e' : '#22ffb0'}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {hovered && !isSelected && (
        <Html center distanceFactor={10} position={[0, 3.9, 0]} occlude={false}>
          <div className="glass-panel pointer-events-none w-40 rounded-md px-2.5 py-1.5 text-[10px] font-mono text-white/90 shadow-glow">
            <div className="text-cyan-glow">{rack.id}</div>
            <div className="text-white/60">{rack.model}</div>
            <div>GPU {telemetry.gpu}% · {telemetry.temp}°C</div>
          </div>
        </Html>
      )}
    </group>
  );
}

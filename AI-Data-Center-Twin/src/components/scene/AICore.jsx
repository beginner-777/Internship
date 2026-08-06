import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { useStore, MODE_PROFILES } from '../../store/useStore';

const RING_COUNT = 3;
const PARTICLE_COUNT = 220;

function EnergyParticles({ radius, color, speed }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.85 + Math.random() * 0.3);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [radius]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15 * speed;
      pointsRef.current.rotation.x += delta * 0.05 * speed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color={color} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function AICore({ position }) {
  const groupRef = useRef();
  const coreMeshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const workloadMode = useStore((s) => s.workloadMode);
  const setSelectedObject = useStore((s) => s.setSelectedObject);
  const requestCameraMove = useStore((s) => s.requestCameraMove);
  const setAssistantMessage = useStore((s) => s.setAssistantMessage);

  const profile = MODE_PROFILES[workloadMode];
  const coreColor = profile.ledColor;

  useFrame((state, delta) => {
    if (coreMeshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (1.4 + profile.power)) * 0.05;
      coreMeshRef.current.scale.setScalar(pulse);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (0.06 + profile.power * 0.15);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedObject({
      type: 'core',
      id: 'ai-core-01',
      data: {
        name: 'AI Core — Primary Cluster Controller',
        status: workloadMode === 'emergency' ? 'Critical' : 'Nominal',
        mode: profile.label,
        power: `${Math.round(profile.power * 480)} kW`,
        temp: `${Math.round(28 + profile.heat * 42)}°C`,
      },
    });
    requestCameraMove({ position: [0, 5, 9], lookAt: [0, 2.4, 0] });
    setAssistantMessage({
      title: 'AI Core — Primary Cluster Controller',
      body: `Currently running in ${profile.label} mode. This core orchestrates workload distribution across every GPU cluster in the facility, balancing compute, memory bandwidth, and thermal headroom in real time.`,
    });
  };

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <group
          ref={groupRef}
          onClick={handleClick}
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
          {/* Core sphere */}
          <mesh ref={coreMeshRef} castShadow>
            <icosahedronGeometry args={[1.1, 2]} />
            <meshStandardMaterial
              color={coreColor}
              emissive={coreColor}
              emissiveIntensity={hovered ? 2.2 : 1.4}
              roughness={0.25}
              metalness={0.6}
              wireframe
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.6} transparent opacity={0.35} />
          </mesh>

          {/* Rotating rings */}
          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <mesh key={i} rotation={[Math.PI / 2 + i * 0.6, i * 0.4, 0]}>
              <torusGeometry args={[1.6 + i * 0.35, 0.015, 8, 96]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#00e5ff' : '#a78bfa'} transparent opacity={0.6} toneMapped={false} />
            </mesh>
          ))}

          <EnergyParticles radius={1.9} color={coreColor} speed={0.6 + profile.power} />

          <pointLight color={coreColor} intensity={hovered ? 4 : 2.6} distance={9} decay={2} />

          {hovered && (
            <Html center distanceFactor={12} position={[0, 2.1, 0]} occlude={false}>
              <div className="glass-panel pointer-events-none whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-mono text-cyan-glow shadow-glow">
                AI CORE · {profile.label.toUpperCase()}
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}

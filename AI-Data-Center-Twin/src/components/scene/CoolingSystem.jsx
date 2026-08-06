import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore, MODE_PROFILES } from '../../store/useStore';

function Fan({ position, speed }) {
  const bladeRef = useRef();
  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += delta * speed;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.55, 0.06, 8, 24]} />
        <meshStandardMaterial color="#20242e" metalness={0.7} roughness={0.4} />
      </mesh>
      <group ref={bladeRef}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.09, 0.02]} />
            <meshStandardMaterial color="#3b4252" metalness={0.6} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function CoolingSystem({ position, reducedMotion }) {
  const coolingOn = useStore((s) => s.coolingOn);
  const workloadMode = useStore((s) => s.workloadMode);
  const profile = MODE_PROFILES[workloadMode];
  const pipeRef = useRef();

  useFrame((state) => {
    if (pipeRef.current) {
      const pulse = coolingOn ? 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.3 : 0.1;
      pipeRef.current.material.emissiveIntensity = pulse;
    }
  });

  const fanSpeed = coolingOn ? (reducedMotion ? 1.5 : 4 * profile.coolingSpeed + 1) : 0;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[2.2, 4.4, 1.4]} />
        <meshStandardMaterial color="#12151c" roughness={0.5} metalness={0.6} />
      </mesh>

      <Fan position={[0, 3.2, 0.72]} speed={fanSpeed} />
      <Fan position={[0, 1.6, 0.72]} speed={fanSpeed} />

      {/* Coolant pipe */}
      <mesh ref={pipeRef} position={[0, 4.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 12]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={coolingOn ? 0.9 : 0.1}
          toneMapped={false}
        />
      </mesh>

      {!coolingOn && (
        <pointLight position={[0, 4.6, 0.8]} color="#ff4d5e" intensity={1.4} distance={4} />
      )}
    </group>
  );
}

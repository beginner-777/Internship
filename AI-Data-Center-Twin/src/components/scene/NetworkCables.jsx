import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, MODE_PROFILES } from '../../store/useStore';

const PACKETS_PER_CABLE = 3;

function CablePacketTrail({ curve, color, speed, offset }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = (state.clock.elapsedTime * speed * 0.15 + offset) % 1;
    const point = curve.getPointAt(t);
    meshRef.current.position.copy(point);
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export default function NetworkCables({ racks, reducedMotion }) {
  const workloadMode = useStore((s) => s.workloadMode);
  const networkVizEnabled = useStore((s) => s.networkVizEnabled);
  const profile = MODE_PROFILES[workloadMode];

  // Only wire up a subset of racks to keep geometry + packet counts light.
  const sampled = useMemo(() => racks.filter((_, i) => i % 3 === 0), [racks]);

  const cables = useMemo(() => {
    return sampled.map((rack) => {
      const [x, , z] = rack.position;
      const start = new THREE.Vector3(x, 3.8, z);
      const end = new THREE.Vector3(0, 6, 0);
      const mid = new THREE.Vector3((x + 0) / 2, 8.5, z / 2);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      return { id: rack.id, curve };
    });
  }, [sampled]);

  if (!networkVizEnabled) return null;

  return (
    <group>
      {cables.map(({ id, curve }) => (
        <group key={id}>
          <mesh>
            <tubeGeometry args={[curve, 24, 0.012, 6, false]} />
            <meshBasicMaterial color={profile.ledColor} transparent opacity={0.25} toneMapped={false} />
          </mesh>
          {!reducedMotion &&
            Array.from({ length: PACKETS_PER_CABLE }).map((_, i) => (
              <CablePacketTrail
                key={i}
                curve={curve}
                color={profile.ledColor}
                speed={profile.packetSpeed}
                offset={i / PACKETS_PER_CABLE}
              />
            ))}
        </group>
      ))}
    </group>
  );
}

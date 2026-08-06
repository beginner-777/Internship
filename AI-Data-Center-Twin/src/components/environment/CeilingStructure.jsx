import React from 'react';

export default function CeilingStructure() {
  return (
    <group>
      <mesh position={[0, 10, 0]} receiveShadow>
        <boxGeometry args={[60, 0.3, 40]} />
        <meshStandardMaterial color="#0c0e13" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Ceiling-mounted LED strip lights (visual only, lighting handled separately) */}
      {[-16, -8, 0, 8, 16].map((x) => (
        <mesh key={x} position={[x, 9.7, 0]}>
          <boxGeometry args={[0.5, 0.05, 18]} />
          <meshBasicMaterial color="#bfefff" toneMapped={false} />
        </mesh>
      ))}

      {/* Perimeter support beams */}
      {[-28, 28].map((z) => (
        <mesh key={z} position={[0, 5, z]}>
          <boxGeometry args={[58, 10, 0.4]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.8} metalness={0.3} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

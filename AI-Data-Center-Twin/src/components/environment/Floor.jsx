import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

export default function Floor({ quality }) {
  const highQuality = quality === 'high';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        {highQuality ? (
          <MeshReflectorMaterial
            blur={[300, 60]}
            resolution={1024}
            mixBlur={1}
            mixStrength={35}
            roughness={0.85}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#0a0c10"
            metalness={0.6}
            mirror={0.35}
          />
        ) : (
          <meshStandardMaterial color="#0a0c10" roughness={0.9} metalness={0.4} />
        )}
      </mesh>

      {/* Raised-floor tile grid lines */}
      <gridHelper args={[80, 40, '#142230', '#0c1119']} position={[0, 0.01, 0]} />

      {/* Cyan perimeter LED strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[27.6, 28, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

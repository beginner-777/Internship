import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RectAreaLightUniformsLib } from 'three-stdlib';
import { useStore, MODE_PROFILES } from '../../store/useStore';

let rectAreaInitialized = false;

export default function FacilityLighting({ dayNight, quality }) {
  useEffect(() => {
    if (!rectAreaInitialized) {
      RectAreaLightUniformsLib.init();
      rectAreaInitialized = true;
    }
  }, []);

  const ambientRef = useRef();
  const workloadMode = useStore((s) => s.workloadMode);
  const profile = MODE_PROFILES[workloadMode];

  useFrame((_, delta) => {
    if (!ambientRef.current) return;
    const target = dayNight === 'day' ? profile.ambientIntensity + 0.35 : profile.ambientIntensity;
    ambientRef.current.intensity += (target - ambientRef.current.intensity) * Math.min(1, delta * 2);
  });

  const shadows = quality !== 'low';

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={profile.ambientIntensity} color="#5a7ea8" />

      <directionalLight
        position={[16, 24, 8]}
        intensity={dayNight === 'day' ? 1.4 : 0.5}
        color={dayNight === 'day' ? '#e8f2ff' : '#3ab6ff'}
        castShadow={shadows}
        shadow-mapSize={[shadows ? 2048 : 512, shadows ? 2048 : 512]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Cyan/violet accent rim lights typical of the theme */}
      <pointLight position={[0, 6, 0]} intensity={2.2} color="#00e5ff" distance={22} decay={2} />
      <pointLight position={[-14, 4, -10]} intensity={1.4} color="#7c3aed" distance={20} decay={2} />
      <pointLight position={[14, 4, -10]} intensity={1.4} color="#7c3aed" distance={20} decay={2} />

      {/* Ceiling strip lights */}
      {[-16, -8, 0, 8, 16].map((x) => (
        <rectAreaLight key={x} position={[x, 9.5, 0]} rotation={[Math.PI / 2, 0, 0]} width={2} height={20} intensity={2} color="#bfefff" />
      ))}
    </group>
  );
}

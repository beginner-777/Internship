import { Component, Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

function ParticleField() {
  const points = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let index = 0; index < 150; index += 1) {
      const radius = 2.7 + ((index * 17) % 34) / 20;
      const theta = index * 2.399963;
      const phi = Math.acos(1 - (2 * (index + 0.5)) / 150);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9adff0" size={0.022} transparent opacity={0.54} sizeAttenuation />
    </points>
  );
}

function CoreScene() {
  const group = useRef();
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.12, 0.025);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.12, 0.025);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.9} />
      <pointLight position={[3, 3, 4]} color="#7ee7f5" intensity={32} distance={8} />
      <pointLight position={[-3, -2, 2]} color="#8d7cf4" intensity={24} distance={7} />
      <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh scale={1.32}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshDistortMaterial
            color="#7ecbd7"
            emissive="#1b5361"
            emissiveIntensity={0.85}
            roughness={0.22}
            metalness={0.62}
            distort={reducedMotion ? 0 : 0.27}
            speed={1.6}
            transparent
            opacity={0.86}
          />
        </mesh>
        <mesh scale={0.74}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial color="#b8adff" emissive="#5a43b9" emissiveIntensity={1.8} roughness={0.1} metalness={0.25} />
        </mesh>
        {[1.8, 2.2, 2.6].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / (2 + index), index * 0.8, index * 0.5]}>
            <torusGeometry args={[radius, 0.009 + index * 0.004, 12, 110]} />
            <meshBasicMaterial color={index === 1 ? '#9686e8' : '#72c7d5'} transparent opacity={0.44 - index * 0.08} />
          </mesh>
        ))}
      </Float>
      <ParticleField />
      <Sparkles count={28} scale={6} size={1.2} speed={reducedMotion ? 0 : 0.18} opacity={0.32} color="#d8f8ff" />
    </group>
  );
}

function StaticCore() {
  return (
    <div className="static-core" role="img" aria-label="AI core compatibility visualization">
      <span className="static-core-orbit orbit-a" />
      <span className="static-core-orbit orbit-b" />
      <span className="static-core-orbit orbit-c" />
      <i className="static-core-nucleus" />
      <small>COMPATIBILITY RENDER</small>
    </div>
  );
}

class CoreErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <StaticCore /> : this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function NeuralCore() {
  const [webGLAvailable] = useState(detectWebGL);

  return (
    <div className="neural-core" aria-label="Interactive AI core visualization">
      <div className="core-css-fallback" aria-hidden="true"><span /><i /></div>
      <CoreErrorBoundary>
        {webGLAvailable ? (
          <Canvas camera={{ position: [0, 0, 7.4], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <CoreScene />
            </Suspense>
          </Canvas>
        ) : <StaticCore />}
      </CoreErrorBoundary>
      <div className="core-hud core-hud-left"><span>NODE</span><strong>MS–01</strong></div>
      <div className="core-hud core-hud-right"><span>STATE</span><strong>LEARNING</strong></div>
      <div className="core-axis axis-x" aria-hidden="true" />
      <div className="core-axis axis-y" aria-hidden="true" />
    </div>
  );
}

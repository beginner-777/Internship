import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload, SoftShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import DataCenterScene from './DataCenterScene';
import CameraRig from './CameraRig';
import StatsSampler from './StatsSampler';
import ControlPanel from '../ui/ControlPanel';
import Dashboard from '../ui/Dashboard';
import MiniMap from '../ui/MiniMap';
import PerformanceHUD from '../ui/PerformanceHUD';
import AssistantHologram from '../ui/AssistantHologram';
import CameraPresetsBar from '../ui/CameraPresetsBar';
import TopBar from '../ui/TopBar';

const isDev = import.meta.env.DEV;

export default function DataCenterExperience() {
  const quality = useStore((s) => s.quality);
  const reducedMotion = useReducedMotion();
  const [webglLost, setWebglLost] = useState(false);

  const dpr = quality === 'low' ? [0.75, 1] : quality === 'medium' ? [1, 1.5] : [1, 2];

  return (
    <motion.div
      className="relative h-full w-full bg-carbon-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {webglLost ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
          <p className="font-mono text-sm">Graphics context lost. Please reload.</p>
          <button
            className="focus-ring rounded-full border border-white/20 px-4 py-2 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      ) : (
        <Canvas
          shadows={quality !== 'low'}
          dpr={dpr}
          gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', alpha: false }}
          camera={{ position: [18, 12, 18], fov: 45, near: 0.1, far: 200 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebglLost(true);
            });
          }}
        >
          <color attach="background" args={['#050608']} />
          <fog attach="fog" args={['#050608', 18, 62]} />
          {quality === 'high' && <SoftShadows size={12} samples={8} />}

          <Suspense fallback={null}>
            <DataCenterScene quality={quality} reducedMotion={reducedMotion} />
          </Suspense>

          <CameraRig reducedMotion={reducedMotion} />
          {isDev && <StatsSampler />}

          {quality !== 'low' && (
            <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
              <Bloom
                intensity={0.85}
                luminanceThreshold={0.18}
                luminanceSmoothing={0.35}
                mipmapBlur
              />
              <ChromaticAberration offset={[0.0006, 0.0006]} />
              <Vignette eskil={false} offset={0.25} darkness={0.9} />
            </EffectComposer>
          )}

          <AdaptiveDpr pixelated={false} />
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      )}

      {/* ---- 2D UI Overlay ---- */}
      <TopBar />
      <ControlPanel />
      <Dashboard />
      <MiniMap />
      <AssistantHologram />
      <CameraPresetsBar />
      {isDev && <PerformanceHUD />}
    </motion.div>
  );
}

import React, { Suspense, lazy, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import DataCenterScene from './DataCenterScene';
import CameraRig from './CameraRig';

const isDev = import.meta.env.DEV;
const SceneEffects = lazy(() => import('./SceneEffects'));
const SceneOverlay = lazy(() => import('../ui/SceneOverlay'));
const StatsSampler = isDev ? lazy(() => import('./StatsSampler')) : null;

export default function DataCenterExperience() {
  const quality = useStore((s) => s.quality);
  const reducedMotion = useReducedMotion();
  const [webglLost, setWebglLost] = useState(false);

  const dpr = quality === 'low' ? [0.75, 1] : quality === 'medium' ? [1, 1.5] : [1, 2];

  return (
    <div className="scene-enter relative h-full w-full bg-carbon-950">
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
          <Suspense fallback={null}>
            <DataCenterScene quality={quality} reducedMotion={reducedMotion} />
          </Suspense>

          <CameraRig reducedMotion={reducedMotion} />
          {StatsSampler && (
            <Suspense fallback={null}>
              <StatsSampler />
            </Suspense>
          )}

          {quality !== 'low' && (
            <Suspense fallback={null}>
              <SceneEffects quality={quality} />
            </Suspense>
          )}

          <AdaptiveDpr pixelated={false} />
          <AdaptiveEvents />
          <Preload all />
        </Canvas>
      )}

      {/* ---- 2D UI Overlay ---- */}
      <Suspense fallback={null}>
        <SceneOverlay />
      </Suspense>
    </div>
  );
}

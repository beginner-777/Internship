import React, { Suspense, lazy, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { detectWebGL } from './hooks/useWebGL';
import LandingPage from './components/landing/LandingPage';
import BootSequence from './components/boot/BootSequence';
import WebGLFallback from './components/fallback/WebGLFallback';
import SceneLoader from './components/scene/SceneLoader';

const DataCenterExperience = lazy(() => import('./components/scene/DataCenterExperience'));

export default function App() {
  const appPhase = useStore((s) => s.appPhase);
  const webglSupported = useMemo(() => detectWebGL(), []);

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-carbon-950 text-white font-sans selection:bg-cyan-glow/30">
      <AnimatePresence mode="wait">
        {appPhase === 'landing' && <LandingPage key="landing" />}
        {appPhase === 'boot' && <BootSequence key="boot" />}
        {appPhase === 'scene' && (
          <Suspense fallback={<SceneLoader key="scene-suspense" />}>
            <DataCenterExperience key="scene" />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

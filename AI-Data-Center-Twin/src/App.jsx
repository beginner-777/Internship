import React, { Suspense, lazy, useMemo } from 'react';
import { useStore } from './store/useStore';
import { detectWebGL } from './hooks/useWebGL';
import LandingPage from './components/landing/LandingPage';
import SceneLoader from './components/scene/SceneLoader';

const loadBootSequence = () => import('./components/boot/BootSequence');
const loadDataCenterExperience = () => import('./components/scene/DataCenterExperience');

const BootSequence = lazy(loadBootSequence);
const DataCenterExperience = lazy(loadDataCenterExperience);
const WebGLFallback = lazy(() => import('./components/fallback/WebGLFallback'));

export default function App() {
  const appPhase = useStore((s) => s.appPhase);
  const webglSupported = useMemo(() => detectWebGL(), []);

  if (!webglSupported) {
    return (
      <Suspense fallback={<div className="h-full w-full bg-carbon-950" />}>
        <WebGLFallback />
      </Suspense>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-carbon-950 text-white font-sans selection:bg-cyan-glow/30">
      {appPhase === 'landing' && (
        <LandingPage preloadBootSequence={loadBootSequence} />
      )}
      {appPhase === 'boot' && (
        <Suspense fallback={<SceneLoader label="INITIALIZING SYSTEMS…" />}>
          <BootSequence preloadScene={loadDataCenterExperience} />
        </Suspense>
      )}
      {appPhase === 'scene' && (
        <Suspense fallback={<SceneLoader />}>
          <DataCenterExperience />
        </Suspense>
      )}
    </div>
  );
}

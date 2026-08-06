import React, { Suspense, lazy, useEffect, useState } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ControlPanel from './ControlPanel';
import CameraPresetsBar from './CameraPresetsBar';
import TopBar from './TopBar';

const Dashboard = lazy(() => import('./Dashboard'));
const AssistantHologram = lazy(() => import('./AssistantHologram'));
const MiniMap = lazy(() => import('./MiniMap'));
const PerformanceHUD = import.meta.env.DEV ? lazy(() => import('./PerformanceHUD')) : null;

/**
 * Keeps the essential controls together while deferring optional panels until
 * they can actually be seen. Once loaded, panels remain mounted so their exit
 * animations continue to work exactly as before.
 */
export default function SceneOverlay() {
  const selectedObject = useStore((state) => state.selectedObject);
  const assistantMessage = useStore((state) => state.assistantMessage);
  const showMiniMap = useMediaQuery('(min-width: 640px)');
  const [dashboardRequested, setDashboardRequested] = useState(Boolean(selectedObject));
  const [assistantRequested, setAssistantRequested] = useState(Boolean(assistantMessage));

  useEffect(() => {
    if (selectedObject) setDashboardRequested(true);
  }, [selectedObject]);

  useEffect(() => {
    if (assistantMessage) setAssistantRequested(true);
  }, [assistantMessage]);

  return (
    <LazyMotion features={domAnimation} strict>
      <TopBar />
      <ControlPanel />
      <CameraPresetsBar />

      {dashboardRequested && (
        <Suspense fallback={null}>
          <Dashboard />
        </Suspense>
      )}

      {assistantRequested && (
        <Suspense fallback={null}>
          <AssistantHologram />
        </Suspense>
      )}

      {showMiniMap && (
        <Suspense fallback={null}>
          <MiniMap />
        </Suspense>
      )}

      {PerformanceHUD && (
        <Suspense fallback={null}>
          <PerformanceHUD />
        </Suspense>
      )}
    </LazyMotion>
  );
}

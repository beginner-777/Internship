"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SignalScene = dynamic(() => import("./signal-scene"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden="true" />,
});

type SceneKind = "hero" | "analysis" | "header" | "map";

type PerformanceNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

type IdleWindow = {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function canLoadRichScene() {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as PerformanceNavigator).connection?.saveData === true;

  return isDesktop && !reducedMotion && !saveData;
}

export function SceneSlot({ kind = "hero", severity = 2 }: { kind?: "hero" | "analysis" | "header" | "map"; severity?: number }) {
  const [sceneEnabled, setSceneEnabled] = useState(false);

  useEffect(() => {
    if (!canLoadRichScene()) return;

    let cancelled = false;
    const enableScene = () => {
      if (!cancelled) setSceneEnabled(true);
    };

    const idleWindow = window as unknown as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(enableScene, { timeout: 1_500 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(enableScene, 400);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  if (!sceneEnabled) {
    return <div className="scene-fallback" aria-hidden="true" />;
  }

  return <SignalScene kind={kind as SceneKind} severity={severity} />;
}

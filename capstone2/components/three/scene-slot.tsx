"use client";

import dynamic from "next/dynamic";

const SignalScene = dynamic(() => import("./signal-scene"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden="true" />,
});

export function SceneSlot({ kind = "hero", severity = 2 }: { kind?: "hero" | "analysis" | "header" | "map"; severity?: number }) {
  return <SignalScene kind={kind} severity={severity} />;
}

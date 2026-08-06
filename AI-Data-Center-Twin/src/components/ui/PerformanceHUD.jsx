import React, { useEffect, useState } from 'react';
import { rendererStatsBridge } from '../../utils/rendererStatsBridge';

const ROW = (label, value) => (
  <div key={label} className="flex justify-between gap-4">
    <span className="text-white/40">{label}</span>
    <span className="text-status-ok">{value}</span>
  </div>
);

export default function PerformanceHUD() {
  const [stats, setStats] = useState(rendererStatsBridge);

  useEffect(() => {
    const id = setInterval(() => setStats({ ...rendererStatsBridge }), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-3 top-24 z-30 rounded-md border border-status-ok/30 bg-black/70 px-3 py-2 font-mono text-[10px] leading-4 sm:right-5 sm:top-28"
      aria-hidden="true"
    >
      <div className="mb-1 text-white/50">PERFORMANCE (DEV)</div>
      {ROW('FPS', stats.fps)}
      {ROW('Draw Calls', stats.drawCalls)}
      {ROW('Triangles', stats.triangles.toLocaleString())}
      {ROW('Textures', stats.textures)}
      {ROW('Geometries', stats.geometries)}
    </div>
  );
}

import React from 'react';

export default function SceneLoader({ label = 'LOADING VISUALIZATION ENGINE…' }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-carbon-950">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-glow/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-glow" />
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-widest text-white/50">
        {label}
      </p>
    </div>
  );
}

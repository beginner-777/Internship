import React, { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 30;

export default function Sparkline({ value, color = '#00e5ff', label, unit = '%' }) {
  const [history, setHistory] = useState(() => Array(MAX_POINTS).fill(value));

  useEffect(() => {
    setHistory((h) => [...h.slice(1), value]);
  }, [value]);

  const max = Math.max(...history, 1);
  const min = Math.min(...history, 0);
  const range = Math.max(1, max - min);

  const points = history
    .map((v, i) => {
      const x = (i / (MAX_POINTS - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center justify-between text-[10px] text-white/50">
        <span>{label}</span>
        <span className="font-mono text-white/80">
          {value.toFixed(0)}
          {unit}
        </span>
      </div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-1 h-8 w-full">
        <polyline
          points={points.split(' ').map((p) => {
            const [x, y] = p.split(',');
            return `${x},${(parseFloat(y) * 0.4).toFixed(2)}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

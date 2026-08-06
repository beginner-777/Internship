import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import BootCanvasBackdrop from './BootCanvasBackdrop';

const STAGES = [
  'Initializing Infrastructure...',
  'Authenticating Compute Nodes...',
  'Loading GPU Cluster...',
  'Building Digital Twin...',
  'Synchronizing AI Network...',
  'Starting Cooling Systems...',
  'Launching Visualization Engine...',
  'Ready.',
];

export default function BootSequence() {
  const setAppPhase = useStore((s) => s.setAppPhase);
  const reducedMotion = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const totalDuration = reducedMotion ? 1800 : 4200;
    const stageDuration = totalDuration / STAGES.length;
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);

      const idx = Math.min(STAGES.length - 1, Math.floor(elapsed / stageDuration));
      setStageIndex((prev) => {
        if (idx !== prev) {
          setLogLines((lines) => [...lines.slice(-6), `[OK] ${STAGES[idx]}`]);
        }
        return idx;
      });

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(() => setAppPhase('scene'), 550);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, setAppPhase]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-carbon-950 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label={`Loading digital twin: ${STAGES[stageIndex]} ${Math.round(progress)} percent`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <BootCanvasBackdrop progress={progress} reducedMotion={reducedMotion} />

      {/* Scan line sweep */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-cyan-glow/0 via-cyan-glow/30 to-cyan-glow/0 animate-scan" />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6">
        <span className="font-display text-xs tracking-[0.4em] text-cyan-glow/70">
          NEURAL COMPUTE FABRIC
        </span>
        <h1 className="font-display mt-3 text-2xl sm:text-3xl font-bold tracking-wide text-white text-glow-cyan text-center">
          AI DATA CENTER
        </h1>
        <p className="mt-1 text-xs text-white/40 tracking-widest">DIGITAL TWIN — BOOT SEQUENCE</p>

        {/* Progress bar */}
        <div className="mt-8 w-full">
          <div className="flex justify-between text-[11px] font-mono text-white/50 mb-2">
            <span>{STAGES[stageIndex]}</span>
            <span className="text-cyan-glow">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-core via-cyan-core to-cyan-glow shadow-glow"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Terminal boot log */}
        <div
          className="mt-6 w-full h-32 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[10px] leading-5 text-status-ok/80 overflow-hidden twin-scroll"
          aria-hidden="true"
        >
          {logLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <span className="inline-block h-3 w-1.5 bg-status-ok/70 animate-pulseGlow" />
        </div>
      </div>
    </motion.div>
  );
}

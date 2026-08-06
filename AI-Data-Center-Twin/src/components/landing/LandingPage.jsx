import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCpu } from 'react-icons/fi';
import { useStore } from '../../store/useStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ParticleField from './ParticleField';

export default function LandingPage() {
  const setAppPhase = useStore((s) => s.setAppPhase);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-carbon-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Ambient gradient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-cyan-glow/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[50vh] w-[50vh] rounded-full bg-violet-glow/10 blur-[120px]" />
      </div>

      <ParticleField reducedMotion={reducedMotion} />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="glass-panel mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow"
        >
          <FiCpu className="text-cyan-glow" size={30} aria-hidden="true" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-xs tracking-[0.5em] text-cyan-glow/70"
        >
          NEXT-GENERATION COMPUTE
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl text-glow-cyan"
        >
          AI Data Center
          <br />
          <span className="bg-gradient-to-r from-cyan-glow via-white to-violet-glow bg-clip-text text-transparent">
            Digital Twin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-5 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed"
        >
          Step inside a living, real-time model of a GPU compute facility — inspect server
          racks, watch AI workloads move through the network, and monitor thermal, power, and
          cooling systems as they happen.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => setAppPhase('boot')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="focus-ring group relative mt-10 flex items-center gap-2 overflow-hidden rounded-full border border-cyan-glow/40 bg-white/5 px-8 py-3.5 font-medium text-white shadow-glow transition-colors hover:bg-cyan-glow/10"
        >
          <span>Enter Digital Twin</span>
          <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4 text-[11px] text-white/30"
        >
          Best experienced on desktop · WebGL required
        </motion.p>
      </div>
    </motion.div>
  );
}

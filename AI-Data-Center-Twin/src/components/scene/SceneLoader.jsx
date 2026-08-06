import React from 'react';
import { motion } from 'framer-motion';

export default function SceneLoader() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-carbon-950">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-glow/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-glow"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-widest text-white/50">
        LOADING VISUALIZATION ENGINE…
      </p>
    </div>
  );
}

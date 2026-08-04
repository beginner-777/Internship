import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const particles = Array.from({ length: 150 }, (_, index) => {
  const angle = (index / 150) * Math.PI * 2;
  const radius = 37 + Math.sin(index * 2.17) * 5 + Math.cos(index * 0.73) * 2.5;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius * 0.96,
    size: 1 + ((index * 13) % 4) * 0.55,
    opacity: 0.16 + ((index * 19) % 72) / 100,
    delay: -((index * 0.037) % 2.8),
  };
});

export default function BootSequence({ onComplete }) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(onComplete, 500);
      return () => window.clearTimeout(timer);
    }

    const readyTimer = window.setTimeout(() => setReady(true), 2200);
    const completeTimer = window.setTimeout(onComplete, 3400);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, reducedMotion]);

  return (
    <motion.section
      className="boot-screen isolate"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.025, filter: 'blur(14px)' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Initializing portfolio experience"
    >
      <div className="loader-vignette" aria-hidden="true" />
      <span className="loader-corner corner-top">M/AI.OS · 2026</span>
      <span className="loader-corner corner-bottom">ISLAMABAD · PK</span>

      <div className="particle-loader" aria-hidden="true">
        <motion.div
          className="loader-particle-ring"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {particles.map((particle, index) => (
            <motion.span
              className="loader-particle"
              key={index}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
              }}
              animate={reducedMotion ? undefined : {
                opacity: [particle.opacity * 0.35, particle.opacity, particle.opacity * 0.35],
                scale: [0.7, 1.3, 0.7],
              }}
              transition={{
                duration: 2.1 + (index % 7) * 0.14,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="loader-bright-arc"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="loader-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35 }}
        >
          <strong>MUSFIRAH.OS</strong>
          <span>FRONTEND INTELLIGENCE</span>
        </motion.div>
      </div>

      <motion.div className="loader-status" animate={{ opacity: ready ? 1 : 0.48 }}>
        <i /> {ready ? 'INTERFACE READY' : 'ASSEMBLING EXPERIENCE'}
      </motion.div>

      <button className="boot-skip" type="button" onClick={onComplete}>
        Enter now <span>↗</span>
      </button>
    </motion.section>
  );
}

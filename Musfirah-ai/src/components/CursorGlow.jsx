import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const smoothX = useSpring(x, { damping: 28, stiffness: 180, mass: 0.35 });
  const smoothY = useSpring(y, { damping: 28, stiffness: 180, mass: 0.35 });

  useEffect(() => {
    const update = (event) => {
      x.set(event.clientX - 180);
      y.set(event.clientY - 180);
    };
    window.addEventListener('pointermove', update, { passive: true });
    return () => window.removeEventListener('pointermove', update);
  }, [x, y]);

  return <motion.div className="cursor-glow" aria-hidden="true" style={{ x: smoothX, y: smoothY }} />;
}

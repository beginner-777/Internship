import React, { useEffect, useRef } from 'react';

/**
 * Cheap ambient particle field for the landing page. Uses a 2D canvas
 * rather than WebGL since the R3F Canvas is intentionally lazy-loaded
 * and shouldn't be paid for until the user commits to entering the twin.
 */
export default function ParticleField({ reducedMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width, height, particles, raf;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function init() {
      resize();
      const count = Math.max(30, Math.min(80, Math.floor((width * height) / 22000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.15 + 0.03,
        alpha: Math.random() * 0.5 + 0.2,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        if (p.y < -5) p.y = height + 5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 230, 255, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    init();
    window.addEventListener('resize', init);
    raf = requestAnimationFrame(step);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

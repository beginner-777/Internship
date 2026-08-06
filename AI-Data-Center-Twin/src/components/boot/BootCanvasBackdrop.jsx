import React, { useEffect, useRef } from 'react';

/**
 * Lightweight 2D canvas animation (not WebGL) so the boot sequence is
 * cheap to render even before the R3F scene has loaded. Draws:
 *  - a neural network of connecting nodes
 *  - flowing data packets along motherboard-style traces
 *  - pulsing "GPU LED" dots
 */
export default function BootCanvasBackdrop({ reducedMotion }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, nodes, leds;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function init() {
      resize();
      const nodeCount = Math.floor((width * height) / 26000);
      nodes = Array.from({ length: Math.max(18, Math.min(48, nodeCount)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.5 + 1,
        pulse: Math.random() * Math.PI * 2,
      }));
      leds = Array.from({ length: 10 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function step(t) {
      ctx.clearRect(0, 0, width, height);

      // connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reducedMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dist / 140) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(n.pulse + t * 0.002);
        ctx.beginPath();
        ctx.fillStyle = `rgba(77, 241, 255, ${0.35 + glow * 0.4})`;
        ctx.arc(n.x, n.y, n.r + glow, 0, Math.PI * 2);
        ctx.fill();
      }

      // GPU LEDs
      for (const l of leds) {
        const glow = 0.4 + 0.6 * Math.max(0, Math.sin(l.phase + t * 0.0015));
        ctx.beginPath();
        ctx.fillStyle = `rgba(167, 139, 250, ${glow})`;
        ctx.rect(l.x, l.y, 3, 3);
        ctx.fill();
      }

      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    init();
    window.addEventListener('resize', init);
    rafRef.current = requestAnimationFrame(step);
    if (reducedMotion) step(0);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
}

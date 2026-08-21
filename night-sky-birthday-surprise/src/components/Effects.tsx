"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type ConstellationParticle = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  size: number;
  phase: number;
};

export function ConstellationText({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let animation = 0;
    let start = performance.now();
    let particles: ConstellationParticle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sample = document.createElement("canvas");
      const sampleWidth = Math.max(420, Math.floor(width));
      const sampleHeight = Math.max(170, Math.floor(height));
      sample.width = sampleWidth;
      sample.height = sampleHeight;
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      sampleContext.fillStyle = "#fff";
      sampleContext.textAlign = "center";
      sampleContext.textBaseline = "middle";
      const fontSize = Math.min(sampleWidth * 0.135, 88);
      sampleContext.font = `700 ${fontSize}px Georgia, serif`;
      sampleContext.fillText("HAPPY", sampleWidth / 2, sampleHeight * 0.33);
      sampleContext.font = `700 ${fontSize * 0.9}px Georgia, serif`;
      sampleContext.fillText("BIRTHDAY", sampleWidth / 2, sampleHeight * 0.72);
      const imageData = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
      const candidates: { x: number; y: number }[] = [];
      const step = width < 600 ? 7 : 8;
      for (let y = 4; y < sampleHeight; y += step) {
        for (let x = 4; x < sampleWidth; x += step) {
          if (imageData[(y * sampleWidth + x) * 4 + 3] > 150) candidates.push({ x, y });
        }
      }
      const max = width < 600 ? 265 : 430;
      const stride = Math.max(1, Math.floor(candidates.length / max));
      particles = candidates
        .filter((_, i) => i % stride === 0)
        .slice(0, max)
        .map((point, i) => ({
          sx: (((i * 67.7) % 100) / 100) * width,
          sy: (((i * 41.3) % 100) / 100) * height,
          tx: (point.x / sampleWidth) * width,
          ty: (point.y / sampleHeight) * height,
          x: 0,
          y: 0,
          size: 0.8 + (i % 5) * 0.24,
          phase: i * 0.73,
        }));
      start = performance.now();
    };

    const ease = (value: number) => 1 - Math.pow(1 - value, 4);
    const draw = (now: number) => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      const progress = ease(Math.min(1, (now - start) / 3600));
      const twinkle = now * 0.002;
      particles.forEach((particle) => {
        particle.x = particle.sx + (particle.tx - particle.sx) * progress;
        particle.y = particle.sy + (particle.ty - particle.sy) * progress;
      });

      if (progress > 0.52 && frame % 2 === 0) {
        context.lineWidth = 0.45;
        particles.forEach((particle, i) => {
          const nearby = particles[(i + 1) % particles.length];
          const distance = Math.hypot(particle.x - nearby.x, particle.y - nearby.y);
          if (distance < 17) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(nearby.x, nearby.y);
            context.strokeStyle = `rgba(196, 215, 255, ${0.12 * progress})`;
            context.stroke();
          }
        });
      }

      particles.forEach((particle) => {
        const pulse = 0.72 + Math.sin(twinkle + particle.phase) * 0.28;
        const alpha = Math.min(1, 0.3 + progress * 0.7) * pulse;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * (0.8 + progress * 0.35), 0, Math.PI * 2);
        context.fillStyle = `rgba(247, 244, 225, ${alpha})`;
        context.shadowBlur = 8 + progress * 9;
        context.shadowColor = "rgba(170, 196, 255, .9)";
        context.fill();
      });
      context.shadowBlur = 0;
      animation = requestAnimationFrame(draw);
    };

    buildParticles();
    animation = requestAnimationFrame(draw);
    window.addEventListener("resize", buildParticles);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", buildParticles);
    };
  }, [visible]);

  if (!visible) return null;
  return <canvas ref={canvasRef} className="constellation" aria-label="Stars forming the words Happy Birthday" />;
}

type FireworkParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
};

export function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let animation = 0;
    let particles: FireworkParticle[] = [];
    let lastBurst = 0;
    let burstIndex = 0;
    const colors = ["#f7e6a9", "#d9e7ff", "#ccb7ff", "#f0b86e", "#b4c9ff"];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = () => {
      const sequence = [0.27, 0.72, 0.49, 0.17, 0.83];
      const x = width * sequence[burstIndex % sequence.length];
      const y = height * (0.2 + ((burstIndex * 17) % 25) / 100);
      const color = colors[burstIndex % colors.length];
      const count = width < 600 ? 48 : 76;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (burstIndex % 2) * 0.025;
        const speed = 1.6 + ((i * 37) % 34) / 10;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.008 + ((i * 7) % 8) / 1000,
          color,
          size: 0.8 + (i % 4) * 0.35,
          trail: [],
        });
      }
      burstIndex += 1;
      document.documentElement.style.setProperty("--burst-glow", "1");
      window.setTimeout(() => document.documentElement.style.setProperty("--burst-glow", "0"), 180);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (time - lastBurst > (burstIndex === 0 ? 700 : 1250 + (burstIndex % 3) * 330)) {
        burst();
        lastBurst = time;
      }
      particles = particles.filter((particle) => particle.alpha > 0.03);
      particles.forEach((particle) => {
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 5) particle.trail.shift();
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy = particle.vy * 0.985 + 0.027;
        particle.alpha -= particle.decay;
        context.beginPath();
        if (particle.trail[0]) context.moveTo(particle.trail[0].x, particle.trail[0].y);
        particle.trail.forEach((point) => context.lineTo(point.x, point.y));
        context.lineTo(particle.x, particle.y);
        const alpha = Math.round(Math.max(0, particle.alpha) * 255).toString(16).padStart(2, "0");
        context.strokeStyle = `${particle.color}${alpha}`;
        context.lineWidth = particle.size;
        context.shadowBlur = 8;
        context.shadowColor = particle.color;
        context.stroke();
      });
      context.shadowBlur = 0;
      animation = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animation = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      document.documentElement.style.setProperty("--burst-glow", "0");
    };
  }, [active]);

  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />;
}

export function WishEffect({ active }: { active: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        x: (i * 83.2) % 100,
        y: (i * 47.6) % 100,
        delay: (i % 30) * 0.02,
        size: 1 + (i % 4),
      })),
    [],
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="wish-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          role="status"
          aria-live="polite"
        >
          <div className="wish-stars" aria-hidden="true">
            {stars.map((star, index) => (
              <motion.i
                key={index}
                style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: `calc(50vw - ${star.x}vw)`,
                  y: `calc(50vh - ${star.y}vh)`,
                  opacity: [0, 1, 0.2],
                  scale: [0.4, 1.3, 0.2],
                }}
                transition={{ delay: star.delay, duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
              />
            ))}
          </div>
          <motion.div
            className="wish-core"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            aria-hidden="true"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.9 }}
          >
            May every wish you make tonight
            <span>find its way to you. ✨</span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

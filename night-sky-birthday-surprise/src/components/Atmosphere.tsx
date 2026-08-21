"use client";

import { motion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
};

export function Stars({ count = 112 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 47.73 + (i % 7) * 8.2) % 100,
        y: (i * 29.17 + (i % 11) * 5.7) % 100,
        size: 0.7 + ((i * 13) % 22) / 10,
        opacity: 0.28 + ((i * 17) % 58) / 100,
        delay: -((i * 0.31) % 7),
        duration: 3.8 + ((i * 0.23) % 4),
      })),
    [count],
  );

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((star, index) => (
        <i
          key={index}
          style={
            {
              "--x": `${star.x}%`,
              "--y": `${star.y}%`,
              "--size": `${star.size}px`,
              "--opacity": star.opacity,
              "--delay": `${star.delay}s`,
              "--duration": `${star.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function ShootingStars({ active }: { active: boolean }) {
  return (
    <div className={`shooting-stars ${active ? "is-celebrating" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}

export function NightSky({ celebrating }: { celebrating: boolean }) {
  return (
    <div className="night-sky" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <Stars />
      <ShootingStars active={celebrating} />
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="horizon-glow" />
      <div className="mountain mountain-back" />
      <div className="mountain mountain-front" />
      <div className="grain" />
    </div>
  );
}

export function Moon({ activated, onActivate }: { activated: boolean; onActivate: () => void }) {
  return (
    <motion.button
      type="button"
      className={`moon-button ${activated ? "is-activated" : ""}`}
      onClick={onActivate}
      disabled={activated}
      aria-label={activated ? "The moon is glowing" : "Touch the moon to begin the birthday surprise"}
      whileHover={activated ? undefined : { scale: 1.035 }}
      whileTap={activated ? undefined : { scale: 0.97 }}
    >
      <span className="moon-orbit moon-orbit-one" />
      <span className="moon-orbit moon-orbit-two" />
      <span className="moon-aura" />
      <span className="moon-surface">
        <i className="moon-crater crater-one" />
        <i className="moon-crater crater-two" />
        <i className="moon-crater crater-three" />
        <i className="moon-crater crater-four" />
      </span>
      {!activated && (
        <span className="moon-hint">
          <i />
          touch the moon
        </span>
      )}
    </motion.button>
  );
}

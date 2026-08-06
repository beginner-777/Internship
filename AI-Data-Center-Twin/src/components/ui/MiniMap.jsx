import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { RACK_LAYOUT } from '../scene/ServerRackField';
import { cameraPositionBridge } from '../../utils/cameraPositionBridge';

const WORLD_SIZE = 34; // half-extent of the facility, in world units
const MAP_SIZE = 132; // px

// MiniMap lives outside the R3F <Canvas> tree, so it polls the shared
// cameraPositionBridge with rAF rather than using useFrame/useThree.
export default function MiniMap() {
  const dotRef = useRef(null);
  const requestCameraMove = useStore((s) => s.requestCameraMove);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (dotRef.current) {
        const nx = (cameraPositionBridge.x / WORLD_SIZE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
        const nz = (cameraPositionBridge.z / WORLD_SIZE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
        dotRef.current.style.transform = `translate(${nx}px, ${nz}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass-panel pointer-events-auto absolute bottom-4 left-3 z-20 hidden rounded-xl p-2.5 shadow-glow sm:bottom-5 sm:left-5 sm:block"
      aria-label="Facility mini-map"
    >
      <p className="mb-1.5 text-[10px] tracking-wider text-white/40">FACILITY MAP</p>
      <div
        className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40"
        style={{ width: MAP_SIZE, height: MAP_SIZE }}
      >
        {/* Rack zone dots */}
        {RACK_LAYOUT.map((rack) => {
          const [x, , z] = rack.position;
          const nx = (x / WORLD_SIZE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
          const nz = (z / WORLD_SIZE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
          return (
            <button
              key={rack.id}
              type="button"
              title={rack.id}
              onClick={() =>
                requestCameraMove({
                  position: [x + 3, 3, z + 3],
                  lookAt: [x, 1.6, z],
                })
              }
              className="focus-ring absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/50 hover:bg-cyan-glow"
              style={{ left: nx, top: nz }}
              aria-label={`Focus camera on ${rack.id}`}
            />
          );
        })}

        {/* AI Core */}
        <div
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-glow shadow-glow-violet"
          style={{ left: MAP_SIZE / 2, top: MAP_SIZE / 2 }}
          aria-hidden="true"
        />

        {/* Camera position dot */}
        <div
          ref={dotRef}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-transparent"
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

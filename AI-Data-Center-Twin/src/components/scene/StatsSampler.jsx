import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { rendererStatsBridge } from '../../utils/rendererStatsBridge';

// Dev-only: samples three.js renderer.info once per second and writes it
// into a plain-object bridge so the 2D PerformanceHUD (outside the Canvas)
// can read it without forcing React re-renders on every frame.
export default function StatsSampler() {
  const { gl } = useThree();
  const frames = useRef(0);
  const lastSample = useRef(performance.now());

  useFrame(() => {
    frames.current += 1;
    const now = performance.now();
    if (now - lastSample.current >= 500) {
      const elapsedSec = (now - lastSample.current) / 1000;
      rendererStatsBridge.fps = Math.round(frames.current / elapsedSec);
      rendererStatsBridge.drawCalls = gl.info.render.calls;
      rendererStatsBridge.triangles = gl.info.render.triangles;
      rendererStatsBridge.textures = gl.info.memory.textures;
      rendererStatsBridge.geometries = gl.info.memory.geometries;
      frames.current = 0;
      lastSample.current = now;
    }
  });

  return null;
}

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { useSmoothedPointer } from "./hooks/useSmoothedPointer.js";

// Cap DPR so 4K/retina displays don't force the fragment shader to run
// 3-4x more pixel invocations than a standard display needs.
const MAX_DEVICE_PIXEL_RATIO = 1.75;

/**
 * The fullscreen shader plane. Lives inside the R3F <Canvas> and owns the
 * per-frame uniform updates (time, resolution, mouse). Kept separate from
 * <ShaderCanvas> so the Canvas setup and the shader logic aren't tangled.
 */
function ShaderPlane({ isPaused }) {
  const materialRef = useRef();
  const { viewport, size } = useThree();
  const pointer = useSmoothedPointer();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouseStrength: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (isPaused || !materialRef.current) return;

    const material = materialRef.current;

    // Advance time manually (rather than state.clock.elapsedTime) so it
    // naturally stops accumulating the instant `isPaused` flips true —
    // no discontinuous jump when resuming later.
    material.uniforms.u_time.value += delta;

    material.uniforms.u_resolution.value.set(size.width, size.height);

    // Ease the raw pointer target toward the smoothed value. A short
    // per-frame lerp reads as premium, weighted motion rather than the
    // field snapping instantly to the cursor.
    const smoothing = 1 - Math.pow(0.001, delta); // frame-rate independent ease
    pointer.current.smoothed.x +=
      (pointer.current.target.x - pointer.current.smoothed.x) * smoothing;
    pointer.current.smoothed.y +=
      (pointer.current.target.y - pointer.current.smoothed.y) * smoothing;

    material.uniforms.u_mouse.value.set(
      pointer.current.smoothed.x,
      pointer.current.smoothed.y
    );

    const targetStrength = pointer.current.isActive ? 1 : 0;
    material.uniforms.u_mouseStrength.value +=
      (targetStrength - material.uniforms.u_mouseStrength.value) * smoothing;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderCanvas({ isPaused }) {
  return (
    <Canvas
      orthographic={false}
      dpr={[1, MAX_DEVICE_PIXEL_RATIO]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      className="!absolute !inset-0"
      // The shader itself is decorative background — hide the raw canvas
      // element from assistive tech, real content is announced separately.
      aria-hidden="true"
    >
      <ShaderPlane isPaused={isPaused} />
    </Canvas>
  );
}

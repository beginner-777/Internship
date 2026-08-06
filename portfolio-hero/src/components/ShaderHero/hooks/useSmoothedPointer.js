import { useEffect, useRef } from "react";

/**
 * Tracks pointer position in normalized [0,1] space (origin bottom-left,
 * matching GLSL convention) and exposes both the raw target and a
 * lazily-smoothed value via refs. Using refs (not React state) means
 * pointer movement never triggers a React re-render — the smoothing
 * itself happens once per frame inside the R3F render loop.
 */
export function useSmoothedPointer() {
  // .target = where the pointer currently is (updated on events)
  // .smoothed = eased position consumed by the shader each frame
  const pointer = useRef({
    target: { x: 0.5, y: 0.5 },
    smoothed: { x: 0.5, y: 0.5 },
    isActive: false,
  });

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = event.clientX / window.innerWidth;
      // Flip Y: DOM origin is top-left, shader/UV origin is bottom-left
      const y = 1.0 - event.clientY / window.innerHeight;
      pointer.current.target.x = x;
      pointer.current.target.y = y;
      pointer.current.isActive = true;
    };

    const handlePointerLeave = () => {
      pointer.current.isActive = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return pointer;
}

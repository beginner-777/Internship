"use client";

import { useEffect, useRef } from "react";

export function CursorAura() {
  const aura = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (aura.current) aura.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); };
  }, []);
  return <div ref={aura} className="cursor-aura" aria-hidden="true" />;
}

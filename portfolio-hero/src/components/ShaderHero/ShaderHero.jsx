import { useMemo } from "react";
import ShaderCanvas from "./ShaderCanvas.jsx";
import HeroOverlay from "./HeroOverlay.jsx";
import CanvasErrorBoundary from "./CanvasErrorBoundary.jsx";
import { useReducedMotion } from "./hooks/useReducedMotion.js";
import { usePageVisibility } from "./hooks/usePageVisibility.js";

/**
 * Fullscreen shader hero section.
 *
 * Composition:
 *  - CanvasErrorBoundary  -> guards against WebGL failures
 *    - ShaderCanvas       -> R3F canvas rendering the fragment shader
 *  - a fixed dark radial scrim -> guarantees text contrast over any
 *    part of the shader, independent of what the animation is doing
 *  - HeroOverlay           -> headline, subheading, CTAs
 *
 * The render loop is paused (not unmounted) whenever the tab is hidden
 * or the user prefers reduced motion, so re-enabling it never causes a
 * jarring re-initialization.
 */
export default function ShaderHero() {
  const prefersReducedMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();

  const isPaused = useMemo(
    () => prefersReducedMotion || !isPageVisible,
    [prefersReducedMotion, isPageVisible]
  );

  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-carbon-950"
      aria-label="Introduction"
    >
      <CanvasErrorBoundary>
        <ShaderCanvas isPaused={isPaused} />
      </CanvasErrorBoundary>

      {/* Contrast scrim: a static (non-shader) dark radial gradient that
          sits between the canvas and the text, so copy stays readable
          regardless of how bright the aurora gets underneath it. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 46%, rgba(4,5,10,0.55) 0%, rgba(4,5,10,0.15) 55%, rgba(4,5,10,0.65) 100%)",
        }}
        aria-hidden="true"
      />

      <HeroOverlay />

      {/* Screen-reader-only status so reduced-motion users aren't left
          guessing why the background looks frozen. */}
      {prefersReducedMotion && (
        <span className="sr-only">
          Background animation paused to respect your reduced motion
          preference.
        </span>
      )}
    </section>
  );
}

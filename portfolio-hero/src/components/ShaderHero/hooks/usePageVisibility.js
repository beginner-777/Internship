import { useEffect, useState } from "react";

/**
 * Tracks document.visibilityState so the render loop can be paused
 * whenever the browser tab is backgrounded — saves battery/GPU on
 * laptops and avoids the "tab audio/animation ran forever" problem.
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible"
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible;
}

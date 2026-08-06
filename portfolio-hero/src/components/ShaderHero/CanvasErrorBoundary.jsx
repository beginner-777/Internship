import { Component } from "react";
import ShaderFallback from "./ShaderFallback.jsx";

/**
 * Class component is required here — React error boundaries can only be
 * implemented with `componentDidCatch` (no hook equivalent exists).
 * Catches WebGL context creation failures so a graphics error never
 * blanks out the entire hero/page.
 */
export default class CanvasErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // In production this would report to an error-tracking service.
    console.warn("Shader canvas failed to initialize, using fallback.", error);
  }

  render() {
    if (this.state.hasError) {
      return <ShaderFallback />;
    }
    return this.props.children;
  }
}

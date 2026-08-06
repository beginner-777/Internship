/**
 * Mutable bridge exposing renderer stats (fps, draw calls, triangles,
 * textures, geometries) from inside the Canvas to the dev-only
 * PerformanceHUD overlay outside it.
 */
export const rendererStatsBridge = {
  fps: 0,
  drawCalls: 0,
  triangles: 0,
  textures: 0,
  geometries: 0,
};

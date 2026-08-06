/**
 * A tiny mutable bridge for sharing the live camera position from inside
 * the R3F <Canvas> tree with the 2D MiniMap overlay that lives outside it.
 * Deliberately not React state — updating on every frame would otherwise
 * force a re-render of the whole overlay 60x/sec.
 */
export const cameraPositionBridge = { x: 18, z: 18 };

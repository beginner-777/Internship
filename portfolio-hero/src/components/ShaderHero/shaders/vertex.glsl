// vertex.glsl
//
// This vertex shader runs once per vertex of the fullscreen plane
// (only 4 vertices — it's a single quad covering the viewport).
// Its only job is to forward the built-in `uv` attribute to the
// fragment shader and project the vertex position to clip space.
// All of the actual visual work happens per-pixel in the fragment
// shader, so this stage stays intentionally minimal for performance.

varying vec2 vUv;

void main() {
  vUv = uv;

  // Standard MVP transform: model space -> world space -> camera space -> clip space
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

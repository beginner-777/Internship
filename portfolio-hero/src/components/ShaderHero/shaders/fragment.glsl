// fragment.glsl — "Cosmic Carbon"
//
// Original procedural hero background: a domain-warped aurora flow field
// layered with a sparse "neural node" particle grid and thin light
// streaks, lit by a mouse-reactive volumetric glow, finished with a
// vignette, gamma correction and animated film grain.
//
// No textures. Every pixel value is computed from `vUv`, `u_time` and
// `u_mouse` using noise + math only.

precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;         // smoothed, normalized [0,1], origin bottom-left
uniform float u_mouseStrength; // fades 0 -> 1 when the pointer is active/on-screen

// ---------------------------------------------------------------------
// 1. HASH + NOISE PRIMITIVES
// ---------------------------------------------------------------------
// A single 2D -> 1D hash function underlies both the smooth flow-field
// noise and the particle grid, so the whole scene shares one procedural
// "fingerprint" instead of stitching together unrelated random sources.

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Value noise: bilinear-interpolate hashed corners of the unit cell,
// smoothed with a quintic curve so gradients don't show grid seams.
float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 fade = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));

  return mix(mix(a, b, fade.x), mix(c, d, fade.x), fade.y);
}

// Fractional Brownian Motion: stacks several octaves of the noise above
// at increasing frequency / decreasing amplitude, producing the soft,
// cloud-like organic detail aurora and nebula shaders are built from.
// Fixed 5-octave unroll (no dynamic loop) keeps the cost predictable.
float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8); // slight rotation per octave avoids axis-aligned artifacts

  for (int i = 0; i < 5; i++) {
    sum += amplitude * valueNoise(p);
    p = rot * p * 2.02;
    amplitude *= 0.5;
  }
  return sum;
}

// ---------------------------------------------------------------------
// 2. NEURAL NODE PARTICLE FIELD
// ---------------------------------------------------------------------
// A cheap procedural "point cloud": the plane is divided into cells,
// each cell gets one jittered point, and points softly glow with an
// independent, hashed pulse frequency — reads as scattered neural
// activity rather than a static dot grid.

float neuralNodes(vec2 p, float time) {
  float glow = 0.0;
  vec2 cellId = floor(p);

  // 3x3 neighbor search so points near cell borders still contribute —
  // fixed 9 iterations regardless of resolution, so cost is constant.
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 cell = cellId + neighbor;

      vec2 jitter = vec2(hash21(cell), hash21(cell + 19.19));
      vec2 nodePos = cell + jitter;

      float pulseSeed = hash21(cell + 7.7);
      float pulse = 0.5 + 0.5 * sin(time * (0.6 + pulseSeed * 0.8) + pulseSeed * 6.283);

      float dist = length(p - nodePos);
      float node = smoothstep(0.05, 0.0, dist) * pulse;
      glow += node;
    }
  }
  return glow;
}

// ---------------------------------------------------------------------
// 3. MAIN
// ---------------------------------------------------------------------
void main() {
  vec2 resolution = u_resolution;
  float aspect = resolution.x / resolution.y;

  // Aspect-corrected, centered coordinates: origin at screen center,
  // x stretched by aspect ratio so circles stay circular on any viewport.
  vec2 uv = vUv - 0.5;
  uv.x *= aspect;

  vec2 mouse = u_mouse - 0.5;
  mouse.x *= aspect;

  // -- Mouse-driven field bend --------------------------------------
  // Rather than snapping the flow toward the cursor, we push coordinates
  // *away* from it with an inverse-square falloff, like the field is
  // deflecting around a soft object. Subtle by design (small max offset).
  vec2 toMouse = uv - mouse;
  float mouseDist = length(toMouse) + 0.0001;
  float mouseInfluence = u_mouseStrength * smoothstep(0.9, 0.0, mouseDist);
  vec2 bend = normalize(toMouse) * mouseInfluence * 0.12;

  // -- Flow field via two-layer domain warp ---------------------------
  // Warping the *input* to fbm with another fbm is what gives the field
  // its organic, aurora-like curl instead of looking like plain noise.
  float slowTime = u_time * 0.045;
  vec2 warpCoord = uv * 1.4 + bend;

  vec2 warpA = vec2(
    fbm(warpCoord + vec2(0.0, slowTime)),
    fbm(warpCoord + vec2(5.2, -slowTime))
  );

  vec2 warpB = warpCoord + warpA * 0.7 + vec2(slowTime * 0.6, slowTime * -0.3);
  float flow = fbm(warpB * 1.6);

  // -- Thin procedural light streaks -----------------------------------
  // Ridged noise (folding the signal around 0.5) turns smooth fbm into
  // thin bright filaments — read as light streaks / neural connections.
  float ridge = 1.0 - abs(fbm(warpB * 3.1 + vec2(slowTime * 0.4, 0.0)) - 0.5) * 2.0;
  float streaks = pow(clamp(ridge, 0.0, 1.0), 6.0) * 0.6;

  // -- Color grading -----------------------------------------------------
  // Cosmic Carbon palette: near-black base, muted cyan -> indigo -> violet
  // aurora. Two mix() stages walk the gradient instead of a hard blend.
  vec3 colorBase   = vec3(0.016, 0.020, 0.035);
  vec3 colorCyan   = vec3(0.373, 0.816, 0.769);
  vec3 colorIndigo = vec3(0.424, 0.482, 0.941);
  vec3 colorViolet = vec3(0.561, 0.424, 0.851);

  vec3 aurora = mix(colorCyan, colorIndigo, smoothstep(0.15, 0.65, flow));
  aurora = mix(aurora, colorViolet, smoothstep(0.55, 0.95, flow));

  float auroraMask = smoothstep(0.2, 0.85, flow);
  vec3 color = mix(colorBase, aurora, auroraMask * 0.85);
  color += streaks * mix(colorCyan, colorViolet, flow) * 0.5;

  // -- Neural node particle layer --------------------------------------
  vec2 nodeSpace = (uv + 0.5 * vec2(aspect, 1.0)) * 6.0;
  float nodes = neuralNodes(nodeSpace, u_time * 0.5);
  color += nodes * vec3(0.75, 0.92, 0.95) * 0.35;

  // -- Volumetric mouse glow -------------------------------------------
  // Soft radial falloff centered on the cursor, additive so it lifts the
  // field locally without ever washing out to flat white.
  float cursorGlow = u_mouseStrength * exp(-mouseDist * mouseDist * 9.0);
  color += cursorGlow * vec3(0.55, 0.75, 0.95) * 0.55;

  // -- Ambient center glow (keeps the composition anchored, cinematic) --
  float centerGlow = exp(-dot(uv, uv) * 1.1) * 0.18;
  color += centerGlow * vec3(0.4, 0.55, 0.75);

  // -- Vignette ----------------------------------------------------------
  float vignette = smoothstep(1.05, 0.25, length(uv));
  color *= mix(0.55, 1.0, vignette);

  // -- Film grain ----------------------------------------------------------
  // Per-pixel, time-varying hash so it dithers banding without leaving a
  // static dot pattern burned into the gradient.
  float grain = hash21(vUv * resolution + fract(u_time) * 97.0) - 0.5;
  color += grain * 0.025;

  // -- Gamma correction ----------------------------------------------------
  // We composited in roughly linear light; convert to display (sRGB-ish)
  // gamma so mid-tones don't look washed out on screen.
  color = pow(max(color, 0.0), vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}

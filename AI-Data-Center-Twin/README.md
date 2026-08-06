# AI Data Center — Digital Twin

An immersive, browser-based digital twin of a futuristic AI data center. Built with
React Three Fiber and Three.js, it renders an interactive GPU compute facility —
server racks, an animated AI core, fiber-optic network traffic, and cooling systems —
with real-time-style telemetry and cinematic camera choreography.

> Portfolio piece. Not connected to a real facility; all telemetry is simulated.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Performance Optimizations](#performance-optimizations)
- [FE-10 Performance Review](#fe-10-performance-review)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## Overview

The app has three phases, orchestrated by a single `appPhase` value in a Zustand store:

1. **Landing** — animated hero, particle field, glassmorphism CTA.
2. **Boot Sequence** — a cinematic, canvas-based "AI boot" animation (neural nodes,
   GPU LEDs, terminal log, staged progress bar) that plays while the R3F scene chunk
   is lazily fetched in the background.
3. **Scene** — the 3D digital twin itself, lazy-loaded via `React.lazy` + `Suspense`,
   with a full glass-UI control layer on top (control panel, dashboard, mini-map,
   AI assistant hologram, camera presets, dev performance HUD).

## Features

**Core (required)**
- Real interactive 3D environment rendered with React Three Fiber
- Multiple clickable objects: 40 server racks + the central AI Core
- Hover states with glow, wireframe outline, and floating tooltips
- Material changes (heatmap recoloring, emissive LED states, selection highlight)
- Camera transitions via GSAP (intro fly-through, click-to-focus, double-click focus,
  preset views) layered on top of damped `OrbitControls`
- Interactive lighting that reacts to day/night and the active AI workload mode
- Lazy-loaded Canvas behind `React.lazy` + a custom `Suspense` fallback
- Cinematic AI boot sequence (not a spinner) with staged log lines and a progress bar
- Low-poly, primitive-based geometry with no external 3D model payload
- Responsive mobile layout with touch gestures (`OrbitControls` touch mapping,
  `touch-action: none` on canvas), compact phone controls, a bottom-sheet dashboard,
  dynamic viewport sizing, and a mobile-first Low graphics profile
- Static WebGL-unavailable fallback page
- `prefers-reduced-motion` support throughout (boot canvas, particle field, camera intro)

**Interactive systems**
- 6 AI workload modes (Idle, Training, Inference, Fine-Tuning, Maintenance, Emergency),
  each driving lighting, LED color, particle speed, cable-packet density, and heat
- Thermal heatmap mode (blue → green → yellow → orange → red, per rack)
- Animated network visualization: glowing packets flowing along tube-geometry cables
  from racks to the AI Core, with speed/density tied to workload mode
- Cooling system: rotating fans, glowing coolant pipes, on/off toggle with visual feedback
- Floating glass control panel: day/night, heatmap, cooling, network viz, auto-rotate,
  emergency mode, graphics quality (low/medium/high)

**Bonus**
- Interactive mini-map with rack zones, AI Core marker, and live camera position
- AI holographic assistant that explains whatever you last clicked
- Live "analytics" dashboard per rack/core with animated sparkline telemetry
  (GPU, CPU, temperature, network) that updates continuously
- Cinematic camera presets for portfolio screenshots (Top / Side / AI Core Close-up /
  Entire Facility / Presentation)
- Dev-only performance HUD (FPS, draw calls, triangles, textures, geometries)

## Tech Stack

| Purpose | Library |
|---|---|
| UI framework | React 18.3 |
| Build tool | Vite |
| 3D renderer | React Three Fiber + Three.js |
| 3D helpers | @react-three/drei (OrbitControls, Float, Html, Environment, MeshReflectorMaterial, SoftShadows) |
| Post-processing | @react-three/postprocessing (Bloom, ChromaticAberration, Vignette) |
| Styling | Tailwind CSS |
| UI motion | Framer Motion |
| Camera/cinematic motion | GSAP |
| State | Zustand |
| Icons | react-icons |
| Dev-time 3D tuning | Leva (not wired into the default UI — available for iteration) |

## Installation

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

Requires Node 18+.

## Folder Structure

```
src/
  components/
    boot/          Cinematic AI boot sequence + its canvas backdrop
    landing/        Landing page + ambient particle field
    scene/           R3F Canvas root, camera rig, AI Core, server racks,
                     network cables, cooling system, stats sampler
    environment/    Floor, facility lighting, ceiling structure
    ui/              All 2D glass-UI overlays (control panel, dashboard,
                     mini-map, assistant hologram, camera presets, HUD)
    fallback/       Static WebGL-unavailable page
  hooks/            useReducedMotion, useWebGL, useMediaQuery, useLiveMetric
  store/            Zustand global store (workload modes, toggles, selection,
                     camera-move requests)
  utils/            Lightweight cross-boundary bridges (camera position,
                     renderer stats) for syncing 2D overlays with the Canvas
                     without forcing per-frame React re-renders
```

## Performance Optimizations

- **Code splitting**: the entire 3D experience is behind `React.lazy`; the landing
  page and boot sequence never pay for the Three.js bundle.
- **Manual chunking**: Vite splits `three`/`three-stdlib` and the `@react-three/*`
  packages into their own cacheable chunks, separate from the React/UI vendor bundle.
- **Adaptive DPR**: `<AdaptiveDpr>` and a `dpr` range tied to the selected graphics
  quality (0.75–2×) keep pixel fill-rate in check on lower-end/high-DPI devices.
- **Adaptive events**: `<AdaptiveEvents>` throttles pointer raycasting under load.
- **Selective post-processing**: Bloom/Chromatic Aberration/Vignette are skipped
  entirely at "low" quality, and multisampling is reduced at "medium".
- **Low-poly, primitive-first geometry**: racks, cores, and cooling units are built
  from simple boxes, icosahedra, and tori rather than imported dense meshes. The
  current build therefore has no `.glb`, DRACO, Meshopt, or texture payload to load.
- **Cheap 2D canvases for ambient effects**: the boot sequence and landing-page
  particle field use plain 2D `<canvas>` animations instead of spinning up WebGL
  before the user has even entered the twin.
- **No React state in per-frame updates**: camera position (for the mini-map) and
  renderer stats (for the HUD) are written to plain mutable objects each frame and
  polled via `requestAnimationFrame` outside React, avoiding 60fps re-renders of the
  UI tree.
- **Deterministic seeded telemetry**: per-rack "random" metrics are seeded by rack ID
  so values are stable across re-renders instead of recomputing noise every frame.
- **Reduced-motion short-circuits**: animation loops (boot canvas, particle field,
  camera intro, network packets) check `prefers-reduced-motion` and skip continuous
  `requestAnimationFrame` work entirely when it's set.
- **Sampled network graph**: only every third rack is wired into the cable/packet
  system, keeping tube-geometry and packet counts bounded regardless of facility size.

Suggested next steps if you profile a bottleneck: convert the 40 server racks to a
single `InstancedMesh` (they already share geometry/material per LOD tier), and swap
the reflective floor's `MeshReflectorMaterial` for a cheaper static reflection at
"medium"/"low" quality.

## FE-10 Performance Review

The production build was reviewed once through the FE-10 load and frame-rate lens.

### Load impact

The verified Vite production build produces approximately **1.62 MB of JavaScript
before compression and 499 KB gzip**, plus approximately **20.4 KB of CSS (4.8 KB
gzip)**. The application does not download an external 3D model or texture pack.
The largest code cost is Three.js and the React Three Fiber runtime.

That cost is kept out of the landing page's initial interaction path: the complete
3D experience is loaded through `React.lazy` only after the user enters the digital
twin. Vite also separates Three.js, React Three Fiber, and the scene into cacheable
chunks.

### Frame-rate impact

Frame rate depends on the device and selected graphics profile. **High** quality is
the most expensive because it enables a 1024 px reflected-floor pass, 2048 px
shadows, bloom, chromatic aberration, vignette, multisampling, and a DPR of up to 2.
**Medium** reduces multisampling and DPR. **Low** caps DPR at 1, disables realtime
shadows and the post-processing stack, and is selected automatically for phones and
coarse-pointer devices. Users can still raise the quality manually from the control
panel.

The development-only performance HUD exposes FPS, draw calls, triangles, textures,
and geometries so the effect of each profile can be checked directly. The practical
acceptance target is a stable **30 FPS or better on mobile** and **50–60 FPS on a
typical desktop** in the production build. If a tested device falls below 30 FPS,
Low quality is the automatic mobile mitigation.

### FE-10 conclusion

**Pass for the assignment scope, with High quality treated as an optional desktop
mode.** The scene is lazy-loaded, has zero model payload, provides adaptive DPR and
lower-cost graphics profiles, respects reduced-motion preferences, supports touch,
and falls back to a static overview when WebGL is unavailable. The main remaining
optimization for a larger facility would be converting the 40 repeated rack shells
to `InstancedMesh`.

## Accessibility

- `prefers-reduced-motion` disables/shortens the boot animation, particle field,
  camera fly-through, and network packet animation.
- All interactive controls are real `<button>` elements with `aria-pressed`/
  `aria-expanded`/`aria-label` where appropriate, and a visible `:focus-visible` ring.
- The boot sequence exposes `role="status"` / `aria-live="polite"` with a text
  description of the current stage and percentage.
- `prefers-contrast: more` swaps glass panels for higher-contrast solid panels.
- Static WebGL fallback page ensures the app degrades gracefully instead of crashing
  when WebGL isn't available.

## Deployment

This is a static Vite build — deploy `dist/` to any static host:

```bash
npm run build
# then upload dist/ to Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc.
```

No environment variables or backend are required; all data is simulated client-side.

## Future Improvements

- Replace primitive geometry with real DRACO-compressed `.glb` rack/core models
- Instance server racks via `InstancedMesh` for large-scale facilities (100+ racks)
- WebSocket-driven telemetry instead of simulated sparkline drift
- Ambient audio layer (server hum, fans, electrical buzz) with a mute toggle
- Guided tour mode that scripts the camera through a full facility walkthrough
- Persisted user preferences (quality, reduced motion override, last workload mode)

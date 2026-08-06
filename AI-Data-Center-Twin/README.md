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
npm run dev       # build + serve the optimized production app at localhost:5173
npm start         # same production/Lighthouse command as npm run dev
npm run dev:source # source/HMR development only; never audit this server
npm run build     # production build → dist/
```

Requires Node 18+.

## Lighthouse Test — Important

The optimized package intentionally maps both `npm run dev` and `npm start` to the
same minified production build. Raw Vite/HMR development mode was moved to
`npm run dev:source` so the most common command cannot accidentally produce a bad
Lighthouse result.

Use this exact procedure:

```bash
# Extract this version into a NEW folder.
# Stop every old localhost:5173 terminal first with Ctrl+C, then:
npm install
npm run dev
```

The terminal must say **`Production build ready at http://localhost:5173`**. If it
instead shows the Vite banner and **`Local: http://localhost:5173`**, an old project
folder or old server is still running and must not be audited.

Open `http://localhost:5173` in an Incognito window, then select **Lighthouse →
Mobile → Navigation → Analyze page load**. Keep the page on the landing screen while
the audit runs. The custom server sends the minified `dist` build with Brotli/gzip
compression and long-lived cache headers for hashed assets.

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

- **True route-phase code splitting**: the boot sequence, WebGL fallback, complete
  3D experience, scene overlay, mini-map, dashboard, assistant, and production-only
  graphics effects each have explicit `React.lazy` boundaries. The attached project
  is Vite-based, so `React.lazy(() => import(...))` is the direct equivalent of a
  client-only `next/dynamic` boundary here.
- **No accidental Three.js preload**: Vite's preload helper and the React/UI runtime
  are explicitly assigned to `ui-vendor`. This prevents Rollup from placing shared
  runtime code in the R3F chunk and adding `three`/`r3f` module-preload tags to the
  landing page.
- **Intent-based loading**: the small boot chunk is warmed on CTA hover/focus/press.
  Once the user enters the boot sequence, the 3D scene begins loading during idle time
  so the cinematic boot masks its network and parse cost.
- **Mobile-only savings**: phones start in Low quality and do not download the
  post-processing chunk. The mini-map, which is visually hidden below 640 px, is no
  longer mounted or updated on mobile.
- **Optional widget splitting**: dashboard and assistant code is fetched only after
  an object selection/message makes each panel relevant. Once fetched, each remains
  mounted so its original exit animation is preserved.
- **Non-blocking styles and fonts**: the small generated Tailwind stylesheet is
  inlined into the production HTML, removing its render-blocking request. Inter,
  Orbitron, and JetBrains Mono retain the same variable-font appearance but are now
  self-hosted, subset by Unicode range, and the two landing-page Latin fonts are
  preloaded from the same origin. No Google Fonts request sits on the paint path.
- **No motion library on first paint**: the landing, boot, loader, and scene-entry
  transitions use matching CSS keyframes, keeping Framer Motion out of the initial
  bundle. The interactive scene overlay still uses `LazyMotion` + `m` with
  `domAnimation`, loaded only after the user enters the 3D experience.
- **Cheaper boot updates**: the progress bar and percentage update through DOM refs
  and a transform rather than causing a full React tree render on every animation
  frame. React state now changes only when the visible boot stage changes.
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

The original production HTML preloaded `three` and `r3f` on the landing page despite
the scene component using `React.lazy`. That made the initial JavaScript path about
**1,516 KB raw / 461 KB gzip**, excluding CSS.

The optimized production HTML now requests only the app entry and UI vendor chunks:
approximately **171 KB raw / 55 KB gzip**. This is an **89% raw / 88% gzip reduction
in initial JavaScript**. Three.js, React Three Fiber, GSAP, scene code, and optional
panels are absent from the first-page request graph. Framer Motion is also absent
until the 3D overlay is requested.

The previous external **20.4 KB CSS** asset is now inlined into the HTML, so there is
no render-blocking local stylesheet request. The exact Inter, Orbitron, and JetBrains
Mono variable fonts are self-hosted; the landing fonts are preloaded locally, with no
third-party font connection. The application still has no external 3D model or
texture payload.

Post-processing is a separate **69.9 KB raw / 17.0 KB gzip** chunk and is not fetched
for the default mobile Low-quality profile. Dashboard, assistant, and mini-map are
independent chunks of roughly 1.5–4.3 KB each and load only when visible or required.

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
mode.** The verified request graph now keeps the complete Three.js/R3F stack off the
landing page, removes local render-blocking CSS, defers optional UI/effects, provides
adaptive DPR and lower-cost graphics profiles, respects reduced-motion preferences,
supports touch, and preserves the static WebGL fallback. Lighthouse varies by host,
cache, CPU, and font-network conditions, so run the final production URL in an
incognito mobile Lighthouse session before recording a score. The main remaining
scaling optimization for a much larger facility would be converting repeated rack
geometry to `InstancedMesh`.

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

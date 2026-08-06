# Performance Optimization Notes

## Architecture note

This repository is a React 18 + Vite application, not a Next.js application.
For this codebase, `React.lazy(() => import(...))` plus `<Suspense>` is the clean
equivalent of `next/dynamic`. Adding `next/dynamic` here would require a framework
migration and would not compile under Vite.

## Changes implemented

### 1. Initial render path

- `src/App.jsx` keeps only the landing screen in the eager app bundle.
- `BootSequence`, `WebGLFallback`, and `DataCenterExperience` are separate dynamic
  chunks.
- The CTA warms the small boot chunk on pointer hover/down or keyboard focus.
- The scene begins loading only after the user enters the boot sequence.

### 2. Three.js and R3F isolation

- `vite.config.js` explicitly separates `ui-vendor`, `three`, `r3f`, `gsap`, and
  `postprocessing`.
- Vite's preload helper stays in `ui-vendor`. This detail is important: if it is
  placed in the R3F chunk, the generated HTML preloads Three.js even though the
  scene component uses a dynamic import.
- The final production HTML contains no initial `modulepreload` link for `three`
  or `r3f`.

### 3. Conditional scene code

- `src/components/scene/SceneEffects.jsx` owns the post-processing stack and loads
  only when quality is Medium or High.
- Low quality remains the automatic mobile default, so mobile does not download
  Bloom, Chromatic Aberration, Vignette, or Soft Shadows.
- `src/components/ui/SceneOverlay.jsx` defers the dashboard and assistant until
  their store state makes them visible.
- The mini-map is imported and mounted only at 640 px and above; its camera polling
  loop no longer runs behind `display: none` on phones.
- Development-only stats components are removed from the production request graph.

### 4. Render-blocking resources

- The generated Tailwind CSS is approximately 20 KB and is inlined at build time by
  the `inline-entry-css` Vite plugin. There is no local blocking stylesheet request.
- Inter, Orbitron, and JetBrains Mono retain the original variable-font appearance
  but are self-hosted. The landing page's Latin Inter and Orbitron files are
  preloaded from the same origin, removing Google Fonts DNS, TLS, and stylesheet
  latency from FCP/LCP.
- The app entry is a module script, which is deferred by browser semantics.

### 5. JavaScript execution cost

- Landing, boot, loading, and scene-entry motion use equivalent CSS keyframes, so
  Framer Motion is absent from the initial request graph.
- The interactive 3D overlay retains Framer Motion through `LazyMotion`,
  `domAnimation`, and `m`, loaded only after scene entry.
- The boot percentage and bar transform update through refs instead of re-rendering
  the complete React boot screen every animation frame.

## Verified production comparison

| Initial page resource | Original | Optimized |
| --- | ---: | ---: |
| Initial JavaScript, raw | ~1,516 KB | ~171 KB |
| Initial JavaScript, gzip | ~461 KB | ~55 KB |
| Three.js/R3F loaded before click | Yes | No |
| Framer Motion loaded before click | Yes | No |
| Blocking local CSS request | 20.4 KB | None |

The production build and static request-graph smoke test pass. A 90+ Lighthouse
score is the production target, but the exact score still depends on the test
machine, CPU throttling, browser extensions, and hosting latency.

## If this project is later migrated to Next.js

Use this client-only boundary in the relevant App Router client component:

```jsx
'use client';

import dynamic from 'next/dynamic';
import SceneLoader from '@/components/scene/SceneLoader';

const DataCenterExperience = dynamic(
  () => import('@/components/scene/DataCenterExperience'),
  {
    ssr: false,
    loading: () => <SceneLoader />,
  }
);
```

Keep `three`, `@react-three/fiber`, `@react-three/drei`, and
`@react-three/postprocessing` imports below that client-only boundary. Do not import
them from a server component, root layout, global provider, or eagerly rendered UI
shell.

## Verification commands

```bash
npm ci
npm run dev
```

Both `npm run dev` and `npm start` build and serve the same minified production app.
Raw Vite/HMR development mode is deliberately named `npm run dev:source` and must
not be audited. Before testing, stop any old server on port 5173. The terminal must
show `Production build ready at http://localhost:5173`, not Vite's `Local:` banner.

In the generated `dist/index.html`, the only initial module preload should be the UI
vendor chunk. Three.js, R3F, and Framer Motion should appear only in dependency maps
for dynamic imports.

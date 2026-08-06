# Frontend AI Engineer — Shader Hero

A production-ready, fullscreen fragment-shader hero section built with
React, React Three Fiber, and Tailwind CSS. Theme: **Cosmic Carbon** —
a deep-black, aurora-like neural energy field that reacts subtly to the
cursor.

## Stack

- React 18 + Vite
- @react-three/fiber (Three.js)
- Custom GLSL vertex + fragment shaders (`vite-plugin-glsl`)
- Tailwind CSS

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# -> open http://localhost:5173

# 3. Production build
npm run build

# 4. Preview the production build locally
npm run preview
```

Requires Node.js 18+.

## Project structure

```
src/
  App.jsx                        # page shell, mounts the hero section
  index.css                      # Tailwind directives + base styles
  main.jsx                       # React entry point
  components/
    ShaderHero/
      ShaderHero.jsx              # orchestrates canvas + overlay + a11y
      ShaderCanvas.jsx            # R3F <Canvas>, fullscreen plane, uniforms
      HeroOverlay.jsx             # headline / subheading / CTAs
      ShaderFallback.jsx          # CSS fallback if WebGL is unavailable
      CanvasErrorBoundary.jsx     # catches WebGL init failures
      shaders/
        vertex.glsl               # passthrough vertex stage
        fragment.glsl             # the Cosmic Carbon shader itself
      hooks/
        useSmoothedPointer.js     # eased, normalized pointer position
        useReducedMotion.js       # prefers-reduced-motion
        usePageVisibility.js      # pauses render loop on hidden tabs
```

## Design notes

- **Palette / tokens** live in `tailwind.config.js` under `theme.extend.colors`
  (`carbon`, `aurora`, `mist`) — change these to re-skin the whole page.
- **Shader tuning** — flow speed, warp strength, streak sharpness, node
  density, and glow intensity are all named constants inline in
  `fragment.glsl`; each is commented where it appears.
- **Performance** — device pixel ratio is capped at `1.75`
  (`ShaderCanvas.jsx`), antialiasing is disabled (the grain layer already
  breaks up hard edges), and the render loop is paused entirely (not just
  slowed) when the tab is hidden or reduced motion is requested.
- **Accessibility** — the canvas is `aria-hidden`, focus rings are
  preserved on both CTAs, and a visually-hidden status string announces
  the paused state to screen reader users when reduced motion is active.

## Deploying

The app builds to static files (`npm run build` → `dist/`) and can be
deployed as-is to Vercel, Netlify, Cloudflare Pages, or any static host.
No server/runtime dependencies beyond serving static assets.

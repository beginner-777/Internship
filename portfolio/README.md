# Musfirah — Portfolio

A modern, responsive personal portfolio built with React, Vite, Tailwind CSS,
and React Three Fiber.

## Stack

- **React 18** + **Vite** — fast dev server and build
- **Tailwind CSS** — utility-first styling, dark mode by default
- **@react-three/fiber** + **@react-three/drei** — the interactive 3D
  icosahedron in the hero (auto-rotates, drag to orbit, distorts gently)
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

```
index.html
src/
  main.jsx      — React entry point
  App.jsx       — Navbar, Hero (3D scene), Projects, About, Contact, Footer
  index.css     — Tailwind directives + base styles
tailwind.config.js
postcss.config.js
vite.config.js
```

## Customizing

- Edit the `projects` array and `skills` array at the top of `src/App.jsx`
  to swap in your own work and stack.
- The hero's 3D shape lives in the `HeroShape` component — swap
  `icosahedronGeometry` for any other Three.js geometry, or adjust
  `distort`/`speed` on `MeshDistortMaterial` for a different feel.
- Colors and fonts are defined in `tailwind.config.js` under `theme.extend`.

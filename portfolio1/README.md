# Musfirah — Portfolio

A modern, responsive personal portfolio built with React, Vite, Tailwind CSS,
and React Three Fiber.

## Stack

- **React 18** + **Vite** — fast dev server and build
- **Tailwind CSS** — utility-first styling, warm dark theme by default
- **three.js** (plain, no React wrapper) — the hero's 3D character: a
  stylized avatar holding a phone, whose head tracks the cursor
- **lucide-react** — icons, including the floating skill badges around
  the hero character

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
- The hero's 3D character lives in the `Character` component — it's built
  from plain Three.js primitives, so proportions/colors can be tweaked
  directly in the mesh definitions.
- The floating skill badges and lightning accent are plain SVG/CSS inside
  `Hero`, easy to swap for your own icon set.
- Colors and fonts are defined in `tailwind.config.js` under `theme.extend`
  (`accent` = orange, `ink` = the warm near-black background family).

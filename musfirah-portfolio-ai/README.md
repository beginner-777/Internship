# Musfirah.OS — AI-powered frontend portfolio

A production-ready, multi-route portfolio designed as an intelligent operating system rather than a conventional scrolling résumé.

## Experience highlights

- Reference-inspired particle-ring boot sequence on every browser refresh with a seamless home transition
- Single Midnight Navy visual system with a flash-free cinematic startup
- Compact React Three Fiber frontend workstation with a visible keyboard, responsive-device companion and code-to-preview development screen
- Purposeful hover motion for navigation, system and assistant icons
- Six React Router v6 routes: Command, Identity, Work, AI Lab, Resume and Contact
- Structured-data portfolio assistant with deterministic, resume-grounded answers
- Interactive paid-project showcase and responsive interface lab
- Framer Motion route transitions and micro-interactions
- Tailwind CSS v4 design pipeline plus a custom Midnight Navy and Warm Sand token system
- Keyboard navigation, semantic landmarks, reduced-motion handling and touch layouts
- Lazy-loaded routes and a dedicated Three.js bundle chunk

## Run locally

```bash
npm install
npm run dev
```

Open the exact local URL printed by Vite. For a clean replacement of an earlier copy, extract this ZIP into a new folder before running the commands so cached source files are not reused.

The homepage automatically switches to a CSS-rendered engineering laptop when an embedded browser does not expose WebGL. Storage access is also guarded, so VS Code preview panes and privacy-restricted browsers cannot collapse the interface into a blank page.

Create the optimized production build:

```bash
npm run build
npm run preview
```

## Content source

Portfolio facts are centralized in `src/data/portfolioData.js` and reflect the attached professional resume. The assistant retrieval logic is in `src/utils/assistantEngine.js`.

## Stack

React 19, Vite 8, React Router v6, Tailwind CSS 4, Framer Motion, React Three Fiber, Three.js, Drei and Lucide React.

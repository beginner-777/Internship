# Musfirah.OS — AI-powered frontend portfolio

A production-ready, multi-route portfolio designed as an intelligent operating system rather than a conventional scrolling résumé.

## Experience highlights

- Reference-inspired particle-ring boot sequence on every browser refresh with a seamless home transition
- Midnight Intelligence visual system with a flash-free cinematic startup
- Compact React Three Fiber frontend workstation with a visible keyboard, responsive-device companion and code-to-preview development screen
- Purposeful hover motion for navigation, system and assistant icons
- Six React Router v6 routes: Command, Identity, Work, AI Lab, Resume and Contact
- Live Gemini Interactions API assistant constrained to structured, resume-grounded portfolio data
- Graceful deterministic fallback when the live API is unavailable
- Interactive paid-project showcase and responsive interface lab
- Framer Motion route transitions and micro-interactions
- Tailwind CSS v4 design pipeline plus a Midnight Navy, Deep Slate, Warm Ivory, Muted Periwinkle and Refined Amber token system
- Keyboard navigation, semantic landmarks, reduced-motion handling and touch layouts
- Lazy-loaded routes and a dedicated Three.js bundle chunk

## Run locally

Install the project dependencies:

```bash
npm install
npm run dev
```

`npm run dev` starts the frontend and uses the verified local assistant fallback. To test the real serverless AI endpoint locally, create `.env.local` from `.env.example`, add your Gemini API key from Google AI Studio, and run the project through the Vercel development runtime:

```env
GEMINI_API_KEY=your_server_side_key
GEMINI_MODEL=gemini-3.6-flash
```

```bash
npx vercel dev
```

Never use a `VITE_` prefix for the API key and never place the key in React source code. The browser calls `/api/assistant`; only the serverless function communicates with Gemini.

Open the exact local URL printed by the selected development command. For a clean replacement of an earlier copy, extract this ZIP into a new folder before running the commands so cached source files are not reused.

The homepage automatically switches to a CSS-rendered engineering laptop when an embedded browser does not expose WebGL. Storage access is also guarded, so VS Code preview panes and privacy-restricted browsers cannot collapse the interface into a blank page.

Create the optimized production build:

```bash
npm run build
npm run preview
```

## Content source

Portfolio facts are centralized in `src/data/portfolioData.js` and reflect the attached professional resume. The live endpoint is `api/assistant.js`; it sends only a short conversation window and the verified portfolio dataset to the Gemini Interactions API with storage disabled. `src/utils/assistantEngine.js` provides the offline fallback.

## Deploy on Vercel

1. Import the project repository into Vercel.
2. Add `GEMINI_API_KEY` under Project Settings → Environment Variables for Production and Preview.
3. Optionally add `GEMINI_MODEL`; otherwise the endpoint uses `gemini-3.6-flash`.
4. Redeploy after adding the variables.

The API key is read only by the serverless function. If configuration, network access, or the upstream API fails, the chat remains usable through its verified deterministic fallback.

## Stack

React 19, Vite 8, React Router v6, Tailwind CSS 4, Framer Motion, React Three Fiber, Three.js, Drei and Lucide React.

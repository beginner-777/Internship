# Deployment checklist

## Before deployment

- Run typecheck, lint, unit/integration tests, coverage, production build, and available Playwright tests.
- Confirm `.env.local` and API keys are absent from source control.
- Confirm no client file imports `lib/gemini.ts` or reads `GEMINI_API_KEY`.
- Review CSP and security headers for any newly added external resource.
- Confirm the local fallback retains its exact non-AI label.

## Vercel configuration

- Framework preset: Next.js
- Build command: `npm run build`
- Server environment: `GEMINI_API_KEY`
- Server environment: `GEMINI_MODEL=gemini-3.6-flash`
- Do not create `NEXT_PUBLIC_GEMINI_API_KEY`.

## Smoke test

- `/api/health` returns `status: ok`.
- Landing CTA opens the workspace.
- Sample incident can be loaded.
- Missing-key deployment shows Demo Analysis.
- Keyed deployment shows Live Gemini analysis only after a valid response.
- Cancel returns to preserved evidence.
- Timeline filters, service selection, copy report, and print work.
- Refresh retains the latest investigation.
- Invalid localStorage is rejected.
- Reduced-motion and no-WebGL paths remain usable.
- 320px layout has no horizontal overflow.

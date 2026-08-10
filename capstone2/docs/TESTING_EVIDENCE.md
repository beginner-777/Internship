# Testing evidence

This file records commands that were actually executed for this project. Results are updated only from tool output; no values are estimated.

## Automated test scope

- Incident form schema validation and input limits
- Local secret detection and redaction
- Severity indicator accessibility
- Timeline severity and text filtering
- Root-cause hypothesis evidence and verification UI
- Gemini error retry and local fallback actions
- Rule-based local event extraction and labelling
- Versioned localStorage parsing and corruption rejection
- Reduced-motion preference logic
- Integration: sample input → mocked structured response → saved record → rendered dashboard
- Playwright: sample flow, critical filter, service selection, report copy, refresh persistence
- Axe: landing, workspace, and investigation routes

## Recorded results

- `npm run typecheck`: **passed**, zero TypeScript errors.
- `npm run lint`: **passed**, zero lint errors or warnings.
- `npm test`: **passed**, 5 files and 18 tests.
- `npm run test:coverage`: **passed**. Overall: 53.47% statements, 36.96% branches, 54.69% functions, and 58.87% lines. Components: 60.73% lines.
- `npm run build`: **passed** with Next.js 16.3.0 Turbopack; all four pages, not-found, and both API routes compiled. The restricted verification container required the included opt-in memory/network preload because its operating-system process files are unavailable. A normal deployment does not load this helper.
- Production smoke test: **passed**. `/`, `/workspace`, `/investigation`, `/methodology`, and `/api/health` returned 200; an unknown route returned 404; valid analysis input with no key returned a labelled `demo` result.
- Client bundle check: **passed**. Neither `GEMINI_API_KEY`, `gemini-3.6-flash`, `server-only`, nor `@google/genai` appeared in `.next/static`.
- `npm run test:e2e`: the 10 configured desktop/mobile tests were discovered, but browser execution was **not available**. The environment had no Playwright browser binary and its network policy returned empty browser archives when installation was attempted. No Playwright or axe pass result is claimed.

The Playwright and axe suites are complete and ready for a CI runner with Chromium installed.

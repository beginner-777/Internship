# Architecture

## Runtime boundaries

The browser owns presentation, form validation, local secret preflight, localStorage, filtering, report formatting, and the optional local analysis engine. The Next.js server route owns final validation, input sanitization, rate limiting, timeout enforcement, the Gemini credential, the Interactions API call, structured-output repair, and error normalization.

## Data flow

1. React Hook Form validates the incident with the shared Zod schema.
2. Secret-like patterns are detected locally; the user may redact or continue unchanged.
3. The browser posts `{ input }` to `/api/analyze` with an `AbortController` signal.
4. The route rate-limits the IP, removes dangerous control characters, and revalidates.
5. If no key is configured, the rule engine returns a labelled Demo Analysis.
6. Otherwise Gemini receives an untrusted evidence envelope and JSON Schema response format.
7. The server parses and validates the JSON. One fresh repair request is allowed.
8. A valid result is stored with a version, mode, timestamp, and original incident input.

## Domain schema

`IncidentAnalysis` is defined once in `lib/schemas.ts` and inferred into TypeScript. Confidence fields are constrained to 0–100. Arrays and strings have explicit upper bounds. Relationships reference service IDs by contract and are described in the model instruction.

## Rendering

The App Router provides dedicated landing, workspace, investigation, and methodology routes plus route loading states, a not-found route, and a global error boundary. Heavy 3D code is dynamically imported with server rendering disabled. Canvas DPR is capped at 1.5, animation pauses when hidden, reduced-motion uses demand rendering, low-power mobile can use CSS fallback, and R3F disposes declarative resources on unmount.

## Persistence

Only the editor draft and latest investigation are stored in browser localStorage. Stored investigation data is parsed with a versioned Zod schema before use. Invalid or corrupted records are rejected.

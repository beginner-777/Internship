# SYNAPSE SEO

> See what search engines see.

SYNAPSE SEO is a production-oriented FE2 capstone: a secure, single-page SEO audit platform that turns public page evidence into deterministic scores, issue explanations, an interactive 3D neural map, and an optional Google Gemini action plan.

## Features

- Real server-side website analysis; the browser never fetches the target directly
- Metadata, headings, visible word count, images, links, robots, sitemap, JSON-LD, mobile, response, HTTPS, and header signals
- Ten deterministic category scores and a documented weighted overall score
- Issues with severity, evidence, impact, and recommended fixes
- Interactive React Three Fiber SEO Neural Web driven by actual category scores
- Node hover, selection, focus transitions, orbit, zoom, pan, and camera reset
- Real Gemini structured-data request when `GEMINI_API_KEY` works
- Zod-validated AI response and explicitly labeled deterministic Demo Analysis fallback
- Cached audits to avoid repeat model calls
- Issues Explorer, action matrix, downloadable/printable report, sample audits, and About page
- Responsive layouts, reduced-motion support, keyboard focus states, semantic text alternatives

## Architecture

```text
Browser
  -> POST /api/audit
  -> input + rate validation
  -> URL normalization + DNS/private-address checks
  -> bounded server fetch with redirect validation
  -> HTML/robots/sitemap extraction
  -> deterministic checks + scoring
  -> compact structured audit JSON
  -> Gemini (optional)
  -> Zod response validation or honest Demo fallback
  -> dashboard + 3D neural web + report
```

The target website is fetched only by the Node.js route. `GEMINI_API_KEY` is referenced only from server code under `lib/ai/gemini.ts`.

## SEO methodology

The engine starts each category at 100 and subtracts documented, deterministic penalties when checks fail. Critical failures carry larger penalties than warnings. Category scores are clamped to 0–100.

Overall score weights:

| Category | Weight |
|---|---:|
| Technical SEO | 14% |
| Content | 12% |
| Metadata | 14% |
| Links | 8% |
| Performance | 12% |
| Indexability | 14% |
| Accessibility | 8% |
| Mobile SEO | 7% |
| Structured Data | 5% |
| Security | 6% |

Examples: a missing title removes 48 metadata points; a page-level indexing block removes 70 indexability points; missing viewport removes 50 mobile points. The exact checks and deductions are in `lib/scoring/score.ts`.

The performance category deliberately uses only HTML response timing and transfer size. It does not claim Lighthouse, CrUX, or Core Web Vitals measurements.

## Gemini AI integration

The official `@google/genai` SDK calls `gemini-2.5-flash` after the local audit is complete. Gemini receives compact structured signals and failed checks—not unlimited raw HTML. It is instructed to return JSON containing:

- `executiveSummary`
- `priorityIssues`
- `opportunities`
- `recommendations`
- `actionPlan`
- `categoryInsights`

The response is parsed and validated with Zod before display. Invalid JSON, schema mismatch, timeout, quota failure, missing key, or provider failure switches to deterministic Demo Analysis. The UI never labels fallback output as live Gemini analysis.

## Demo mode

No key is required to explore the full interface. Without a valid key:

- The live website audit and scoring engine still run.
- Recommendations are generated deterministically from detected issues.
- The interface shows `DEMO ANALYSIS` and a reason.
- `/explore` provides four clearly labeled sample audits.

Switching to Live AI requires no frontend change.

## Environment setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
```

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not prefix the key with `NEXT_PUBLIC_`. `.env.local` is git-ignored.

## Local development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

Run checks:

```bash
npm test
npm run lint
```

## Security

- HTTP/HTTPS protocols only; credentials and nonstandard ports rejected
- `localhost`, `.local`, known metadata hosts, loopback, link-local, private, carrier-grade NAT, multicast, and reserved IP ranges blocked
- Every redirect is normalized, DNS-checked, and limited to four hops
- Ten-second primary timeout and five-second auxiliary timeouts
- 2 MB HTML cap and smaller auxiliary response caps
- In-memory per-instance rate limiting
- Gemini key remains server-side
- Compact AI payloads and validated AI output
- Generic public error responses; raw backend/provider errors are not exposed
- Basic browser security headers

For horizontally scaled production, replace the in-memory rate limiter/cache with a shared store. DNS validation materially reduces SSRF risk, but high-assurance deployments should also enforce outbound network policy or an egress proxy to eliminate DNS rebinding race windows.

## Folder structure

```text
app/
  api/audit/       Secure audit endpoint
  audit/           Audit experience
  issues/          Filterable issue explorer
  reports/         Printable/downloadable report
  explore/         Sample architectures
  about/           Method, stack, and limits
components/
  3d/              Data-driven SEO Neural Web
  audit/           Scanner, dashboard, AI, action matrix
  layout/          Header and footer
lib/
  ai/              Gemini and deterministic fallback
  audit/           Fetching, parsing, orchestration
  scoring/         Checks and weighted scores
  security/        URL protection and rate limits
types/             Shared TypeScript contracts
```

## Limitations

- Single-page audit, not a full-site crawler
- Reads returned HTML, not a browser-rendered post-JavaScript DOM
- Samples up to five internal links
- No Google Search Console, ranking, backlink, traffic, or competitor database
- No ranking guarantees or automated publishing
- Response timing varies by deployment location and is not field performance
- Robots parsing covers the core wildcard-agent/allow/disallow behavior, not every nonstandard directive

See `SPEC.md` for acceptance criteria and the explicit out-of-scope list.

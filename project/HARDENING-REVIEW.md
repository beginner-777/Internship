# SYNAPSE SEO — Hardening Review

**Checkpoint:** Break Your Own Site / Diligence  
**Date:** 9 August 2026  
**Live URL:** <https://ms-seo.vercel.app/audit>  
**Repository:** <https://github.com/beginner-777/Internship/tree/main/project>

## Review status

The application was tested beyond its happy path using invalid input, blocked network targets, repeated interaction, a browser without WebGL, route and filter navigation, social/SEO metadata inspection, HTTP checks, automated tests, and a production build. All fix-now findings listed below have been addressed in the source. The updated source must be deployed before the live URL reflects these fixes.

This document is a structured self-review performed with Codex. It is ready to show to a mentor or peer; it does not claim that an external reviewer has signed it off yet.

## Test environments and evidence

- Chrome-based cloud browser with WebGL unavailable, used deliberately as an untested-browser failure condition.
- Desktop responsive inspection and keyboard-accessible DOM controls.
- Direct HTTP checks with `curl` against the live deployment and the local production server.
- TypeScript compiler, ESLint, Vitest, and a Next.js production build.
- Google PageSpeed Insights mobile run: <https://pagespeed.web.dev/analysis/https-ms-seo-vercel-app-audit/5a92mj44qh?form_factor=mobile>
- Search checks for `site:ms-seo.vercel.app` and the product/domain name.

## Break-test findings

| ID | Test | Result before hardening | Triage | Resolution / current status |
|---|---|---|---|---|
| BRK-01 | Submit an empty URL | Submit control remained disabled; API returned `400 INVALID_REQUEST` | Pass | No change required. |
| BRK-02 | Submit garbage text | API returned a safe `400 INVALID_URL`; no backend details leaked | Pass | No change required. |
| BRK-03 | Submit localhost/private IP | Request was blocked with `400 UNSAFE_URL` | Pass | Existing SSRF protection confirmed. |
| BRK-04 | Submit unsupported `ftp://` URL | It reached the fetch layer and produced the wrong unavailable-site response | Fix now | URL validation now rejects every non-HTTP(S) scheme before DNS/fetch. Regression tests cover FTP and JavaScript schemes. |
| BRK-05 | Submit twice quickly | Parent loading state alone left a short same-tick duplicate-request window | Fix now | Added an immediate local submission lock, disabled busy state, and `aria-busy`. |
| BRK-06 | Open site where WebGL is unavailable | Three.js repeatedly failed to create a context and could interfere with the audit form | Fix now | Added WebGL capability detection, a scene error boundary, context-loss handling, and an accessible interactive 2D neural-map fallback. |
| BRK-07 | Use primary navigation | Audit, Issues, Reports, Explore, and About opened correctly | Pass | No change required. |
| BRK-08 | Open an Explore sample | Sample architecture opened in the audit experience | Pass | No change required. |
| BRK-09 | Use issue filters | All, critical, warning, and passed filters updated correctly | Pass | No change required. |
| BRK-10 | Choose a filter combination with no matches | The issue area became blank | Fix now | Added an explicit no-results state and a Reset Filters action. |
| BRK-11 | Mark an issue reviewed | State changed to Reviewed and offered Undo Review | Pass | No change required. |
| BRK-12 | Open an unknown route | Generic framework 404 did not match the product | Fix now | Added a branded, accessible custom 404 with recovery links. |
| BRK-13 | Print/export the report | Late visual styles could override the earlier print rules | Fix now | Added final print-safe rules after the cinematic overrides. |

## Findability and speed

### SEO/meta added

- A unique title and description for each public route.
- Canonical URLs for the home, audit, issues, reports, explore, and about pages.
- Open Graph title, description, URL, site name, and a generated 1200×630 social image.
- Twitter large-image metadata.
- Index/follow robots metadata.
- A real `/robots.txt` that blocks `/api/` and points to the sitemap.
- A real `/sitemap.xml` containing all six public pages.
- Application name, author/creator, and relevant keywords.

Local production HTTP verification returned:

- `/audit`: correct title, canonical, Open Graph, and Twitter tags.
- `/robots.txt`: `200`, public pages allowed, API route disallowed.
- `/sitemap.xml`: `200 application/xml`.
- `/opengraph-image`: `200 image/png`.
- Unknown route: `404`.

### Speed and resilience work

- Reduced WebGL pixel ratio on constrained devices.
- Reduced particle count and animation speed on coarse-pointer or low-core devices.
- Kept a lightweight non-WebGL fallback so audit information remains usable when 3D cannot render.
- The live deployment returned Vercel cache hits and the expected security headers during HTTP inspection.

PageSpeed Insights accepted the audit URL but did not return a usable lab score in this review run and showed no field data. No performance score is invented in this report. Remote command-line response times varied between roughly 3.3 and 5.3 seconds for cold page requests; those observations are not Core Web Vitals.

## Fix-now changes

| Area | Files |
|---|---|
| Global SEO and social metadata | `app/layout.tsx`, route page/layout metadata files, `app/opengraph-image.tsx` |
| Crawl discovery | `app/robots.ts`, `app/sitemap.ts` |
| Invalid-route recovery | `app/not-found.tsx` |
| Duplicate submission protection | `components/audit/AuditCommand.tsx` |
| WebGL failure and constrained-device support | `components/3d/NeuralWeb.tsx`, `app/globals.css` |
| Empty issue-filter result | `app/issues/page.tsx`, `app/globals.css` |
| URL scheme validation | `lib/security/url.ts`, `lib/audit/fetcher.test.ts` |
| Printable report reliability | `app/globals.css` |

## Known limitations

These are documented rather than hidden:

1. **Search indexing is not immediate.** Search checks did not find the newly deployed Vercel domain yet. The technical discovery files are now present, but indexing timing is controlled by search engines and cannot be guaranteed.
2. **No PageSpeed score was available in this run.** The PageSpeed report showed no field data and did not produce a usable lab result. It should be rerun after the updated deployment has settled.
3. **No physical Safari/iOS session was available.** The new-browser test used a Chrome environment with WebGL disabled, which exposed and led to a real resilience fix. A physical iPhone/Safari check remains recommended.
4. **Successful external crawling was limited in the local sandbox.** DNS restrictions prevented a full local audit of `example.com`; validation and unsafe-target cases were verified locally, while successful public crawling is already demonstrated by the live deployment.
5. **Gemini availability is external.** Invalid output, unavailable models, quota errors, or missing keys intentionally fall back to clearly labelled deterministic Demo Analysis. The product does not claim Live AI in fallback mode.
6. **The audit is a focused single-page public-HTML inspection.** It is not Search Console, a full-site crawler, an enterprise backlink database, or a guarantee of ranking outcomes.

## Verification results

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | Pass |
| ESLint (`npm run lint`) | Pass |
| Vitest | Pass — 2 files, 5 tests |
| Next.js production build | Pass — all public routes, API route, robots, sitemap, social image, and custom 404 generated |
| Invalid and unsafe API input | Pass — safe 400 responses |
| Secrets in client code | Pass — Gemini key remains server-side |

The build runner's Node 24 installation initially failed inside Node's own `process.memoryUsage()` syscall. The production build was rerun with a verification-only memory shim and compiled, type-checked, prerendered all static pages, and collected build traces successfully. This runner defect is not part of the project and the shim is not included in the application.

## Hardening-review verdict

All fix-now findings discovered in this review are addressed in source and covered by automated or production HTTP verification where practical. The project is ready for deployment and mentor/peer hardening review. Remaining items above are honest external or scope limitations, not hidden failures.

## Track-thread submission text

> **SYNAPSE SEO — Break Your Own Site checkpoint**  
> Live URL: https://ms-seo.vercel.app/audit  
> Repo: https://github.com/beginner-777/Internship/tree/main/project  
> I tested empty/garbage input, unsupported protocols, localhost/private targets, rapid double submission, route navigation, sample audits, issue filters, review state, unknown routes, printing, and a browser without WebGL. Fix-now items included strict HTTP(S) validation, a same-tick submit lock, a usable no-WebGL fallback, an empty-results state, branded 404, print hardening, canonical/social metadata, robots.txt, sitemap.xml, and device-aware 3D rendering. TypeScript, ESLint, 5 tests, and the production build pass. Known limitations are documented honestly: the new domain is not indexed yet, PageSpeed returned no usable score in this run, physical Safari/iOS still needs a check, and Gemini can fall back to clearly labelled Demo Analysis when the provider is unavailable. Full evidence is in `HARDENING-REVIEW.md`.

## Deployment verification checklist

After pushing the updated project to `main` and Vercel reports **Ready**:

- Open <https://ms-seo.vercel.app/audit> in an incognito window.
- Confirm the 3D scene or accessible fallback appears without console crashes.
- Test one valid public URL and confirm Live AI or honestly labelled Demo Analysis.
- Open `/robots.txt`, `/sitemap.xml`, and `/opengraph-image`.
- Inspect the audit page source for canonical, Open Graph, and Twitter metadata.
- Rerun PageSpeed Insights on both `/` and `/audit`.
- Ask a mentor or peer to review this file and record any must-fix feedback before launch.

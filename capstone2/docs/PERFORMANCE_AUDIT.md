# Performance audit

## Implemented performance measures

- Heavy Three.js scenes are dynamically imported with SSR disabled and deferred until browser idle time.
- Narrow screens, reduced-motion users, and data-saver connections receive the CSS signal environment without downloading the Three.js scene chunk.
- Canvas device pixel ratio is capped at 1.5.
- Rendering pauses when the document is hidden.
- Reduced-motion mode uses demand rendering.
- Low-memory narrow devices can skip WebGL.
- CSS provides a complete visual fallback.
- Three.js scenes use generated geometry and no downloaded models or textures.
- R3F manages declarative resource cleanup on unmount.
- Timeline and service visualizations use native HTML/SVG instead of a chart library.
- Lucide package imports are optimized by Next.js.

## Baseline production measurement — 2026-08-10

The deployed landing page was measured with Chrome Lighthouse mobile emulation. These are the captured baseline values before the audit-driven changes below:

| Measurement | Mobile baseline | Post-fix mobile | Desktop |
| --- | ---: | ---: | ---: |
| Performance | 70 | Pending redeploy and rerun | Not measured |
| Accessibility | 100 | Pending redeploy and rerun | Not measured |
| Best Practices | 100 | Pending redeploy and rerun | Not measured |
| SEO | 60 | Pending redeploy and rerun | Not measured |

The captured diagnostics reported 9.2 seconds of main-thread work, 8.1 seconds of JavaScript execution, approximately 205 KiB of unused JavaScript, and seven long tasks. The SEO audit reported that the page was blocked from indexing.

## Audit-driven improvements

- The WebGL scene module is now gated before its dynamic import. Mobile, reduced-motion, and data-saver sessions use the existing CSS fallback, avoiding the heavy Three.js/R3F execution path.
- Rich desktop 3D loads during idle time rather than competing with initial content rendering.
- Production metadata now permits indexing, and dedicated `robots.txt` and `sitemap.xml` routes describe crawlable content.
- The final Lighthouse column remains explicitly pending until the updated production deployment is audited; no improvement score is assumed.

Recommended command: `npx lighthouse <production-url> --view`. Run at least three times with stable network and report the median.

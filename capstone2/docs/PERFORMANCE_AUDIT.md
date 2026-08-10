# Performance audit

## Implemented performance measures

- Heavy Three.js scenes are dynamically imported with SSR disabled.
- Canvas device pixel ratio is capped at 1.5.
- Rendering pauses when the document is hidden.
- Reduced-motion mode uses demand rendering.
- Low-memory narrow devices can skip WebGL.
- CSS provides a complete visual fallback.
- Three.js scenes use generated geometry and no downloaded models or textures.
- R3F manages declarative resource cleanup on unmount.
- Timeline and service visualizations use native HTML/SVG instead of a chart library.
- Lucide package imports are optimized by Next.js.

## Measurements

No Lighthouse score is claimed unless Lighthouse is run against a production build in a browser representative of the target device. Record values here after deployment:

| Measurement | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | Not measured | Not measured |
| Accessibility | Not measured | Not measured |
| Best Practices | Not measured | Not measured |
| SEO | Not measured | Not measured |

Recommended command: `npx lighthouse <production-url> --view`. Run at least three times with stable network and report the median.

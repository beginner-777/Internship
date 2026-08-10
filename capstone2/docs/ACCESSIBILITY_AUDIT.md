# Accessibility audit

## Implemented controls

- Semantic page landmarks and heading structure
- Skip-to-content link
- Keyboard-accessible navigation, filters, details, actions, and service list
- Focus-visible treatment with high contrast
- Focus trapping, Escape dismissal, and focus restoration for drawer and dialogs
- Persistent labels and linked error messages for form fields
- Live regions for analysis progress, copy status, and error feedback
- Text/icon status communication independent of color
- Minimum 44–48px interactive targets
- Relationship-map text/list alternative
- Text summary for the event-density visualization
- Decorative canvases hidden from assistive technology
- Operating-system reduced-motion support
- CSS/WebGL fallback and mobile service-list alternative
- Print stylesheet for a readable PDF report

## Automated audit

Chrome Lighthouse reported an Accessibility score of 100 for the deployed landing page on 2026-08-10. This is recorded as Lighthouse evidence only and is not represented as an axe or WAVE result.

Playwright is configured to run `@axe-core/playwright` against `/`, `/workspace`, and `/investigation`, filtering for WCAG 2.0/2.1 A and AA rules. The suite was discovered but could not launch because this environment could not install a browser binary. No automated axe pass result is claimed; the exact limitation is recorded in `TESTING_EVIDENCE.md`.

WAVE was not run in this environment. No WAVE result is claimed.

## Manual checklist

Keyboard order, command-palette focus restoration, mobile drawer trapping, reduced-motion rendering, error focus, and service-selection announcements must be rechecked on the deployed production URL because browser and hosting differences can affect behavior.

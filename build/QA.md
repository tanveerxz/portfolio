# Shipping QA

Production build and browser verification completed on 2026-09-21.

- `npm run build`: pass.
- Browser suite: 30/30 checks passed, no console or page errors.
- Axe WCAG A/AA: zero desktop violations, zero mobile violations.
- Desktop, mobile reduced-motion, case-study mobile, and no-JavaScript captures reviewed.
- No horizontal overflow at 1440px or 390px.
- One email destination and one simultaneous WebGL context maximum.
- Manual pause removes WebGL and persists after reload.
- Reduced motion creates zero canvases and zero WebGL contexts.
- Unknown route returns 404; robots, sitemap, and both open-graph endpoints return successfully.
- Impeccable detector: no findings.
- Finish review: `disposition: ship`.

Evidence: `.impeccable/review/browser-report.json` and `.impeccable/review/*.png`.

# A — Orb system

- Implemented one raw Three.js renderer and orthographic scene shared across all five acts.
- Added shader-driven ribbon and point geometry, DOM-aligned anchors, four project derivatives, context-loss handling, and complete disposal.
- Steady fragmented state uses 8 draws and 52,192 vertices; all other states are lighter.
- Static `OrbPoster` states cover no-JavaScript, reduced-motion, import failure, and unavailable WebGL.

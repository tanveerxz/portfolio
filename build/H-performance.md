# H — Performance

- Production home bundle: 101 kB first load; LegacyLift case study: 96.7 kB.
- One WebGL context maximum, capped DPR, shared geometry, imperative uniforms, no per-frame React state.
- Peak measured project scene: 8 draw calls and 52,192 vertices, within the 16-draw / 60k-vertex contract.
- Contact idle test recorded zero additional frames over 900ms.

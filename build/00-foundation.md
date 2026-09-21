# Foundation contract

Phase 0, HIGH effort. Replaces the previous contract. Every agent reads this, 00-narrative.md and content-source.md first. User brief wins over historical audit advice. Every agent writes a build summary and returns <=12 lines. Disjoint file ownership; never reset existing staged changes.

## Truth

All factual copy from content-source.md. Additional user-confirmed email: hello@tanveersingh.dev. Display identity Tanveer. Existing domain https://tanveersingh.dev. No invented screenshots, telemetry, program values, URLs or film destination. Verification diagram explicitly illustrative. Order: hero, LegacyLift, projects, leadership, contact. Retain /legacylift as a substantive case-study route. No other profile links except supplied Pollen credit. Main content server-rendered, no splash screen, all text visible by default. No section numbering or eyebrows above headings.

## Visual world

Silver thought: cool charcoal, large precise sans lettering, luminous silver filament sphere with pale periwinkle reflected light. Warmer slate in leadership, no light-theme inversion. Dark ground makes optical geometry legible in a screen-based moving-work experience. Three.js is the actual visual artifact, no generated substitute. Variance 8 / motion 9 / density 3. Code-led execution follows user's explicit phase contract. No speculative image comps or alternate-direction approval rounds.

Tokens: --surface-0 #0b0d12; --surface-1 #12151c; --surface-2 #1a1e27; --surface-3 #242933; warm #181715. --text-primary #edeef2; --text-secondary #b3b7c2; --text-tertiary #9096a4; --text-inverse #0b0d12; --accent #c2c8fa; --accent-hover #d9ddff; success #b9d3be; warning #e6c49b; hairline rgba(224,229,244,.16); control border #707684; focus #d9ddff. No multicolour palette.

Manrope via next/font/google for display/body, weights 400/500/600/700. JetBrains Mono only code/numeric data. Display clamp(3.4rem,7.3vw,7.25rem); h2 clamp(2.5rem,5vw,5rem); h3 clamp(1.5rem,2.5vw,2.4rem); body 16-18px, 1.65 line-height; small 14px. Tracking no tighter than -.04em. Max text 60ch, typical 35-48ch. Hero max two headline lines desktop.

.container: max-width 1440px, padding-inline clamp(24px,5vw,88px). Spacing 4/8/12/16/24/32/48/64/96/128/160px. Section gaps 112-160px desktop,72-96px mobile. Nav 76px desktop/68px mobile. CSS modules per section. Global CSS owns tokens/reset/primitives/common utilities only. Radius cards 14px, buttons pill, fields 8px. No nested cards. Z levels canvas 0, content 1, header 30, controls 40, skip 50. Do not give main an opaque background masking the canvas.

Shared primitives: one Button (as='a', href, variants primary/secondary/ghost, sizes sm/md/lg and normal button props); one Card with semantic article option; one labelled Field family. No visible form: single email path. Reuse compatible helpers only. Direct Button imports, no barrel.

## Access and fallback

SSR text always visible. Each visual slot has an OrbPoster with distinct state geometry; shown with no JS, reduced motion, import failure or context loss. Full-motion hides posters only after first successful render. No WebGL context, Lenis or pinning for reduced motion. Manual header motion toggle persists, respects OS defaults and listens for preference changes. All sections flatten into natural reading flow, including all three verification steps. One h1, section h2, article h3. First focus skip targets #main tabIndex=-1. Decorative art aria-hidden. No time-driven aria-live, no hover-only content. Focus >=2px with 4px offset; touch targets >=44px.

## Performance

Maximum ONE raw Three.js renderer/scene context. Dynamic import; no active R3F/Drei/postprocessing. DPR <=1.5 desktop /1.25 mobile; adaptive down to 1. Target <=16.7ms desktop/33.3ms mobile, measured honestly; no unmeasured public claims. <=60k particles/vertices, <=16 typical draw calls. Procedural shaders/no network model textures. Geometry created once, uniforms imperative, no per-frame React state. One GSAP ticker runs Lenis and render subscribers; IntersectionObserver over story sections + visibilitychange remove expensive callbacks offscreen/hidden. Dispose all resources on unmount/context loss, clamp resumed delta. Warm section pauses rendering; settled contact becomes render-on-change. Resize never recreates renderer. Native scrolling for touch/reduced motion. Reserve art boxes.

## Ownership/API

A owns components/narrative/OrbCanvas.tsx, orb-scene.ts, orb-shaders.ts, OrbPoster.tsx, orb.module.css, lib/narrative-state.ts. B owns components/narrative/NarrativeController.tsx. C owns Hero.tsx/Hero.module.css in sections/hero and Flagship.tsx/Flagship.module.css. D owns WhatIBuild.tsx/Work.module.css. E owns Community.tsx/Contact.tsx/Community.module.css/Contact.module.css. F owns app/globals.css, lib/fonts.ts, components/primitives. G owns shell header/footer/skip link and access review. H audits performance once A/B ready, coordinates fixes. I owns layout/meta routes/config/site.ts/config/flagship.ts. J obsolete source/docs cleanup after other writes settle. Lead owns app/page.tsx, /legacylift/page.tsx, package changes, integration, context/docs and browser tests.

Section hooks: #top data-act='dormant', #flagship data-act='active-thinking', #work data-act='fragmented', #community data-act='warm', #contact data-act='settled'. Every section has a sized [data-orb-anchor] slot with OrbPoster imported from components/narrative/OrbPoster (props state: 'dormant'|'active-thinking'|'fragmented'|'warm'|'settled', className optional). Each project additionally has data-orb-project='0'..'3' on its art slot (no visible numbering). Hero and flagship desktop art slots >=420px. C uses .verification-stage, data-verification-step='0'/'1'/'2', data-verification-visual, B sets --verification-progress and data-verification-phase. All step text stays readable; highlight changes, no hidden content.

A exports mutable narrativeState {act, progress, verification, warmth, fragmentation, visible, reducedMotion, timestamp}; updateNarrative(partial), subscribeNarrative(listener), addFrameListener(fn(timeSeconds,deltaSeconds)) returns disposer; tickNarrative(timeSeconds) with bounded delta. Defaults dormant, visible true, reducedMotion false. OrbCanvas registers listener, owns no RAF. B gsap.ticker -> lenis.raf(milliseconds) + tickNarrative(seconds), gated via IO/visibility, imports A state. Controller renders OrbCanvas. No circular imports. A camera is orthographic viewport-space, geometry placed from anchor bounding rects, projects in same scene. Fixed inset-0 canvas pointer-events:none. Motion manual preference stored 'portfolio-motion' value 'reduced'/'full'; root data-motion attribute and window 'portfolio:motion-change' event coordinate G/B. Root data-webgl='ready' only after successful frame, else 'unavailable'.

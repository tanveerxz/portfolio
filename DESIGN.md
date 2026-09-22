---
name: Tanveer Portfolio
description: Silver Thought v2 — a cinematic, restrained portfolio built around one reasoning object.
colors:
  silver-ink: "#edeef2"
  muted-silver: "#b3b7c2"
  quiet-silver: "#9096a4"
  silver-hi: "#f6f7fa"
  silver-lo: "#858a98"
  void-charcoal: "#0b0d12"
  raised-charcoal: "#12151c"
  panel-charcoal: "#1a1e27"
  warm-charcoal: "#181715"
  reflected-periwinkle: "#c2c8fa"
  bright-periwinkle: "#d9ddff"
  hairline: "rgba(224, 229, 244, 0.14)"
typography:
  display: "Inter Tight (variable), 500–600, tracking -0.055em"
  voice: "Instrument Serif italic — 1–3 emphasis words per section only"
  mono: "JetBrains Mono — real facts/figures/labels of facts only"
---

# Design System: Silver Thought v2

## North star

A dark editorial stage for one continuous reasoning object. Huge precise
grotesk type, one italic serif "thought" word, silver material, periwinkle
reflected light. Space is filled with **craft** — scale, the orb, light, grain,
hairline structure, beam and motion — **never with extra text**.

## The content rule (owner-mandated, overrides everything)

- Only the owner's words and facts from `build/content-source.md`.
- **No filler text**: no colophons, no talk about the site's fonts/tech, no
  decorative mono annotations, fake coordinates, figure numbers, registration
  labels, "scroll"/"scroll to begin" captions, invented chapter labels, or
  tickers of tech names.
- Small text (mono labels, meta strips, stats) exists **only** when it carries a
  real supplied fact (e.g. HukamConnect "300+ active users").
- Never mention 1Foundry or any accelerator. Never state a grade.

## Tokens (all in `app/globals.css`, mapped in `tailwind.config.ts`)

- Ground: `--surface-0..3`, `--surface-warm` (leadership only).
- Ink: `--text-primary` 16.9:1, `--text-secondary` 9.9:1, `--text-tertiary`
  6.5:1 (smallest permitted text colour). `--ink-ghost` decorative only.
- Light: `--accent` / `--accent-hover` (action, focus, reflected light),
  `--silver-hi/mid/lo`, `--silver-text` (gradient = the static metal material),
  `--silver-edge`. Periwinkle is never a large fill.
- Hairlines: `--hairline`, `--hairline-strong`.
- Fluid type (360→1920): `--step--2` 11.5–12.5 · `--step--1` 13.5–15 ·
  `--step-0` 16–18 · `--step-1` 18–22 · `--step-2` 22–30 · `--step-3` 28–44 ·
  `--step-4` 40–80 · `--step-5` 52–152 · `--step-6` 64–256.
- Tracking: `--tracking-mega/display/heading/title/label`.
- Space: `--space-*` (4px base), `--space-section` 88–216, `--space-block` 48–104.
- Grid: `.container` (max 1680, pad `--container-pad` 20–88), `.grid-system`
  = 4 / 8 / 12 columns (<768 / 768+ / 1024+), gutter `--grid-gutter`.
- Radius: `--r-xs 4`, `--r-sm 8`, `--r-md 12`, `--r-lg 20`, `--r-xl 28`, pills `--r-full`.
- Motion: `--ease-out` (expo, arrivals), `--ease-out-quint` (hover/UI),
  `--ease-in-out` (scene/menu), `--ease-spring` (linear() spring);
  `--dur-instant 90 / fast 160 / base 260 / slow 480 / entrance 900 / choreo 1400`,
  `--stagger 70ms`.
- Layers: canvas 0, content 1, sticky 20, grain 25, nav 30, controls 40, skip 50.

## Themes: dark default, light as an owner-requested exploration

Silver Thought is a dark stage and dark stays the default. At the owner's
request (2026-09-22) there is an opt-in **light theme** so he can see how it
looks; this replaces the old "never go light" rule. Treat light as an
exploration until the owner decides to keep it.

- Mechanism: `html[data-theme="dark" | "light"]`, set before first paint by
  `themeBoot` (`lib/theme-boot.ts`, inlined in `app/layout.tsx`). Only
  localStorage `portfolio-theme` can select light; the OS preference is
  ignored. The server always renders dark. `setTheme()` (`lib/theme.ts`)
  persists, rewrites the `theme-color` / `color-scheme` meta tags, fires
  `portfolio:theme-change` and crossfades via the View Transitions API
  (skipped under reduced motion). `useTheme()` for client components.
- Toggle: `components/shell/ThemeToggle.tsx`, in the header controls slot at
  every width (moon glyph in dark opening into a sun in light). Name "Light
  theme", state `aria-pressed`.
- Light palette: pale silver paper (`--surface-0` #f1f0ec), graphite ink
  (#16181d / #43474f / #5a5e68), silver rendered as polished graphite
  (`--silver-*`, metal-fx burned toward graphite), periwinkle deepened to
  #4a50b0 for AA, hairlines as dark alpha, a warm paper Community field
  (#f4ede3) with stone seats.
- Every token has a light value under `:root[data-theme="light"]` in
  `app/globals.css`. Modules never hardcode colour: use the tokens, or the
  channel tokens with a per-use alpha, `rgb(var(--glow-rgb) / 0.08)`
  (`--glow/line/ground/raised/panel/deep/shade/sheen/warm-rgb`).
- Orbs: the canvas painter reads `--orb-ink` once and again only when the theme
  changes (never per frame); posters mix `--orb-ink` toward `--orb-ink-far`;
  halos use `--orb-halo-in/mid`. Translucent fields laid over a live orb slot
  multiply their alpha by `--orb-veil` (1 dark, 0.35 light), because a paper
  veil washes dark dots out far faster than a charcoal one dims light dots.
- border-beam follows the theme (`theme="light"`); liquid-gooey fills read
  `--nav-fill` / `--nav-indicator`.

## Type roles (global classes)

`.t-mega`, `.t-display`, `.t-h2`, `.t-h3`, `.t-h4`, `.t-lead`, `.t-body`,
`.t-small`, `.t-label` (mono facts), `.t-serif` (italic voice), `.text-silver`,
`.measure` (60ch), `.measure-narrow` (42ch), `.hairline`, `.link-draw`,
`.visually-hidden`, `.section-pad`.
One h1 (hero), h2 per section, h3 per article. No eyebrows above headings.

## Components & APIs

- `Button` (`components/primitives/Button.tsx`): `variant` primary | silver |
  secondary | ghost | link (+ legacy flagship), `size` sm 44 / md 48 / lg 56,
  `href`, `external`, `arrow`, `magnetic`, `effect` "none" | "beam" | "metal",
  `beamTone` "ocean" (default) | "mono". Focus ring is structural.
- `Card` (`primitives/Card.tsx`): add `beam="travel" | "breathe"`, `beamTone`.
- `MetaStrip` (`primitives/Density.tsx`), `Stat` + `StatRow`
  (`primitives/Stat.tsx`): real facts/figures only.
- `Reveal` (`as`, `kind` up | fade | mask, `delay`, `y`) and `SplitLines`
  (`as`, `lines: ReactNode[]`, `delay`) from `components/effects/Reveal.tsx`.
  Server components; `RevealRoot` (in layout) observes them. Visible without JS
  / reduced motion; never use on the hero h1.
- `Magnetic` (`effects/Magnetic.tsx`): wraps one control; fine pointer + motion only.
- `ThinkingDot` (`effects/ThinkingDot.tsx`, `state`, `size` 20 | 64): wrapper of
  the engine's shared `AmbientOrb` (`components/narrative/AmbientOrb`). Never
  use thinking-orbs' own `<ThinkingOrb>`.
- `Beam`, `BeamRule`, `ProofBeam` (`effects/beam/*`, `effects/ProofBeam.tsx`).
- `MetalWord`, `MetalRing` (`effects/metal/*`).
- Liquid: `useLiquid(enabled)` (`effects/liquid/useLiquid.ts`).
- Gate helpers (`effects/runtime.ts`): `useEffectGate(ref, "low"|"high")`,
  `useMotionMode`, `useAwake(ref, restMs, wakeRef?)`, `useLatch`, `?fx=all` QA override.

## Effect rules (libraries.dev)

Budget: **max one heavy effect per viewport** (metal, gooey morph, or a
travelling beam on a large surface); **≤ 2 beams visible at once**; ≤ 2 WebGL
contexts page-wide (orb engine + metal-fx's single shared context).

**metal-fx** — silver preset only (global). `MetalWord` on ONE word in the
hero h1 (done). `MetalRing` reserved for the Contact section's single email
action. Nothing else. Tier "high" only (≥768px, WebGL2 without perf caveat,
≥4 cores/4 GB). Mounts once, never unmounts (metal-fx context-loss bug);
pauses when offscreen and 9 s after last activity. Don't use proximity
reflections, `useMetalTextReflection`, bend or cursor light (GPU readbacks).

**border-beam** — always via `Beam`/`Button effect="beam"`/`Card beam`/
`BeamRule`/`ProofBeam`; never import `border-beam` directly (its SSR `<style>`
breaks hydration of the whole page). Tones: `ocean` (periwinkle, primary) or
`mono` (silver). Kinds: `travel` (featured card/surface), `compact` (buttons),
`underline` via `BeamRule` (section dividers, max one per section), `breathe`
(quiet featured), `halo` (once, final action). Beams rest after 7 s (`rest`)
and wake on hover/focus; use `rest={0}` only for a beam that *is* the content
(flagship proof visual, dividers).

**thinking-orbs** — the narrative object (engine-owned) plus `ThinkingDot` /
`AmbientOrb` accents: 20px inline status glyphs, 48–120px marginal orbs.
3–6 per page max.

**liquid-gooey** — navigation only: desktop nav hover indicator (move) and the
mobile menu morph. Not for content.

## Density: fill space with craft

Use: headline scale (`t-mega`/`t-display`), orbs (`ThinkingDot size 64`,
orb slots), hairline structure (`.hairline`, `BeamRule`), the faint 4/8/12
column lines (see hero `.columns`), static radial "stage light" gradients,
grain (global), pointer light (hero pattern), reveals, and the owner's real
facts as `MetaStrip`/`StatRow`. Per viewport: 1 heavy effect + ≤ 3 small
accents. No new text.

## Hero (reference implementation, `components/sections/hero`)

Ledger (Founder · LegacyLift / Status · orb "Building full-time") top-left,
orb slot right spanning stage + headline rows, h1 "Tanveer." (silver sweep)
/ "Building" (serif) "LegacyLift." (metal), hairline, bio left + beam CTA,
a 1px scroll light at far right. Mobile: ledger → h1 → rule → bio/CTA → orb.
h1 lines are inline spans + `<br>` so the whole h1 is the single LCP candidate
— never add `position`, `transform`, `opacity` animation or `will-change` to
h1 descendants.

## Performance rules

- Heavy libraries are dynamic imports behind `useEffectGate` (motion full +
  idle + near viewport + device tier). Nothing effect-related is in the LCP path.
- No `backdrop-filter` over the orb canvas; no blend modes on big layers.
- Looping CSS animations must pause offscreen (pattern: IO sets
  `data-inview`, CSS sets `animation-play-state: paused`).
- Write DOM attributes on scroll only when the value changes.
- Scroll progress uses CSS `animation-timeline: scroll()` (no JS).

## Accessibility

Skip link first; `#main` focus target. Focus: 2px `--focus`, 4px offset.
Targets ≥ 44px. `html[data-motion]` (toggle + OS) collapses all motion;
reveals/entrances end visible without JS. Decorative art `aria-hidden`.
Mobile menu is a disclosure (Escape, outside click, focus return, inert when closed);
the footer repeats navigation for no-JS.

## Do / Don't

Do keep one periwinkle action per viewport, let the orb carry spectacle, and
vary composition by section. Don't add filler text, repeat card grids, extra
accent colours, a second metal word, or a hardcoded colour that skips the
light theme.

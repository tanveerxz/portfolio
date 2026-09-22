# Narrative orb engine: contract for section authors

The narrative engine turns scroll position into one continuous "reasoning orb" that moves between art slots in each section. This file is the contract. If your markup follows it, the engine keeps working, and you never need to touch `components/narrative/**`.

## 1. Sections (acts)

Each act is a `<section>` with a fixed `id` **and** a matching `data-act`:

| id          | data-act          | central orb state (default)                  |
|-------------|-------------------|----------------------------------------------|
| `top`       | `dormant`         | breathing                                    |
| `flagship`  | `active-thinking` | searching → working → solving → shaping → weaving (by verification progress) |
| `work`      | `fragmented`      | central hidden; 4 project orbs shown         |
| `community` | `warm`            | connecting, 42% opacity, frozen              |
| `contact`   | `settled`         | breathing, frozen                            |

An act becomes active when its section's top crosses 55% of the viewport height. The hero (`dormant`) is active from `top top`. `warm` and `settled` are "quiet": the orb stops animating there and repaints only when something changes.

## 2. Anchors (where the orb sits)

- **Primary slot**: exactly one `[data-orb-anchor]` per section (value optional, e.g. `data-orb-anchor="dormant"`). The central orb centres on it, and its diameter is `min(width, height) × scale` (scale: dormant 0.97, active-thinking 0.9, settled 0.82, default 0.9). The minimum diameter is 56px.
- **Project slots** (inside `#work` only): `data-orb-anchor data-orb-project="0" | "1" | "2" | "3"`. States are 0 connecting, 1 weaving, 2 listening, 3 composing. These orbs are visible only in the `fragmented` act.
- **Candidate slot** (new, optional, any act; intended for `#flagship`): `data-orb-anchor="candidate"`. A second orb centres on it whenever its section's act is active. It **mirrors the central orb's state and clock exactly** (same frame, in sync), so a legacy and a candidate orb can replay side by side. The central selector ignores it. Pair it with `data-orb-range` (below) to show it only during one chapter, e.g. `data-orb-range="0.5,0.75"` for a replay chapter.
- The anchor must have a real size (the slot reserves the space; posters fill it). Keep slots the same size in static and motion modes to avoid layout shift.
- Anchors may sit inside a `position: sticky` ancestor. The engine models the sticky offset (top inset + containing-block limit) from cached geometry. Only `top` stickiness is supported.
- Anchors are measured on resize, font load, section resize and body resize, and never per frame. If you move an anchor with JS or animate its box, the orb will not follow. Animate the content inside the slot instead, or dispatch a `resize` event after the change.

### Optional per-anchor attributes

| attribute | on | effect |
|-----------|----|--------|
| `data-orb-states="connecting,working,composing,solving"` | primary slot | Overrides the act's state sequence. The list is split evenly across act progress (`active-thinking` uses verification progress; other acts use section progress). Valid states: working, searching, solving, listening, connecting, weaving, composing, breathing, shaping. |
| `data-orb-scale="0.8"` | any slot | Overrides the diameter fraction of `min(width, height)`. |
| `data-orb-opacity="0.6"` | primary / candidate slot | Overrides the orb opacity for that act (0–1). |
| `data-orb-range="0.5,0.75"` | primary / candidate slot | Multiplies opacity by an eased visibility term: 0 while `narrativeState.verification` is outside `[a,b]`, 1 inside, smoothstepped over a small margin at each edge. Verification progress runs across the whole `#flagship` sticky runway (see §3), so this works for a slot that should only appear during one chapter, e.g. the candidate orb during the replay chapter. |

These attributes are read at measure time. If you change them after hydration, trigger a `resize` event.

## 3. Flagship verification hooks

- `.verification-stage`: the sticky stage. Verification progress runs **0 → 1 across the stage's sticky runway**: 0 when it sticks, 1 when its containing block releases it. The containing block (the stage's parent) must be taller than the stage, or there is no runway. Without a runway, progress falls back to the section crossing the 55% line.
- `[data-verification-visual]`: the art slot.
- `--verification-progress` (0–1, 4 decimals) is written only when it changes. If any elements inside `#flagship` carry `data-verification-progress`, it is written **only on those** (keep them small: a custom property inherits, so each write re-styles the target's whole subtree every scrolled frame). Otherwise it falls back to `.verification-stage` and `[data-verification-visual]`. The homepage marks only the progress bars.
- `data-verification-phase="0..N-1"` goes on `#flagship`, the stage and the visual. Children marked `data-verification-step="i"` get `data-verification-active="true|false"`. **N = number of distinct `data-verification-step` values**, split evenly across progress. Previously N was hard-coded to 3; you may now use 3–6 steps.

## 4. Static fallback: `OrbPoster`

```tsx
import { OrbPoster } from "@/components/narrative/OrbPoster";
<OrbPoster state="active-thinking" orbState="solving" className={styles.poster} />
```

Props are unchanged: `state: NarrativeAct`, optional `orbState`, optional `className`. The poster is a server-rendered SVG, now merged into a handful of `<path>`s (previously one node per dot). It is shown with no JavaScript, under reduced motion, or when the renderer is unavailable. It fades out (and becomes `visibility: hidden`) once `html[data-orb-renderer="ready"]` is set.

## 5. `<AmbientOrb />`: decorative accents

```tsx
import { AmbientOrb } from "@/components/narrative/AmbientOrb";

<AmbientOrb state="weaving" size={120} />
<AmbientOrb state="breathing" size={48} speed={0.8} halo={false} />
<AmbientOrb state="solving" size={96} label="Fidelity Replay running" />  // role=img
```

| prop | default | notes |
|------|---------|-------|
| `state` | `"breathing"` | any thinking-orbs state |
| `size` | `96` | CSS px diameter; keep ≤ 240 for accents |
| `speed` | `1` | multiplier on the preset speed |
| `halo` | `true` | static CSS radial glow behind the dots |
| `paused` | `false` | freeze the current frame |
| `label` | none | gives role=img + aria-label; without it the orb is aria-hidden |
| `className`, `style` | none | applied to the wrapper `<span>` (inline-block, `contain: strict`) |

Cost model: all instances share **one** rAF loop and **one** IntersectionObserver. Offscreen instances never paint, and the loop stops when none are visible or the tab is hidden. Each canvas is sized to the orb (DPR ≤ 2, ≤ 1.5 on touch, 1.25 on low-power devices). Painting runs at 30 fps on touch and low-power devices and 60 fps otherwise. `html[data-motion="reduced"]` or the OS setting paints a single still. It is safe to use 3–6 per page. It does **not** depend on the narrative controller, so it works on any route.

Prefer this over `thinking-orbs`' own `<ThinkingOrb>`. That component runs a separate rAF per instance at 60 fps, with per-dot colour strings.

## 6. Runtime hooks (read-only for authors)

- `html[data-motion="full" | "reduced"]`: manual toggle / OS preference, set by the layout boot script and the controller.
- `html[data-orb-renderer="ready" | "unavailable"]`: set to ready after the first successful orb paint.
- `window.__orbStats`: `{ frames, paints[] }` debug counters for QA. The old per-frame `canvas.dataset.frames` writes were removed.
- `lib/narrative-state.ts`: `narrativeState` (`act`, `progress`, `verification`, `scroll`, …), `subscribeNarrative`, `addFrameListener`, `setFrameDemand`, `notifyLayoutChange`.

## 7. Performance rules the engine relies on

- There is no full-viewport canvas. Each orb is its own small canvas inside an absolutely positioned, document-anchored layer, moved with `translate3d`. Native scroll carries it on the compositor.
- The frame loop does zero DOM reads. Its only writes are `transform`, `opacity` and `visibility` on the orb wrappers, and only when they change.
- There is no `shadowBlur`, `ctx.filter` or CSS `filter` on orb canvases. The glow is a static CSS radial gradient behind each orb. (A CSS drop-shadow bloom measured about −13 fps next to the metal-fx canvases.)
- The GSAP ticker detaches when no layer demands frames and Lenis is idle.
- Do not add `ScrollTrigger` `markers`, per-frame `getBoundingClientRect`, or scroll listeners that write styles. If you need scroll progress, read `narrativeState` in an `addFrameListener` callback.

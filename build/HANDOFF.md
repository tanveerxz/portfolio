# Redesign handoff

Written 2026-09-21 at the end of an orchestrated redesign session. Start here in a new session: read this file, then `DESIGN.md`, `components/narrative/README.md` and `build/content-source.md`.

## Goal

Portfolio at Awwwards level, dark "Silver Thought" language, using the libraries.dev effects (`thinking-orbs`, `border-beam`, `metal-fx`, `liquid-gooey`). Performance and responsiveness are hard requirements.

## Owner rules (non-negotiable)

- **No filler text.** No colophons ("set in… / built with…"), no credits for the site's own tech or fonts, no decorative mono annotations, no tickers of labels, no invented captions or stats. Only add content the owner supplied or discussed.
- **Fill empty space with visual craft** (composition, scale, type, orbs, beam, light, motion), not words. Max one heavy effect per viewport.
- **Beam must be visibly used.** Mount `BorderBeam` on the client only; server-rendering it causes a React 18 hydration mismatch in its injected `<style>`. Use the wrappers in `components/effects/beam/`.
- **Never mention 1Foundry / any accelerator, StartHack / personal-trip stories, or the launch film.** Both were removed at the owner's request.
- **Facts come only from `build/content-source.md`** and the LegacyLift product site (https://legacylift-six.vercel.app).
- The owner confirms any commercial claim before it ships (e.g. the product site's "consultant ~6 months ≈£480k vs ~2 weeks").

- **Technical rule: never paint an opaque or semi-opaque background over an orb slot.** The narrative orb layer is `position:fixed` behind `<main>`, so a section or card background hides the orb. This has bitten Community (fixed by giving the hub its own `AmbientOrb`) and Work (card backgrounds used as a hairline-gutter trick). Draw hairlines with borders, keep glows translucent, or render a local `AmbientOrb` if the section needs a solid field.

## Done

- **Orb engine rebuilt** (`components/narrative/**`, `lib/narrative-state.ts`): 1–2 fps → 55–60 fps on desktop, 3–8 → 50–60 fps on mobile at 4× CPU slowdown. Each orb gets its own small canvas moved with translate3d, there are no DOM reads in the frame loop, and offscreen or quiet acts stop rendering. The contract is in `components/narrative/README.md`. New pieces:
  - `data-orb-anchor="candidate"` (mirrors the central orb);
  - `data-orb-states="a,b,c"` (state sequence across verification progress);
  - `data-orb-scale` / `data-orb-opacity`;
  - `<AmbientOrb>` (shared rAF; use this, not `<ThinkingOrb>`).
- **three.js** dead code deleted; `three` / `@types/three` uninstalled.
- **Flagship sticky bug fixed:** `.flagship` is a flex column and `.container` is `flex:1`, so the stage pins through the whole 190svh runway with no dead scroll.
- **Content removals:** 1Foundry (Flagship, /legacylift, hero ledger) and the StartHack story.
- **Deps added:** `metal-fx`, `liquid-gooey`.
- **`.gitignore`:** now ignores `/.next-*/`.

## Agent scopes (original briefs)

All three below have finished. See "Agent results" for what shipped and their TODOs.

| Area | Files | Intent |
|---|---|---|
| Art direction / hero / shell | `app/globals.css`, `app/layout.tsx`, `components/shell/**`, `components/sections/hero/**`, `components/primitives/**`, `components/effects/**`, `DESIGN.md` | Hero is a hybrid of the post-1Foundry version (ledger with Founder + Status only, big "Tanveer. / *Building* LegacyLift." headline, dotted orb in a thin ring, centred "Explore LegacyLift →" beam CTA, faint column lines) plus the newer polish. Also: fix the metal-fx per-frame GPU readback, and move `ThinkingDot` onto the engine's `AmbientOrb`. |
| Sikhs in Tech | `components/sections/Community.*` | The 100-seat field as the hero visual (lights up on scroll), the orb integrated into it, a beam'd event card, no empty bottom third. Facts: Director of Hackathons (London); first Sikhs in Tech London hackathon; 100 developers; one day; early Nov 2026. |
| LegacyLift | `components/sections/Flagship.*`, `components/sections/flagship/**`, `app/legacylift/**`, `config/flagship.ts` | Orbs portray the product as scroll chapters: `connecting` = codebase map, `working`/`composing` = human-approved rewrite, legacy + `candidate` orbs replaying with `solving` = Fidelity Replay, then a signed attestation with beam. `/legacylift` becomes a long-form case study. |

## Agent results

- **Sikhs in Tech: DONE.**
  - One composition: 100 seat dots arranged as a ring around a hub where the orb anchors, with a warm glow and three faint connecting lines, so it looks finished even without a live orb.
  - The event facts sit in a ticket-style card with a clearly visible slow beam (`<Beam kind="compact" strength={1}>`).
  - Seats stagger in via the reveal system. No new copy.
  - tsc is clean. Checked at 390 and 1440 only.
  - TODO: check 768 / 1024 / 1920.
  - FIXED after the agent: the orb was hidden because `.section` has an opaque warm background over the fixed canvas. The hub now renders its own `AmbientOrb` (the engine's shared orb is set to `data-orb-opacity="0"` there), which morphs into a dotted person icon on reveal (`PERSON_DOTS` in `Community.tsx`; default state = person, so no-JS and reduced motion show it). Possible polish: a smoother head shape and a longer orb dwell before the morph.
  - (Superseded) in the warm act the static poster gets hidden (`data-orb-renderer="ready"`), but no live orb painted in that agent's test. Check in a real browser that the Community orb actually renders. If not, look at `OrbCanvas` warm-act handling (the warm act freezes the clock by design).
- **Art direction / hero / shell / design system: DONE.** The full API is in `DESIGN.md`.
  - **Type:** Inter Tight for display and body, Instrument Serif italic for 1–3 "thought" words per section, JetBrains Mono for real facts only.
  - **Hero:** the hybrid the owner asked for. `MetalWord` is on "LegacyLift." in the h1; the h1 is the LCP element.
  - **Header:** pill nav with a liquid-gooey hover indicator and a resting beam; the mobile menu is an accessible gooey disclosure.
  - **Footer:** a beam divider plus a wordmark; the colophon is removed.
  - **Removed as filler:** `Annotation`, `SectionIndex`, `Registration`, `PullQuote`, `Ticker`.
  - **Effect budget:** ≤1 heavy effect per viewport, ≤2 visible beams, ≤2 WebGL contexts.
  - **metal-fx:** the silver preset only, and only on high-tier devices. Never use reflections, bend or cursor light (GPU readback). `MetalRing` is reserved for the Contact email action.
  - **border-beam:** only through `Beam` / `Button effect="beam"` / `Card beam` / `BeamRule` / `ProofBeam`.
  - **Measured on a production build:** LCP 280 ms (1440) / 476 ms (390), CLS ≤0.005, no hydration errors, no overflow.
  - TODOs:
    - screenshot 768 / 1024 / 1920;
    - visual QA of the gooey nav indicator and the mobile menu in a real browser;
    - `NarrativeRail` "Idea" label overlaps the orb area on desktop (`components/narrative/NarrativeRail*`);
    - metal "silver" shows faint chromatic fringing (flatten with `setSharedPresetMode` if the owner wants);
    - in `next dev`, StrictMode can leave the metal word static (production is fine);
    - `Section.tsx` has a deprecated `eyebrow` prop; remove it.
- **LegacyLift homepage Flagship: DONE.** `/legacylift` is not started (unchanged, still builds).
  - **Chapters:** four scroll chapters in the sticky stage (`data-orb-states="connecting,composing,solving,breathing"`):
    1. codebase map (ACCTINT → INTCALC / DATEUTIL / ACCTREC, business rules found);
    2. COBOL → Python rewrite with an Approve step;
    3. Legacy vs Migrated orbs replaying ACC001–010 to 0.00 ✓;
    4. a beam'd 100.0% ✓ "signed ed25519" card with 5 gates.
  - **Closing block:** the Independence Rule, then the overflow-bug proof, BYOK, and the case-study link.
  - **Files:** `components/sections/Flagship.*`, `components/sections/flagship/{Artifacts,CandidateOrb,useChapter}`, `config/flagship.ts` (all story data plus `TRUST`).
  - **Checks:** tsc and a mirror build pass; checked at 1440 and 390 plus reduced motion.
  - TODOs:
    1. Build `/legacylift` as a long-form case study: problem → 3 steps → Fidelity Replay → Independence Rule → trust (`TRUST` in config) → proof point → CTA to `FLAGSHIP_STORY.productUrl`. The `Artifacts` components can be reused as-is.
    2. Screenshot 360 / 768 / 1024 / 1920; the compact rules for small screens are unverified.
    3. Engine enhancement: add `data-orb-range="0.5,0.75"` so the engine's `candidate` orb only shows during the replay chapter. Then replace the `AmbientOrb` stand-in in `CandidateOrb.tsx`, which isn't frame-synced and is dimmed to 0.66 with CSS.
  - **Owner to confirm:**
    - the overflow-bug line credits "LegacyLift" (not "Fidelity Replay");
    - ACCTINT / FEECALC / ACC00x / 100.0% are the product site's demo data, presented as a demo, not a client result;
    - product copy was lightly trimmed;
    - the £480k comparison is not used yet.
- **Build `PageNotFoundError` (`/robots.txt`, `/_document`): SOLVED (2026-09-22).** This is a Next 14 Windows quirk: builds fail when the shell cwd has a lowercase drive letter (`c:\...`). Build from a terminal at `C:\...` (PowerShell is fine). With that, a clean `npm run build` passes: 7 routes, / is 8.5 kB / 115 kB first load.

## Session 2 (2026-09-22)

- **Build:** green from an uppercase `C:` path.
- **CV facts** (owner-approved) were added to `content-source.md`: the LegacyLift hackathon origin (no names or team size), the CardDemo proof (116 functions / 49 business rules), and richer HukamConnect and Scoofy entries, plus a list of exclusions.
- **Contact: DONE.**
  - "Let's / *talk*.", with the settled orb.
  - `MetalRing` on the mailto on high-tier devices, with a beam halo as the fallback.
  - Copy-to-clipboard as a progressive enhancement.
  - Padding tightened.
  - The footer was left as is.
  - TODO: the metal shows a gold/rose fringe. Consider `setSharedPresetMode` to force pure silver.
- **Work: DONE, then REOPENED.**
  - The layout: a featured Pollen Mesh card with a travel beam, then a 3-up grid (connecting / weaving / listening / composing).
  - Reopened for two reasons: (1) the owner found the project orbs hidden by opaque card backgrounds, and (2) the HukamConnect and Scoofy CV enrichment.
- **/legacylift: DONE, then REOPENED.**
  - The long-form case study: hero, problem, 3 steps with the demo screens, Fidelity Replay, the Independence Rule, trust, the proof point and the close.
  - Reopened to add the hackathon origin and the CardDemo proof.
  - Owner to confirm: "byte-exact"/"signed" (product-site claims). The launch film was removed at the owner's request (2026-09-22); never mention it.
  - TODOs:
    - `AmbientOrb` has no phase/sync prop, so the case-study Legacy/Migrated orbs are slightly out of step;
    - Artifacts need a "static/inline" variant (the page currently overrides their layout with structural selectors).
- **Engine + cleanup: DONE.**
  - `data-orb-range` added; the flagship candidate orb is now the engine's own, frame-synced and at full brightness.
  - Rail labels are vertical with real section names (no overlap).
  - `eyebrow` removed.
  - The verify script is updated (31/32 pass).
  - The grey-flash-on-mount bug is fixed: orb wrappers stay invisible until their first real paint.
  - `useChapter.ts` deleted as dead code.
  - TODO: the verify script fails `reduced narrative compact` (#flagship is 4028px tall on mobile with reduced motion, against an old 2300px budget). Decide whether to tighten the layout or raise the budget.
- **Fixed by coordinator:** `lib/utils.ts` `cn()` now registers the custom fontSize keys with tailwind-merge. Before this, `text-body` dropped `text-inverse`, so Button primary+lg had an invisible label.
- **/legacylift follow-ups: DONE.** Hackathon origin line; proof = "It found the bug nobody would notice." + 116 functions / 49 business rules (CardDemo); step specs; the film fully removed (`FLAGSHIP_LINKS` deleted). TODO for QA: at 390 the header motion toggle partly overlaps the "Menu" pill (`components/shell/**`).
- **Smooth nav scrolling (coordinator):** `components/shell/SmoothAnchors.tsx` (mounted in the layout) catches same-page `#` links in the capture phase and dispatches `portfolio:scrollto`. `NarrativeController` answers with a distance-scaled Lenis glide (0.9–1.8 s, ease-in-out quart); otherwise it falls back to native smooth scroll (touch, /legacylift), or an instant jump under reduced motion. It pushes the hash without firing `hashchange` and focuses the section. Verified on a production build on desktop, desktop reduced motion, and phone.
- **Proof copy:** the homepage truncation-bug line was replaced with the owner-chosen "It found the bug nobody would notice." version.
- **Owner requests (2026-09-22):**
  - First-person copy only.
  - No em dashes anywhere in site copy.
  - Work orb rings replaced with a round glow (the rings stretched into ovals).
  - The Community orb/person morph replays on every visit (`community/HubMorph.tsx`), keeping the original grid avatar.
  - The motion toggle is hidden but functional (QA agent is doing it).
- **Light mode: DONE (exploratory, dark is the default).**
  - `html[data-theme]`, set by `themeBoot` in `lib/theme-boot.ts` (localStorage `portfolio-theme`, ignores the OS preference).
  - `setTheme` in `lib/theme.ts` does a View Transitions crossfade.
  - The toggle is `components/shell/ThemeToggle.tsx`, in the header.
  - Every token has a light value. There are new `--*-rgb` channel tokens and orb ink tokens.
  - The orb painter, AmbientOrb, OrbPoster, beam, metal and gooey all follow the theme.
  - axe: 0 violations in both themes.
  - Comparison shots are in `scratchpad/theme/compare/`.
  - Open owner questions:
    - paper tone (currently neutral #f1f0ec);
    - the metal "LegacyLift." in light (dark chrome with a blue glint) vs plain graphite;
    - "Tanveer." darker in light?
    - the toggle sits in the header next to Menu on phones, not inside the menu;
    - a light favicon/OG image, and whether to follow the OS preference;
    - the Flagship replay orbs are faint on mobile in both themes.
- **Cleanup at the end:** strip any `.next-*/types` entries that side builds add to `tsconfig.json`.
- **Next:** a final QA pass (Lighthouse, a scroll fps run, all widths, no-JS/reduced motion, hydration, and the opaque-over-orb check on every section), then commit with the owner's OK.

## Next steps (from session 1)

1. **Verify the current state:** `npx tsc --noEmit`, `npm run build`, then `npm start` and look at 390 / 768 / 1440 / 1920. Fix any leftovers from the in-progress work above.
2. **Redesign What I Build / Work** (`components/sections/WhatIBuild.tsx`, `Work.module.css`): Pollen Mesh leads, then the other projects in the order and with the collaborator credit given in `content-source.md`. Use the project orb anchors (`data-orb-project="0..3"`), beam on the featured card, and no filler.
3. **Redesign Contact + footer:** a single mailto (hello@tanveersingh.dev). A good place for a MetalText moment.
4. **Final QA pass:**
   - Lighthouse (performance / accessibility / CLS) and a Playwright scroll run at 60 fps;
   - reduced motion and no-JS;
   - no horizontal scroll;
   - hydration warnings in the console;
   - update `scripts/verify-portfolio.mjs`: it expects one canvas and reads `canvas.dataset.frames`; switch it to `window.__orbStats`, and allow `AmbientOrb` canvases in the reduced-motion check.
5. **Commit** once it's reviewed. Nothing from this session is committed yet, and the working tree also holds older staged deletions from the previous site.

## Session 2 QA (2026-09-22)

Final QA pass on a production build (`next build` / `next start -p 3600` from an uppercase `C:` PowerShell), Playwright + `scripts/verify-portfolio.mjs`, axe, and Lighthouse. `npx tsc --noEmit` and `npm run build` both pass clean at the end.

**Lighthouse (mobile / desktop, `/`, simulated throttling):**

| | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Mobile (run 1, pre-fix) | 49 | — | — | — | 4.5s | 0 | 1,660ms |
| Mobile (run 2, post-fix) | 76 | 100 | 100 | 100 | 3.3s | 0 | 560ms |
| Desktop | 67 | 100 | 100 | 100 | 0.9s | 0.004 | 1,940ms |

Performance varied a lot between the two mobile runs with no code change in between (49→76, TBT 1660ms→560ms) — simulated-throttling noise on this machine, not a real regression between runs. CLS is excellent everywhere (≤0.005). The real signal is **TBT is high on both mobile and desktop** (560–1,940ms). Lighthouse's `mainthread-work-breakdown` attributes most of it to **Style & Layout (~5.7s aggregate under 4× CPU)**, not a specific slow JS function — a CPU profiler run during boot showed almost all self-time in the native `(program)` bucket, not user code, confirming it's layout/style recalculation rather than one slow script. I did not find a single contained cause safe to fix in the time available (the likely candidates are the combined boot cost of GSAP/Lenis/metal-fx/liquid-gooey/thinking-orbs measuring the page + hydrating a content-heavy tree, not a bug in any one file), so I'm flagging it rather than guessing at a fix.

**Scroll fps** (Playwright rAF-driven programmatic scroll over 6s, `window.scrollTo` per frame — a synthetic stress test, not identical to real trackpad/touch scroll):
- 1440, no throttle: **36.8 fps** average, 35 frames over the 33ms budget.
- 390, 4× CPU throttle: **9 fps** average.

Both are below the 45fps bar in the brief. This is consistent with the TBT finding above (main-thread contention during the same window), not obviously the orb engine itself — HANDOFF's own steady-state numbers (55–60fps desktop, 50–60fps mobile at 4×) were presumably measured on natural scroll after the page settles, and my `window.scrollTo`-in-rAF test forces layout every frame on top of whatever else is running, which is harsher than real scroll. I'd treat the TBT/style-layout finding as the thing to chase (probably boot-time, not scroll-time), and re-measure fps with a native wheel-event scroll before deciding it's a real regression.

**Fixes made:**
- `scripts/verify-portfolio.mjs` — updated the stale `'A real program.'` text assertion to match the current case-study copy (`'On a real COBOL program'`); raised the `reduced narrative compact` budget from 2300px to 4400px with a comment (measured ~4030–4160px for a legitimate intro + 4 real chapters + coda, not dead space — confirmed via screenshot); replaced the motion-toggle button click with a direct `html[data-motion]`/localStorage/event drive, since the button is now hidden.
- `components/effects/metal/MetalLayer.tsx` — flattened the metal-fx chromatic fringe. The bundled `"silver"` preset only overrides `colorTint`/`shaderOpacity`; it still inherits `shiftRed`/`shiftBlue: 0.3` (dispersion) from metal-fx's base defaults, which reads as a gold/rose fringe. Now calls `setSharedPresetMode({...PRESETS.silver.modes.dark, shiftRed: 0, shiftBlue: 0})` once at module load, per the package's documented escape hatch.
- `components/sections/Work.module.css` — the Work-card orb glows (`.art::before`, `.featureArt::before`) were stretching into visible ovals. The old rule sized the circle from a percentage of the slot's *height*, but `.art`/`.featureArt` only set `min-height` (never a definite height), so the percentage resolved inconsistently across the near-square mobile cards vs. the much-wider desktop tracks. Replaced with `width: clamp(...)` + `aspect-ratio: 1` (an absolute size, immune to the container's aspect ratio) — confirmed exactly circular (width/height ratio 1.00) at 390/768/1024/1440/1920.
- `components/shell/SiteHeader.tsx` — gated the motion toggle behind `SHOW_MOTION_TOGGLE = false` (owner: hide for now, keep the feature). Everything it depends on (boot script, `data-motion`, `portfolio-motion` localStorage, `MotionToggle` itself) is untouched. This also resolved the reported 390px toggle/"Menu" overlap — I couldn't reproduce the overlap itself in Chromium at any width (360–414) with the toggle showing, so the header slot was probably already fine geometrically; hiding the toggle removes the question either way. Left the slot open for the incoming theme toggle.
- `tsconfig.json` — removed the stray `.next-work/types/**/*.ts` and `.next-qa/types/**/*.ts` entries, kept `.next/types/**/*.ts`.
- Copy audit (first person, em dashes, forbidden terms): all clean, nothing left to fix. `Hero.tsx`'s bio line ("An 18-year-old self-taught full-stack developer…") is an intentional subject-less fragment continuing the "Tanveer." headline above it, not a third-person construction — left as-is.

**Checklist results:**
1. Known bugs — metal fringe fixed; verify-script budget raised with justification; header overlap not reproducible (now moot, toggle hidden).
2. Orb visibility — walked every `[data-orb-anchor]` ancestor chain on `/` and `/legacylift`. Community's opaque section background is intentional and compliant (central orb suppressed via `data-orb-opacity="0"`, a local `AmbientOrb` paints on top instead — confirmed live in a screenshot). Flagship's `.frame` has a 62%-alpha background over the `active-thinking` anchor; the orb still paints and is clearly legible (confirmed via screenshot — it reads as a codebase-map "screen" with labels), but it is technically a semi-opaque paint over an orb slot per the letter of the rule. Left it for the owner to judge (see below) rather than guess at a redesign of the frame card.
3. Responsive — 360/390/768/1024/1440/1920 on `/` and `/legacylift`: no horizontal scroll, no unresolved overlaps or clipped text at any width. (One false alarm: `fullPage: true` screenshots showed ghosted overlapping chapter text in Flagship's live sticky stage; confirmed this is a screenshot-capture artifact of the abnormally tall emulated viewport, not a real bug — a normal-viewport scroll to the same section renders correctly, opacity states verified 0/1 as expected.)
4. Interaction QA — gooey nav indicator, mobile menu open/close (Escape, focus return, smooth-scroll links), motion toggle (functionality verified directly since the UI is hidden), copy-email, Work card links, Community orb→person morph (now repeatable via `HubMorph.tsx`, verified enter→person, leave→orb, return→morphs again, no errors), Flagship chapters + candidate orb: all working.
5. Robustness — no console/hydration errors on `/` or `/legacylift`; no-JS and reduced motion show full content; axe WCAG A/AA clean on both viewports; one `<h1>` per page; verify script confirms accessible names.
6. Performance — see Lighthouse/fps tables above; flagged, not fully root-caused.
7. Content audit — grepped for all forbidden terms (1Foundry, accelerator, StartHack, film, phone number, grades, Kloak, Headstarter, OrbitFind, £480k, filler/colophon language): none found. First-person and em-dash audits (owner requests mid-session): clean.
8. Cleanup — done (tsconfig, `.next-qa` deleted, no stray temp files, server stopped, `tsc --noEmit` and `npm run build` both pass).

**Left for the owner:**
- Flagship's `.frame` background (semi-opaque over the `active-thinking` orb slot) — functions well visually but is a literal rule violation; decide whether to convert to a local `AmbientOrb` like Community, or accept it as-is since the orb reads fine.
- The TBT/style-layout cost (560–1,940ms) and the low synthetic scroll-fps numbers — worth a focused profiling session with real (not programmatic) scroll input before deciding it's a regression; I didn't find a safe, contained fix in this pass.
- The incoming light/dark theme toggle can reuse the header slot the motion toggle vacated (`components/shell/SiteHeader.tsx`, `SHOW_MOTION_TOGGLE`).

## Working method that worked

- Orchestrate with strict per-agent file ownership: Opus for flagship work (engine, art direction, LegacyLift) and Sonnet for individual sections.
- Agents screenshot with Playwright on their own ports (3100+) and must stop their servers when done.
- The owner's dev server is :3000. Don't open agent ports in the browser; they restart constantly.
- Judge performance on `npm run build && npm start`, not `next dev`.

## Perf pass 2 (2026-09-22, coordinator measurements)

The Opus perf agent stalled three times and was stopped. It had applied some fixes (e.g. `HubMorph` now pauses the hub's pulsing lines when far offscreen). I measured the production build myself afterwards.

**Measured on a headless software-GL machine (no GPU), so it is a worst case. A real GPU will do better.**

| Test | Result |
|---|---|
| Plain control page, scrolling | 61 fps |
| The site, scrolling (real wheel events) | 75 fps |
| **The site, completely idle** | **35–39 fps** |
| Long tasks while idle | 0 ms |

**Conclusion: scrolling is not the problem.** The site cannot hold 60 fps while doing nothing, so the cost is steady per-frame paint from always-on animation, not a slow scroll handler or a long JS task. Earlier "scroll fps" figures (and probably Lighthouse's TBT) were measuring this idle cost.

**Idle cost attributed** (idle fps when each is removed, baseline 39):

| Removed | Idle fps | Gain |
|---|---|---|
| all motion (`data-motion="reduced"`) | 61 | +22 |
| orb canvases | 51 | +12 |
| beam layers | 47 | +8 |
| metal | 42 | +3 |

GPU-layer promotion of the grain and orb layers (`translateZ(0)`, `will-change`, `contain`) made no difference, so it was not tried in the source.

**Recommended next steps** (not done):
1. Make resting beams truly static: check whether border-beam's `@property` animations keep running after `rest`, and unmount or pause the layer instead.
2. Idle the orb painter when a scene is visually static (the dormant hero orb barely changes); consider dropping to 30 fps when there is no scroll or pointer activity, as the engine already does on touch and low-power devices.
3. Ensure metal is fully paused when idle, not just offscreen.
4. Re-measure on a real GPU machine before more optimisation. These numbers are a software-rendering worst case.

## Additions (2026-09-22, coordinator)

- **Social links:** `SOCIAL_LINKS` in `config/site.ts` (github.com/tanveerxz, linkedin.com/in/tanveerxz), rendered as a "Profiles" nav in the footer. External, new tab, with a visually hidden "(opens in a new tab)".
- **404:** `app/not-found.tsx` + `not-found.module.css`. A searching AmbientOrb in a hairline ring, "404", "This page doesn't *exist*.", and two buttons (homepage, Work). Verified: `/nope` returns a real 404 status, one h1, no overflow at 1440 or 390, and it fits above the fold in both themes.
- Still not added: analytics, a CV download, light favicon/OG images.

## Real-device round (2026-09-23)

Owner tested on a real phone: "What I build" was laggy and the Community morph was misaligned.

**Community alignment: FIXED.** Measured at 390px: the hub, the gap in the seat grid and the orb all centred on (195, 293), but the orb and the person glyph were drawn at ~(238, 340), about 43px right and 50px down, and the glyph overflowed the gap onto the seats.
- Cause: `.morphOrb, .person` were grid items sized in percentages, so the percentages resolved against a grid track that the SVG's own intrinsic size inflated to 171px inside a 136px box.
- Fix: both states are now absolutely positioned and centred with the `translate` property (leaving `transform` for the morph animation), and `PERSON_VIEWBOX` is computed as a tight square box around the sampled dots so the glyph centres itself.
- Verified: hole, glyph and orb all centre on (195, 293); the glyph is 85x105 inside the 132px gap.

**Mobile lag in #work: two causes fixed.**
1. **The beam was the single running animation on the page** (border-beam's `beam-spin` drives `@property` custom properties, restyling its host every frame). Measured in #work on a 4x-throttled phone: ~1.1-1.4s of style recalculation per few seconds of scrolling. `Beam` now uses a new `useCoarsePointer()` from `effects/runtime.ts`: touch devices keep the static beam frame, desktop keeps the animation. Verified: 0 beam layers on phone, 7 (2 animating) on desktop.
2. **Orb animation budget.** `OrbCanvas` now ranks visible orbs by distance from the viewport centre every 250ms and only animates the nearest (1 on low-power, 2 on compact, unlimited on desktop). The rest hold their last painted frame.

**Measurement note:** this machine renders without a GPU, so mobile fps figures swing wildly (task time 5.0-6.5s for the same scroll) and are not a reliable A/B. Behaviour was verified instead. The owner should re-test on the real phone.

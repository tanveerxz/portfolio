---
name: Tanveer Portfolio
description: A precise, cinematic portfolio built around a continuous silver reasoning object.
colors:
  silver-ink: "#edeef2"
  muted-silver: "#b3b7c2"
  quiet-silver: "#9096a4"
  void-charcoal: "#0b0d12"
  raised-charcoal: "#12151c"
  panel-charcoal: "#1a1e27"
  warm-charcoal: "#181715"
  reflected-periwinkle: "#c2c8fa"
  bright-periwinkle: "#d9ddff"
  hairline: "rgba(224, 229, 244, 0.16)"
typography:
  display:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 7.3vw, 7.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2.4rem)"
    fontWeight: 500
    lineHeight: 1.28
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  numeric:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  control: "8px"
  container: "14px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section-sm: "96px"
  section-lg: "160px"
components:
  button-primary:
    backgroundColor: "{colors.reflected-periwinkle}"
    textColor: "{colors.void-charcoal}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.panel-charcoal}"
    textColor: "{colors.silver-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
---

# Design System: Tanveer Portfolio

## Overview

**Creative North Star: "Silver Thought"**

The interface behaves like a dark editorial stage for one continuous reasoning object. Precise type and generous negative space carry the factual story while silver filaments move from dormant potential through verification, fragmentation, human warmth, and rest. The visual language is technical without resembling a dashboard: there are no decorative panels around every fact, and the dimensional object is the only deliberately spectacular element.

The system is quiet, cinematic, and exact. Warmth appears only when the story turns toward people; pale periwinkle is reflected light and action emphasis, never a competing multicolour brand layer.

**Key Characteristics:**

- Charcoal fields with luminous silver and restrained periwinkle.
- Oversized editorial headings paired with calm, narrow prose measures.
- One persistent filament object whose state follows the narrative.
- Hairline structure and open layouts instead of stacked cards.
- Motion is reversible, optional, and absent from essential meaning.

## Colors

The palette is nearly monochrome; small temperature shifts signal narrative state rather than decoration.

### Primary

- **Reflected Periwinkle:** Reserved for primary actions, focus, and the coolest highlights on the reasoning object.

### Neutral

- **Void Charcoal:** The primary page field and highest-contrast inverse text.
- **Raised Charcoal:** Translucent navigation and secondary control surfaces.
- **Panel Charcoal:** Secondary button fills and occasional tonal separation.
- **Warm Charcoal:** The leadership field, where the technical object recedes.
- **Silver Ink:** Display and high-priority text.
- **Muted Silver:** Body copy and navigation.
- **Quiet Silver:** Supporting and footer text.
- **Hairline:** Dividers and control outlines that organize without boxing content.

### Named Rules

**The Reflected Light Rule.** Periwinkle belongs to action, focus, and optical reflection; it does not become a large background field.

**The Temperature Shift Rule.** Human stories may warm the charcoal ground, but the site never flips into a separate light theme.

## Typography

**Display Font:** Manrope (with a system sans-serif fallback)
**Body Font:** Manrope (with a system sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with a system monospace fallback)

**Character:** Manrope provides broad, precise editorial forms without separating display and body into competing personalities. JetBrains Mono appears only where numeric or code-like information benefits from tabular rhythm.

### Hierarchy

- **Display** (500, fluid 54.4–116px, 1.02): Identity and first-view statements; keep desktop hero copy to two conceptual lines.
- **Headline** (500, fluid 40–80px, 1.08): Section declarations with substantial space before supporting detail.
- **Title** (500, fluid 24–38.4px, 1.28): Project and verification-step names.
- **Body** (400, 16–18px, 1.65): Explanations, usually held between 35 and 60 characters per line.
- **Label** (500, 13px, 0.02em): Numeric or code-adjacent facts, never ornamental overlines.

### Named Rules

**The Declaration Rule.** Headings state the idea directly; do not add a small introductory label above them.

## Layout

The page uses a centered 1440px maximum container with fluid side padding from 24px to 88px. Desktop sections alternate broad two-column compositions, asymmetrical project groupings, and open single-column moments. Major vertical intervals range from 112px to 160px; mobile uses 72px to 96px and collapses every composition into natural reading order.

The fixed visual canvas sits behind content and aligns its geometry to reserved art slots. Those slots remain sized in static and reduced-motion modes, preventing layout shifts. The header is 76px on desktop and 68px on mobile.

## Elevation & Depth

Depth is optical rather than card-based. The page uses translucent header glass, filament luminance, subtle control borders, and a single ambient glow under the primary hero action. Content surfaces stay flat; separators and temperature changes establish hierarchy.

### Shadow Vocabulary

- **Action glow** (`0 18px 42px -20px rgba(194, 200, 250, 0.72)`): Used only under the first primary action.
- **Orb depth** (`drop-shadow(0 20px 38px rgba(5, 7, 13, 0.7))`): Gives the reduced-motion poster enough separation from the field.

### Named Rules

**The Optical Depth Rule.** Dimensionality belongs to the reasoning object and active controls, not to stacks of floating content cards.

## Shapes

Most content is unboxed and rectilinear. Hairlines make divisions; 8px corners belong to compact panels and mobile navigation; 14px corners are available for larger containers. Actions and header controls use full pills. The recurring circular silhouette is reserved for the filament object and its derived project forms.

## Components

### Buttons

- **Shape:** Full pill with a minimum 44px target.
- **Primary:** Periwinkle fill, charcoal text, and 12px by 24px padding.
- **Hover / Focus:** A brighter periwinkle hover and a 2px visible focus outline with 4px offset.
- **Secondary / Ghost:** Secondary uses a charcoal fill plus hairline border; ghost stays transparent until hover.

### Cards / Containers

- **Corner Style:** Content generally has no enclosing card; larger containers use 14px only when a real surface is needed.
- **Background:** Inherits the section field.
- **Shadow Strategy:** None for ordinary content.
- **Border:** Single hairline divisions between related facts or projects.
- **Internal Padding:** Spacing follows the 8/16/24/32px rhythm.

### Navigation

The desktop header centers four plain-language anchors. Links use muted silver, 44px targets, pill hover fields, and no persistent active decoration. Mobile replaces the anchor row with a compact menu panel while preserving the separate motion control.

### Reasoning Object

The signature object is one Three.js filament system and one conceptual object. Its state is dormant, active-thinking, fragmented, warm/receded, or settled. Static posters preserve the same state grammar when motion or WebGL is unavailable. It is decorative and never carries essential text.

## Do's and Don'ts

### Do:

- **Do** keep factual copy visible without JavaScript, WebGL, or motion.
- **Do** reserve generous negative space around large declarations and optical forms.
- **Do** use one periwinkle action as the dominant control in a viewport.
- **Do** let project layouts vary while retaining the same silver material family.
- **Do** honor the 44px target and visible focus treatment on every control.

### Don't:

- **Don't** wrap ordinary facts in repeated cards or equal feature grids.
- **Don't** introduce unrelated accent colours or a light-theme interlude.
- **Don't** add ornamental labels above self-explanatory headings.
- **Don't** make essential meaning depend on animation, hover, or the canvas.
- **Don't** duplicate the reasoning object with additional WebGL contexts.

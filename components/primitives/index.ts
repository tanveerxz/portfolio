/**
 * The shared primitives. build/00-foundation.md §4.
 *
 * No section may define its own button, surface, card, field or section
 * wrapper. The old build shipped three independent `Button` implementations
 * and that is exactly how its copy drifted out of sync.
 */

export { Button } from "./Button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./Button";

export { Surface, surfaceVariants } from "./Surface";
export type {
  SurfaceProps,
  SurfaceBorder,
  SurfaceElement,
  SurfaceElevation,
  SurfacePadding,
  SurfaceRadius,
  SurfaceTone,
} from "./Surface";

export { Card } from "./Card";
export type { CardProps, CardElement } from "./Card";

export { Field } from "./Field";
export type { FieldProps, FieldOption } from "./Field";

export { Section } from "./Section";
export type { SectionProps } from "./Section";

export { Stat, StatRow } from "./Stat";
export type { StatProps, StatElement } from "./Stat";

export { Prose } from "./Prose";
export type { ProseProps, ProseElement } from "./Prose";

export { MetaStrip } from "./Density";
export type { MetaItem } from "./Density";

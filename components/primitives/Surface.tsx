import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one glass/panel recipe. build/00-foundation.md §3 + §4.
 *
 * The old build reimplemented this in five-plus components with drifting
 * opacity values. The recipe now exists exactly twice: the `.surface-glass`
 * class in `app/globals.css` (which owns the `color-mix()` background and
 * its fallback) and the variant table below.
 */
const surfaceVariants = cva("relative", {
  variants: {
    tone: {
      /** The glass recipe: color-mix over --surface-1 + backdrop blur. */
      glass: "surface-glass backdrop-blur-md",
      /** Opaque raised panel. */
      solid: "bg-surface-1",
      /** Nested/recessed panel — inputs and inner wells. */
      sunken: "bg-surface-2",
      /** Structure only: borders and radius, no fill. */
      bare: "bg-transparent",
    },
    border: {
      none: "border-0",
      subtle: "border border-subtle",
      default: "border border-default",
      strong: "border border-strong",
    },
    radius: {
      none: "rounded-none",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    elevation: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    },
  },
  defaultVariants: {
    tone: "glass",
    border: "default",
    radius: "lg",
    padding: "md",
    elevation: "md",
  },
});

type SurfaceVariants = VariantProps<typeof surfaceVariants>;

export type SurfaceTone = NonNullable<SurfaceVariants["tone"]>;
export type SurfaceBorder = NonNullable<SurfaceVariants["border"]>;
export type SurfaceRadius = NonNullable<SurfaceVariants["radius"]>;
export type SurfacePadding = NonNullable<SurfaceVariants["padding"]>;
export type SurfaceElevation = NonNullable<SurfaceVariants["elevation"]>;

/** Elements a Surface is allowed to render as — no arbitrary tag names. */
export type SurfaceElement =
  | "div"
  | "article"
  | "aside"
  | "figure"
  | "li"
  | "section"
  | "span";

export interface SurfaceProps
  extends Omit<HTMLAttributes<HTMLElement>, "className" | "children"> {
  as?: SurfaceElement;
  tone?: SurfaceTone;
  border?: SurfaceBorder;
  radius?: SurfaceRadius;
  padding?: SurfacePadding;
  elevation?: SurfaceElevation;
  className?: string;
  children?: ReactNode;
}

export function Surface({
  as = "div",
  tone,
  border,
  radius,
  padding,
  elevation,
  className,
  children,
  ...rest
}: SurfaceProps) {
  const Component: ElementType = as;

  return (
    <Component
      {...rest}
      className={cn(
        surfaceVariants({ tone, border, radius, padding, elevation }),
        className,
      )}
    >
      {children}
    </Component>
  );
}

export { surfaceVariants };

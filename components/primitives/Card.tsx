import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Surface,
  type SurfaceBorder,
  type SurfaceElevation,
  type SurfacePadding,
  type SurfaceTone,
} from "./Surface";

/**
 * Surface + optional media + `<h3>` title + body + footer actions.
 * build/00-foundation.md §4.
 *
 * The heading tag is fixed at `<h3>` because §1 fixes it: cards and
 * sub-blocks are h3. It is not a prop, so a card cannot be promoted to an
 * h2 to make it look bigger — size comes from a type token.
 *
 * Nothing in this component is hover-only (§0.5). Hover changes the border
 * and background only; every piece of content is present at rest.
 */

const PADDING_CLASS: Record<SurfacePadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export type CardElement = "article" | "li" | "div";

export interface CardProps {
  /** Rendered as the card's `<h3>`. Required — a card always has a heading. */
  title: string;
  /** Set when something else needs `aria-labelledby` pointing at this card. */
  titleId?: string;
  /** Small mono label above the title (category, year, status). */
  eyebrow?: ReactNode;
  /** Full-bleed slot above the content — image, chart, canvas poster. */
  media?: ReactNode;
  /** Actions or metadata pinned to the bottom of the card. */
  footer?: ReactNode;
  children?: ReactNode;
  as?: CardElement;
  tone?: SurfaceTone;
  border?: SurfaceBorder;
  elevation?: SurfaceElevation;
  padding?: SurfacePadding;
  /** Adds a hover affordance. Only ever changes chrome, never reveals content. */
  interactive?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Card({
  title,
  titleId,
  eyebrow,
  media,
  footer,
  children,
  as = "article",
  tone,
  border,
  elevation,
  padding = "md",
  interactive = false,
  className,
  contentClassName,
}: CardProps) {
  return (
    <Surface
      as={as}
      tone={tone}
      border={border}
      elevation={elevation}
      padding="none"
      className={cn(
        "flex flex-col overflow-hidden",
        interactive &&
          "transition-colors duration-base ease-standard hover:border-strong hover:bg-surface-2",
        className,
      )}
    >
      {media ? (
        <div className="relative w-full overflow-hidden border-b border-subtle">
          {media}
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-1 flex-col gap-3",
          PADDING_CLASS[padding],
          contentClassName,
        )}
      >
        {eyebrow ? (
          <div className="text-mono uppercase text-tertiary">{eyebrow}</div>
        ) : null}

        <h3 id={titleId} className="text-h3 text-primary">
          {title}
        </h3>

        {children ? (
          <div className="text-body text-secondary">{children}</div>
        ) : null}

        {footer ? (
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {footer}
          </div>
        ) : null}
      </div>
    </Surface>
  );
}

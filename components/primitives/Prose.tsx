import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Long-form copy at the §3 measure. build/00-foundation.md §4.
 *
 * Element styling (paragraph rhythm, lists, links, inline code) lives in the
 * `.prose` class in `app/globals.css`, so authored content gets it without
 * every caller repeating a stack of `[&_a]:` arbitrary variants.
 */

export type ProseElement = "div" | "section" | "article" | "aside";

export interface ProseProps
  extends Omit<HTMLAttributes<HTMLElement>, "className" | "children"> {
  as?: ProseElement;
  /** Body type token. Default `body`. */
  size?: "body" | "body-lg";
  /** `measure` caps the line length at 68ch (§3). `none` fills its container. */
  measure?: "measure" | "none";
  className?: string;
  children: ReactNode;
}

const SIZE_CLASS: Record<NonNullable<ProseProps["size"]>, string> = {
  body: "text-body",
  "body-lg": "text-body-lg",
};

export function Prose({
  as = "div",
  size = "body",
  measure = "measure",
  className,
  children,
  ...rest
}: ProseProps) {
  const Component: ElementType = as;

  return (
    <Component
      {...rest}
      className={cn(
        "prose",
        SIZE_CLASS[size],
        measure === "measure" && "max-w-prose",
        className,
      )}
    >
      {children}
    </Component>
  );
}

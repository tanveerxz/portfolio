import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Prose } from "./Prose";

/**
 * `<section>` + `aria-labelledby` + its own `<h2>` + the §3 vertical rhythm.
 * build/00-foundation.md §1 and §4.
 *
 * The heading outline is enforced structurally rather than by convention:
 *   - `title` is required, so a section cannot exist without an `<h2>`;
 *   - the tag is fixed at `h2` and is not a prop, so nothing can be promoted
 *     to `h1` for size (size comes from the `text-h2` token);
 *   - `aria-labelledby` is derived from `id`, so the landmark and its label
 *     cannot drift apart.
 *
 * The rhythm (`py-24 md:py-32`) is uniform by design. The flagship earns its
 * weight through scale, type and motion — not by breaking the rhythm (§3).
 */

export interface SectionProps {
  /** Anchor target and the stem of the generated heading id. Required. */
  id: string;
  /** Rendered as this section's `<h2>`. Required. */
  title: string;
  /** Small mono label above the heading. */
  eyebrow?: string;
  /** Intro paragraph rendered at the §3 prose measure. */
  lead?: ReactNode;
  /** Buttons or links rendered under the header. */
  actions?: ReactNode;
  /**
   * Keeps the `<h2>` in the accessibility tree and the outline, but hides it
   * visually. The heading still exists — it is never omitted.
   */
  titleVisuallyHidden?: boolean;
  /** `flagship` tints the heading with the reserved accent (§3). */
  tone?: "default" | "flagship";
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Section({
  id,
  title,
  eyebrow,
  lead,
  actions,
  titleVisuallyHidden = false,
  tone = "default",
  className,
  containerClassName,
  headerClassName,
  bodyClassName,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("relative scroll-mt-24 py-24 md:py-32", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-5 sm:px-8",
          containerClassName,
        )}
      >
        <header className={cn("flex flex-col gap-4", headerClassName)}>
          {eyebrow ? (
            <p className="text-mono uppercase text-tertiary">{eyebrow}</p>
          ) : null}

          <h2
            id={headingId}
            className={cn(
              "text-h2",
              tone === "flagship" ? "text-flagship" : "text-primary",
              titleVisuallyHidden && "sr-only",
            )}
          >
            {title}
          </h2>

          {lead ? (
            <Prose size="body-lg">{lead}</Prose>
          ) : null}

          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </div>
          ) : null}
        </header>

        <div className={cn("mt-12 md:mt-16", bodyClassName)}>{children}</div>
      </div>
    </section>
  );
}

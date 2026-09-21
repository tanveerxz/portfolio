import { cn } from "@/lib/utils";

/**
 * A single figure and its label. build/00-foundation.md §4.
 *
 * `value` is a required prop with no default and no fallback, and the
 * component renders nothing else in its place. There is deliberately no
 * `value?`, no `??`, no placeholder and no loading state — an unsourced
 * number cannot reach the page through this component. Every figure traces
 * to `build/content-source.md`; §0.2 admits no exceptions.
 *
 * The dev-time assertion below exists because `value: ""` would otherwise be
 * a legal way to smuggle an empty figure past the type system.
 */

export type StatElement = "div" | "li";

export interface StatProps {
  /** The figure, exactly as written in `build/content-source.md`. */
  value: string;
  /** What the figure counts. */
  label: string;
  /** Optional qualifier — a source, a period, a scope. */
  detail?: string;
  as?: StatElement;
  tone?: "default" | "flagship";
  align?: "start" | "center";
  className?: string;
}

export function Stat({
  value,
  label,
  detail,
  as = "div",
  tone = "default",
  align = "start",
  className,
}: StatProps) {
  if (process.env.NODE_ENV !== "production" && value.trim().length === 0) {
    throw new Error(
      "<Stat> requires a non-empty `value`. Every figure on the site must " +
        "trace to build/content-source.md — see 00-foundation.md §0.2.",
    );
  }

  const Component = as;

  return (
    <Component
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span
        className={cn(
          "font-mono text-h2",
          tone === "flagship" ? "text-flagship" : "text-primary",
        )}
      >
        {value}
      </span>
      <span className="text-sm text-secondary">{label}</span>
      {detail ? <span className="text-sm text-tertiary">{detail}</span> : null}
    </Component>
  );
}

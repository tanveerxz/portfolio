import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./density.module.css";

/**
 * A single figure and its label. DESIGN.md › Density › Stats.
 *
 * `value` is required with no default and no fallback — an unsourced number
 * cannot reach the page through this component. Every figure traces to
 * build/content-source.md (e.g. "300+", "2,000+", "100", "500+", "8").
 */

export type StatElement = "div" | "li";

export interface StatProps {
  /** The figure, exactly as written in build/content-source.md. */
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
        "trace to build/content-source.md.",
    );
  }

  const Component = as;

  return (
    <Component
      className={cn("flex flex-col gap-2", align === "center" && "items-center text-center", className)}
    >
      <span className={styles.statValue} data-tone={tone}>
        {value}
      </span>
      <span className={styles.statLabel}>{label}</span>
      {detail ? <span className={styles.statDetail}>{detail}</span> : null}
    </Component>
  );
}

/** Hairline-divided row of <Stat as="li">. Collapses to a stack on phones. */
export function StatRow({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <ul className={cn(styles.statRow, className)} aria-label={label}>
      {children}
    </ul>
  );
}

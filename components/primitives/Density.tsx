import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./density.module.css";

/**
 * Density through real content only (DESIGN.md › Density). Server component.
 * Small text exists only when it carries a fact the owner supplied in
 * build/content-source.md — never labels, captions, colophons or filler.
 */

export interface MetaItem {
  /** A plain key for a real fact (e.g. "Users", "Monthly visits"). */
  label: string;
  /** The fact itself, verbatim from build/content-source.md. */
  value: ReactNode;
}

/** A hairline-ruled strip of real label/value facts (e.g. a project's reach). */
export function MetaStrip({ items, className }: { items: readonly MetaItem[]; className?: string }) {
  return (
    <dl className={cn(styles.meta, className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.metaItem}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

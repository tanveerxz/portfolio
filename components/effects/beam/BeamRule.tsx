"use client";

import { Beam, type BeamTone } from "./Beam";
import styles from "./beam.module.css";

export interface BeamRuleProps {
  tone?: BeamTone;
  /** 0..1. Default 0.9. */
  strength?: number;
  /** Seconds per pass. Default 5.2 (slow; it is a divider, not a signal). */
  duration?: number;
  className?: string;
}

/**
 * A 1px hairline divider with a light travelling along it (border-beam "line").
 * Use between major blocks inside a section, or as a section's top edge.
 * Static hairline for every tier; the travelling light loads after idle,
 * only with motion on, and pauses offscreen. Decorative (role="presentation").
 */
export function BeamRule({ tone = "ocean", strength = 0.9, duration = 5.2, className }: BeamRuleProps) {
  return (
    <Beam
      kind="underline"
      tone={tone}
      strength={strength}
      duration={duration}
      radius={0}
      rest={0}
      className={`${styles.rule}${className ? ` ${className}` : ""}`}
    >
      <span className={styles.ruleLine} role="presentation" />
    </Beam>
  );
}

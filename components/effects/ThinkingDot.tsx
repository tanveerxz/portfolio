"use client";

import { AmbientOrb, type OrbState } from "@/components/narrative/AmbientOrb";

import styles from "./ThinkingDot.module.css";

export interface ThinkingDotProps {
  /** thinking-orbs state. Default "breathing". */
  state?: OrbState;
  /** 20 = inline glyph (default), 64 = small accent. */
  size?: 20 | 64;
  className?: string;
}

/**
 * The reasoning object in miniature, used inline as a live-status mark
 * (header brand, hero "Building full-time"). Decorative (aria-hidden).
 *
 * Thin wrapper over the narrative engine's shared <AmbientOrb>: one rAF and one
 * IntersectionObserver for every orb on the page, a single still frame under
 * reduced motion. Never use thinking-orbs' own <ThinkingOrb> (one 60fps rAF
 * per instance).
 */
export function ThinkingDot({ state = "breathing", size = 20, className }: ThinkingDotProps) {
  return (
    <AmbientOrb
      state={state}
      size={size}
      halo={size > 20}
      className={`${styles.dot}${className ? ` ${className}` : ""}`}
    />
  );
}

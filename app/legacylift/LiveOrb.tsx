"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useMotionMode } from "@/components/effects/runtime";
import type { OrbState } from "@/components/narrative/AmbientOrb";

import styles from "./case-study.module.css";

const AmbientOrb = dynamic(() => import("@/components/narrative/AmbientOrb").then((mod) => mod.AmbientOrb), {
  ssr: false,
  loading: () => null,
});

export interface LiveOrbProps {
  /** thinking-orbs state painted by the live orb. */
  state: OrbState;
  /** Server-rendered <OrbPoster> for no-JS / reduced motion. */
  children: ReactNode;
  /** Diameter as a fraction of min(width, height) of the slot. */
  scale?: number;
  speed?: number;
  className?: string;
}

/**
 * An orb slot for this route. There is no narrative act controller here, so
 * each idea gets its own AmbientOrb (one shared rAF, paints only on screen).
 * The slot reserves its size in CSS; the poster underneath is the no-JS and
 * reduced-motion state and fades out once the live orb is mounted.
 */
export function LiveOrb({ state, children, scale = 0.86, speed = 1, className }: LiveOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionMode();
  const [size, setSize] = useState(0);

  useEffect(() => {
    const host = ref.current;
    if (!host || motion !== "full" || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (!box) return;
      const next = Math.max(40, Math.round(Math.min(box.width, box.height) * scale));
      setSize((current) => (Math.abs(current - next) > 2 ? next : current));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [motion, scale]);

  const live = motion === "full" && size > 0;
  return (
    <div ref={ref} className={`${styles.orb}${className ? ` ${className}` : ""}`} data-live={live ? "" : undefined} aria-hidden="true">
      <div className={styles.orbPoster}>{children}</div>
      {live ? (
        <div className={styles.orbLive}>
          <AmbientOrb state={state} size={size} speed={speed} />
        </div>
      ) : null}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import { useAwake, useCoarsePointer, useEffectGate, useMotionMode } from "../runtime";
import styles from "./beam.module.css";

const BeamLayer = dynamic(() => import("./BeamLayer").then((mod) => mod.BeamLayer), {
  ssr: false,
  loading: () => null,
});

/**
 * Every BorderBeam injects a <style> with its own @property registrations, and
 * each registration forces a style recalc of the WHOLE document (~50-90 ms at
 * 1x, ~0.8 s at 4x CPU). Mounting beams one by one as they neared the viewport
 * put one of those stalls mid-scroll per beam. Instead, the first beam whose
 * gate opens (motion on, tier ok, idle) opens it for all of them in the same
 * task, so React commits every layer together: one recalc, at idle. Layers
 * mount inactive; offscreen beams still don't animate (useAwake).
 */
let beamsOpen = false;
const beamListeners = new Set<() => void>();

function openAllBeams() {
  if (beamsOpen) return;
  beamsOpen = true;
  beamListeners.forEach((listener) => listener());
}

function useBeamsOpen(): boolean {
  const [open, setOpen] = useState(beamsOpen);
  useEffect(() => {
    if (beamsOpen) {
      setOpen(true);
      return;
    }
    const listener = () => setOpen(true);
    beamListeners.add(listener);
    return () => {
      beamListeners.delete(listener);
    };
  }, []);
  return open;
}

export type BeamKind = "travel" | "compact" | "underline" | "breathe" | "halo";
export type BeamTone = "mono" | "ocean";

const SIZE = {
  travel: "md",
  compact: "sm",
  underline: "line",
  breathe: "pulse-inner",
  halo: "pulse-outside",
} as const;

export interface BeamProps {
  children: ReactNode;
  /**
   * travel = full-border travelling beam (featured card).
   * compact = small travelling beam (secondary CTA).
   * underline = bottom-edge travel (inputs, rows).
   * breathe = contained breathing glow (the proof visual).
   * halo = outward bloom (use once, on the page's final action).
   */
  kind?: BeamKind;
  /** mono (default) or ocean (periwinkle family). No other palettes. */
  tone?: BeamTone;
  /** 0..1. Default 0.7 — beams are light, not paint. */
  strength?: number;
  /** Seconds per cycle. Defaults per kind from the library. */
  duration?: number;
  /** Corner radius in px. Must match the wrapped surface. */
  radius: number;
  className?: string;
  as?: ElementType;
  /**
   * ms the beam keeps running after it scrolls into view or after pointer /
   * focus activity on it; then it fades out until woken. 0 = run whenever
   * visible. Default 7000. Rotating beams re-style every frame, so always-on
   * chrome (header) must rest.
   */
  rest?: number;
}

/**
 * An animated glow riding the border of the wrapped surface
 * (DESIGN.md › Effects › border-beam).
 *
 * Children render once, server-side, and are never remounted. The beam is an
 * aria-hidden sibling layer loaded after idle when motion is on, sits under the
 * content, and pauses (fades out) while the host is offscreen.
 */
export function Beam({
  children,
  kind = "travel",
  tone = "mono",
  strength = 0.7,
  duration,
  radius,
  className,
  as: Host = "div",
  rest = 7000,
}: BeamProps) {
  const ref = useRef<HTMLElement>(null);
  const gate = useEffectGate(ref, "low", "300px");
  // Phones keep the static beam frame. The animation drives @property custom
  // properties, so it restyles its host every frame, and on a phone the orb
  // canvases already own the budget (measured: ~1.1s of style recalc per few
  // seconds of scrolling in #work, from this one animation).
  const coarse = useCoarsePointer();
  const motion = useMotionMode();
  const shared = useBeamsOpen();
  useEffect(() => {
    if (gate) openAllBeams();
  }, [gate]);
  const enabled = motion === "full" && !coarse && (gate || shared);
  const awake = useAwake(ref, rest);

  return (
    <Host
      ref={ref}
      className={`${styles.host}${className ? ` ${className}` : ""}`}
      style={{ borderRadius: radius }}
      data-beam-host={kind}
    >
      <div className={styles.content}>{children}</div>
      {enabled ? (
        <BeamLayer
          size={SIZE[kind]}
          colorVariant={tone}
          strength={strength}
          duration={duration}
          radius={radius}
          active={awake}
        />
      ) : null}
    </Host>
  );
}

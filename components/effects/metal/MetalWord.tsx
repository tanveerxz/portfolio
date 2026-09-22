"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import { useAwake, useEffectGate, useLatch } from "../runtime";
import styles from "./metal.module.css";

const MetalTextLayer = dynamic(
  () => import("./MetalLayer").then((mod) => mod.MetalTextLayer),
  { ssr: false, loading: () => null },
);

export interface MetalWordProps {
  /** Plain text only. It is server-rendered as real, selectable text. */
  children: string;
  className?: string;
  /** 0..1 — how much metal covers the silver base. Default 0.9. */
  strength?: number;
}

/**
 * Liquid-metal lettering for ONE or TWO display words per page
 * (DESIGN.md › Effects › metal-fx).
 *
 * SSR: a silver-lit text span (the permanent fallback and the LCP text).
 * Client, when motion is full, the device is "high" tier, the word is near the
 * viewport and the browser is idle: metal-fx is imported and paints metal
 * inside the glyphs on an aria-hidden overlay. Nothing moves or remounts.
 */
export function MetalWord({ children, className, strength = 0.9 }: MetalWordProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useEffectGate(ref, "high", "0px");
  const mounted = useLatch(enabled);
  // The shimmer runs for a while after the word enters view and after pointer
  // activity in its section; otherwise it freezes on its last frame (the metal
  // stays visible, the shared WebGL loop stops entirely).
  const sectionRef = useRef<Element | null>(null);
  useEffect(() => {
    sectionRef.current = ref.current?.closest("section") ?? null;
  }, []);
  const awake = useAwake(ref, 9000, sectionRef);

  return (
    <span
      ref={ref}
      className={`${styles.word}${className ? ` ${className}` : ""}`}
      data-fallback="silver"
      data-metal={enabled ? "on" : "off"}
    >
      {children}
      {mounted ? <MetalTextLayer textRef={ref} strength={strength} active={enabled} running={awake} /> : null}
    </span>
  );
}

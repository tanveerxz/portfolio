"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";

import { useEffectGate, useLatch } from "../runtime";
import styles from "./metal.module.css";

const MetalRingLayer = dynamic(
  () => import("./MetalLayer").then((mod) => mod.MetalRingLayer),
  { ssr: false, loading: () => null },
);

export interface MetalRingProps {
  /** One pill-shaped control (normally a <Button>). */
  children: ReactNode;
  className?: string;
  /** 0..1 metal opacity. Default 1. */
  strength?: number;
  /** Ring thickness in CSS px. Default 1.5. */
  ring?: number;
  /** Wandering halo. Default true — the one sanctioned glow on the page. */
  glow?: boolean;
}

/**
 * A liquid-metal ring around the page's primary action. Always shows a static
 * brushed-silver hairline; upgrades to live metal on "high" tier devices.
 * The wrapped control is never remounted and keeps its own focus ring.
 */
export function MetalRing({
  children,
  className,
  strength = 1,
  ring = 1.5,
  glow = true,
}: MetalRingProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useEffectGate(ref, "high", "0px");
  const mounted = useLatch(enabled);

  return (
    <span
      ref={ref}
      className={`${styles.ring}${className ? ` ${className}` : ""}`}
      data-metal={enabled ? "on" : "off"}
    >
      {children}
      {mounted ? <MetalRingLayer strength={strength} ring={ring} glow={glow} active={enabled} /> : null}
    </span>
  );
}

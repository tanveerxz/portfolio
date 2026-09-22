"use client";

/**
 * <AmbientOrb /> — a small decorative thinking-orb for section accents.
 *
 * Cheap enough for 3–6 per page:
 * - one shared rAF loop for every instance, running only while at least one
 *   instance is on screen, the tab is visible and motion is allowed;
 * - one shared IntersectionObserver (offscreen instances never paint);
 * - canvas sized to the orb, DPR-capped, 30fps paint on touch/low-power;
 * - reduced motion (OS or html[data-motion="reduced"]) paints one still.
 *
 * It is independent of the narrative engine (no ScrollTrigger / Lenis).
 */
import { useEffect, useRef, type CSSProperties } from "react";

import {
  devicePolicy,
  motionReduced,
  onOrbInkChange,
  ORB_HALO,
  OrbSurface,
  STILL_TIME,
  type OrbState,
} from "./orb-render";

export type { OrbState };

export interface AmbientOrbProps {
  /** thinking-orbs state (default "breathing"). */
  state?: OrbState;
  /** Diameter in CSS px (default 96). Keep ≤ 240 for accents. */
  size?: number;
  /** Animation speed multiplier (default 1). */
  speed?: number;
  /** Soft CSS halo behind the dots (default true). */
  halo?: boolean;
  /** Freeze on the current frame. */
  paused?: boolean;
  /** Accessible label; omit for purely decorative use (aria-hidden). */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

type Instance = {
  surface: OrbSurface;
  host: HTMLElement;
  state: OrbState;
  size: number;
  speed: number;
  paused: boolean;
  visible: boolean;
  phase: number;
  lastPaint: number;
  frozenAt: number;
};

/* ------------------------------------------------------------------ */
/* Shared scheduler                                                     */
/* ------------------------------------------------------------------ */

const instances = new Set<Instance>();
const byHost = new WeakMap<Element, Instance>();
let observer: IntersectionObserver | null = null;
let raf = 0;
let reduced = false;
let watching = false;
let stopWatching: (() => void) | null = null;

const now = () => performance.now() / 1000;

function paintStill(instance: Instance) {
  instance.surface.paint({
    state: instance.state,
    size: instance.size,
    time: instance.paused ? instance.frozenAt : STILL_TIME[instance.state],
  });
}

function animatable(instance: Instance) {
  return instance.visible && !instance.paused;
}

function loop() {
  raf = 0;
  if (reduced || document.hidden) return;
  const time = now();
  const interval = devicePolicy().paintInterval;
  let any = false;
  instances.forEach((instance) => {
    if (!animatable(instance)) return;
    any = true;
    if (time - instance.lastPaint < interval - 0.002) return;
    instance.lastPaint = time;
    instance.frozenAt = (time + instance.phase) * instance.speed;
    instance.surface.paint({
      state: instance.state,
      size: instance.size,
      time: instance.frozenAt,
    });
  });
  if (any) raf = requestAnimationFrame(loop);
}

function kick() {
  if (raf || reduced || typeof document === "undefined" || document.hidden) return;
  for (const instance of instances) {
    if (animatable(instance)) {
      raf = requestAnimationFrame(loop);
      return;
    }
  }
}

function refreshMotion() {
  const next = motionReduced();
  if (next === reduced) return;
  reduced = next;
  if (reduced) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    instances.forEach(paintStill);
  } else {
    kick();
  }
}

function watch() {
  if (watching) return;
  watching = true;
  reduced = motionReduced();
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const mutation = new MutationObserver(refreshMotion);
  mutation.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  const onVisibility = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else kick();
  };
  media.addEventListener("change", refreshMotion);
  document.addEventListener("visibilitychange", onVisibility);
  // Theme flip: repaint each orb once at its current frame in the new ink.
  const stopInk = onOrbInkChange(() => {
    instances.forEach((instance) => {
      instance.surface.paint({
        state: instance.state,
        size: instance.size,
        time: reduced && !instance.paused ? STILL_TIME[instance.state] : instance.frozenAt,
      });
    });
  });
  observer = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const instance = byHost.get(entry.target);
          if (!instance) continue;
          instance.visible = entry.isIntersecting;
        }
        kick();
      }, { rootMargin: "80px 0px" })
    : null;
  stopWatching = () => {
    mutation.disconnect();
    stopInk();
    media.removeEventListener("change", refreshMotion);
    document.removeEventListener("visibilitychange", onVisibility);
    observer?.disconnect();
    observer = null;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    watching = false;
  };
}

function register(instance: Instance) {
  watch();
  instances.add(instance);
  byHost.set(instance.host, instance);
  if (observer) observer.observe(instance.host);
  else instance.visible = true;
  paintStill(instance);
  kick();
}

function unregister(instance: Instance) {
  instances.delete(instance);
  observer?.unobserve(instance.host);
  if (!instances.size) stopWatching?.();
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

let phaseSeed = 0;

export function AmbientOrb({
  state = "breathing",
  size = 96,
  speed = 1,
  halo = true,
  paused = false,
  label,
  className,
  style,
}: AmbientOrbProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<Instance | null>(null);

  // Mount / unmount.
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const surface = new OrbSurface(canvas);
    if (!surface.ok) return;
    const instance: Instance = {
      surface,
      host,
      state,
      size,
      speed,
      paused,
      visible: false,
      phase: (phaseSeed++ * 1.37) % 5,
      lastPaint: -Infinity,
      frozenAt: STILL_TIME[state],
    };
    surface.resize(size);
    instanceRef.current = instance;
    register(instance);
    return () => {
      unregister(instance);
      instanceRef.current = null;
    };
    // Props are synced by the effect below; mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prop updates without re-registering.
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    const sizeChanged = instance.surface.resize(size);
    const changed =
      sizeChanged || instance.state !== state || instance.paused !== paused;
    instance.state = state;
    instance.size = size;
    instance.speed = speed;
    instance.paused = paused;
    if (changed && (reduced || paused || !instance.visible)) paintStill(instance);
    instance.lastPaint = -Infinity;
    kick();
  }, [state, size, speed, paused]);

  return (
    <span
      ref={hostRef}
      className={className}
      data-ambient-orb={state}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        display: "inline-block",
        position: "relative",
        width: size,
        height: size,
        flex: "none",
        pointerEvents: "none",
        contain: "strict",
        background: halo ? ORB_HALO : undefined,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        width={0}
        height={0}
        style={{ display: "block", width: size, height: size }}
      />
    </span>
  );
}

export default AmbientOrb;

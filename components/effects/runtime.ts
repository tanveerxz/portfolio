"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Shared client runtime for every effect in components/effects.
 *
 * The rules every heavy effect follows (DESIGN.md › Effects budget):
 *   1. SSR renders the static fallback. Nothing effect-related runs before
 *      hydration, so LCP is always plain server HTML.
 *   2. The effect's library is dynamically imported only after
 *      (a) motion is "full", (b) the device passes the tier check,
 *      (c) the host is near the viewport and (d) the browser is idle.
 *   3. When motion is turned off, CSS/SVG effects unmount; metal layers pause
 *      and hide instead (see useLatch for why they must never unmount).
 */

export type MotionMode = "full" | "reduced";

function readMotion(): MotionMode {
  if (typeof document === "undefined") return "reduced";
  return document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
}

/**
 * Tracks html[data-motion], which the layout boot script sets before paint and
 * the header toggle / NarrativeController update. Returns "reduced" during SSR
 * and the first client render so hydration matches and effects start late.
 */
export function useMotionMode(): MotionMode {
  const [mode, setMode] = useState<MotionMode>("reduced");
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setMode(readMotion());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    window.addEventListener("portfolio:motion-change", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio:motion-change", sync);
    };
  }, []);
  return mode;
}

export type DeviceTier = "none" | "low" | "high";

let cachedWebgl2: boolean | null = null;

export function supportsWebgl2(): boolean {
  if (cachedWebgl2 !== null) return cachedWebgl2;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    cachedWebgl2 = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cachedWebgl2 = false;
  }
  return cachedWebgl2;
}

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/**
 * "high": may run WebGL effects (metal). "low": CSS-only effects (beam,
 * gooey, reveals). "none": static only. Evaluated client-side only.
 */
export function getDeviceTier(probeWebgl = true): DeviceTier {
  if (typeof window === "undefined") return "none";
  // QA override: ?fx=all forces the top tier (screenshots on software GL).
  if (/[?&]fx=all\b/.test(window.location.search)) return "high";
  const nav = navigator as Navigator & NavigatorHints;
  if (nav.connection?.saveData) return "none";
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  if (memory < 2 || cores < 2 || slowNet) return "none";
  const smallScreen = window.matchMedia("(max-width: 767px)").matches;
  const weak = memory < 4 || cores < 4;
  if (weak) return "low";
  // Phones get the CSS tier by default: the orb canvas already owns the GPU.
  if (smallScreen) return "low";
  if (!probeWebgl) return "high";
  return supportsWebgl2() ? "high" : "low";
}

/** True once the element has come within `rootMargin` of the viewport. */
export function useNearViewport(
  ref: RefObject<Element | null>,
  { rootMargin = "200px", once = true }: { rootMargin?: string; once?: boolean } = {},
): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setNear(false);
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);
  return near;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Resolves true after first idle period following load (bounded by timeout). */
export function useIdle(timeout = 1800): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const win = window as IdleWindow;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if (win.requestIdleCallback) idleId = win.requestIdleCallback(() => setIdle(true), { timeout });
      else timer = setTimeout(() => setIdle(true), 350);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (idleId !== undefined) win.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, [timeout]);
  return idle;
}

/** Fine pointer + hover capable (desktop mouse / trackpad). */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return fine;
}

/**
 * The single gate every lazy effect uses. `need` = the minimum tier.
 */
export function useEffectGate(
  ref: RefObject<Element | null>,
  need: Exclude<DeviceTier, "none"> = "low",
  rootMargin = "200px",
): boolean {
  const motion = useMotionMode();
  const idle = useIdle();
  const near = useNearViewport(ref, { rootMargin });
  const [tier, setTier] = useState<DeviceTier>("none");
  useEffect(() => setTier(getDeviceTier(need === "high")), [need]);
  const tierOk = need === "low" ? tier !== "none" : tier === "high";
  return motion === "full" && idle && near && tierOk;
}

/**
 * Latches true the first time `value` is true. Used by metal layers: metal-fx
 * destroys its shared WebGL2 context (loseContext) when the last instance
 * unmounts, and the async 'webglcontextlost' event then poisons the NEXT
 * shared context. So once mounted, metal layers stay mounted and are paused
 * and hidden instead of unmounted.
 */
export function useLatch(value: boolean): boolean {
  const [latched, setLatched] = useState(false);
  useEffect(() => {
    if (value) setLatched(true);
  }, [value]);
  return latched || value;
}

/**
 * Continuous effects (beam spin, metal shimmer) cost style recalc / GPU every
 * frame. useAwake returns true while the element is on screen AND was recently
 * relevant: for `restMs` after it scrolls into view, and again for `restMs`
 * after any pointer or focus activity inside `wakeRef` (defaults to `ref`).
 * restMs = 0 disables resting (awake whenever visible).
 */
export function useAwake(
  ref: RefObject<Element | null>,
  restMs: number,
  wakeRef?: RefObject<Element | null>,
): boolean {
  const [visible, setVisible] = useState(false);
  const [recent, setRecent] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "80px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!restMs || !visible) return;
    const zone = wakeRef?.current ?? ref.current;
    let timer = window.setTimeout(() => setRecent(false), restMs);
    const wake = () => {
      setRecent(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setRecent(false), restMs);
    };
    wake();
    zone?.addEventListener("pointerenter", wake);
    zone?.addEventListener("pointermove", wake, { passive: true });
    zone?.addEventListener("focusin", wake);
    return () => {
      window.clearTimeout(timer);
      zone?.removeEventListener("pointerenter", wake);
      zone?.removeEventListener("pointermove", wake);
      zone?.removeEventListener("focusin", wake);
    };
  }, [ref, wakeRef, restMs, visible]);

  return visible && (restMs === 0 || recent);
}

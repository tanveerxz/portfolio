/**
 * Shared, framework-free orb painter used by the narrative layer and
 * <AmbientOrb />. Geometry comes from `thinking-orbs/engine` (pure math);
 * painting is ours so we can make it cheap:
 *
 * - No `shadowBlur`, no `ctx.filter`, one fill colour: glow comes from a
 *   static CSS halo behind the canvas (see ORB_HALO) instead of per-dot blur.
 * - Canvases are sized to the orb, never the viewport.
 * - Device policy caps DPR and paint rate on touch / low-power devices.
 */
import {
  MODE_FRAMES,
  resolvePreset,
  type OrbFrame,
  type OrbState,
} from "thinking-orbs/engine";

export type { OrbState };

/* ------------------------------------------------------------------ */
/* Device policy                                                       */
/* ------------------------------------------------------------------ */

export interface DevicePolicy {
  /** Max backing-store scale for orb canvases. */
  dprCap: number;
  /** Minimum seconds between animated repaints (1/60 or 1/30). */
  paintInterval: number;
  /** Coarse pointer / small viewport. */
  compact: boolean;
  /** Low core count, low memory, or Save-Data. */
  lowPower: boolean;
}

let cachedPolicy: DevicePolicy | null = null;

export function devicePolicy(): DevicePolicy {
  if (cachedPolicy) return cachedPolicy;
  if (typeof window === "undefined") {
    return { dprCap: 1, paintInterval: 1 / 30, compact: true, lowPower: true };
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const compact =
    matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const lowPower =
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4 ||
    nav.connection?.saveData === true;
  cachedPolicy = {
    dprCap: lowPower ? 1.25 : compact ? 1.5 : 2,
    paintInterval: compact || lowPower ? 1 / 30 : 1 / 60,
    compact,
    lowPower,
  };
  return cachedPolicy;
}

/** Backing scale for a canvas of `box` CSS px: big boxes get a lower cap. */
export function canvasDpr(box: number): number {
  const policy = devicePolicy();
  const device = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const cap = box > 420 ? Math.min(policy.dprCap, 1.5) : policy.dprCap;
  return Math.max(1, Math.min(device, cap));
}

/* ------------------------------------------------------------------ */
/* Motion preference                                                   */
/* ------------------------------------------------------------------ */

/** True when the manual toggle or the OS asks for reduced motion. */
export function motionReduced(): boolean {
  if (typeof document === "undefined") return true;
  const manual = document.documentElement.dataset.motion;
  if (manual === "reduced") return true;
  if (manual === "full") return false;
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* Painting                                                            */
/* ------------------------------------------------------------------ */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const TAU = Math.PI * 2;
const SQRT_PI = Math.sqrt(Math.PI);
/** Device-px radius below which a dot is painted as a square (see paintFrame). */
const SQUARE_DOT_DEVICE_PX = 0.75;

const DEFAULT_INK = "rgb(237, 238, 242)";
let INK = DEFAULT_INK;
/** Alpha gain from --orb-ink-gain: dark dots on paper need more weight to
 *  read as strongly as light dots on charcoal. */
let GAIN = 1;
let inkWatched = false;
const inkListeners = new Set<() => void>();

/** Read the theme's --orb-ink token (dark dots on the light theme). */
function readInk(): string {
  if (typeof document === "undefined") return DEFAULT_INK;
  const style = getComputedStyle(document.documentElement);
  GAIN = parseFloat(style.getPropertyValue("--orb-ink-gain")) || 1;
  const value = style.getPropertyValue("--orb-ink").trim();
  return value || DEFAULT_INK;
}

/**
 * Subscribe to orb ink changes (html[data-theme] flips). The token is read
 * once at first use and once per theme change, never per frame; listeners
 * repaint their orbs. Returns an unsubscribe.
 */
export function onOrbInkChange(listener: () => void): () => void {
  if (!inkWatched && typeof MutationObserver !== "undefined") {
    inkWatched = true;
    INK = readInk();
    new MutationObserver(() => {
      const next = readInk();
      if (next === INK) return;
      INK = next;
      inkListeners.forEach((fn) => fn());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  inkListeners.add(listener);
  return () => {
    inkListeners.delete(listener);
  };
}

/**
 * Paint one engine frame into `context`, already transformed to CSS px with
 * the orb's top-left at the origin. `alpha` multiplies every mark.
 *
 * Measured (5 × 560px canvases, Chrome, GPU canvas): per-dot shadowBlur
 * ≈ 1.5 fps; engine painter (per-dot rgba strings) ≈ 7 ms/frame; this
 * single-colour + globalAlpha painter ≈ 2 ms/frame. Sprite drawImage and
 * Path2D batching were both slower than plain arcs.
 */
function paintFrame(
  context: CanvasRenderingContext2D,
  frame: OrbFrame,
  alpha: number,
  /** Dots with a radius below this (CSS px) are painted as equal-area squares. */
  squareBelow = 0,
) {
  if (frame.lines.length) {
    context.strokeStyle = INK;
    for (const line of frame.lines) {
      // Engine ink is mirrored on dark substrates: bright = 1 - white.
      const a = clamp01((line.a ?? 1) * (1 - clamp01(line.white)) * alpha * GAIN);
      if (a < 0.01) continue;
      context.globalAlpha = a;
      context.lineWidth = line.w;
      context.beginPath();
      context.moveTo(line.x1, line.y1);
      context.lineTo(line.x2, line.y2);
      context.stroke();
    }
  }
  context.fillStyle = INK;
  for (const dot of frame.dots) {
    const a = clamp01((dot.a ?? 1) * (1 - clamp01(dot.white)) * alpha * GAIN);
    if (a < 0.01) continue;
    context.globalAlpha = a;
    if (dot.r < squareBelow) {
      // Sub-pixel dot (small orbs: ~500 of them in a 20px header dot). An
      // antialiased square of the same area rasterises the same at this size
      // and is one call instead of three path ops.
      const side = dot.r * SQRT_PI;
      context.fillRect(dot.x - side / 2, dot.y - side / 2, side, side);
      continue;
    }
    context.beginPath();
    context.arc(dot.x, dot.y, dot.r, 0, TAU);
    context.fill();
  }
  context.globalAlpha = 1;
}

export interface PaintOptions {
  state: OrbState;
  /** Previous state for crossfades; ignored when `mix >= 1`. */
  previous?: OrbState;
  mix?: number;
  /** Orb diameter in CSS px (drawn centred in the canvas box). */
  size: number;
  /** Animation time in seconds (unscaled; preset speed is applied here). */
  time: number;
  alpha?: number;
}

/**
 * A canvas that paints orbs. Owns backing-store sizing; resizing only
 * happens when the requested box changes (never per frame).
 */
export class OrbSurface {
  readonly canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  box = 0;
  dpr = 1;
  paints = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: true });
  }

  get ok() {
    return this.context !== null;
  }

  /** Size the canvas to a `box` × `box` CSS px square. Returns true if it changed. */
  resize(box: number): boolean {
    const next = Math.max(8, Math.ceil(box));
    const dpr = canvasDpr(next);
    if (next === this.box && dpr === this.dpr) return false;
    this.box = next;
    this.dpr = dpr;
    const device = Math.round(next * dpr);
    this.canvas.width = device;
    this.canvas.height = device;
    this.canvas.style.width = `${next}px`;
    this.canvas.style.height = `${next}px`;
    return true;
  }

  clear() {
    const context = this.context;
    if (!context) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  paint({ state, previous, mix = 1, size, time, alpha = 1 }: PaintOptions) {
    const context = this.context;
    if (!context || this.box === 0) return;
    const dpr = this.dpr;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (alpha <= 0.002 || size < 2) return;
    const offset = (this.box - size) / 2;
    context.setTransform(dpr, 0, 0, dpr, offset * dpr, offset * dpr);
    if (previous && mix < 1) {
      const preset = resolvePreset(previous, 64);
      const frame = MODE_FRAMES[preset.mode](size, time * preset.speed, preset.opts);
      paintFrame(context, frame, alpha * (1 - mix), SQUARE_DOT_DEVICE_PX / dpr);
    }
    const preset = resolvePreset(state, 64);
    const frame = MODE_FRAMES[preset.mode](size, time * preset.speed, preset.opts);
    paintFrame(context, frame, alpha * Math.min(1, mix), SQUARE_DOT_DEVICE_PX / dpr);
    this.paints += 1;
  }
}

/** Static glow painted by CSS behind an orb canvas (never repainted). */
export const ORB_HALO =
  "radial-gradient(closest-side, var(--orb-halo-in, rgba(194,200,250,0.12)), var(--orb-halo-mid, rgba(194,200,250,0.045)) 48%, transparent 100%)";

/** A representative still time per state (matches OrbPoster). */
export const STILL_TIME: Record<OrbState, number> = {
  working: 0.7,
  searching: 0.9,
  solving: 1.2,
  listening: 0.8,
  connecting: 1.05,
  weaving: 0.72,
  composing: 0.64,
  breathing: 0.45,
  shaping: 0.86,
};

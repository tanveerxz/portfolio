"use client";

/**
 * Narrative orb layer.
 *
 * One absolutely-positioned, document-anchored layer holds five small orb
 * canvases (central + four projects). Each canvas is sized to its orb and
 * moved with a compositor-only `translate3d`, so:
 *
 * - Scrolling moves the orbs natively with the page (no per-scroll JS),
 *   except for anchors inside `position: sticky` ancestors, whose offset is
 *   computed from cached geometry + `narrativeState.scroll`.
 * - Anchor geometry is measured only on resize / layout change, never in the
 *   frame loop. The frame loop performs zero DOM reads.
 * - Each orb is culled with an IntersectionObserver, and the layer drops its
 *   frame demand when nothing is animating so the ticker can detach.
 */
import { useEffect, useRef } from "react";

import {
  addFrameListener,
  narrativeState,
  setFrameDemand,
  subscribeLayoutChange,
  subscribeNarrative,
  type NarrativeAct,
} from "@/lib/narrative-state";

import {
  devicePolicy,
  onOrbInkChange,
  ORB_HALO,
  OrbSurface,
  type OrbState,
} from "./orb-render";

const actSection: Record<NarrativeAct, string> = {
  dormant: "top",
  "active-thinking": "flagship",
  fragmented: "work",
  warm: "community",
  settled: "contact",
};
const ACTS = Object.keys(actSection) as NarrativeAct[];
const PROJECT_STATES: OrbState[] = ["connecting", "weaving", "listening", "composing"];
const ALL_STATES = new Set<OrbState>([
  "working", "searching", "solving", "listening", "connecting",
  "weaving", "composing", "breathing", "shaping",
]);
/** Orb slots: 0 central, 1–4 projects, 5 candidate (mirrors central). */
const CANDIDATE = 5;
const ORB_KEYS = ["central", "project-0", "project-1", "project-2", "project-3", "candidate"];
const DEMAND_ID = "orb-layer";

/** Acts in which the central orb holds still (renders on change only). */
const quietAct = (act: NarrativeAct) => act === "warm" || act === "settled";

function storyState(anchor?: Anchor | null): OrbState {
  const state = narrativeState;
  const list = anchor?.states;
  if (list && list.length) {
    const progress = state.act === "active-thinking" ? state.verification : state.progress;
    return list[Math.min(list.length - 1, Math.floor(progress * list.length))];
  }
  if (state.act === "dormant") return "breathing";
  if (state.act === "fragmented") return "weaving";
  if (state.act === "warm") return "connecting";
  if (state.act === "settled") return "breathing";
  if (state.verification < 0.2) return "searching";
  if (state.verification < 0.42) return "working";
  if (state.verification < 0.72) return "solving";
  if (state.verification < 0.9) return "shaping";
  return "weaving";
}

/** Cached, scroll-invariant anchor geometry (layer-relative CSS px). */
type Anchor = {
  cx: number;
  cy: number;
  min: number;
  /** data-orb-states override (split evenly across act progress). */
  states?: OrbState[];
  /** data-orb-scale / data-orb-opacity overrides. */
  scale?: number;
  opacity?: number;
  /** data-orb-range="a,b": visible only while verification progress ∈ [a,b]. */
  range?: [number, number];
  sticky: null | {
    /** Natural (unstuck) top of the sticky box, layer-relative. */
    top: number;
    inset: number;
    maxShift: number;
  };
};

type Orb = {
  el: HTMLDivElement;
  surface: OrbSurface;
  visible: boolean;
  seeded: boolean;
  // Rendered values.
  x: number;
  y: number;
  size: number;
  opacity: number;
  // Decaying travel offsets (position = target + offset).
  offX: number;
  offY: number;
  offSize: number;
  // Last written style values.
  writtenX: number;
  writtenY: number;
  writtenOpacity: number;
  hidden: boolean;
  // State crossfade.
  state: OrbState;
  previous: OrbState;
  mix: number;
  // Current target identity (to detect anchor switches).
  targetKey: string;
  lastPaint: number;
  dirty: boolean;
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Eased visibility for `data-orb-range="a,b"`: 0 outside [a, b], 1 inside,
 * smoothstepped over a small margin at each edge so the fade isn't a hard cut.
 */
function rangeVisibility([a, b]: [number, number], value: number): number {
  const margin = Math.max(0.02, (b - a) * 0.2);
  const fadeIn = smoothstep(a - margin, a, value);
  const fadeOut = 1 - smoothstep(b, b + margin, value);
  return Math.min(fadeIn, fadeOut);
}

function stickyShift(anchor: Anchor, layerTop: number, scroll: number) {
  const sticky = anchor.sticky;
  if (!sticky) return 0;
  const viewportTop = layerTop + sticky.top - scroll;
  return Math.max(0, Math.min(sticky.maxShift, sticky.inset - viewportTop));
}

export function OrbCanvas() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const root = document.documentElement;
    const policy = devicePolicy();
    const elements = Array.from(layer.querySelectorAll<HTMLDivElement>("[data-orb]"));
    const orbs: Orb[] = elements.map((el, index) => {
      const canvas = el.querySelector("canvas") as HTMLCanvasElement;
      const state = index === 0 || index === CANDIDATE ? storyState() : PROJECT_STATES[index - 1];
      return {
        el,
        surface: new OrbSurface(canvas),
        visible: false,
        seeded: false,
        x: 0, y: 0, size: 64, opacity: 0,
        offX: 0, offY: 0, offSize: 0,
        writtenX: NaN, writtenY: NaN, writtenOpacity: -1,
        hidden: true,
        state, previous: state, mix: 1,
        targetKey: "",
        lastPaint: -Infinity,
        dirty: true,
      };
    });
    if (!orbs.length || !orbs[0].surface.ok) {
      root.dataset.orbRenderer = "unavailable";
      return;
    }
    const central = orbs[0];
    const projects = orbs.slice(1, CANDIDATE);

    // ---------------------------------------------------------------
    // Measurement (resize / layout change only).
    // ---------------------------------------------------------------
    const centralAnchors = new Map<NarrativeAct, Anchor | null>();
    const candidateAnchors = new Map<NarrativeAct, Anchor | null>();
    const projectAnchors: (Anchor | null)[] = [null, null, null, null];
    let layerTop = 0;
    let measured = false;

    function findSticky(element: HTMLElement): HTMLElement | null {
      for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
        if (getComputedStyle(node).position === "sticky") return node;
      }
      return null;
    }

    function measure() {
      const scroll = window.scrollY;
      const centralEls = ACTS.map((act) =>
        document.querySelector<HTMLElement>(
          `#${actSection[act]} [data-orb-anchor]:not([data-orb-project]):not([data-orb-anchor="candidate"])`,
        ),
      );
      const candidateEls = ACTS.map((act) =>
        document.querySelector<HTMLElement>(`#${actSection[act]} [data-orb-anchor="candidate"]`),
      );
      const projectEls = projects.map((_, index) =>
        document.querySelector<HTMLElement>(`#work [data-orb-project="${index}"]`),
      );
      const all = [...centralEls, ...projectEls, ...candidateEls].filter(Boolean) as HTMLElement[];

      // Temporarily unstick sticky ancestors so we read natural positions.
      // relative + top:0 is layout-identical to the in-flow sticky box.
      const stickyOf = new Map<HTMLElement, HTMLElement | null>();
      const stickies = new Map<HTMLElement, { inset: number; position: string; top: string }>();
      for (const element of all) {
        const sticky = findSticky(element);
        stickyOf.set(element, sticky);
        if (sticky && !stickies.has(sticky)) {
          stickies.set(sticky, {
            inset: parseFloat(getComputedStyle(sticky).top) || 0,
            position: sticky.style.position,
            top: sticky.style.top,
          });
        }
      }
      stickies.forEach((_, sticky) => {
        sticky.style.position = "relative";
        sticky.style.top = "0px";
      });

      const layerRect = layer!.getBoundingClientRect();
      layerTop = layerRect.top + scroll;
      const stickyGeometry = new Map<HTMLElement, Anchor["sticky"]>();
      stickies.forEach((info, sticky) => {
        const rect = sticky.getBoundingClientRect();
        const parent = sticky.parentElement;
        let maxShift = 0;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const style = getComputedStyle(parent);
          const contentBottom =
            parentRect.bottom -
            (parseFloat(style.paddingBottom) || 0) -
            (parseFloat(style.borderBottomWidth) || 0);
          maxShift = Math.max(0, contentBottom - rect.bottom);
        }
        stickyGeometry.set(sticky, {
          top: rect.top - layerRect.top,
          inset: info.inset,
          maxShift,
        });
      });

      const toAnchor = (element: HTMLElement | null): Anchor | null => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return null;
        const sticky = stickyOf.get(element);
        const states = (element.dataset.orbStates ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter((value): value is OrbState => ALL_STATES.has(value as OrbState));
        const number = (value: string | undefined) => {
          const parsed = value === undefined || value === "" ? NaN : Number(value);
          return Number.isFinite(parsed) ? Math.min(1.5, Math.max(0, parsed)) : undefined;
        };
        const range = (value: string | undefined): [number, number] | undefined => {
          if (!value) return undefined;
          const parts = value.split(",").map((part) => Number(part.trim()));
          if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) return undefined;
          const a = Math.min(1, Math.max(0, parts[0]));
          const b = Math.min(1, Math.max(0, parts[1]));
          return a <= b ? [a, b] : [b, a];
        };
        return {
          cx: rect.left - layerRect.left + rect.width / 2,
          cy: rect.top - layerRect.top + rect.height / 2,
          min: Math.min(rect.width, rect.height),
          states: states.length ? states : undefined,
          scale: number(element.dataset.orbScale),
          opacity: number(element.dataset.orbOpacity),
          range: range(element.dataset.orbRange),
          sticky: sticky ? stickyGeometry.get(sticky) ?? null : null,
        };
      };
      ACTS.forEach((act, index) => {
        centralAnchors.set(act, toAnchor(centralEls[index]));
        candidateAnchors.set(act, toAnchor(candidateEls[index]));
      });
      projectEls.forEach((element, index) => { projectAnchors[index] = toAnchor(element); });

      stickies.forEach((info, sticky) => {
        sticky.style.position = info.position;
        sticky.style.top = info.top;
      });

      measured = true;
      orbs.forEach((orb) => { orb.dirty = true; });
      requestFrames();
    }

    let measureFrame = 0;
    function scheduleMeasure() {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measure();
      });
    }

    // ---------------------------------------------------------------
    // Targets & easing (pure math on cached values).
    // ---------------------------------------------------------------
    const scaleFor: Record<NarrativeAct, number> = {
      dormant: 0.97,
      "active-thinking": 0.9,
      fragmented: 0.9,
      warm: 0.9,
      settled: 0.82,
    };
    const opacityFor: Record<NarrativeAct, number> = {
      dormant: 1,
      "active-thinking": 1,
      fragmented: 0,
      warm: 0.42,
      settled: 1,
    };

    let targetX = 0;
    let targetY = 0;
    let targetSize = 0;
    let targetOpacity = 0;

    function resolveTarget(orb: Orb, index: number): string {
      const act = narrativeState.act;
      let anchor: Anchor | null;
      let scale: number;
      let opacity: number;
      let key: string;
      if (index === 0) {
        anchor = centralAnchors.get(act) ?? null;
        scale = anchor?.scale ?? scaleFor[act];
        opacity = Math.min(1, anchor?.opacity ?? opacityFor[act]);
        key = act;
      } else if (index === CANDIDATE) {
        anchor = candidateAnchors.get(act) ?? null;
        scale = anchor?.scale ?? scaleFor[act];
        opacity = Math.min(1, anchor?.opacity ?? (act === "warm" ? 0.42 : 1));
        key = act;
      } else {
        anchor = projectAnchors[index - 1];
        scale = anchor?.scale ?? (index === 1 ? 0.88 : 0.76);
        opacity = act === "fragmented" ? 1 : 0;
        key = "project";
      }
      if (!anchor) {
        // No slot for this act: fade out in place.
        targetX = orb.x - orb.offX;
        targetY = orb.y - orb.offY;
        targetSize = orb.size - orb.offSize;
        targetOpacity = 0;
        return orb.targetKey;
      }
      const shift = stickyShift(anchor, layerTop, narrativeState.scroll);
      targetX = anchor.cx;
      targetY = anchor.cy + shift;
      targetSize = Math.max(56, anchor.min * scale);
      targetOpacity = anchor.range ? opacity * rangeVisibility(anchor.range, narrativeState.verification) : opacity;
      return key;
    }

    let animTime = 0;

    function step(orb: Orb, index: number, delta: number, time: number): boolean {
      const key = resolveTarget(orb, index);
      if (!orb.seeded) {
        orb.seeded = true;
        orb.targetKey = key;
        orb.offX = orb.offY = orb.offSize = 0;
        orb.opacity = targetOpacity;
      } else if (key !== orb.targetKey) {
        // Anchor switch: keep the orb where it is and let the offset decay.
        orb.offX = orb.x - targetX;
        orb.offY = orb.y - targetY;
        orb.offSize = orb.size - targetSize;
        orb.targetKey = key;
      }
      const positionEase = Math.exp(-Math.max(0.001, delta) * 6.5);
      const opacityEase = 1 - Math.exp(-Math.max(0.001, delta) * 8.5);
      orb.offX *= positionEase;
      orb.offY *= positionEase;
      orb.offSize *= positionEase;
      if (Math.abs(orb.offX) < 0.1) orb.offX = 0;
      if (Math.abs(orb.offY) < 0.1) orb.offY = 0;
      if (Math.abs(orb.offSize) < 0.1) orb.offSize = 0;
      orb.opacity += (targetOpacity - orb.opacity) * opacityEase;
      if (Math.abs(targetOpacity - orb.opacity) < 0.003) orb.opacity = targetOpacity;

      const size = targetSize + orb.offSize;
      const sizeChanged = Math.abs(size - orb.size) > 0.25;
      orb.size = size;
      orb.x = targetX + orb.offX;
      orb.y = targetY + orb.offY;

      if (index === 0) {
        const next = storyState(centralAnchors.get(narrativeState.act));
        if (next !== orb.state) {
          orb.previous = orb.state;
          orb.state = next;
          orb.mix = 0;
        }
      }
      if (index === CANDIDATE) {
        // Mirror the central orb exactly (state, crossfade and clock).
        orb.state = central.state;
        orb.previous = central.previous;
        orb.mix = central.mix;
      } else if (orb.mix < 1) orb.mix = Math.min(1, orb.mix + delta * 2.35);

      // Canvas box: grow immediately, shrink once settled. Hidden orbs never
      // allocate a backing store (project orbs stay 0×0 outside #work).
      const needed = Math.ceil(Math.max(orb.size, targetSize) / 8) * 8;
      const surface = orb.surface;
      const invisible = orb.opacity <= 0.004 && targetOpacity <= 0.004;
      if (!invisible && (needed > surface.box || (orb.offSize === 0 && surface.box > needed * 1.2))) {
        surface.resize(needed);
        orb.writtenX = NaN;
        orb.dirty = true;
      }

      // Compositor-only writes, only when changed.
      const half = surface.box / 2;
      const x = Math.round((orb.x - half) * 2) / 2;
      const y = Math.round((orb.y - half) * 2) / 2;
      if (x !== orb.writtenX || y !== orb.writtenY) {
        orb.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        orb.writtenX = x;
        orb.writtenY = y;
      }
      const opacity = Math.round(orb.opacity * 1000) / 1000;
      const hidden = opacity <= 0.004;
      // A never-yet-painted surface has an unresolved/stale backing store
      // (resize() can widen the box before the first real frame lands, e.g.
      // while a project orb's card is still settling). Keep the wrapper at
      // opacity 0 until its first paint lands at the *current* target size,
      // so nothing ever flashes a blank/mismatched box on mount.
      const revealed = surface.paints > 0;
      const displayOpacity = revealed ? opacity : 0;
      if (displayOpacity !== orb.writtenOpacity) {
        orb.el.style.opacity = String(displayOpacity);
        orb.writtenOpacity = displayOpacity;
      }
      if (hidden !== orb.hidden) {
        orb.el.style.visibility = hidden ? "hidden" : "visible";
        orb.hidden = hidden;
        if (!hidden) orb.dirty = true;
      }

      // Paint only visible orbs; animated repaints are rate-limited. Not
      // gated on `revealed`: painting is what makes the orb revealable.
      const animating = index === 0 || index === CANDIDATE ? !quietAct(narrativeState.act) : true;
      const due = time - orb.lastPaint >= policy.paintInterval - 0.002;
      const wantsPaint =
        !hidden && orb.visible &&
        (orb.dirty || orb.mix < 1 || sizeChanged || (animating && due));
      if (wantsPaint) {
        surface.paint({
          state: orb.state,
          previous: orb.previous,
          mix: orb.mix,
          size: orb.size,
          time: index === 0 || index === CANDIDATE ? animTime : animTime + index * 1.7,
        });
        orb.lastPaint = time;
        orb.dirty = false;
      }

      const settling =
        orb.offX !== 0 || orb.offY !== 0 || orb.offSize !== 0 ||
        orb.opacity !== targetOpacity || orb.mix < 1;
      const continuous = animating && !hidden && orb.visible;
      return settling || continuous || (orb.dirty && !hidden && orb.visible);
    }

    let firstPaint = true;
    function frame(time: number, delta: number) {
      if (!measured) return;
      // Freeze the animation clock in quiet acts so scroll never makes it jump.
      if (!quietAct(narrativeState.act)) animTime += delta;
      let demand = false;
      orbs.forEach((orb, index) => {
        if (step(orb, index, delta, time)) demand = true;
      });
      setFrameDemand(DEMAND_ID, demand);
      if (firstPaint && central.surface.paints + projects.reduce((n, p) => n + p.surface.paints, 0) > 0) {
        firstPaint = false;
        root.dataset.orbRenderer = "ready";
        layer!.dataset.engine = "thinking-orbs 0.3.1 / sprite";
      }
      stats.frames += 1;
    }

    function requestFrames() {
      setFrameDemand(DEMAND_ID, true);
    }

    // Debug counters for QA scripts (no per-frame DOM attribute writes).
    const stats = { frames: 0, get paints() { return orbs.map((orb) => orb.surface.paints); } };
    (window as unknown as { __orbStats?: typeof stats }).__orbStats = stats;

    // ---------------------------------------------------------------
    // Observers.
    // ---------------------------------------------------------------
    const intersection = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const orb = orbs.find((item) => item.el === entry.target);
            if (!orb) continue;
            orb.visible = entry.isIntersecting;
            if (orb.visible) orb.dirty = true;
          }
          requestFrames();
        }, { rootMargin: "120px 0px" })
      : null;
    if (intersection) orbs.forEach((orb) => intersection.observe(orb.el));
    else orbs.forEach((orb) => { orb.visible = true; });

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(scheduleMeasure)
      : null;
    resizeObserver?.observe(document.body);
    document
      .querySelectorAll<HTMLElement>("[data-act] [data-orb-anchor]")
      .forEach((element) => resizeObserver?.observe(element));

    measure();
    const stopFrame = addFrameListener(frame);
    const stopLayout = subscribeLayoutChange(scheduleMeasure);
    const stopState = subscribeNarrative(requestFrames);
    // Theme flip: repaint every orb once in the new ink (quiet acts included).
    const stopInk = onOrbInkChange(() => {
      orbs.forEach((orb) => { orb.dirty = true; });
      requestFrames();
    });
    addEventListener("resize", scheduleMeasure, { passive: true });
    void document.fonts?.ready.then(scheduleMeasure);

    return () => {
      stopFrame();
      stopLayout();
      stopState();
      stopInk();
      setFrameDemand(DEMAND_ID, false);
      removeEventListener("resize", scheduleMeasure);
      if (measureFrame) cancelAnimationFrame(measureFrame);
      intersection?.disconnect();
      resizeObserver?.disconnect();
      orbs.forEach((orb) => orb.surface.clear());
      delete (window as unknown as { __orbStats?: unknown }).__orbStats;
      root.dataset.orbRenderer = "unavailable";
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-orb-layer=""
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 0,
        overflowX: "clip",
        overflowY: "visible",
        pointerEvents: "none",
        zIndex: "var(--z-canvas, 0)",
      }}
    >
      {ORB_KEYS.map((key) => (
        <div
          key={key}
          data-orb={key}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            visibility: "hidden",
            willChange: "transform, opacity",
            contain: "layout paint style",
            background: ORB_HALO,
          }}
        >
          <canvas data-orb-canvas="" width={0} height={0} style={{ display: "block" }} />
        </div>
      ))}
    </div>
  );
}

export default OrbCanvas;

"use client";

import { useEffect, useRef } from "react";
import {
  MODE_DRAWS,
  resolvePreset,
  type OrbState,
} from "thinking-orbs/engine";

import {
  addFrameListener,
  narrativeState,
  subscribeNarrative,
} from "@/lib/narrative-state";

const actId = {
  dormant: "top",
  "active-thinking": "flagship",
  fragmented: "work",
  warm: "community",
  settled: "contact",
} as const;

const projectStates: OrbState[] = [
  "connecting",
  "weaving",
  "listening",
  "composing",
];

type Visual = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  targetX: number;
  targetY: number;
  targetSize: number;
  targetOpacity: number;
  state: OrbState;
  previousState: OrbState;
  stateMix: number;
  seeded: boolean;
};

function visual(state: OrbState): Visual {
  return {
    x: 0,
    y: 0,
    size: 64,
    opacity: 0,
    targetX: 0,
    targetY: 0,
    targetSize: 64,
    targetOpacity: 0,
    state,
    previousState: state,
    stateMix: 1,
    seeded: false,
  };
}

function stateForStory(): OrbState {
  const state = narrativeState;
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

function updateState(item: Visual, next: OrbState) {
  if (item.state === next) return;
  item.previousState = item.state;
  item.state = next;
  item.stateMix = 0;
}

function setTarget(
  item: Visual,
  rect: DOMRect | null,
  opacity: number,
  scale = 0.9,
) {
  if (!rect) {
    item.targetOpacity = 0;
    return;
  }
  item.targetX = rect.left + rect.width / 2;
  item.targetY = rect.top + rect.height / 2;
  item.targetSize = Math.max(56, Math.min(rect.width, rect.height) * scale);
  item.targetOpacity = opacity;
  if (!item.seeded) {
    item.x = item.targetX;
    item.y = item.targetY;
    item.size = item.targetSize;
    item.opacity = item.targetOpacity;
    item.seeded = true;
  }
}

function easeVisual(item: Visual, delta: number) {
  const positionEase = 1 - Math.exp(-Math.max(0.001, delta) * 6.5);
  const opacityEase = 1 - Math.exp(-Math.max(0.001, delta) * 8.5);
  item.x += (item.targetX - item.x) * positionEase;
  item.y += (item.targetY - item.y) * positionEase;
  item.size += (item.targetSize - item.size) * positionEase;
  item.opacity += (item.targetOpacity - item.opacity) * opacityEase;
  item.stateMix = Math.min(1, item.stateMix + delta * 2.35);
}

function drawMode(
  context: CanvasRenderingContext2D,
  item: Visual,
  state: OrbState,
  alpha: number,
  time: number,
) {
  if (alpha <= 0.002 || item.size < 2) return;
  const preset = resolvePreset(state, 64);
  context.save();
  context.translate(item.x - item.size / 2, item.y - item.size / 2);
  context.globalAlpha = alpha;
  context.globalCompositeOperation = "screen";
  context.shadowColor = "rgba(194, 200, 250, 0.32)";
  context.shadowBlur = Math.min(28, item.size * 0.035);
  MODE_DRAWS[preset.mode](
    context,
    item.size,
    time * preset.speed,
    true,
    preset.opts,
  );
  context.restore();
}

function drawVisual(
  context: CanvasRenderingContext2D,
  item: Visual,
  time: number,
) {
  if (item.opacity <= 0.004) return;
  const radius = item.size * 0.54;
  const halo = context.createRadialGradient(
    item.x,
    item.y,
    0,
    item.x,
    item.y,
    radius,
  );
  halo.addColorStop(0, "rgba(194, 200, 250, 0.12)");
  halo.addColorStop(0.48, "rgba(194, 200, 250, 0.045)");
  halo.addColorStop(1, "rgba(11, 13, 18, 0)");
  context.save();
  context.globalAlpha = item.opacity;
  context.fillStyle = halo;
  context.fillRect(
    item.x - radius,
    item.y - radius,
    radius * 2,
    radius * 2,
  );
  context.restore();

  if (item.stateMix < 1) {
    drawMode(
      context,
      item,
      item.previousState,
      item.opacity * (1 - item.stateMix),
      time,
    );
  }
  drawMode(
    context,
    item,
    item.state,
    item.opacity * item.stateMix,
    time,
  );
}

export function OrbCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      document.documentElement.dataset.orbRenderer = "unavailable";
      return;
    }

    const central = visual("breathing");
    const projects = projectStates.map((state) => visual(state));
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frames = 0;
    let invalid = true;

    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      dpr = Math.min(innerWidth < 768 ? 1.25 : 1.5, devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.dataset.dpr = dpr.toFixed(2);
      invalid = true;
    };

    const rect = (selector: string) =>
      document.querySelector<HTMLElement>(selector)?.getBoundingClientRect() ?? null;

    const layout = () => {
      const state = narrativeState;
      const selector = `#${actId[state.act]} [data-orb-anchor]:not([data-orb-project])`;
      const centralOpacity = state.act === "fragmented" ? 0 : state.act === "warm" ? 0.42 : 1;
      const centralScale = state.act === "dormant" ? 0.97 : state.act === "settled" ? 0.82 : 0.9;
      setTarget(central, rect(selector), centralOpacity, centralScale);
      updateState(central, stateForStory());
      projects.forEach((item, index) => {
        setTarget(
          item,
          rect(`#work [data-orb-project="${index}"]`),
          state.act === "fragmented" ? 1 : 0,
          index === 0 ? 0.88 : 0.76,
        );
      });
    };

    resize();
    layout();
    const unsubscribe = subscribeNarrative(() => {
      invalid = true;
      layout();
    });
    const stopFrame = addFrameListener((time, delta) => {
      layout();
      easeVisual(central, delta);
      projects.forEach((item) => easeVisual(item, delta));
      if (!narrativeState.visible && !invalid) return;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      drawVisual(context, central, time);
      projects.forEach((item) => drawVisual(context, item, time));
      frames += 1;
      canvas.dataset.frames = String(frames);
      canvas.dataset.act = narrativeState.act;
      canvas.dataset.orbState = central.state;
      canvas.dataset.engine = "Libraries.dev thinking-orbs 0.3.1";
      document.documentElement.dataset.orbRenderer = "ready";
      invalid = false;
    });

    const onResize = () => {
      resize();
      layout();
    };
    addEventListener("resize", onResize, { passive: true });

    return () => {
      stopFrame();
      unsubscribe();
      removeEventListener("resize", onResize);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      document.documentElement.dataset.orbRenderer = "unavailable";
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-orb-canvas=""
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default OrbCanvas;

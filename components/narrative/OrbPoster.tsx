import {
  MODE_FRAMES,
  resolvePreset,
  type OrbState,
} from "thinking-orbs/engine";

import type { NarrativeAct } from "@/lib/narrative-state";
import styles from "./orb.module.css";

export interface OrbPosterProps {
  state: NarrativeAct;
  orbState?: OrbState;
  className?: string;
}

const actState: Record<NarrativeAct, OrbState> = {
  dormant: "breathing",
  "active-thinking": "solving",
  fragmented: "connecting",
  warm: "connecting",
  settled: "breathing",
};

const stateTime: Record<OrbState, number> = {
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

/** Ink/opacity quantisation: 10 grey levels × 10 alpha levels at most. */
const LEVELS = 10;
const q = (value: number) => Math.round(Math.min(1, Math.max(0, value)) * LEVELS) / LEVELS;
const n = (value: number) => Math.round(value * 10) / 10;

type Group = { ink: number; alpha: number; width?: number; d: string[] };

/**
 * Static SVG still of an orb state. Server-rendered and zero-JS.
 *
 * Marks are merged into a handful of `<path>` elements grouped by quantised
 * ink and opacity (previously one DOM node per dot: ~150–560 nodes per
 * poster, seven posters per page). Output is visually equivalent at poster
 * scale and keeps style recalculation cheap.
 */
function buildPoster(orbState: OrbState) {
  const preset = resolvePreset(orbState, 64);
  const frame = MODE_FRAMES[preset.mode](300, stateTime[orbState] * preset.speed, preset.opts);
  const lines = new Map<string, Group>();
  const dots = new Map<string, Group>();

  for (const line of frame.lines) {
    const ink = q(1 - line.white);
    const alpha = q(line.a ?? 1);
    if (alpha <= 0) continue;
    const width = n(line.w);
    const key = `${ink}|${alpha}|${width}`;
    const group = lines.get(key) ?? { ink, alpha, width, d: [] };
    group.d.push(`M${n(line.x1)} ${n(line.y1)}L${n(line.x2)} ${n(line.y2)}`);
    lines.set(key, group);
  }
  for (const dot of frame.dots) {
    const ink = q(1 - dot.white);
    const alpha = q(dot.a ?? 1);
    if (alpha <= 0) continue;
    const key = `${ink}|${alpha}`;
    const group = dots.get(key) ?? { ink, alpha, d: [] };
    const r = n(dot.r);
    // A circle as two arcs; relative commands keep the string short.
    group.d.push(`M${n(dot.x - r)} ${n(dot.y)}a${r} ${r} 0 1 0 ${n(r * 2)} 0a${r} ${r} 0 1 0 ${n(-r * 2)} 0`);
    dots.set(key, group);
  }
  const byDepth = (a: Group, b: Group) => a.ink - b.ink;
  return {
    lines: Array.from(lines.values()).sort(byDepth),
    dots: Array.from(dots.values()).sort(byDepth),
  };
}

const cache = new Map<OrbState, ReturnType<typeof buildPoster>>();
function poster(orbState: OrbState) {
  let value = cache.get(orbState);
  if (!value) {
    value = buildPoster(orbState);
    cache.set(orbState, value);
  }
  return value;
}

/**
 * Mark colour for a quantised depth: the theme's --orb-ink at full depth,
 * fading toward --orb-ink-far (dark: light ink over black; light: graphite
 * ink over white). Pure CSS, so the server-rendered poster follows the theme.
 */
const grey = (ink: number) =>
  `color-mix(in srgb, var(--orb-ink) ${Math.round(ink * 100)}%, var(--orb-ink-far))`;

export function OrbPoster({
  state,
  orbState = actState[state],
  className = "",
}: OrbPosterProps) {
  const { lines, dots } = poster(orbState);

  return (
    <div
      className={`${styles.poster} ${styles[state]} ${className}`}
      data-orb-poster=""
      data-orb-state={orbState}
      aria-hidden="true"
    >
      <svg className={styles.posterSvg} viewBox="0 0 300 300" focusable="false">
        <g className={styles.posterGeometry}>
          {lines.map((group, index) => (
            <path
              key={`l${index}`}
              d={group.d.join("")}
              fill="none"
              style={{ stroke: grey(group.ink) }}
              strokeOpacity={group.alpha}
              strokeWidth={group.width}
            />
          ))}
          {dots.map((group, index) => (
            <path
              key={`d${index}`}
              d={group.d.join("")}
              style={{ fill: grey(group.ink) }}
              fillOpacity={group.alpha}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

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

function ink(white: number) {
  return Math.round((1 - Math.min(1, Math.max(0, white))) * 255);
}

export function OrbPoster({
  state,
  orbState = actState[state],
  className = "",
}: OrbPosterProps) {
  const preset = resolvePreset(orbState, 64);
  const frame = MODE_FRAMES[preset.mode](
    300,
    stateTime[orbState] * preset.speed,
    preset.opts,
  );

  return (
    <div
      className={`${styles.poster} ${styles[state]} ${className}`}
      data-orb-poster=""
      data-orb-state={orbState}
      aria-hidden="true"
    >
      <svg className={styles.posterSvg} viewBox="0 0 300 300" focusable="false">
        <g className={styles.posterGeometry}>
          {frame.lines.map((line, index) => {
            const value = ink(line.white);
            return (
              <line
                key={`line-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={`rgb(${value} ${value} ${value})`}
                strokeOpacity={line.a ?? 1}
                strokeWidth={line.w}
              />
            );
          })}
          {frame.dots.map((dot, index) => {
            const value = ink(dot.white);
            return (
              <circle
                key={`dot-${index}`}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={`rgb(${value} ${value} ${value})`}
                fillOpacity={dot.a ?? 1}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

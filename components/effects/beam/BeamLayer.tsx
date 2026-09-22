"use client";

/**
 * The ONLY module that imports `border-beam`. Loaded client-side after the
 * effect gate opens. BorderBeam injects a <style> element whose text differs
 * between server and client escaping — rendering it during SSR caused a
 * hydration mismatch that forced the WHOLE document to client-render. Never
 * import border-beam from a server-rendered path.
 */
import { BorderBeam, type BorderBeamColorVariant, type BorderBeamSize } from "border-beam";

import { useTheme } from "@/lib/theme";

import styles from "./beam.module.css";

/**
 * border-beam's dark presets are tuned for light UI chrome: the "sm" stroke
 * renders at ~0.2 opacity, invisible on this charcoal. These multipliers are
 * the library's own CSS hooks; values tuned by eye on --surface-0/1.
 */
const INTENSITY: Record<BorderBeamSize, { stroke: number; inner: number; bloom: number }> = {
  sm: { stroke: 3.4, inner: 1.6, bloom: 2.4 },
  md: { stroke: 2.2, inner: 1.3, bloom: 1.8 },
  line: { stroke: 2.4, inner: 1.2, bloom: 2 },
  "pulse-inner": { stroke: 1.6, inner: 1.3, bloom: 1.4 },
  "pulse-outside": { stroke: 1.4, inner: 1.2, bloom: 1.3 },
};

export interface BeamLayerProps {
  size: BorderBeamSize;
  colorVariant: BorderBeamColorVariant;
  strength: number;
  duration?: number;
  radius?: number;
  active: boolean;
}

export function BeamLayer({ size, colorVariant, strength, duration, radius, active }: BeamLayerProps) {
  const boost = INTENSITY[size];
  // border-beam ships a light palette; follow html[data-theme].
  const theme = useTheme();
  return (
    <BorderBeam
      style={
        {
          "--beam-stroke-opacity": boost.stroke,
          "--beam-inner-opacity": boost.inner,
          "--beam-bloom-opacity": boost.bloom,
        } as React.CSSProperties
      }
      className={styles.layer}
      size={size}
      colorVariant={colorVariant}
      theme={theme}
      staticColors
      strength={strength}
      duration={duration}
      borderRadius={radius}
      active={active}
      aria-hidden="true"
    >
      <span className={styles.shape} />
    </BorderBeam>
  );
}

"use client";

/**
 * The ONLY module that imports `metal-fx`. It is loaded with next/dynamic
 * (ssr: false) by MetalWord / MetalRing after the effect gate opens, so the
 * ~140 kB engine never touches the initial bundle or the LCP path.
 *
 * Both layers are aria-hidden overlays positioned over server-rendered
 * content. The real text / control underneath never remounts, never moves and
 * stays the accessible, focusable element.
 *
 * metal-fx shares ONE WebGL2 context and one 15 fps loop across all
 * instances and skips offscreen instances itself. The preset is global to the
 * shared renderer, so the whole site uses "silver".
 *
 * The bundled "silver" preset still inherits shiftRed/shiftBlue: 0.3 from
 * metal-fx's base defaults (only colorTint/shaderOpacity are overridden per
 * preset — see node_modules/metal-fx/dist/index.d.ts, PresetMode), which
 * reads as a gold/rose chromatic fringe on the ring edge. The owner's
 * palette is pure silver, so flatten the shared renderer once at module
 * load with the documented escape hatch (setSharedPresetMode), keeping
 * every other silver.dark value and zeroing dispersion.
 */
import { MetalFx, PRESETS, setSharedPresetMode, type MaskFn } from "metal-fx";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { readTheme, subscribeTheme, useTheme, type Theme } from "@/lib/theme";

import styles from "./metal.module.css";

/**
 * Light theme: metal-fx's silver.light mode renders near-white chrome, which
 * disappears on paper. Burn it toward graphite instead so the word reads as
 * polished steel on the light field. Dispersion stays at 0 in both themes.
 */
const METAL_MODE = {
  dark: { ...PRESETS.silver.modes.dark, shiftRed: 0, shiftBlue: 0 },
  light: { ...PRESETS.silver.modes.light, colorTint: "#2b2f38b3", shiftRed: 0, shiftBlue: 0 },
} satisfies Record<Theme, typeof PRESETS.silver.modes.dark>;

if (typeof window !== "undefined") {
  setSharedPresetMode(METAL_MODE[readTheme()]);
  // One subscription for the module (read once per change, never per frame).
  subscribeTheme(() => setSharedPresetMode(METAL_MODE[readTheme()]));
}

interface Glyph {
  ch: string;
  x: number;
  y: number;
}

interface GlyphRun {
  font: string;
  glyphs: Glyph[];
}

/** Measure every character's DOM position relative to `layer`, so the canvas
 *  mask matches the live text exactly — tracking, kerning and all. */
function measureRun(layer: HTMLElement, text: HTMLElement): GlyphRun | null {
  const box = layer.getBoundingClientRect();
  if (!box.width || !box.height) return null;
  const style = getComputedStyle(text);
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  probe.font = font;
  const metrics = probe.measureText("Hg");
  const size = parseFloat(style.fontSize);
  const ascent = metrics.fontBoundingBoxAscent ?? size * 0.9;
  const descent = metrics.fontBoundingBoxDescent ?? size * 0.22;
  const glyphs: Glyph[] = [];
  const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.textContent ?? "";
    for (let index = 0; index < value.length; index += 1) {
      const ch = value[index];
      if (!ch || ch.trim() === "") continue;
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.width) continue;
      glyphs.push({
        ch,
        x: rect.left - box.left,
        y: rect.top - box.top + (rect.height - (ascent + descent)) / 2 + ascent,
      });
    }
  }
  range.detach();
  return { font, glyphs };
}

/** Position the overlay over the word's glyph box (+ overscan for overhang). */
function placeLayer(layer: HTMLElement, text: HTMLElement) {
  const parent = layer.offsetParent as HTMLElement | null;
  if (!parent) return;
  const range = document.createRange();
  range.selectNodeContents(text);
  const word = range.getBoundingClientRect();
  range.detach();
  const box = parent.getBoundingClientRect();
  const size = parseFloat(getComputedStyle(text).fontSize) || 16;
  const padX = size * 0.14;
  const padY = size * 0.08;
  layer.style.left = `${word.left - box.left - parent.clientLeft - padX}px`;
  layer.style.top = `${word.top - box.top - parent.clientTop - padY}px`;
  layer.style.width = `${word.width + padX * 2}px`;
  layer.style.height = `${word.height + padY * 2}px`;
}

export interface MetalTextLayerProps {
  textRef: RefObject<HTMLElement | null>;
  strength: number;
  /** false = paused and hidden (never unmounted — see useLatch). */
  active: boolean;
  /** false = frozen on the current frame (still visible). */
  running?: boolean;
}

/** Metal inside the glyphs of the server-rendered word under it. */
export function MetalTextLayer({ textRef, strength, active, running = true }: MetalTextLayerProps) {
  const theme = useTheme();
  const layerRef = useRef<HTMLSpanElement>(null);
  const runRef = useRef<GlyphRun | null>(null);
  // metal-fx rasterises the mask when the prop changes, so a new function
  // identity is how a re-measure (resize, font swap) reaches the engine.
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const layer = layerRef.current;
    const text = textRef.current;
    if (!layer || !text) return;
    let alive = true;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!alive) return;
        placeLayer(layer, text);
        runRef.current = measureRun(layer, text);
        setVersion((value) => value + 1);
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    // The word is a plain inline box (no paint layer, so the whole heading
    // stays ONE LCP text candidate); the overlay is therefore positioned
    // against its containing block and re-placed whenever that block resizes.
    const observer = new ResizeObserver(measure);
    const block = layer.offsetParent ?? text.parentElement;
    if (block) observer.observe(block);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [textRef]);

  // metal-fx composites the mask with 'destination-in', where EVERY draw call
  // clears everything outside itself — so glyphs are rasterised once into a
  // cached offscreen mask and composited in a single drawImage.
  const maskCache = useRef<{ key: string; canvas: HTMLCanvasElement } | null>(null);

  const mask = useCallback<MaskFn>(
    (ctx, width, height, dpr) => {
      const layer = layerRef.current;
      const text = textRef.current;
      // First paint can happen before the effect above: measure on demand.
      if (!runRef.current && layer && text) runRef.current = measureRun(layer, text);
      const run = runRef.current;
      if (!run) return;
      const key = `${version}:${width}x${height}@${dpr}`;
      let cached = maskCache.current;
      if (!cached || cached.key !== key) {
        const canvas = cached?.canvas ?? document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const paint = canvas.getContext("2d");
        if (!paint) return;
        paint.clearRect(0, 0, width, height);
        paint.setTransform(dpr, 0, 0, dpr, 0, 0);
        paint.fillStyle = "#fff";
        paint.font = run.font;
        paint.textBaseline = "alphabetic";
        for (const glyph of run.glyphs) paint.fillText(glyph.ch, glyph.x, glyph.y);
        cached = { key, canvas };
        maskCache.current = cached;
      }
      ctx.drawImage(cached.canvas, 0, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, textRef],
  );

  return (
    <span ref={layerRef} className={styles.textLayer} data-active={active} aria-hidden="true">
      <MetalFx
        className={styles.bare}
        preset="silver"
        theme={theme}
        paused={!active || !running}
        strength={strength}
        mask={mask}
        disableGlow
        shaderScale={2.6}
        borderRadius={2}
        style={{ width: "100%", height: "100%" }}
      >
        <span className={styles.shape} />
      </MetalFx>
    </span>
  );
}

export interface MetalRingLayerProps {
  strength: number;
  ring: number;
  glow: boolean;
  active: boolean;
}

/** A liquid-metal ring riding the edge of the control under it. */
export function MetalRingLayer({ strength, ring, glow, active }: MetalRingLayerProps) {
  const theme = useTheme();
  return (
    <span className={styles.ringLayer} data-active={active} aria-hidden="true">
      <MetalFx
        className={styles.bare}
        variant="button"
        preset="silver"
        theme={theme}
        paused={!active}
        strength={strength}
        ringCssPx={ring}
        disableGlow={!glow}
        style={{ width: "100%", height: "100%" }}
      >
        <span className={`${styles.shape} ${styles.pill}`} />
      </MetalFx>
    </span>
  );
}

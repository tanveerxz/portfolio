/** The sole mutable bridge between the story controller and the drawing layer. */
export type NarrativeAct = "dormant" | "active-thinking" | "fragmented" | "warm" | "settled";

export interface NarrativeState {
  act: NarrativeAct;
  progress: number;
  verification: number;
  warmth: number;
  fragmentation: number;
  visible: boolean;
  reducedMotion: boolean;
  timestamp: number;
  /**
   * Last known window scroll offset (CSS px). Written once per frame by the
   * controller *before* any DOM writes, so render layers never have to read
   * `window.scrollY` (which can force layout) inside the frame loop.
   */
  scroll: number;
}

export const narrativeState: NarrativeState = {
  act: "dormant", progress: 0, verification: 0, warmth: 0,
  fragmentation: 0, visible: true, reducedMotion: false, timestamp: 0, scroll: 0,
};

type StateListener = (state: Readonly<NarrativeState>) => void;
export type FrameListener = (timeSeconds: number, deltaSeconds: number) => void;
const stateListeners = new Set<StateListener>();
const frameListeners = new Set<FrameListener>();
let lastTime: number | undefined;
const normalized = new Set<keyof NarrativeState>(["progress", "verification", "warmth", "fragmentation"]);
/** Keys that change every scroll frame; they never notify state listeners. */
const silent = new Set<keyof NarrativeState>(["scroll", "timestamp"]);

export function updateNarrative(partial: Partial<NarrativeState>): void {
  let changed = false;
  for (const key of Object.keys(partial) as (keyof NarrativeState)[]) {
    let value = partial[key];
    if (value === undefined || (typeof value === "number" && !Number.isFinite(value))) continue;
    if (normalized.has(key)) value = Math.min(1, Math.max(0, value as number));
    if (narrativeState[key] !== value) {
      Object.assign(narrativeState, { [key]: value });
      if (!silent.has(key)) changed = true;
    }
  }
  if (!narrativeState.visible || narrativeState.reducedMotion) lastTime = undefined;
  if (changed) stateListeners.forEach((listener) => listener(narrativeState));
}

export function subscribeNarrative(listener: StateListener): () => void {
  stateListeners.add(listener);
  return () => { stateListeners.delete(listener); };
}

export function addFrameListener(listener: FrameListener): () => void {
  frameListeners.add(listener);
  return () => { frameListeners.delete(listener); };
}

/** Called by B's GSAP ticker, in seconds. No local RAF, timers or React updates. */
export function tickNarrative(timeSeconds: number): void {
  if (!Number.isFinite(timeSeconds)) return;
  if (!narrativeState.visible || narrativeState.reducedMotion) { lastTime = undefined; return; }
  const delta = lastTime === undefined ? 0 : Math.min(1 / 30, Math.max(0, timeSeconds - lastTime));
  lastTime = timeSeconds;
  narrativeState.timestamp = timeSeconds;
  frameListeners.forEach((listener) => listener(timeSeconds, delta));
}

/* ------------------------------------------------------------------------ */
/* Frame demand: render layers tell the controller whether they still need   */
/* frames, so the ticker can detach entirely when nothing animates.          */
/* ------------------------------------------------------------------------ */

const demand = new Set<string>();
const demandListeners = new Set<() => void>();

/** Mark `id` as needing (or no longer needing) continuous frames. */
export function setFrameDemand(id: string, active: boolean): void {
  const had = demand.has(id);
  if (active === had) return;
  if (active) demand.add(id);
  else demand.delete(id);
  if (active) demandListeners.forEach((listener) => listener());
}

export function hasFrameDemand(): boolean {
  return demand.size > 0;
}

/** Fires when any layer starts demanding frames (used to wake the ticker). */
export function subscribeFrameDemand(listener: () => void): () => void {
  demandListeners.add(listener);
  return () => { demandListeners.delete(listener); };
}

/* ------------------------------------------------------------------------ */
/* Layout invalidation: the controller announces measured-layout changes     */
/* (resize, fonts, ScrollTrigger refresh) so layers re-measure anchors once. */
/* ------------------------------------------------------------------------ */

const layoutListeners = new Set<() => void>();

export function notifyLayoutChange(): void {
  layoutListeners.forEach((listener) => listener());
}

export function subscribeLayoutChange(listener: () => void): () => void {
  layoutListeners.add(listener);
  return () => { layoutListeners.delete(listener); };
}

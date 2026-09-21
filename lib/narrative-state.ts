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
}

export const narrativeState: NarrativeState = {
  act: "dormant", progress: 0, verification: 0, warmth: 0,
  fragmentation: 0, visible: true, reducedMotion: false, timestamp: 0,
};

type StateListener = (state: Readonly<NarrativeState>) => void;
export type FrameListener = (timeSeconds: number, deltaSeconds: number) => void;
const stateListeners = new Set<StateListener>();
const frameListeners = new Set<FrameListener>();
let lastTime: number | undefined;
const normalized = new Set<keyof NarrativeState>(["progress", "verification", "warmth", "fragmentation"]);

export function updateNarrative(partial: Partial<NarrativeState>): void {
  let changed = false;
  for (const key of Object.keys(partial) as (keyof NarrativeState)[]) {
    let value = partial[key];
    if (value === undefined || (typeof value === "number" && !Number.isFinite(value))) continue;
    if (normalized.has(key)) value = Math.min(1, Math.max(0, value as number));
    if (narrativeState[key] !== value) {
      Object.assign(narrativeState, { [key]: value });
      changed = true;
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

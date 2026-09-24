/**
 * Phase snapping for the sticky LegacyLift runway (#flagship).
 *
 * The runway is ~240svh of scroll split evenly across four chapters. Read
 * literally that means the reader has to drag through a full screen and a
 * half of scrolling per chapter, which is the wrong gesture: a chapter is a
 * discrete step, not a slider. So inside the runway one short gesture (a
 * wheel notch, a trackpad flick, a swipe) eases the page to the next
 * chapter's resting point instead of scrubbing.
 *
 * Rules the implementation follows, in rough order of importance:
 *
 * - It only ever engages *inside* the runway, while the stage is genuinely
 *   sticky and motion is on. Scrolling into the section, out of it, and every
 *   other section of the page are untouched native scrolling.
 * - A touch gesture is claimed on its first decisive move or not at all.
 *   Once the browser has started scrolling, preventDefault() is ignored for
 *   the rest of that gesture, so a late claim would silently trap the reader.
 *   When there is nothing to snap to in the gesture's direction (the reader
 *   is leaving the section) the gesture is released untouched.
 * - The resting point of a chapter is the middle of its band, so the
 *   controller's progress (and every artifact keyed off it) sits clear of the
 *   boundary rather than balancing on it.
 * - A gesture that starts before the current chapter's resting point settles
 *   onto *that* chapter first. Entering the section from either end therefore
 *   lands the reader on a chapter rather than halfway between two.
 *
 * The animation itself is supplied by the caller (Lenis when it owns the
 * page, a plain rAF tween on touch), so this module never touches scroll
 * directly.
 */

/** Ease in and out, quartic: slow at both ends, quick through the middle. */
export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

export type PhaseSnapOptions = {
  /** The sticky element. Snapping is off whenever it is not sticky. */
  stage: HTMLElement;
  /** Number of chapters sharing the runway. */
  phases: number;
  /** Live [start, end] document scroll positions of the runway. */
  runway: () => [number, number];
  /** Animate the page to `top` over `duration` seconds, then call `done`. */
  animate: (top: number, duration: number, done: () => void) => void;
  /** Abort whatever `animate` last started. */
  stopAnimation: () => void;
};

/** Seconds per pixel of travel, clamped: a chapter step lands around 0.6s. */
const SPEED = 2200;
const MIN_DURATION = 0.55;
const MAX_DURATION = 1.1;
/** Trackpad momentum keeps firing after the fingers lift; swallow the tail. */
const WHEEL_COOLDOWN = 260;
/** Below this the touch is a tap or a tremor, not a scroll. */
const TOUCH_SLOP = 5;

export function createPhaseSnap({
  stage,
  phases,
  runway,
  animate,
  stopAnimation,
}: PhaseSnapOptions) {
  let snapping = false;
  /** The chapter being animated to; the base for chained gestures. */
  let pending: number | null = null;
  let settledAt = -Infinity;
  let watchdog: ReturnType<typeof setTimeout> | undefined;

  let touchId: number | null = null;
  let touchY = 0;
  let touchX = 0;
  let claimed = false;
  let fired = false;

  /** The runway, or null when snapping must not engage at all. */
  function live(): [number, number] | null {
    if (document.documentElement.dataset.motion === "reduced") return null;
    if (getComputedStyle(stage).position !== "sticky") return null;
    const [start, end] = runway();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 1) return null;
    const y = window.scrollY;
    if (y < start - 1 || y > end + 1) return null;
    return [start, end];
  }

  const phaseAt = (y: number, [start, end]: [number, number]) =>
    Math.max(0, Math.min(phases - 1, Math.floor(((y - start) / (end - start)) * phases)));

  /** Where a chapter comes to rest: the middle of its share of the runway. */
  const restFor = (phase: number, [start, end]: [number, number]) =>
    start + ((phase + 0.5) / phases) * (end - start);

  function targetFor(direction: 1 | -1): { phase: number; top: number } | null {
    const span = live();
    if (!span) return null;
    const phase = pending ?? phaseAt(window.scrollY, span);
    if (pending === null) {
      // Still short of this chapter's resting point: settle on it first.
      const rest = restFor(phase, span);
      const y = window.scrollY;
      if (direction > 0 ? y < rest - 2 : y > rest + 2) return { phase, top: rest };
    }
    const next = phase + direction;
    // Past the last chapter (or before the first) the reader is leaving the
    // section; native scrolling takes them out.
    if (next < 0 || next >= phases) return null;
    return { phase: next, top: restFor(next, span) };
  }

  function release() {
    if (watchdog) clearTimeout(watchdog);
    watchdog = undefined;
    if (!snapping) return;
    snapping = false;
    pending = null;
    settledAt = performance.now();
  }

  function begin(target: { phase: number; top: number }) {
    const distance = Math.abs(target.top - window.scrollY);
    const duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, distance / SPEED));
    snapping = true;
    pending = target.phase;
    if (watchdog) clearTimeout(watchdog);
    // If the animation is interrupted and never reports back, don't hold the
    // reader's gestures hostage.
    watchdog = setTimeout(release, duration * 1000 + 600);
    animate(target.top, duration, release);
  }

  function step(direction: 1 | -1): boolean {
    const target = targetFor(direction);
    if (!target) return false;
    begin(target);
    return true;
  }

  function onWheel(event: WheelEvent) {
    // Pinch-zoom and horizontal scrolling are not ours.
    if (event.ctrlKey || event.defaultPrevented) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (snapping || performance.now() < settledAt + WHEEL_COOLDOWN) {
      // Swallow the rest of the gesture so one flick is one chapter.
      if (live()) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    if (!step(event.deltaY > 0 ? 1 : -1)) return;
    event.preventDefault();
    // Lenis listens on window in the bubble phase; this runs in capture.
    event.stopPropagation();
  }

  function onTouchStart(event: TouchEvent) {
    claimed = false;
    fired = false;
    if (event.touches.length !== 1) {
      touchId = null;
      return;
    }
    touchId = event.touches[0].identifier;
    touchY = event.touches[0].clientY;
    touchX = event.touches[0].clientX;
  }

  function onTouchMove(event: TouchEvent) {
    if (touchId === null) return;
    if (event.touches.length !== 1 || event.touches[0].identifier !== touchId) {
      touchId = null;
      return;
    }
    const dy = touchY - event.touches[0].clientY; // positive: finger up, page down
    const dx = touchX - event.touches[0].clientX;
    const direction: 1 | -1 = dy > 0 ? 1 : -1;

    if (!claimed) {
      if (Math.abs(dy) < TOUCH_SLOP && Math.abs(dx) < TOUCH_SLOP) return; // undecided
      // Decide on the first decisive move of the gesture: once the browser
      // has started scrolling it ignores preventDefault() for the rest of the
      // gesture, so claiming late would block the reader rather than move
      // them. Nothing to snap to (or a sideways drag) releases it untouched.
      if (Math.abs(dx) >= Math.abs(dy) || !targetFor(direction)) {
        touchId = null;
        return;
      }
      claimed = true;
    }
    event.preventDefault();
    event.stopPropagation();
    if (fired) return;
    fired = true;
    // One swipe is one chapter, whether or not the last one has landed yet.
    step(direction);
  }

  function onTouchEnd() {
    touchId = null;
    claimed = false;
  }

  const options = { passive: false, capture: true } as const;
  window.addEventListener("wheel", onWheel, options);
  window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
  window.addEventListener("touchmove", onTouchMove, options);
  window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });

  return {
    /** Hand the page back (an anchor click, a navigation, teardown). */
    release() {
      stopAnimation();
      release();
      settledAt = -Infinity;
      touchId = null;
      claimed = false;
    },
    dispose() {
      stopAnimation();
      if (watchdog) clearTimeout(watchdog);
      window.removeEventListener("wheel", onWheel, options);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, options);
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
    },
  };
}

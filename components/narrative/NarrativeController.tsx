"use client";

import type { ScrollRequest } from "@/components/shell/SmoothAnchors";
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";

import {
  hasFrameDemand,
  notifyLayoutChange,
  subscribeFrameDemand,
  tickNarrative,
  updateNarrative,
} from "@/lib/narrative-state";

const OrbCanvas = lazy(() =>
  import("./OrbCanvas").then((module) => ({ default: module.OrbCanvas })),
);

const SECTION_ACTS = [
  ["top", "dormant"],
  ["flagship", "active-thinking"],
  ["work", "fragmented"],
  ["community", "warm"],
  ["contact", "settled"],
] as const;
type MotionPreference = "full" | "reduced";
type Act = (typeof SECTION_ACTS)[number][1];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const preference = (value: unknown): MotionPreference | null =>
  value === "full" || value === "reduced" ? value : null;

function storedPreference(): MotionPreference | null {
  try {
    return preference(localStorage.getItem("portfolio-motion"));
  } catch {
    return null;
  }
}

/** Import/render failures leave the server-rendered section posters in place. */
class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    document.documentElement.dataset.orbRenderer = "unavailable";
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The only clock for Lenis and A's imperative scene subscribers. */
export function NarrativeController() {
  // False on the server and first hydration: static art never depends on JS.
  const [fullMotion, setFullMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const system = window.matchMedia("(prefers-reduced-motion: reduce)");
    let manual = storedPreference();

    const apply = () => {
      const mode = manual ?? (system.matches ? "reduced" : "full");
      root.dataset.motion = mode;
      if (mode === "reduced" || root.dataset.orbRenderer !== "ready") {
        root.dataset.orbRenderer = "unavailable";
      }
      updateNarrative({ reducedMotion: mode === "reduced" });
      setFullMotion(mode === "full");
    };
    const onManualChange = (event: Event) => {
      const detail: unknown = (event as CustomEvent<unknown>).detail;
      const payload =
        typeof detail === "object" && detail !== null && "motion" in detail
          ? detail.motion
          : detail;
      manual = preference(payload) ?? preference(root.dataset.motion) ?? storedPreference();
      // G normally persists first; also support a dispatched preference alone.
      try {
        if (manual) localStorage.setItem("portfolio-motion", manual);
      } catch {
        // In-memory manual preference still works when storage is unavailable.
      }
      apply();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "portfolio-motion" || event.key === null) {
        manual = event.key === null ? null : preference(event.newValue);
        apply();
      }
    };
    apply();
    system.addEventListener("change", apply);
    window.addEventListener("portfolio:motion-change", onManualChange);
    window.addEventListener("storage", onStorage);
    return () => {
      system.removeEventListener("change", apply);
      window.removeEventListener("portfolio:motion-change", onManualChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!fullMotion) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function start() {
      const [gsapModule, triggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const root = document.documentElement;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const sections = SECTION_ACTS.flatMap(([id, act]) => {
        const element = document.getElementById(id);
        return element?.dataset.act === act ? [{ element, act }] : [];
      });
      if (!sections.length) return;

      type LenisInstance = InstanceType<(typeof import("lenis"))["default"]>;
      let lenis: LenisInstance | undefined;
      let lenisRequest = 0;
      let tickerAttached = false;
      let syncRequested = true;
      let currentAct: Act = "dormant";
      // Last values written to the DOM; writes are skipped when unchanged.
      let writtenProgress = "";
      let writtenPhase = "";
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const navigationTimers = new Set<ReturnType<typeof setTimeout>>();
      const visibleSections = new Set<HTMLElement>();
      const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];
      const ranges: { act: Act; trigger: ReturnType<typeof ScrollTrigger.create> }[] = [];
      let verificationTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;
      let ready = false;

      const flagship = sections.find((section) => section.act === "active-thinking")?.element;
      const stage = flagship?.querySelector<HTMLElement>(".verification-stage");
      const visual = flagship?.querySelector<HTMLElement>("[data-verification-visual]");
      // data-verification-phase goes on all three. The custom property is
      // written every scrolled frame and inherits, so every write re-styles the
      // target's whole subtree (the stage is ~270 nodes: ~20 ms a frame at 1x).
      // Elements marked [data-verification-progress] opt in as the only
      // targets (the progress bars that read it); otherwise stage + visual.
      const verificationTargets = [flagship, stage, visual].filter(
        (element): element is HTMLElement => Boolean(element),
      );
      const optedIn = Array.from(
        flagship?.querySelectorAll<HTMLElement>("[data-verification-progress]") ?? [],
      );
      const progressTargets = optedIn.length
        ? optedIn
        : [stage, visual].filter((element): element is HTMLElement => Boolean(element));
      const steps = Array.from(
        flagship?.querySelectorAll<HTMLElement>("[data-verification-step]") ?? [],
      );
      // Phases = distinct step values (3 by default), split evenly across progress.
      const phaseCount = Math.max(1, new Set(steps.map((step) => step.dataset.verificationStep)).size || 3);

      function inViewport(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      }
      sections.forEach(({ element }) => {
        if (inViewport(element)) visibleSections.add(element);
      });
      function sceneVisible() {
        return !document.hidden && visibleSections.size > 0;
      }
      function detachTicker() {
        if (tickerAttached) gsap.ticker.remove(frame);
        tickerAttached = false;
      }
      function wake() {
        if (cancelled || document.hidden || !visibleSections.size) return;
        if (!tickerAttached) {
          gsap.ticker.add(frame);
          tickerAttached = true;
        }
      }
      /** Coalesce: any number of scroll/trigger events → one sync per frame. */
      function requestSync() {
        syncRequested = true;
        wake();
      }
      function frame(time: number) {
        if (document.hidden || !visibleSections.size) {
          detachTicker();
          return;
        }
        lenis?.raf(time * 1000);
        if (syncRequested) {
          syncRequested = false;
          sync();
        }
        if (sceneVisible()) tickNarrative(time);
        // Detach when no layer wants frames and Lenis has settled; scroll,
        // wheel, state changes and new frame demand re-attach via wake().
        if (!hasFrameDemand() && !lenis?.isScrolling && !syncRequested) detachTicker();
      }

      function sync() {
        if (!ready || cancelled) return;
        // Single DOM read per frame, before any writes below.
        const y = window.scrollY;
        let range = ranges[0];
        for (const candidate of ranges) {
          if (y >= candidate.trigger.start) range = candidate;
        }
        if (!range) return;
        const progress = clamp((y - range.trigger.start) / Math.max(1, range.trigger.end - range.trigger.start));
        const verification = verificationTrigger
          ? clamp((y - verificationTrigger.start) / Math.max(1, verificationTrigger.end - verificationTrigger.start))
          : 0;
        const phase = String(Math.min(phaseCount - 1, Math.floor(verification * phaseCount)));
        const progressValue = verification.toFixed(4);
        if (progressValue !== writtenProgress) {
          writtenProgress = progressValue;
          progressTargets.forEach((element) => {
            element.style.setProperty("--verification-progress", progressValue);
          });
        }
        if (phase !== writtenPhase) {
          writtenPhase = phase;
          verificationTargets.forEach((element) => {
            element.dataset.verificationPhase = phase;
          });
          steps.forEach((element) => {
            element.dataset.verificationActive = String(element.dataset.verificationStep === phase);
          });
        }
        currentAct = range.act;
        updateNarrative({
          act: currentAct,
          progress,
          verification,
          warmth: currentAct === "warm" ? 1 : 0,
          fragmentation: currentAct === "fragmented" ? 1 : 0,
          visible: sceneVisible(),
          reducedMotion: false,
          scroll: y,
        });
      }

      // These triggers measure only. CSS owns the sticky verification stage.
      sections.forEach(({ element, act }) => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: act === "dormant" ? "top top" : "top 55%",
          end: "bottom 55%",
          invalidateOnRefresh: true,
          onRefresh: requestSync,
        });
        ranges.push({ act, trigger });
        triggers.push(trigger);
      });
      /**
       * Verification progress spans exactly the sticky stage's runway: 0 when
       * the stage sticks, 1 when its containing block releases it. Computed
       * from the containing block (never the stuck box). When the stage has no
       * runway (not sticky, or its parent is no taller than it), progress
       * falls back to the section passing the 55% line.
       */
      function verificationRange(): [number, number] {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const container = stage?.parentElement;
        const style = stage ? getComputedStyle(stage) : null;
        if (stage && container && style?.position === "sticky") {
          const box = container.getBoundingClientRect();
          const containerStyle = getComputedStyle(container);
          const contentTop = box.top + (parseFloat(containerStyle.paddingTop) || 0) + (parseFloat(containerStyle.borderTopWidth) || 0);
          const contentBottom = box.bottom - (parseFloat(containerStyle.paddingBottom) || 0) - (parseFloat(containerStyle.borderBottomWidth) || 0);
          const inset = parseFloat(style.top) || 0;
          const naturalTop = contentTop + (parseFloat(style.marginTop) || 0);
          const runway = contentBottom - naturalTop - stage.offsetHeight;
          if (runway > Math.max(40, vh * 0.1)) {
            const start = y + naturalTop - inset;
            return [start, start + runway];
          }
        }
        const section = flagship!.getBoundingClientRect();
        return [y + section.top - vh * 0.55, y + section.bottom - vh * 0.55];
      }
      if (flagship) {
        let range: [number, number] = [0, 1];
        verificationTrigger = ScrollTrigger.create({
          trigger: flagship,
          start: () => (range = verificationRange())[0],
          end: () => range[1],
          invalidateOnRefresh: true,
          onRefresh: requestSync,
        });
        triggers.push(verificationTrigger);
      }
      ready = true;

      const observer = typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              const element = entry.target as HTMLElement;
              if (entry.isIntersecting) visibleSections.add(element);
              else visibleSections.delete(element);
            });
            updateNarrative({ visible: sceneVisible() });
            if (!visibleSections.size) detachTicker();
            else requestSync();
          }, { threshold: 0 })
        : null;
      sections.forEach(({ element }) => observer?.observe(element));

      function refresh() {
        if (cancelled || document.hidden) return;
        lenis?.resize();
        // Refresh only our measurements; never pin, unpin, or kill another owner.
        triggers.forEach((trigger) => trigger.refresh());
        requestSync();
        notifyLayoutChange();
      }
      function scheduleRefresh() {
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(refresh, 100);
      }
      function onScroll() {
        if (!observer) {
          sections.forEach(({ element }) => {
            if (inViewport(element)) visibleSections.add(element);
            else visibleSections.delete(element);
          });
        }
        requestSync();
      }
      function onVisibility() {
        updateNarrative({ visible: sceneVisible() });
        if (document.hidden) {
          lenis?.stop();
          detachTicker();
        } else {
          lenis?.start();
          refresh();
        }
      }
      function reconcileNativeNavigation() {
        // Release in-flight wheel easing before the browser's default action.
        // Recreate at its restored position; never write scroll or history here.
        ++lenisRequest;
        lenis?.destroy();
        lenis = undefined;
        navigationTimers.forEach(clearTimeout);
        navigationTimers.clear();
        for (const delay of [0, 120]) {
          const timer = setTimeout(() => {
            navigationTimers.delete(timer);
            if (cancelled) return;
            refresh();
            if (delay === 120) void configureLenis();
          }, delay);
          navigationTimers.add(timer);
        }
      }
      function onAnchorClick(event: MouseEvent) {
        // SmoothAnchors already resolved it (and prevented the native jump).
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!(anchor instanceof HTMLAnchorElement) || anchor.download || (anchor.target && anchor.target !== "_self")) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
          reconcileNativeNavigation();
        }
      }
      function onScrollRequest(event: Event) {
        const request = (event as CustomEvent<ScrollRequest>).detail;
        if (!lenis || !request) return;
        request.handled = true;
        const distance = Math.abs(request.top - window.scrollY);
        wake();
        lenis.scrollTo(request.top, {
          duration: Math.min(1.8, Math.max(0.9, distance / 2600)),
          easing: (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
          onComplete: request.done,
        });
      }
      async function configureLenis() {
        const request = ++lenisRequest;
        lenis?.destroy();
        lenis = undefined;
        if (!finePointer.matches || cancelled) return;
        try {
          const { default: Lenis } = await import("lenis");
          if (cancelled || request !== lenisRequest || !finePointer.matches) return;
          lenis = new Lenis({
            autoRaf: false,
            autoResize: false,
            smoothWheel: true,
            syncTouch: false,
            anchors: false,
            // The controller resolves OS defaults plus explicit manual override.
            respectReducedMotion: false,
            lerp: 0.1,
          });
          lenis.on("scroll", onScroll);
          if (document.hidden) lenis.stop();
          wake();
        } catch {
          // Native wheel/touch scrolling and ScrollTrigger remain operational.
        }
      }

      const resizeObserver = typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleRefresh)
        : null;
      sections.forEach(({ element }) => resizeObserver?.observe(element));
      // Render layers (a late-mounting OrbCanvas included) wake the ticker by
      // raising frame demand; nothing polls.
      const stopDemand = subscribeFrameDemand(wake);
      document.addEventListener("visibilitychange", onVisibility);
      document.addEventListener("click", onAnchorClick);
      window.addEventListener("portfolio:scrollto", onScrollRequest);
      window.addEventListener("wheel", wake, { passive: true });
      window.addEventListener("touchstart", wake, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", scheduleRefresh, { passive: true });
      window.addEventListener("hashchange", reconcileNativeNavigation);
      window.addEventListener("popstate", reconcileNativeNavigation);
      window.addEventListener("pageshow", reconcileNativeNavigation);
      finePointer.addEventListener("change", configureLenis);

      dispose = () => {
        ++lenisRequest;
        detachTicker();
        lenis?.destroy();
        observer?.disconnect();
        resizeObserver?.disconnect();
        stopDemand();
        triggers.forEach((trigger) => trigger.kill());
        if (refreshTimer) clearTimeout(refreshTimer);
        navigationTimers.forEach(clearTimeout);
        document.removeEventListener("visibilitychange", onVisibility);
        document.removeEventListener("click", onAnchorClick);
        window.removeEventListener("wheel", wake);
        window.removeEventListener("touchstart", wake);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", scheduleRefresh);
        window.removeEventListener("portfolio:scrollto", onScrollRequest);
        window.removeEventListener("hashchange", reconcileNativeNavigation);
        window.removeEventListener("popstate", reconcileNativeNavigation);
        window.removeEventListener("pageshow", reconcileNativeNavigation);
        finePointer.removeEventListener("change", configureLenis);
        progressTargets.forEach((element) => {
          element.style.removeProperty("--verification-progress");
        });
        verificationTargets.forEach((element) => {
          delete element.dataset.verificationPhase;
        });
        steps.forEach((element) => delete element.dataset.verificationActive);
        root.dataset.orbRenderer = "unavailable";
        updateNarrative({ visible: false });
      };
      refresh();
      void document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
      // Initial deep links/restoration may land after hydration and font layout.
      reconcileNativeNavigation();
    }

    void start().catch(() => {
      dispose?.();
      if (!cancelled) {
        document.documentElement.dataset.orbRenderer = "unavailable";
        updateNarrative({ visible: false });
        setFullMotion(false);
      }
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [fullMotion]);

  return fullMotion ? (
    <CanvasBoundary>
      <Suspense fallback={null}>
        <OrbCanvas />
      </Suspense>
    </CanvasBoundary>
  ) : null;
}

export default NarrativeController;

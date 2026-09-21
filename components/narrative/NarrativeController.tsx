"use client";

import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";

import { tickNarrative, updateNarrative } from "@/lib/narrative-state";

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
      let dirty = true;
      let quietUntil = 0;
      let currentAct: Act = "dormant";
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
      const verificationTargets = [flagship, stage, visual].filter(
        (element): element is HTMLElement => Boolean(element),
      );
      const steps = Array.from(
        flagship?.querySelectorAll<HTMLElement>("[data-verification-step]") ?? [],
      );

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
      function invalidate() {
        dirty = true;
        wake();
      }
      function frame(time: number) {
        if (document.hidden || !visibleSections.size) {
          detachTicker();
          return;
        }
        lenis?.raf(time * 1000);
        const quietAct = currentAct === "warm" || currentAct === "settled";
        const movingQuietAct = quietAct && performance.now() < quietUntil;
        const render = sceneVisible() && (!quietAct || dirty || movingQuietAct);
        if (render) tickNarrative(time);
        dirty = false;
        const continuousScene = sceneVisible() && !quietAct;
        if (!continuousScene && !movingQuietAct && !lenis?.isScrolling) detachTicker();
      }

      function sync() {
        if (!ready || cancelled) return;
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
        const phase = verification < 0.3 ? "0" : verification < 0.65 ? "1" : "2";
        verificationTargets.forEach((element) => {
          element.style.setProperty("--verification-progress", verification.toFixed(5));
          element.dataset.verificationPhase = phase;
        });
        steps.forEach((element) => {
          element.dataset.verificationActive = String(element.dataset.verificationStep === phase);
        });
        if ((range.act === "warm" || range.act === "settled") && currentAct !== range.act) {
          quietUntil = performance.now() + 1200;
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
        });
        invalidate();
      }

      // These triggers measure only. CSS owns the sticky verification stage.
      sections.forEach(({ element, act }) => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: act === "dormant" ? "top top" : "top 55%",
          end: "bottom 55%",
          invalidateOnRefresh: true,
          onUpdate: sync,
          onRefresh: sync,
        });
        ranges.push({ act, trigger });
        triggers.push(trigger);
      });
      if (flagship) {
        verificationTrigger = ScrollTrigger.create({
          trigger: flagship,
          start: () => {
            const style = stage ? getComputedStyle(stage) : null;
            return style?.position === "sticky"
              ? `top top+=${Math.max(0, parseFloat(style.top) || 0)}`
              : "top 55%";
          },
          end: () => stage && getComputedStyle(stage).position === "sticky"
            ? "bottom bottom"
            : "bottom 55%",
          invalidateOnRefresh: true,
          onUpdate: sync,
          onRefresh: sync,
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
            else invalidate();
          }, { threshold: 0 })
        : null;
      sections.forEach(({ element }) => observer?.observe(element));

      function refresh() {
        if (cancelled || document.hidden) return;
        lenis?.resize();
        // Refresh only our measurements; never pin, unpin, or kill another owner.
        triggers.forEach((trigger) => trigger.refresh());
        sync();
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
        ScrollTrigger.update();
        sync();
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
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!(anchor instanceof HTMLAnchorElement) || anchor.download || (anchor.target && anchor.target !== "_self")) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
          reconcileNativeNavigation();
        }
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
          invalidate();
        } catch {
          // Native wheel/touch scrolling and ScrollTrigger remain operational.
        }
      }

      const resizeObserver = typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleRefresh)
        : null;
      sections.forEach(({ element }) => resizeObserver?.observe(element));
      // A marks first render availability. A successful late mount gets a frame
      // even if contact has already settled while its chunk was loading.
      const rendererObserver = new MutationObserver(invalidate);
      rendererObserver.observe(root, { attributes: true, attributeFilter: ["data-orb-renderer"] });
      document.addEventListener("visibilitychange", onVisibility);
      document.addEventListener("click", onAnchorClick);
      window.addEventListener("wheel", invalidate, { passive: true });
      window.addEventListener("touchstart", invalidate, { passive: true });
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
        rendererObserver.disconnect();
        triggers.forEach((trigger) => trigger.kill());
        if (refreshTimer) clearTimeout(refreshTimer);
        navigationTimers.forEach(clearTimeout);
        document.removeEventListener("visibilitychange", onVisibility);
        document.removeEventListener("click", onAnchorClick);
        window.removeEventListener("wheel", invalidate);
        window.removeEventListener("touchstart", invalidate);
        window.removeEventListener("resize", scheduleRefresh);
        window.removeEventListener("hashchange", reconcileNativeNavigation);
        window.removeEventListener("popstate", reconcileNativeNavigation);
        window.removeEventListener("pageshow", reconcileNativeNavigation);
        finePointer.removeEventListener("change", configureLenis);
        verificationTargets.forEach((element) => {
          element.style.removeProperty("--verification-progress");
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

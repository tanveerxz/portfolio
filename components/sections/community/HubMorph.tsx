"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Repeatable orb ⇄ person morph for the Community hub.
 *
 * Sets `data-morph="person"` while the hub is well in view and flips back to
 * "orb" once it has mostly left, so the morph (and the reverse) plays every
 * time the reader comes back. The thresholds are apart (hysteresis) so it
 * doesn't flicker at the edge. Without JS the attribute never appears and the
 * CSS default (the person) shows; motion-off styling ignores the attribute.
 */
export function HubMorph({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    element.dataset.morph = "orb";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= 0.55) element.dataset.morph = "person";
        else if (entry.intersectionRatio <= 0.2) element.dataset.morph = "orb";
      },
      { threshold: [0, 0.2, 0.55, 1] },
    );
    observer.observe(element);
    // The hub's pulsing link lines are main-thread animations that never
    // finished, even far offscreen, so every frame of the page restyled them.
    // data-near lets CSS pause them outside a generous band around the hub.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry) element.dataset.near = String(entry.isIntersecting);
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(element);
    return () => {
      observer.disconnect();
      near.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

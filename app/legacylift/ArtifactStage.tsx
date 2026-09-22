"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Hosts one homepage Artifact outside the sticky stage.
 *
 * The Artifacts' live CSS keys off `.verification-stage[data-verification-phase]`.
 * Server HTML carries the artifact's own phase, so it renders in its final
 * state with no JS and under reduced motion. With full motion, an artifact
 * that is still below the fold is "armed" (phase cleared) and plays its
 * entrance once, when it scrolls in. One layout read at mount, then an
 * IntersectionObserver; no scroll listeners.
 */
export function ArtifactStage({ phase, className, children }: { phase: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host || document.documentElement.dataset.motion !== "full" || typeof IntersectionObserver === "undefined") return;
    if (host.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setArmed(false);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`verification-stage${className ? ` ${className}` : ""}`} data-verification-phase={armed ? "idle" : String(phase)}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import styles from "./Shell.module.css";

type MotionMode = "full" | "reduced";

/**
 * Manual motion preference. Contract (build/00-foundation.md): persists
 * localStorage 'portfolio-motion', sets html[data-motion], dispatches
 * 'portfolio:motion-change' with { motion }.
 *
 * Accessible name is constant ("Reduce motion"); state is aria-pressed.
 */
export function MotionToggle() {
  const [mode, setMode] = useState<MotionMode>("full");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setMode(root.dataset.motion === "reduced" ? "reduced" : "full");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    window.addEventListener("portfolio:motion-change", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio:motion-change", sync);
    };
  }, []);

  const toggle = () => {
    const next: MotionMode = mode === "full" ? "reduced" : "full";
    setMode(next);
    document.documentElement.dataset.motion = next;
    try {
      localStorage.setItem("portfolio-motion", next);
    } catch {
      // Preference still applies for this page view.
    }
    window.dispatchEvent(new CustomEvent("portfolio:motion-change", { detail: { motion: next } }));
  };

  const reduced = mode === "reduced";

  return (
    <button
      type="button"
      className={styles.motion}
      onClick={toggle}
      aria-pressed={reduced}
      data-state={mode}
      data-focus-ring=""
    >
      <span className={styles.motionSwitch} aria-hidden="true">
        <span className={styles.motionKnob} />
      </span>
      {/* Clipped (not display:none) on phones, so it stays the accessible name. */}
      <span className={styles.motionText}>Reduce motion</span>
    </button>
  );
}

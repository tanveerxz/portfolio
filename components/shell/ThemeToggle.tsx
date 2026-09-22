"use client";

import { useId } from "react";

import { setTheme, useTheme } from "@/lib/theme";

import styles from "./Shell.module.css";

/**
 * Light / dark theme switch (lib/theme.ts). Dark is the default; light is an
 * opt-in that persists in localStorage 'portfolio-theme'.
 *
 * Accessible name is constant ("Light theme"); state is aria-pressed. The
 * glyph is a moon in dark that opens into a sun in light: one circle, a
 * sliding mask for the crescent, and rays that scale in.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const light = theme === "light";
  const maskId = `${useId().replace(/:/g, "")}-crescent`;

  return (
    <button
      type="button"
      className={styles.theme}
      onClick={() => setTheme(light ? "dark" : "light")}
      aria-pressed={light}
      data-state={theme}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      data-focus-ring=""
    >
      <svg className={styles.themeGlyph} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <mask id={maskId}>
          <rect width="24" height="24" fill="#fff" />
          <circle className={styles.themeBite} cx="17" cy="7" r="7" fill="#000" />
        </mask>
        <circle className={styles.themeCore} cx="12" cy="12" r="7.5" fill="currentColor" mask={`url(#${maskId})`} />
        <g className={styles.themeRays} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" />
        </g>
      </svg>
      <span className="visually-hidden">Light theme</span>
    </button>
  );
}

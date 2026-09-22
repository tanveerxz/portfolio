/**
 * Colour theme contract.
 *
 * - html[data-theme="dark" | "light"], set before first paint by the boot
 *   script in app/layout.tsx (localStorage 'portfolio-theme', else dark).
 *   The OS preference is deliberately ignored: light is an opt-in.
 * - The server always renders the dark theme; every token lives in
 *   app/globals.css under :root and :root[data-theme="light"].
 * - setTheme() persists, updates the theme-color / color-scheme meta tags and
 *   dispatches 'portfolio:theme-change' with { theme }.
 */
import { useSyncExternalStore } from "react";

import { THEME_COLOR, THEME_KEY, type Theme } from "./theme-boot";

export { THEME_COLOR, THEME_KEY, themeBoot, type Theme } from "./theme-boot";

export function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function syncMeta(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme);
}

function reducedMotion() {
  return (
    document.documentElement.dataset.motion === "reduced" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Apply, persist and announce a theme. Cross-fades with the View
 *  Transitions API where supported and motion is allowed. */
export function setTheme(theme: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    syncMeta(theme);
    window.dispatchEvent(new CustomEvent("portfolio:theme-change", { detail: { theme } }));
  };
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Still applies for this page view.
  }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof doc.startViewTransition === "function" && !reducedMotion()) {
    doc.startViewTransition(apply);
  } else {
    apply();
  }
}

/* ------------------------------------------------------------------ */
/* Subscription (one MutationObserver for the whole app)               */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;
let last: Theme | null = null;

function notify() {
  const next = readTheme();
  if (next === last) return;
  last = next;
  listeners.forEach((listener) => listener());
}

/** Call `listener` whenever html[data-theme] changes. Returns unsubscribe. */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  if (!observer && typeof MutationObserver !== "undefined") {
    last = readTheme();
    observer = new MutationObserver(notify);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

/** Current theme; "dark" on the server and during hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, readTheme, () => "dark");
}

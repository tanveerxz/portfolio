"use client";

import { useEffect } from "react";

/**
 * Same-page anchor links glide instead of jumping.
 *
 * Runs in the capture phase so it resolves the click before next/link and the
 * NarrativeController's native-navigation reconcile (both skip prevented
 * events). The scroll itself is requested via `portfolio:scrollto`; the
 * NarrativeController answers with Lenis when it owns the page, otherwise we
 * fall back to native smooth scrolling. Motion off → an instant jump.
 */
export type ScrollRequest = { top: number; target: HTMLElement | null; handled: boolean; done: () => void };

function scrollPadding() {
  const value = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(value) ? value : 0;
}

function focusTarget(target: HTMLElement | null) {
  if (!target) return;
  if (!target.hasAttribute("tabindex") && target.tabIndex < 0) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function SmoothAnchors() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return; // Unknown hash: leave it to the browser.

      event.preventDefault();
      const top = target
        ? Math.max(0, target.getBoundingClientRect().top + scrollY - scrollPadding())
        : 0;
      if (url.hash !== location.hash) history.pushState(history.state, "", url.hash || url.pathname);

      const reduced = document.documentElement.dataset.motion === "reduced";
      if (reduced) {
        scrollTo({ top, behavior: "auto" });
        focusTarget(target);
        return;
      }

      const request: ScrollRequest = { top, target, handled: false, done: () => focusTarget(target) };
      dispatchEvent(new CustomEvent<ScrollRequest>("portfolio:scrollto", { detail: request }));
      if (!request.handled) {
        scrollTo({ top, behavior: "smooth" });
        focusTarget(target);
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

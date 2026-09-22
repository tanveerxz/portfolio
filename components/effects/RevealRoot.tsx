"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The single IntersectionObserver behind <Reveal> / <SplitLines>.
 * Mounted once in app/layout.tsx. Renders nothing.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const pending = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );
    const height = window.innerHeight;

    // Anything on screen now is final already: mark it before hiding the rest.
    const offscreen = pending.filter((element) => {
      const rect = element.getBoundingClientRect();
      const onScreen = rect.top < height && rect.bottom > 0;
      if (onScreen) element.dataset.revealed = "";
      return !onScreen;
    });
    root.dataset.revealReady = "";

    if (typeof IntersectionObserver === "undefined") {
      offscreen.forEach((element) => (element.dataset.revealed = ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    offscreen.forEach((element) => observer.observe(element));

    // A fragment jump (e.g. /#contact) lands mid-page: reveal what it lands on.
    const onHash = () => {
      requestAnimationFrame(() => {
        const h = window.innerHeight;
        offscreen.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top < h && rect.bottom > 0) element.dataset.revealed = "";
        });
      });
    };
    window.addEventListener("hashchange", onHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, [pathname]);

  return null;
}

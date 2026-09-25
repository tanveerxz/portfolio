"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ThinkingDot } from "@/components/effects/ThinkingDot";
import { NAV_ITEMS, SITE } from "@/config/site";

import { MobileMenu } from "./MobileMenu";
import { MotionToggle } from "./MotionToggle";
import { NavIndicator } from "./NavIndicator";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Shell.module.css";

/** Which in-page section currently crosses the middle band of the viewport. */
function useActiveSection(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const ids = NAV_ITEMS.map((item) => item.href.split("#")[1]).filter(Boolean) as string[];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!sections.length) return;
    const onScreen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onScreen.add(entry.target.id);
          else onScreen.delete(entry.target.id);
        });
        setActive(ids.find((id) => onScreen.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

/** Hide on scroll down, reveal on scroll up; always visible near the top. */
function useHeaderScroll(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      // Write attributes only on change: every write invalidates style.
      const set = (key: "scrolled" | "hidden", value: string) => {
        if (header.dataset[key] !== value) header.dataset[key] = value;
      };
      set("scrolled", y > 24 ? "true" : "false");
      if (header.contains(document.activeElement) || header.dataset.menu === "open") {
        set("hidden", "false");
      } else if (Math.abs(delta) > 6) {
        set("hidden", delta > 0 && y > 240 ? "true" : "false");
      }
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onFocus = () => (header.dataset.hidden = "false");
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const active = useActiveSection(onHome);
  useHeaderScroll(headerRef);

  return (
    <header ref={headerRef} className={styles.header} data-hidden="false" data-scrolled="false">
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} aria-label={`${SITE.name}, home`} data-focus-ring="">
          <ThinkingDot state="breathing" className={styles.brandDot} />
          <span className={styles.brandName}>{SITE.name}</span>
        </Link>

        <NavIndicator active={onHome ? active : null} />

        <div className={styles.controls}>
          {/* Hidden by default (owner request, QA session 2) and revealed by
              Shell.module.css only for visitors whose device asks for reduced
              motion, who would otherwise be stuck on the static site with no
              way back. See the .motion rules there. */}
          <MotionToggle />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

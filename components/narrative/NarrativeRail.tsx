"use client";

import { useEffect, useRef } from "react";

import { narrativeState, subscribeNarrative } from "@/lib/narrative-state";
import type { NarrativeAct } from "@/lib/narrative-state";

import styles from "./NarrativeRail.module.css";

// Real section names (the owner's own headings/ids), not invented labels.
const chapters: { act: NarrativeAct; href: string; label: string }[] = [
  { act: "dormant", href: "#top", label: "Tanveer" },
  { act: "active-thinking", href: "#flagship", label: "LegacyLift" },
  { act: "fragmented", href: "#work", label: "Work" },
  { act: "warm", href: "#community", label: "Community" },
  { act: "settled", href: "#contact", label: "Contact" },
];

export function NarrativeRail() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = Array.from(
      ref.current?.querySelectorAll<HTMLAnchorElement>("a[data-act]") ?? [],
    );
    let current: NarrativeAct | null = null;
    // State listeners fire on every scroll frame; touch the DOM on act change only.
    const sync = () => {
      if (narrativeState.act === current) return;
      current = narrativeState.act;
      items.forEach((item) => {
        const active = item.dataset.act === current;
        item.dataset.active = String(active);
        if (active) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
    };
    sync();
    return subscribeNarrative(sync);
  }, []);

  return (
    <nav ref={ref} className={styles.rail} aria-label="Story chapters">
      <span className={styles.track} aria-hidden="true" />
      {chapters.map((chapter) => (
        <a
          key={chapter.act}
          href={chapter.href}
          data-act={chapter.act}
          className={styles.chapter}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.label}>{chapter.label}</span>
        </a>
      ))}
    </nav>
  );
}

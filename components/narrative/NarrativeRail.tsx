"use client";

import { useEffect, useRef } from "react";

import { narrativeState, subscribeNarrative } from "@/lib/narrative-state";
import type { NarrativeAct } from "@/lib/narrative-state";

import styles from "./NarrativeRail.module.css";

const chapters: { act: NarrativeAct; href: string; label: string }[] = [
  { act: "dormant", href: "#top", label: "Idea" },
  { act: "active-thinking", href: "#flagship", label: "Proof" },
  { act: "fragmented", href: "#work", label: "Systems" },
  { act: "warm", href: "#community", label: "People" },
  { act: "settled", href: "#contact", label: "Contact" },
];

export function NarrativeRail() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => {
      ref.current?.querySelectorAll<HTMLAnchorElement>("a[data-act]").forEach((item) => {
        const active = item.dataset.act === narrativeState.act;
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

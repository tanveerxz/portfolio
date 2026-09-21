"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS, SITE } from "@/config/site";
import styles from "./Shell.module.css";

type MotionMode = "full" | "reduced";

function MotionToggle() {
  const [mode, setMode] = useState<MotionMode>("full");
  useEffect(() => {
    const sync = () => setMode(document.documentElement.dataset.motion === "reduced" ? "reduced" : "full");
    sync();
    window.addEventListener("portfolio:motion-change", sync);
    return () => window.removeEventListener("portfolio:motion-change", sync);
  }, []);
  const toggle = () => {
    const next: MotionMode = mode === "full" ? "reduced" : "full";
    setMode(next);
    document.documentElement.dataset.motion = next;
    try { localStorage.setItem("portfolio-motion", next); } catch {}
    window.dispatchEvent(new CustomEvent("portfolio:motion-change", { detail: { motion: next } }));
  };
  return (
    <button type="button" className={styles.motion} onClick={toggle} aria-pressed={mode === "reduced"} aria-label={mode === "full" ? "Pause motion" : "Enable motion"}>
      <span aria-hidden="true" className={styles.motionIcon}>{mode === "full" ? "Ⅱ" : "▶"}</span>
      <span className={styles.motionText}>{mode === "full" ? "Pause" : "Play"}</span>
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>{SITE.name}</Link>
        <nav aria-label="Primary" className={styles.desktopNav}>
          {NAV_ITEMS.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.controls}>
          <MotionToggle />
          <button type="button" className={styles.menuButton} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>Menu</button>
        </div>
      </div>
      <div id="mobile-navigation" className={styles.mobilePanel} hidden={!open}>
        <nav aria-label="Mobile primary">
          {NAV_ITEMS.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { useLiquid } from "@/components/effects/liquid/useLiquid";
import { useEffectGate } from "@/components/effects/runtime";
import { NAV_ITEMS } from "@/config/site";
import { useTheme } from "@/lib/theme";

import styles from "./Shell.module.css";

/**
 * Phone/tablet navigation (< 900px). The Menu pill and its panel are two
 * liquid-gooey morph items sharing one goo filter: opening drips the panel
 * out of the pill and morphs it to full size; closing pulls it back in.
 *
 * Disclosure pattern (not a modal): aria-expanded/aria-controls, Escape and
 * outside-click close, focus moves to the first link on open and back to the
 * toggle on close, focus leaving the menu closes it. Closed panel is inert.
 * Without liquid-gooey the same panel opens as a plain surface.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [narrow, setNarrow] = useState(false);
  const enabled = useEffectGate(rootRef, "low", "0px");
  const liquid = useLiquid(enabled && narrow);
  // liquid-gooey parses `shadow` into an SVG filter, so it takes a literal
  // colour per theme (fill is plain CSS and reads the token directly).
  const gooShadow = useTheme() === "light" ? "0 18px 40px rgba(58,60,74,.2)" : "0 18px 40px rgba(0,0,0,.45)";

  useEffect(() => {
    const query = window.matchMedia("(max-width: 899px)");
    const sync = () => {
      setNarrow(query.matches);
      if (!query.matches) setOpen(false);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const header = rootRef.current?.closest("header");
    if (header) header.dataset.menu = open ? "open" : "closed";
    if (!open) return;
    const firstLink = rootRef.current?.querySelector<HTMLAnchorElement>("[data-menu-link]");
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  // If liquid swaps in while the toggle has focus, keep focus on the toggle.
  const hadFocus = useRef(false);
  useEffect(() => {
    if (hadFocus.current) buttonRef.current?.focus();
  }, [liquid]);

  const toggle = (
    <button
      ref={buttonRef}
      type="button"
      className={styles.menuButton}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((value) => !value)}
      onFocus={() => (hadFocus.current = true)}
      onBlur={() => (hadFocus.current = false)}
      data-focus-ring=""
    >
      <span className={styles.menuLabel}>{open ? "Close" : "Menu"}</span>
      <span className={styles.menuGlyph} aria-hidden="true" />
    </button>
  );

  const panel = (
    <div
      id={panelId}
      className={styles.menuPanel}
      data-open={open ? "true" : "false"}
      aria-hidden={!open}
      {...({ inert: open ? undefined : "" } as Record<string, string | undefined>)}
    >
      <nav aria-label="Primary">
        <ul className={styles.menuList}>
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href} style={{ "--i": index } as React.CSSProperties}>
              <Link
                href={item.href}
                data-menu-link=""
                className={styles.menuLink}
                onClick={() => close(false)}
                tabIndex={open ? undefined : -1}
              >
                <span>{item.label}</span>
                <span className={styles.menuIndex} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  let body: ReactNode;
  if (liquid) {
    const { Liquid } = liquid;
    body = (
      <Liquid className={styles.menuGoo} fill="var(--nav-fill)" blur={9} contrast={20} shadow={gooShadow}>
        <Liquid.Item observe>{toggle}</Liquid.Item>
        <Liquid.Item morph={{ shape: true, bounce: 0.28, speed: 1.15, contentBlur: 4 }}>{panel}</Liquid.Item>
      </Liquid>
    );
  } else {
    body = (
      <>
        {toggle}
        {panel}
      </>
    );
  }

  return (
    <div
      ref={rootRef}
      className={styles.menuRoot}
      data-liquid={liquid ? "on" : "off"}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node | null) && event.relatedTarget) {
          setOpen(false);
        }
      }}
    >
      {body}
    </div>
  );
}

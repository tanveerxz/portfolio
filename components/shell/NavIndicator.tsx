"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useEffectGate } from "@/components/effects/runtime";
import { useLiquid } from "@/components/effects/liquid/useLiquid";
import { Beam } from "@/components/effects/beam/Beam";
import { NAV_ITEMS } from "@/config/site";

import styles from "./Shell.module.css";

/**
 * Desktop primary navigation: a floating pill with a slow mono border-beam
 * riding its edge, whose hover/active highlight is
 * a liquid-gooey "move" blob that trails the pointer between links like
 * liquid rubber. Before liquid-gooey loads (or with motion off) the same
 * highlight is a plain CSS pill — identical geometry, no trail.
 *
 * The highlight is positioned imperatively (no React render per hover).
 */
export function NavIndicator({ active }: { active: string | null }) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const enabled = useEffectGate(navRef, "low", "0px");
  const liquid = useLiquid(enabled);

  const target = hovered ?? active;

  const place = useCallback(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const link = target
      ? nav.querySelector<HTMLAnchorElement>(`a[data-id="${target}"]`)
      : null;
    if (!link) {
      indicator.dataset.visible = "false";
      return;
    }
    const firstPlacement = indicator.dataset.visible !== "true";
    if (firstPlacement) indicator.style.transition = "none";
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translate3d(${link.offsetLeft}px, 0, 0)`;
    indicator.dataset.visible = "true";
    if (firstPlacement) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
  }, [target]);

  useEffect(place, [place, liquid]);

  useEffect(() => {
    const onResize = () => place();
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  const indicator = <span ref={indicatorRef} className={styles.indicator} data-visible="false" />;

  return (
    <Beam kind="travel" tone="mono" strength={0.75} duration={9} radius={26} className={styles.navBeam}>
    <nav
      ref={navRef}
      aria-label="Primary"
      className={styles.desktopNav}
      data-liquid={liquid ? "on" : "off"}
      onPointerLeave={() => setHovered(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null);
      }}
    >
      <span className={styles.indicatorLayer} aria-hidden="true">
        {liquid ? (
          <liquid.Liquid className={styles.indicatorGoo} fill="var(--nav-indicator)" blur={7} contrast={16}>
            <liquid.Liquid.Item effect="move" move={{ springiness: 0.55, wobble: 0.45, stretch: 0.32, trail: 0.5 }}>
              {indicator}
            </liquid.Liquid.Item>
          </liquid.Liquid>
        ) : (
          indicator
        )}
      </span>
      {NAV_ITEMS.map((item) => {
        const id = item.href.split("#")[1] ?? item.href;
        const current = active === id;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-id={id}
            data-current={current ? "true" : undefined}
            aria-current={current ? "location" : undefined}
            className={styles.navLink}
            onPointerEnter={() => setHovered(id)}
            onFocus={() => setHovered(id)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
    </Beam>
  );
}

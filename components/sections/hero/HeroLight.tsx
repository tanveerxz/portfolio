"use client";

import { useEffect, useRef } from "react";

import { useFinePointer, useMotionMode } from "@/components/effects/runtime";

import styles from "./Hero.module.css";

/**
 * A soft periwinkle key light that follows the pointer across the hero.
 * Transform-only on one pre-rendered gradient (no repaint per frame), fine
 * pointers + full motion only, listeners detached while the hero is offscreen.
 */
export function HeroLight() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const motion = useMotionMode();

  // Flag hero visibility so its looping CSS (scroll light) pauses offscreen.
  useEffect(() => {
    const hero = ref.current?.parentElement;
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      hero.dataset.inview = entry?.isIntersecting ? "true" : "false";
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const light = ref.current;
    const hero = light?.parentElement;
    if (!light || !hero || !fine || motion !== "full") return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let attached = false;
    let rect = hero.getBoundingClientRect();

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      light.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
      light.dataset.on = "true";
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      light.dataset.on = "false";
    };
    const measure = () => {
      rect = hero.getBoundingClientRect();
    };
    const attach = () => {
      if (attached) return;
      attached = true;
      measure();
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", measure, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? attach() : detach()));
    observer.observe(hero);
    return () => {
      observer.disconnect();
      detach();
      light.style.transform = "";
      light.dataset.on = "false";
    };
  }, [fine, motion]);

  return <div ref={ref} className={styles.light} data-on="false" aria-hidden="true" />;
}

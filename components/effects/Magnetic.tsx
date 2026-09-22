"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useFinePointer, useMotionMode } from "./runtime";

export interface MagneticProps {
  children: ReactNode;
  /** Max travel in px toward the pointer. Default 10. */
  pull?: number;
  /** Extra hit radius in px around the element. Default 36. */
  reach?: number;
  className?: string;
}

/**
 * Pointer-magnetism for primary actions (fine pointers + full motion only).
 * One rAF while the pointer is near; nothing runs otherwise. Transform-only,
 * so the control's layout box and focus ring never move for keyboard users.
 */
export function Magnetic({ children, pull = 10, reach = 36, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const motion = useMotionMode();

  useEffect(() => {
    const host = ref.current;
    const target = host?.firstElementChild as HTMLElement | null;
    if (!host || !target || !fine || motion !== "full") return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      target.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const inside =
        Math.abs(dx) < rect.width / 2 + reach && Math.abs(dy) < rect.height / 2 + reach;
      tx = inside ? (dx / (rect.width / 2 + reach)) * pull : 0;
      ty = inside ? (dy / (rect.height / 2 + reach)) * pull : 0;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    const zone = host.parentElement ?? host;
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      target.style.transform = "";
    };
  }, [fine, motion, pull, reach]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex" }}>
      {children}
    </span>
  );
}

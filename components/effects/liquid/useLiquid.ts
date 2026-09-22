"use client";

import { useEffect, useState } from "react";

/**
 * Lazy access to `liquid-gooey` (≈95 kB). The module is fetched once, on
 * demand, and shared. Returns null until loaded or while `enabled` is false,
 * so callers render their CSS fallback first and upgrade in place.
 */
export type LiquidModule = typeof import("liquid-gooey");

let pending: Promise<LiquidModule> | null = null;

export function loadLiquid(): Promise<LiquidModule> {
  pending ??= import("liquid-gooey");
  return pending;
}

export function useLiquid(enabled: boolean): LiquidModule | null {
  const [mod, setMod] = useState<LiquidModule | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    loadLiquid()
      .then((loaded) => {
        if (alive) setMod(loaded);
      })
      .catch(() => {
        // CSS fallback stays in place.
      });
    return () => {
      alive = false;
    };
  }, [enabled]);
  return enabled ? mod : null;
}

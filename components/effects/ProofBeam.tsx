"use client";

import type { ReactNode } from "react";

import { Beam } from "./beam/Beam";

/**
 * The flagship verification visual's edge: a slow periwinkle light travelling
 * the frame (one 7s lap). Thin preset over <Beam>
 * kept for the Flagship section's existing import. New code uses <Beam>.
 */
export function ProofBeam({
  children,
  className,
  radius = 28,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <Beam kind="travel" tone="ocean" strength={0.85} duration={7} radius={radius} rest={0} className={className}>
      {children}
    </Beam>
  );
}

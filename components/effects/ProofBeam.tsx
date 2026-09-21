"use client";

import { BorderBeam } from "border-beam";
import type { ReactNode } from "react";

export function ProofBeam({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <BorderBeam
      size="pulse-inner"
      colorVariant="mono"
      theme="dark"
      staticColors
      strength={0.72}
      duration={3.8}
      borderRadius={28}
      className={className}
    >
      {children}
    </BorderBeam>
  );
}

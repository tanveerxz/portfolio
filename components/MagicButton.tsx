"use client";

import React from "react";
import clsx from "clsx";

type Size = "md" | "lg";
type Variant = "primary" | "secondary" | "ghost";

type Props = {
  title: string;
  icon?: React.ReactNode;
  position?: "left" | "right";
  variant?: Variant;
  size?: Size;
  handleClick?: () => void;
  otherClasses?: string;
  fullWidth?: boolean;
  className?: string; // ✅ allow className from parent
};

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const innerByVariant: Record<Variant, string> = {
  primary:
    "bg-slate-950 text-white hover:bg-slate-900/90 active:scale-[0.98] " +
    "shadow-[0_8px_24px_rgba(56,189,248,.22)] hover:shadow-[0_12px_30px_rgba(56,189,248,.32)]",
  secondary:
    "bg-transparent text-white/85 border border-white/20 hover:text-white hover:border-white/35 hover:bg-white/5",
  ghost: "bg-transparent text-white/70 hover:text-white",
};

const MagicButton = ({
  title,
  icon,
  position = "right",
  variant = "primary",
  size = "lg",
  handleClick,
  otherClasses,
  fullWidth,
  className, // ✅ receive it
}: Props) => {
  return (
    <button
      onClick={handleClick}
      className={clsx(
        "relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none transition-all",
        fullWidth ? "w-full" : "w-auto",
        size === "lg" ? "h-12" : "h-11",
        className // ✅ apply to outer button (good for width/display tweaks)
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_40%,#E2CBFF_80%,#393BB2_100%)]" />
      )}

      <span
        className={clsx(
          // ⬅️ add h-full back
          "inline-flex h-full w-full items-center justify-center gap-2 rounded-lg backdrop-blur-2xl",
          innerByVariant[variant],
          sizeClasses[size],
          otherClasses
        )}
      >
        {position === "left" && icon}
        <span className="font-medium">{title}</span>
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;

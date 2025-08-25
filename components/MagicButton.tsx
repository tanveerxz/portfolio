"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  title: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  otherClasses?: string;
};

const MagicButton = ({
  title,
  icon,
  iconPosition = "right",
  onClick,
  variant = "primary",
  fullWidth = false,
  otherClasses,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none transition-all",
        fullWidth ? "w-full" : "w-auto",
        otherClasses
      )}
    >
      {/* Animated border only for primary style */}
      {variant === "primary" && (
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_40%,#E2CBFF_80%,#393BB2_100%)]" />
      )}

      <span
        className={clsx(
          "inline-flex h-full w-full items-center justify-center gap-2 rounded-lg px-6 font-medium backdrop-blur-2xl transition-all",
          {
            "bg-slate-950 text-white hover:bg-slate-900/90 active:scale-[0.98]":
              variant === "primary",
            "bg-transparent border border-white/20 text-white/80 hover:text-white hover:bg-white/5":
              variant === "secondary",
            "bg-transparent text-white/70 hover:text-white":
              variant === "ghost",
          }
        )}
      >
        {icon && iconPosition === "left" && (
          <span className="shrink-0 translate-y-[0.5px]">{icon}</span>
        )}
        {title}
        {icon && iconPosition === "right" && (
          <span className="shrink-0 translate-y-[0.5px]">{icon}</span>
        )}
      </span>
    </button>
  );
};

export default MagicButton;

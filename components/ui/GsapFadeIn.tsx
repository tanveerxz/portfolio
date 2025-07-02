"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

const GsapFadeIn = ({
  children,
  className,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0, duration: 1 },
}: {
  children: React.ReactNode;
  className?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
}) => {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (el.current) {
        gsap.fromTo(el.current, from, to);
      }
    }, el);
    return () => ctx.revert();
  }, [from, to]);

  return (
    <div ref={el} className={cn(className)}>
      {children}
    </div>
  );
};

export default GsapFadeIn;

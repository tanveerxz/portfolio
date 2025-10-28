"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/data";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const useAutoplay = (enabled: boolean, delay = 6000) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), delay);
    return () => clearInterval(id);
  }, [enabled, delay]);
  return tick;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
};

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`relative rounded-3xl border overflow-hidden border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(1000px_400px_at_-20%_-20%,rgba(255,255,255,0.14),transparent_40%),radial-gradient(600px_260px_at_120%_0%,rgba(255,255,255,0.08),transparent_40%)] ${className}`}
  >
    <div className="pointer-events-none absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    {children}
  </div>
);

const Avatar: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) => (
  <div className="relative size-14 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-white/60 via-white/20 to-transparent">
    <img
      src={
        src ||
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop&ixlib=rb-4.0.3&crop=faces"
      }
      alt={alt || "Client"}
      className="size-full rounded-full object-cover"
    />
  </div>
);

const IndicatorBar: React.FC<{
  activeIndex: number;
  prevIndex: number;
  total: number;
  onClick: (i: number) => void;
}> = ({ activeIndex, prevIndex, total, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLDivElement[]>([]);
  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const baseLeft = containerRef.current!.getBoundingClientRect().left;
      const newPositions = dotRefs.current.map((el) =>
        el ? el.getBoundingClientRect().left - baseLeft + el.offsetWidth / 2 : 0
      );
      setPositions(newPositions);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const DOT = 12; // base dot width
  const PILL = 40; // pill width

  const start = positions[prevIndex] ?? 0;
  const end = positions[activeIndex] ?? 0;
  const minLeft = Math.min(start, end);
  const bridgeWidth = Math.abs(end - start) + PILL;

  return (
    <div ref={containerRef} className="relative flex items-center gap-3 mt-8">
      {/* Static dots */}
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) dotRefs.current[i] = el;
          }}
          onClick={() => onClick(i)}
          className="h-2 w-3 rounded-full bg-white/25 hover:bg-white/40 transition-colors"
        />
      ))}

      {/* Animated runner pill */}
      {positions.length === total && (
        <motion.div
          key={`${prevIndex}-${activeIndex}`}
          className="absolute top-0 h-2 rounded-full bg-white"
          initial={{ left: start - PILL / 2, width: PILL }}
          animate={{
            left: [start - PILL / 2, minLeft - PILL / 2, end - PILL / 2],
            width: [PILL, bridgeWidth, PILL],
          }}
          transition={{
            duration: 0.45,
            ease: ["easeInOut", "linear", "easeInOut"],
            times: [0, 0.5, 1],
          }}
        />
      )}
    </div>
  );
};

const Clients: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevIndex = useRef(0);

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => {
      prevIndex.current = i;
      return (i + dir + testimonials.length) % testimonials.length;
    });
  };

  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const visible = useRef(true);

  useEffect(() => {
    const onVis = () =>
      (visible.current = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const autoplayTick = useAutoplay(!hovering && !reducedMotion, 6000);
  useEffect(() => {
    if (!visible.current) return;
    setIndex((i) => (i + 1) % testimonials.length);
  }, [autoplayTick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const startX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 48) {
      go(dx < 0 ? 1 : -1);
      startX.current = e.touches[0].clientX;
    }
  };

  const item = useMemo(() => testimonials[index] ?? {}, [index]);

  return (
    <section id="testimonials" className="relative z-20 isolate py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 backdrop-blur">
            <div className="size-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-white/80">What clients say</span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Built for outcomes. Designed to convert.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-white/70">
            Real projects, measurable impact. Here’s a snapshot of the
            experience working with me.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-8">
            <GlassCard>
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Client testimonials"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                className="relative p-6 sm:p-8 md:p-10"
              >
                <div className="absolute inset-x-0 top-0 flex justify-between p-3 md:p-4">
                  <button
                    aria-label="Previous testimonial"
                    onClick={() => go(-1)}
                    className="group rounded-full border border-white/20 bg-white/[0.06] p-2 backdrop-blur hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <ChevronLeft className="size-5 text-white/80 group-hover:text-white" />
                  </button>
                  <button
                    aria-label="Next testimonial"
                    onClick={() => go(1)}
                    className="group rounded-full border border-white/20 bg-white/[0.06] p-2 backdrop-blur hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <ChevronRight className="size-5 text-white/80 group-hover:text-white" />
                  </button>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: direction === 1 ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -30 : 30 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                  >
                    <div className="flex items-start gap-4 md:gap-6">
                      <Avatar src={item.imgUrl} alt={item.name} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-white md:text-xl">
                            {item.name || "Client"}
                          </h3>
                          {item.title && (
                            <span className="text-sm text-white/60">
                              {item.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 md:mt-8">
                      <Quote className="absolute -left-2 -top-2 size-5 text-white/25" />
                      <blockquote className="text-pretty text-base leading-relaxed text-white/90 md:text-lg">
                        {item.quote ||
                          "Outstanding delivery, thoughtful communication, and a product that genuinely moved our metrics."}
                      </blockquote>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        Start a project
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>

                    <div className="relative">
                      <IndicatorBar
                        activeIndex={index}
                        prevIndex={useRef(index).current}
                        total={testimonials.length}
                        onClick={(i) => {
                          prevIndex.current = index;
                          setIndex(i);
                        }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>

          <div className="hidden md:grid md:col-span-5 lg:col-span-4 grid-cols-1 gap-4">
            {testimonials.slice(0, 4).map((t, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label={`Focus testimonial from ${t.name}`}
              >
                <GlassCard
                  className={`${
                    i === index ? "ring-1 ring-white/30" : ""
                  } transition-transform duration-300 hover:-translate-y-0.5`}
                >
                  <div className="flex items-start gap-3 p-4 sm:p-5">
                    <Avatar src={t.imgUrl} alt={t.name} />
                    <div className="min-w-0">
                      <p className="line-clamp-3 text-sm text-white/80">
                        “{t.quote}”
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                        <span className="font-medium text-white/80">
                          {t.name}
                        </span>
                        {t.title && (
                          <span className="text-white/50">• {t.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;

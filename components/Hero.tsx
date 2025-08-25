"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
// import DottedBackdrop from "../components/hero/DottedBackDrop";

const HeroScene = dynamic(() => import("./hero/Scene"));

const Hero = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);

  return (
    // 1) Fit the screen; define --nav-safe for the pin fold
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden"
      style={
        {
          // Safe space for FloatingNav + breathing room
          // Tweak to your actual nav height if needed
          ["--nav-safe" as any]: "7.5rem",
        } as React.CSSProperties
      }
    >
      {/* <DottedBackdrop /> */}
      <HeroScene pinRef={pinRef} />

      {/* Content that pins the zoom timeline */}
      <div id="hero-pin" ref={pinRef} className="relative z-10">
        {/* Top padding equal to nav-safe so nothing hides under the nav */}
        <div className="px-6" style={{ paddingTop: "var(--nav-safe)" }}>
          <div className="mx-auto w-full max-w-[1200px]">
            {/* 2) The entire first fold MUST fit: */}
            <div className="min-h-[calc(100svh-var(--nav-safe))] grid place-items-center">
              <div className="w-full flex flex-col items-center md:items-start">
                {/* 3) Tight typography that fits 1366×768 cleanly */}
                <h1 className="text-center md:text-left leading-[1.02] tracking-[-0.01em] text-white">
                  <span className="block text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold">
                    Crafting Innovative Frontend
                  </span>
                  <span className="block text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-300">
                    Solutions with Precision &amp; Style
                  </span>
                </h1>

                <p className="mt-3 md:mt-4 text-center md:text-left text-white/75 text-[clamp(0.95rem,1.4vw,1.2rem)] max-w-[52ch]">
                  I’m Tanveer — React/Next developer in London, building
                  premium, performant interfaces with tasteful motion.
                </p>

                <div className="mt-7 md:mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3.5 sm:gap-4">
                  {/* Primary */}
                  <a href="#projects" className="w-full sm:w-auto">
                    <MagicButton
                      title="View My Work"
                      icon={<FaLocationArrow />}
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    />
                  </a>

                  {/* Secondary */}
                  <a href="#contact" className="w-full sm:w-auto">
                    <MagicButton
                      title="Let’s Connect"
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto"
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            d="M5 12h14M13 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                  </a>

                  {/* Tertiary (text link) */}
                  <a
                    href="#about"
                    className="text-white/65 hover:text-white/95 text-sm underline underline-offset-4"
                  >
                    Learn about my approach
                  </a>
                </div>

                {/* 5) Trust row, compact so it never pushes below the fold */}
                <div className="mt-6 md:mt-7 flex items-center gap-3 text-white/70">
                  {/* <div className="flex -space-x-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="inline-block h-8 w-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm"
                      />
                    ))}
                  </div> */}
                  <span className="text-sm md:text-[0.95rem]">
                    Trusted by{" "}
                    <span className="text-white/90 font-medium">
                      50+ clients
                    </span>{" "}
                    — 5★ average
                  </span>
                </div>
              </div>
            </div>

            {/* 6) Tiny footer spacer so nothing clips on short viewports */}
            <div className="pb-4 md:pb-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import SplashLoader from "./hero/SplashLoader";

// IMPORTANT: client only
const HeroScene = dynamic(() => import("./hero/Scene"), { ssr: false });

const Hero = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // safety auto-hide after 5s in case onReady never fires
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden"
      style={{ ["--nav-safe" as any]: "7.5rem" } as React.CSSProperties}
    >
      {/* 1) Global lock BEFORE hydration; toggles off when ready */}
      <style jsx global>{`
        html {
          overflow: ${ready ? "auto" : "hidden"};
        }
      `}</style>

      {/* 2) Loader is ALWAYS rendered; just fades out */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
          ready ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <SplashLoader />
      </div>

      {/* Render 3D only on desktop */}
      {!isMobile && (
        <HeroScene
          pinRef={pinRef}
          onReady={() => {
            setReady(true);
            window.dispatchEvent(new Event("hero-ready"));
          }}
        />
      )}

      {/* ---- Content ---- */}
      <div id="hero-pin" ref={pinRef} className="relative z-10">
        <div className="px-6" style={{ paddingTop: "var(--nav-safe)" }}>
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="min-h-[calc(100svh-var(--nav-safe))] grid place-items-center">
              <div className="w-full flex flex-col items-center md:items-start">
                <h1 className="text-center md:text-left tracking-[-0.01em] text-white relative z-30 leading-[1.08]">
                  <span className="block text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold">
                    Crafting Innovative Frontend
                  </span>
                  <span
                    className="
                      block text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold
                      bg-clip-text text-transparent
                      bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-200
                      pb-[0.15em] leading-[1.1]
                    "
                  >
                    Solutions with Precision &amp; Style
                  </span>
                </h1>

                <p className="mt-3 md:mt-4 text-center md:text-left text-white/75 text-[clamp(0.95rem,1.4vw,1.2rem)] max-w-[52ch]">
                  I’m Tanveer — React/Next developer in London, building
                  premium, performant interfaces with tasteful motion.
                </p>

                <div className="mt-7 md:mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3.5 sm:gap-4">
                  <a href="#projects" className="w-full sm:w-auto">
                    <MagicButton
                      title="View My Work"
                      icon={<FaLocationArrow />}
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    />
                  </a>

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

                  <a
                    href="#about"
                    className="text-white/65 hover:text-white/95 text-sm underline underline-offset-4"
                  >
                    Learn about my approach
                  </a>
                </div>

                <div className="mt-6 md:mt-7 flex items-center gap-3 text-white/70">
                  <span className="text-sm md:text-[0.95rem]">
                    Trusted by{" "}
                    <span className="text-white/90 font-medium">
                      30+ clients
                    </span>{" "}
                    — 5★ average
                  </span>
                </div>
              </div>
            </div>
            <div className="pb-4 md:pb-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

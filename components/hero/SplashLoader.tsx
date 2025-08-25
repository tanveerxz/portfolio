"use client";
import React, { useState, useEffect } from "react";

export default function SplashLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  useEffect(() => {
    const texts = [
      "Initializing",
      "Loading Assets",
      "Crafting Experience",
      "Almost Ready",
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (
          newProgress >= 25 * (currentIndex + 1) &&
          currentIndex < texts.length - 1
        ) {
          currentIndex++;
          setLoadingText(texts[currentIndex]);
        }
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/3 rounded-full blur-xl animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Main Logo/Brand */}
        <div className="mb-16">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Tanveer
              </span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-60 animate-pulse"></div>
          </div>
          <p className="text-white/60 text-xl text-center mt-4 font-light">
            ReactJS Developer
          </p>
        </div>

        {/* Modern Loader */}
        <div className="relative w-80 mb-12">
          {/* Progress bar background */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            {/* Animated progress */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-sm opacity-60"></div>
              {/* Moving shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer"></div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-white/70 text-sm font-medium">
              {loadingText}...
            </span>
            <span className="text-white/70 text-sm font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Minimal dots indicator */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

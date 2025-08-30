"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/data";
import dynamic from "next/dynamic";

import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

// // dynamic imports
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Grid = dynamic(() => import("@/components/Grid"), { ssr: false });
// import Hero from "@/components/Hero";
// import Grid from "@/components/Grid";

// ✅ import the loader component from your file
import SplashLoader from "@/components/hero/SplashLoader";

export default function Home() {
  const [loaderVisible, setLoaderVisible] = useState(true);

  // Listen for Hero's ready event
  useEffect(() => {
    const onReady = () => setLoaderVisible(false);
    window.addEventListener("hero-ready", onReady, { once: true });

    // safety: hide after 6s max
    const t = setTimeout(onReady, 6000);

    return () => {
      window.removeEventListener("hero-ready", onReady);
      clearTimeout(t);
    };
  }, []);

  // Lock/unlock scroll while loader is visible
  useEffect(() => {
    const html = document.documentElement;
    if (loaderVisible) {
      html.style.overflow = "hidden";
      window.scrollTo({ top: 0 });
    } else {
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
    };
  }, [loaderVisible]);

  return (
    <>
      {/* Loader overlay */}
      {/* Loader overlay — always mounted, just fades out */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
          loaderVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <SplashLoader />
      </div>
      <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-x-hidden overflow-y-visible mx-auto sm:px-10 px-5 select-none">
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={navItems} />
          <Hero />
          <Grid />
          <RecentProjects />
          <Approach />
          <Experience />
          <Clients />
          <Footer />
        </div>
      </main>
    </>
  );
}

import { NarrativeController } from "@/components/narrative/NarrativeController";
import { NarrativeRail } from "@/components/narrative/NarrativeRail";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";
import { Flagship } from "@/components/sections/Flagship";
import { Hero } from "@/components/sections/hero/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";

export default function Home() {
  return (
    <>
      <NarrativeController />
      <NarrativeRail />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Flagship />
        <WhatIBuild />
        <Community />
        <Contact />
      </main>
    </>
  );
}

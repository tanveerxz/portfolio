import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { OrbPoster } from "@/components/narrative/OrbPoster";
import styles from "./case-study.module.css";

const description = "LegacyLift migrates enterprise legacy codebases to modern languages. Fidelity Replay verifies behavioural equivalence before migrated code ships.";

export const metadata: Metadata = {
  title: "LegacyLift | Migration needs proof",
  description,
  alternates: { canonical: "/legacylift" },
  openGraph: { title: "LegacyLift | Migration needs proof", description, url: "/legacylift" },
};

export default function LegacyLiftPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <div className="container">
        <Button href="/#flagship" variant="ghost" className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to the story
        </Button>
        <header className={styles.intro}>
          <div>
            <h1>LegacyLift.<br /><span>Migration needs proof.</span></h1>
            <p className={styles.lead}>An AI platform migrating enterprise legacy codebases, primarily COBOL, to modern languages.</p>
            <p>I’m building LegacyLift full-time during my gap year.</p>
          </div>
          <div className={styles.art} aria-hidden="true"><OrbPoster state="active-thinking" /></div>
        </header>

        <section aria-labelledby="replay-heading" className={styles.engine}>
          <h2 id="replay-heading">Fidelity Replay.</h2>
          <p className={styles.lead}>The differential verification engine proving behavioural equivalence before migrated code ships.</p>
          <ol className={styles.sequence} aria-label="Verification sequence">
            <li><span className={styles.sequenceWord}>Run both</span><p>The legacy code and its migrated counterpart.</p></li>
            <li><span className={styles.sequenceWord}>Compare behaviour</span><p>Differential verification checks behavioural equivalence.</p></li>
            <li><span className={styles.sequenceWord}>Verify before shipping</span><p>Establish equivalence before the migrated code ships.</p></li>
          </ol>
          <p className={styles.note}>Illustrative explanation of the verification process.</p>
        </section>

        <section aria-labelledby="proof-heading" className={styles.proof}>
          <h2 id="proof-heading">A real program.<br />A real catch.</h2>
          <div><p className={styles.lead}>Fidelity Replay caught a genuine overflow truncation bug on an actual COBOL program during migration.</p><p>That is the reason verification sits at the centre of LegacyLift.</p></div>
        </section>

        <section aria-labelledby="architecture-heading" className={styles.details}>
          <div><h2 id="architecture-heading">Your source stays yours.</h2><p>Bring-your-own-key architecture. Client source never touches LegacyLift’s infrastructure.</p></div>
          <div><h2>Building in deeptech.</h2><p>Accepted into the 1Foundry accelerator, Theme 1, deeptech.</p><p>The public launch included a cinematic film of roughly 50 seconds on LinkedIn.</p></div>
        </section>
        <div className={styles.close}>
          <Button href="/#contact" variant="primary">Contact <ArrowUpRight size={18} aria-hidden="true" /></Button>
          <Button href="/#work" variant="ghost">Explore the other work</Button>
        </div>
      </div>
    </main>
  );
}

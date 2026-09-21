import { OrbPoster } from "@/components/narrative/OrbPoster";
import { Button } from "@/components/primitives/Button";

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section
      id="top"
      data-act="dormant"
      aria-labelledby="hero-heading"
      className={styles.hero}
    >
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1 id="hero-heading" className={styles.heading}>
            <span className={styles.name}>Tanveer.</span>
            <span className={styles.mission}>Building LegacyLift.</span>
          </h1>
          <div className={styles.intro}>
            <p className={styles.bio}>
              An 18-year-old self-taught full-stack developer building LegacyLift
              full-time during a gap year.
            </p>
            <div className={styles.actions}>
              <Button href="#flagship" size="lg" className={styles.cta}>
                Enter the proof
              </Button>
            </div>
          </div>
        </div>

        <div
          className={styles.orbSlot}
          data-orb-anchor="dormant"
          aria-hidden="true"
        >
          <OrbPoster state="dormant" className={styles.poster} />
        </div>

        <div className={styles.frameNote} aria-hidden="true">
          <span>Reasoning before commitment.</span>
          <span>Scroll to begin</span>
        </div>
      </div>
    </section>
  );
}

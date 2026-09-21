import { OrbPoster } from "@/components/narrative/OrbPoster";
import styles from "./Community.module.css";

export function Community() {
  return (
    <section id="community" data-act="warm" aria-labelledby="community-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="community-heading" className={styles.heading}>Bringing people together.</h2>
        <div className={styles.leadership}>
          <article aria-labelledby="sikhs-heading">
            <h3 id="sikhs-heading" className={styles.organisation}>Sikhs in Tech</h3>
            <p className={styles.role}>Director of Hackathons · London</p>
            <p className={styles.statement}>
              I’m organising the first Sikhs in Tech London hackathon.
            </p>
            <dl className={styles.event} aria-label="First Sikhs in Tech London hackathon details">
              <div><dt>Scale</dt><dd>100 developers</dd></div>
              <div><dt>Format</dt><dd>One day</dd></div>
              <div><dt>When</dt><dd>Early November 2026</dd></div>
            </dl>
          </article>
          <div className={styles.support}>
            <div className={styles.orbSlot} data-orb-anchor aria-hidden="true">
              <OrbPoster state="warm" />
            </div>
            <article className={styles.story} aria-labelledby="starthack-heading">
              <h3 id="starthack-heading" className={styles.storyHeading}>StartHack 2026</h3>
              <p className={styles.storyText}>
                My first solo trip took me to Switzerland for StartHack. I was
                the only high school student among 500+ participants.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

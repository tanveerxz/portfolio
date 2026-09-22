import { OrbPoster } from "@/components/narrative/OrbPoster";
import { ThinkingDot } from "@/components/effects/ThinkingDot";
import { MetalWord } from "@/components/effects/metal/MetalWord";
import { Button } from "@/components/primitives/Button";
import { FLAGSHIP } from "@/config/flagship";

import { HeroLight } from "./HeroLight";
import styles from "./Hero.module.css";

/**
 * Act I — dormant. Server component.
 *
 * Only the owner's words and facts: a two-fact ledger, the identity headline,
 * the one-line bio and the LegacyLift action. Space is filled with craft, not
 * copy — headline scale, the orb, grid lines, pointer light, grain, a beam.
 *
 * LCP contract: the <h1> is plain server HTML, fully visible on the first
 * frame (no entrance transform/opacity on it). Everything else choreographs
 * in with pure CSS keyframes that end visible — they also run without JS and
 * collapse to their end state under reduced motion. Effects upgrade after
 * idle: metal inside one word, a border-beam on the one primary action, a
 * 20px thinking-orb status glyph, the pointer light.
 */
export function Hero() {
  return (
    <section id="top" data-act="dormant" aria-labelledby="hero-heading" className={styles.hero}>
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <HeroLight />

      <div className={styles.inner}>
        <ul className={styles.ledger} aria-label="At a glance">
          <li className={styles.fact} style={{ "--d": 0 } as React.CSSProperties}>
            <span className="t-label">Founder</span>
            <span className={styles.factValue}>{FLAGSHIP.name}</span>
          </li>
          <li className={styles.fact} style={{ "--d": 1 } as React.CSSProperties}>
            <span className="t-label">Status</span>
            <span className={styles.factValue}>
              <ThinkingDot state="working" />
              Building full-time
            </span>
          </li>
        </ul>

        <div className={styles.orbSlot} data-orb-anchor="dormant" aria-hidden="true">
          <OrbPoster state="dormant" className={styles.poster} />
        </div>

        {/* Lines are inline spans + <br>: no child creates a paint layer, so the
            whole <h1> is a single LCP text candidate (the largest on the page). */}
        <h1 id="hero-heading" className={styles.heading}>
          <span className={styles.lineName}>Tanveer.</span>
          <br />
          <span className={styles.lineMission}>
            <span className={`${styles.serif} t-serif`}>Building</span>{" "}
            <MetalWord className={styles.metal}>{`${FLAGSHIP.name}.`}</MetalWord>
          </span>
        </h1>

        <div className={styles.rule} aria-hidden="true" />

        <div className={styles.base}>
          <p className={styles.bio}>
            An 18-year-old self-taught full-stack developer building {FLAGSHIP.name} full-time
            during a gap year.
          </p>
          <div className={styles.actions}>
            <Button href="#flagship" variant="silver" size="lg" effect="beam" magnetic arrow>
              Explore {FLAGSHIP.name}
            </Button>
          </div>
          <span className={styles.scrollTrack} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

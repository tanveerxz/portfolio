import { AmbientOrb } from "@/components/narrative/AmbientOrb";
import { HubMorph } from "./community/HubMorph";
import { Beam } from "@/components/effects/beam/Beam";
import styles from "./Community.module.css";

// Dotted person glyph (100×100 viewBox) the hub orb morphs into: a head
// disc and a shoulder dome sampled on the same dot rhythm as the orb.
const PERSON_DOTS: Array<[number, number]> = (() => {
  const dots: Array<[number, number]> = [];
  for (let y = 12; y <= 96; y += 5.2) {
    for (let x = 14; x <= 86; x += 5.2) {
      const head = (x - 50) ** 2 + (y - 32) ** 2 <= 15.5 ** 2;
      const body = y >= 58 && ((x - 50) / 32) ** 2 + ((y - 94) / 34) ** 2 <= 1;
      if (head || body) dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
  }
  return dots;
})();

const SEATS = 100;
const GRID = 10;
// The centre 4x4 block is left empty in the dot field so the shared
// reasoning object can sit there as the hub the seats gather around.
const isHub = (index: number) => {
  const row = Math.floor(index / GRID);
  const col = index % GRID;
  return row >= 3 && row <= 6 && col >= 3 && col <= 6;
};

/**
 * Act IV — warm. Server component.
 *
 * Every string here traces to build/content-source.md; nothing new is
 * written. The section earns its interest from three visuals instead:
 *   - a 100-dot field (one per developer) that lights up progressively on
 *     scroll, arranged as a ring around an empty hub,
 *   - the shared reasoning object anchored at that hub — the thing the
 *     seats are connecting around. It renders as the static OrbPoster
 *     (visible with no JS/motion); the live canvas, when present, draws
 *     over the same anchor.
 *   - the event facts wrapped in a slow travelling border-beam, styled as
 *     a pass.
 * All three are server-rendered plus the existing Beam primitive — no new
 * client runtime, gated by the same reveal/motion system as the rest of
 * the site.
 */
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
            <Beam kind="compact" tone="mono" strength={1} duration={8} radius={24} className={styles.pass}>
              <dl className={styles.event} aria-label="First Sikhs in Tech London hackathon details">
                <div><dt>Scale</dt><dd>100 developers</dd></div>
                <div><dt>Format</dt><dd>One day</dd></div>
                <div><dt>When</dt><dd>Early November 2026</dd></div>
              </dl>
            </Beam>
          </article>

          <div className={styles.visual}>
            <div className={styles.stage}>
              <div className={styles.seats} data-reveal="fade" role="presentation" aria-hidden="true">
                {Array.from({ length: SEATS }, (_, index) =>
                  isHub(index) ? (
                    <span key={index} className={styles.seatGap} />
                  ) : (
                    <span key={index} className={styles.seat} style={{ "--i": index } as React.CSSProperties} />
                  ),
                )}
              </div>
              <div className={styles.hub} aria-hidden="true">
                <span className={styles.link} style={{ "--rot": "-24deg", "--len": "62%", "--d": "0.2s" } as React.CSSProperties} />
                <span className={styles.link} style={{ "--rot": "31deg", "--len": "54%", "--d": "0.9s" } as React.CSSProperties} />
                <span className={styles.link} style={{ "--rot": "162deg", "--len": "58%", "--d": "1.6s" } as React.CSSProperties} />
                {/* The section's opaque warm field hides the fixed narrative
                    canvas, so the hub renders its own orb and hands the
                    shared one off (opacity 0) to avoid a double. */}
                <div className={styles.orbSlot} data-orb-anchor data-orb-opacity="0">
                  <HubMorph className={styles.morph}>
                    <AmbientOrb state="connecting" size={220} className={styles.morphOrb} />
                    <svg
                      className={styles.person}
                      viewBox="0 0 100 100"
                      style={{ "--n": PERSON_DOTS.length } as React.CSSProperties}
                    >
                      {PERSON_DOTS.map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r={1.7} style={{ "--i": i } as React.CSSProperties} />
                      ))}
                    </svg>
                  </HubMorph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

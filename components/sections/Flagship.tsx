import { OrbPoster } from "@/components/narrative/OrbPoster";
import { Button } from "@/components/primitives/Button";
import {
  FLAGSHIP,
  FLAGSHIP_CHAPTERS,
  FLAGSHIP_HREF,
  FLAGSHIP_STORY,
  INDEPENDENCE_RULE,
} from "@/config/flagship";

import {
  AttestArtifact,
  MapArtifact,
  ReplayArtifact,
  ReviewArtifact,
} from "./flagship/Artifacts";
import styles from "./Flagship.module.css";

const ARTIFACTS = [MapArtifact, ReviewArtifact, ReplayArtifact, AttestArtifact];

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * Act II — active thinking. How LegacyLift works, told by the orbs.
 *
 * A sticky stage (`.verification-stage`) holds one frame. The shared
 * narrative orb flies into the frame's orb cell and becomes the program being
 * migrated; four chapters play over it as the runway scrolls:
 *
 *   01 understand  codebase map around the orb (ACCTINT → INTCALC …)
 *   02 rewrite     COBOL beside Python, a person approves
 *   03 replay      legacy orb + candidate orb, rows agree field by field
 *   04 attest      100.0% ✓ · signed ed25519, the section's one border-beam
 *
 * The NarrativeController splits the runway evenly across the four
 * `data-verification-step`s and writes `data-verification-phase` on the
 * stage; the orb engine follows `data-orb-states` on the same split. Without JS or with reduced motion
 * the same chapters render as an ordinary reading sequence, every artifact in
 * its final state.
 */
export function Flagship() {
  const breaks = [0, ...FLAGSHIP_CHAPTERS.map((chapter) => chapter.until)];
  return (
    <section
      id="flagship"
      data-act="active-thinking"
      aria-labelledby="flagship-heading"
      className={styles.flagship}
    >
      <div className={styles.container}>
        <header className={styles.intro}>
          <h2 id="flagship-heading" className={styles.heading}>
            {FLAGSHIP_STORY.headline}{" "}
            <span className={`${styles.turn} t-serif`}>{FLAGSHIP_STORY.headlineTurn}</span>
          </h2>
          <div className={styles.introBody}>
            <p className={styles.lead}>{FLAGSHIP_STORY.lead}</p>
            <p className={styles.audience}>{FLAGSHIP_STORY.audience}</p>
          </div>
        </header>

        <div className={styles.track}>
          <div className={`${styles.stage} verification-stage`} data-verification-phase="0">
            <div className={styles.frame} data-verification-visual="" aria-hidden="true">
              <div
                className={styles.frameOrb}
                data-orb-anchor="active-thinking"
                data-orb-states={FLAGSHIP_CHAPTERS.map((chapter) => chapter.orb).join(",")}
              >
                <OrbPoster state="active-thinking" orbState="searching" />
              </div>
            </div>

            <ol className={styles.chapters}>
              {FLAGSHIP_CHAPTERS.map((chapter, index) => {
                const Artifact = ARTIFACTS[index];
                return (
                  <li
                    key={chapter.id}
                    className={styles.chapter}
                    data-verification-step={index}
                    aria-labelledby={`flagship-chapter-${index}`}
                  >
                    <div className={styles.chapterText}>
                      <h3 id={`flagship-chapter-${index}`} className={styles.chapterTitle}>
                        <span className={styles.chapterNumber} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {chapter.title}
                      </h3>
                      <p className={styles.chapterBody}>{chapter.body}</p>
                    </div>
                    <div className={styles.chapterArtifact}>
                      <Artifact />
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className={styles.progress} aria-hidden="true" data-verification-progress="">
              {FLAGSHIP_CHAPTERS.map((chapter, index) => (
                <span
                  key={chapter.id}
                  style={{ "--from": breaks[index], "--to": breaks[index + 1] } as Style}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.coda}>
        <div className={styles.rule}>
          <p className={styles.ruleStatement}>
            {INDEPENDENCE_RULE.statement.map((part, index) =>
              index % 2 === 1 ? (
                <em key={index} className="t-serif">
                  {part}
                </em>
              ) : (
                <span key={index}>{part}</span>
              ),
            )}{" "}
            <span className={styles.ruleTurn}>{INDEPENDENCE_RULE.turn}</span>
          </p>
          <p className={styles.ruleBody}>
            <strong>The Independence Rule.</strong> {INDEPENDENCE_RULE.body}
          </p>
        </div>

        <div className={styles.proof}>
          <div className={styles.proofLead}>
            <h3 className={styles.proofMain}>It found the bug nobody would notice.</h3>
            <p className={styles.proofBody}>
              COBOL silently cuts off numbers that overflow their field. A modern
              rewrite doesn&rsquo;t, so the new system quietly returns different
              numbers. On a real COBOL program, {FLAGSHIP.name} caught exactly
              that, before it shipped.
            </p>
          </div>
          <div className={styles.proofSide}>
            <p>
              Bring your own key. Client source never touches {FLAGSHIP.name}{" "}
              infrastructure.
            </p>
            <Button href={FLAGSHIP_HREF} variant="secondary" size="md" arrow>
              Read the case study
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

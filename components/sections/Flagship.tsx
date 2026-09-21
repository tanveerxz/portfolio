import { OrbPoster } from "@/components/narrative/OrbPoster";
import { ProofBeam } from "@/components/effects/ProofBeam";
import { Button } from "@/components/primitives/Button";
import { FLAGSHIP, FLAGSHIP_HREF } from "@/config/flagship";

import styles from "./Flagship.module.css";

const stages = [
  {
    title: "Run both",
    body: "The COBOL system and migrated candidate run against the same replayed behaviour.",
  },
  {
    title: "Compare behaviour",
    body: "Fidelity Replay checks the outputs and state transitions for meaningful differences.",
  },
  {
    title: "Verify before shipping",
    body: "Migration only moves forward when the new system proves behavioural equivalence.",
  },
] as const;

export function Flagship() {
  return (
    <section
      id="flagship"
      data-act="active-thinking"
      aria-labelledby="flagship-heading"
      className={styles.flagship}
    >
      <div className={styles.container}>
        <div className={`${styles.stage} verification-stage`}>
          <div className={styles.copy}>
            <h2 id="flagship-heading" className={styles.heading}>
              Migration needs proof.
            </h2>
            <p className={styles.lead}>
              {FLAGSHIP.name} migrates enterprise legacy codebases, primarily
              COBOL, to modern languages. Its differentiator is{" "}
              {FLAGSHIP.engine}: a differential verification engine that proves
              behavioural equivalence before migrated code ships.
            </p>
            <Button
              href={FLAGSHIP_HREF}
              variant="secondary"
              size="md"
              className={styles.caseLink}
            >
              Read the case study
            </Button>
          </div>

          <div className={styles.explainer}>
            <ProofBeam className={styles.visualBeam}>
              <figure
                className={styles.visual}
                data-orb-anchor="active-thinking"
                data-verification-visual=""
                aria-labelledby="flagship-visual-caption"
              >
                <div className={styles.visualChrome} aria-hidden="true">
                  <span>Legacy</span>
                  <span>Candidate</span>
                </div>
                <OrbPoster state="active-thinking" className={styles.poster} />
                <figcaption
                  id="flagship-visual-caption"
                  className={styles.caption}
                >
                  Illustrative verification scene, not a live replay or product
                  screenshot.
                </figcaption>
              </figure>
            </ProofBeam>

            <div className={styles.steps}>
              {stages.map((stage, index) => (
                <article
                  key={stage.title}
                  className={styles.step}
                  data-verification-step={index}
                  aria-labelledby={`verification-step-${index}`}
                >
                  <h3 id={`verification-step-${index}`}>{stage.title}</h3>
                  <p>{stage.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.proofGrid} aria-label="LegacyLift proof points">
            <p>
              Caught a real overflow truncation bug on an actual COBOL program
              during migration.
            </p>
            <p>
              BYOK architecture: client source never touches LegacyLift
              infrastructure.
            </p>
            <p>
              Accepted into the 1Foundry accelerator, Theme 1 for deeptech.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

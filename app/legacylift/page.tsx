import type { Metadata } from "next";

import { Beam } from "@/components/effects/beam/Beam";
import { BeamRule } from "@/components/effects/beam/BeamRule";
import { Reveal, SplitLines } from "@/components/effects/Reveal";
import { OrbPoster } from "@/components/narrative/OrbPoster";
import { Button } from "@/components/primitives/Button";
import { MetaStrip } from "@/components/primitives/Density";
import { MapArtifact, ReplayArtifact, ReviewArtifact, AttestArtifact } from "@/components/sections/flagship/Artifacts";
import {
  CASE_STUDY,
  FLAGSHIP,
  FLAGSHIP_CHAPTERS,
  FLAGSHIP_HREF,
  FLAGSHIP_STORY,
  INDEPENDENCE_RULE,
  REPLAY,
  TRUST,
} from "@/config/flagship";

import { ArtifactStage } from "./ArtifactStage";
import { LiveOrb } from "./LiveOrb";
import styles from "./case-study.module.css";

const title = `${FLAGSHIP.name}: ${FLAGSHIP_STORY.headline} ${FLAGSHIP_STORY.headlineTurn}`;
const description = `${CASE_STUDY.summary} ${FLAGSHIP.engine} proves behavioural equivalence before migrated code ships.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: FLAGSHIP_HREF },
  openGraph: { title, description, url: FLAGSHIP_HREF, type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

/** Alternating parts: odd indices are the one-to-three "thought" words. */
function Voiced({ parts }: { parts: readonly string[] }) {
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="t-serif">
            {part}
          </em>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/** The three steps: the homepage chapters' first three, with their demo screens. */
const STEPS = [
  { chapter: FLAGSHIP_CHAPTERS[0], phase: 0, Artifact: MapArtifact, extra: null },
  { chapter: FLAGSHIP_CHAPTERS[1], phase: 1, Artifact: ReviewArtifact, extra: CASE_STUDY.steps.humanInControl },
  { chapter: FLAGSHIP_CHAPTERS[2], phase: 2, Artifact: ReplayArtifact, extra: null },
];

export default function LegacyLiftPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      {/* ---- Hero ------------------------------------------------------------ */}
      <header className={styles.hero}>
        <div className={styles.columns} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={`container ${styles.heroGrid}`}>
          <nav className={styles.back} aria-label="Breadcrumb">
            <Button href="/" variant="ghost" size="sm">
              <span aria-hidden="true">←</span> Back to the homepage
            </Button>
          </nav>

          <div className={styles.heroText}>
            <h1 className={styles.title}>
              <span className="text-silver">{FLAGSHIP.name}</span>
            </h1>
            <p className={styles.proposition}>
              {FLAGSHIP_STORY.headline} <em className="t-serif">{FLAGSHIP_STORY.headlineTurn}</em>
            </p>
          </div>

          <div className={styles.heroOrbSlot}>
            <span className={styles.ring} aria-hidden="true" />
            <LiveOrb state="breathing" scale={0.84} className={styles.heroOrb}>
              <OrbPoster state="dormant" orbState="breathing" />
            </LiveOrb>
          </div>

          <div className={styles.heroFoot}>
            <p className={styles.lead}>{FLAGSHIP_STORY.lead}</p>
            <div className={styles.heroActions}>
              <Button href={FLAGSHIP_STORY.productUrl} external variant="primary" size="lg" arrow>
                Visit {FLAGSHIP.name}
              </Button>
            </div>
            <MetaStrip items={CASE_STUDY.facts} className={styles.facts} />
          </div>
        </div>
      </header>

      {/* ---- The problem ----------------------------------------------------- */}
      <section className={`container ${styles.problem}`} aria-labelledby="problem-heading">
        <div className={styles.problemText}>
          <p className={styles.origin}>{CASE_STUDY.origin}</p>
          <Reveal as="h2" id="problem-heading" className={styles.statement}>
            <Voiced parts={CASE_STUDY.problem.statement} />{" "}
            <span className={styles.statementTurn}>{CASE_STUDY.problem.turn}</span>
          </Reveal>
          <div className={styles.prose}>
            <Reveal as="p" className={styles.proseLead} delay={80}>
              {CASE_STUDY.problem.body}
            </Reveal>
            <Reveal as="p" delay={140}>
              {CASE_STUDY.problem.translators}
            </Reveal>
          </div>
        </div>

        <div className={styles.problemArt}>
          <div className={styles.problemOrb} aria-hidden="true">
            <OrbPoster state="active-thinking" orbState="searching" />
          </div>
          <Reveal as="figure" className={styles.trace} delay={120}>
            <figcaption className="visually-hidden">A business rule from the product demo, carried across</figcaption>
            <p className={styles.traceRule}>
              <span>{CASE_STUDY.problem.rule.rule}</span>
              <span className={styles.traceOwner}>{CASE_STUDY.problem.rule.owner}</span>
            </p>
            <p className={styles.traceMeta}>{CASE_STUDY.problem.rule.trace}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- How it works ---------------------------------------------------- */}
      <section className={styles.how} aria-labelledby="how-heading">
        <div className="container">
          <header className={styles.howIntro}>
            <SplitLines
              as="h2"
              id="how-heading"
              className={styles.h2}
              lines={[
                <>{CASE_STUDY.steps.heading[0]}</>,
                <>
                  <em className="t-serif">{CASE_STUDY.steps.heading[1]}</em>
                  {CASE_STUDY.steps.heading[2]}
                </>,
              ]}
            />
            <p className={styles.demoNote}>{CASE_STUDY.steps.demoNote}</p>
          </header>

          <ol className={styles.steps}>
            {STEPS.map(({ chapter, phase, Artifact, extra }, index) => (
              <li key={chapter.id} className={styles.step} aria-labelledby={`step-${chapter.id}`}>
                <div className={styles.stepText}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Reveal as="h3" id={`step-${chapter.id}`} className={styles.h3}>
                    {chapter.title}
                  </Reveal>
                  <Reveal as="p" className={styles.stepBody} delay={80}>
                    {chapter.body}
                  </Reveal>
                  {extra ? (
                    <Reveal as="p" className={styles.stepExtra} delay={140}>
                      {extra}
                    </Reveal>
                  ) : null}
                  <Reveal className={styles.specs} delay={180}>
                    {CASE_STUDY.steps.specsLead[index] ? (
                      <p className={styles.specsLead}>{CASE_STUDY.steps.specsLead[index]}</p>
                    ) : null}
                    <ul>
                      {CASE_STUDY.steps.specs[index].map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
                <ArtifactStage phase={phase} className={styles.panel}>
                  <Artifact />
                </ArtifactStage>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Fidelity Replay ------------------------------------------------- */}
      <section className={styles.replay} aria-labelledby="replay-heading">
        <div className={`container ${styles.replayGrid}`}>
          <div className={styles.replayHead}>
            <SplitLines as="h2" id="replay-heading" className={styles.h2} lines={[<>{FLAGSHIP.engine}.</>]} />
            <Reveal as="p" className={styles.replayDefinition} delay={80}>
              {CASE_STUDY.replay.definition}
            </Reveal>
            <Reveal as="p" className={styles.replayBody} delay={140}>
              {CASE_STUDY.replay.body}
            </Reveal>
          </div>

          <div className={styles.pair} aria-hidden="true">
            <div className={styles.pairSide}>
              <LiveOrb state="solving" scale={0.92} className={styles.pairOrb}>
                <OrbPoster state="active-thinking" orbState="solving" />
              </LiveOrb>
              <span className={styles.pairLabel}>Legacy</span>
            </div>
            <span className={styles.pairEquals}>
              <span />
            </span>
            <div className={styles.pairSide}>
              <LiveOrb state="solving" scale={0.92} className={styles.pairOrb}>
                <OrbPoster state="active-thinking" orbState="solving" />
              </LiveOrb>
              <span className={styles.pairLabel}>Migrated</span>
            </div>
          </div>

          <dl className={styles.claims}>
            {CASE_STUDY.replay.claims.map((claim) => (
              <div key={claim.value}>
                <dt>{claim.value}</dt>
                <dd>{claim.label}</dd>
              </div>
            ))}
            <div>
              <dt>{REPLAY.gates.length} gates</dt>
              <dd>{REPLAY.gates.join(" · ")}</dd>
            </div>
          </dl>

          <div className={styles.attest}>
            <Reveal as="h3" className={styles.h3}>
              {FLAGSHIP_CHAPTERS[3].title}
            </Reveal>
            <Reveal as="p" className={styles.stepBody} delay={80}>
              {FLAGSHIP_CHAPTERS[3].body}
            </Reveal>
          </div>
          <ArtifactStage phase={3} className={`${styles.panel} ${styles.attestPanel}`}>
            <AttestArtifact />
          </ArtifactStage>
        </div>
      </section>

      {/* ---- The Independence Rule -------------------------------------------- */}
      <section className={`container ${styles.rule}`} aria-labelledby="rule-heading">
        <div className={styles.ruleOrbs} aria-hidden="true">
          <LiveOrb state="composing" scale={0.9} className={styles.ruleOrb}>
            <OrbPoster state="active-thinking" orbState="composing" />
          </LiveOrb>
          <span className={styles.ruleWall} />
          <LiveOrb state="shaping" scale={0.9} className={styles.ruleOrb}>
            <OrbPoster state="active-thinking" orbState="shaping" />
          </LiveOrb>
        </div>
        <Reveal as="h2" id="rule-heading" className={styles.ruleStatement}>
          <Voiced parts={INDEPENDENCE_RULE.statement} />{" "}
          <span className={styles.ruleTurn}>{INDEPENDENCE_RULE.turn}</span>
        </Reveal>
        <Reveal as="p" className={styles.ruleBody} delay={100}>
          <strong>The Independence Rule.</strong> {INDEPENDENCE_RULE.body}
        </Reveal>
      </section>

      {/* ---- Trust ----------------------------------------------------------- */}
      <section className={`container ${styles.trust}`} aria-labelledby="trust-heading">
        <BeamRule tone="mono" strength={0.7} className={styles.trustRule} />
        <Reveal as="h2" id="trust-heading" className={styles.trustHeading}>
          {FLAGSHIP_STORY.audience}
        </Reveal>
        <ul className={styles.trustList}>
          {TRUST.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 70} className={styles.trustItem}>
              <h3 className={styles.trustTitle}>{item.title}</h3>
              <p className={styles.trustDetail}>{item.detail}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---- Proof point ----------------------------------------------------- */}
      <section className={`container ${styles.proof}`} aria-labelledby="proof-heading">
        <SplitLines
          as="h2"
          id="proof-heading"
          className={styles.h2}
          lines={[...CASE_STUDY.proof.heading]}
        />
        <Reveal className={styles.proofCardWrap}>
          <Beam kind="travel" tone="ocean" strength={0.85} duration={7} radius={28} rest={0} className={styles.proofBeam}>
            <div className={styles.proofCard}>
              <p className={styles.proofBug}>{CASE_STUDY.proof.bug}</p>
            </div>
          </Beam>
        </Reveal>
        <Reveal as="figure" className={styles.mapped}>
          <dl className={styles.mappedFigures}>
            {CASE_STUDY.proof.mapped.map((figure) => (
              <div key={figure.label}>
                <dt className={styles.mappedLabel}>{figure.label}</dt>
                <dd className={`${styles.mappedValue} text-silver`}>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <figcaption className={styles.mappedSource}>{CASE_STUDY.proof.mappedSource}</figcaption>
        </Reveal>
        <div className={styles.byok}>
          <Reveal as="h3" className={styles.h3}>
            {CASE_STUDY.proof.byokHeading}
          </Reveal>
          <Reveal as="p" className={styles.stepBody} delay={80}>
            {CASE_STUDY.proof.byok}
          </Reveal>
        </div>
      </section>

      {/* ---- Close ----------------------------------------------------------- */}
      <section className={styles.close} aria-labelledby="close-heading">
        <div className={`container ${styles.closeGrid}`}>
          <LiveOrb state="breathing" scale={0.9} speed={0.8} className={styles.closeOrb}>
            <OrbPoster state="settled" orbState="breathing" />
          </LiveOrb>
          <h2 id="close-heading" className={styles.closeHeading}>
            <Voiced parts={CASE_STUDY.closing} />
          </h2>
          <div className={styles.closeActions}>
            <Button href={FLAGSHIP_STORY.productUrl} external variant="primary" size="lg" effect="beam" arrow>
              Visit {FLAGSHIP.name}
            </Button>
            <Button href="/" variant="ghost" size="lg">
              Back to the homepage
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Beam } from "@/components/effects/beam/Beam";
import { OrbPoster } from "@/components/narrative/OrbPoster";
import { CODEBASE_MAP, REPLAY, REVIEW } from "@/config/flagship";

import { CandidateOrb } from "./CandidateOrb";
import styles from "./Artifacts.module.css";

/**
 * The product's own demo surfaces, redrawn in the site's silver language.
 * Each artifact shares the stage frame's geometry: an orb row (the left cell
 * is where the narrative orb sits) and a detail row. Server components; all
 * text is real product content and is readable without JS.
 */

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

const Check = () => (
  <svg className={styles.check} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M2.2 6.4 4.8 9 9.8 3.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function MapArtifact() {
  return (
    <div className={styles.artifact} data-artifact="map">
      <div className={styles.orbCell}>
        <div className={styles.staticOrb} aria-hidden="true">
          <OrbPoster state="active-thinking" orbState="connecting" />
        </div>
        <p className={styles.orbLabel}>
          <span className="visually-hidden">Codebase map: </span>
          {CODEBASE_MAP.program}
        </p>
      </div>
      <ul className={styles.links} aria-label={`Programs ${CODEBASE_MAP.program} depends on`}>
        {CODEBASE_MAP.links.map((link, index) => (
          <li key={link.name} style={{ "--i": index } as Style}>
            <span className={styles.relation}>{link.relation}</span>
            <span className={styles.node}>{link.name}</span>
          </li>
        ))}
      </ul>
      <div className={styles.detail}>
        <h4 className={styles.detailHeading}>Business rules found</h4>
        <ul className={styles.rules}>
          {CODEBASE_MAP.rules.map((item, index) => (
            <li key={item.rule} style={{ "--i": index } as Style}>
              <span>{item.rule}</span>
              <span className={styles.owner}>{item.owner}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ReviewArtifact() {
  return (
    <div className={styles.artifact} data-artifact="review">
      <div className={styles.orbCell}>
        <div className={styles.staticOrb} aria-hidden="true">
          <OrbPoster state="active-thinking" orbState="working" />
        </div>
      </div>
      <div className={styles.decision}>
        <p className={styles.decisionFile}>
          <span className="visually-hidden">Review: </span>
          {REVIEW.file}
        </p>
        <p className="visually-hidden">A person approves, edits or rejects every change.</p>
        <div className={styles.choices} aria-hidden="true">
          <span data-choice="approve">Approve</span>
          <span>Edit</span>
          <span>Reject</span>
        </div>
        <p className={styles.decisionNote}>every change · no exceptions</p>
      </div>
      <div className={`${styles.detail} ${styles.code}`}>
        <figure className={styles.codePane}>
          <figcaption>Legacy · COBOL</figcaption>
          <pre>
            {REVIEW.legacy.map((line, index) => (
              <code key={index} style={{ "--i": index } as Style}>
                {line}
              </code>
            ))}
          </pre>
        </figure>
        <figure className={`${styles.codePane} ${styles.migrated}`}>
          <figcaption>Migrated · Python</figcaption>
          <pre>
            {REVIEW.migrated.map((line, index) => (
              <code key={index} style={{ "--i": index } as Style}>
                {line}
              </code>
            ))}
          </pre>
        </figure>
      </div>
    </div>
  );
}

export function ReplayArtifact() {
  return (
    <div className={styles.artifact} data-artifact="replay">
      <div className={styles.orbCell}>
        <div className={styles.staticOrb} aria-hidden="true">
          <OrbPoster state="active-thinking" orbState="solving" />
        </div>
        <p className={styles.orbLabel}>Legacy</p>
      </div>
      <div className={styles.orbCell} data-cell="candidate">
        <CandidateOrb className={styles.candidate} />
        <div className={styles.candidatePoster} aria-hidden="true">
          <OrbPoster state="active-thinking" orbState="solving" />
        </div>
        <p className={styles.orbLabel}>Migrated</p>
      </div>
      <div className={styles.detail}>
        <table className={styles.replay}>
          <caption className="visually-hidden">
            Fidelity Replay: {REPLAY.prompt}. Every vector matches, a difference of 0.00.
          </caption>
          <thead>
            <tr>
              <th scope="col">Vector</th>
              <th scope="col" className={styles.kindCol}>
                <span className="visually-hidden">Account type</span>
              </th>
              <th scope="col" className={styles.num}>Legacy = Migrated</th>
              <th scope="col" className={styles.num}>
                <abbr title="Difference">Δ</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {REPLAY.rows.map((row, index) => (
              <tr key={row.vector} style={{ "--i": index } as Style}>
                <th scope="row">{row.vector}</th>
                <td className={styles.kindCol}>{row.kind}</td>
                <td className={styles.num}>{row.value}</td>
                <td className={`${styles.num} ${styles.delta}`}>
                  <span className={styles.scan} aria-hidden="true" />
                  <span className={styles.agree}>
                    0.00 <Check />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AttestArtifact() {
  return (
    <div className={styles.artifact} data-artifact="attest">
      <div className={styles.orbCell}>
        <div className={styles.staticOrb} aria-hidden="true">
          <OrbPoster state="settled" orbState="breathing" />
        </div>
      </div>
      <div className={styles.sealCell}>
        <Beam kind="travel" tone="ocean" strength={0.9} duration={6} radius={20} className={styles.sealBeam}>
          <div className={styles.seal}>
            <p className={styles.score}>
              {REPLAY.score}
              <Check />
            </p>
            <p className={styles.scoreLabel}>behavioural equivalence</p>
            <p className={styles.signed}>
              <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="none" stroke="currentColor" />
                <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" />
              </svg>
              signed ed25519
            </p>
          </div>
        </Beam>
      </div>
      <div className={styles.detail}>
        <ul className={styles.gates} aria-label={`${REPLAY.gates.length} of ${REPLAY.gates.length} gates passed`}>
          {REPLAY.gates.map((gate, index) => (
            <li key={gate} style={{ "--i": index } as Style}>
              <Check />
              {gate}
            </li>
          ))}
        </ul>
        <p className={styles.ready}>Independent, reproducible, and signed. Ready for risk and audit.</p>
      </div>
    </div>
  );
}

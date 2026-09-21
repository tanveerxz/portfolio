import { OrbPoster } from "@/components/narrative/OrbPoster";
import styles from "./Work.module.css";

/** Project geometry is rendered by the shared narrative scene, never here. */
export function WhatIBuild() {
  return (
    <section
      id="work"
      data-act="fragmented"
      aria-labelledby="work-heading"
      className={styles.work}
    >
      <div className="container">
        <header className={styles.header}>
          <h2 id="work-heading" className={styles.heading}>
            What I build.
          </h2>
        </header>

        <article className={styles.feature} aria-labelledby="pollen-heading">
          <div className={styles.featureCopy}>
            <h3 id="pollen-heading" className={styles.featureTitle}>
              Pollen Mesh
            </h3>
            <p className={styles.featureLead}>
              Shared threat intelligence.
              <br />
              Without sharing raw data.
            </p>
            <p className={styles.description}>
              A privacy-preserving, federated threat-intelligence system.
              Organisations detect coordinated attacks across company boundaries
              by sharing only matched, hashed attack signatures, gated behind two
              rounds of human approval.
            </p>
            <p className={styles.description}>
              Built in a single day at Cambridge’s Collaborative Agent Hackathon,
              hosted by Flower Labs.
            </p>
            <p className={styles.credit}>
              Built with{" "}
              <a href="https://www.linkedin.com/in/rxshri99">
                Shritesh Jamulkar
              </a>
              , Software Engineer at Booking.com.
            </p>
          </div>
          <div
            className={`${styles.art} ${styles.featureArt}`}
            data-orb-anchor="fragmented"
            data-orb-project="0"
            aria-hidden="true"
          >
            <OrbPoster state="fragmented" orbState="connecting" className={styles.poster} />
          </div>
          <div className={styles.recognition}>
            <p className={styles.recognitionTitle}>Honourable Mention</p>
            <p>
              Later featured by name in Flower Labs’ official Flower Monthly
              announcement.
            </p>
          </div>
        </article>

        <div className={styles.projectPair}>
          <article className={styles.hukam} aria-labelledby="hukam-heading">
            <div className={styles.projectCopy}>
              <h3 id="hukam-heading" className={styles.projectTitle}>
                HukamConnect
              </h3>
              <p className={styles.description}>
                A multi-tenant platform for Gurdwaras.
              </p>
              <p className={styles.usage}>
                <span>300+ active users</span>
                <span>2,000+ monthly visits</span>
              </p>
            </div>
            <div
              className={`${styles.art} ${styles.hukamArt}`}
              data-orb-anchor="fragmented"
              data-orb-project="1"
              aria-hidden="true"
            >
              <OrbPoster state="fragmented" orbState="weaving" className={styles.poster} />
            </div>
          </article>

          <article className={styles.argus} aria-labelledby="argus-heading">
            <div className={styles.projectCopy}>
              <h3 id="argus-heading" className={styles.projectTitle}>
                ArgusAI
              </h3>
              <p className={styles.description}>
                A voice-driven warehouse goods-receipt agent. Matches spoken
                delivery descriptions to purchase orders and escalates only
                exceptions.
              </p>
              <p className={styles.context}>
                Built at the {"{Tech: Europe}"} Agentic AI Hack, hosted by Conduct
                and Google DeepMind.
              </p>
            </div>
            <div
              className={`${styles.art} ${styles.argusArt}`}
              data-orb-anchor="fragmented"
              data-orb-project="2"
              aria-hidden="true"
            >
              <OrbPoster state="fragmented" orbState="listening" className={styles.poster} />
            </div>
          </article>
        </div>

        <article className={styles.scoofy} aria-labelledby="scoofy-heading">
          <h3 id="scoofy-heading" className={styles.projectTitle}>
            Scoofy
          </h3>
          <div className={styles.scoofyCopy}>
            <p className={styles.description}>An AI e-commerce platform.</p>
            <p className={styles.context}>
              Led frontend development for eight months.
            </p>
          </div>
          <div
            className={`${styles.art} ${styles.scoofyArt}`}
            data-orb-anchor="fragmented"
            data-orb-project="3"
            aria-hidden="true"
          >
            <OrbPoster state="fragmented" orbState="composing" className={styles.poster} />
          </div>
        </article>
      </div>
    </section>
  );
}

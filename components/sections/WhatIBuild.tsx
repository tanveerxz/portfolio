import { Beam } from "@/components/effects/beam/Beam";
import { Reveal } from "@/components/effects/Reveal";
import {
  ArgusVisual,
  HukamConnectVisual,
  PollenMeshVisual,
  ScoofyVisual,
} from "@/components/sections/work/WorkVisuals";
import styles from "./Work.module.css";

/**
 * A project's live link, made "alive" without any extra JS or a second
 * focusable target: this anchor's `::after` is stretched (via CSS) to cover
 * its whole ancestor card, so the entire card is clickable, but there is
 * still exactly one link per project. Any other real link inside the same
 * card (e.g. Pollen Mesh's collaborator credit) is lifted above the stretch
 * layer with its own `z-index` in Work.module.css, so it keeps working.
 * ArgusAI and Scoofy have no supplied link — they render no `<VisitLink>`
 * and no disabled/placeholder link UI at all.
 */
function VisitLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={styles.visit}>
      {label}
      <span className={styles.visitArrow} aria-hidden="true">
        →
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * Act III — fragmented. Server component.
 *
 * Pollen Mesh leads as the featured build, then the remaining projects in
 * the order fixed by build/content-source.md. Each project used to share the
 * engine's generic dotted orb (`data-orb-project="0..3"`); none of the four
 * anchors are used any more, so the fragmented act shows no orbs at all
 * (the engine copes with no anchor: those orbs stay idle, opacity 0). Instead
 * every project gets a bespoke, static visual (`components/sections/work/
 * WorkVisuals.tsx`), built the way the LegacyLift chapters are (real labels
 * and data, not an abstract node graph):
 *   Pollen Mesh    — two organisation panels, raw lines tagged "stays", a
 *                    hashed signature crossing the boundary, "2 of 2
 *                    approved".
 *   HukamConnect   — a tap resolving into one real content item (the daily
 *                    Hukamnama) landing live across named tenant rows.
 *   ArgusAI        — the spoken delivery as real text, matched against PO
 *                    lines with quantities, one flagged and escalated.
 *   Scoofy         — interface blocks assembling into their final layout.
 * This also drops four always-present orb canvases from the page, which was
 * the section the owner found laggy on a real phone. Every real figure
 * traces to build/content-source.md; IPs, hashes, tenant names, PO lines and
 * the spoken quote are illustrative sample data in the product's own style,
 * same as LegacyLift's demo account numbers, never a specific real result.
 */
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
          <Reveal as="h2" id="work-heading" className={styles.heading}>
            What I build.
          </Reveal>
        </header>

        <Beam
          kind="travel"
          tone="ocean"
          strength={0.85}
          radius={28}
          className={styles.featureBeam}
        >
          <Reveal as="article" className={styles.feature} aria-labelledby="pollen-heading">
            <div className={`${styles.art} ${styles.featureArt}`} aria-hidden="true">
              <PollenMeshVisual />
            </div>
            <div className={styles.featureCopy}>
              <h3 id="pollen-heading" className={styles.featureTitle}>
                Pollen Mesh
              </h3>
              <p className={styles.featureLead}>
                Shared threat intelligence, without sharing raw data.
              </p>
              <p className={styles.description}>
                A privacy-preserving, federated threat-intelligence system.
                Organisations detect coordinated attacks across company
                boundaries by sharing only matched, hashed attack signatures,
                gated behind two rounds of human approval. Built in a single
                day at Cambridge&rsquo;s Collaborative Agent Hackathon, hosted
                by Flower Labs.
              </p>
              <p className={styles.credit}>
                Built with{" "}
                <a href="https://www.linkedin.com/in/rxshri99">Shritesh Jamulkar</a>,
                Software Engineer at Booking.com.
              </p>
              <p className={styles.recognition}>
                Won an Honourable Mention, and demoed it at Flower Labs&rsquo;
                Flower Monthly.
              </p>
              <VisitLink href="https://flower.ai/apps/tanveer/pollen-mesh-agent" label="Visit Pollen Mesh" />
            </div>
          </Reveal>
        </Beam>

        <ol className={styles.grid}>
          <Reveal as="li" delay={40} className={styles.card}>
            <article aria-labelledby="hukam-heading">
              <div className={styles.art} aria-hidden="true">
                <HukamConnectVisual />
              </div>
              <h3 id="hukam-heading" className={styles.cardTitle}>
                HukamConnect
              </h3>
              <p className={styles.description}>
                I architected and deployed a multi-tenant platform for
                Sikh Gurdwaras, pairing NFC hardware with a Firestore backend
                for real-time content distribution and engagement tracking.
              </p>
              <p className={styles.usage}>
                <span>300+ active users</span>
                <span>2,000+ monthly visits</span>
              </p>
              <VisitLink href="https://hukamconnect.com" label="hukamconnect.com" />
            </article>
          </Reveal>

          <Reveal as="li" delay={90} className={styles.card}>
            <article aria-labelledby="argus-heading">
              <div className={styles.art} aria-hidden="true">
                <ArgusVisual />
              </div>
              <h3 id="argus-heading" className={styles.cardTitle}>
                ArgusAI
              </h3>
              <p className={styles.description}>
                A voice-driven warehouse goods-receipt agent. Matches spoken
                delivery descriptions to purchase orders and escalates only
                exceptions.
              </p>
              <p className={styles.context}>
                Built at the {"{Tech: Europe}"} Agentic AI Hack, hosted by
                Conduct and Google DeepMind.
              </p>
            </article>
          </Reveal>

          <Reveal as="li" delay={140} className={styles.card}>
            <article aria-labelledby="scoofy-heading">
              <div className={styles.art} aria-hidden="true">
                <ScoofyVisual />
              </div>
              <h3 id="scoofy-heading" className={styles.cardTitle}>
                Scoofy
              </h3>
              <p className={styles.description}>
                I owned the frontend architecture for this AI e-commerce
                platform, rebuilding it in Next.js and TypeScript, closing a
                six-month backlog in four, and shipping LLM-powered
                recommendations and real-time data flows.
              </p>
              <p className={styles.context}>Head of Frontend Development · Feb–Oct 2025</p>
            </article>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

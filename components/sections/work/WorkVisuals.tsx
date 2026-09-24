import type { CSSProperties } from "react";
import styles from "./WorkVisuals.module.css";

/**
 * Bespoke, per-project visuals for Act III (#work), replacing the four
 * near-identical dotted orbs. Pollen Mesh, HukamConnect and ArgusAI are built
 * the same way the LegacyLift chapters are (components/sections/flagship/
 * Artifacts.tsx): mostly real HTML with real labels and illustrative sample
 * data (field names, values, rows), not an abstract node graph. Every figure
 * that has a real value in build/content-source.md uses that value; every
 * label that would otherwise need an invented one (an IP, a hash, a PO line,
 * a tenant name) is clearly a sample and never reads as a specific real
 * client result. Static, server-rendered, no canvas/rAF/WebGL. Entrances are
 * one-shot, keyed off the ancestor Reveal wrapper's [data-reveal]/
 * [data-revealed] attributes (see WorkVisuals.module.css), transforms and
 * opacity only, and settle permanently. Every visual is aria-hidden by its
 * parent in WhatIBuild.tsx; the facts it illustrates are already written out
 * in the card copy next to it.
 */

type Var = CSSProperties & Record<`--${string}`, string | number>;
const stagger = (i: number): Var => ({ "--i": i });

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M2.2 6.4 4.8 9 9.8 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow({ className, style, tone = "hair" }: { className?: string; style?: CSSProperties; tone?: "hair" | "glow" }) {
  const stroke = tone === "glow" ? styles.glow : styles.hair;
  return (
    <svg className={className ?? styles.arrow} style={style} viewBox="0 0 32 16" aria-hidden="true" focusable="false">
      <path className={stroke} d="M1 8H23" strokeWidth="1.3" fill="none" />
      <path
        className={stroke}
        d="M18 3 L25 8 L18 13"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pollen Mesh — the boundary, drawn as a boundary.
 *
 * The project's whole claim is that organisations can act on each other's
 * detections without handing over raw data, and that crossing is rare and
 * gated by people. So the picture is one wall with four signals arriving at
 * it: three stop short (held, still local; dropped, ruled out) and exactly
 * one crosses, arriving on the far side as nothing but a hash sitting on a
 * half-finished approval. No pair of mirrored organisation boxes, no success
 * tick: the wall is the centrepiece and most of the traffic never gets
 * through it.
 *
 * Widths: the layout switches on the *container*, not the page. This visual
 * sits in the right-hand column of a feature card, so its own width does not
 * track the viewport at all: it is ~294px at a 390px phone but only ~244px at
 * 768px, where the card first splits in two. A page-width media query put the
 * three-column crossing into that 244px and truncated every label to
 * "src_ip …" / "cr…" / "sha2…". `container-type: inline-size` also stops the
 * visual contributing a min-content width to its column, which is the
 * mechanism behind the old pill overflow rather than a symptom of it.
 */
export function PollenMeshVisual() {
  const queue: { line: string; status: "held" | "dropped" | "matched" }[] = [
    { line: "src_ip 10.4.12.9 ×212", status: "held" },
    { line: "auth_fail spike ×14", status: "held" },
    { line: "port scan pattern", status: "dropped" },
    { line: "credential stuffing", status: "matched" },
  ];
  // Row 1 is the pair of column headings; the queue starts under it.
  const row = (i: number) => ({ gridRow: i + 2 } as CSSProperties);

  return (
    <div className={styles.pollen}>
      <div className={styles.grid}>
        <p className={`${styles.orgA} ${styles.rise}`} style={stagger(0)}>
          Org A &middot; candidate signatures
        </p>
        <p className={`${styles.orgB} ${styles.rise}`} style={stagger(1)}>
          Org B receives
        </p>

        <span className={styles.wall} aria-hidden="true" />
        <span className={styles.wallLabel} aria-hidden="true">
          boundary
        </span>

        {queue.map((item, i) => (
          <span
            key={`${item.line}-line`}
            className={`${styles.line} ${styles.rise}`}
            data-status={item.status}
            style={{ ...row(i), ...stagger(i + 2) }}
          >
            {item.line}
          </span>
        ))}
        {queue.map((item, i) => (
          <span
            key={`${item.line}-tag`}
            className={`${styles.tag} ${styles.rise}`}
            data-status={item.status}
            style={{ ...row(i), ...stagger(i + 2) }}
          >
            {item.status}
          </span>
        ))}
        {queue.map((item, i) => (
          <span
            key={`${item.line}-link`}
            className={`${styles.link} ${styles.grow}`}
            data-status={item.status}
            style={{ ...row(i), ...stagger(i + 3) }}
            aria-hidden="true"
          />
        ))}

        <div className={styles.result}>
          <span className={`${styles.hashChip} ${styles.rise}`} style={stagger(8)}>
            sha256:9f2a1c8e&hellip;
          </span>
          <div className={`${styles.gate} ${styles.rise}`} style={stagger(9)}>
            <p className={styles.gateStatus}>
              <span className={styles.gateDot} aria-hidden="true" />1 of 2 approved
            </p>
            <p className={styles.gateNote}>awaiting Org B&rsquo;s reviewer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * HukamConnect — a tap resolving into one real content item (the daily
 * Hukamnama a Gurdwara distributes), landing live across several named
 * tenants. Tenant names are sample identifiers ("Gurdwara 01"...), not real
 * customers: the real figures (300+ active users, 2,000+ monthly visits)
 * stay in the card copy, not invented here.
 */
export function HukamConnectVisual() {
  const tenants = ["Gurdwara 01", "Gurdwara 02", "Gurdwara 03"];

  return (
    <div className={styles.hukam}>
      <div className={styles.hukamHead}>
        <div className={`${styles.tapIcon} ${styles.pop}`} style={stagger(0)} aria-hidden="true">
          <svg viewBox="0 0 32 32" focusable="false">
            <circle className={styles.inkStrong} cx="16" cy="16" r="4" />
            <path className={`${styles.hair} ${styles.pop}`} style={stagger(0)} d="M16 3a13 13 0 0 1 0 26" strokeWidth="1.3" fill="none" />
            <path className={`${styles.hair} ${styles.pop}`} style={stagger(1)} d="M16 8a8 8 0 0 1 0 16" strokeWidth="1.3" fill="none" />
          </svg>
        </div>
        <p className={styles.tapLabel}>Tap</p>
        <Arrow className={styles.hukamArrow} />
        <div className={`${styles.updateChip} ${styles.pop}`} style={stagger(2)}>
          <p className={styles.updateTitle}>Hukamnama</p>
          <p className={styles.updateMeta}>
            <span className={styles.liveDot} aria-hidden="true" />
            live update
          </p>
        </div>
      </div>

      <ul className={styles.tenantList}>
        {tenants.map((name, i) => (
          <li key={name} className={styles.rise} style={stagger(i + 3)}>
            <span className={styles.tenantName}>{name}</span>
            <span className={styles.synced}>
              <Check />
              synced
            </span>
          </li>
        ))}
      </ul>

      <p className={`${styles.hukamTotals} ${styles.rise}`} style={stagger(tenants.length + 3)}>
        <span>300+ active users</span>
        <span>2,000+ monthly visits</span>
      </p>
    </div>
  );
}

/**
 * ArgusAI — the spoken delivery description as real text, matched against
 * real purchase-order lines with quantities, one line short and escalated.
 */
export function ArgusVisual() {
  const bars = [10, 20, 14, 26, 16, 22, 12];

  return (
    <div className={styles.argus}>
      <div className={`${styles.voice} ${styles.rise}`} style={stagger(0)}>
        <div className={styles.waveform} aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              className={`${styles.bar} ${styles.pop} ${styles.popBottom}`}
              style={{ ...stagger(i), "--h": `${h}px` } as Var}
            />
          ))}
        </div>
        <p className={styles.voiceText}>&ldquo;Twelve pallets 2&times;4 lumber, one short&rdquo;</p>
      </div>

      <Arrow className={styles.argusArrow} />

      <ul className={styles.poLines}>
        <li className={styles.rise} style={stagger(8)}>
          <span className={styles.poItem}>2&times;4 lumber</span>
          <span className={styles.poQty}>12</span>
          <span className={styles.matched}>
            <Check />
          </span>
        </li>
        <li className={styles.rise} style={stagger(9)}>
          <span className={styles.poItem}>Plywood sheets</span>
          <span className={styles.poQty}>40</span>
          <span className={styles.matched}>
            <Check />
          </span>
        </li>
        <li className={`${styles.rise} ${styles.exceptionRow}`} style={stagger(10)}>
          <span className={styles.poItem}>Steel brackets</span>
          <span className={styles.poQty}>11 of 12</span>
          <span className={styles.exceptionTag}>escalated</span>
        </li>
      </ul>
    </div>
  );
}

/**
 * Scoofy — the frontend rebuilt one interface block at a time, settling into
 * its final layout. Not criticised by the owner; left as-is.
 */
export function ScoofyVisual() {
  const blocks: [number, number, number, number, number, number][] = [
    // x, y, w, h, offsetX (start), offsetY (start)
    [40, 42, 220, 22, -14, -10],
    [40, 76, 62, 104, -18, 10],
    [116, 76, 144, 46, 16, -14],
    [116, 134, 68, 46, 14, 14],
    [196, 134, 64, 46, 22, 10],
  ];

  return (
    <svg
      className={styles.visual}
      viewBox="0 0 300 220"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <rect className={styles.hair} x="24" y="24" width="252" height="172" rx="10" fill="none" strokeWidth="1" />
      <circle className={styles.ink} cx="38" cy="34" r="2" />
      <circle className={styles.ink} cx="46" cy="34" r="2" />
      <circle className={styles.ink} cx="54" cy="34" r="2" />

      {blocks.map(([x, y, w, h], i) => (
        <rect
          key={i}
          className={i === 0 ? `${styles.inkStrong} ${styles.pop}` : `${styles.hair} ${styles.pop}`}
          style={stagger(i + 1)}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="6"
          fill={i === 0 ? undefined : "none"}
          fillOpacity={i === 0 ? 0.18 : undefined}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

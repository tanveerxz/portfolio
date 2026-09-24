"use client";

import { useCallback, useRef, useState } from "react";

import { OrbPoster } from "@/components/narrative/OrbPoster";
import { Beam } from "@/components/effects/beam/Beam";
import { MetalRing } from "@/components/effects/metal/MetalRing";
import { useEffectGate } from "@/components/effects/runtime";
import { Button } from "@/components/primitives/Button";
import { SITE } from "@/config/site";

import styles from "./Contact.module.css";

/**
 * Act V — settled. The site's closing crescendo: the orb comes to rest
 * (breathing, frozen — see components/narrative/README.md), one huge
 * editorial type moment, and the single contact path.
 *
 * The email action is the page's one MetalRing moment (DESIGN.md reserves it
 * for here). On devices that never reach the "high" effect tier — or before
 * hydration, before idle, or under reduced motion — the same pill instead
 * gets a `halo` beam, the "use once, on the page's final action" kind. Either
 * way the control underneath is a plain `mailto:` anchor: it works with no
 * JS. Copy-to-clipboard is a small separate control layered on top of that,
 * a pure progressive enhancement — the mailto link never depends on it.
 *
 * No new copy: the heading and the email are the only words here.
 */
export function Contact() {
  const metalRef = useRef<HTMLSpanElement>(null);
  const metalOn = useEffectGate(metalRef, "high", "0px");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(SITE.email)
      .then(() => setCopied(true))
      .catch(() => {
        /* Clipboard unavailable — the mailto link above still works. */
      });
  }, []);

  const resetCopied = useCallback(() => setCopied(false), []);

  return (
    <section id="contact" data-act="settled" aria-labelledby="contact-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h2 id="contact-heading" className={styles.heading}>
            Let’s
            <br />
            <span className="t-serif">talk</span>.
          </h2>

          <div className={styles.action}>
            <span ref={metalRef} className={styles.emailWrap}>
              {metalOn ? (
                <MetalRing strength={1}>
                  <Button
                    href={`mailto:${SITE.email}`}
                    variant="silver"
                    size="lg"
                    arrow
                    className={styles.emailButton}
                  >
                    {SITE.email}
                  </Button>
                </MetalRing>
              ) : (
                <Beam kind="halo" tone="ocean" strength={0.85} radius={28} rest={0}>
                  <Button
                    href={`mailto:${SITE.email}`}
                    variant="silver"
                    size="lg"
                    arrow
                    className={styles.emailButton}
                  >
                    {SITE.email}
                  </Button>
                </Beam>
              )}
            </span>

            <button
              type="button"
              className={styles.copyButton}
              data-focus-ring=""
              data-copied={copied ? "true" : "false"}
              aria-label={copied ? "Email address copied" : "Copy email address"}
              onClick={handleCopy}
              onMouseLeave={resetCopied}
              onBlur={resetCopied}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className={styles.copyIcon}>
                <path
                  className={styles.copyIconOutline}
                  d="M7 7.5V5.75A1.75 1.75 0 0 1 8.75 4h5.5A1.75 1.75 0 0 1 16 5.75v5.5A1.75 1.75 0 0 1 14.25 13H12.5"
                  fill="none"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  className={styles.copyIconOutline}
                  x="4"
                  y="7.5"
                  width="9"
                  height="9"
                  rx="1.75"
                  fill="none"
                  strokeWidth="1.4"
                />
                <path
                  className={styles.copyIconCheck}
                  d="M6.2 12.1l1.9 1.9 4-4.4"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className={styles.status} role="status" aria-live="polite">
              {copied ? "Copied to clipboard" : ""}
            </span>
          </div>
        </div>

        <div className={styles.orbSlot} data-orb-anchor aria-hidden="true">
          <OrbPoster state="settled" className={styles.poster} />
        </div>
      </div>
    </section>
  );
}

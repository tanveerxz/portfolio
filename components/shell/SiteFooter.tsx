import Link from "next/link";

import { BeamRule } from "@/components/effects/beam/BeamRule";
import { ThinkingDot } from "@/components/effects/ThinkingDot";
import { NAV_ITEMS, SITE, SOCIAL_LINKS } from "@/config/site";

import styles from "./Shell.module.css";

/**
 * Server component. The footer repeats the primary navigation so every
 * section stays reachable without JavaScript (the mobile menu needs JS).
 * No second email path: contact lives in the Contact section only.
 * No added copy: craft (beam, orb, wordmark) fills the frame.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <BeamRule tone="ocean" />
      <div className={styles.footerInner}>
        <div className={styles.footerRow}>
          <div className={styles.footerLead}>
            <ThinkingDot size={64} state="breathing" />
          </div>

          <nav aria-label="Footer" className={styles.footerNav}>
            <ul className={styles.footerLinks}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Profiles" className={styles.footerSocial}>
            <ul className={styles.footerLinks}>
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-draw"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.footerMeta}>
            <p>
              © {new Date().getFullYear()} {SITE.name}
            </p>
            <Link href="/#top" className="link-draw">
              Back to top
            </Link>
          </div>
        </div>
      </div>
      <span className={styles.wordmark} aria-hidden="true">
        {SITE.name}
      </span>
    </footer>
  );
}

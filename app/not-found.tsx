import type { Metadata } from "next";

import { AmbientOrb } from "@/components/narrative/AmbientOrb";
import { Button } from "@/components/primitives/Button";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404. The reasoning object keeps searching for a page that isn't there.
 * Server-rendered copy plus one small client orb, so the page is complete
 * without JS and under reduced motion (AmbientOrb paints a single still).
 */
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.art} aria-hidden="true">
          <AmbientOrb state="searching" size={200} />
        </div>

        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>
            This page doesn&rsquo;t <em className="t-serif">exist</em>.
          </h1>
          <p className={styles.body}>
            The link may be out of date, or the address slightly off. Everything
            I build is one step away.
          </p>
          <div className={styles.actions}>
            <Button href="/" size="lg" arrow>
              Back to the homepage
            </Button>
            <Button href="/#work" variant="ghost" size="lg">
              See what I build
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

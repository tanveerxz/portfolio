import styles from "./Shell.module.css";

/**
 * A 1px reading-progress hairline pinned to the top edge. Zero JavaScript:
 * a CSS scroll-driven animation (animation-timeline: scroll()) runs on the
 * compositor; browsers without support simply do not render it.
 */
export function ScrollProgress() {
  return <div className={styles.progress} aria-hidden="true" />;
}

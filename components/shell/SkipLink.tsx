import styles from "./Shell.module.css";

/**
 * The first focusable element on every route. build/00-foundation.md §1.
 * Rendered once, in the root layout; every route supplies `<main id="main">`.
 */
export function SkipLink() {
  return (
    <a href="#main" className={styles.skip}>
      Skip to content
    </a>
  );
}

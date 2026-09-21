/**
 * The first focusable element on every route. build/00-foundation.md §1.
 * Rendered once, in the root layout; every route supplies `<main id="main">`.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-4 focus:z-overlay focus:rounded-md focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-sm focus:text-primary"
    >
      Skip to content
    </a>
  );
}

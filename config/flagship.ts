/**
 * The flagship's single source of truth. build/00-foundation.md §2.
 *
 * The display name is isolated in this configuration so it can change without
 * variable, never a string literal in a component. This file and the route
 * folder `app/<slug>/` are the ONLY two places in the repository where the
 * name is written out. Next requires a static route directory, which is why
 * the second one is unavoidable and documented rather than dodged with a
 * catch-all segment.
 *
 * Rename procedure (must stay this short):
 *   1. change `name` (and `slug`, if the URL moves) below;
 *   2. rename `app/<old-slug>/` to `app/<new-slug>/`;
 *   3. add a permanent redirect from the old slug in `next.config.mjs`.
 *
 * Copy rule that makes step 1 safe: no sentence anywhere may pun on the
 * name, play on its parts or depend on its meaning. Every line is written so
 * that a find-and-replace to any other name leaves it reading perfectly.
 */
export const FLAGSHIP = {
  /** Display name interpolated into shared copy. */
  name: "LegacyLift",
  /** URL segment. Must match the folder name under `app/`. */
  slug: "legacylift",
  /** Sub-brand for the verification engine. May be renamed independently. */
  engine: "Fidelity Replay",
} as const;

/**
 * The route path, built from the slug so no component hardcodes `/<slug>`.
 */
export const FLAGSHIP_HREF = `/${FLAGSHIP.slug}`;

/**
 * Outbound links that belong to the flagship.
 *
 * `launchFilm` is the ~50s launch film on LinkedIn. Its URL is not recorded
 * in `build/content-source.md`, and nothing goes on the site that does not
 * trace to that file, so it stays `null` until someone confirms it. The
 * film is described either way; only the link is conditional.
 */
export const FLAGSHIP_LINKS: { launchFilm: string | null } = {
  launchFilm: null,
};

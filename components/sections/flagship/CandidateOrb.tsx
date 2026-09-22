/**
 * Anchor for the engine's candidate orb (components/narrative/README.md §2).
 * The engine mirrors the central/legacy orb's state and clock exactly, so the
 * legacy and candidate orbs are frame-synced and equally bright. It is only
 * visible while verification progress sits inside the replay chapter
 * (`data-orb-range="0.5,0.75"`); the server poster next to it is the no-JS /
 * reduced-motion fallback, hidden globally once `html[data-orb-renderer]`
 * turns "ready" (see components/narrative/orb.module.css).
 */
export function CandidateOrb({ className }: { className?: string }) {
  return (
    <span
      className={className}
      data-orb-anchor="candidate"
      data-orb-range="0.5,0.75"
      aria-hidden="true"
    />
  );
}

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
 * Product story, taken verbatim (or trimmed, never reworded in meaning) from
 * the LegacyLift product site. The sample program, rules, code and replay
 * rows are the product's own demo data (ACCTINT / FEECALC), shown as such.
 * Company-level facts (overflow bug, BYOK) come from build/content-source.md.
 */
export const FLAGSHIP_STORY = {
  headline: "Modernise legacy systems.",
  headlineTurn: "Prove nothing broke.",
  lead: `${FLAGSHIP.name} turns decades-old code into modern, tested software. It learns every business rule, migrates one piece at a time with a person approving each change, and proves the new system behaves exactly like the old one.`,
  audience: "Built for banks, government, and the systems that can’t go down.",
  productUrl: "https://legacylift-six.vercel.app",
} as const;

/**
 * The four chapters of the homepage proof stage. The NarrativeController
 * splits verification progress evenly across the `data-verification-step`s,
 * and the orb engine splits `data-orb-states` the same way, so `until`
 * (0..1 of the sticky runway) must stay an even split. `orb` is the
 * narrative orb's state for the chapter.
 */
export const FLAGSHIP_CHAPTERS = [
  {
    id: "understand",
    orb: "connecting",
    title: "See what the old code actually does.",
    body: `${FLAGSHIP.name} reads the source, extracts the business rules buried inside, and maps how everything connects, so nothing important is lost in translation.`,
    until: 0.25,
  },
  {
    id: "rewrite",
    orb: "composing",
    title: "Rewrite it, with a human in control.",
    body: "Modern code, generated one piece at a time and reviewed old versus new. A person approves every change before it ships. Nothing merges on trust.",
    until: 0.5,
  },
  {
    id: "replay",
    orb: "solving",
    title: "Prove the new system still behaves.",
    body: "The rewrite is replayed against the real behaviour of the old system and compared field by field.",
    until: 0.75,
  },
  {
    id: "attest",
    orb: "breathing",
    title: "Proof, not promises.",
    body: "The result is sealed with a signed record your risk team can verify. Something you can hand to risk and audit that actually holds up.",
    until: 1,
  },
] as const;

export const FLAGSHIP_CHAPTER_BREAKS = FLAGSHIP_CHAPTERS.slice(0, -1).map((chapter) => chapter.until);

/** Chapter index for a verification progress value. */
export function chapterFor(progress: number): number {
  const index = FLAGSHIP_CHAPTER_BREAKS.findIndex((edge) => progress < edge);
  return index === -1 ? FLAGSHIP_CHAPTERS.length - 1 : index;
}

/** The product's demo: Codebase map · ACCTINT. */
export const CODEBASE_MAP = {
  program: "ACCTINT",
  links: [
    { name: "INTCALC", relation: "calls" },
    { name: "DATEUTIL", relation: "calls" },
    { name: "ACCTREC", relation: "reads" },
  ],
  rules: [
    { rule: "Interest tiers by balance band", owner: "Finance" },
    { rule: "Senior bonus over age 65", owner: "Finance" },
    { rule: "Dormant after 12 months inactive", owner: "Ops" },
  ],
  programs: 42,
} as const;

/** The product's demo: Review · FEECALC.CBL. */
export const REVIEW = {
  file: "FEECALC.CBL",
  legacy: ["0000-MAIN.", "  MOVE 0 TO LK-FEE.", "  IF ACCT-TYPE = 'S'", "    GOBACK.", "  PERFORM 2000-FEE."],
  migrated: [
    "def main_0000(rec):",
    '  lk_fee = Decimal("0.00")',
    '  if rec.acct_type == "S":',
    "    return lk_fee",
    "  lk_fee = fee_2000(rec)",
  ],
  checks: ["Static analysis", "AI review", "Tests"],
} as const;

/** The product's demo: Fidelity Replay of ACCTINT.cbl. */
export const REPLAY = {
  prompt: "Replay ACCTINT.cbl against the legacy reference",
  rows: [
    { vector: "ACC001", kind: "standard", value: "1,201.50" },
    { vector: "ACC004", kind: "senior tier", value: "5,006.25" },
    { vector: "ACC005", kind: "dormant", value: "790.00" },
    { vector: "ACC007", kind: "premium", value: "25,041.67" },
    { vector: "ACC010", kind: "closed", value: "0.00" },
  ],
  gates: ["Value", "Sequence", "Store", "Determinism", "Attested"],
  score: "100.0%",
} as const;

/** Trust properties, verbatim from the product site. */
export const TRUST = [
  { title: "Sandboxed execution", detail: "zero network egress" },
  { title: "Independent proof", detail: "held out from training" },
  { title: "Signed & reproducible", detail: "Ed25519, verifiable" },
  { title: "Human-approved", detail: "every change" },
] as const;

export const INDEPENDENCE_RULE = {
  statement: ["Replay can ", "teach", " the migrator, or ", "certify", " the result."],
  turn: "Never both in the same lineage.",
  body: `A validator that grades a rewrite against the same data that produced it is marking its own homework. ${FLAGSHIP.name} keeps the two apart, so a passing score means something to your model-risk team and to an auditor.`,
} as const;

/**
 * Long-form case study copy (app/<slug>/). Verbatim or trimmed from the
 * product site; company facts from build/content-source.md. Read-only: the
 * homepage does not use it.
 */
export const CASE_STUDY = {
  /** build/content-source.md. */
  summary: "An AI platform migrating enterprise legacy codebases, primarily COBOL, to modern languages.",
  /** build/content-source.md, owner-approved 2026-09-22. Origin only. */
  origin: "It began as a 5-day build at the UK AI Agent Hackathon × Conduct AI, Imperial College London.",
  problem: {
    statement: ["Most migrations start with ", "guesswork", " and end with a ", "leap of faith", "."],
    turn: `${FLAGSHIP.name} replaces both.`,
    body: "Rewriting old code is the easy part. Doing it without losing the rules, without a risky cutover, and with proof it still works. That is what a serious migration actually needs.",
    translators: `Generic translators convert syntax and quietly lose the intent. ${FLAGSHIP.name} carries every rule across (fees, eligibility, the awkward edge cases), each traced back to the decision that set it.`,
    rule: { rule: "Late-payment fee: cap at £25", owner: "Finance", trace: "set in 2019 · regulatory cap · carried across unchanged" },
  },
  steps: {
    heading: ["Understand it. ", "Migrate", " it. Prove it."],
    demoNote: "Product demo · sample programs ACCTINT and FEECALC",
    humanInControl: "No big-bang cutover, no black box. The work stops at every piece for a person to approve, edit, or reject. You stay in control of your own system.",
    /** build/content-source.md: what each step does, one fact per line. */
    specs: [
      ["Parses COBOL, Java and VB6", "Business rules with source citations", "Risk-scores every unit"],
      ["Migrates chunk by chunk", "A human approval gate on every merge"],
      ["Static analysis", "Adversarial AI review", "Generated tests that execute"],
    ],
    specsLead: ["", "", "Every chunk passes"],
  },
  replay: {
    /** build/content-source.md. */
    definition: "A differential verification engine proving behavioural equivalence before migrated code ships.",
    body: `${FLAGSHIP.engine} shows the new system behaves exactly like the old, field by field, and signs the result. Something you can hand to risk and audit that actually holds up.`,
    claims: [
      { value: "byte-exact", label: "behaviour comparison, no fudge" },
      { value: "signed", label: "attestation on every result" },
    ],
  },
  proof: {
    heading: ["It found the bug ", "nobody would notice."],
    /** build/content-source.md: verified on a real repository, not demo data. */
    mapped: [
      { value: "116", label: "functions" },
      { value: "49", label: "business rules" },
    ],
    mappedSource: "Mapped from AWS’s CardDemo mainframe codebase.",
    bug: `COBOL silently cuts off numbers that overflow their field. A modern rewrite doesn’t, so the new system quietly returns different numbers. On a real COBOL program, ${FLAGSHIP.name} caught exactly that, before it shipped.`,
    byokHeading: "Your source stays yours.",
    byok: `Bring your own key. Client source never touches ${FLAGSHIP.name} infrastructure.`,
  },
  closing: ["Legacy systems, modernised and ", "proven", "."],
  facts: [
    { label: "Founder", value: "Tanveer" },
    { label: "Status", value: "Building full-time" },
  ],
} as const;

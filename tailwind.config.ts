import type { Config } from "tailwindcss";

/**
 * Tailwind consumes the CSS custom properties defined in `app/globals.css`.
 * It never declares a colour, size, radius, shadow or z-index of its own.
 * Contract: build/00-foundation.md §3.
 *
 * Several scales below are REPLACED rather than extended (`colors`,
 * `spacing`, `fontSize`, `borderRadius`, `boxShadow`, `zIndex`). That is
 * deliberate: it makes `bg-slate-800`, `text-4xl`, `p-7` and `z-[999]` fail
 * to compile instead of merely failing review.
 */
const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    /* Replaced, not extended — only the permitted steps exist. */
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      surface: {
        0: "var(--surface-0)",
        1: "var(--surface-1)",
        2: "var(--surface-2)",
        3: "var(--surface-3)",
        glass: "var(--surface-glass)",
      },

      /* Text tokens, named to mirror --text-* */
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      tertiary: "var(--text-tertiary)",
      inverse: "var(--text-inverse)",

      accent: {
        DEFAULT: "var(--accent)",
        hover: "var(--accent-hover)",
      },
      flagship: {
        DEFAULT: "var(--accent-flagship)",
        hover: "var(--accent-flagship-hover)",
      },

      focus: "var(--focus-ring)",
      danger: "var(--danger)",
    },

    spacing: {
      0: "0px",
      px: "1px",
      1: "var(--space-1)",
      2: "var(--space-2)",
      3: "var(--space-3)",
      4: "var(--space-4)",
      5: "var(--space-5)",
      6: "var(--space-6)",
      8: "var(--space-8)",
      12: "var(--space-12)",
      16: "var(--space-16)",
      24: "var(--space-24)",
      32: "var(--space-32)",
    },

    /* The entire type scale. Size, leading, tracking and weight travel
     * together so a heading is never chosen for its size (§1). */
    fontSize: {
      display: [
        "var(--text-display)",
        { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" },
      ],
      h1: [
        "var(--text-h1)",
        { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "600" },
      ],
      h2: [
        "var(--text-h2)",
        { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "600" },
      ],
      h3: [
        "var(--text-h3)",
        { lineHeight: "1.28", letterSpacing: "-0.01em", fontWeight: "600" },
      ],
      "body-lg": ["var(--text-body-lg)", { lineHeight: "1.65" }],
      body: ["var(--text-body)", { lineHeight: "1.7" }],
      sm: ["var(--text-sm)", { lineHeight: "1.6" }],
      mono: [
        "var(--text-mono)",
        { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "500" },
      ],
    },

    borderRadius: {
      none: "0px",
      DEFAULT: "var(--r-md)",
      sm: "var(--r-sm)",
      md: "var(--r-md)",
      lg: "var(--r-lg)",
      xl: "var(--r-xl)",
      full: "var(--r-full)",
    },

    boxShadow: {
      none: "none",
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
    },

    zIndex: {
      auto: "auto",
      base: "var(--z-base)",
      raised: "var(--z-raised)",
      sticky: "var(--z-sticky)",
      nav: "var(--z-nav)",
      overlay: "var(--z-overlay)",
      modal: "var(--z-modal)",
    },

    extend: {
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },

      /* borderColor inherits every colour above; these add the
       * border-specific alpha tokens and the bare `border` default. */
      borderColor: {
        DEFAULT: "var(--border-default)",
        subtle: "var(--border-subtle)",
        default: "var(--border-default)",
        strong: "var(--border-strong)",
        control: "var(--border-control)",
        danger: "var(--danger-border)",
      },

      maxWidth: {
        /* §3 prose measure — so `max-w-[68ch]` is never written by hand. */
        prose: "68ch",
      },

      transitionTimingFunction: {
        DEFAULT: "var(--ease-standard)",
        linear: "linear",
        standard: "var(--ease-standard)",
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        emphasized: "var(--ease-emphasized)",
      },

      transitionDuration: {
        DEFAULT: "var(--dur-base)",
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
        entrance: "var(--dur-entrance)",
        choreo: "var(--dur-choreo)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

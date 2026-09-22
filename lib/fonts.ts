import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Type system — "Silver Thought" v2. See DESIGN.md › Typography.
 *
 * - Inter Tight (variable 100–900): the engineered grotesk. Carries display
 *   declarations at very tight tracking AND all body/UI copy, so the page
 *   reads as one precise voice.
 * - Instrument Serif (italic only): the "thought" voice. A high-contrast
 *   cinematic italic reserved for 1–3 emphasis words per section. Never body.
 * - JetBrains Mono: facts, figures, labels, system chrome. Not preloaded —
 *   it never renders in the LCP path.
 *
 * All three use next/font's metric-adjusted fallbacks, so the swap causes no
 * measurable layout shift.
 */
export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: "variable",
  style: ["normal"],
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["italic"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

export const fontVariables = `${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`;

import { Instrument_Sans, JetBrains_Mono, Manrope } from "next/font/google";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
  weight: "variable",
});

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = `${instrumentSans.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

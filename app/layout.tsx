import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SkipLink } from "@/components/shell/SkipLink";
import { SITE } from "@/config/site";

const description = "Tanveer is an 18-year-old self-taught full-stack developer building LegacyLift full-time during a gap year.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Tanveer | Building LegacyLift", template: "%s | Tanveer" },
  description,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: { type: "website", url: SITE.url, title: "Tanveer | Building LegacyLift", description, siteName: SITE.name, locale: "en_GB" },
  twitter: { card: "summary_large_image", title: "Tanveer | Building LegacyLift", description },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = { themeColor: "#0b0d12", colorScheme: "dark" };

const jsonLd = { "@context": "https://schema.org", "@graph": [
  { "@type": "Person", name: SITE.name, url: SITE.url, jobTitle: "Founder and full-stack developer", description },
  { "@type": "WebSite", name: SITE.name, url: SITE.url },
] };

const motionBoot = `(function(){try{var p=localStorage.getItem('portfolio-motion');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.dataset.motion=p==='full'||p==='reduced'?p:(r?'reduced':'full');}catch(e){document.documentElement.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full';}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: motionBoot }} /></head>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

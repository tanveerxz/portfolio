import { Metadata } from "next";

export const metadata: Metadata = {
  title: "What You Get with a £500 / £1K / £3K Website | @codedbytanveer",
  description:
    "A developer's honest breakdown of what you actually get at different website budgets. No fluff, just clear deliverables and realistic expectations.",
  openGraph: {
    title: "What You Get with a £500 / £1K / £3K Website",
    description:
      "A developer's honest breakdown of what you actually get at different website budgets. No fluff, just clear deliverables and realistic expectations.",
    url: "/package",
    siteName: "@codedbytanveer",
    images: [
      {
        url: "/og-website-budget.jpg",
        width: 1200,
        height: 630,
        alt: "Website Budget Breakdown",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What You Get with a £500 / £1K / £3K Website",
    description:
      "A developer's honest breakdown of what you actually get at different website budgets. No fluff, just clear deliverables and realistic expectations.",
    creator: "@codedbytanveer",
    images: ["/og-website-budget.jpg"],
  },
};

export default function PackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

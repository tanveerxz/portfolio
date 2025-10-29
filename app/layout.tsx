import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tanveersingh.dev"),
  title: "Tanveer Singh | Front-End Web Developer | Portfolio",
  description:
    "Explore Tanveer Singh's portfolio, showcasing expertise in front-end development, web design, and modern web technologies. Discover projects, skills, and get in touch.",
  keywords: [
    "Tanveer Singh",
    "Frontend Developer",
    "React Developer",
    "Next.js",
    "Web Design",
    "London",
    "CodedByTanveer",
  ],
  authors: [{ name: "Tanveer Singh", url: "https://tanveersingh.dev" }],
  creator: "Tanveer Singh",
  openGraph: {
    type: "website",
    url: "https://tanveersingh.dev",
    title: "Tanveer Singh – Front-End Web Developer",
    description:
      "Building premium, performant interfaces with tasteful motion and modern design.",
    siteName: "Tanveer Singh Portfolio",
    images: [
      {
        url: "https://tanveersingh.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tanveer Singh Portfolio Website Preview",
      },
    ],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanveer Singh – Front-End Web Developer",
    description:
      "React / Next.js developer creating modern, high-performance web experiences.",
    creator: "@tanveerxz", // or remove if no handle
    images: ["https://tanveersingh.dev/og-image.jpg"],
  },
  icons: {
    icon: "/ts-logo.png",
  },
  themeColor: "#0a0a0a",
  alternates: {
    canonical: "https://tanveersingh.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NKT7618HBB"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NKT7618HBB');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

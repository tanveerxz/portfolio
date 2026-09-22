/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets perf tooling build side-by-side without clobbering the dev `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Per-export imports for barrel-style packages (icons, animation libs).
    optimizePackageImports: ["lucide-react", "gsap", "thinking-orbs"],
  },
};

export default nextConfig;

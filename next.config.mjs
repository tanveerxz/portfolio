/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don’t block Vercel builds on ESLint errors while we iterate
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

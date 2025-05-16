/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during `next build` in CI
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⛔  Skip TypeScript errors during `next build` in CI
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 
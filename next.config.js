/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⛔  Skip ESLint when running `next build`
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 
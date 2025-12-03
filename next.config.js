/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'standalone' output for Vercel deployment
  // Vercel handles deployment automatically
  // output: 'standalone', // Only needed for Docker/self-hosting
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    unoptimized: false,
  },
  // Optimize for faster startup
  swcMinify: true,
};

module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@repo/design-system'],
  images: {
    remotePatterns: [
      {
        hostname: 'app.easyposs.vn',
        protocol: 'https',
      },
      {
        hostname: 'scontent.fhan2-4.fna.fbcdn.net',
        protocol: 'https',
      },
      {
        hostname: 'scontent.fhan15-2.fna.fbcdn.net',
        protocol: 'https',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@repo/design-system'],
  },
};

export default nextConfig;

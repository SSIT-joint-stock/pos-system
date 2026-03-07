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
      {
        hostname: 'img.freepik.com',
        protocol: 'https',
      },
      {
        hostname: 'img.vietqr.io',
        protocol: 'https',
      },
      {
        hostname: 'be-pos-mvp.ssit.company',
        protocol: 'https',
      },
      {
        hostname: 'localhost',
        port: '3002',
        protocol: 'http',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@repo/design-system'],
  },
};

export default nextConfig;

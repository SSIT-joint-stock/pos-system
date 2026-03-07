/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@repo/design-system'],
  images: {
    remotePatterns: [
      {
        hostname: 'upload.wikimedia.org',
        protocol: 'https',
      },
      {
        hostname: 'i.pinimg.com',
        protocol: 'https',
      },
      {
        hostname: 'down-vn.img.susercontent.com',
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
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

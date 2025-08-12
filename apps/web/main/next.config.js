/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/design-system",
    "@repo/types",
    "@repo/utils",
    "@repo/secure-endpoints",
    "@repo/dto",
  ],
  images: {
    remotePatterns: [
      {
        hostname: "app.easyposs.vn",
        protocol: "https",
      },
      {
        hostname: "scontent.fhan2-4.fna.fbcdn.net",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@repo/design-system", "@repo/types", "@repo/utils", "@repo/secure-endpoints", "@repo/dto"],
  images: {
    remotePatterns: [
      {
        hostname: "upload.wikimedia.org",
        protocol: "https",
      },
      {
        hostname: "i.pinimg.com",
        protocol: "https",
      },
      {
        hostname: "down-vn.img.susercontent.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

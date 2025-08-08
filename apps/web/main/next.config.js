/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/design-system",
    "@repo/types",
    "@repo/utils",
    "@repo/secure-endpoints",
    "@repo/dto",
  ],
};

export default nextConfig;

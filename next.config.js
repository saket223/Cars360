/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.imagin.studio"],
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

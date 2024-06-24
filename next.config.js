/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "build",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;

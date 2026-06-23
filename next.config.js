/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'pexels.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'pexels.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
};

module.exports = nextConfig;

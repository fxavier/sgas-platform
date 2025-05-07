/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem cache in development
      config.cache = false;
    }
    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    };
    return config;
  },
  // Improve hydration by disabling strict mode in development
  reactStrictMode: false,
  // Increase the timeout for page generation
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
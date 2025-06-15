/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure canvas package is not included in the bundle
    if (isServer) {
      config.externals.push({
        canvas: 'commonjs canvas',
      });
    }

    // Add fallback for 'canvas' module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
};

module.exports = nextConfig; 
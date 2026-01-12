/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// Try to load PWA plugin if available
try {
  const withPWA = require('@ducanh2912/next-pwa').default;
  module.exports = withPWA({
    ...nextConfig,
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    reloadOnOnline: true,
    clientsClaim: true,
    aggressiveFrontEndNavCaching: true,
    cacheOnFrontEndNav: true,
    fallbacks: {
      document: '/offline.html',
    },
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 20,
            },
          },
        },
      ],
    },
  });
} catch (e) {
  // If PWA plugin is not available, export basic config
  module.exports = nextConfig;
}

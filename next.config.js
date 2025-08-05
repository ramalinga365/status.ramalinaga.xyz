/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['prodevopsguy.tech'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  // Ensure pages are statically optimized by default
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/baby-nutrition-advisor' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/baby-nutrition-advisor/' : '',
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@alfa/shared'],
  images: {
    domains: ['localhost', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig

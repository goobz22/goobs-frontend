/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['goobs-cache'],
  swcMinify: true,
}

module.exports = nextConfig

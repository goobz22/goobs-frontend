module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  distDir: 'dist',
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
}

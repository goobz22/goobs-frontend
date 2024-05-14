/** @type {import('next').NextConfig} */
import nextTranspileModules from 'next-transpile-modules'

const nextConfig = async () => {
  const withTM = nextTranspileModules([]) // No modules to transpile

  return withTM({
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'http://localhost:3000',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ]
    },
    webpack: (config, { isServer }) => {
      // Add TypeScript loader
      config.module.rules.push({
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      })

      // Add Babel loader for additional transpilation
      config.module.rules.push({
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
        ],
      })

      // Add SVG loader
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
    optimizeFonts: true, // Add this line to enable font optimization
  })
}

export default nextConfig

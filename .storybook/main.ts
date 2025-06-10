import type { StorybookConfig } from '@storybook/nextjs'
import webpack from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: config => {
    // Add global polyfills for non-secure environment
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.DefinePlugin({
        'globalThis.isSecureContext': JSON.stringify(true),
        'window.isSecureContext': JSON.stringify(true),
        'self.isSecureContext': JSON.stringify(true),
      })
    )

    return config
  },
}

export default config

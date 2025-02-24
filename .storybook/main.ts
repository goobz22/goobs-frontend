import type { StorybookConfig } from '@storybook/nextjs'

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
  env: config => {
    if (!config) return { GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '' }
    return {
      ...config,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    }
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config

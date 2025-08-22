import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-onboarding'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: async config => {
    // Disable ESLint in webpack
    config.module?.rules?.forEach(rule => {
      if (rule && typeof rule === 'object' && rule.use) {
        const uses = Array.isArray(rule.use) ? rule.use : [rule.use]
        uses.forEach(use => {
          if (
            typeof use === 'object' &&
            use.loader?.includes('eslint-loader')
          ) {
            rule.use = []
          }
        })
      }
    })
    return config
  },
}

export default config

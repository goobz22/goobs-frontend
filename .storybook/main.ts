import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // addon-docs is what renders autodocs pages — without it the global
  // `tags: ['autodocs']` in preview.tsx and all props JSDoc produce nothing
  // (docs moved out of Storybook core in SB9). addon-a11y runs axe checks in
  // the toolbar and in test-runner runs.
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config

import type { Preview } from '@storybook/react'

// Override secure context for non-secure environments
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.isSecureContext = true
  // @ts-ignore
  globalThis.isSecureContext = true
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ['autodocs'],
}

export default preview

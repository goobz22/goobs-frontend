import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

// Note: isSecureContext override removed as it's not needed for Storybook and causes issues in modern browsers

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

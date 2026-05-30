import type { Preview } from '@storybook/react'

// Load the canonical design-token layer so every component's var(--goobs-*)
// references resolve inside Storybook. (Real consumers get this via the
// bundled dist/goobs-frontend.css; stories import components directly and
// would otherwise render with undefined tokens.)
import '../src/styles/global.css'

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

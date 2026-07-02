import type { Preview } from '@storybook/react'
import React from 'react'

// Load the canonical design-token layer so every component's var(--goobs-*)
// references resolve inside Storybook. (Real consumers get this via the
// bundled dist/goobs-frontend.css; stories import components directly and
// would otherwise render with undefined tokens.)
import '../src/styles/global.css'
// Load the brand @font-face set — without this every story renders fallback
// serif instead of Cinzel/Inter (consumers opt in via the ./fonts export).
import '../fonts/goobs-fonts.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      // SB10 API: canvases are declared as `options` and selected via
      // `globals.backgrounds.value` (per-story `globals` or the toolbar).
      // `parameters.backgrounds.default` is a dead SB8 API the runtime ignores.
      options: {
        sacred: { name: 'sacred', value: '#0e0e0e' },
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#111827' },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'goobs data-theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['sacred', 'light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  // Sacred is the library default theme, so it is also the default canvas.
  initialGlobals: { theme: 'sacred', backgrounds: { value: 'sacred' } },
  decorators: [
    (Story, { globals }) => (
      <div data-theme={globals.theme ?? 'sacred'}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default preview

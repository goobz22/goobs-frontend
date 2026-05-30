/**
 * @fileoverview Storybook stories for the Content (ContentSection) component.
 * Content is a layout composer: it takes an array of `grids`, where each grid
 * is a bag of sub-component props (typography, button, link, image, ...), and
 * renders the matching goobs components in order. It has no `styles` prop of
 * its own — theming is expressed (a) per sub-component via that sub-component's
 * own `styles.theme`, and (b) globally via the Content-level `sacredtheme`
 * boolean. These stories thread `theme` through the REAL `grids` API.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Content from './'

// --------------------------------------------------------------------------
// MOCK DATA — shared grid builders so each theme story stays declarative
// --------------------------------------------------------------------------

type ContentTheme = 'light' | 'dark' | 'sacred'

/**
 * Builds a representative `grids` array (heading + body copy + a button + a
 * link) where every sub-component is rendered in the requested theme. Content
 * itself takes no theme prop, so the theme is pushed down into each sub-
 * component's `styles.theme`.
 */
const buildGrids = (theme: ContentTheme) => [
  {
    boxProps: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.75rem',
        maxWidth: 420,
      },
    },
    typography: [
      { text: 'Content Section', variant: 'h4', styles: { theme } },
      {
        text: 'Content composes goobs components from a declarative grid of props.',
        variant: 'body1',
        styles: { theme },
      },
    ],
    button: [{ text: 'Primary Action', styles: { theme } }],
    link: [
      {
        link: 'https://example.com',
        text: 'Learn more',
        styles: { theme },
      },
    ],
  },
]

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Content> = {
  title: 'Components/Content',
  component: Content,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ padding: '2rem', width: 480 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Content>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A content section with light theme styling pushed into every sub-component.
 */
export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    grids: buildGrids('light'),
  },
}

/**
 * A content section with dark theme styling pushed into every sub-component.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    grids: buildGrids('dark'),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * A content section using the Content-level `sacredtheme` flag (the component's
 * real global-theming mechanism), which injects `sacredtheme` into each rendered
 * sub-component, alongside sacred-themed sub-component styles.
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    grids: buildGrids('sacred'),
    sacredtheme: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// VARIANT STORIES
// --------------------------------------------------------------------------

/**
 * Typography-only section: Content renders an ordered set of Typography
 * variants from a single grid.
 */
export const TypographyOnly: Story = {
  name: 'Variant/Typography Only',
  args: {
    grids: [
      {
        typography: [
          { text: 'Heading One', variant: 'h1', styles: { theme: 'light' } },
          { text: 'Heading Three', variant: 'h3', styles: { theme: 'light' } },
          {
            text: 'Body copy rendered through the Content composer.',
            variant: 'body1',
            styles: { theme: 'light' },
          },
        ],
      },
    ],
  },
}

/**
 * Multiple grids: Content maps each grid to its own rendered block, so several
 * grids stack to form a full section layout.
 */
export const MultipleGrids: Story = {
  name: 'Variant/Multiple Grids',
  args: {
    grids: [
      {
        typography: [{ text: 'Section A', variant: 'h4', styles: { theme: 'light' } }],
        button: [{ text: 'Action A', styles: { theme: 'light' } }],
      },
      {
        typography: [{ text: 'Section B', variant: 'h4', styles: { theme: 'light' } }],
        button: [{ text: 'Action B', styles: { theme: 'light' } }],
      },
    ],
  },
}

/**
 * customComponent escape hatch: any arbitrary node can be rendered alongside the
 * declarative sub-components within a grid.
 */
export const CustomComponent: Story = {
  name: 'Variant/Custom Component',
  args: {
    grids: [
      {
        typography: [
          { text: 'With a custom node', variant: 'h5', styles: { theme: 'light' } },
        ],
        customComponent: (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              background: 'rgba(147, 51, 234, 0.12)',
              color: 'rgba(147, 51, 234, 1)',
              fontFamily: 'sans-serif',
            }}
          >
            Arbitrary custom content injected via `customComponent`.
          </div>
        ),
      },
    ],
  },
}

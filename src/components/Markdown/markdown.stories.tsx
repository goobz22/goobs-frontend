/**
 * @fileoverview Storybook stories for the Markdown component.
 * Markdown is a read-only renderer that wraps `mdToHtml` output in a styled
 * block. It has no theme/styles prop of its own — text color is `inherit`, so
 * appearance follows the surrounding surface. The Light/Dark/Sacred stories
 * therefore set the theme context on the decorator wrapper and render the same
 * markdown source through the real props (`children`, `maxWidth`, `align`).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Markdown } from './'

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

/** Representative markdown exercising headings, lists, code, links, and emphasis. */
const sampleMarkdown = `# Markdown renderer

A **read-only** renderer that mirrors the editor preview, so what authors
write is exactly what readers see.

## Features

- Headings, paragraphs, and _emphasis_
- Ordered and unordered lists
- Inline \`code\` and fenced blocks
- [Links](https://example.com) and images

\`\`\`ts
const greeting = 'hello, markdown'
console.log(greeting)
\`\`\`

> Safe by construction: source is escaped before tags are built.
`

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Markdown> = {
  title: 'Components/Markdown',
  component: Markdown,
  argTypes: {
    children: {
      control: 'text',
      description: 'Markdown source. Empty / nullish renders nothing.',
    },
    maxWidth: {
      control: 'number',
      description:
        'Maximum content width in px. Defaults to 720. Pass 0 for full-width.',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment for the rendered block.',
    },
    className: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Markdown>

// --------------------------------------------------------------------------
// THEME STORIES
// Markdown has no `styles`/`theme` prop — color is `inherit`. Each story sets
// the theme context on its wrapper so the rendered block adopts that surface.
// --------------------------------------------------------------------------

/** Markdown rendered on a light surface. */
export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    children: sampleMarkdown,
  },
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem', color: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/** Markdown rendered on a dark surface. */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    children: sampleMarkdown,
  },
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem', color: '#e6e6e6' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** Markdown rendered on a stylized "sacred" dark surface. */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    children: sampleMarkdown,
  },
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem', color: '#d4c79a' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// ALIGNMENT STORIES
// --------------------------------------------------------------------------

/** Centered alignment within a bounded width. */
export const CenterAligned: Story = {
  name: 'Alignment/Center',
  args: {
    children:
      '## Centered heading\n\nThis block is centered within its bounded width.',
    align: 'center',
    maxWidth: 480,
  },
}

/** Right alignment within a bounded width. */
export const RightAligned: Story = {
  name: 'Alignment/Right',
  args: {
    children:
      '## Right-aligned heading\n\nThis block is aligned to the right edge.',
    align: 'right',
    maxWidth: 480,
  },
}

// --------------------------------------------------------------------------
// WIDTH STORIES
// --------------------------------------------------------------------------

/** Full-width rendering — `maxWidth: 0` removes the width cap. */
export const FullWidth: Story = {
  name: 'Width/Full',
  args: {
    children: sampleMarkdown,
    maxWidth: 0,
  },
  decorators: [
    Story => (
      <div style={{ width: '100%', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * @fileoverview Storybook stories for the Markdown component.
 * Markdown is a read-only renderer that wraps `mdToHtml` output in a styled
 * block. It has no theme/styles prop of its own — text color is `inherit`, so
 * appearance follows the surrounding surface. The Light/Dark/Sacred stories
 * therefore set the theme context on the decorator wrapper and render the same
 * markdown source through the real props (`children`, `maxWidth`, `align`).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
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
  globals: { backgrounds: { value: 'light' } },
}

/** Markdown rendered on a dark surface. */
export const DarkTheme: Story = {
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
  globals: { backgrounds: { value: 'dark' } },
}

/** Markdown rendered on a stylized "sacred" dark surface. */
export const SacredTheme: Story = {
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
  globals: { backgrounds: { value: 'sacred' } },
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
  // Color is `inherit` (black here) — needs the light canvas, not sacred.
  globals: { backgrounds: { value: 'light' } },
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
  // Color is `inherit` (black here) — needs the light canvas, not sacred.
  globals: { backgrounds: { value: 'light' } },
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
  // Color is `inherit` (black here) — needs the light canvas, not sacred.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// Exercise the a11y guarantees added in the 2026-07-11 audit: reflow-safe
// media AND inline text (WCAG 1.4.10) and a surface-adaptive keyboard focus
// ring (WCAG 2.4.7, tabbed to via a play fn so the ring actually paints).
// --------------------------------------------------------------------------

/**
 * Reflow-safe media (WCAG 1.4.10 Reflow). A deliberately 1200px-wide image is
 * clamped to the content width by `.root img { max-width: 100% }`, and the long
 * unbroken code line scrolls INSIDE its own `<pre>` box
 * (`.root pre { overflow-x: auto }`) instead of forcing a two-dimensional page
 * scroll. Rendered in a narrow 360px frame so the constraints are visible; the
 * image is a self-contained inline SVG data-URI so it renders offline.
 */
export const ReflowSafeMedia: Story = {
  name: 'A11y/Reflow-safe media',
  args: {
    children: [
      '# Reflow-safe rendering',
      '',
      "![1200px-wide demo banner](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200'><rect width='1200' height='200' fill='steelblue'/><text x='40' y='115' font-family='sans-serif' font-size='38' fill='white'>1200px image, clamped to container</text></svg>)",
      '',
      'The fenced block below holds one very long line that must scroll inside its own box, not widen the page:',
      '',
      '```',
      "const wide = 'a-single-unbroken-line-of-code-far-wider-than-any-narrow-viewport-that-must-not-force-the-page-to-scroll-sideways-1234567890'",
      '```',
    ].join('\n'),
    maxWidth: 0,
  },
  decorators: [
    Story => (
      <div style={{ width: '360px', padding: '1rem', color: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Keyboard focus indicator (WCAG 2.4.7 Focus Visible). Tab through the rendered
 * links: `.root a:focus-visible` draws a `currentColor` outline that stays
 * visible on any surface. Shown on the dark canvas — where a UA-default dark
 * outline would otherwise vanish — to prove the ring adapts to the inherited
 * text color.
 */
export const FocusableLinks: Story = {
  name: 'A11y/Focusable links (dark)',
  args: {
    children:
      'Tab through these links to see the focus ring: [first link](https://example.com), [second link](https://example.org), and [third link](https://example.net).',
  },
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem', color: '#e6e6e6' }}>
        <Story />
      </div>
    ),
  ],
  globals: { backgrounds: { value: 'dark' } },
  // Regression-gate the keyboard focus indicator (WCAG 2.4.7). The play fn moves
  // real keyboard focus (Tab) onto the first rendered link so
  // `.root a:focus-visible` actually paints — Chromatic captures that visible
  // `currentColor` ring in the baseline. Without a play fn no link is ever
  // focused, so the ring never renders in the snapshot and deleting the
  // `.root a:focus-visible` rule would change no baseline and pass silently.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('link', { name: 'first link' })
    // Tab from the body: focus lands on the first focusable element in the
    // block (the first link), driving its :focus-visible ring for the snapshot.
    await userEvent.tab()
    await expect(first).toHaveFocus()
    // The later links are keyboard-reachable too (only one element can hold
    // focus per snapshot, so their rings are gated by this same rule).
    await expect(canvas.getByRole('link', { name: 'second link' })).toHaveAttribute(
      'href',
      'https://example.org'
    )
    await expect(canvas.getByRole('link', { name: 'third link' })).toHaveAttribute(
      'href',
      'https://example.net'
    )
  },
}

/**
 * Inline-text reflow (WCAG 1.4.10 Reflow). The reflow-safe-media story covers
 * `<pre>` and `<img>`, but a pathological unbroken INLINE string — a bare long
 * URL used as link text, or a long inline `<code>` token from `mdToHtml` — is
 * neither, and would overflow horizontally at a narrow viewport without
 * `.root { overflow-wrap: break-word }`. Rendered in a narrow 320px frame (the
 * WCAG reflow width); a regression that removes `overflow-wrap` makes this
 * frame scroll sideways instead of wrapping the long token.
 */
export const ReflowSafeInlineText: Story = {
  name: 'A11y/Reflow-safe inline text',
  args: {
    children: [
      '# Inline reflow',
      '',
      'A bare long URL as link text must wrap, not overflow:',
      '',
      '[https://example.com/a-single-unbroken-path-segment-far-wider-than-any-narrow-viewport-that-must-wrap-instead-of-scrolling-1234567890](https://example.com)',
      '',
      'A long inline `code` token must also wrap:',
      '',
      '`a-single-unbroken-inline-code-token-far-wider-than-any-narrow-viewport-that-must-wrap-1234567890`',
    ].join('\n'),
    maxWidth: 0,
  },
  decorators: [
    Story => (
      <div style={{ width: '320px', padding: '1rem', color: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Keyboard-scrollable code block (WCAG 2.1.1 Keyboard). `.root pre` is
 * `overflow-x: auto`, so a long code line scrolls INSIDE its own box — but a
 * scroll container with no `tabindex` and no focusable children is unreachable
 * by keyboard in browsers that do not auto-focus scroll regions (axe
 * `scrollable-region-focusable`, Serious). `index.tsx` post-processes the
 * injected HTML so the `<pre>` carries `tabindex="0"` + `role="region"` + an
 * `aria-label`, making it focusable (scroll with the arrow keys) and exposing it
 * as a labelled region. The play fn Tabs onto the block and asserts it holds
 * focus and exposes the region role/label; deleting the post-process fails here.
 */
export const KeyboardScrollableCode: Story = {
  name: 'A11y/Keyboard-scrollable code',
  args: {
    children: [
      '```',
      "const wide = 'a-single-unbroken-line-of-code-far-wider-than-any-narrow-viewport-that-must-scroll-inside-its-own-box-not-widen-the-page-1234567890'",
      '```',
    ].join('\n'),
    maxWidth: 0,
  },
  decorators: [
    Story => (
      <div style={{ width: '360px', padding: '1rem', color: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
  globals: { backgrounds: { value: 'light' } },
  // Regression-gate the keyboard operability of the scroll container (WCAG
  // 2.1.1). Without the `index.tsx` post-process the `<pre>` has no `tabindex`,
  // so it is not exposed as a region and no Tab can reach it — both assertions
  // below fail.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Code block' })
    await expect(region).toHaveAttribute('tabindex', '0')
    // A single Tab from the body reaches the scroll container because it is the
    // first (and only) focusable node in the block — proving keyboard access.
    await userEvent.tab()
    await expect(region).toHaveFocus()
  },
}

/**
 * Heading-level offset for embedded blocks (document outline / SEO). `mdToHtml`
 * maps a leading `#` to a literal `<h1>`, so a block dropped mid-page emits a
 * second `<h1>` and breaks the page's heading order. The additive
 * `headingOffset` prop demotes every heading by N levels (clamped to `<h6>`) so
 * the block slots beneath an existing page heading. Here `headingOffset={2}`
 * turns a source `#`/`##` into `<h3>`/`<h4>`; the play fn asserts the demoted
 * levels and that no `<h1>` escapes to clash with the host outline. Removing the
 * level-shift post-process re-emits an `<h1>` and fails the story.
 */
export const HeadingOffset: Story = {
  name: 'A11y/Heading offset',
  args: {
    children: '# Section title\n\nBody copy.\n\n## Subsection\n\nMore copy.',
    headingOffset: 2,
  },
  decorators: [
    Story => (
      <div style={{ width: '640px', padding: '1.5rem', color: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Source `#` (a bare <h1>) is demoted to <h3>, `##` to <h4>. `getByRole`
    // with an explicit `level` throws unless the found heading is exactly that
    // level, so these lookups ARE the level assertions.
    const top = canvas.getByRole('heading', { level: 3, name: 'Section title' })
    await expect(top.tagName).toBe('H3')
    const sub = canvas.getByRole('heading', { level: 4, name: 'Subsection' })
    await expect(sub.tagName).toBe('H4')
    // No <h1> escapes to collide with the host page's document outline.
    await expect(canvas.queryByRole('heading', { level: 1 })).toBeNull()
  },
}

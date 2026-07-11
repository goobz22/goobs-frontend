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
import type { Meta, StoryObj } from '@storybook/nextjs'
import Content from './'
import { AnimatedElement, type Animation } from './Structure/animations'

// Self-contained inline SVG so the image stories need no network asset. A solid
// purple swatch (120×80) used to exercise the `image` sub-component's alt-text.
const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80">' +
      '<rect width="120" height="80" fill="#7e22ce"/></svg>'
  )

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
  args: {
    grids: buildGrids('light'),
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A content section with dark theme styling pushed into every sub-component.
 */
export const DarkTheme: Story = {
  args: {
    grids: buildGrids('dark'),
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * A content section using the Content-level `sacredtheme` flag (the component's
 * real global-theming mechanism), which injects `sacredtheme` into each rendered
 * sub-component, alongside sacred-themed sub-component styles.
 */
export const SacredTheme: Story = {
  args: {
    grids: buildGrids('sacred'),
    sacredtheme: true,
  },
  globals: { backgrounds: { value: 'dark' } },
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
  globals: { backgrounds: { value: 'light' } },
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
        typography: [
          { text: 'Section A', variant: 'h4', styles: { theme: 'light' } },
        ],
        button: [{ text: 'Action A', styles: { theme: 'light' } }],
      },
      {
        typography: [
          { text: 'Section B', variant: 'h4', styles: { theme: 'light' } },
        ],
        button: [{ text: 'Action B', styles: { theme: 'light' } }],
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
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
          {
            text: 'With a custom node',
            variant: 'h5',
            styles: { theme: 'light' },
          },
        ],
        customComponent: (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              // purple-700 on its 12% tint over the light canvas = 5.71:1 (WCAG AA)
              background: 'rgba(126, 34, 206, 0.12)',
              color: 'rgba(126, 34, 206, 1)',
              fontFamily: 'sans-serif',
            }}
          >
            Arbitrary custom content injected via `customComponent`.
          </div>
        ),
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------

/**
 * Image alt text (WCAG 1.1.1). The `image` sub-component now respects the
 * author's explicit `alt` verbatim: a meaningful description is announced, while
 * an explicit empty string (`alt=""`) marks the image decorative so assistive
 * tech skips it. An omitted `alt` defaults to decorative (empty) rather than the
 * old meaningless "image" label.
 */
export const ImageAltText: Story = {
  name: 'A11y/Image Alt Text',
  args: {
    grids: [
      {
        boxProps: {
          style: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.75rem',
          },
        },
        typography: [
          { text: 'Images', variant: 'h5', styles: { theme: 'light' } },
        ],
        image: [
          // Meaningful image: real alt is exposed to assistive tech.
          {
            url: SAMPLE_IMAGE,
            alt: 'Purple placeholder swatch',
            width: 120,
            height: 80,
          },
          // Decorative image: explicit empty alt so screen readers skip it.
          { url: SAMPLE_IMAGE, alt: '', width: 120, height: 80 },
        ],
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Link accessible name (WCAG 2.4.4 / 4.1.2, 2.5.3 Label in Name). A link with
 * visible text takes its name from that text; a link named by its visible
 * `children` (no `text`) keeps THAT child as its name — the URL `aria-label`
 * fallback must NOT override it (a Label-in-Name mismatch would block speech
 * input); a link with NO visible content at all falls back to an `aria-label`
 * of its destination URL so it is never announced as an empty link.
 */
export const LinkAccessibleName: Story = {
  name: 'A11y/Link Accessible Name',
  args: {
    grids: [
      {
        boxProps: {
          style: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.5rem',
          },
        },
        link: [
          // Named by its visible text.
          {
            link: 'https://example.com/pricing',
            text: 'View pricing',
            styles: { theme: 'light' },
          },
          // Named by its visible CHILDREN (no `text`): the accessible name is
          // the rendered child ("Read the docs"), NOT an aria-label of the URL.
          {
            link: 'https://example.com/docs',
            children: 'Read the docs',
            styles: { theme: 'light' },
          },
          // No visible content: the anchor is labelled with its href via aria-label.
          { link: 'https://example.com/terms', styles: { theme: 'light' } },
        ],
      },
    ],
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Reduced-motion entrance animations (WCAG 2.3.3). AnimatedElement drives the
 * slide/fade entrance variants. Under `prefers-reduced-motion: reduce` the
 * module CSS disables the transform-based movement and jumps each variant to its
 * stable end state (slides/fadeIn stay fully visible, fadeOut stays hidden).
 */
export const ReducedMotionAnimations: Story = {
  name: 'A11y/Reduced Motion',
  render: () => {
    const variants: Animation[] = [
      'slideInLeft',
      'slideInRight',
      'slideInUp',
      'slideInDown',
      'fadeIn',
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {variants.map(variant => (
          <AnimatedElement
            key={variant}
            animationtype={variant}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              background: 'rgba(126, 34, 206, 0.12)',
              color: 'rgba(126, 34, 206, 1)',
              fontFamily: 'sans-serif',
            }}
          >
            {variant}
          </AnimatedElement>
        ))}
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

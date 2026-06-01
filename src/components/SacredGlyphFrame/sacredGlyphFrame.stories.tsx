/**
 * @fileoverview Storybook stories for the SacredGlyphFrame component.
 * Demonstrates the animated gold-glow border, the floating glyph row, the
 * optional decorative corners, and the canonical use case: wrapping a
 * sacred-themed Card (which now also carries the formSectionStyle sacred
 * variant on its Card.Section regions).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import SacredGlyphFrame from './index'
import Card from '../Card/index'

const meta: Meta<typeof SacredGlyphFrame> = {
  title: 'Components/SacredGlyphFrame',
  component: SacredGlyphFrame,
  argTypes: {
    glow: {
      control: 'boolean',
      description: 'Render the animated gold-glow border (sacredGlowPulse).',
    },
    glyphs: {
      control: 'boolean',
      description:
        'Render the top-centred row of floating glyphs (sacredFloat).',
    },
    glyphSequence: {
      control: false,
      description: 'Override the decorative glyph sequence (aria-hidden).',
    },
    corners: {
      control: false,
      description: 'Optional decorative corner ornaments (aria-hidden).',
    },
    children: {
      control: false,
      description: 'Framed content — typically a sacred-themed Card.',
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ padding: '3rem', minWidth: '420px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SacredGlyphFrame>

// --------------------------------------------------------------------------
// CANONICAL — frame wrapping a sacred Card with a formSection-style section
// --------------------------------------------------------------------------

/**
 * The canonical absorption: a SacredGlyphFrame wrapping a sacred-themed Card.
 * The inner Card.Section now renders with the formSectionStyle sacred look
 * (dark translucent fill, 1px #D4AF37 border, clamp() radius, gold glow) that
 * was previously hand-rolled inline ~112 times.
 */
export const WrappingSacredCard: Story = {
  name: 'Canonical/Wrapping a Sacred Card',
  args: {
    glow: true,
    glyphs: true,
    children: (
      <Card styles={{ theme: 'sacred' }} style={{ paddingTop: '40px' }}>
        <Card.Header>
          <Card.HeaderIcon>𓂀</Card.HeaderIcon>
          <Card.Title>Estimate #EST-1042</Card.Title>
          <Card.Subtitle>Pending customer review</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Section label="Service Period">
            <Card.Stats columns={2}>
              <Card.StatCell label="From" value="Jan 1, 2026" />
              <Card.StatCell label="To" value="Jan 31, 2026" />
            </Card.Stats>
          </Card.Section>
          <Card.Section label="Summary">
            <Card.Stats columns={2}>
              <Card.StatCell label="Subtotal" value="$1,200.00" />
              <Card.StatCell
                label="Total"
                value="$1,320.00"
                valueColor="#22c55e"
              />
            </Card.Stats>
          </Card.Section>
        </Card.Body>
      </Card>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvasElement.querySelector(
      '[data-component="SacredGlyphFrame"]'
    )
    await expect(frame).toBeInTheDocument()
    await expect(frame).toHaveAttribute('data-sgf-glow', 'true')
    await expect(frame).toHaveAttribute('data-sgf-glyphs', 'true')
    await expect(canvas.getByText('Estimate #EST-1042')).toBeInTheDocument()
  },
}

// --------------------------------------------------------------------------
// DECORATION TOGGLES
// --------------------------------------------------------------------------

/** Glow border only — the floating glyph row is suppressed. */
export const GlowOnly: Story = {
  name: 'Decoration/Glow Only',
  args: {
    glow: true,
    glyphs: false,
    children: (
      <Card styles={{ theme: 'sacred' }}>
        <Card.Header>
          <Card.Title>Glow border, no glyphs</Card.Title>
        </Card.Header>
      </Card>
    ),
  },
}

/** Floating glyphs only — the animated border is suppressed. */
export const GlyphsOnly: Story = {
  name: 'Decoration/Glyphs Only',
  args: {
    glow: false,
    glyphs: true,
    children: (
      <Card styles={{ theme: 'sacred' }} style={{ paddingTop: '40px' }}>
        <Card.Header>
          <Card.Title>Glyph row, no glow</Card.Title>
        </Card.Header>
      </Card>
    ),
  },
}

/** Both decorations disabled — a plain dark gold-bordered frame. */
export const BareFrame: Story = {
  name: 'Decoration/Bare Frame',
  args: {
    glow: false,
    glyphs: false,
    children: (
      <Card styles={{ theme: 'sacred' }}>
        <Card.Header>
          <Card.Title>No glow, no glyphs</Card.Title>
        </Card.Header>
      </Card>
    ),
  },
}

// --------------------------------------------------------------------------
// CUSTOM GLYPH SEQUENCE + CORNERS
// --------------------------------------------------------------------------

/** A custom glyph sequence overriding the default Egyptian row. */
export const CustomGlyphSequence: Story = {
  name: 'Customization/Custom Glyph Sequence',
  args: {
    glow: true,
    glyphs: true,
    glyphSequence: ['✦', '✧', '◆', '✧', '✦'],
    children: (
      <Card styles={{ theme: 'sacred' }} style={{ paddingTop: '40px' }}>
        <Card.Header>
          <Card.Title>Custom glyph row</Card.Title>
        </Card.Header>
      </Card>
    ),
  },
}

/** Decorative corner ornaments rendered in all four corners. */
export const WithCorners: Story = {
  name: 'Customization/With Corner Ornaments',
  args: {
    glow: true,
    glyphs: true,
    corners: '❖',
    children: (
      <Card
        styles={{ theme: 'sacred' }}
        style={{ paddingTop: '40px', minHeight: '160px' }}
      >
        <Card.Header>
          <Card.Title>Framed with corners</Card.Title>
          <Card.Subtitle>Ornaments in every corner, aria-hidden</Card.Subtitle>
        </Card.Header>
      </Card>
    ),
  },
}

// --------------------------------------------------------------------------
// PLAIN CONTENT (no Card) — the frame works around any sacred surface
// --------------------------------------------------------------------------

/** The frame around arbitrary content rather than a Card. */
export const ArbitraryContent: Story = {
  name: 'Use Cases/Arbitrary Content',
  args: {
    glow: true,
    glyphs: true,
    children: (
      <div
        style={{
          padding: '48px 32px 24px',
          color: '#ffffff',
          fontFamily: '"Cinzel", serif',
          textAlign: 'center',
        }}
      >
        Any sacred surface can be framed — not just a Card.
      </div>
    ),
  },
}

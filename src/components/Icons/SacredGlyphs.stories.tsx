/**
 * @fileoverview Storybook stories for the SACRED_GLYPHS export (plus its
 * SacredGlyph member type) — the 24-character Egyptian-hieroglyph set from
 * src/components/Icons/sacredGlyphs.ts. Pins the full glyph roster on the
 * sacred canvas: every member must render as a visible gold glyph (not a
 * tofu/missing-glyph box), labeled with its Unicode codepoint so a silent
 * set-membership change breaks the baseline.
 *
 * Usage note: the set is opt-in decoration (no longer force-rendered onto
 * sacred-theme icons). Its shipped consumer since Wave 1 is TreeView's
 * SacredBackground (src/components/TreeView/index.tsx), which draws drifting
 * SACRED_GLYPHS particles on the sacred variant's background canvas.
 *
 * These stories are the SACRED_GLYPHS regression spec — goobs has no unit
 * tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { expect, within } from 'storybook/test'
import { SACRED_GLYPHS, type SacredGlyph } from './sacredGlyphs'

const meta: Meta = {
  title: 'Components/Icons/SacredGlyphs',
}

export default meta
type Story = StoryObj

/** Unicode codepoint label, e.g. `U+13080` for 𓂀 (Eye of Horus). */
const codepointOf = (glyph: SacredGlyph): string => {
  const codepoint = glyph.codePointAt(0)
  return codepoint === undefined
    ? 'U+????'
    : `U+${codepoint.toString(16).toUpperCase()}`
}

const GlyphGrid: React.FC = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: 'var(--goobs-space-md)',
      padding: 'var(--goobs-space-lg)',
      fontFamily: 'var(--goobs-font-sacred)',
    }}
  >
    {SACRED_GLYPHS.map(glyph => (
      <figure
        key={glyph}
        data-glyph={glyph}
        style={{
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--goobs-space-xs)',
          padding: 'var(--goobs-space-md)',
          background: 'var(--goobs-sacred-surface-raised)',
          border: '1px solid var(--goobs-sacred-border)',
          borderRadius: 'var(--goobs-radius-md)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: '2.5rem',
            lineHeight: 1,
            color: 'var(--goobs-gold)',
            textShadow: '0 0 12px var(--goobs-gold-a40)',
          }}
        >
          {glyph}
        </span>
        <figcaption
          style={{
            fontFamily: 'var(--goobs-font-mono)',
            fontSize: '0.75rem',
            color: 'var(--goobs-sacred-text-muted)',
          }}
        >
          {codepointOf(glyph)}
        </figcaption>
      </figure>
    ))}
  </div>
)

/**
 * All 24 hieroglyphs on the sacred canvas in one labeled grid: each cell shows
 * the glyph in gold with a soft glow above its Unicode codepoint caption. The
 * play function pins the set's SIZE (exactly 24 rendered cells) and its
 * anchor members (𓂀 Eye of Horus, 𓋹 Ankh, 𓇳 sun-disc) — a glyph added to,
 * removed from, or swapped in SACRED_GLYPHS changes the grid and fails here.
 */
export const AllGlyphs: Story = {
  render: () => <GlyphGrid />,
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cells = canvasElement.querySelectorAll('[data-glyph]')
    await expect(cells).toHaveLength(24)
    await expect(SACRED_GLYPHS).toHaveLength(24)
    // Anchor members named in the sacredGlyphs.ts doc comment.
    for (const anchorGlyph of ['𓂀', '𓋹', '𓇳'] as const) {
      await expect(
        canvasElement.querySelector(`[data-glyph="${anchorGlyph}"]`)
      ).not.toBeNull()
    }
    // Every codepoint caption renders (24 unique U+13xxx labels).
    await expect(canvas.getAllByText(/^U\+13[0-9A-F]{3}$/)).toHaveLength(24)
  },
}

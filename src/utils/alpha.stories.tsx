/**
 * @fileoverview Storybook stories for the `alpha` util (src/utils/alpha.ts) —
 * the variant the main barrel ships (`export { alpha } from './utils/alpha'`,
 * src/index.ts). Pins its hex-to-rgba conversion across the opacity ladder:
 * alpha('#FFD700', 0.1..0.9) must yield `rgba(255, 215, 0, <opacity>)` — the
 * gold channel triple parsed from hex, never a passthrough of the input.
 * (A divergent hex-only `alpha` also exists in src/utils/index.ts; that copy
 * is NOT what the barrel exports and is not covered here — though it DOES
 * ship, bundled into the barrel-exported Tabs component, which imports it
 * with hex-only input.)
 *
 * These stories are the alpha-util regression spec — goobs has no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { expect, within } from 'storybook/test'
import { alpha } from './alpha'

const meta: Meta = {
  title: 'Components/Utils/Alpha',
}

export default meta
type Story = StoryObj

const OPACITY_LADDER = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] as const

// The demo input is gold (#FFD700) so the ladder reads against the sacred
// canvas; the hex literal here is the function's test DATUM, not a themed
// surface style.
const GOLD_HEX = '#FFD700'

const SwatchLadder: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--goobs-space-sm)',
      padding: 'var(--goobs-space-lg)',
      fontFamily: 'var(--goobs-font-mono)',
    }}
  >
    {OPACITY_LADDER.map(opacity => {
      const rgba = alpha(GOLD_HEX, opacity)
      return (
        <figure
          key={opacity}
          data-opacity={opacity}
          style={{
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--goobs-space-2xs)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '48px',
              backgroundColor: rgba,
              border: '1px solid var(--goobs-sacred-border)',
              borderRadius: 'var(--goobs-radius-sm)',
            }}
          />
          <figcaption
            style={{
              fontSize: '0.7rem',
              color: 'var(--goobs-sacred-text-muted)',
            }}
          >
            {rgba}
          </figcaption>
        </figure>
      )
    })}
  </div>
)

/**
 * Nine gold swatches on the sacred canvas, opacity 0.1 through 0.9, each
 * captioned with the exact rgba string the util returned. The play function
 * pins the conversion itself: every caption must read
 * `rgba(255, 215, 0, <opacity>)` — proving the hex was parsed into channel
 * values (255/215/0) at each ladder step, not returned verbatim.
 */
export const GoldOpacityLadder: Story = {
  render: () => <SwatchLadder />,
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const opacity of OPACITY_LADDER) {
      await expect(alpha(GOLD_HEX, opacity)).toBe(
        `rgba(255, 215, 0, ${opacity})`
      )
      await expect(
        canvas.getByText(`rgba(255, 215, 0, ${opacity})`)
      ).toBeVisible()
    }
    await expect(canvasElement.querySelectorAll('[data-opacity]')).toHaveLength(
      OPACITY_LADDER.length
    )
  },
}

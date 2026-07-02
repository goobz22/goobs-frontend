/**
 * @fileoverview Storybook stories for the Chip component: the default
 * interactive `chip` variant across the three themes and styling overrides,
 * plus the read-only `pill` variant with all six semantic tone palettes
 * (the shipped replacement for the hand-rolled StatusPill / StatusBadge /
 * Pill status indicators). These stories are the Chip regression spec —
 * goobs has no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, within } from 'storybook/test'
import Chip, { type ChipTone } from './index'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    label: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, custom colors, and layout properties.',
    },
    onDelete: { action: 'deleted' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Chip>

// --------------------------------------------------------------------------
// Basic Stories
// --------------------------------------------------------------------------

/** A default chip using the light theme. */
export const Default: Story = {
  args: {
    label: 'Default Chip',
    styles: {
      theme: 'light',
    },
  },
}

/** A chip that can be deleted. */
export const Deletable: Story = {
  args: {
    label: 'Deletable Chip',
    onDelete: fn(),
    styles: {
      theme: 'light',
    },
  },
}

/** A disabled chip that cannot be interacted with. */
export const Disabled: Story = {
  name: 'State/Disabled',
  args: {
    label: 'Disabled Chip',
    onDelete: fn(),
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

// --------------------------------------------------------------------------
// Theming Stories
// --------------------------------------------------------------------------

/** The light theme provides a clean, modern appearance. */
export const LightTheme: Story = {
  name: 'Theme/Light',
  args: {
    label: 'Light Theme Chip',
    onDelete: fn(),
    styles: {
      theme: 'light',
    },
  },
}

/** The dark theme provides a sophisticated appearance. */
export const DarkTheme: Story = {
  name: 'Theme/Dark',
  args: {
    label: 'Dark Theme Chip',
    onDelete: fn(),
    styles: {
      theme: 'dark',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  name: 'Theme/Sacred',
  args: {
    label: 'Sacred Chip',
    onDelete: fn(),
    styles: {
      theme: 'sacred',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A sacred theme chip that is also disabled. */
export const SacredDisabled: Story = {
  name: 'Theme/Sacred Disabled',
  args: {
    label: 'Sacred & Disabled',
    onDelete: fn(),
    styles: {
      theme: 'sacred',
      disabled: true,
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * The chip without its default outline, achieved via the real styling API:
 * `borderColor` / `hoverBorderColor` set to `'transparent'` (there is no
 * boolean `outline` prop on `ChipStyles`).
 */
export const NoOutline: Story = {
  name: 'Theme/No Outline',
  args: {
    label: 'No Outline',
    styles: {
      theme: 'light',
      borderColor: 'transparent',
      hoverBorderColor: 'transparent',
    },
  },
}

// --------------------------------------------------------------------------
// Customization Stories
// --------------------------------------------------------------------------

/** A chip with custom colors. */
export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  args: {
    label: 'Custom Colors',
    onDelete: fn(),
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      color: 'rgb(34, 197, 94)',
      hoverBackgroundColor: 'rgba(34, 197, 94, 0.15)',
      hoverBorderColor: 'rgba(34, 197, 94, 0.4)',
    },
  },
}

/** A chip with custom dimensions. */
export const CustomSize: Story = {
  name: 'Customization/Custom Size',
  args: {
    label: 'Large Chip',
    onDelete: fn(),
    styles: {
      theme: 'light',
      height: '36px',
      padding: '0 16px',
      fontSize: '16px',
    },
  },
}

// --------------------------------------------------------------------------
// Variant Stories — pill
// --------------------------------------------------------------------------

/**
 * Every ChipTone, one label per tone so a palette swap is visible at a
 * glance. Keyed to the semantics documented on the ChipTone type.
 */
const PILL_TONE_LABELS: Record<ChipTone, string> = {
  success: 'Paid',
  info: 'In Progress',
  warn: 'Pending',
  danger: 'Overdue',
  neutral: 'Inactive',
  gold: 'Featured',
}

/** Render order — the full ChipTone union, typechecked against the component. */
const PILL_TONES: ChipTone[] = [
  'success',
  'info',
  'warn',
  'danger',
  'neutral',
  'gold',
]

/**
 * The read-only `variant="pill"` in all six semantic tones (success / info /
 * warn / danger / neutral / gold), side-by-side on a dark backdrop — the
 * shipped replacement for the deleted StatusPill / StatusBadge / Pill
 * components. Pins the observable pill contract: fully rounded (999px)
 * compact status indicators, each deriving its translucent background +
 * matching border + solid text triplet from `data-chip-tone` alone (no
 * hand-tuned alpha values), rendered non-interactive with `role="status"`
 * and `data-chip-variant="pill"`. The second row pins the `dot` shortcut:
 * a leading dot inheriting the tone's text color. A tone palette or pill
 * geometry regression changes this snapshot; the play function asserts the
 * DOM contract (12 status pills, 2 per tone).
 */
export const PillTones: Story = {
  name: 'Variants/Pill Tones',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {PILL_TONES.map(tone => (
          <Chip
            key={tone}
            variant="pill"
            tone={tone}
            label={PILL_TONE_LABELS[tone]}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {PILL_TONES.map(tone => (
          <Chip
            key={tone}
            variant="pill"
            tone={tone}
            dot
            label={PILL_TONE_LABELS[tone]}
          />
        ))}
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Read-only pills expose role="status" (never button — they are
    // non-interactive), one per tone per row.
    const statusPills = canvas.getAllByRole('status')
    await expect(statusPills).toHaveLength(PILL_TONES.length * 2)

    for (const tone of PILL_TONES) {
      const tonedPills = canvasElement.querySelectorAll(
        `[data-chip-variant="pill"][data-chip-tone="${tone}"]`
      )
      // Two pills per tone: plain + leading-dot.
      await expect(tonedPills).toHaveLength(2)
    }
  },
}

/**
 * @fileoverview Storybook stories for the Chip component: the default
 * interactive `chip` variant across the three themes and styling overrides,
 * plus the read-only `pill` variant with all six semantic tone palettes
 * (the shipped replacement for the hand-rolled StatusPill / StatusBadge /
 * Pill status indicators). These stories are the Chip regression spec —
 * goobs has no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, within } from 'storybook/test'
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
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A chip that can be deleted. The `×` control is a real `<button type="button">`
 * whose accessible name composes the chip label ("Remove Deletable Chip"), and
 * its inner glyph is decorative — marked `aria-hidden` so AT announces only the
 * button name (WCAG 1.1.1 / 4.1.2). The play function pins that name + the
 * `aria-hidden` glyph, and that the delete control meets the WCAG 2.5.8 (AA 2.2)
 * 24×24 CSS-px target-size floor via its extended `::before` hit area (the
 * visible glyph is only ~16px).
 */
export const Deletable: Story = {
  args: {
    label: 'Deletable Chip',
    onDelete: fn(),
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Real button, accessible name composed from the label.
    const deleteButton = canvas.getByRole('button', {
      name: 'Remove Deletable Chip',
    })

    // The × glyph is decorative — hidden from AT so the button reads by its
    // aria-label alone, not as a nameless graphic (issue 4).
    const glyph = deleteButton.querySelector('svg')
    await expect(glyph).not.toBeNull()
    await expect(glyph).toHaveAttribute('aria-hidden', 'true')

    // Target size (WCAG 2.5.8): the pointer target is extended to ≥24×24 via a
    // centered ::before hit area even though the visible glyph is ~16px.
    const hitArea = getComputedStyle(deleteButton, '::before')
    await expect(parseFloat(hitArea.width)).toBeGreaterThanOrEqual(24)
    await expect(parseFloat(hitArea.height)).toBeGreaterThanOrEqual(24)
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
  globals: { backgrounds: { value: 'light' } },
}

/**
 * An interactive (clickable) chip. Passing `onClick` promotes the chip to a
 * real `role="button"` with a keyboard tab stop and Enter/Space activation
 * (the WAI-ARIA button pattern), and `active` is surfaced as `aria-pressed`
 * for the toggle-filter use-case. The play function pins the a11y contract:
 * the chip is a focusable button, reports its pressed state, and fires on
 * pointer click AND on keyboard Enter/Space. A `:focus-visible` ring
 * (Chip.module.css) makes the keyboard focus visible.
 */
export const Interactive: Story = {
  name: 'State/Interactive (button)',
  args: {
    label: 'Filter',
    onClick: fn(),
    active: false,
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // A clickable chip exposes a real button role, an accessible name, a tab
    // stop, and its pressed state.
    const chip = canvas.getByRole('button', { name: 'Filter' })
    await expect(chip).toHaveAttribute('tabindex', '0')
    await expect(chip).toHaveAttribute('aria-pressed', 'false')

    // Keyboard focus + activation — the APG button interaction (Enter, Space).
    chip.focus()
    await expect(chip).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    // Pointer activation.
    await userEvent.click(chip)

    // Enter + Space + click = three activations.
    await expect(args.onClick).toHaveBeenCalledTimes(3)
  },
}

/**
 * A disabled interactive chip. Even while disabled, an `onClick` chip keeps
 * `role="button"` so screen readers announce a *dimmed / unavailable* button
 * (via `aria-disabled="true"`) rather than a roleless `<div>` — but it is
 * removed from the tab order and its handlers are inert. The play function
 * pins that the button role + disabled state are exposed and no activation
 * fires.
 */
export const DisabledInteractive: Story = {
  name: 'State/Disabled (interactive)',
  args: {
    label: 'Disabled Filter',
    onClick: fn(),
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Role is still "button", but the state is programmatically disabled and
    // the element is not in the tab order.
    const chip = canvas.getByRole('button', { name: 'Disabled Filter' })
    await expect(chip).toHaveAttribute('aria-disabled', 'true')
    await expect(chip).not.toHaveAttribute('tabindex')

    // Clicking a disabled chip does nothing.
    await userEvent.click(chip)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

/**
 * A chip that is BOTH clickable (`onClick`) and deletable (`onDelete`). This is
 * the one combination that must NOT be a `role="button"` wrapping the focusable
 * delete `<button>` (an ARIA presentational-children conflict → inconsistent AT
 * announcement, WCAG 4.1.2). Instead the root becomes a `role="group"` holding
 * two sibling `<button>`s: the primary action (carrying the toggle
 * `aria-pressed`) and the delete control. The play function pins the group
 * shape, that the two controls are siblings (neither nested in the other), that
 * each fires only its own handler, and that the primary action activates on
 * Enter via native button semantics.
 */
export const ClickableDeletable: Story = {
  name: 'State/Clickable + Deletable',
  args: {
    label: 'Assignee',
    onClick: fn(),
    onDelete: fn(),
    active: false,
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // The root is a role="group" — NOT a role="button" (which would wrap the
    // focusable delete button, the ARIA anti-pattern this restructure removes).
    const root = canvasElement.querySelector(
      '[data-component="Chip"]'
    ) as HTMLElement | null
    await expect(root).not.toBeNull()
    await expect(root).toHaveAttribute('role', 'group')

    // Primary action: a real <button> (not the root <div>) reporting its
    // pressed state for the toggle-filter use-case.
    const action = canvas.getByRole('button', { name: 'Assignee' })
    await expect(action.tagName).toBe('BUTTON')
    await expect(action).toHaveAttribute('data-chip-action', 'true')
    await expect(action).toHaveAttribute('aria-pressed', 'false')

    // Delete control: a separate, real <button>.
    const del = canvas.getByRole('button', { name: 'Remove Assignee' })
    await expect(del.tagName).toBe('BUTTON')

    // The two controls are SIBLINGS under the group root — neither is nested
    // inside the other (the whole point of the group restructure).
    await expect(action.contains(del)).toBe(false)
    await expect(del.contains(action)).toBe(false)
    await expect(action.parentElement).toBe(root)
    await expect(del.parentElement).toBe(root)

    // Each control fires only its own handler.
    await userEvent.click(action)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
    await expect(args.onDelete).not.toHaveBeenCalled()

    await userEvent.click(del)
    await expect(args.onDelete).toHaveBeenCalledTimes(1)
    await expect(args.onClick).toHaveBeenCalledTimes(1)

    // Keyboard: the primary action is a native <button>, so it activates on
    // Enter without any role="button" keydown shim.
    action.focus()
    await expect(action).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

/**
 * Pins the accessible-name placement rule (ARIA 1.2): `aria-label` is prohibited
 * on a generic (roleless) element. A plain decorative chip (`variant="chip"`, no
 * `onClick` / `onDelete` / explicit role) is roleless, so it carries NO
 * `aria-label` — its visible text is the accessible name. Supplying an explicit
 * `ariaLabel` signals the caller wants a specific name, which needs a
 * name-bearing role, so the chip is promoted to `role="img"` (a single named
 * token). The play function pins both: the unnamed chip stays roleless with no
 * `aria-label`, and the explicitly-named one exposes `role="img"` + the label.
 */
export const DecorativeLabeling: Story = {
  name: 'A11y/Decorative Labeling',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Chip label="Plain" styles={{ theme: 'light' }} />
      <Chip
        label="Custom"
        ariaLabel="Custom status token"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('[data-component="Chip"]')
    await expect(chips).toHaveLength(2)

    // A roleless decorative chip must NOT carry aria-label (invalid on generic)
    // and must not invent a role — the visible text is the accessible name.
    const [plain, custom] = Array.from(chips) as HTMLElement[]
    await expect(plain).not.toHaveAttribute('role')
    await expect(plain).not.toHaveAttribute('aria-label')

    // An explicitly-named decorative chip gets a name-bearing role (img) so the
    // aria-label lands on an element that supports it.
    await expect(custom).toHaveAttribute('role', 'img')
    await expect(custom).toHaveAttribute('aria-label', 'Custom status token')
  },
}

/**
 * Pins the focus-ring contrast fix (WCAG 2.4.11 Focus Appearance / 1.4.11
 * Non-text Contrast — ≥3:1). The shared `--goobs-{light,dark}-focus-ring`
 * tokens are translucent blues that fall below 3:1 over their surfaces, so Chip
 * overrides `--chip-focus` per theme with opaque high-contrast blues. This play
 * function resolves the effective `--chip-focus` color (via a probe element that
 * inherits it) and asserts it is opaque and clears 3:1 against the theme's
 * surface — so a regression back to the below-threshold shared token fails here.
 */
export const FocusRingContrast: Story = {
  name: 'A11y/Focus Ring Contrast',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Chip label="Light" onClick={fn()} styles={{ theme: 'light' }} />
      <Chip label="Dark" onClick={fn()} styles={{ theme: 'dark' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    type Rgb = { r: number; g: number; b: number; a: number }
    const parseRgb = (value: string): Rgb => {
      const match = value.match(/rgba?\(([^)]+)\)/)
      if (!match) throw new Error(`unparseable color: ${value}`)
      const parts = match[1].split(',').map(part => parseFloat(part.trim()))
      return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 }
    }
    const relLum = ({ r, g, b }: Rgb): number => {
      const channel = (c: number) => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    }
    const contrast = (x: Rgb, y: Rgb): number => {
      const lx = relLum(x)
      const ly = relLum(y)
      const hi = Math.max(lx, ly)
      const lo = Math.min(lx, ly)
      return (hi + 0.05) / (lo + 0.05)
    }

    // Resolve the effective --chip-focus color by inheriting it onto a probe.
    const resolveFocus = (chip: HTMLElement): Rgb => {
      const probe = document.createElement('span')
      probe.style.color = 'var(--chip-focus)'
      chip.appendChild(probe)
      const color = getComputedStyle(probe).color
      chip.removeChild(probe)
      return parseRgb(color)
    }

    const [lightChip, darkChip] = Array.from(
      canvasElement.querySelectorAll('[data-component="Chip"]')
    ) as HTMLElement[]

    // Light theme: the ring sits over a white / near-white page surface.
    const lightRing = resolveFocus(lightChip)
    await expect(lightRing.a).toBe(1)
    await expect(
      contrast(lightRing, { r: 255, g: 255, b: 255, a: 1 })
    ).toBeGreaterThanOrEqual(3)

    // Dark theme: the ring sits over a dark page surface (≈ #111827).
    const darkRing = resolveFocus(darkChip)
    await expect(darkRing.a).toBe(1)
    await expect(
      contrast(darkRing, { r: 17, g: 24, b: 39, a: 1 })
    ).toBeGreaterThanOrEqual(3)
  },
}

/**
 * Pins the reduced-motion contract (WCAG 2.3.3): the module carries a
 * `@media (prefers-reduced-motion: reduce)` block that zeroes the chip's
 * color/border/shadow transitions on `.root` and `.closeButton`. A play
 * function can't force the OS preference, so rather than emulate the media
 * state this asserts the rule itself is present in the CSSOM and targets the
 * chip root — if the `@media` block is deleted, the assertion fails, catching a
 * silent regression of the fix.
 */
export const ReducedMotion: Story = {
  name: 'A11y/Reduced Motion',
  args: {
    label: 'Reduced Motion',
    onClick: fn(),
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chip = canvas
      .getByText('Reduced Motion')
      .closest('[data-component="Chip"]') as HTMLElement | null
    await expect(chip).not.toBeNull()

    // The hashed CSS-module class for `.root` (e.g. "Chip_root__ab12c") — used
    // to confirm the reduced-motion rule targets the chip specifically.
    const rootClass =
      Array.from(chip?.classList ?? []).find(cls => cls.includes('root')) ?? ''
    await expect(rootClass).not.toBe('')

    // Scan the CSSOM for the `@media (prefers-reduced-motion: reduce)` rule that
    // zeroes the chip root's transition.
    let hasReducedMotionRule = false
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRule[]
      try {
        rules = Array.from(sheet.cssRules)
      } catch {
        continue // cross-origin sheet — not introspectable, skip
      }
      for (const rule of rules) {
        const media = (rule as CSSMediaRule).media
        if (
          media &&
          media.mediaText.includes('prefers-reduced-motion') &&
          rule.cssText.includes(rootClass) &&
          /transition:\s*none/i.test(rule.cssText)
        ) {
          hasReducedMotionRule = true
        }
      }
    }
    await expect(hasReducedMotionRule).toBe(true)
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'sacred' } },
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
  globals: { backgrounds: { value: 'sacred' } },
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
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// Customization Stories
// --------------------------------------------------------------------------

/**
 * A chip with custom colors via the styling API. Uses an accessible pairing —
 * the dark-green text grade #15803d on the translucent green fill reads 4.52:1
 * on white (the raw #22c55e brand green would be only ~2.1:1 there).
 */
export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  args: {
    label: 'Custom Colors',
    onDelete: fn(),
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
      borderColor: 'rgba(34, 197, 94, 0.35)',
      color: '#15803d',
      hoverBackgroundColor: 'rgba(34, 197, 94, 0.18)',
      hoverBorderColor: 'rgba(34, 197, 94, 0.45)',
    },
  },
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
 * warn / danger / neutral / gold), side-by-side on the sacred near-black
 * backdrop (the pills carry no `theme`, so they render sacred-default, and the
 * tone text bases are tuned to clear 4.5:1 there) — the shipped replacement
 * for the deleted StatusPill / StatusBadge / Pill
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
  globals: { backgrounds: { value: 'sacred' } },
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

/**
 * A clickable `variant="pill"`. Passing `onClick` promotes the pill to a real
 * `role="button"`; because it is now a pointer target it must clear the WCAG
 * 2.5.8 (AA 2.2) 24 CSS-px minimum height, unlike the resting compact 22px
 * read-only status pill. The play function pins the button role and the 24px
 * target height.
 */
export const InteractivePill: Story = {
  name: 'Variants/Interactive Pill',
  args: {
    variant: 'pill',
    tone: 'info',
    label: 'Toggle',
    onClick: fn(),
  },
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pill = canvas.getByRole('button', { name: 'Toggle' })

    // Clickable → real button and a ≥24px-tall pointer target (WCAG 2.5.8).
    await expect(pill).toHaveAttribute('data-chip-clickable', 'true')
    await expect(pill.getBoundingClientRect().height).toBeGreaterThanOrEqual(24)
  },
}

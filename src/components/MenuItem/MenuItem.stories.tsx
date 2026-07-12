/**
 * @fileoverview Storybook stories for the MenuItem component.
 * MenuItem renders a native <option> element and is designed to be used as a
 * child of the Select component. These stories showcase its themes and the
 * dense / divider / disabled / selected states, both standalone (inside a bare
 * <select> for context) and composed inside the Select component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import MenuItem from './index'
import Select from '../Select'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dense: { control: 'boolean' },
    divider: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    value: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, and font',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MenuItem>

// A controlled Select wrapper so MenuItem children render in their natural
// container context.
const SelectWithState = ({
  initialValue = '',
  theme = 'light',
  children,
}: {
  initialValue?: string
  theme?: 'light' | 'dark' | 'sacred'
  children: React.ReactNode
}) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Select
      styles={{ theme }}
      value={value}
      onChange={event => setValue(event.target.value)}
    >
      {children}
    </Select>
  )
}

// --------------------------------------------------------------------------
// BASIC THEME STORIES (rendered inside a Select for realistic context)
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" styles={{ theme: 'light' }}>
        TypeScript
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <SelectWithState theme="dark">
      <MenuItem value="usa" styles={{ theme: 'dark' }}>
        United States
      </MenuItem>
      <MenuItem value="canada" styles={{ theme: 'dark' }}>
        Canada
      </MenuItem>
      <MenuItem value="uk" styles={{ theme: 'dark' }}>
        United Kingdom
      </MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SelectWithState theme="sacred">
      <MenuItem value="ankh" styles={{ theme: 'sacred' }}>
        Ankh
      </MenuItem>
      <MenuItem value="eye" styles={{ theme: 'sacred' }}>
        Eye of Horus
      </MenuItem>
      <MenuItem value="scarab" styles={{ theme: 'sacred' }}>
        Scarab
      </MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SELECTED STATE
// --------------------------------------------------------------------------

export const Selected: Story = {
  render: () => (
    <SelectWithState theme="light" initialValue="typescript">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" selected styles={{ theme: 'light' }}>
        TypeScript (selected)
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// SELECTED STATE — PROGRAMMATICALLY EXPOSED VIA NATIVE SELECTION (a11y regression)
// --------------------------------------------------------------------------

/**
 * The selected state must not be conveyed by color alone (WCAG 1.4.1), and it
 * isn't: the parent Select renders a native `<select value>`, so the browser
 * maps the value-selected option into the accessibility tree and announces it
 * to assistive tech natively — no author `aria-selected` needed (or wanted) on
 * the `<option>`. When the visual `selected` prop is aligned with the select's
 * `value` (the intended use), this story pins that (a) the native selection is
 * the value-selected option, (b) the `data-selected` test hook is preserved,
 * (c) MenuItem does NOT emit a decoupled author `aria-selected` (which the
 * browser would ignore when aligned and which becomes a false announcement when
 * NOT aligned — see SelectedDecoupledFromValue below), and (d) the selected
 * highlight is NOT conveyed by color alone (WCAG 1.4.1): the selected item
 * carries a heavier font weight than its unselected siblings.
 */
export const SelectedStateAnnounced: Story = {
  render: () => (
    <SelectWithState theme="light" initialValue="typescript">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" selected styles={{ theme: 'light' }}>
        TypeScript (selected)
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Programmatic exposure is the NATIVE selection: the <select> reports the
    // value-selected option, which the browser announces to screen readers.
    await expect(canvas.getByRole('combobox')).toHaveValue('typescript')
    const selectedOption = canvas.getByText('TypeScript (selected)')
    // Machine-test selector contract preserved.
    await expect(selectedOption).toHaveAttribute('data-selected', 'true')
    // No decoupled author ARIA on the native option — native selection is the
    // single source of truth (regression guard for the review fix).
    await expect(selectedOption).not.toHaveAttribute('aria-selected')
    const unselectedOption = canvas.getByText('JavaScript')
    await expect(unselectedOption).not.toHaveAttribute('aria-selected')
    // WCAG 1.4.1 (Use of Color): the selected highlight is not color-alone — the
    // `.root[data-selected='true']` rule applies a heavier font weight, so the
    // selected item is distinguishable from its siblings independent of hue /
    // luminance. Computed style reflects the matched cascade even though a native
    // <option>'s painting is OS-controlled, so this is a deterministic guard that
    // the non-color affordance stays in place.
    expect(
      Number(getComputedStyle(selectedOption).fontWeight)
    ).toBeGreaterThanOrEqual(600)
    expect(Number(getComputedStyle(unselectedOption).fontWeight)).toBeLessThan(
      600
    )
  },
}

// --------------------------------------------------------------------------
// SELECTED PROP DECOUPLED FROM VALUE — the hazard the fix must not reintroduce
// --------------------------------------------------------------------------

/**
 * Regression guard for the specific hazard flagged in review: the `selected`
 * VISUAL prop is decoupled from the select's actual `value`. Here the native
 * selection is "javascript" (via `initialValue`) while the `selected` prop is
 * placed on the "typescript" item. MenuItem must NOT mirror the decoupled prop
 * into `aria-selected="true"` — doing so would announce a second, FALSE
 * "selected" option (typescript) conflicting with the real native selection
 * (javascript). The play pins that: the native selection is javascript, the
 * decoupled item still exposes only the `data-selected` visual hook, and no
 * `aria-selected` is emitted on any option.
 */
export const SelectedDecoupledFromValue: Story = {
  render: () => (
    <SelectWithState theme="light" initialValue="javascript">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" selected styles={{ theme: 'light' }}>
        TypeScript (visually highlighted, NOT the value)
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The real, natively-announced selection is the value-selected option.
    await expect(canvas.getByRole('combobox')).toHaveValue('javascript')
    const highlighted = canvas.getByText(
      'TypeScript (visually highlighted, NOT the value)'
    )
    // Visual hook is present...
    await expect(highlighted).toHaveAttribute('data-selected', 'true')
    // ...but it must NOT falsely announce as selected to assistive tech.
    await expect(highlighted).not.toHaveAttribute('aria-selected')
    // And the true native selection carries no conflicting author ARIA either.
    await expect(canvas.getByText('JavaScript')).not.toHaveAttribute(
      'aria-selected'
    )
    // WCAG 1.4.1: even in this decoupled / misuse case the highlight is not
    // conveyed by color alone — the selected rule applies a heavier font weight,
    // so the visual affordance survives grayscale / color-vision-deficiency
    // rendering. (Programmatic AT exposure of a decoupled highlight is a consumer
    // responsibility: MenuItem cannot see the parent value, so asserting
    // aria-selected here would be a FALSE announcement — see index.tsx / R1.)
    expect(
      Number(getComputedStyle(highlighted).fontWeight)
    ).toBeGreaterThanOrEqual(600)
  },
}

// --------------------------------------------------------------------------
// REDUCED MOTION — WCAG 2.3.3 (regression guard for the transition-off fix)
// --------------------------------------------------------------------------

/**
 * A11y regression net for the `prefers-reduced-motion` fix (WCAG 2.3.3). `.root`
 * declares `transition: var(--goobs-transition-medium)` for its background/color
 * state changes; `MenuItem.module.css` carries an
 * `@media (prefers-reduced-motion: reduce)` block that zeroes that transition
 * (and any animation) so users who request reduced motion get instant state
 * changes and no animation.
 *
 * Chromatic cannot emulate `prefers-reduced-motion`, and a reduced-motion
 * MenuItem is pixel-identical to a normal one, so a visual diff can't protect
 * this. Instead the play asserts the guard RULE structurally in the CSSOM — it
 * fails if the media block that sets `transition: none` on the root class is ever
 * removed — plus a real behavioral check when the runner DOES request reduced
 * motion. This is the story the review flagged as missing.
 */
export const ReducedMotionGuard: Story = {
  name: 'A11y — Reduced-Motion Guard',
  render: () => (
    <SelectWithState theme="light" initialValue="typescript">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" selected styles={{ theme: 'light' }}>
        TypeScript (selected)
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const option = canvasElement.querySelector(
      '[data-component="MenuItem"]'
    ) as HTMLElement | null
    await expect(option).toBeInTheDocument()
    // The hashed CSS-module root class the media guard must target.
    const rootClass = option!.classList[0]
    if (!rootClass) throw new Error('MenuItem option has no root class')

    // Structural presence gate: some stylesheet must carry a
    // `@media (prefers-reduced-motion: reduce)` rule that sets `transition: none`
    // on the root class. getComputedStyle can't read a non-matching media query's
    // value, so walk the CSSOM directly. Cross-origin sheets throw on `.cssRules`
    // and are skipped.
    let hasReducedMotionGuard = false
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        continue // cross-origin sheet — not readable, skip
      }
      for (const rule of Array.from(rules)) {
        if (
          rule instanceof CSSMediaRule &&
          rule.media.mediaText.includes('prefers-reduced-motion') &&
          rule.media.mediaText.includes('reduce')
        ) {
          for (const inner of Array.from(rule.cssRules)) {
            if (
              inner instanceof CSSStyleRule &&
              inner.selectorText.includes(rootClass) &&
              /transition:\s*none/i.test(inner.cssText)
            ) {
              hasReducedMotionGuard = true
            }
          }
        }
      }
    }
    expect(hasReducedMotionGuard).toBe(true)

    // Behavioral gate when the environment actually requests reduced motion
    // (e.g. a runner configured to emulate it): the transition must be off.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expect(getComputedStyle(option!).transitionProperty).toBe('none')
    }
  },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const Disabled: Story = {
  name: 'Disabled Item',
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="available" styles={{ theme: 'light' }}>
        Available
      </MenuItem>
      <MenuItem value="unavailable" disabled styles={{ theme: 'light' }}>
        Unavailable (disabled)
      </MenuItem>
      <MenuItem value="also" styles={{ theme: 'light' }}>
        Also Available
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DENSE STATE
// --------------------------------------------------------------------------

export const Dense: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="a" dense styles={{ theme: 'light' }}>
        Dense item A
      </MenuItem>
      <MenuItem value="b" dense styles={{ theme: 'light' }}>
        Dense item B
      </MenuItem>
      <MenuItem value="c" dense styles={{ theme: 'light' }}>
        Dense item C
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DIVIDER STATE
// --------------------------------------------------------------------------

export const Divider: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="a" styles={{ theme: 'light' }}>
        First group item
      </MenuItem>
      <MenuItem value="b" divider styles={{ theme: 'light' }}>
        Item with divider
      </MenuItem>
      <MenuItem value="c" styles={{ theme: 'light' }}>
        Second group item
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM COLORS
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem
        value="a"
        styles={{
          theme: 'light',
          backgroundColor: 'rgba(255, 240, 245, 0.95)',
          textColor: 'rgba(139, 0, 139, 1)',
        }}
      >
        Custom styled item
      </MenuItem>
      <MenuItem value="b" styles={{ theme: 'light' }}>
        Default item
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Mixed-theme showcase on the light canvas: the dark and sacred blocks
          each get their own themed wrapper surface so their translucent /
          dark-designed controls and labels are measured against the backdrop
          they are designed for (sacred's control bg is rgba(0,0,0,0.4) — on a
          white canvas it composites to a failing mid-gray). */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <SelectWithState theme="light" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'light' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'light' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'light' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'light' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>

      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        {/* #9CA3AF on #111827 = 6.99:1 */}
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <SelectWithState theme="dark" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'dark' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'dark' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'dark' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'dark' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>

      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        {/* #FFD700 on #0e0e0e = 13.76:1; the sacred control bg rgba(0,0,0,0.4)
            composites over #0e0e0e to #080808, its rgba(255,255,255,0.9) text
            to #e6e6e6 = 16.05:1 */}
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <SelectWithState theme="sacred" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'sacred' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'sacred' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'sacred' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'sacred' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" styles={{ theme: 'light' }}>
        TypeScript
      </MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The MenuItem children render as native <option> elements within the
    // combobox, so their text is present in the DOM.
    await expect(canvas.getByRole('combobox')).toBeVisible()
    await expect(canvas.getByText('JavaScript')).toBeInTheDocument()
    await expect(canvas.getByText('TypeScript')).toBeInTheDocument()
  },
}

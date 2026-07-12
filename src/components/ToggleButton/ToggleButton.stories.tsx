/**
 * @fileoverview Storybook stories for the ToggleButton and ToggleButtonGroup components.
 * Demonstrates different states, themes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import { ToggleButton, ToggleButtonGroup } from './index'

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    value: { control: 'text' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ToggleButton>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/** A default toggle button with light theme. */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  args: {
    value: 'light',
    children: 'Light Theme',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A toggle button with dark theme. */
export const DarkTheme: Story = {
  args: {
    value: 'dark',
    children: 'Dark Theme',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  args: {
    value: 'sacred',
    children: 'Sacred Theme',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** A toggle button that is selected by default. */
export const SelectedByDefault: Story = {
  name: 'State/Selected by Default',
  args: {
    value: 'selected',
    children: 'Selected Button',
    selected: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A disabled toggle button that cannot be interacted with. */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ToggleButton
        value="disabled-light"
        disabled={true}
        styles={{ theme: 'light' }}
      >
        Disabled Light
      </ToggleButton>
      <ToggleButton
        value="disabled-dark"
        disabled={true}
        styles={{ theme: 'dark' }}
      >
        Disabled Dark
      </ToggleButton>
      <ToggleButton
        value="disabled-sacred"
        disabled={true}
        styles={{ theme: 'sacred' }}
      >
        Disabled Sacred
      </ToggleButton>
      <ToggleButton
        value="disabled-selected"
        disabled={true}
        selected={true}
        styles={{ theme: 'light' }}
      >
        Disabled Selected
      </ToggleButton>
    </div>
  ),
}

// --------------------------------------------------------------------------
// SIZE STORIES
// --------------------------------------------------------------------------

/** Toggle buttons in different sizes. */
export const Sizes: Story = {
  name: 'Sizes/All Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <ToggleButton value="small" size="small" styles={{ theme: 'light' }}>
        Small
      </ToggleButton>
      <ToggleButton value="medium" size="medium" styles={{ theme: 'light' }}>
        Medium
      </ToggleButton>
      <ToggleButton value="large" size="large" styles={{ theme: 'light' }}>
        Large
      </ToggleButton>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Small toggle buttons. */
export const Small: Story = {
  name: 'Sizes/Small',
  args: {
    value: 'small',
    children: 'Small Button',
    size: 'small',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Large toggle buttons. */
export const Large: Story = {
  name: 'Sizes/Large',
  args: {
    value: 'large',
    children: 'Large Button',
    size: 'large',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP STORIES
// --------------------------------------------------------------------------

const ToggleGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('option1')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="option1">Option 1</ToggleButton>
      <ToggleButton value="option2">Option 2</ToggleButton>
      <ToggleButton value="option3">Option 3</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Toggle button group with exclusive selection. */
export const ToggleGroup: Story = {
  name: 'Group/Exclusive Selection',
  render: () => <ToggleGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

const NonExclusiveGroupExample = () => {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={false}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Toggle button group with non-exclusive selection. */
export const NonExclusiveGroup: Story = {
  name: 'Group/Non-Exclusive Selection',
  render: () => <NonExclusiveGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// THEMED GROUP STORIES
// --------------------------------------------------------------------------

const DarkGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('view1')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'dark' }}
    >
      <ToggleButton value="view1">List View</ToggleButton>
      <ToggleButton value="view2">Grid View</ToggleButton>
      <ToggleButton value="view3">Card View</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Dark themed toggle button group. */
export const DarkGroup: Story = {
  name: 'Group/Dark Theme',
  render: () => <DarkGroupExample />,
  globals: { backgrounds: { value: 'dark' } },
}

const SacredGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('fire')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'sacred' }}
    >
      <ToggleButton value="fire">🔥 Fire</ToggleButton>
      <ToggleButton value="water">💧 Water</ToggleButton>
      <ToggleButton value="earth">🌍 Earth</ToggleButton>
      <ToggleButton value="air">💨 Air</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Sacred themed toggle button group. */
export const SacredGroup: Story = {
  name: 'Group/Sacred Theme',
  render: () => <SacredGroupExample />,
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SIZE GROUP STORIES
// --------------------------------------------------------------------------

const SmallGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('xs')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      size="small"
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="xs">XS</ToggleButton>
      <ToggleButton value="s">S</ToggleButton>
      <ToggleButton value="m">M</ToggleButton>
      <ToggleButton value="l">L</ToggleButton>
      <ToggleButton value="xl">XL</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Small sized toggle button group. */
export const SmallGroup: Story = {
  name: 'Group/Small Size',
  render: () => <SmallGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

const LargeGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('monthly')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      size="large"
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="weekly">Weekly</ToggleButton>
      <ToggleButton value="monthly">Monthly</ToggleButton>
      <ToggleButton value="yearly">Yearly</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Large sized toggle button group. */
export const LargeGroup: Story = {
  name: 'Group/Large Size',
  render: () => <LargeGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'light' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'light' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'light' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="option2"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="option1">Option 1</ToggleButton>
              <ToggleButton value="option2">Option 2</ToggleButton>
              <ToggleButton value="option3">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Dark Theme Section — dark surface so the translucent dark-theme
          tokens composite correctly (they read as light-gray on white). */}
      <div
        style={{ background: '#111827', padding: '1.5rem', borderRadius: '12px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#94a3b8',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'dark' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'dark' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'dark' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#94a3b8',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="view2"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'dark' }}
            >
              <ToggleButton value="view1">List</ToggleButton>
              <ToggleButton value="view2">Grid</ToggleButton>
              <ToggleButton value="view3">Card</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Sacred Theme Section — sacred (near-black) surface so the gold
          tokens composite correctly (gold-on-white is unreadable). */}
      <div
        style={{ background: '#0e0e0e', padding: '1.5rem', borderRadius: '12px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#FFD700',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'sacred' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'sacred' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'sacred' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#FFD700',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="fire"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'sacred' }}
            >
              <ToggleButton value="fire">🔥 Fire</ToggleButton>
              <ToggleButton value="water">💧 Water</ToggleButton>
              <ToggleButton value="earth">🌍 Earth</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Size Variations */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Size Variations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Small Size
            </p>
            <ToggleButtonGroup
              value="s"
              exclusive={true}
              onChange={() => {}}
              size="small"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="xs">XS</ToggleButton>
              <ToggleButton value="s">S</ToggleButton>
              <ToggleButton value="m">M</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Medium Size
            </p>
            <ToggleButtonGroup
              value="medium"
              exclusive={true}
              onChange={() => {}}
              size="medium"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="small">Small</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="large">Large</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Large Size
            </p>
            <ToggleButtonGroup
              value="monthly"
              exclusive={true}
              onChange={() => {}}
              size="large"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
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
  args: {
    value: 'test',
    children: 'Test Button',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByText('Test Button')

    // Check it's initially not selected
    await expect(button).toHaveAttribute('aria-pressed', 'false')

    // Click to select (note: this won't change state in isolated story)
    await userEvent.click(button)

    // Verify button is clickable and not disabled
    await expect(button).not.toBeDisabled()
  },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY — keyboard focus ring (WCAG 2.4.7) + labelled group (1.3.1)
// --------------------------------------------------------------------------

/**
 * Keyboard focus paints a visible `:focus-visible` ring (WCAG 2.4.7). The base
 * `.button` drops the UA outline for pointer users, so WITHOUT this rule a
 * keyboard user would have no focus indicator at all. The `play` moves real
 * keyboard focus (Tab) onto the button — a mouse click does NOT trigger
 * `:focus-visible` — so the light-theme blue ring is an actually-rendered
 * state the Chromatic snapshot captures; deleting the `.button:focus-visible`
 * rule changes this baseline.
 */
export const FocusRingLight: Story = {
  name: 'A11y/Focus Ring (Light, Keyboard)',
  args: {
    value: 'focus-light',
    children: 'Tab to Focus Me',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Tab to Focus Me' })
    // Keyboard focus (not a mouse click) is what activates :focus-visible.
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(button).toHaveAttribute('aria-pressed', 'false')
  },
}

/**
 * Gates the `[data-theme='dark']:focus-visible` outline-color override. Tabbed
 * to with the keyboard so the dark-theme blue ring paints for Chromatic;
 * deleting the dark override would change this baseline.
 */
export const FocusRingDark: Story = {
  name: 'A11y/Focus Ring (Dark, Keyboard)',
  args: {
    value: 'focus-dark',
    children: 'Tab to Focus Me',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Tab to Focus Me' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

/**
 * Gates the `[data-theme='sacred']:focus-visible` gold outline override.
 * Tabbed to with the keyboard so the sacred gold ring paints for Chromatic.
 */
export const FocusRingSacred: Story = {
  name: 'A11y/Focus Ring (Sacred, Keyboard)',
  args: {
    value: 'focus-sacred',
    children: 'Tab to Focus Me',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Tab to Focus Me' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

const LabelledGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('left')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
      aria-label="Text alignment"
    >
      <ToggleButton value="left">Left</ToggleButton>
      <ToggleButton value="center">Center</ToggleButton>
      <ToggleButton value="right">Right</ToggleButton>
    </ToggleButtonGroup>
  )
}

/**
 * The group renders `role="group"` with an accessible name (WCAG 1.3.1 /
 * 4.1.2) so assistive tech announces the cluster ("Text alignment, group")
 * before its toggle buttons — a bare `<div>` gave the set no programmatic
 * label. The `play` asserts the labelled group is queryable by role+name,
 * then tabs keyboard focus onto the first grouped button: its INSET
 * `:focus-visible` ring (`outline-offset:-2px` so the group's
 * `overflow:hidden` can't clip it) is captured by Chromatic. Deleting either
 * the `role="group"`/`aria-label` wiring or the `.group .button:focus-visible`
 * rule changes this baseline.
 */
export const LabelledGroupAndFocus: Story = {
  name: 'A11y/Labelled Group + Grouped Focus',
  render: () => <LabelledGroupExample />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // role="group" + aria-label make the cluster one named, announced set.
    const group = canvas.getByRole('group', { name: 'Text alignment' })
    await expect(group).toBeInTheDocument()
    // Keyboard focus lands on the first grouped button → drives the inset ring.
    await userEvent.tab()
    const firstButton = canvas.getByRole('button', { name: 'Left' })
    await expect(firstButton).toHaveFocus()
    // The selected member is programmatically pressed, not colour-only (1.4.1).
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true')
  },
}

const UnnamedGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('option1')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="option1">Option 1</ToggleButton>
      <ToggleButton value="option2">Option 2</ToggleButton>
    </ToggleButtonGroup>
  )
}

/**
 * `role="group"` is gated on an accessible name: a ToggleButtonGroup with
 * NEITHER `aria-label` nor `aria-labelledby` must NOT emit a nameless
 * `role="group"` (a contextless "group" announcement is AT noise). This
 * renders an unlabelled group and asserts no `group` role is exposed while the
 * member buttons remain present and individually announced (WCAG 1.3.1 /
 * 4.1.2). Reverting the gate (emitting `role="group"` unconditionally) makes
 * `queryByRole('group')` resolve and fails this story. Mirrors the sibling
 * `ButtonGroup`'s `UnnamedGroupHasNoRole`.
 */
export const UnnamedGroupHasNoRole: Story = {
  name: 'A11y/Unnamed Group Has No Role',
  render: () => <UnnamedGroupExample />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // No accessible name supplied → no group boundary in the a11y tree.
    await expect(canvas.queryByRole('group')).toBeNull()
    // The buttons themselves are still present and reachable.
    await expect(canvas.getByRole('button', { name: 'Option 1' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Option 2' })).toBeVisible()
  },
}

/**
 * Pins the reduced-motion guard (WCAG 2.3.3): the
 * `@media (prefers-reduced-motion: reduce)` block in ToggleButton.module.css
 * zeroes the button's `transition` and the sacred pressed `transform`
 * (`translateY(1px)` on `:active`). A play function can't force the media
 * query, so this reads the stylesheet directly — it finds the reduced-motion
 * `@media` rule and asserts it carries a rule zeroing `transition` for the
 * button class and an `:active` rule zeroing `transform`. Removing (or
 * un-zeroing) the guard block fails this story. Mirrors the sibling `Button`'s
 * `ReducedMotionZeroesTransition`.
 */
export const ReducedMotionZeroesTransition: Story = {
  name: 'A11y/Reduced Motion Zeroes Transition',
  args: {
    value: 'motion-safe',
    children: 'Motion-safe',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Motion-safe' })
    // The base CSS-module class for `.button` (first className token).
    const buttonClass = button.className.split(' ')[0]
    if (!buttonClass) throw new Error('button has no class')

    let mediaBlockFound = false
    let transitionZeroed = false
    let activeTransformZeroed = false

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList | null = null
      try {
        rules = sheet.cssRules
      } catch {
        // Cross-origin stylesheet — cssRules is inaccessible; skip it.
        continue
      }
      if (!rules) continue
      for (const rule of Array.from(rules)) {
        if (
          !(rule instanceof CSSMediaRule) ||
          !rule.media.mediaText.includes('prefers-reduced-motion')
        ) {
          continue
        }
        mediaBlockFound = true
        for (const inner of Array.from(rule.cssRules)) {
          if (!(inner instanceof CSSStyleRule)) continue
          if (!inner.selectorText.includes(buttonClass)) continue
          if (inner.style.transition === 'none') transitionZeroed = true
          if (
            inner.selectorText.includes(':active') &&
            inner.style.transform === 'none'
          ) {
            activeTransformZeroed = true
          }
        }
      }
    }

    await expect(mediaBlockFound).toBe(true)
    await expect(transitionZeroed).toBe(true)
    await expect(activeTransformZeroed).toBe(true)
  },
}

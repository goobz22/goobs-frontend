/**
 * @fileoverview Storybook stories for the refactored Button component.
 * These stories showcase the different themes, variants, and states of the Button,
 * demonstrating its usage with React and JSX.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Button, { ButtonGroup } from './index'
import SendIcon from '../Icons/Send'
import AddIcon from '../Icons/Add'
import DownloadIcon from '../Icons/Download'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    icon: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A primary button with light theme styling.
 */
export const LightTheme: Story = {
  args: {
    text: 'Light Button',
    styles: { theme: 'light' },
  },
}

/**
 * A primary button with dark theme styling.
 */
export const DarkTheme: Story = {
  args: {
    text: 'Dark Button',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Secondary variant: the neutral Cancel/Close palette from variantDefaults —
 * previously shipped with zero story coverage.
 */
export const SecondaryVariant: Story = {
  name: 'Variants/Secondary',
  args: {
    text: 'Cancel',
    variant: 'secondary',
  },
}

/**
 * Destructive variant: the irreversible-mutation (Delete) palette from
 * variantDefaults — previously shipped with zero story coverage.
 */
export const DestructiveVariant: Story = {
  name: 'Variants/Destructive',
  args: {
    text: 'Delete',
    variant: 'destructive',
  },
}

/**
 * outline: true renders a visible 1px currentcolor outline. Pins the fix for
 * the inversion where `outline: true` mapped to CSS `outline: none`.
 */
export const WithOutline: Story = {
  name: 'Variants/With Outline',
  args: {
    text: 'Outlined Button',
    styles: { theme: 'light', outline: true },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A button with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  args: {
    text: 'Sacred Button',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// ICON STORIES
// --------------------------------------------------------------------------

/**
 * A button with an icon positioned to the left of the text.
 */
export const WithIconLeft: Story = {
  name: 'Icon/Left',
  args: {
    text: 'Send',
    icon: <SendIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'light', iconLocation: 'left' },
  },
}

/**
 * A button with an icon positioned to the right of the text.
 */
export const WithIconRight: Story = {
  name: 'Icon/Right',
  args: {
    text: 'Download',
    icon: <DownloadIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'light', iconLocation: 'right' },
  },
}

/**
 * A button with an icon positioned above the text.
 */
export const WithIconAbove: Story = {
  name: 'Icon/Above',
  args: {
    text: 'Add Item',
    icon: <AddIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'light', iconLocation: 'above' },
  },
}

/**
 * A button that only contains an icon. An icon-only button has no text to name
 * it, so it MUST carry an `aria-label` (passed through to the native
 * `<button>`) — otherwise assistive tech announces an anonymous "button"
 * (WCAG 4.1.2). The play function pins that the accessible name resolves.
 */
export const IconOnly: Story = {
  name: 'Icon/Only',
  args: {
    icon: <SendIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'light' },
    'aria-label': 'Send',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Resolves ONLY if the aria-label supplies the accessible name.
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * A button in the disabled state.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        text="Disabled Light"
        styles={{ theme: 'light', disabled: true }}
      />
      <Button text="Disabled Dark" styles={{ theme: 'dark', disabled: true }} />
      <Button
        text="Disabled Sacred"
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

/**
 * A button with custom outline styling.
 */
export const OutlineStates: Story = {
  name: 'State/Outline',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button text="Outline Light" styles={{ theme: 'light', outline: true }} />
      <Button text="Outline Dark" styles={{ theme: 'dark', outline: true }} />
      <Button
        text="Outline Sacred"
        styles={{ theme: 'sacred', outline: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

/**
 * Custom colors and styling.
 */
export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    text: 'Custom Button',
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(147, 51, 234, 1)',
      color: 'white',
      borderColor: 'rgba(147, 51, 234, 1)',
      hoverBackgroundColor: 'rgba(126, 34, 206, 1)',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

/**
 * A story to test interaction and accessibility.
 */
export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button text="Enabled" styles={{ theme: 'light' }} />
      <Button text="Disabled" styles={{ theme: 'light', disabled: true }} />
      <Button text="Click Me" styles={{ theme: 'light' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Query the <button> elements by role, NOT getByText: getByText
    // returns the label <span>, and jest-dom's toBeDisabled only ever
    // passes on an element that can itself be disabled (form elements),
    // so asserting on the span failed deterministically — and
    // toBeEnabled on a span passes vacuously, asserting nothing.
    const enabledButton = canvas.getByRole('button', { name: 'Enabled' })
    const disabledButton = canvas.getByRole('button', { name: 'Disabled' })
    const clickMeButton = canvas.getByRole('button', { name: 'Click Me' })

    // Test that the enabled button is interactive
    await userEvent.hover(enabledButton)
    await userEvent.click(enabledButton)
    await expect(enabledButton).toBeEnabled()

    // Test that the disabled button is not interactive
    await expect(disabledButton).toBeDisabled()

    // Test a specific click interaction
    await userEvent.click(clickMeButton)
  },
}

// New stories for ButtonGroup

export const LightThemeGroup: Story = {
  name: 'Group/Light Theme',
  // Light-themed content on the light canvas: the light `.selected`
  // background is a translucent blue tint (--goobs-blue-a08) that
  // composites over the page canvas — over the default sacred #0e0e0e
  // canvas it produced #121721 behind #374151 text (1.74:1); over the
  // intended light canvas it composites to #eff5fe (9.41:1).
  globals: { backgrounds: { value: 'light' } },
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'light' }}
        >
          <Button
            value="send"
            text="Send"
            icon={<SendIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="add"
            text="Add"
            icon={<AddIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="download"
            text="Download"
            icon={<DownloadIcon styles={{ theme: 'sacred' }} />}
          />
        </ButtonGroup>
      )
    }
    return <Component />
  },
}

export const DarkThemeGroup: Story = {
  name: 'Group/Dark Theme',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'dark' }}
        >
          <Button
            value="send"
            text="Send"
            icon={<SendIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="add"
            text="Add"
            icon={<AddIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="download"
            text="Download"
            icon={<DownloadIcon styles={{ theme: 'sacred' }} />}
          />
        </ButtonGroup>
      )
    }
    return <Component />
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredThemeGroup: Story = {
  name: 'Group/Sacred Theme',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'sacred' }}
        >
          <Button
            value="send"
            text="Send"
            icon={<SendIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="add"
            text="Add"
            icon={<AddIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="download"
            text="Download"
            icon={<DownloadIcon styles={{ theme: 'sacred' }} />}
          />
        </ButtonGroup>
      )
    }
    return <Component />
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const InteractiveGroupDemo: Story = {
  name: 'Group/Interactive Demo',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            background: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          <select
            value={theme}
            onChange={e =>
              setTheme(e.target.value as 'light' | 'dark' | 'sacred')
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sacred">Sacred</option>
          </select>
          <ButtonGroup
            value={value}
            exclusive
            onChange={(_, newValue) => newValue && setValue(newValue)}
            styles={{ theme }}
            aria-label="Action"
          >
            <Button
              value="send"
              aria-label="Send"
              icon={<SendIcon styles={{ theme: 'sacred' }} />}
            />
            <Button
              value="add"
              aria-label="Add"
              icon={<AddIcon styles={{ theme: 'sacred' }} />}
            />
            <Button
              value="download"
              aria-label="Download"
              icon={<DownloadIcon styles={{ theme: 'sacred' }} />}
            />
          </ButtonGroup>
        </div>
      )
    }
    return <Component />
  },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY REGRESSION STORIES (2026-07-11 a11y audit)
// --------------------------------------------------------------------------

/**
 * Selected state is exposed as a real toggle-button state, not colour alone:
 * a `selected` Button emits `aria-pressed` so assistive tech announces the
 * pressed state (WCAG 1.4.1 / 4.1.2). Also captures the focus ring for
 * Chromatic — the play function moves keyboard focus onto the button.
 */
export const SelectedTogglePressed: Story = {
  name: 'A11y/Selected → aria-pressed',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button text="Unselected" styles={{ theme: 'light' }} selected={false} />
      <Button text="Selected" styles={{ theme: 'light' }} selected />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selected = canvas.getByRole('button', { name: 'Selected' })
    const unselected = canvas.getByRole('button', { name: 'Unselected' })
    await expect(selected).toHaveAttribute('aria-pressed', 'true')
    await expect(unselected).toHaveAttribute('aria-pressed', 'false')
    // Keyboard focus lands and the button is focusable (drives :focus-visible,
    // which the Chromatic snapshot captures as the visible ring).
    await userEvent.tab()
    await expect(unselected).toHaveFocus()
  },
}

/**
 * A plain Button that is NOT a toggle must not leak toggle semantics: with no
 * `selected` prop it emits no `aria-pressed`, so assistive tech announces a
 * normal command button (WCAG 4.1.2).
 */
export const PlainButtonHasNoPressedState: Story = {
  name: 'A11y/Plain button (no aria-pressed)',
  args: { text: 'Just a button', styles: { theme: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Just a button' })
    await expect(button).not.toHaveAttribute('aria-pressed')
  },
}

/**
 * ButtonGroup is a labelled group of toggle buttons: the container exposes
 * `role="group"` + its `aria-label`, and the child whose `value` matches is
 * `aria-pressed="true"` while the others are `false` (WCAG 1.3.1 / 4.1.2).
 * The decorative icons inside labelled buttons are hidden from AT, so the
 * accessible name stays clean.
 */
export const GroupToggleSemantics: Story = {
  name: 'A11y/Group role + pressed',
  globals: { backgrounds: { value: 'light' } },
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'light' }}
          aria-label="View mode"
        >
          <Button
            value="send"
            text="Send"
            icon={<SendIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="add"
            text="Add"
            icon={<AddIcon styles={{ theme: 'sacred' }} />}
          />
          <Button
            value="download"
            text="Download"
            icon={<DownloadIcon styles={{ theme: 'sacred' }} />}
          />
        </ButtonGroup>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The container is an accessibly-named group.
    const group = canvas.getByRole('group', { name: 'View mode' })
    await expect(group).toBeInTheDocument()
    // Selected child is pressed; a sibling is not.
    const send = canvas.getByRole('button', { name: 'Send' })
    const add = canvas.getByRole('button', { name: 'Add' })
    await expect(send).toHaveAttribute('aria-pressed', 'true')
    await expect(add).toHaveAttribute('aria-pressed', 'false')
    // Selecting another child moves the pressed state.
    await userEvent.click(add)
    await expect(add).toHaveAttribute('aria-pressed', 'true')
    await expect(send).toHaveAttribute('aria-pressed', 'false')
  },
}

/**
 * A decorative icon is hidden from assistive tech ONLY when the button also has
 * a text label; an icon-ONLY button must keep its icon exposed (hiding it would
 * leave the button nameless). This pins BOTH branches of the `hasLabel`
 * conditional (`index.tsx:625`): the accessible-name query can't see the change
 * (the goobs `<svg>` carries no role/name, so it never contributes to the name
 * either way), so these assertions read the `aria-hidden` attribute directly —
 * reverting either branch of the fix fails this story (WCAG 1.1.1 / 4.1.2).
 */
export const DecorativeIconHiddenFromAT: Story = {
  name: 'A11y/Decorative icon hidden',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Labelled: the icon is decorative → its wrapper is aria-hidden. */}
      <Button
        text="Send"
        icon={<SendIcon styles={{ theme: 'sacred' }} />}
        styles={{ theme: 'light' }}
      />
      {/* Icon-only: the icon is the button's meaning → NOT aria-hidden; the
          accessible name comes from aria-label. */}
      <Button
        aria-label="Add item"
        icon={<AddIcon styles={{ theme: 'sacred' }} />}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Labelled button: the icon wrapper hides the decorative svg from AT.
    const labelled = canvas.getByRole('button', { name: 'Send' })
    const hiddenIcon = labelled.querySelector('span[aria-hidden="true"] svg')
    await expect(hiddenIcon).toBeInTheDocument()

    // Icon-only button: the icon wrapper must NOT be hidden.
    const iconOnly = canvas.getByRole('button', { name: 'Add item' })
    const exposedSvg = iconOnly.querySelector('svg')
    await expect(exposedSvg).toBeInTheDocument()
    await expect(exposedSvg?.closest('span')).not.toHaveAttribute('aria-hidden')
  },
}

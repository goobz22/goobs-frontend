/**
 * @fileoverview Storybook stories for the Select component.
 * These stories showcase the various states, themes, variants, sizes, and
 * styling capabilities of the native-backed Select. Options are supplied as
 * MenuItem children (which render as <option> elements).
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Select from './index'
import MenuItem from '../MenuItem'

// Wrapper component for state management. Select is controlled — the native
// onChange forwards the DOM event, so we read `event.target.value`.
const SelectWithState = ({
  initialValue = '',
  ...props
}: React.ComponentProps<typeof Select> & { initialValue?: string }) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Select
      {...props}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  )
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'outlined', 'filled'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
    },
    fullWidth: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    displayEmpty: { control: 'boolean' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
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
type Story = StoryObj<typeof Select>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <SelectWithState styles={{ theme: 'light' }} displayEmpty>
      <MenuItem value="javascript">JavaScript</MenuItem>
      <MenuItem value="typescript">TypeScript</MenuItem>
      <MenuItem value="react">React</MenuItem>
      <MenuItem value="nodejs">Node.js</MenuItem>
    </SelectWithState>
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <SelectWithState styles={{ theme: 'dark' }} displayEmpty>
      <MenuItem value="usa">United States</MenuItem>
      <MenuItem value="canada">Canada</MenuItem>
      <MenuItem value="uk">United Kingdom</MenuItem>
      <MenuItem value="japan">Japan</MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SelectWithState styles={{ theme: 'sacred' }} displayEmpty>
      <MenuItem value="ankh">Ankh</MenuItem>
      <MenuItem value="eye">Eye of Horus</MenuItem>
      <MenuItem value="scarab">Scarab</MenuItem>
      <MenuItem value="djed">Djed Pillar</MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// VARIANTS
// --------------------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectWithState variant="outlined" styles={{ theme: 'light' }}>
        <MenuItem value="a">Outlined (default)</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState variant="standard" styles={{ theme: 'light' }}>
        <MenuItem value="a">Standard</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState variant="filled" styles={{ theme: 'light' }}>
        <MenuItem value="a">Filled</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
    </div>
  ),
  // All three selects are light-themed; the translucent light `filled`
  // variant needs the light canvas (it composites to near-black on the
  // default sacred canvas, hiding its dark text).
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// SIZES
// --------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectWithState size="medium" styles={{ theme: 'light' }}>
        <MenuItem value="a">Medium (default)</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState size="small" styles={{ theme: 'light' }}>
        <MenuItem value="a">Small</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
    </div>
  ),
}

// --------------------------------------------------------------------------
// FULL WIDTH
// --------------------------------------------------------------------------

export const FullWidth: Story = {
  render: () => (
    <SelectWithState fullWidth styles={{ theme: 'light' }}>
      <MenuItem value="a">Spans the full container width</MenuItem>
      <MenuItem value="b">Option B</MenuItem>
      <MenuItem value="c">Option C</MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// WITH VALUE (pre-selected)
// --------------------------------------------------------------------------

export const WithValue: Story = {
  render: () => (
    <SelectWithState initialValue="typescript" styles={{ theme: 'light' }}>
      <MenuItem value="javascript">JavaScript</MenuItem>
      <MenuItem value="typescript">TypeScript</MenuItem>
      <MenuItem value="react">React</MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DISPLAY EMPTY (placeholder option)
// --------------------------------------------------------------------------

export const DisplayEmpty: Story = {
  name: 'Display Empty Placeholder',
  render: () => (
    <SelectWithState displayEmpty styles={{ theme: 'light' }}>
      <MenuItem value="javascript">JavaScript</MenuItem>
      <MenuItem value="typescript">TypeScript</MenuItem>
      <MenuItem value="react">React</MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// ERROR STATE
// --------------------------------------------------------------------------

export const ErrorState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectWithState error styles={{ theme: 'light' }}>
        <MenuItem value="a">Light with error</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState error styles={{ theme: 'dark' }}>
        <MenuItem value="a">Dark with error</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState styles={{ theme: 'light', helperTextType: 'error' }}>
        <MenuItem value="a">Helper-error styling</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
    </div>
  ),
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectWithState initialValue="a" disabled styles={{ theme: 'light' }}>
        <MenuItem value="a">Disabled Light</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState initialValue="a" disabled styles={{ theme: 'dark' }}>
        <MenuItem value="a">Disabled Dark</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState initialValue="a" disabled styles={{ theme: 'sacred' }}>
        <MenuItem value="a">Disabled Sacred</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
    </div>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM COLORS
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <SelectWithState
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 240, 245, 0.95)',
        borderColor: 'rgba(255, 20, 147, 0.4)',
        borderFocusedColor: 'rgba(255, 20, 147, 1)',
        textColor: 'rgba(139, 0, 139, 1)',
      }}
    >
      <MenuItem value="a">Custom styled option</MenuItem>
      <MenuItem value="b">Option B</MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  // Mixed-theme story: each column sits on its OWN theme surface (light
  // canvas + dark #111827 / sacred #0e0e0e wrapper blocks) so the
  // translucent dark/sacred controls and their labels keep WCAG contrast
  // instead of compositing against the white canvas.
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SelectWithState styles={{ theme: 'light' }} displayEmpty>
            <MenuItem value="a">Basic Light</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState error styles={{ theme: 'light' }}>
            <MenuItem value="a">With Error</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState size="small" styles={{ theme: 'light' }}>
            <MenuItem value="a">Small Size</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
        </div>
      </div>

      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SelectWithState styles={{ theme: 'dark' }} displayEmpty>
            <MenuItem value="a">Basic Dark</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState variant="filled" styles={{ theme: 'dark' }}>
            <MenuItem value="a">Filled Dark</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState fullWidth styles={{ theme: 'dark' }}>
            <MenuItem value="a">Full Width Dark</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
        </div>
      </div>

      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SelectWithState styles={{ theme: 'sacred' }} displayEmpty>
            <MenuItem value="a">Sacred Selection</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState error styles={{ theme: 'sacred' }}>
            <MenuItem value="a">Sacred Error</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
          <SelectWithState
            initialValue="a"
            disabled
            styles={{ theme: 'sacred' }}
          >
            <MenuItem value="a">Sacred Disabled</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </SelectWithState>
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
  render: () => (
    <SelectWithState styles={{ theme: 'light' }}>
      <MenuItem value="javascript">JavaScript</MenuItem>
      <MenuItem value="typescript">TypeScript</MenuItem>
      <MenuItem value="react">React</MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')

    // Initial state
    expect(select).toBeVisible()

    // Select an option and confirm the controlled value updates
    await userEvent.selectOptions(select, 'typescript')
    await expect(select).toHaveValue('typescript')
  },
}

// --------------------------------------------------------------------------
// KEYBOARD FOCUS (a11y) — the native <select> is reachable by Tab and, once
// focused, shows the :focus-visible ring added in Select.module.css (WCAG
// 2.4.7). The native element is exposed with the implicit `combobox` role.
// --------------------------------------------------------------------------

export const KeyboardFocus: Story = {
  name: 'Keyboard Focus (a11y)',
  render: () => (
    <SelectWithState styles={{ theme: 'light' }}>
      <MenuItem value="javascript">JavaScript</MenuItem>
      <MenuItem value="typescript">TypeScript</MenuItem>
      <MenuItem value="react">React</MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')

    // Reachable and operable by keyboard alone (WCAG 2.1.1).
    await userEvent.tab()
    await expect(select).toHaveFocus()
  },
}

// --------------------------------------------------------------------------
// ERROR ANNOUNCED (a11y) — the invalid state is conveyed programmatically via
// aria-invalid, not by border colour alone (WCAG 1.4.1 / 4.1.2), so assistive
// tech announces the field as invalid. BOTH independent error-styling paths —
// the boolean `error` prop AND `styles.helperTextType: 'error'` (each paints
// the red "invalid" border) — must set aria-invalid; a plain select must NOT.
// --------------------------------------------------------------------------

export const ErrorAnnounced: Story = {
  name: 'Error Announced (aria-invalid)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectWithState error styles={{ theme: 'light' }}>
        <MenuItem value="a">Invalid selection (error prop)</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState styles={{ theme: 'light', helperTextType: 'error' }}>
        <MenuItem value="a">Invalid selection (helper-error)</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
      <SelectWithState styles={{ theme: 'light' }}>
        <MenuItem value="a">Valid selection</MenuItem>
        <MenuItem value="b">Option B</MenuItem>
      </SelectWithState>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [errorPropSelect, helperErrorSelect, validSelect] =
      canvas.getAllByRole('combobox')

    // BOTH error-styling paths announce the invalid state: the boolean `error`
    // prop AND the `helperTextType: 'error'` styling path (each paints the red
    // "invalid" border, so each must expose aria-invalid — WCAG 1.4.1 / 4.1.2).
    await expect(errorPropSelect).toHaveAttribute('aria-invalid', 'true')
    await expect(helperErrorSelect).toHaveAttribute('aria-invalid', 'true')
    // The valid field carries neither error signal and omits the attribute.
    await expect(validSelect).not.toHaveAttribute('aria-invalid')
  },
}

// --------------------------------------------------------------------------
// ACCESSIBLE NAME (a11y) — a native <select> gets NO accessible name from its
// `name` attribute (that is for form submission, not the a11y tree), so a
// screen reader would announce a nameless "combobox". This primitive does not
// (and must not) invent a name; instead it forwards every naming mechanism —
// `aria-label`, `aria-labelledby`, and `id` (for an external `<label htmlFor>`)
// — straight through the `{...props}` spread onto the real <select> (WCAG 4.1.2
// Name, Role, Value / 3.3.2 Labels or Instructions). This story pins BOTH
// primary mechanisms so the labelability contract is regression-gated, not just
// asserted in prose — it fails if a future change stops threading these props
// to the native control.
// --------------------------------------------------------------------------

export const AccessibleName: Story = {
  name: 'Accessible Name (a11y)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Mechanism 1 — aria-label supplied directly on the control. */}
      <SelectWithState aria-label="Favorite framework" styles={{ theme: 'light' }}>
        <MenuItem value="react">React</MenuItem>
        <MenuItem value="vue">Vue</MenuItem>
        <MenuItem value="svelte">Svelte</MenuItem>
      </SelectWithState>
      {/* Mechanism 2 — a real, programmatically associated <label> via
          htmlFor + id (the id threads through {...props} to the <select>). */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label htmlFor="fav-language-select">Favorite language</label>
        <SelectWithState id="fav-language-select" styles={{ theme: 'light' }}>
          <MenuItem value="ts">TypeScript</MenuItem>
          <MenuItem value="rust">Rust</MenuItem>
          <MenuItem value="go">Go</MenuItem>
        </SelectWithState>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Each control resolves a computable accessible NAME via the mechanism it
    // was given: the forwarded aria-label for the first, the associated
    // <label> for the second (WCAG 4.1.2). Querying by role AND name proves the
    // name is exposed to assistive tech, not merely present in the DOM.
    await expect(
      canvas.getByRole('combobox', { name: 'Favorite framework' })
    ).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Favorite language' })
    ).toBeVisible()
  },
}

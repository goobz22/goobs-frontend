/**
 * @fileoverview Storybook stories for the Divider component.
 * Demonstrates themes, with/without content, disabled state, orientation, and custom styling.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import Divider from './index'

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, orientation, colors, and layout',
    },
    children: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  // A horizontal divider is width:100% of its container; the bare `centered`
  // layout gives it no width, collapsing the rule to 0. Wrap stories in a
  // fixed-width block so the rule is actually visible (mirrors real usage,
  // where a Divider sits inside a sized container).
  decorators: [
    Story => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Divider>

// ---------------------------------------------------------------------------
// BASIC THEME STORIES
// ---------------------------------------------------------------------------

export const LightTheme: Story = {
  args: {
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  args: {
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  args: {
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// ---------------------------------------------------------------------------
// CONTENT VARIANTS
// ---------------------------------------------------------------------------

export const WithText: Story = {
  name: 'Content/With Text',
  args: {
    children: 'OR',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const WithoutText: Story = {
  name: 'Content/Without Text',
  args: {
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// ---------------------------------------------------------------------------
// STATE STORIES
// ---------------------------------------------------------------------------

export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '480px',
      }}
    >
      {/* Mixed-theme showcase on the sacred canvas: each block carries its own
          themed surface so its labels stay readable (light block would otherwise
          inherit near-black text on the near-black canvas). */}
      <div style={{ background: '#ffffff', padding: '0.5rem' }}>
        <span style={{ color: '#1f2937' }}>Section A</span>
        <Divider styles={{ theme: 'light', disabled: true }} />
        <span style={{ color: '#1f2937' }}>Section B</span>
      </div>
      <div style={{ background: '#0f172a', padding: '0.5rem' }}>
        <span style={{ color: '#cbd5e1' }}>Section A</span>
        <Divider styles={{ theme: 'dark', disabled: true }} />
        <span style={{ color: '#cbd5e1' }}>Section B</span>
      </div>
      <div style={{ background: '#0a0a0a', padding: '0.5rem' }}>
        <span style={{ color: '#FFD700' }}>Section A</span>
        <Divider styles={{ theme: 'sacred', disabled: true }} />
        <span style={{ color: '#FFD700' }}>Section B</span>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// ORIENTATION
// ---------------------------------------------------------------------------

export const VerticalOrientation: Story = {
  name: 'Orientation/Vertical',
  // Light-themed demo content (default near-black text, light border) —
  // pin the light canvas so it doesn't inherit the sacred #0e0e0e default.
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        height: '120px',
        padding: '0.5rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      <span>Left content</span>
      <Divider
        styles={{ theme: 'light', orientation: 'vertical', height: '80px' }}
      />
      <span>Right content</span>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// CUSTOM STYLING
// ---------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    children: 'Custom',
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      color: '#6b21a8',
      height: '2px',
      margin: '24px 0',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const SpacingExamples: Story = {
  name: 'Styling/Spacing Examples',
  // Light-themed demo content (default near-black text) — pin the light
  // canvas so it doesn't inherit the sacred #0e0e0e default.
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div style={{ width: '480px' }}>
      <div>
        <p style={{ margin: 0 }}>Above content</p>
        <Divider
          styles={{ theme: 'light', marginTop: '24px', marginBottom: '24px' }}
        />
        <p style={{ margin: 0 }}>Below content</p>
      </div>
      <div style={{ marginTop: '24px' }}>
        <p style={{ margin: 0 }}>Left</p>
        <Divider
          styles={{
            theme: 'light',
            orientation: 'vertical',
            height: '60px',
            marginLeft: '16px',
            marginRight: '16px',
          }}
        />
        <p style={{ margin: 0 }}>Right</p>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// ACCESSIBILITY
// ---------------------------------------------------------------------------

/**
 * Semantics regression: every Divider renders as an ARIA `separator` (the role
 * equivalent of a native `<hr>`), so AT announces the thematic break instead of
 * an anonymous `<div>`. Verify in the accessibility tree:
 *  • horizontal rule  → role="separator", aria-orientation="horizontal"
 *  • vertical rule    → role="separator", aria-orientation="vertical"
 *  • labeled rule     → the label ("OR") is the separator's accessible name via
 *    aria-labelledby (needed because role="separator" makes descendants
 *    presentational, hiding the visible text from the tree on its own).
 */
export const AccessibleSeparator: Story = {
  name: 'A11y/Separator Semantics',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div style={{ width: '480px' }}>
      <p style={{ margin: 0 }}>Section above</p>
      {/* Plain horizontal separator: role="separator" + aria-orientation="horizontal". */}
      <Divider styles={{ theme: 'light' }} />
      <p style={{ margin: 0 }}>Section below</p>
      {/* Labeled separator: "OR" becomes the accessible name via aria-labelledby. */}
      <Divider styles={{ theme: 'light' }}>OR</Divider>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          height: '80px',
          marginTop: '24px',
        }}
      >
        <span>Left</span>
        {/* Vertical separator: aria-orientation="vertical". */}
        <Divider
          styles={{ theme: 'light', orientation: 'vertical', height: '60px' }}
        />
        <span>Right</span>
      </div>
    </div>
  ),
}

/**
 * Escape hatch: a purely decorative rule can opt out of the separator semantics
 * by passing `role="presentation"` (or `role="none"`) through. Because
 * `aria-orientation`/`aria-labelledby` are separator-ONLY attributes, the
 * component drops them automatically when the effective role isn't `separator`,
 * so `role="presentation"` on its own is `aria-allowed-attr`-clean — no extra
 * `aria-hidden` is required.
 *
 * Verify in the accessibility tree / with axe:
 *  • first rule  → `role="presentation"` ALONE, and crucially NO
 *    `aria-orientation` attribute (the axe `aria-allowed-attr` regression this
 *    story guards — a `role="presentation" aria-orientation="horizontal"` pair
 *    would be a violation).
 *  • second rule → `role="none"`, likewise no `aria-orientation`.
 *  • third rule  → `role="presentation"` + `aria-hidden` (the belt-and-braces
 *    form) still works and is redundant, not required.
 */
export const DecorativeOverride: Story = {
  name: 'A11y/Decorative Override',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div style={{ width: '480px' }}>
      <p style={{ margin: 0 }}>Above</p>
      {/* role="presentation" ALONE — must NOT emit aria-orientation. */}
      <Divider styles={{ theme: 'light' }} role="presentation" />
      <p style={{ margin: 0 }}>Middle</p>
      {/* role="none" alone — also drops the separator-only ARIA. */}
      <Divider styles={{ theme: 'light' }} role="none" />
      <p style={{ margin: 0 }}>Middle</p>
      {/* Redundant belt-and-braces form (aria-hidden no longer needed). */}
      <Divider styles={{ theme: 'light' }} role="presentation" aria-hidden />
      <p style={{ margin: 0 }}>Below</p>
    </div>
  ),
}

/**
 * Resize / reflow (WCAG 1.4.4 Resize Text, 1.4.10 Reflow): a long label — or a
 * short one at 200% text zoom — must WRAP within the rule width as a centered
 * chip instead of overflowing the container and forcing a horizontal scrollbar.
 * The narrow (240px) wrapper makes the wrap visible at default zoom; the label
 * stays centered on the rule and readable, and nothing overflows horizontally.
 * (A vertical rule is exempt — it is only ~2px wide and keeps its label on one
 * line; see `A11y/Separator Semantics` for the vertical case.)
 */
export const LongLabelReflow: Story = {
  name: 'A11y/Long Label Reflow',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div style={{ width: '240px' }}>
      <p style={{ margin: 0 }}>Section above</p>
      <Divider styles={{ theme: 'light' }}>
        OR continue with this considerably longer separator label
      </Divider>
      <p style={{ margin: 0 }}>Section below</p>
    </div>
  ),
}

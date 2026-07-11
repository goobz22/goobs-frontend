/**
 * @fileoverview Storybook stories for the AppBar component.
 * Demonstrates light, dark, and sacred themes plus position, elevation,
 * and real-world navigation-bar compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import AppBar from './index'

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  argTypes: {
    children: {
      control: false,
      description:
        'Content displayed in the app bar (typically navigation, search, actions)',
    },
    position: {
      control: 'select',
      options: ['static', 'fixed', 'absolute', 'sticky', 'relative'],
      description: 'Position of the app bar',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether the app bar should have elevation (box shadow)',
    },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, custom colors, and layout properties',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AppBar>

// --------------------------------------------------------------------------
// SHARED CONTENT
// --------------------------------------------------------------------------
// A simple toolbar layout (brand on the left, nav items on the right) used to
// give the AppBar realistic content across the theme/variant stories.

const NavContent = ({
  color = '#1F2937',
}: {
  color?: string
}): React.JSX.Element => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0 1rem',
    }}
  >
    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color }}>
      ThothOS
    </span>
    <nav style={{ display: 'flex', gap: '1.5rem', color }}>
      <span style={{ cursor: 'pointer' }}>Dashboard</span>
      <span style={{ cursor: 'pointer' }}>Reports</span>
      <span style={{ cursor: 'pointer' }}>Settings</span>
    </nav>
  </div>
)

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  args: {
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  args: {
    styles: { theme: 'dark' },
    children: <NavContent color="#F9FAFB" />,
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  args: {
    styles: { theme: 'sacred' },
    children: <NavContent color="#FFD700" />,
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// STATE / VARIANT STORIES
// --------------------------------------------------------------------------

export const Elevated: Story = {
  name: 'State/Elevated',
  args: {
    elevated: true,
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Flat: Story = {
  name: 'State/Flat (No Elevation)',
  args: {
    elevated: false,
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Disabled: Story = {
  name: 'State/Disabled',
  // `color="inherit"` lets the nav text pick up the AppBar's disabled token
  // (--goobs-light-text-disabled #646e7e, 5.16:1 on #ffffff) rather than a
  // hardcoded enabled color — so it reads as disabled AND clears WCAG AA.
  args: {
    styles: { theme: 'light', disabled: true },
    children: <NavContent color="inherit" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const StickyPosition: Story = {
  name: 'Position/Sticky',
  args: {
    position: 'sticky',
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    styles: {
      theme: 'light',
      backgroundColor: '#1976d2',
      borderRadius: '0 0 12px 12px',
      toolbarMinHeight: '72px',
    },
    children: <NavContent color="#FFFFFF" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY
// --------------------------------------------------------------------------

/**
 * The AppBar renders as a native `<header>` exposing the `banner` landmark. When
 * a page has more than one app bar/banner, pass `ariaLabel` so assistive-tech
 * users can tell them apart in the landmarks rotor. Here two labelled bars are
 * stacked; each surfaces its own accessible name.
 */
export const LabelledLandmarks: Story = {
  name: 'Accessibility/Labelled Landmarks',
  render: () => (
    <div>
      <AppBar
        ariaLabel="Primary navigation"
        styles={{ theme: 'light' }}
      >
        <NavContent color="#1F2937" />
      </AppBar>
      <AppBar
        ariaLabel="Account tools"
        styles={{ theme: 'dark' }}
      >
        <NavContent color="#F9FAFB" />
      </AppBar>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Exercises the `styles.containerAnimation` code path — a caller-supplied
 * looping animation applied to the bar container (here a perpetual gold glow).
 * This is the regression test for the reduced-motion fix (WCAG 2.3.3): the
 * `@media (prefers-reduced-motion: reduce)` block in `AppBar.module.css` sets
 * `.container { animation: none }`, so under an emulated reduced-motion
 * preference (Storybook a11y addon / a reduced-motion Chromatic snapshot) the
 * glow is suppressed while the default snapshot shows it running. Reverting that
 * one CSS line would let the animation keep looping under reduced motion and
 * change this story's reduced-motion baseline.
 *
 * The keyframe is declared globally (not via the CSS module) because a
 * consumer's `containerAnimation` string references an author-supplied
 * `@keyframes` by its literal name; CSS-module keyframe names are scoped and
 * would not match a runtime string, so callers bring their own keyframe exactly
 * as demonstrated here.
 */
export const ContainerAnimation: Story = {
  name: 'Accessibility/Container Animation (Reduced Motion)',
  render: () => (
    <>
      <style>{`
        @keyframes appbarReviewGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          50% {
            box-shadow: 0 0 32px rgba(212, 175, 55, 0.6);
          }
        }
      `}</style>
      <AppBar
        ariaLabel="Animated banner"
        styles={{
          theme: 'sacred',
          containerAnimation: 'appbarReviewGlow 2s ease-in-out infinite',
        }}
      >
        <NavContent color="#FFD700" />
      </AppBar>
    </>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

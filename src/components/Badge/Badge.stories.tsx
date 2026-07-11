/**
 * @fileoverview Storybook stories for the Badge component.
 * Demonstrates different positions, colors, and use cases.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, within } from 'storybook/test'
import Badge from './index'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    content: {
      control: 'text',
      description: 'The content to display inside the badge',
    },
    children: {
      control: false,
      description: 'The element to attach the badge to',
    },
    styles: {
      control: 'object',
      description:
        'Styling options for the badge including position, colors, and offset',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div
        style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Badge>

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

/** A default badge with light theme. */
export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  args: {
    content: '5',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A badge with dark theme. */
export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  args: {
    content: '5',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        Icon
      </div>
    ),
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A badge with sacred theme. */
export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  args: {
    content: '5',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#FFD700',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
      >
        Icon
      </div>
    ),
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** All themes displayed together for comparison. */
export const AllThemes: Story = {
  name: 'Themes/All Themes',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Badge content="5" styles={{ theme: 'light' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Light
        </div>
      </Badge>
      <Badge content="5" styles={{ theme: 'dark' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          Dark
        </div>
      </Badge>
      <Badge content="5" styles={{ theme: 'sacred' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          Sacred
        </div>
      </Badge>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// BASIC STORIES
// --------------------------------------------------------------------------

/** A default badge positioned at top-right with red background. */
export const Default: Story = {
  args: {
    content: '5',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
  },
}

/** A badge with custom content. */
export const CustomContent: Story = {
  args: {
    content: 'NEW',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
  },
}

// --------------------------------------------------------------------------
// POSITION STORIES
// --------------------------------------------------------------------------

/** Badge positioned at top-left. */
export const TopLeft: Story = {
  name: 'Position/Top Left',
  args: {
    content: '3',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: { position: 'top-left' },
  },
}

/** Badge positioned at bottom-right. */
export const BottomRight: Story = {
  name: 'Position/Bottom Right',
  args: {
    content: '7',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: { position: 'bottom-right' },
  },
}

/** Badge positioned at bottom-left. */
export const BottomLeft: Story = {
  name: 'Position/Bottom Left',
  args: {
    content: '12',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: { position: 'bottom-left' },
  },
}

/** All positions displayed together for comparison. */
export const AllPositions: Story = {
  name: 'Position/All Positions',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Badge content="1" styles={{ position: 'top-right' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          TR
        </div>
      </Badge>
      <Badge content="2" styles={{ position: 'top-left' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          TL
        </div>
      </Badge>
      <Badge content="3" styles={{ position: 'bottom-right' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          BR
        </div>
      </Badge>
      <Badge content="4" styles={{ position: 'bottom-left' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          BL
        </div>
      </Badge>
    </div>
  ),
}

// --------------------------------------------------------------------------
// COLOR STORIES
// --------------------------------------------------------------------------

/** Badge with custom colors. */
export const CustomColors: Story = {
  name: 'Colors/Custom Colors',
  args: {
    content: '99+',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: {
      backgroundColor: '#1565c0',
      color: 'white',
    },
  },
}

/** Different colored badges for different states in light theme. */
export const ColorVariantsLight: Story = {
  name: 'Colors/Color Variants - Light Theme',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge
        content="Error"
        styles={{ backgroundColor: '#d32f2f', color: 'white', theme: 'light' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Error
        </div>
      </Badge>
      <Badge
        content="Success"
        styles={{ backgroundColor: '#2e7d32', color: 'white', theme: 'light' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Success
        </div>
      </Badge>
      <Badge
        content="Warning"
        styles={{ backgroundColor: '#bf360c', color: 'white', theme: 'light' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Warning
        </div>
      </Badge>
      <Badge
        content="Info"
        styles={{ backgroundColor: '#1565c0', color: 'white', theme: 'light' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Info
        </div>
      </Badge>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Different colored badges for different states in dark theme. */
export const ColorVariantsDark: Story = {
  name: 'Colors/Color Variants - Dark Theme',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge
        content="Error"
        styles={{ backgroundColor: '#b91c1c', color: 'white', theme: 'dark' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          Error
        </div>
      </Badge>
      <Badge
        content="Success"
        styles={{ backgroundColor: '#047857', color: 'white', theme: 'dark' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          Success
        </div>
      </Badge>
      <Badge
        content="Warning"
        styles={{ backgroundColor: '#b45309', color: 'white', theme: 'dark' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          Warning
        </div>
      </Badge>
      <Badge
        content="Info"
        styles={{ backgroundColor: '#1d4ed8', color: 'white', theme: 'dark' }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          Info
        </div>
      </Badge>
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/** Different colored badges for different states in sacred theme. */
export const ColorVariantsSacred: Story = {
  name: 'Colors/Color Variants - Sacred Theme',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge
        content="Error"
        styles={{
          backgroundColor: 'rgba(220, 38, 38, 0.9)',
          color: '#FFD700',
          theme: 'sacred',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          Error
        </div>
      </Badge>
      <Badge
        content="Success"
        styles={{
          backgroundColor: 'rgba(34, 197, 94, 0.9)',
          color: '#FFD700',
          theme: 'sacred',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          Success
        </div>
      </Badge>
      <Badge
        content="Warning"
        styles={{
          backgroundColor: 'rgba(245, 158, 11, 0.9)',
          color: '#FFD700',
          theme: 'sacred',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          Warning
        </div>
      </Badge>
      <Badge
        content="Info"
        styles={{
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          color: '#FFD700',
          theme: 'sacred',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          Info
        </div>
      </Badge>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// OFFSET STORIES
// --------------------------------------------------------------------------

/** Badge with custom offset distance. */
export const CustomOffset: Story = {
  name: 'Offset/Custom Offset',
  args: {
    content: '5',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        Icon
      </div>
    ),
    styles: { offset: 15 },
  },
}

/** Different offset values for comparison. */
export const OffsetVariants: Story = {
  name: 'Offset/Offset Variants',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Badge content="0" styles={{ offset: 0 }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Offset 0
        </div>
      </Badge>
      <Badge content="8" styles={{ offset: 8 }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Offset 8
        </div>
      </Badge>
      <Badge content="15" styles={{ offset: 15 }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Offset 15
        </div>
      </Badge>
      <Badge content="25" styles={{ offset: 25 }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          Offset 25
        </div>
      </Badge>
    </div>
  ),
}

// --------------------------------------------------------------------------
// REAL-WORLD USE CASES
// --------------------------------------------------------------------------

/** Badge on a notification icon. */
export const NotificationIcon: Story = {
  name: 'Use Cases/Notification Icon',
  args: {
    content: '3',
    children: (
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontSize: '20px',
        }}
      >
        🔔
      </div>
    ),
    styles: { backgroundColor: '#d32f2f' },
  },
}

/** Badge on a shopping cart icon. */
export const ShoppingCart: Story = {
  name: 'Use Cases/Shopping Cart',
  args: {
    content: '2',
    children: (
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontSize: '20px',
        }}
      >
        🛒
      </div>
    ),
    styles: { backgroundColor: '#2e7d32' },
  },
}

/** Badge on a user avatar. */
export const UserAvatar: Story = {
  name: 'Use Cases/User Avatar',
  args: {
    content: 'Online',
    children: (
      <div
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#9c27b0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        JD
      </div>
    ),
    styles: {
      backgroundColor: '#2e7d32',
      color: 'white',
      position: 'bottom-right',
      offset: 2,
    },
  },
}

/** Badge on a menu item. */
export const MenuItem: Story = {
  name: 'Use Cases/Menu Item',
  args: {
    content: 'New',
    children: (
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid #e0e0e0',
          fontSize: '14px',
        }}
      >
        Messages
      </div>
    ),
    styles: {
      backgroundColor: '#bf360c',
      color: 'white',
      position: 'top-right',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTIVE STORIES
// --------------------------------------------------------------------------

/** Interactive badge that can be clicked. */
export const Interactive: Story = {
  name: 'Interactive/Clickable Badge',
  args: {
    content: 'Click me',
    children: (
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={fn()}
      >
        Icon
      </div>
    ),
    styles: {
      backgroundColor: '#9c27b0',
      color: 'white',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const icon = canvas.getByText('Icon')
    await userEvent.click(icon)
  },
}

// --------------------------------------------------------------------------
// COMPOSITION STORIES
// --------------------------------------------------------------------------

/** Multiple badges on different elements. */
export const MultipleBadges: Story = {
  name: 'Composition/Multiple Badges',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge content="5" styles={{ backgroundColor: '#d32f2f' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          📧
        </div>
      </Badge>
      <Badge content="12" styles={{ backgroundColor: '#1565c0' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          🔔
        </div>
      </Badge>
      <Badge content="3" styles={{ backgroundColor: '#2e7d32' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          🛒
        </div>
      </Badge>
      <Badge content="!" styles={{ backgroundColor: '#bf360c' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          ⚠️
        </div>
      </Badge>
    </div>
  ),
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------

/**
 * A bare count like "5" is meaningless to a screen reader out of context.
 * `ariaLabel` gives it meaning, and the badge renders as a `role="status"`
 * live region with `aria-atomic`, so assistive tech announces the full
 * "5 unread notifications" rather than a context-free "5". (WCAG 1.3.1, 4.1.2)
 */
export const LabeledStatus: Story = {
  name: 'Accessibility/Labeled Status',
  args: {
    content: '5',
    ariaLabel: '5 unread notifications',
    children: (
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontSize: '20px',
        }}
      >
        Bell
      </div>
    ),
    styles: { backgroundColor: '#d32f2f', color: 'white' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The badge chip is exposed as a status region carrying the accessible name.
    const badge = canvas.getByRole('status')
    await expect(badge).toHaveAttribute('aria-label', '5 unread notifications')
    await expect(badge).toHaveAttribute('aria-atomic', 'true')
    await expect(badge).toHaveTextContent('5')
  },
}

/**
 * A notification count that updates after render. Because the badge is a
 * `role="status"` / `aria-live="polite"` region, incrementing the count
 * announces the new value to a screen reader WITHOUT moving focus — the
 * classic notification-badge behavior. Click the bell to increment.
 * (WCAG 4.1.3 Status Messages)
 */
export const LiveCountUpdate: Story = {
  name: 'Accessibility/Live Count Update',
  render: () => {
    const [count, setCount] = React.useState(1)
    return (
      <Badge
        content={String(count)}
        ariaLabel={`${count} unread notifications`}
        ariaLive="polite"
        styles={{ backgroundColor: '#d32f2f', color: 'white' }}
      >
        <button
          type="button"
          onClick={() => setCount(current => current + 1)}
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'white',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Bell
        </button>
      </Badge>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByRole('status')
    await expect(badge).toHaveAttribute('aria-live', 'polite')
    await expect(badge).toHaveTextContent('1')
    // Incrementing updates both the visible count and the live-region label,
    // so the change is announced with its new meaning.
    await userEvent.click(canvas.getByRole('button', { name: 'Bell' }))
    await expect(badge).toHaveTextContent('2')
    await expect(badge).toHaveAttribute('aria-label', '2 unread notifications')
  },
}

/**
 * A purely decorative dot badge opts out of announcement via `role="none"`:
 * no status role, no live region, no `aria-label` — assistive tech skips it,
 * matching the visual-only intent (e.g. an online-status dot whose meaning is
 * already conveyed elsewhere). (WCAG 1.3.1)
 */
export const DecorativeBadge: Story = {
  name: 'Accessibility/Decorative (role=none)',
  args: {
    content: '',
    role: 'none',
    styles: {
      backgroundColor: '#2e7d32',
      width: '12px',
      height: '12px',
      position: 'bottom-right',
      offset: 2,
    },
    children: (
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#9c27b0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        JD
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The decorative badge exposes no status role and is not a live region.
    await expect(canvas.queryByRole('status')).toBeNull()
    const badge = canvasElement.querySelector(
      '[data-component="Badge"] > span[role="none"]'
    )
    await expect(badge).not.toBeNull()
    await expect(badge).not.toHaveAttribute('aria-label')
    await expect(badge).not.toHaveAttribute('aria-live')
  },
}

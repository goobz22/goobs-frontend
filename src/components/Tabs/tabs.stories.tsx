// src/components/Tabs/tabs.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, fn } from 'storybook/test'
import Tabs, { TabsItem } from './index'

const basicTabs: TabsItem[] = [
  { title: 'Home', route: '/home', trigger: 'route' },
  { title: 'About', route: '/about', trigger: 'route' },
  { title: 'Contact', route: '/contact', trigger: 'route' },
]

const withBordersTabs: TabsItem[] = [
  { title: 'Tab One', route: '/one', trigger: 'route' },
  { title: 'Tab Two', route: '/two', trigger: 'route' },
  { title: 'Tab Three', route: '/three', trigger: 'route' },
]

const mixedTriggerTabs: TabsItem[] = [
  { title: 'Profile', route: '/profile', trigger: 'route' },
  {
    title: 'Settings',
    onClick: fn(),
    trigger: 'onClick',
  },
  { title: 'Logout', onClick: fn(), trigger: 'onClick' },
]

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right', 'justify'],
    },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, borders, and layout',
    },
  },
  parameters: {
    layout: 'fullscreen', // Use fullscreen to better showcase sticky behavior
  },
}
export default meta

type Story = StoryObj<typeof Tabs>

/**
 * 1) Premium Theme
 */
export const PremiumTheme: Story = {
  render: args => (
    <div style={{ background: '#1f2937', height: '200vh' }}>
      <Tabs {...args} />
      <div style={{ padding: '32px', color: '#ffffff' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Page Content</h1>
        <p>Scroll down to see the tabs stick to the top.</p>
      </div>
    </div>
  ),
  args: {
    items: basicTabs,
    alignment: 'left',
    styles: {
      theme: 'light',
      height: '60px',
    },
  },
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  render: args => (
    <div style={{ background: '#000000', height: '200vh' }}>
      <Tabs {...args} />
      <div style={{ padding: '32px', color: '#ffe680' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: "'Cinzel', Georgia, serif",
          }}
        >
          Ancient Archives
        </h1>
        <p style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
          Scroll to observe the sacred header.
        </p>
      </div>
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    items: withBordersTabs,
    alignment: 'center',
    styles: {
      theme: 'sacred',
      height: '60px',
      tabLeftBorder: true,
      tabRightBorder: true,
    },
  },
}

const InteractiveDemoRenderer = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [alignment, setAlignment] = React.useState<
    'left' | 'center' | 'right' | 'justify'
  >('left')

  const wrapperBackground =
    theme === 'sacred' ? '#000000' : theme === 'dark' ? '#1f2937' : '#f3f4f6'
  const contentColor =
    theme === 'sacred' ? '#ffe680' : theme === 'dark' ? '#ffffff' : '#1f2937'

  return (
    <div style={{ height: '200vh', background: wrapperBackground }}>
      <div
        style={{
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          position: 'fixed',
          top: '96px',
          right: '16px',
          zIndex: 50,
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              style={{
                padding: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="sacred">Sacred Theme</option>
            </select>
          </label>
          <select
            value={alignment}
            onChange={e =>
              setAlignment(
                e.target.value as 'left' | 'center' | 'right' | 'justify'
              )
            }
            style={{
              padding: '4px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>

      <Tabs
        items={mixedTriggerTabs}
        alignment={alignment}
        styles={{
          theme,
          height: '60px',
        }}
      />

      <div style={{ padding: '32px', color: contentColor }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            ...(theme === 'sacred'
              ? { fontFamily: "'Cinzel', Georgia, serif" }
              : {}),
          }}
        >
          Interactive Content
        </h1>
        <p>Use the controls to change the tabs.</p>
      </div>
    </div>
  )
}

/**
 * 3) Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test clicking a tab
    const settingsTab = await canvas.findByText('Settings')
    await userEvent.click(settingsTab)
  },
}

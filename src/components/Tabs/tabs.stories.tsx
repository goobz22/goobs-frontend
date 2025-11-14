// src/components/Tabs/tabs.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
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
    onClick: () => alert('Settings clicked!'),
    trigger: 'onClick',
  },
  { title: 'Logout', onClick: () => alert('Logging out!'), trigger: 'onClick' },
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
  name: 'Premium Theme',
  render: args => (
    <div className="bg-gray-800 h-[200vh]">
      <Tabs {...args} />
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold">Page Content</h1>
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
  name: 'Sacred Theme',
  render: args => (
    <div className="bg-black h-[200vh]">
      <Tabs {...args} />
      <div className="p-8 text-yellow-200">
        <h1 className="text-2xl font-bold font-cinzel">Ancient Archives</h1>
        <p className="font-cinzel">Scroll to observe the sacred header.</p>
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

  return (
    <div
      className={`h-[200vh] ${theme === 'sacred' ? 'bg-black' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <div className="p-4 bg-white rounded-lg border fixed top-24 right-4 z-50">
        <h3 className="text-lg font-bold mb-2">Controls</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              className="p-1 border rounded"
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
            className="p-1 border rounded"
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

      <div
        className={`p-8 ${theme === 'sacred' ? 'text-yellow-200' : theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      >
        <h1
          className={`text-2xl font-bold ${theme === 'sacred' && 'font-cinzel'}`}
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
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test clicking a tab
    const settingsTab = await canvas.findByText('Settings')
    await userEvent.click(settingsTab)
  },
}

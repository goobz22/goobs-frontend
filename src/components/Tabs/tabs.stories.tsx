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
  { title: 'Tab One', route: '/one', trigger: 'route', hasrightborder: true },
  {
    title: 'Tab Two',
    route: '/two',
    trigger: 'route',
    hasleftborder: true,
    hasrightborder: true,
  },
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
    sacredtheme: { control: 'boolean' },
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right', 'justify'],
    },
    height: { control: 'text' },
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
    height: '60px',
    navname: 'premiumNav',
    sacredtheme: false,
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
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [alignment, setAlignment] = React.useState<
    'left' | 'center' | 'right' | 'justify'
  >('left')

  return (
    <div className={`h-[200vh] ${sacred ? 'bg-black' : 'bg-gray-800'}`}>
      <div className="p-4 bg-white rounded-lg border fixed top-24 right-4 z-50">
        <h3 className="text-lg font-bold mb-2">Controls</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />
            Sacred Theme
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
        sacredtheme={sacred}
        alignment={alignment}
        navname="interactiveNav"
      />

      <div className={`p-8 ${sacred ? 'text-yellow-200' : 'text-white'}`}>
        <h1 className={`text-2xl font-bold ${sacred && 'font-cinzel'}`}>
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

// src/components/ToggleButton/togglebutton.stories.tsx
import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ToggleButton, ToggleButtonGroup } from './index'
import { HomeIcon, SettingsIcon, PersonIcon } from '../Icons/mock-icons' // Assuming you have some mock icons

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/ToggleButton',
  component: ToggleButtonGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    exclusive: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const PremiumThemeRenderer = (args: Story['args']) => {
  const [value, setValue] = React.useState('home')
  return (
    <div className="p-8 bg-gray-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium ToggleButton
      </h3>
      <ToggleButtonGroup
        {...args}
        value={value}
        onChange={(e, newValue) => newValue && setValue(newValue)}
      >
        <ToggleButton value="home">
          <HomeIcon />
          <span className="ml-2">Home</span>
        </ToggleButton>
        <ToggleButton value="settings">
          <SettingsIcon />
          <span className="ml-2">Settings</span>
        </ToggleButton>
        <ToggleButton value="profile">
          <PersonIcon />
          <span className="ml-2">Profile</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

/**
 * 1) Premium Theme
 */
export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => <PremiumThemeRenderer {...args} />,
  args: {
    sacredtheme: false,
    exclusive: true,
  },
}

const SacredThemeRenderer = (args: Story['args']) => {
  const [value, setValue] = React.useState('home')
  return (
    <div className="p-8 bg-black/90 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred ToggleButton
      </h3>
      <ToggleButtonGroup
        {...args}
        value={value}
        onChange={(e, newValue) => newValue && setValue(newValue)}
      >
        <ToggleButton value="home">
          <HomeIcon />
          <span className="ml-2">Sanctum</span>
        </ToggleButton>
        <ToggleButton value="settings">
          <SettingsIcon />
          <span className="ml-2">Rituals</span>
        </ToggleButton>
        <ToggleButton value="profile">
          <PersonIcon />
          <span className="ml-2">Avatar</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => <SacredThemeRenderer {...args} />,
  args: {
    sacredtheme: true,
    exclusive: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [value, setValue] = React.useState('home')
  const [sacred, setSacred] = React.useState(false)
  const [exclusive, setExclusive] = React.useState(true)

  return (
    <div className="w-[500px] space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ToggleButton Configuration
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />
            <span className="ml-2">Sacred Theme</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exclusive}
              onChange={e => setExclusive(e.target.checked)}
            />
            <span className="ml-2">Exclusive</span>
          </label>
        </div>
      </div>

      <div
        className={`p-8 rounded-xl flex justify-center items-center ${sacred ? 'bg-black/90' : 'bg-gray-50'}`}
      >
        <ToggleButtonGroup
          value={value}
          onChange={(e, newValue) => newValue && setValue(newValue)}
          sacredtheme={sacred}
          exclusive={exclusive}
        >
          <ToggleButton value="home">
            <HomeIcon />
          </ToggleButton>
          <ToggleButton value="settings">
            <SettingsIcon />
          </ToggleButton>
          <ToggleButton value="profile">
            <PersonIcon />
          </ToggleButton>
        </ToggleButtonGroup>
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
}

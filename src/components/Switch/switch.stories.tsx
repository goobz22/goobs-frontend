// src/components/Switch/switch.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import Switch from './index'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    label: { control: 'text' },
    onChange: { action: 'changed' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1) Premium Theme Variants
 */
export const PremiumThemeVariants: Story = {
  name: 'Premium Theme - All Variants',
  render: args => (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium Switch Styles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Basic States
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Off State</span>
              <Switch
                {...args}
                checked={false}
                sacredtheme={false}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On State</span>
              <Switch
                {...args}
                checked={true}
                sacredtheme={false}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disabled Off</span>
              <Switch
                {...args}
                checked={false}
                disabled={true}
                sacredtheme={false}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disabled On</span>
              <Switch
                {...args}
                checked={true}
                disabled={true}
                sacredtheme={false}
                outline={true}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            With Labels
          </h4>
          <div className="space-y-4">
            <Switch
              {...args}
              checked={false}
              label="Enable notifications"
              sacredtheme={false}
              outline={true}
            />
            <Switch
              {...args}
              checked={true}
              label="Dark mode"
              sacredtheme={false}
              outline={true}
            />
            <Switch
              {...args}
              checked={true}
              label="Auto-save"
              sacredtheme={false}
              outline={true}
            />
            <Switch
              {...args}
              checked={false}
              label="Beta features"
              disabled={true}
              sacredtheme={false}
              outline={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Without Outline
        </h4>
        <div className="flex flex-wrap gap-6">
          <Switch
            {...args}
            checked={false}
            label="Clean design"
            sacredtheme={false}
            outline={false}
          />
          <Switch
            {...args}
            checked={true}
            label="Minimal style"
            sacredtheme={false}
            outline={false}
          />
          <Switch
            {...args}
            checked={true}
            label="Subtle appearance"
            sacredtheme={false}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that switches are rendered
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBeGreaterThan(0)

    // Test switch interaction
    const firstSwitch = switches[0]
    await userEvent.click(firstSwitch)
  },
}

/**
 * 2) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: args => (
    <div className="bg-black/90 p-8 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred Mystical Switches
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Divine States
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-200">Dormant</span>
              <Switch
                {...args}
                checked={false}
                sacredtheme={true}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-200">Awakened</span>
              <Switch
                {...args}
                checked={true}
                sacredtheme={true}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-200">Sealed Dormant</span>
              <Switch
                {...args}
                checked={false}
                disabled={true}
                sacredtheme={true}
                outline={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-200">Sealed Awakened</span>
              <Switch
                {...args}
                checked={true}
                disabled={true}
                sacredtheme={true}
                outline={true}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Sacred Powers
          </h4>
          <div className="space-y-4">
            <Switch
              {...args}
              checked={false}
              label="Channel Divine Energy"
              sacredtheme={true}
              outline={true}
            />
            <Switch
              {...args}
              checked={true}
              label="Activate Sacred Aura"
              sacredtheme={true}
              outline={true}
            />
            <Switch
              {...args}
              checked={true}
              label="Enable Mystical Sight"
              sacredtheme={true}
              outline={true}
            />
            <Switch
              {...args}
              checked={false}
              label="Forbidden Knowledge"
              disabled={true}
              sacredtheme={true}
              outline={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Pure Essence (No Outline)
        </h4>
        <div className="flex flex-wrap gap-8">
          <Switch
            {...args}
            checked={false}
            label="Spiritual Connection"
            sacredtheme={true}
            outline={false}
          />
          <Switch
            {...args}
            checked={true}
            label="Divine Harmony"
            sacredtheme={true}
            outline={false}
          />
          <Switch
            {...args}
            checked={true}
            label="Eternal Wisdom"
            sacredtheme={true}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme switches
    const sacredSwitches = canvas.getAllByRole('checkbox')
    expect(sacredSwitches.length).toBeGreaterThan(0)

    // Test sacred switch interaction
    const firstSacredSwitch = sacredSwitches[0]
    await userEvent.click(firstSacredSwitch)
  },
}

/**
 * 3) Premium vs Sacred Comparison
 */
export const PremiumVsSacredComparison: Story = {
  name: 'Premium vs Sacred Theme Comparison',
  render: args => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Theme */}
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Premium Theme
        </h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Modern professional design with blue accents
            </p>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Business mode"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Professional settings"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Clean interface (no outline)"
                sacredtheme={false}
                outline={false}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Glassmorphism effects with smooth animations
            </p>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={true}
                label="Enable glassmorphism"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={false}
                label="Smooth transitions"
                sacredtheme={false}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-yellow-200">
              Mystical golden design with Egyptian elements
            </p>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Mystical Powers"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Divine Blessings"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Pure Energy (no outline)"
                sacredtheme={true}
                outline={false}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-yellow-200">
              Floating hieroglyphs with sacred shimmer effects
            </p>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={true}
                label="Sacred Glyphs"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={false}
                label="Ancient Wisdom"
                sacredtheme={true}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    const allSwitches = canvas.getAllByRole('checkbox')
    expect(allSwitches.length).toBeGreaterThan(0)

    // Test interactions with both themes
    await userEvent.click(allSwitches[0])
    if (allSwitches.length > 5) {
      await userEvent.click(allSwitches[5])
    }
  },
}

/**
 * 4) Outline Variants
 */
export const OutlineVariants: Story = {
  name: 'Outline Variants',
  render: args => (
    <div className="space-y-8">
      {/* Premium Theme Outline Variants */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Premium Theme
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">
              With Outline (Default)
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Outlined off state"
                outline={true}
                sacredtheme={false}
              />
              <Switch
                {...args}
                checked={true}
                label="Outlined on state with glow"
                outline={true}
                sacredtheme={false}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">
              Without Outline
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Clean borderless design"
                outline={false}
                sacredtheme={false}
              />
              <Switch
                {...args}
                checked={true}
                label="Minimal appearance"
                outline={false}
                sacredtheme={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Theme Outline Variants */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-md font-medium text-yellow-300">
              With Sacred Glow (Default)
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Divine Border Dormant"
                outline={true}
                sacredtheme={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Golden Aura Awakened"
                outline={true}
                sacredtheme={true}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-md font-medium text-yellow-300">
              Pure Essence (No Outline)
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Ethereal Connection"
                outline={false}
                sacredtheme={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Spiritual Enlightenment"
                outline={false}
                sacredtheme={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outline variants
    const outlineSwitches = canvas.getAllByRole('checkbox')
    expect(outlineSwitches.length).toBe(8)

    // Test interactions with different variants
    await userEvent.click(outlineSwitches[0])
    await userEvent.click(outlineSwitches[4])
  },
}

const InteractiveDemoRenderer = (args: Story['args']) => {
  const [switches, setSwitches] = React.useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    betaFeatures: false,
  })

  const [config, setConfig] = React.useState({
    sacredtheme: false,
    outline: true,
    disabled: false,
  })

  const [toggleCount, setToggleCount] = React.useState(0)

  const handleSwitchChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSwitches({ ...switches, [key]: e.target.checked })
      setToggleCount(prev => prev + 1)
      if (args && args.onChange) {
        args.onChange(e)
      }
    }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Switch Configuration
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sacredtheme}
              onChange={e =>
                setConfig({ ...config, sacredtheme: e.target.checked })
              }
              className="mr-2"
            />
            Sacred Theme
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.outline}
              onChange={e =>
                setConfig({ ...config, outline: e.target.checked })
              }
              className="mr-2"
            />
            Outline
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.disabled}
              onChange={e =>
                setConfig({ ...config, disabled: e.target.checked })
              }
              className="mr-2"
            />
            Disabled
          </label>
        </div>
        <div className="text-sm text-gray-600">
          Total toggles: {toggleCount}
        </div>
      </div>

      {/* Switches Display */}
      <div
        className={
          config.sacredtheme
            ? 'bg-black/90 p-8 rounded-xl'
            : 'p-8 bg-gray-50 rounded-xl'
        }
      >
        <h3
          className={`text-lg font-semibold mb-6 ${config.sacredtheme ? 'text-yellow-400 font-cinzel' : 'text-gray-900'}`}
        >
          {config.sacredtheme
            ? 'Sacred Power Configuration'
            : 'Application Settings'}
        </h3>

        <div className="space-y-4">
          <Switch
            {...args}
            checked={switches.notifications}
            onChange={handleSwitchChange('notifications')}
            label={
              config.sacredtheme
                ? 'Divine Notifications'
                : 'Enable notifications'
            }
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            disabled={config.disabled}
          />
          <Switch
            {...args}
            checked={switches.darkMode}
            onChange={handleSwitchChange('darkMode')}
            label={config.sacredtheme ? 'Shadow Realm Mode' : 'Dark mode'}
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            disabled={config.disabled}
          />
          <Switch
            {...args}
            checked={switches.autoSave}
            onChange={handleSwitchChange('autoSave')}
            label={config.sacredtheme ? 'Automatic Soul Binding' : 'Auto-save'}
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            disabled={config.disabled}
          />
          <Switch
            {...args}
            checked={switches.betaFeatures}
            onChange={handleSwitchChange('betaFeatures')}
            label={
              config.sacredtheme ? 'Experimental Rituals' : 'Beta features'
            }
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            disabled={config.disabled}
          />
        </div>

        <div
          className={`mt-6 text-sm ${config.sacredtheme ? 'text-yellow-200' : 'text-gray-600'}`}
        >
          Active settings: {Object.values(switches).filter(Boolean).length} /{' '}
          {Object.keys(switches).length}
        </div>
      </div>
    </div>
  )
}

/**
 * 5) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: args => {
    return <InteractiveDemoRenderer {...args} />
  },
}

/**
 * 6) Settings Panel Example
 */
export const SettingsPanelExample: Story = {
  name: 'Settings Panel Example',
  render: args => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Settings Panel */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Application Settings
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">
              Privacy & Security
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={true}
                label="Two-factor authentication"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={false}
                label="Data collection"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Secure connections only"
                sacredtheme={false}
                outline={true}
              />
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">
              Appearance
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Dark mode"
                sacredtheme={false}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Reduced motion"
                sacredtheme={false}
                outline={false}
              />
              <Switch
                {...args}
                checked={false}
                label="High contrast"
                disabled={true}
                sacredtheme={false}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Settings Panel */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Mystical Configuration
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold text-yellow-300 mb-3">
              Sacred Protections
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={true}
                label="Ward Against Dark Forces"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={false}
                label="Allow Spiritual Binding"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Divine Protection Barrier"
                sacredtheme={true}
                outline={true}
              />
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-yellow-300 mb-3">
              Mystical Appearance
            </h4>
            <div className="space-y-3">
              <Switch
                {...args}
                checked={false}
                label="Shadow Realm Interface"
                sacredtheme={true}
                outline={true}
              />
              <Switch
                {...args}
                checked={true}
                label="Reduce Sacred Animations"
                sacredtheme={true}
                outline={false}
              />
              <Switch
                {...args}
                checked={false}
                label="High Contrast Glyphs"
                disabled={true}
                sacredtheme={true}
                outline={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test settings panel switches
    const settingSwitches = canvas.getAllByRole('checkbox')
    expect(settingSwitches.length).toBeGreaterThan(0)

    // Test switch interactions
    if (settingSwitches.length >= 2) {
      await userEvent.click(settingSwitches[0])
      await userEvent.click(settingSwitches[1])
    }
  },
}

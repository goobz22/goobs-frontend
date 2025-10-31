// src/components/Switch/switch.stories.tsx

import React, { useState } from 'react'
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
    styles: {
      control: false,
      table: { category: 'Styling' },
    },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1) Light Theme Variants
 */
export const LightThemeVariants: Story = {
  name: 'Light Theme - All Variants',
  render: args => {
    const Component = () => {
      const [offChecked, setOffChecked] = useState(false)
      const [onChecked, setOnChecked] = useState(true)
      const [disabledOffChecked, setDisabledOffChecked] = useState(false)
      const [disabledOnChecked, setDisabledOnChecked] = useState(true)
      const [label1Checked, setLabel1Checked] = useState(false)
      const [label2Checked, setLabel2Checked] = useState(true)
      const [label3Checked, setLabel3Checked] = useState(true)
      const [label4Checked, setLabel4Checked] = useState(false)
      const [noOutline1Checked, setNoOutline1Checked] = useState(false)
      const [noOutline2Checked, setNoOutline2Checked] = useState(true)
      const [noOutline3Checked, setNoOutline3Checked] = useState(true)

      return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
            Light Switch Styles
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
                    checked={offChecked}
                    onChange={e => setOffChecked(e.target.checked)}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On State</span>
                  <Switch
                    {...args}
                    checked={onChecked}
                    onChange={e => setOnChecked(e.target.checked)}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disabled Off</span>
                  <Switch
                    {...args}
                    checked={disabledOffChecked}
                    onChange={e => setDisabledOffChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'light', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disabled On</span>
                  <Switch
                    {...args}
                    checked={disabledOnChecked}
                    onChange={e => setDisabledOnChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'light', outline: true }}
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
                  checked={label1Checked}
                  onChange={e => setLabel1Checked(e.target.checked)}
                  rightLabel="Enable notifications"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label2Checked}
                  onChange={e => setLabel2Checked(e.target.checked)}
                  rightLabel="Dark mode"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label3Checked}
                  onChange={e => setLabel3Checked(e.target.checked)}
                  rightLabel="Auto-save"
                  styles={{ theme: 'light', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label4Checked}
                  onChange={e => setLabel4Checked(e.target.checked)}
                  rightLabel="Beta features"
                  disabled={true}
                  styles={{ theme: 'light', outline: true }}
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
                checked={noOutline1Checked}
                onChange={e => setNoOutline1Checked(e.target.checked)}
                rightLabel="Clean design"
                styles={{ theme: 'light', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline2Checked}
                onChange={e => setNoOutline2Checked(e.target.checked)}
                rightLabel="Minimal style"
                styles={{ theme: 'light', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline3Checked}
                onChange={e => setNoOutline3Checked(e.target.checked)}
                rightLabel="Subtle appearance"
                styles={{ theme: 'light', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that switches are rendered
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBeGreaterThan(0)

    // Test switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 2) Dark Theme Variants
 */
export const DarkThemeVariants: Story = {
  name: 'Dark Theme - All Variants',
  render: args => {
    const Component = () => {
      const [offChecked, setOffChecked] = useState(false)
      const [onChecked, setOnChecked] = useState(true)
      const [disabledOffChecked, setDisabledOffChecked] = useState(false)
      const [disabledOnChecked, setDisabledOnChecked] = useState(true)
      const [label1Checked, setLabel1Checked] = useState(false)
      const [label2Checked, setLabel2Checked] = useState(true)
      const [label3Checked, setLabel3Checked] = useState(true)
      const [label4Checked, setLabel4Checked] = useState(false)
      const [noOutline1Checked, setNoOutline1Checked] = useState(false)
      const [noOutline2Checked, setNoOutline2Checked] = useState(true)
      const [noOutline3Checked, setNoOutline3Checked] = useState(true)

      return (
        <div className="space-y-6 p-6 bg-gray-900 rounded-xl">
          <h3 className="text-xl font-bold text-gray-200 mb-6 font-inter">
            Dark Switch Styles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-300 mb-3">
                Basic States
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Off State</span>
                  <Switch
                    {...args}
                    checked={offChecked}
                    onChange={e => setOffChecked(e.target.checked)}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">On State</span>
                  <Switch
                    {...args}
                    checked={onChecked}
                    onChange={e => setOnChecked(e.target.checked)}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Disabled Off</span>
                  <Switch
                    {...args}
                    checked={disabledOffChecked}
                    onChange={e => setDisabledOffChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Disabled On</span>
                  <Switch
                    {...args}
                    checked={disabledOnChecked}
                    onChange={e => setDisabledOnChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'dark', outline: true }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-300 mb-3">
                With Labels
              </h4>
              <div className="space-y-4">
                <Switch
                  {...args}
                  checked={label1Checked}
                  onChange={e => setLabel1Checked(e.target.checked)}
                  rightLabel="Enable notifications"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label2Checked}
                  onChange={e => setLabel2Checked(e.target.checked)}
                  rightLabel="Night mode"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label3Checked}
                  onChange={e => setLabel3Checked(e.target.checked)}
                  rightLabel="Auto-save"
                  styles={{ theme: 'dark', outline: true }}
                />
                <Switch
                  {...args}
                  checked={label4Checked}
                  onChange={e => setLabel4Checked(e.target.checked)}
                  rightLabel="Beta features"
                  disabled={true}
                  styles={{ theme: 'dark', outline: true }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-md font-medium text-gray-300 mb-4">
              Without Outline
            </h4>
            <div className="flex flex-wrap gap-6">
              <Switch
                {...args}
                checked={noOutline1Checked}
                onChange={e => setNoOutline1Checked(e.target.checked)}
                rightLabel="Clean design"
                styles={{ theme: 'dark', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline2Checked}
                onChange={e => setNoOutline2Checked(e.target.checked)}
                rightLabel="Minimal style"
                styles={{ theme: 'dark', outline: false }}
              />
              <Switch
                {...args}
                checked={noOutline3Checked}
                onChange={e => setNoOutline3Checked(e.target.checked)}
                rightLabel="Subtle appearance"
                styles={{ theme: 'dark', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that switches are rendered
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBeGreaterThan(0)

    // Test switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 3) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: args => {
    const Component = () => {
      const [dormantChecked, setDormantChecked] = useState(false)
      const [awakenedChecked, setAwakenedChecked] = useState(true)
      const [sealedDormantChecked, setSealedDormantChecked] = useState(false)
      const [sealedAwakenedChecked, setSealedAwakenedChecked] = useState(true)
      const [divine1Checked, setDivine1Checked] = useState(false)
      const [divine2Checked, setDivine2Checked] = useState(true)
      const [divine3Checked, setDivine3Checked] = useState(true)
      const [divine4Checked, setDivine4Checked] = useState(false)
      const [essence1Checked, setEssence1Checked] = useState(false)
      const [essence2Checked, setEssence2Checked] = useState(true)
      const [essence3Checked, setEssence3Checked] = useState(true)

      return (
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
                    checked={dormantChecked}
                    onChange={e => setDormantChecked(e.target.checked)}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-200">Awakened</span>
                  <Switch
                    {...args}
                    checked={awakenedChecked}
                    onChange={e => setAwakenedChecked(e.target.checked)}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-200">
                    Sealed Dormant
                  </span>
                  <Switch
                    {...args}
                    checked={sealedDormantChecked}
                    onChange={e => setSealedDormantChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'sacred', outline: true }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-200">
                    Sealed Awakened
                  </span>
                  <Switch
                    {...args}
                    checked={sealedAwakenedChecked}
                    onChange={e => setSealedAwakenedChecked(e.target.checked)}
                    disabled={true}
                    styles={{ theme: 'sacred', outline: true }}
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
                  checked={divine1Checked}
                  onChange={e => setDivine1Checked(e.target.checked)}
                  rightLabel="Channel Divine Energy"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine2Checked}
                  onChange={e => setDivine2Checked(e.target.checked)}
                  rightLabel="Activate Sacred Aura"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine3Checked}
                  onChange={e => setDivine3Checked(e.target.checked)}
                  rightLabel="Enable Mystical Sight"
                  styles={{ theme: 'sacred', outline: true }}
                />
                <Switch
                  {...args}
                  checked={divine4Checked}
                  onChange={e => setDivine4Checked(e.target.checked)}
                  rightLabel="Forbidden Knowledge"
                  disabled={true}
                  styles={{ theme: 'sacred', outline: true }}
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
                checked={essence1Checked}
                onChange={e => setEssence1Checked(e.target.checked)}
                rightLabel="Spiritual Connection"
                styles={{ theme: 'sacred', outline: false }}
              />
              <Switch
                {...args}
                checked={essence2Checked}
                onChange={e => setEssence2Checked(e.target.checked)}
                rightLabel="Divine Harmony"
                styles={{ theme: 'sacred', outline: false }}
              />
              <Switch
                {...args}
                checked={essence3Checked}
                onChange={e => setEssence3Checked(e.target.checked)}
                rightLabel="Eternal Wisdom"
                styles={{ theme: 'sacred', outline: false }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme switches
    const sacredSwitches = canvas.getAllByRole('checkbox')
    expect(sacredSwitches.length).toBeGreaterThan(0)

    // Test sacred switch interaction
    const firstSacredSwitch = sacredSwitches.at(0)
    if (firstSacredSwitch) {
      await userEvent.click(firstSacredSwitch)
    }
  },
}

/**
 * 4) Theme Comparison
 */
export const ThemeComparison: Story = {
  name: 'Theme Comparison',
  render: args => {
    const Component = () => {
      const [lightChecked1, setLightChecked1] = useState(false)
      const [lightChecked2, setLightChecked2] = useState(true)
      const [lightChecked3, setLightChecked3] = useState(true)
      const [darkChecked1, setDarkChecked1] = useState(false)
      const [darkChecked2, setDarkChecked2] = useState(true)
      const [darkChecked3, setDarkChecked3] = useState(true)
      const [sacredChecked1, setSacredChecked1] = useState(false)
      const [sacredChecked2, setSacredChecked2] = useState(true)
      const [sacredChecked3, setSacredChecked3] = useState(true)

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Light Theme */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
              Light Theme
            </h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Clean professional design with subtle shadows
                </p>
                <div className="space-y-3">
                  <Switch
                    {...args}
                    checked={lightChecked1}
                    onChange={e => setLightChecked1(e.target.checked)}
                    rightLabel="Business mode"
                    styles={{ theme: 'light', outline: true }}
                  />
                  <Switch
                    {...args}
                    checked={lightChecked2}
                    onChange={e => setLightChecked2(e.target.checked)}
                    rightLabel="Professional settings"
                    styles={{ theme: 'light', outline: true }}
                  />
                  <Switch
                    {...args}
                    checked={lightChecked3}
                    onChange={e => setLightChecked3(e.target.checked)}
                    rightLabel="Clean interface"
                    styles={{ theme: 'light', outline: false }}
                  />
                </div>
              </div>
            </div>

            {/* Dark Theme */}
            <div className="bg-gray-900 p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-gray-200 mb-4 font-inter">
                Dark Theme
              </h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Modern dark interface with blue accents
                  </p>
                  <div className="space-y-3">
                    <Switch
                      {...args}
                      checked={darkChecked1}
                      onChange={e => setDarkChecked1(e.target.checked)}
                      rightLabel="Night mode"
                      styles={{ theme: 'dark', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={darkChecked2}
                      onChange={e => setDarkChecked2(e.target.checked)}
                      rightLabel="Dark interface"
                      styles={{ theme: 'dark', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={darkChecked3}
                      onChange={e => setDarkChecked3(e.target.checked)}
                      rightLabel="Minimal design"
                      styles={{ theme: 'dark', outline: false }}
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
                      checked={sacredChecked1}
                      onChange={e => setSacredChecked1(e.target.checked)}
                      rightLabel="Mystical Powers"
                      styles={{ theme: 'sacred', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={sacredChecked2}
                      onChange={e => setSacredChecked2(e.target.checked)}
                      rightLabel="Divine Blessings"
                      styles={{ theme: 'sacred', outline: true }}
                    />
                    <Switch
                      {...args}
                      checked={sacredChecked3}
                      onChange={e => setSacredChecked3(e.target.checked)}
                      rightLabel="Pure Energy"
                      styles={{ theme: 'sacred', outline: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test all themes
    const allSwitches = canvas.getAllByRole('checkbox')
    expect(allSwitches.length).toBeGreaterThan(0)

    // Test interactions with different themes
    const s0 = allSwitches.at(0)
    const s3 = allSwitches.at(3)
    const s6 = allSwitches.at(6)
    if (s0) await userEvent.click(s0)
    if (s3) await userEvent.click(s3)
    if (s6) await userEvent.click(s6)
  },
}

/**
 * 5) Custom Colors
 */
export const CustomColors: Story = {
  name: 'Custom Colors',
  render: args => {
    const Component = () => {
      const [greenChecked1, setGreenChecked1] = useState(false)
      const [greenChecked2, setGreenChecked2] = useState(true)
      const [purpleChecked1, setPurpleChecked1] = useState(false)
      const [purpleChecked2, setPurpleChecked2] = useState(true)
      const [customSizeChecked1, setCustomSizeChecked1] = useState(true)
      const [customSizeChecked2, setCustomSizeChecked2] = useState(false)

      return (
        <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
            Custom Color Switches
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-700">Green Theme</h4>
              <div className="space-y-3">
                <Switch
                  {...args}
                  checked={greenChecked1}
                  onChange={e => setGreenChecked1(e.target.checked)}
                  rightLabel="Enable eco mode"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#10B981',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
                <Switch
                  {...args}
                  checked={greenChecked2}
                  onChange={e => setGreenChecked2(e.target.checked)}
                  rightLabel="Eco-friendly features"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#10B981',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-700">
                Purple Theme
              </h4>
              <div className="space-y-3">
                <Switch
                  {...args}
                  checked={purpleChecked1}
                  onChange={e => setPurpleChecked1(e.target.checked)}
                  rightLabel="Premium features"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#8B5CF6',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
                <Switch
                  {...args}
                  checked={purpleChecked2}
                  onChange={e => setPurpleChecked2(e.target.checked)}
                  rightLabel="Advanced settings"
                  styles={{
                    theme: 'light',
                    outline: true,
                    checkedTrackColor: '#8B5CF6',
                    checkedThumbColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-700">Custom Size</h4>
              <div className="space-y-3">
                <Switch
                  {...args}
                  checked={customSizeChecked1}
                  onChange={e => setCustomSizeChecked1(e.target.checked)}
                  rightLabel="Large switch"
                  styles={{
                    theme: 'light',
                    outline: true,
                    trackWidth: '60px',
                    trackHeight: '30px',
                    thumbSize: '26px',
                  }}
                />
                <Switch
                  {...args}
                  checked={customSizeChecked2}
                  onChange={e => setCustomSizeChecked2(e.target.checked)}
                  rightLabel="Small switch"
                  styles={{
                    theme: 'light',
                    outline: true,
                    trackWidth: '36px',
                    trackHeight: '20px',
                    thumbSize: '16px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test custom color switches
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBeGreaterThan(0)

    // Test custom switch interaction
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
  },
}

/**
 * 7) Dual Label Demo
 */
export const DualLabelDemo: Story = {
  name: 'Dual Labels',
  render: args => {
    const Component = () => {
      const [lightChecked, setLightChecked] = useState(false)
      const [darkChecked, setDarkChecked] = useState(false)
      const [sacredChecked, setSacredChecked] = useState(false)

      return (
        <div className="space-y-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter">
            Switches with Left and Right Labels
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Light Theme
              </h4>
              <Switch
                {...args}
                leftLabel="Pie"
                rightLabel="Fish"
                checked={lightChecked}
                onChange={e => setLightChecked(e.target.checked)}
                styles={{ theme: 'light', outline: true }}
              />
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Dark Theme
              </h4>
              <div className="p-4 bg-gray-900 rounded">
                <Switch
                  {...args}
                  leftLabel="Pie"
                  rightLabel="Fish"
                  checked={darkChecked}
                  onChange={e => setDarkChecked(e.target.checked)}
                  styles={{ theme: 'dark', outline: true }}
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Sacred Theme
              </h4>
              <div className="p-4 bg-black/90 rounded">
                <Switch
                  {...args}
                  leftLabel="Pie"
                  rightLabel="Fish"
                  checked={sacredChecked}
                  onChange={e => setSacredChecked(e.target.checked)}
                  styles={{ theme: 'sacred', outline: true }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBe(3)
    const firstSwitch = switches.at(0)
    if (firstSwitch) {
      await userEvent.click(firstSwitch)
    }
    // Add assertions if needed
  },
}

const InteractiveDemoRenderer = (args: Story['args']) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [outline, setOutline] = React.useState(true)
  const [switches, setSwitches] = React.useState({
    notifications: false,
    darkMode: true,
    autoSave: true,
    betaFeatures: false,
    premium: false,
  })

  const handleSwitchChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSwitches(prev => ({ ...prev, [key]: e.target.checked }))
    }

  return (
    <div className="w-[600px] space-y-6">
      <div className="p-4 bg-white rounded-lg border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              className="w-full p-2 border rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sacred">Sacred</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={outline}
                onChange={e => setOutline(e.target.checked)}
              />
              Show Outline
            </label>
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg space-y-4 ${
          theme === 'sacred'
            ? 'bg-black/90 border border-yellow-400/30'
            : theme === 'dark'
              ? 'bg-gray-900'
              : 'bg-gray-50'
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            theme === 'sacred'
              ? 'text-yellow-400 font-cinzel'
              : theme === 'dark'
                ? 'text-gray-200 font-inter'
                : 'text-gray-900 font-inter'
          }`}
        >
          Interactive Switch Demo
        </h3>

        <div className="space-y-4">
          <Switch
            {...args}
            checked={switches.notifications}
            onChange={handleSwitchChange('notifications')}
            rightLabel="Enable Notifications"
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.darkMode}
            onChange={handleSwitchChange('darkMode')}
            rightLabel={theme === 'sacred' ? 'Sacred Mode' : 'Dark Mode'}
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.autoSave}
            onChange={handleSwitchChange('autoSave')}
            rightLabel="Auto-save"
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.betaFeatures}
            onChange={handleSwitchChange('betaFeatures')}
            rightLabel={theme === 'sacred' ? 'Ancient Powers' : 'Beta Features'}
            styles={{ theme, outline }}
          />
          <Switch
            {...args}
            checked={switches.premium}
            onChange={handleSwitchChange('premium')}
            rightLabel={
              theme === 'sacred' ? 'Divine Blessings' : 'Premium Features'
            }
            disabled={!switches.darkMode}
            styles={{ theme, outline }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * 6) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: args => <InteractiveDemoRenderer {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test interactive switches
    const switches = canvas.getAllByRole('checkbox')
    expect(switches.length).toBeGreaterThan(0)

    // Test theme selector
    const themeSelect = canvas.getByDisplayValue('Light')
    await userEvent.selectOptions(themeSelect, 'sacred')

    // Test switch interactions
    const first = switches.at(0)
    const fourth = switches.at(3)
    if (first) await userEvent.click(first)
    if (fourth) await userEvent.click(fourth)
  },
}

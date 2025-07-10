// src/components/Checkbox/checkbox.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import Checkbox from './index'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
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
        Premium Checkbox Styles
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Unchecked</h4>
          <Checkbox
            {...args}
            checked={false}
            sacredtheme={false}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Checked</h4>
          <Checkbox
            {...args}
            checked={true}
            sacredtheme={false}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Indeterminate</h4>
          <Checkbox
            {...args}
            indeterminate={true}
            sacredtheme={false}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Disabled</h4>
          <Checkbox
            {...args}
            checked={true}
            disabled={true}
            sacredtheme={false}
            outline={true}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Without Outline
        </h4>
        <div className="flex gap-8">
          <Checkbox
            {...args}
            checked={false}
            sacredtheme={false}
            outline={false}
          />
          <Checkbox
            {...args}
            checked={true}
            sacredtheme={false}
            outline={false}
          />
          <Checkbox
            {...args}
            indeterminate={true}
            sacredtheme={false}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test interactive checkboxes
    const checkboxes = canvas.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)

    // Click an unchecked checkbox
    await userEvent.click(checkboxes[0])
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
        Sacred Mystical Checkboxes
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-300">Dormant</h4>
          <Checkbox
            {...args}
            checked={false}
            sacredtheme={true}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-300">Awakened</h4>
          <Checkbox
            {...args}
            checked={true}
            sacredtheme={true}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-300">Transcendent</h4>
          <Checkbox
            {...args}
            indeterminate={true}
            sacredtheme={true}
            outline={true}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-300">Sealed</h4>
          <Checkbox
            {...args}
            checked={true}
            disabled={true}
            sacredtheme={true}
            outline={true}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Pure Essence (No Outline)
        </h4>
        <div className="flex gap-12">
          <Checkbox
            {...args}
            checked={false}
            sacredtheme={true}
            outline={false}
          />
          <Checkbox
            {...args}
            checked={true}
            sacredtheme={true}
            outline={false}
          />
          <Checkbox
            {...args}
            indeterminate={true}
            sacredtheme={true}
            outline={false}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme checkboxes
    const checkboxes = canvas.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)

    // Click a sacred checkbox
    await userEvent.click(checkboxes[0])
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
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={true}
              sacredtheme={false}
              outline={true}
            />
            <span className="text-gray-700">
              Modern glassmorphism design with smooth animations
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              indeterminate={true}
              sacredtheme={false}
              outline={true}
            />
            <span className="text-gray-700">
              Professional indeterminate state for partial selections
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={false}
              sacredtheme={false}
              outline={false}
            />
            <span className="text-gray-700">
              Clean variant without borders for minimal design
            </span>
          </div>
        </div>
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={true}
              sacredtheme={true}
              outline={true}
            />
            <span className="text-yellow-200">
              Mystical golden glow with Egyptian hieroglyphic elements
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              indeterminate={true}
              sacredtheme={true}
              outline={true}
            />
            <span className="text-yellow-200">
              Transcendent state with divine energy radiating outward
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={false}
              sacredtheme={true}
              outline={false}
            />
            <span className="text-yellow-200">
              Pure essence variant focusing on spiritual connection
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    const checkboxes = canvas.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(6)

    // Test interactions
    await userEvent.click(checkboxes[2])
    await userEvent.click(checkboxes[5])
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
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              With Outline & Accent (Default)
            </h4>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={false}
                  outline={true}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">Unchecked</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={true}
                  outline={true}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">Checked with glow</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  indeterminate={true}
                  outline={true}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">Indeterminate</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              Without Outline
            </h4>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={false}
                  outline={false}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">Clean unchecked</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={true}
                  outline={false}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">Clean checked</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  indeterminate={true}
                  outline={false}
                  sacredtheme={false}
                />
                <span className="text-sm text-gray-600">
                  Clean indeterminate
                </span>
              </div>
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
          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              With Sacred Glow (Default)
            </h4>
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={false}
                  outline={true}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">Dormant state</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={true}
                  outline={true}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">
                  Divine awakening
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  indeterminate={true}
                  outline={true}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">
                  Transcendent power
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Pure Essence (No Outline)
            </h4>
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={false}
                  outline={false}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">
                  Silent meditation
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  checked={true}
                  outline={false}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">
                  Inner enlightenment
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...args}
                  indeterminate={true}
                  outline={false}
                  sacredtheme={true}
                />
                <span className="text-sm text-yellow-200">
                  Spiritual balance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outline variants
    const checkboxes = canvas.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(12)

    // Test interactions with different variants
    await userEvent.click(checkboxes[0])
    await userEvent.click(checkboxes[6])
  },
}

/**
 * 5) Interactive Demo
 */
const InteractiveDemoComponent: React.FC<
  React.ComponentProps<typeof Checkbox>
> = args => {
  const [config, setConfig] = React.useState({
    checked: false,
    indeterminate: false,
    disabled: false,
    sacredtheme: false,
    outline: true,
  })

  const [clickCount, setClickCount] = React.useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, checked: e.target.checked, indeterminate: false })
    setClickCount(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Checkbox Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-end space-y-2">
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
          </div>
          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.indeterminate}
                onChange={e =>
                  setConfig({
                    ...config,
                    indeterminate: e.target.checked,
                    checked: false,
                  })
                }
                className="mr-2"
              />
              Indeterminate
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
          <div className="flex flex-col justify-center">
            <div className="text-sm text-gray-600">
              Clicked {clickCount} times
            </div>
            <div className="text-sm text-gray-600">
              State:{' '}
              {config.indeterminate
                ? 'Indeterminate'
                : config.checked
                  ? 'Checked'
                  : 'Unchecked'}
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox Display */}
      <div
        className={
          config.sacredtheme
            ? 'bg-black/90 p-8 rounded-xl flex justify-center'
            : 'p-8 flex justify-center'
        }
      >
        <div className="flex items-center space-x-4">
          <Checkbox
            {...args}
            checked={config.checked}
            indeterminate={config.indeterminate}
            disabled={config.disabled}
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            onChange={handleChange}
          />
          <span
            className={`text-lg font-medium ${config.sacredtheme ? 'text-yellow-200 font-cinzel' : 'text-gray-700'}`}
          >
            {config.sacredtheme
              ? 'Divine Selection Ritual'
              : 'Interactive Checkbox Demo'}
          </span>
        </div>
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: args => <InteractiveDemoComponent {...args} />,
}

/**
 * 6) Form Integration Example
 */
const FormIntegrationExampleComponent: React.FC<
  React.ComponentProps<typeof Checkbox>
> = args => {
  const [formData, setFormData] = React.useState({
    newsletter: false,
    terms: false,
    notifications: 'some', // for indeterminate state
    marketing: true,
  })

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.checked })
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Form */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Premium Form Example
        </h3>
        <form className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.newsletter}
              onChange={handleChange('newsletter')}
              sacredtheme={false}
              outline={true}
            />
            <label className="text-gray-700">Subscribe to newsletter</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.terms}
              onChange={handleChange('terms')}
              sacredtheme={false}
              outline={true}
            />
            <label className="text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              indeterminate={formData.notifications === 'some'}
              checked={formData.notifications === 'all'}
              sacredtheme={false}
              outline={true}
            />
            <label className="text-gray-700">
              Enable notifications (partial)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.marketing}
              onChange={handleChange('marketing')}
              sacredtheme={false}
              outline={false}
            />
            <label className="text-gray-700">
              Marketing communications (no outline)
            </label>
          </div>
        </form>
      </div>

      {/* Sacred Form */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Covenant Form
        </h3>
        <form className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.newsletter}
              onChange={handleChange('newsletter')}
              sacredtheme={true}
              outline={true}
            />
            <label className="text-yellow-200">
              Receive divine revelations
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.terms}
              onChange={handleChange('terms')}
              sacredtheme={true}
              outline={true}
            />
            <label className="text-yellow-200">
              Accept the sacred covenant
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              indeterminate={formData.notifications === 'some'}
              checked={formData.notifications === 'all'}
              sacredtheme={true}
              outline={true}
            />
            <label className="text-yellow-200">
              Enable mystical notifications
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              {...args}
              checked={formData.marketing}
              onChange={handleChange('marketing')}
              sacredtheme={true}
              outline={false}
            />
            <label className="text-yellow-200">
              Spiritual communications (pure essence)
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}

export const FormIntegrationExample: Story = {
  name: 'Form Integration Example',
  render: args => <FormIntegrationExampleComponent {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test form interactions
    const checkboxes = canvas.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(8)

    // Click some checkboxes
    await userEvent.click(checkboxes[0])
    await userEvent.click(checkboxes[4])
  },
}

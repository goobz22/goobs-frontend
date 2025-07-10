// src/components/Widget/widget.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import Widget from './index'

const meta: Meta<typeof Widget> = {
  title: 'Components/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
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
        Premium Widget Styles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Standard Widget
          </h4>
          <Widget {...args} sacredtheme={false} outline={true}>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">
                User Profile
              </h5>
              <p className="text-gray-600 mb-4">
                Manage your account settings and preferences.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@example.com</p>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Statistics Widget
          </h4>
          <Widget {...args} sacredtheme={false} outline={true}>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Stats
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-xs text-gray-500">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Without Outline
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Widget {...args} sacredtheme={false} outline={false}>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">
                Clean Design
              </h5>
              <p className="text-gray-600">
                This widget uses a minimal outline-free design for a cleaner
                look.
              </p>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={false} outline={false}>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">
                Subtle Styling
              </h5>
              <p className="text-gray-600">
                Perfect for applications that prefer understated UI elements.
              </p>
            </div>
          </Widget>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">
          Disabled State
        </h4>
        <Widget {...args} disabled={true} sacredtheme={false} outline={true}>
          <div>
            <h5 className="text-lg font-semibold text-gray-500 mb-2">
              Disabled Widget
            </h5>
            <p className="text-gray-400">
              This widget is disabled and cannot be interacted with.
            </p>
          </div>
        </Widget>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test that widgets are rendered
    const widgets = canvas.getAllByText(/User Profile|Monthly Stats/i)
    expect(widgets.length).toBeGreaterThan(0)
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
        Sacred Mystical Widgets
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Divine Knowledge
          </h4>
          <Widget {...args} sacredtheme={true} outline={true}>
            <div>
              <h5 className="text-lg font-semibold text-yellow-400 mb-2 font-cinzel">
                Ancient Wisdom
              </h5>
              <p className="text-yellow-200 mb-4">
                Channel the power of the ancients through sacred knowledge.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40">
                  <span className="text-yellow-400 font-semibold">𓂀</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-300">
                    High Priest Amenhotep
                  </p>
                  <p className="text-xs text-yellow-400/70">
                    Guardian of Sacred Texts
                  </p>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-300 mb-3">
            Mystical Metrics
          </h4>
          <Widget {...args} sacredtheme={true} outline={true}>
            <div>
              <h5 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel">
                Divine Statistics
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">777</div>
                  <div className="text-xs text-yellow-300">Sacred Rituals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">∞</div>
                  <div className="text-xs text-yellow-300">Eternal Power</div>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Pure Essence (No Outline)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Widget {...args} sacredtheme={true} outline={false}>
            <div>
              <h5 className="text-lg font-semibold text-yellow-400 mb-2 font-cinzel">
                Spiritual Essence
              </h5>
              <p className="text-yellow-200">
                This widget channels pure spiritual energy without material
                boundaries.
              </p>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={true} outline={false}>
            <div>
              <h5 className="text-lg font-semibold text-yellow-400 mb-2 font-cinzel">
                Divine Presence
              </h5>
              <p className="text-yellow-200">
                Experience the raw power of the divine without earthly
                constraints.
              </p>
            </div>
          </Widget>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-yellow-300 mb-4">
          Sealed Powers
        </h4>
        <Widget {...args} disabled={true} sacredtheme={true} outline={true}>
          <div>
            <h5 className="text-lg font-semibold text-yellow-400/50 mb-2 font-cinzel">
              Forbidden Knowledge
            </h5>
            <p className="text-yellow-200/50">
              This ancient wisdom has been sealed away for protection.
            </p>
          </div>
        </Widget>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme widgets
    const sacredWidgets = canvas.getAllByText(
      /Ancient Wisdom|Divine Statistics/i
    )
    expect(sacredWidgets.length).toBeGreaterThan(0)
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
          <Widget {...args} sacredtheme={false} outline={true}>
            <div>
              <h5 className="text-md font-semibold text-gray-900 mb-2">
                Modern Dashboard
              </h5>
              <p className="text-sm text-gray-600 mb-3">
                Professional glassmorphism design with subtle animations
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Updated: 2 min ago
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={false} outline={false}>
            <div>
              <h5 className="text-md font-semibold text-gray-900 mb-2">
                Clean Interface
              </h5>
              <p className="text-sm text-gray-600">
                Minimal design without borders for modern applications
              </p>
            </div>
          </Widget>
        </div>
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <div className="space-y-4">
          <Widget {...args} sacredtheme={true} outline={true}>
            <div>
              <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                Mystical Portal
              </h5>
              <p className="text-sm text-yellow-200 mb-3">
                Ancient Egyptian design with floating hieroglyphs and golden
                auras
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-300">
                  Last Ritual: Dawn
                </span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-yellow-400/50 shadow-lg"></div>
              </div>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={true} outline={false}>
            <div>
              <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                Pure Spirit
              </h5>
              <p className="text-sm text-yellow-200">
                Essence without boundaries, channeling raw divine energy
              </p>
            </div>
          </Widget>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    const allWidgets = canvas.getAllByText(
      /Modern Dashboard|Clean Interface|Mystical Portal|Pure Spirit/i
    )
    expect(allWidgets.length).toBe(4)
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
            <Widget {...args} outline={true} sacredtheme={false}>
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-2">
                  Professional Widget
                </h5>
                <p className="text-sm text-gray-600">
                  Features blue accent bar and subtle borders with glassmorphism
                  effects
                </p>
              </div>
            </Widget>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-700">
              Without Outline
            </h4>
            <Widget {...args} outline={false} sacredtheme={false}>
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-2">
                  Minimal Widget
                </h5>
                <p className="text-sm text-gray-600">
                  Clean design without borders for a more subtle presence
                </p>
              </div>
            </Widget>
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
            <Widget {...args} outline={true} sacredtheme={true}>
              <div>
                <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                  Divine Container
                </h5>
                <p className="text-sm text-yellow-200">
                  Features golden borders, floating hieroglyphs, and mystical
                  aura effects
                </p>
              </div>
            </Widget>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-medium text-yellow-300">
              Pure Essence (No Outline)
            </h4>
            <Widget {...args} outline={false} sacredtheme={true}>
              <div>
                <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                  Spiritual Vessel
                </h5>
                <p className="text-sm text-yellow-200">
                  Pure energy without material constraints, still featuring
                  sacred glyphs
                </p>
              </div>
            </Widget>
          </div>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outline variants
    const outlineWidgets = canvas.getAllByText(
      /Professional Widget|Minimal Widget|Divine Container|Spiritual Vessel/i
    )
    expect(outlineWidgets.length).toBe(4)
  },
}

/**
 * Interactive Demo Component
 */
const InteractiveDemoComponent = (
  args: React.ComponentProps<typeof Widget>
) => {
  const [config, setConfig] = React.useState({
    sacredtheme: false,
    outline: true,
    disabled: false,
  })

  const [content, setContent] = React.useState<{
    title: string
    description: string
    metrics:
      | { users: number; uptime: number }
      | { rituals: number; power: string }
  }>({
    title: 'Interactive Widget',
    description: 'This widget updates based on your configuration.',
    metrics: {
      users: 1247,
      uptime: 98.5,
    },
  })

  const [hoverCount, setHoverCount] = React.useState(0)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Widget Configuration
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sacredtheme}
              onChange={e => {
                const newTheme = e.target.checked
                setConfig({ ...config, sacredtheme: newTheme })
                setContent({
                  title: newTheme
                    ? 'Sacred Mystical Widget'
                    : 'Interactive Widget',
                  description: newTheme
                    ? 'Channel ancient powers through this sacred vessel.'
                    : 'This widget updates based on your configuration.',
                  metrics: newTheme
                    ? { rituals: 777, power: '∞' }
                    : { users: 1247, uptime: 98.5 },
                })
              }}
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
        <div className="text-sm text-gray-600">Hover count: {hoverCount}</div>
      </div>

      {/* Widget Display */}
      <div
        className={
          config.sacredtheme
            ? 'bg-black/90 p-8 rounded-xl flex justify-center'
            : 'p-8 flex justify-center'
        }
      >
        <div onMouseEnter={() => setHoverCount(prev => prev + 1)}>
          <Widget
            {...args}
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            disabled={config.disabled}
          >
            <div>
              <h5
                className={`text-lg font-semibold mb-3 ${config.sacredtheme ? 'text-yellow-400 font-cinzel' : 'text-gray-900'}`}
              >
                {content.title}
              </h5>
              <p
                className={`mb-4 ${config.sacredtheme ? 'text-yellow-200' : 'text-gray-600'}`}
              >
                {content.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {config.sacredtheme ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {
                          (
                            content.metrics as {
                              rituals: number
                              power: string
                            }
                          ).rituals
                        }
                      </div>
                      <div className="text-xs text-yellow-300">
                        Sacred Rituals
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {
                          (
                            content.metrics as {
                              rituals: number
                              power: string
                            }
                          ).power
                        }
                      </div>
                      <div className="text-xs text-yellow-300">
                        Divine Power
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          (content.metrics as { users: number; uptime: number })
                            .users
                        }
                      </div>
                      <div className="text-xs text-gray-500">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          (content.metrics as { users: number; uptime: number })
                            .uptime
                        }
                        %
                      </div>
                      <div className="text-xs text-gray-500">Uptime</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Widget>
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
  render: args => <InteractiveDemoComponent {...args} />,
}

/**
 * 6) Dashboard Example
 */
export const DashboardExample: Story = {
  name: 'Dashboard Example',
  render: args => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Premium Dashboard */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">
          Modern Dashboard
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Widget {...args} sacredtheme={false} outline={true}>
            <div>
              <h5 className="text-md font-semibold text-gray-900 mb-2">
                Sales Overview
              </h5>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">$12.4K</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">+15%</div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">847</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
              </div>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={false} outline={false}>
            <div>
              <h5 className="text-md font-semibold text-gray-900 mb-2">
                Recent Activity
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    New user registered
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Payment processed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Server maintenance
                  </span>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      </div>

      {/* Sacred Dashboard */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Mystical Command Center
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Widget {...args} sacredtheme={true} outline={true}>
            <div>
              <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                Divine Metrics
              </h5>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-yellow-400">777</div>
                  <div className="text-xs text-yellow-300">Souls</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">+∞</div>
                  <div className="text-xs text-yellow-300">Power</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">13</div>
                  <div className="text-xs text-yellow-300">Rituals</div>
                </div>
              </div>
            </div>
          </Widget>

          <Widget {...args} sacredtheme={true} outline={false}>
            <div>
              <h5 className="text-md font-semibold text-yellow-400 mb-2 font-cinzel">
                Sacred Events
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-200">
                    New acolyte initiated
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-200">
                    Ancient ritual completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-200">
                    Divine blessing received
                  </span>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test dashboard widgets
    const dashboardWidgets = canvas.getAllByText(
      /Sales Overview|Recent Activity|Divine Metrics|Sacred Events/i
    )
    expect(dashboardWidgets.length).toBe(4)
  },
}

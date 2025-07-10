import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Alert from './index'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    a11y: {
      disable: false,
    },
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
    sacredtheme: {
      control: 'boolean',
    },
    outline: {
      control: 'boolean',
    },
  },
}
export default meta

type Story = StoryObj<typeof Alert>

/**
 * 1) All Severity Types - Premium Theme
 */
export const PremiumSeverityTypes: Story = {
  name: 'Premium Theme - All Severity Types',
  render: args => (
    <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium Alert Styles
      </h3>
      <Alert
        {...args}
        severity="error"
        message="Error: Something went wrong with your request. Please try again or contact support."
        sacredtheme={false}
      />
      <Alert
        {...args}
        severity="warning"
        message="Warning: This action cannot be undone. Please review your changes carefully."
        sacredtheme={false}
      />
      <Alert
        {...args}
        severity="info"
        message="Info: New features have been added to your dashboard. Check them out in the settings panel."
        sacredtheme={false}
      />
      <Alert
        {...args}
        severity="success"
        message="Success: Your changes have been saved successfully and are now live."
        sacredtheme={false}
      />
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that all severity types are rendered
    expect(canvas.getByText(/Error: Something went wrong/)).toBeInTheDocument()
    expect(canvas.getByText(/Warning: This action cannot/)).toBeInTheDocument()
    expect(canvas.getByText(/Info: New features have been/)).toBeInTheDocument()
    expect(canvas.getByText(/Success: Your changes have/)).toBeInTheDocument()
  },
}

/**
 * 2) All Severity Types - Sacred Theme
 */
export const SacredSeverityTypes: Story = {
  name: 'Sacred Theme - All Severity Types',
  render: args => (
    <div className="bg-black/90 p-8 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred Alert Mysteries
      </h3>
      <div className="space-y-4">
        <Alert
          {...args}
          severity="error"
          message="Error: The sacred ritual has been disrupted. Dark forces interfere with the ancient magic."
          sacredtheme={true}
        />
        <Alert
          {...args}
          severity="warning"
          message="Warning: The cosmic alignment approaches. Prepare for the celestial transformation."
          sacredtheme={true}
        />
        <Alert
          {...args}
          severity="info"
          message="Info: Ancient scrolls have been discovered in the temple archives. Divine knowledge awaits."
          sacredtheme={true}
        />
        <Alert
          {...args}
          severity="success"
          message="Success: The sacred ceremony is complete. Divine blessings have been bestowed upon the realm."
          sacredtheme={true}
        />
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that all sacred severity types are rendered
    expect(canvas.getByText(/Error: The sacred ritual/)).toBeInTheDocument()
    expect(
      canvas.getByText(/Warning: The cosmic alignment/)
    ).toBeInTheDocument()
    expect(canvas.getByText(/Info: Ancient scrolls have/)).toBeInTheDocument()
    expect(canvas.getByText(/Success: The sacred ceremony/)).toBeInTheDocument()
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
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
          Premium Theme
        </h3>
        <Alert
          {...args}
          severity="error"
          message="Premium error alert with glassmorphism effects and modern styling."
          sacredtheme={false}
        />
        <Alert
          {...args}
          severity="success"
          message="Premium success alert with smooth animations and professional design."
          sacredtheme={false}
        />
      </div>

      {/* Sacred Theme */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>
        <Alert
          {...args}
          severity="error"
          message="Sacred error alert with mystical glowing effects and Egyptian hieroglyphs."
          sacredtheme={true}
        />
        <Alert
          {...args}
          severity="success"
          message="Sacred success alert with divine golden auras and ancient temple styling."
          sacredtheme={true}
        />
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test both themes
    expect(
      canvas.getByText(/Premium error alert with glassmorphism/)
    ).toBeInTheDocument()
    expect(
      canvas.getByText(/Sacred error alert with mystical/)
    ).toBeInTheDocument()
  },
}

// Component for dismissible alerts story
const DismissibleAlertsComponent = (
  args: React.ComponentProps<typeof Alert>
) => {
  const [alerts, setAlerts] = React.useState([
    {
      id: 1,
      severity: 'info' as const,
      message: 'This premium alert can be dismissed by clicking the X button.',
      theme: false,
    },
    {
      id: 2,
      severity: 'warning' as const,
      message:
        'This sacred alert contains mystical powers and can be banished.',
      theme: true,
    },
    {
      id: 3,
      severity: 'success' as const,
      message: 'This premium success message will fade away when dismissed.',
      theme: false,
    },
  ])

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Premium Dismissible Alerts
        </h3>
        {alerts
          .filter(alert => !alert.theme)
          .map(alert => (
            <Alert
              key={alert.id}
              {...args}
              severity={alert.severity}
              message={alert.message}
              onClose={() => handleDismiss(alert.id)}
              sacredtheme={false}
            />
          ))}
      </div>

      <div className="bg-black/90 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel">
          Sacred Dismissible Alerts
        </h3>
        <div className="space-y-4">
          {alerts
            .filter(alert => alert.theme)
            .map(alert => (
              <Alert
                key={alert.id}
                {...args}
                severity={alert.severity}
                message={alert.message}
                onClose={() => handleDismiss(alert.id)}
                sacredtheme={true}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 4) Dismissible Alerts
 */
export const DismissibleAlerts: Story = {
  name: 'Dismissible Alerts',
  render: args => <DismissibleAlertsComponent {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find and click a close button
    const closeButtons = canvas.getAllByText('✕')
    expect(closeButtons.length).toBeGreaterThan(0)

    // Click the first close button
    await userEvent.click(closeButtons[0])

    // The alert should start fading (we can't easily test the removal due to timeout)
  },
}

/**
 * 5) Outline Variants
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

        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">
            With Outline & Accent (Default)
          </h4>
          <Alert
            {...args}
            severity="info"
            message="Premium alert with elegant borders, shadows, and colored accent bar."
            outline={true}
            sacredtheme={false}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">Without Outline</h4>
          <Alert
            {...args}
            severity="info"
            message="Premium alert with minimal styling and no borders for seamless integration."
            outline={false}
            sacredtheme={false}
          />
        </div>
      </div>

      {/* Sacred Theme Outline Variants */}
      <div className="bg-black/90 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
          Sacred Theme
        </h3>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-yellow-300">
            With Sacred Glow (Default)
          </h4>
          <Alert
            {...args}
            severity="warning"
            message="Sacred alert with mystical golden borders and divine glowing effects."
            outline={true}
            sacredtheme={true}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium text-yellow-300">
            Without Outline
          </h4>
          <Alert
            {...args}
            severity="warning"
            message="Sacred alert focusing on divine content without distracting borders."
            outline={false}
            sacredtheme={true}
          />
        </div>
      </div>
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test outline variants
    expect(
      canvas.getByText(/Premium alert with elegant borders/)
    ).toBeInTheDocument()
    expect(
      canvas.getByText(/Premium alert with minimal styling/)
    ).toBeInTheDocument()
    expect(
      canvas.getByText(/Sacred alert with mystical golden/)
    ).toBeInTheDocument()
    expect(
      canvas.getByText(/Sacred alert focusing on divine/)
    ).toBeInTheDocument()
  },
}

// Component for interactive demo story
const InteractiveDemoComponent = (args: React.ComponentProps<typeof Alert>) => {
  const [config, setConfig] = React.useState({
    severity: 'info' as 'error' | 'warning' | 'info' | 'success',
    sacredtheme: false,
    outline: true,
    dismissible: true,
  })

  const [showAlert, setShowAlert] = React.useState(true)

  const messages = {
    error: {
      premium: 'Something went wrong! Please check your input and try again.',
      sacred:
        'The ancient powers have been disturbed! Dark forces block the path.',
    },
    warning: {
      premium: 'Please review your changes before proceeding with this action.',
      sacred: 'The cosmic energies shift! Proceed with divine caution.',
    },
    info: {
      premium: 'Here is some important information for your reference.',
      sacred: 'Ancient wisdom reveals itself! Sacred knowledge awaits.',
    },
    success: {
      premium:
        'Operation completed successfully! Everything is working perfectly.',
      sacred: 'Divine blessing achieved! The sacred ritual is complete.',
    },
  }

  const currentMessage =
    messages[config.severity][config.sacredtheme ? 'sacred' : 'premium']

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alert Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={config.severity}
              onChange={e =>
                setConfig({
                  ...config,
                  severity: e.target.value as
                    | 'error'
                    | 'warning'
                    | 'info'
                    | 'success',
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
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
          </div>
          <div className="flex flex-col justify-end">
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
          <div className="flex flex-col justify-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.dismissible}
                onChange={e =>
                  setConfig({ ...config, dismissible: e.target.checked })
                }
                className="mr-2"
              />
              Dismissible
            </label>
          </div>
        </div>
        <button
          onClick={() => setShowAlert(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Show Alert
        </button>
      </div>

      {/* Alert Display */}
      <div
        className={config.sacredtheme ? 'bg-black/90 p-6 rounded-xl' : 'p-4'}
      >
        {showAlert && (
          <Alert
            {...args}
            severity={config.severity}
            message={currentMessage}
            sacredtheme={config.sacredtheme}
            outline={config.outline}
            onClose={config.dismissible ? () => setShowAlert(false) : undefined}
          />
        )}
      </div>
    </div>
  )
}

/**
 * 6) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: args => <InteractiveDemoComponent {...args} />,
}

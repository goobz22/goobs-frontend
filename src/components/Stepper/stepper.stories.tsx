// src/components/Stepper/stepper.stories.tsx

import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Stepper, { StepperProps } from './index'

// Mock Dialog Component
const Dialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  theme?: 'light' | 'dark' | 'sacred'
}> = ({ isOpen, onClose, title, children, theme = 'light' }) => {
  if (!isOpen) return null

  const themeStyles = {
    light: {
      overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
      dialog:
        'fixed inset-4 max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-2xl',
      header: 'px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl',
      title: 'text-xl font-semibold text-gray-900',
      content: 'p-6 max-h-[70vh] overflow-y-auto',
    },
    dark: {
      overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm',
      dialog:
        'fixed inset-4 max-w-4xl mx-auto my-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700',
      header: 'px-6 py-4 border-b border-gray-700 bg-gray-900 rounded-t-xl',
      title: 'text-xl font-semibold text-gray-100',
      content: 'p-6 max-h-[70vh] overflow-y-auto',
    },
    sacred: {
      overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm',
      dialog:
        'fixed inset-4 max-w-4xl mx-auto my-8 bg-black/95 rounded-xl shadow-2xl border-2 border-yellow-400/30',
      header:
        'px-6 py-4 border-b border-yellow-400/30 bg-black/80 rounded-t-xl',
      title: 'text-xl font-semibold text-yellow-400 font-serif',
      content: 'p-6 max-h-[70vh] overflow-y-auto',
    },
  }

  const styles = themeStyles[theme]

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className="flex items-center justify-between">
            <h2 className={styles.title}>{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

// Mock Form Components
const FormField: React.FC<{
  label: string
  children: React.ReactNode
  theme?: 'light' | 'dark' | 'sacred'
}> = ({ label, children, theme = 'light' }) => {
  const labelStyles = {
    light: 'block text-sm font-medium text-gray-700 mb-2',
    dark: 'block text-sm font-medium text-gray-300 mb-2',
    sacred: 'block text-sm font-medium text-yellow-400 mb-2 font-serif',
  }

  return (
    <div className="mb-4">
      <label className={labelStyles[theme]}>{label}</label>
      {children}
    </div>
  )
}

const Input: React.FC<{
  placeholder?: string
  type?: string
  theme?: 'light' | 'dark' | 'sacred'
}> = ({ placeholder, type = 'text', theme = 'light' }) => {
  const inputStyles = {
    light:
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    dark: 'w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    sacred:
      'w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent',
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={inputStyles[theme]}
    />
  )
}

const Button: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  theme?: 'light' | 'dark' | 'sacred'
  onClick?: () => void
  disabled?: boolean
}> = ({
  children,
  variant = 'primary',
  theme = 'light',
  onClick,
  disabled,
}) => {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    light: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    dark: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-gray-100 hover:bg-gray-500',
    },
    sacred: {
      primary: 'bg-yellow-600 text-black hover:bg-yellow-500',
      secondary:
        'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 border border-yellow-400/30',
    },
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[theme][variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive stepper component for multi-step processes, wizards, and workflows.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Stepper>

/**
 * Account Setup Wizard - A typical onboarding flow with user registration
 */
export const AccountSetupWizard: Story = {
  name: 'Account Setup Wizard',
  render: () => {
    const Component = () => {
      const [isOpen, setIsOpen] = useState(true)

      const wizardSteps: StepperProps['steps'] = [
        {
          stepNumber: 1,
          label: 'Personal Info',
          stepLink: '#personal',
          status: 'completed',
          description: 'Basic personal information and contact details',
        },
        {
          stepNumber: 2,
          label: 'Account Details',
          stepLink: '#account',
          status: 'active',
          description: 'Username, password, and security preferences',
        },
        {
          stepNumber: 3,
          label: 'Preferences',
          stepLink: '#preferences',
          status: 'inactive',
          description: 'Customize your experience and notification settings',
        },
        {
          stepNumber: 4,
          label: 'Verification',
          stepLink: '#verify',
          status: 'inactive',
          description: 'Verify your email address and complete setup',
        },
      ]

      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <Button onClick={() => setIsOpen(true)}>
            Open Account Setup Wizard
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Create Your Account"
            theme="light"
          >
            <div className="space-y-8">
              <Stepper
                steps={wizardSteps}
                styles={{
                  theme: 'light',
                  orientation: 'horizontal',
                }}
              />

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Step 2: Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Username">
                    <Input placeholder="Enter username" />
                  </FormField>
                  <FormField label="Email">
                    <Input type="email" placeholder="your@email.com" />
                  </FormField>
                  <FormField label="Password">
                    <Input type="password" placeholder="Enter password" />
                  </FormField>
                  <FormField label="Confirm Password">
                    <Input type="password" placeholder="Confirm password" />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary">← Previous</Button>
                <Button>Continue →</Button>
              </div>
            </div>
          </Dialog>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * E-commerce Checkout Process with error handling
 */
export const CheckoutProcess: Story = {
  name: 'E-commerce Checkout',
  render: () => {
    const Component = () => {
      const [isOpen, setIsOpen] = useState(true)

      const checkoutSteps: StepperProps['steps'] = [
        {
          stepNumber: 1,
          label: 'Cart Review',
          stepLink: '#cart',
          status: 'completed',
        },
        {
          stepNumber: 2,
          label: 'Shipping',
          stepLink: '#shipping',
          status: 'completed',
        },
        {
          stepNumber: 3,
          label: 'Payment',
          stepLink: '#payment',
          status: 'error',
          description:
            'Payment method declined. Please try a different card or payment method.',
        },
        {
          stepNumber: 4,
          label: 'Confirmation',
          stepLink: '#confirm',
          status: 'inactive',
        },
      ]

      return (
        <div className="min-h-screen bg-gray-900 p-8">
          <Button onClick={() => setIsOpen(true)} theme="dark">
            Open Checkout
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Complete Your Purchase"
            theme="dark"
          >
            <div className="space-y-8">
              <Stepper
                steps={checkoutSteps}
                styles={{
                  theme: 'dark',
                  orientation: 'horizontal',
                }}
              />

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-400">
                  Payment Error
                </h3>
                <p className="text-gray-300 mb-4">
                  Your payment could not be processed. Please check your payment
                  information and try again.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Card Number" theme="dark">
                    <Input placeholder="1234 5678 9012 3456" theme="dark" />
                  </FormField>
                  <FormField label="Expiry Date" theme="dark">
                    <Input placeholder="MM/YY" theme="dark" />
                  </FormField>
                  <FormField label="CVV" theme="dark">
                    <Input placeholder="123" theme="dark" />
                  </FormField>
                  <FormField label="Cardholder Name" theme="dark">
                    <Input placeholder="John Doe" theme="dark" />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" theme="dark">
                  ← Back to Shipping
                </Button>
                <Button theme="dark">Retry Payment</Button>
              </div>
            </div>
          </Dialog>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * Dark Configuration Process - Themed setup
 */
export const DarkConfigurationSetup: Story = {
  name: 'Dark Configuration Process',
  render: () => {
    const Component = () => {
      const [isOpen, setIsOpen] = useState(true)

      const configSteps: StepperProps['steps'] = [
        {
          stepNumber: 1,
          label: 'Preparation',
          stepLink: '#prepare',
          status: 'completed',
          description:
            'Gather the required components and prepare the workspace',
        },
        {
          stepNumber: 2,
          label: 'Initialization',
          stepLink: '#init',
          status: 'completed',
          description:
            'Set up initial parameters and establish the configuration',
        },
        {
          stepNumber: 3,
          label: 'Processing',
          stepLink: '#process',
          status: 'error',
          description:
            'The process encountered an error. Realign the parameters to proceed.',
        },
        {
          stepNumber: 4,
          label: 'Validation',
          stepLink: '#validate',
          status: 'inactive',
          description:
            'Validate the configuration and ensure all requirements are met',
        },
        {
          stepNumber: 5,
          label: 'Finalization',
          stepLink: '#finalize',
          status: 'inactive',
          description: 'Complete the process and finalize the configuration',
        },
      ]

      return (
        <div className="min-h-screen bg-black p-8">
          <Button onClick={() => setIsOpen(true)} theme="dark">
            Begin Configuration
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Configuration Process"
            theme="dark"
          >
            <div className="space-y-8">
              <Stepper
                steps={configSteps}
                styles={{
                  theme: 'dark',
                  orientation: 'horizontal',
                }}
              />

              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400 font-serif">
                  Realignment Required
                </h3>
                <p className="text-yellow-100 mb-6 font-serif">
                  Parameters are not properly aligned. Adjust the configuration
                  settings to continue.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Phase Alignment" theme="dark">
                    <select className="w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500">
                      <option>Phase 1</option>
                      <option>Phase 2</option>
                      <option>Phase 3</option>
                      <option>Phase 4</option>
                    </select>
                  </FormField>
                  <FormField label="Focus Mode" theme="dark">
                    <select className="w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500">
                      <option>Mode A</option>
                      <option>Mode B</option>
                      <option>Mode C</option>
                      <option>Mode D</option>
                    </select>
                  </FormField>
                  <FormField label="Frequency (Hz)" theme="dark">
                    <Input placeholder="432.0" theme="dark" />
                  </FormField>
                  <FormField label="Resonance Pattern" theme="dark">
                    <Input placeholder="Pattern Matrix" theme="dark" />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" theme="dark">
                  Return to Initialization
                </Button>
                <Button theme="dark">Realign Parameters</Button>
              </div>
            </div>
          </Dialog>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * Vertical Project Setup - Development workflow
 */
export const ProjectSetupFlow: Story = {
  name: 'Project Setup (Vertical)',
  render: () => {
    const Component = () => {
      const [isOpen, setIsOpen] = useState(true)

      const projectSteps: StepperProps['steps'] = [
        {
          stepNumber: 1,
          label: 'Project Initialization',
          stepLink: '#init',
          status: 'completed',
          description:
            'Create project structure and initialize version control',
        },
        {
          stepNumber: 2,
          label: 'Dependencies',
          stepLink: '#deps',
          status: 'completed',
          description: 'Install required packages and configure build tools',
        },
        {
          stepNumber: 3,
          label: 'Configuration',
          stepLink: '#config',
          status: 'active',
          description: 'Set up environment variables and application settings',
        },
        {
          stepNumber: 4,
          label: 'Database Setup',
          stepLink: '#database',
          status: 'inactive',
          description: 'Initialize database schema and seed data',
        },
        {
          stepNumber: 5,
          label: 'Testing',
          stepLink: '#testing',
          status: 'inactive',
          description: 'Configure test suites and run initial tests',
        },
        {
          stepNumber: 6,
          label: 'Deployment',
          stepLink: '#deploy',
          status: 'inactive',
          description: 'Set up CI/CD pipeline and deploy to staging',
        },
      ]

      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <Button onClick={() => setIsOpen(true)}>Open Project Setup</Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="New Project Setup"
            theme="light"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Stepper
                  steps={projectSteps}
                  styles={{
                    theme: 'light',
                    orientation: 'vertical',
                  }}
                />
              </div>

              <div className="lg:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900">
                    Step 3: Project Configuration
                  </h3>
                  <p className="text-blue-700 mb-6">
                    Configure your project settings and environment variables
                    for development and production.
                  </p>

                  <div className="space-y-4">
                    <FormField label="Project Name">
                      <Input placeholder="my-awesome-project" />
                    </FormField>
                    <FormField label="Environment">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Development</option>
                        <option>Staging</option>
                        <option>Production</option>
                      </select>
                    </FormField>
                    <FormField label="API Base URL">
                      <Input placeholder="https://api.example.com" />
                    </FormField>
                    <FormField label="Database URL">
                      <Input placeholder="postgresql://localhost:5432/mydb" />
                    </FormField>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      Configuration Tips:
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Use environment variables for sensitive data</li>
                      <li>
                        • Keep development and production configs separate
                      </li>
                      <li>
                        • Validate all required settings before proceeding
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="secondary">← Back to Dependencies</Button>
                  <Button>Continue to Database →</Button>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * Interactive Demo with Theme Switching
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => {
    const Component = () => {
      const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
      const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
        'horizontal'
      )
      const [currentStep, setCurrentStep] = useState(2)

      const demoSteps: StepperProps['steps'] = [
        {
          stepNumber: 1,
          label: 'Getting Started',
          stepLink: '#start',
          status: currentStep > 1 ? 'completed' : 'active',
          description: 'Learn the basics and set up your workspace',
        },
        {
          stepNumber: 2,
          label: 'Configuration',
          stepLink: '#config',
          status:
            currentStep === 2
              ? 'active'
              : currentStep > 2
                ? 'completed'
                : 'inactive',
          description: 'Customize settings and preferences',
        },
        {
          stepNumber: 3,
          label: 'Integration',
          stepLink: '#integration',
          status:
            currentStep === 3
              ? Math.random() > 0.5
                ? 'error'
                : 'active'
              : currentStep > 3
                ? 'completed'
                : 'inactive',
          description:
            currentStep === 3 && Math.random() > 0.5
              ? 'Connection failed. Check your API credentials and network settings.'
              : 'Connect with external services and APIs',
        },
        {
          stepNumber: 4,
          label: 'Finalization',
          stepLink: '#final',
          status:
            currentStep === 4
              ? 'active'
              : currentStep > 4
                ? 'completed'
                : 'inactive',
          description: 'Review and complete the setup process',
        },
      ]

      const themeClasses = {
        light: 'min-h-screen bg-gray-100 p-8',
        dark: 'min-h-screen bg-gray-900 p-8',
        sacred: 'min-h-screen bg-black p-8',
      }

      return (
        <div className={themeClasses[theme]}>
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 sacred:bg-black/50 rounded-lg p-6 border sacred:border-yellow-400/30">
              <h2 className="text-2xl font-bold mb-6 dark:text-white sacred:text-yellow-400">
                Interactive Stepper Demo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={e =>
                      setTheme(e.target.value as 'light' | 'dark' | 'sacred')
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="sacred">Sacred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={e =>
                      setOrientation(
                        e.target.value as 'horizontal' | 'vertical'
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400">
                    Current Step
                  </label>
                  <select
                    value={currentStep}
                    onChange={e => setCurrentStep(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg"
                  >
                    <option value={1}>Step 1</option>
                    <option value={2}>Step 2</option>
                    <option value={3}>Step 3 (Random Error)</option>
                    <option value={4}>Step 4</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() =>
                      setCurrentStep(Math.floor(Math.random() * 4) + 1)
                    }
                    theme={theme}
                  >
                    Randomize
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 sacred:bg-black/50 rounded-lg p-8 border sacred:border-yellow-400/30">
              <Stepper
                steps={demoSteps}
                styles={{
                  theme,
                  orientation,
                }}
              />
            </div>
          </div>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * Simple Theme Showcase
 */
export const ThemeShowcase: Story = {
  name: 'Theme Showcase',
  render: () => {
    const basicSteps: StepperProps['steps'] = [
      { stepNumber: 1, label: 'Start', stepLink: '#1', status: 'completed' },
      { stepNumber: 2, label: 'Progress', stepLink: '#2', status: 'active' },
      {
        stepNumber: 3,
        label: 'Error',
        stepLink: '#3',
        status: 'error',
        description: 'Something went wrong!',
      },
      { stepNumber: 4, label: 'Finish', stepLink: '#4', status: 'inactive' },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Stepper Theme Showcase
          </h1>

          {/* Light Theme */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Light Theme
            </h2>
            <Stepper steps={basicSteps} styles={{ theme: 'light' }} />
          </div>

          {/* Dark Theme */}
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">
              Dark Theme
            </h2>
            <Stepper steps={basicSteps} styles={{ theme: 'dark' }} />
          </div>
        </div>
      </div>
    )
  },
}

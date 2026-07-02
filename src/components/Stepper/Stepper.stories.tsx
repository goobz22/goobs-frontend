// src/components/Stepper/stepper.stories.tsx

import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within } from 'storybook/test'
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
  render: () => {
    const Component = () => {
      const [isOpen, setIsOpen] = useState(true)

      const wizardSteps: StepperProps['steps'] = [
        {
          label: 'Personal Info',
          stepLink: '#personal',
          status: 'completed',
          description: 'Basic personal information and contact details',
        },
        {
          label: 'Account Details',
          stepLink: '#account',
          status: 'active',
          description: 'Username, password, and security preferences',
        },
        {
          label: 'Preferences',
          stepLink: '#preferences',
          status: 'inactive',
          description: 'Customize your experience and notification settings',
        },
        {
          label: 'Verification',
          stepLink: '#verify',
          status: 'inactive',
          description: 'Verify your email address and complete setup',
        },
      ]

      return (
        <div
          style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px' }}
        >
          <Button onClick={() => setIsOpen(true)}>
            Open Account Setup Wizard
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Create Your Account"
            theme="light"
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <Stepper
                steps={wizardSteps}
                styles={{
                  theme: 'light',
                  orientation: 'horizontal',
                }}
              />

              <div
                style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '16px',
                  }}
                >
                  Step 2: Account Details
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
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

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          label: 'Cart Review',
          stepLink: '#cart',
          status: 'completed',
        },
        {
          label: 'Shipping',
          stepLink: '#shipping',
          status: 'completed',
        },
        {
          label: 'Payment',
          stepLink: '#payment',
          status: 'error',
          description:
            'Payment method declined. Please try a different card or payment method.',
        },
        {
          label: 'Confirmation',
          stepLink: '#confirm',
          status: 'inactive',
        },
      ]

      return (
        <div
          style={{ minHeight: '100vh', background: '#111827', padding: '32px' }}
        >
          <Button onClick={() => setIsOpen(true)} theme="dark">
            Open Checkout
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Complete Your Purchase"
            theme="dark"
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <Stepper
                steps={checkoutSteps}
                styles={{
                  theme: 'dark',
                  orientation: 'horizontal',
                }}
              />

              <div
                style={{
                  background: 'rgba(127, 29, 29, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: '#f87171',
                  }}
                >
                  Payment Error
                </h3>
                <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
                  Your payment could not be processed. Please check your payment
                  information and try again.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
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

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          label: 'Preparation',
          stepLink: '#prepare',
          status: 'completed',
          description:
            'Gather the required components and prepare the workspace',
        },
        {
          label: 'Initialization',
          stepLink: '#init',
          status: 'completed',
          description:
            'Set up initial parameters and establish the configuration',
        },
        {
          label: 'Processing',
          stepLink: '#process',
          status: 'error',
          description:
            'The process encountered an error. Realign the parameters to proceed.',
        },
        {
          label: 'Validation',
          stepLink: '#validate',
          status: 'inactive',
          description:
            'Validate the configuration and ensure all requirements are met',
        },
        {
          label: 'Finalization',
          stepLink: '#finalize',
          status: 'inactive',
          description: 'Complete the process and finalize the configuration',
        },
      ]

      return (
        <div
          style={{ minHeight: '100vh', background: '#000000', padding: '32px' }}
        >
          <Button onClick={() => setIsOpen(true)} theme="dark">
            Begin Configuration
          </Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Configuration Process"
            theme="dark"
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <Stepper
                steps={configSteps}
                styles={{
                  theme: 'dark',
                  orientation: 'horizontal',
                }}
              />

              <div
                style={{
                  background: 'rgba(250, 204, 21, 0.1)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: '#ffd700',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Realignment Required
                </h3>
                <p
                  style={{
                    color: '#fef9c3',
                    marginBottom: '24px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Parameters are not properly aligned. Adjust the configuration
                  settings to continue.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '24px',
                  }}
                >
                  <FormField label="Phase Alignment" theme="dark">
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid rgba(250, 204, 21, 0.3)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fef9c3',
                        borderRadius: '8px',
                      }}
                    >
                      <option>Phase 1</option>
                      <option>Phase 2</option>
                      <option>Phase 3</option>
                      <option>Phase 4</option>
                    </select>
                  </FormField>
                  <FormField label="Focus Mode" theme="dark">
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid rgba(250, 204, 21, 0.3)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fef9c3',
                        borderRadius: '8px',
                      }}
                    >
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

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          label: 'Project Initialization',
          stepLink: '#init',
          status: 'completed',
          description:
            'Create project structure and initialize version control',
        },
        {
          label: 'Dependencies',
          stepLink: '#deps',
          status: 'completed',
          description: 'Install required packages and configure build tools',
        },
        {
          label: 'Configuration',
          stepLink: '#config',
          status: 'active',
          description: 'Set up environment variables and application settings',
        },
        {
          label: 'Database Setup',
          stepLink: '#database',
          status: 'inactive',
          description: 'Initialize database schema and seed data',
        },
        {
          label: 'Testing',
          stepLink: '#testing',
          status: 'inactive',
          description: 'Configure test suites and run initial tests',
        },
        {
          label: 'Deployment',
          stepLink: '#deploy',
          status: 'inactive',
          description: 'Set up CI/CD pipeline and deploy to staging',
        },
      ]

      return (
        <div
          style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px' }}
        >
          <Button onClick={() => setIsOpen(true)}>Open Project Setup</Button>

          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="New Project Setup"
            theme="light"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '32px',
              }}
            >
              <div style={{ gridColumn: 'span 1 / span 1' }}>
                <Stepper
                  steps={projectSteps}
                  styles={{
                    theme: 'light',
                    orientation: 'vertical',
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2 / span 2' }}>
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      marginBottom: '16px',
                      color: '#1e3a8a',
                    }}
                  >
                    Step 3: Project Configuration
                  </h3>
                  <p style={{ color: '#1d4ed8', marginBottom: '24px' }}>
                    Configure your project settings and environment variables
                    for development and production.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <FormField label="Project Name">
                      <Input placeholder="my-awesome-project" />
                    </FormField>
                    <FormField label="Environment">
                      <select
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                        }}
                      >
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

                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 500,
                        color: '#14532d',
                        marginBottom: '8px',
                      }}
                    >
                      Configuration Tips:
                    </h4>
                    <ul
                      style={{
                        fontSize: '14px',
                        color: '#15803d',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
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

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '24px',
                  }}
                >
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
  render: () => {
    const Component = () => {
      const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
      const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
        'horizontal'
      )
      const [currentStep, setCurrentStep] = useState(2)

      const demoSteps: StepperProps['steps'] = [
        {
          label: 'Getting Started',
          stepLink: '#start',
          status: currentStep > 1 ? 'completed' : 'active',
          description: 'Learn the basics and set up your workspace',
        },
        {
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

      const wrapperBackground =
        theme === 'sacred'
          ? '#000000'
          : theme === 'dark'
            ? '#111827'
            : '#f3f4f6'
      const cardStyle: React.CSSProperties =
        theme === 'sacred'
          ? {
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
            }
          : theme === 'dark'
            ? { background: '#1f2937', border: '1px solid #374151' }
            : { background: '#ffffff', border: '1px solid #d1d5db' }
      const headingColor =
        theme === 'sacred'
          ? '#ffd700'
          : theme === 'dark'
            ? '#ffffff'
            : '#111827'
      const labelColor =
        theme === 'sacred'
          ? '#ffd700'
          : theme === 'dark'
            ? '#d1d5db'
            : '#374151'
      const controlStyle: React.CSSProperties =
        theme === 'sacred'
          ? {
              border: '1px solid rgba(250, 204, 21, 0.3)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fef9c3',
            }
          : theme === 'dark'
            ? {
                border: '1px solid #4b5563',
                background: '#374151',
                color: '#ffffff',
              }
            : {
                border: '1px solid #d1d5db',
                background: '#ffffff',
                color: '#111827',
              }
      const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '8px',
        color: labelColor,
      }
      const selectStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '8px',
        ...controlStyle,
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            background: wrapperBackground,
            padding: '32px',
          }}
        >
          <div
            style={{
              maxWidth: '72rem',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            <div style={{ borderRadius: '8px', padding: '24px', ...cardStyle }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '24px',
                  color: headingColor,
                }}
              >
                Interactive Stepper Demo
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <label style={labelStyle}>Theme</label>
                  <select
                    value={theme}
                    onChange={e =>
                      setTheme(e.target.value as 'light' | 'dark' | 'sacred')
                    }
                    style={selectStyle}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="sacred">Sacred</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Orientation</label>
                  <select
                    value={orientation}
                    onChange={e =>
                      setOrientation(
                        e.target.value as 'horizontal' | 'vertical'
                      )
                    }
                    style={selectStyle}
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Current Step</label>
                  <select
                    value={currentStep}
                    onChange={e => setCurrentStep(Number(e.target.value))}
                    style={selectStyle}
                  >
                    <option value={1}>Step 1</option>
                    <option value={2}>Step 2</option>
                    <option value={3}>Step 3 (Random Error)</option>
                    <option value={4}>Step 4</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
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

            <div style={{ borderRadius: '8px', padding: '32px', ...cardStyle }}>
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
 * Wizard mode — the Stepper owns the active step's `content` plus the
 * Back/Continue/Finish controls, driven by `onNext`/`onBack`/`onReset`.
 * Pins: step 1 hides Back; Continue advances and marks prior steps completed;
 * the last step's primary button reads "Finish"; finishing renders the
 * "All steps completed!" panel with `finalActions` and a "Start Over" reset.
 * Also exercises the `styles.gap` / `styles.padding` / `styles.marginBottom`
 * spacing overrides (24px rail gap, 24px root padding, 32px bottom offset).
 *
 * The play function drives the `onNext`/`onBack` wiring end-to-end: it pins
 * that step 1 renders its `content` with NO Back button, that Continue
 * swaps the rendered `content` to step 2 (step 1 content unmounts) and
 * reveals "← Back", and that Back returns to step 1 content. The snapshot
 * therefore captures the wizard back on step 1 after a full
 * forward-then-back round trip.
 */
export const WizardMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Step 1: its content is rendered, and the first step hides Back.
    await expect(
      await canvas.findByText(/Step 1 content — define what ships/)
    ).toBeVisible()
    await expect(canvas.queryByText('← Back')).toBeNull()

    // Continue → onNext advances: step 2 content replaces step 1 content
    // and the Back control appears.
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(
      await canvas.findByText(/Step 2 content — implement the change/)
    ).toBeVisible()
    await expect(canvas.queryByText(/Step 1 content/)).toBeNull()
    const backButton = canvas.getByRole('button', { name: '← Back' })
    await expect(backButton).toBeVisible()

    // Back → onBack retreats: step 1 content is rendered again.
    await userEvent.click(backButton)
    await expect(
      await canvas.findByText(/Step 1 content — define what ships/)
    ).toBeVisible()
    await expect(canvas.queryByText(/Step 2 content/)).toBeNull()
  },
  render: () => {
    const Component = () => {
      const [activeStep, setActiveStep] = useState(0)

      const wizardSteps: StepperProps['steps'] = [
        {
          label: 'Plan',
          description: 'Outline the rollout scope',
          content: (
            <div style={{ color: '#374151' }}>
              Step 1 content — define what ships in this rollout.
            </div>
          ),
        },
        {
          label: 'Build',
          description: 'Implement and review',
          content: (
            <div style={{ color: '#374151' }}>
              Step 2 content — implement the change and get it reviewed.
            </div>
          ),
        },
        {
          label: 'Ship',
          description: 'Deploy to production',
          content: (
            <div style={{ color: '#374151' }}>
              Step 3 content — deploy and verify in production.
            </div>
          ),
        },
      ]

      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#f3f4f6',
            padding: '32px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            <Stepper
              mode="wizard"
              steps={wizardSteps}
              activeStep={activeStep}
              onNext={() => setActiveStep(step => step + 1)}
              onBack={() => setActiveStep(step => Math.max(0, step - 1))}
              onReset={() => setActiveStep(0)}
              finalActions={<Button>View Summary</Button>}
              styles={{
                theme: 'light',
                orientation: 'horizontal',
                gap: '24px',
                padding: '24px',
                marginBottom: '32px',
              }}
            />
          </div>
        </div>
      )
    }
    return <Component />
  },
}

/**
 * Simple Theme Showcase. Pins: the same steps rendered under the light and
 * dark themes, and the per-step `description` rendering as muted secondary
 * text beneath the "Error" step's label.
 */
export const ThemeShowcase: Story = {
  render: () => {
    const basicSteps: StepperProps['steps'] = [
      { label: 'Start', stepLink: '#1', status: 'completed' },
      { label: 'Progress', stepLink: '#2', status: 'active' },
      {
        label: 'Error',
        stepLink: '#3',
        status: 'error',
        description: 'Something went wrong!',
      },
      { label: 'Finish', stepLink: '#4', status: 'inactive' },
    ]

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
          padding: '32px',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              textAlign: 'center',
              color: '#111827',
              marginBottom: '48px',
            }}
          >
            Stepper Theme Showcase
          </h1>

          {/* Light Theme */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '24px',
                color: '#111827',
              }}
            >
              Light Theme
            </h2>
            <Stepper steps={basicSteps} styles={{ theme: 'light' }} />
          </div>

          {/* Dark Theme */}
          <div
            style={{
              background: '#111827',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '24px',
                color: '#f3f4f6',
              }}
            >
              Dark Theme
            </h2>
            <Stepper steps={basicSteps} styles={{ theme: 'dark' }} />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Dedicated sacred baseline. Sacred is the component's hardcoded CSS default,
 * and this story passes the real theme prop explicitly
 * (`styles: { theme: 'sacred' }`), so the root emits `data-theme="sacred"` and
 * renders the sacred token palette: gold completed/active step icons,
 * `--goobs-sacred-text` labels in `--goobs-font-sacred`, a muted locked
 * inactive step, and gold connectors — one step in each status
 * (completed / active / error / inactive) with the error step's description
 * rendered as secondary text beneath its label.
 */
export const SacredTheme: Story = {
  name: 'Themes/Sacred',
  render: () => (
    <div style={{ padding: '48px 32px' }}>
      <Stepper
        steps={[
          { label: 'Start', stepLink: '#1', status: 'completed' },
          { label: 'Progress', stepLink: '#2', status: 'active' },
          {
            label: 'Error',
            stepLink: '#3',
            status: 'error',
            description: 'Something went wrong!',
          },
          { label: 'Finish', stepLink: '#4', status: 'inactive' },
        ]}
        styles={{ theme: 'sacred', orientation: 'horizontal' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

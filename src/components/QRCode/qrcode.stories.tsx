import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import QRCodeComponent from './index'

const meta: Meta<typeof QRCodeComponent> = {
  title: 'Components/QRCode',
  component: QRCodeComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    username: { control: 'text' },
    appName: { control: 'text' },
    size: { control: 'number' },
    title: { control: 'text' },
    sacredtheme: { control: 'boolean' },
    showVerifyButton: { control: 'boolean' },
    showConfirmationInput: { control: 'boolean' },
    showSuccessState: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="p-8 bg-gray-50 rounded-xl">
      <QRCodeComponent {...args} />
    </div>
  ),
  args: {
    username: 'user@example.com',
    appName: 'MyApp',
    title: 'Scan for MFA',
    size: 200,
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="p-8 bg-black rounded-xl">
      <QRCodeComponent {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
    title: 'The Scroll of Thoth',
  },
}

export const WithVerification: Story = {
  args: {
    ...PremiumTheme.args,
    showVerifyButton: true,
    showConfirmationInput: true,
    onVerify: () => alert('Verification clicked!'),
  },
}

export const SuccessState: Story = {
  args: {
    ...PremiumTheme.args,
    showSuccessState: true,
    successMessage: 'Oracle has been appeased.',
    onDisableVerification: () => alert('Disable verification!'),
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [showVerify, setShowVerify] = React.useState(true)
  const [showInput, setShowInput] = React.useState(true)
  const [showSuccess, setShowSuccess] = React.useState(false)

  return (
    <div className="w-[500px] space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          QRCode Configuration
        </h3>
        <div className="flex flex-col gap-2">
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />{' '}
            Sacred Theme
          </label>
          <label>
            <input
              type="checkbox"
              checked={showVerify}
              onChange={e => setShowVerify(e.target.checked)}
            />{' '}
            Show Verify Button
          </label>
          <label>
            <input
              type="checkbox"
              checked={showInput}
              onChange={e => setShowInput(e.target.checked)}
            />{' '}
            Show Input
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSuccess}
              onChange={e => setShowSuccess(e.target.checked)}
            />{' '}
            Show Success
          </label>
        </div>
      </div>
      <div
        className={`p-8 rounded-xl flex justify-center items-center ${sacred ? 'bg-black' : 'bg-gray-50'}`}
      >
        <QRCodeComponent
          username="interactive@example.com"
          appName="DynamicApp"
          title={sacred ? 'The Dynamic Scroll' : 'Interactive QR'}
          sacredtheme={sacred}
          showVerifyButton={showVerify}
          showConfirmationInput={showInput}
          showSuccessState={showSuccess}
          onVerify={() => alert('Verified!')}
          onDisableVerification={() => alert('Disabled!')}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

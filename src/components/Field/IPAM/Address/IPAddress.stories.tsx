/**
 * @fileoverview Storybook stories for the IPAddressField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import IPAddressField from './index'

const meta: Meta<typeof IPAddressField> = {
  title: 'Components/Field/IPAM/Address',
  component: IPAddressField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the field is disabled',
    },
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    allowIncomplete: {
      control: { type: 'boolean' },
      description: 'Allow incomplete IP addresses',
    },
    autoInsertDots: {
      control: { type: 'boolean' },
      description: 'Automatically insert dots while typing',
    },
    isRange: {
      control: { type: 'boolean' },
      description: 'Enable IP range input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof IPAddressField>

const commonArgs = {
  label: 'IP Address',
  placeholder: 'Enter IP address',
  allowIncomplete: false,
  autoInsertDots: true,
  isRange: false,
  disabled: false,
}

export const LightTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional IP address input
          with light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, IP validation, and accessible design.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Network engineer-friendly dark mode with
          high contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          IP validation, and smooth interactions.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual IP address
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const IPRangeExample: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>IP Range Configuration:</strong> Input field configured for
          entering IP address ranges with start and end addresses.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'IP Range',
    isRange: true,
    placeholder: 'Start IP',
    styles: {
      theme: 'light',
    },
  },
}

export const NetworkConfiguration: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Network Configuration:</strong> Complete network setup with
          subnet mask, gateway, and IP validation.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Gateway IP',
    defaultNetwork: '192.168.1.0',
    subnetMask: '255.255.255.0',
    subnetCIDR: 24,
    isGateway: true,
    styles: {
      theme: 'dark',
    },
  },
}

export const DisabledState: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Disabled State:</strong> Field in disabled state with
          pre-configured IP address that cannot be modified.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '192.168.1.100',
    disabled: true,
    styles: {
      theme: 'light',
    },
  },
}

export const ErrorState: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Error State:</strong> Sacred theme with error validation
          highlighting invalid IP address input.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '300.300.300.300',
    error: 'Invalid IP address format',
    styles: {
      theme: 'sacred',
    },
  },
}

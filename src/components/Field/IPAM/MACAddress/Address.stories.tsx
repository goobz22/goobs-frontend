/**
 * @fileoverview Storybook stories for the MACAddressField component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import MACAddressField from './index'

const meta: Meta<typeof MACAddressField> = {
  title: 'Components/Field/IPAM/MACAddress',
  component: MACAddressField,
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
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display below the field',
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

type Story = StoryObj<typeof MACAddressField>

const commonArgs = {
  label: 'MAC Address',
  placeholder: 'Enter MAC address',
  disabled: false,
}

export const LightTheme: Story = {
  name: 'Light Theme',
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
          <strong>Light Theme:</strong> Clean and professional MAC address input
          with light backgrounds and automatic formatting.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, MAC validation, and accessible design.
        </div>
        <MACAddressField {...args} />
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
  name: 'Dark Theme',
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
          MAC validation, and smooth interactions.
        </div>
        <MACAddressField {...args} />
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
  name: 'Sacred Theme',
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
          <strong>Sacred Theme:</strong> Mystical and spiritual MAC address
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <MACAddressField {...args} />
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

export const WithHelperText: Story = {
  name: 'With Helper Text',
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
          <strong>With Helper Text:</strong> MAC address input with helpful
          formatting guidance and usage instructions.
        </div>
        <MACAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    helperText: 'Enter MAC address in format: 00:1A:2B:3C:4D:5E',
    styles: {
      theme: 'light',
    },
  },
}

export const NetworkDeviceConfig: Story = {
  name: 'Network Device Config',
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
          <strong>Network Device Config:</strong> Dark theme optimized for
          network device configuration and MAC address management.
        </div>
        <MACAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Device MAC Address',
    initialValue: '00:1A:2B:3C:4D:5E',
    helperText: 'Physical device MAC address',
    styles: {
      theme: 'dark',
    },
  },
}

export const DisabledState: Story = {
  name: 'Disabled State',
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
          pre-configured MAC address that cannot be modified.
        </div>
        <MACAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '00:1A:2B:3C:4D:5E',
    disabled: true,
    helperText: 'MAC address is read-only',
    styles: {
      theme: 'light',
    },
  },
}

export const WirelessConfig: Story = {
  name: 'Wireless Config',
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
          <strong>Wireless Config:</strong> Sacred theme for wireless device
          configuration with mystical MAC address input.
        </div>
        <MACAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Wireless MAC Address',
    placeholder: 'Enter wireless MAC',
    helperText: 'Wireless adapter MAC address',
    styles: {
      theme: 'sacred',
    },
  },
}

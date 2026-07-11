/**
 * @fileoverview Storybook stories for the SubnetField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
import SubnetField from './index'

const meta: Meta<typeof SubnetField> = {
  title: 'Components/Field/IPAM/Subnet',
  component: SubnetField,
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
    min: {
      control: { type: 'number' },
      description: 'Minimum subnet mask value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum subnet mask value',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof SubnetField>

const commonArgs = {
  label: 'Subnet Mask',
  value: { address: '192.168.1.0', mask: 24 },
  onChange: (value: any) => console.log('Value changed:', value),
  min: 8,
  max: 30,
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
          <strong>Light Theme:</strong> Clean and professional subnet mask input
          with light backgrounds and increment controls.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, subnet validation, and accessible design.
        </div>
        <SubnetField {...args} />
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
          subnet validation, and smooth interactions.
        </div>
        <SubnetField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual subnet
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <SubnetField {...args} />
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

export const PrivateNetwork: Story = {
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
          <strong>Private Network:</strong> Subnet configuration for private
          network ranges with specific CIDR restrictions.
        </div>
        <SubnetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Private Network Subnet',
    value: { address: '10.0.0.0', mask: 16 },
    min: 16,
    max: 24,
    styles: {
      theme: 'light',
    },
  },
}

export const EnterpriseNetwork: Story = {
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
          <strong>Enterprise Network:</strong> Dark theme optimized for
          enterprise network configuration and subnet management.
        </div>
        <SubnetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Enterprise Subnet',
    value: { address: '172.16.0.0', mask: 20 },
    min: 12,
    max: 24,
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
          pre-configured subnet that cannot be modified.
        </div>
        <SubnetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: { address: '192.168.1.0', mask: 24 },
    disabled: true,
    styles: {
      theme: 'light',
    },
  },
}

export const DataCenterSubnet: Story = {
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
          <strong>Data Center Subnet:</strong> Sacred theme for data center
          subnet configuration with mystical network planning.
        </div>
        <SubnetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Data Center Subnet',
    value: { address: '10.0.0.0', mask: 8 },
    min: 8,
    max: 16,
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * Keyboard operability of the mask +/- steppers (WCAG 2.1.1) plus the announced
 * subnet summary (WCAG 4.1.3). The steppers respond to Enter/Space, and the
 * recomputed CIDR / host readout is a polite `role="status"` live region so
 * screen-reader users hear the new mask as it changes.
 */
export const KeyboardSteppersAndLiveReadout: Story = {
  name: 'Keyboard Steppers + Live Readout (a11y)',
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
          <strong>Keyboard Steppers + Live Readout:</strong> Enter/Space step
          the mask, and the subnet summary is a polite live region.
        </div>
        <SubnetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Subnet Mask',
    value: { address: '192.168.1.0', mask: 24 },
    min: 8,
    max: 30,
    styles: {
      theme: 'light',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Subnet Mask' })
    const increase = canvas.getByRole('button', {
      name: 'Increase subnet mask',
    })

    // The recomputing readout is a polite status live region.
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('aria-live', 'polite')

    // Keyboard Enter steps the mask up (/24 -> /25) with no pointer event; the
    // dotted-mask input and the live readout both reflect the new value.
    increase.focus()
    await expect(increase).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('255.255.255.128')
    await expect(status).toHaveTextContent('Subnet CIDR: /25')
  },
}

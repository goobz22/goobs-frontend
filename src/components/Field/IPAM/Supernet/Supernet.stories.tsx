/**
 * @fileoverview Storybook stories for the SupernetField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import SupernetField from './index'

const meta: Meta<typeof SupernetField> = {
  title: 'Components/Field/IPAM/Supernet',
  component: SupernetField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the field is required',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof SupernetField>

const commonArgs = {
  label: 'Supernet Mask',
  value: { address: '10.0.0.0', mask: 16 },
  onChange: (value: any) => console.log('Value changed:', value),
  required: false,
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
          <strong>Light Theme:</strong> Clean and professional supernet mask
          input with light backgrounds and increment controls.
          <br />
          <strong>Features:</strong> Optimized for network aggregation in bright
          environments, supernet validation, and accessible design.
        </div>
        <SupernetField {...args} />
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
          supernet validation, and smooth interactions.
        </div>
        <SupernetField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual supernet
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <SupernetField {...args} />
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

export const NetworkAggregation: Story = {
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
          <strong>Network Aggregation:</strong> Supernet configuration for
          aggregating multiple subnets into a larger network block.
        </div>
        <SupernetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Aggregate Network',
    value: { address: '192.168.0.0', mask: 16 },
    styles: {
      theme: 'light',
    },
  },
}

export const ISPNetworkPlanning: Story = {
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
          <strong>ISP Network Planning:</strong> Dark theme optimized for
          internet service provider network planning and supernet allocation.
        </div>
        <SupernetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'ISP Supernet',
    value: { address: '10.0.0.0', mask: 8 },
    required: true,
    styles: {
      theme: 'dark',
    },
  },
}

export const EnterpriseWAN: Story = {
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
          <strong>Enterprise WAN:</strong> Sacred theme for enterprise wide area
          network configuration with mystical supernet planning.
        </div>
        <SupernetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Enterprise WAN Supernet',
    value: { address: '172.16.0.0', mask: 12 },
    required: true,
    styles: {
      theme: 'sacred',
    },
  },
}

export const RegionalNetwork: Story = {
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
          <strong>Regional Network:</strong> Supernet configuration for regional
          network planning with multiple site aggregation.
        </div>
        <SupernetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Regional Supernet',
    value: { address: '10.0.0.0', mask: 14 },
    styles: {
      theme: 'light',
    },
  },
}

export const CloudInfrastructure: Story = {
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
          <strong>Cloud Infrastructure:</strong> Dark theme for cloud
          infrastructure supernet configuration and multi-tenant networking.
        </div>
        <SupernetField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Cloud Supernet',
    value: { address: '10.0.0.0', mask: 10 },
    styles: {
      theme: 'dark',
    },
  },
}

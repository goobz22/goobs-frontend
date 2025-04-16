import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import SupernetField from '.'

const meta: Meta<typeof SupernetField> = {
  title: 'Components/Field/IPAM/Supernet',
  component: SupernetField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof SupernetField>

export const Default: Story = {
  args: {
    label: 'Supernet Mask',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A supernet field that shows parent networks for a /24 subnet. Allows selecting supernets from /8 to /23.',
      },
    },
  },
}

export const ForClass28Subnet: Story = {
  args: {
    label: 'Supernet Mask',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows parent networks for a /28 subnet (255.255.255.240). Allows selecting supernets from /8 to /27.',
      },
    },
  },
}

export const ForClass30Subnet: Story = {
  args: {
    label: 'Supernet Mask',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows parent networks for a /30 subnet (255.255.255.252). Allows selecting supernets from /8 to /29.',
      },
    },
  },
}

export const CustomTimingSettings: Story = {
  args: {
    label: 'Custom Timing Settings',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'With custom timing settings for faster response when holding down the buttons.',
      },
    },
  },
}

export const ComparisonDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <p>
          <strong>Supernet Field</strong>
        </p>
        <p>Click the up/down arrows to change between valid supernet masks.</p>
        <p>
          Shows how many subnets of the specified size can fit in each supernet.
        </p>
      </div>
      <SupernetField
        label="Parent Networks for /24 Subnet"
        value={{ address: '', mask: 16 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SupernetField
        label="Parent Networks for /28 Subnet"
        value={{ address: '', mask: 16 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SupernetField
        label="Parent Networks for /30 Subnet"
        value={{ address: '', mask: 16 }}
        onChange={value => console.log('Value changed:', value)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of supernet options for different subnet sizes. Shows how many subnets of each size can fit into larger networks, from /8 to the subnet size.',
      },
    },
  },
}

export const LargeNetworkDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <p>
          <strong>Large Network Supernet Options</strong>
        </p>
        <p>
          Demonstrates supernet options for larger networks, starting from /8.
        </p>
      </div>
      <SupernetField
        label="Parent Networks for /16 Subnet"
        value={{ address: '', mask: 8 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SupernetField
        label="Parent Networks for /20 Subnet"
        value={{ address: '', mask: 8 }}
        onChange={value => console.log('Value changed:', value)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows supernet options for larger networks, demonstrating how smaller CIDR values (like /8) can contain multiple larger subnets.',
      },
    },
  },
}

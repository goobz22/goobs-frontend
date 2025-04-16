import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import SubnetField from '.'

const meta: Meta<typeof SubnetField> = {
  title: 'Components/Field/IPAM/Subnet',
  component: SubnetField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof SubnetField>

export const Default: Story = {
  args: {
    label: 'Subnet Mask',
    value: { address: '', mask: 24 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A subnet mask field that allows changing values via increment/decrement buttons between /16 and /32. Shows both subnet mask and CIDR notation.',
      },
    },
  },
}

export const WithClass16Mask: Story = {
  args: {
    label: 'Class B Subnet Mask',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story: 'Initialized with a Class B subnet mask (255.255.0.0, /16).',
      },
    },
  },
}

export const WithClass24Mask: Story = {
  args: {
    label: 'Class C Subnet Mask',
    value: { address: '', mask: 24 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story: 'Initialized with a Class C subnet mask (255.255.255.0, /24).',
      },
    },
  },
}

export const WithClass28Mask: Story = {
  args: {
    label: 'Small Network Subnet Mask',
    value: { address: '', mask: 28 },
    onChange: value => console.log('Value changed:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Initialized with a /28 subnet mask (255.255.255.240) which allows for 16 hosts.',
      },
    },
  },
}

export const CustomTimingSettings: Story = {
  args: {
    label: 'Custom Timing Settings',
    value: { address: '', mask: 24 },
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
          <strong>Subnet Mask Field</strong>
        </p>
        <p>
          Click the up/down arrows to change between valid subnet masks (/16 to
          /32).
        </p>
        <p>
          Shows both the subnet mask and CIDR notation with host information.
        </p>
      </div>
      <SubnetField
        label="Class B Network"
        value={{ address: '', mask: 16 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SubnetField
        label="Class C Network"
        value={{ address: '', mask: 24 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SubnetField
        label="Small Network (16 hosts)"
        value={{ address: '', mask: 28 }}
        onChange={value => console.log('Value changed:', value)}
      />
      <SubnetField
        label="Very Small Network (2 hosts)"
        value={{ address: '', mask: 30 }}
        onChange={value => console.log('Value changed:', value)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different subnet masks. Use the up/down buttons to move between valid subnet masks from /16 (255.255.0.0) to /32 (255.255.255.255).',
      },
    },
  },
}

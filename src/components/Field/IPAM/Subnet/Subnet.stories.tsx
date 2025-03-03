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
    initialValue: '16',
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
    initialValue: '24',
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
    initialValue: '28',
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
    initialValue: '24',
    initialDelay: 200,
    repeatInterval: 50,
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
      <SubnetField label="Class B Network" initialValue="16" />
      <SubnetField label="Class C Network" initialValue="24" />
      <SubnetField label="Small Network (16 hosts)" initialValue="28" />
      <SubnetField label="Very Small Network (2 hosts)" initialValue="30" />
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

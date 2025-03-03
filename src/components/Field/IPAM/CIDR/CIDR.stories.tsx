import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import CIDRField from '.'

const meta: Meta<typeof CIDRField> = {
  title: 'Components/Field/IPAM/CIDR',
  component: CIDRField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof CIDRField>

export const Default: Story = {
  args: {
    label: 'CIDR',
    minCidr: 8,
    maxCidr: 32,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A CIDR field that allows selecting any CIDR value from /8 to /32. Shows subnet mask and network information.',
      },
    },
  },
}

export const SubnetOnly: Story = {
  args: {
    label: 'Subnet CIDR',
    minCidr: 16,
    maxCidr: 32,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Configured for subnet selection only, allowing CIDR values from /16 to /32.',
      },
    },
  },
}

export const SupernetOnly: Story = {
  args: {
    label: 'Supernet CIDR',
    minCidr: 8,
    maxCidr: 24,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Configured for supernet selection only, allowing CIDR values from /8 to /24.',
      },
    },
  },
}

export const CustomRange: Story = {
  args: {
    label: 'Custom CIDR Range',
    minCidr: 12,
    maxCidr: 28,
  },
  parameters: {
    docs: {
      description: {
        story: 'With a custom CIDR range from /12 to /28.',
      },
    },
  },
}

export const WithoutInfo: Story = {
  args: {
    label: 'CIDR Only',
    showSubnetInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows only the CIDR input without additional network information.',
      },
    },
  },
}

export const CustomTimingSettings: Story = {
  args: {
    label: 'Custom Timing Settings',
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
          <strong>CIDR Field Examples</strong>
        </p>
        <p>Click the up/down arrows to change between CIDR values.</p>
        <p>
          Shows subnet mask, total hosts, and network information for each CIDR
          value.
        </p>
      </div>
      <CIDRField
        label="Full Range (/8 to /32)"
        minCidr={8}
        maxCidr={32}
        initialValue="24"
      />
      <CIDRField
        label="Subnet Range (/16 to /32)"
        minCidr={16}
        maxCidr={32}
        initialValue="24"
      />
      <CIDRField
        label="Supernet Range (/8 to /24)"
        minCidr={8}
        maxCidr={24}
        initialValue="16"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different CIDR ranges and their network information. Shows how CIDR values affect subnet masks and available hosts.',
      },
    },
  },
}

export const NetworkSizeDemo: Story = {
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
          <strong>Network Size Examples</strong>
        </p>
        <p>
          Demonstrates how different CIDR values affect network size and
          available hosts.
        </p>
      </div>
      <CIDRField
        label="Large Network (/8)"
        minCidr={8}
        maxCidr={8}
        initialValue="8"
      />
      <CIDRField
        label="Medium Network (/16)"
        minCidr={16}
        maxCidr={16}
        initialValue="16"
      />
      <CIDRField
        label="Small Network (/24)"
        minCidr={24}
        maxCidr={24}
        initialValue="24"
      />
      <CIDRField
        label="Very Small Network (/30)"
        minCidr={30}
        maxCidr={30}
        initialValue="30"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how different CIDR values affect network size, from very large (/8) to very small (/30) networks.',
      },
    },
  },
}

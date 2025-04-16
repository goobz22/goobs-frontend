import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import IPAddressField from '.'

const meta: Meta<typeof IPAddressField> = {
  title: 'Components/Field/IPAM/Address',
  component: IPAddressField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof IPAddressField>

export const Default: Story = {
  args: {
    label: 'IP Address',
    onChange: event => console.log('Value changed:', event.target.value),
  },
}

export const WithInitialValue: Story = {
  args: {
    label: 'IP with Initial Value',
    initialValue: '192.168.1.1',
    onChange: event => console.log('Value changed:', event.target.value),
  },
}

export const SubnetValidation: Story = {
  args: {
    label: 'IP with Subnet Validation',
    defaultNetwork: '10.0.0.0',
    subnetMask: '255.255.0.0',
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Only IP addresses in the 10.0.0.0/16 subnet are valid
      </p>
      <IPAddressField {...args} />
    </div>
  ),
}

export const DisableAutoInsertDots: Story = {
  args: {
    label: 'Manual Dot Entry',
    autoInsertDots: false,
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Auto-insertion of dots is disabled (you must type the dots)
      </p>
      <IPAddressField {...args} />
    </div>
  ),
}

export const AllowIncomplete: Story = {
  args: {
    label: 'Allow Incomplete Entry',
    allowIncomplete: true,
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Allows incomplete IP addresses during input
      </p>
      <IPAddressField {...args} />
    </div>
  ),
}

export const StrictValidation: Story = {
  args: {
    label: 'Strict Validation',
    allowIncomplete: false,
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Requires complete, valid IP addresses
      </p>
      <IPAddressField {...args} />
    </div>
  ),
}

export const ReservedIPValidation: Story = {
  args: {
    label: 'Reserved IP Check',
    defaultNetwork: '192.168.1.0',
    subnetMask: '255.255.255.0',
    initialValue: '192.168.1.0',
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Network address (192.168.1.0) and broadcast address (192.168.1.255) are
        invalid
      </p>
      <IPAddressField {...args} />
    </div>
  ),
}

export const ComparisonDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '300px',
      }}
    >
      <IPAddressField
        label="Auto-insert dots (default)"
        autoInsertDots={true}
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <IPAddressField
        label="Manual dot entry"
        autoInsertDots={false}
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <IPAddressField
        label="Within subnet (valid)"
        initialValue="192.168.1.10"
        defaultNetwork="192.168.1.0"
        subnetMask="255.255.255.0"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <IPAddressField
        label="Outside subnet (invalid)"
        initialValue="10.0.0.1"
        defaultNetwork="192.168.1.0"
        subnetMask="255.255.255.0"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
    </div>
  ),
}

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import VLANField from '.'

const meta: Meta<typeof VLANField> = {
  title: 'Components/Field/IPAM/VLAN',
  component: VLANField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof VLANField>

export const Default: Story = {
  args: {
    label: 'VLAN ID',
    onChange: event => console.log('Value changed:', event.target.value),
  },
}

export const WithInitialValue: Story = {
  args: {
    label: 'VLAN with Initial Value',
    initialValue: '100',
    onChange: event => console.log('Value changed:', event.target.value),
  },
}

export const WithReservedVLANs: Story = {
  args: {
    label: 'VLAN with Reserved IDs',
    reservedVLANs: [1, 4094, 1000, 1001, 1002],
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        The following VLANs are reserved: 1, 4094, 1000-1002
      </p>
      <VLANField {...args} />
    </div>
  ),
}

export const WithCustomStep: Story = {
  args: {
    label: 'VLAN with Custom Step',
    initialValue: '100',
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Increments/Decrements by 10 when using the buttons
      </p>
      <VLANField {...args} />
    </div>
  ),
}

export const WithCustomTimings: Story = {
  args: {
    label: 'VLAN with Custom Timing',
    initialDelay: 100,
    repeatInterval: 50,
    initialValue: '100',
    onChange: event => console.log('Value changed:', event.target.value),
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        Faster response when holding buttons (100ms initial delay, 50ms repeat
        interval)
      </p>
      <VLANField {...args} />
    </div>
  ),
}

export const WithBoundaryValues: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '300px',
      }}
    >
      <VLANField
        label="VLAN Near Minimum"
        initialValue="2"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <VLANField
        label="VLAN Near Maximum"
        initialValue="4093"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <VLANField
        label="Invalid VLAN (Below Min)"
        initialValue="0"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <VLANField
        label="Invalid VLAN (Above Max)"
        initialValue="5000"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
    </div>
  ),
}

export const TypicalRanges: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '300px',
      }}
    >
      <p style={{ marginBottom: '0' }}>Common VLAN Ranges</p>
      <VLANField
        label="Normal Range VLAN"
        initialValue="100"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <VLANField
        label="Extended Range VLAN"
        initialValue="2000"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
      <VLANField
        label="Default Native VLAN"
        initialValue="1"
        onChange={event => console.log('Value changed:', event.target.value)}
      />
    </div>
  ),
}

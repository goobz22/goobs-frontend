import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import MACAddressField from '.'

const meta: Meta<typeof MACAddressField> = {
  title: 'Components/Field/IPAM/MACAddress',
  component: MACAddressField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MACAddressField>

export const Default: Story = {
  args: {
    label: 'MAC Address',
  },
}

export const WithInitialValue: Story = {
  args: {
    label: 'MAC with Initial Value',
    initialValue: '00:1A:2B:3C:4D:5E',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'MAC Address with Description',
  },
  render: args => (
    <div>
      <p style={{ marginBottom: '10px' }}>
        MAC addresses are automatically formatted as XX:XX:XX:XX:XX:XX and must
        be complete to be valid
      </p>
      <MACAddressField {...args} />
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
      <MACAddressField label="Empty MAC Address Field" />
      <MACAddressField
        label="With device MAC"
        initialValue="00:1A:2B:3C:4D:5E"
      />
      <MACAddressField
        label="With router MAC"
        initialValue="A4:B1:C2:D3:E4:F5"
      />
    </div>
  ),
}

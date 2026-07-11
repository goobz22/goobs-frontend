/**
 * @fileoverview Storybook stories for the CIDRField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
import CIDRField from './index'

const meta: Meta<typeof CIDRField> = {
  title: 'Components/Field/IPAM/CIDR',
  component: CIDRField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    showSubnetInfo: {
      control: { type: 'boolean' },
      description: 'Display subnet information below the input',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the field is disabled',
    },
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    minCidr: {
      control: { type: 'number' },
      description: 'Minimum CIDR value allowed',
    },
    maxCidr: {
      control: { type: 'number' },
      description: 'Maximum CIDR value allowed',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display',
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

type Story = StoryObj<typeof CIDRField>

const commonArgs = {
  label: 'CIDR',
  minCidr: 8,
  maxCidr: 32,
  showSubnetInfo: true,
  disabled: false,
  placeholder: 'Enter CIDR notation',
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
          <strong>Light Theme:</strong> Clean and professional CIDR input with
          light backgrounds and subnet information display.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, CIDR validation, and subnet calculations.
        </div>
        <CIDRField {...args} />
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
          CIDR validation, and dynamic subnet calculations.
        </div>
        <CIDRField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual CIDR
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent subnet calculations.
        </div>
        <CIDRField {...args} />
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

export const WithoutSubnetInfo: Story = {
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
          <strong>Clean Input:</strong> CIDR input without subnet information
          display for simpler configuration forms.
        </div>
        <CIDRField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    showSubnetInfo: false,
    styles: {
      theme: 'light',
    },
  },
}

export const CustomRange: Story = {
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
          <strong>Custom Range:</strong> CIDR input with custom min/max range
          restrictions for specific network requirements.
        </div>
        <CIDRField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Private Network CIDR',
    minCidr: 16,
    maxCidr: 24,
    helperText: 'Private network range only (16-24)',
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
          pre-configured CIDR that cannot be modified.
        </div>
        <CIDRField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '24',
    disabled: true,
    styles: {
      theme: 'light',
    },
  },
}

export const SubnetCalculator: Story = {
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
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Subnet Calculator:</strong> Sacred theme with detailed subnet
          calculations and network information display.
        </div>
        <CIDRField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Subnet Calculator',
    initialValue: '24',
    showSubnetInfo: true,
    helperText: 'Enter CIDR to calculate subnet information',
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * Keyboard operability of the +/- steppers (WCAG 2.1.1) plus the announced
 * subnet-info readout (WCAG 4.1.3). The steppers now respond to Enter/Space,
 * and the recomputed mask/host summary lives in a polite `role="status"` live
 * region so screen-reader users hear the new values as the CIDR changes.
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
          the CIDR, and the subnet summary is a polite live region.
        </div>
        <CIDRField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '24',
    showSubnetInfo: true,
    styles: {
      theme: 'light',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'CIDR' })
    const increase = canvas.getByRole('button', { name: 'Increase CIDR' })

    // The recomputing readout is a polite status live region.
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('aria-live', 'polite')

    // Keyboard Enter steps the CIDR up (24 -> 25) with no pointer event, and
    // the live region reflects the new /25 mask.
    increase.focus()
    await expect(increase).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('/25')
    await expect(status).toHaveTextContent('255.255.255.128')
  },
}

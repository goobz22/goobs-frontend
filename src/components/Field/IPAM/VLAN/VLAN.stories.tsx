/**
 * @fileoverview Storybook stories for the VLANField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
import VLANField from './index'

const meta: Meta<typeof VLANField> = {
  title: 'Components/Field/IPAM/VLAN',
  component: VLANField,
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
    reservedVLANs: {
      control: { type: 'object' },
      description: 'Array of reserved VLAN IDs that cannot be used',
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

type Story = StoryObj<typeof VLANField>

const commonArgs = {
  label: 'VLAN ID',
  placeholder: 'Enter VLAN ID',
  disabled: false,
  reservedVLANs: [],
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
          <strong>Light Theme:</strong> Clean and professional VLAN ID input
          with light backgrounds and increment controls.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, VLAN validation, and accessible design.
        </div>
        <VLANField {...args} />
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
          VLAN validation, and smooth interactions.
        </div>
        <VLANField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual VLAN
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <VLANField {...args} />
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

export const WithReservedVLANs: Story = {
  name: 'With Reserved VLANs',
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
          <strong>With Reserved VLANs:</strong> VLAN input with reserved IDs
          that cannot be used, providing validation feedback.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    reservedVLANs: [1, 100, 200, 300, 999],
    styles: {
      theme: 'light',
    },
  },
}

export const SwitchPortConfig: Story = {
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
          <strong>Switch Port Config:</strong> Dark theme optimized for switch
          port configuration with VLAN assignment.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Port VLAN',
    initialValue: '100',
    reservedVLANs: [1, 1002, 1003, 1004, 1005],
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
          pre-configured VLAN ID that cannot be modified.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '100',
    disabled: true,
    styles: {
      theme: 'light',
    },
  },
}

export const TrunkConfiguration: Story = {
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
          <strong>Trunk Configuration:</strong> Sacred theme for trunk port
          configuration with mystical VLAN management.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Native VLAN',
    initialValue: '1',
    reservedVLANs: [1002, 1003, 1004, 1005],
    styles: {
      theme: 'sacred',
    },
  },
}

export const DataCenterVLAN: Story = {
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
          <strong>Data Center VLAN:</strong> Dark theme for data center VLAN
          configuration with reserved management VLANs.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Data Center VLAN',
    initialValue: '2000',
    reservedVLANs: [1, 999, 1000, 1001, 4094],
    styles: {
      theme: 'dark',
    },
  },
}

/**
 * Keyboard operability of the +/- steppers (WCAG 2.1.1). The buttons drive a
 * press-and-hold repeat via `onMouseDown`, but keyboard Enter/Space (which
 * dispatch a `click`, never a mousedown) now step the value too, so the
 * focusable buttons are no longer inert for keyboard-only users. The play test
 * focuses each button and activates it with the keyboard alone, and confirms
 * the decorative caret icons are hidden from assistive tech.
 */
export const KeyboardSteppers: Story = {
  name: 'Keyboard Steppers (a11y)',
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
          <strong>Keyboard Steppers:</strong> The increment / decrement buttons
          are operable with Enter and Space, not just the mouse.
        </div>
        <VLANField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '10',
    styles: {
      theme: 'light',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'VLAN ID' })
    const increase = canvas.getByRole('button', { name: 'Increase VLAN ID' })
    const decrease = canvas.getByRole('button', { name: 'Decrease VLAN ID' })

    // Focusing the increment button and pressing Enter steps the value up with
    // no pointer event at all.
    increase.focus()
    await expect(increase).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('11')

    // The decrement button is likewise keyboard-operable.
    decrease.focus()
    await expect(decrease).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('10')

    // The input itself is spinbutton-operable: with it focused, Up/Down arrows
    // step the VLAN ID without touching the +/- buttons (WCAG 2.1.1).
    input.focus()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(input).toHaveValue('11')
    await userEvent.keyboard('{ArrowDown}')
    await expect(input).toHaveValue('10')

    // The caret glyph inside each labelled button is hidden from AT so the
    // button's aria-label is the sole accessible name.
    await expect(increase.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  },
}

/**
 * @fileoverview Storybook stories for the IPAddressField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
import IPAddressField from './index'

const meta: Meta<typeof IPAddressField> = {
  title: 'Components/Field/IPAM/Address',
  component: IPAddressField,
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
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    allowIncomplete: {
      control: { type: 'boolean' },
      description: 'Allow incomplete IP addresses',
    },
    autoInsertDots: {
      control: { type: 'boolean' },
      description: 'Automatically insert dots while typing',
    },
    isRange: {
      control: { type: 'boolean' },
      description: 'Enable IP range input',
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

type Story = StoryObj<typeof IPAddressField>

const commonArgs = {
  label: 'IP Address',
  placeholder: 'Enter IP address',
  allowIncomplete: false,
  autoInsertDots: true,
  isRange: false,
  disabled: false,
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
          <strong>Light Theme:</strong> Clean and professional IP address input
          with light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for network configuration in
          bright environments, IP validation, and accessible design.
        </div>
        <IPAddressField {...args} />
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
          IP validation, and smooth interactions.
        </div>
        <IPAddressField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual IP address
          configuration with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative network
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <IPAddressField {...args} />
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

export const IPRangeExample: Story = {
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
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>IP Range Configuration:</strong> Input field configured for
          entering IP address ranges with start and end addresses.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'IP Range',
    isRange: true,
    placeholder: 'Start IP',
    styles: {
      theme: 'light',
    },
  },
}

export const NetworkConfiguration: Story = {
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
          <strong>Network Configuration:</strong> Complete network setup with
          subnet mask, gateway, and IP validation.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Gateway IP',
    defaultNetwork: '192.168.1.0',
    subnetMask: '255.255.255.0',
    subnetCIDR: 24,
    isGateway: true,
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
          pre-configured IP address that cannot be modified.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '192.168.1.100',
    disabled: true,
    styles: {
      theme: 'light',
    },
  },
}

export const ErrorState: Story = {
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
          <strong>Error State:</strong> Sacred theme with error validation
          highlighting invalid IP address input.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '300.300.300.300',
    error: 'Invalid IP address format',
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * Range mode (`renderAsRange`) renders paired start/end inputs. In this layout
 * the FieldShell visible label is only shown once a paired value exists, so
 * each input carries a stable `aria-label` — derived from the field label so
 * the visible text is contained in the accessible name (WCAG 2.5.3) — that
 * keeps both inputs programmatically NAMED even while empty (WCAG 1.3.1 /
 * 4.1.2) and DISTINGUISHES start from end for screen-reader users (WCAG
 * 3.3.2). The play test asserts both names resolve on an empty field.
 */
export const RangeModeAccessibleNames: Story = {
  name: 'Range Mode (accessible names)',
  render: () => (
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
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Range Mode:</strong> Paired start/end inputs. Each input keeps
          an accessible name even while empty, and start vs end are
          distinguishable to assistive technology.
        </div>
        <IPAddressField
          label="IP Address"
          renderAsRange
          startIPValue=""
          endIPValue=""
          styles={{ theme: 'light' }}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Both inputs are programmatically named even though the field is empty,
    // and the start/end names are distinct.
    const start = canvas.getByRole('textbox', {
      name: 'IP Address range start',
    })
    const end = canvas.getByRole('textbox', { name: 'IP Address range end' })
    await expect(start).toBeInTheDocument()
    await expect(end).toBeInTheDocument()
  },
}

/**
 * Keyboard caret navigation (WCAG 2.1.1). The field intercepts keystrokes to
 * keep only IPv4 characters, but the caret-navigation keys (Home / End /
 * ArrowUp / ArrowDown) must still move the cursor so a keyboard user can jump
 * to the start / end of the address to fix an octet — they are no longer
 * preventDefault-ed. The play test parks the caret mid-string, then confirms
 * Home jumps it to the very start and End to the very end.
 */
export const KeyboardCaretNavigation: Story = {
  name: 'Keyboard Caret Navigation (a11y)',
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
          <strong>Keyboard Caret Navigation:</strong> Home and End move the
          cursor to the start and end of the address; only invalid characters
          are blocked.
        </div>
        <IPAddressField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '192.168.1.100',
    styles: {
      theme: 'light',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'IP Address',
    }) as HTMLInputElement

    input.focus()
    await expect(input).toHaveFocus()

    // Park the caret in the middle so the Home/End jumps are unambiguous.
    input.setSelectionRange(3, 3)
    await expect(input.selectionStart).toBe(3)

    // Home is honoured (not preventDefault-ed): caret jumps to the very start.
    await userEvent.keyboard('{Home}')
    await expect(input.selectionStart).toBe(0)

    // End is honoured: caret jumps to the very end of the address.
    await userEvent.keyboard('{End}')
    await expect(input.selectionStart).toBe(input.value.length)
  },
}

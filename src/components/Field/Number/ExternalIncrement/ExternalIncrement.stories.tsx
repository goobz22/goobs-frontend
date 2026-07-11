/**
 * @fileoverview Storybook stories for the ExternalIncrementNumberField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import ExternalIncrementNumberField from './index'

const meta: Meta<typeof ExternalIncrementNumberField> = {
  title: 'Components/Field/Number/ExternalIncrement',
  component: ExternalIncrementNumberField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    initialValue: {
      control: { type: 'text' },
      description: 'Initial value of the field',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display below the field',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof ExternalIncrementNumberField>

const commonArgs = {
  label: 'Quantity',
  initialValue: '0',
}

export const Default: Story = {
  args: {
    ...commonArgs,
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const WithHelperText: Story = {
  args: {
    ...commonArgs,
    helperText: 'Use the buttons to increment or decrement the value.',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const InitialValue5: Story = {
  args: {
    ...commonArgs,
    initialValue: '5',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const CustomLabel: Story = {
  args: {
    ...commonArgs,
    label: 'Items',
    initialValue: '10',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

/**
 * Light theme via `styles.theme: 'light'` on a light canvas — the FieldShell
 * default palette: white field surface, dark text, slate control border.
 */
export const LightTheme: Story = {
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Dark theme via `styles.theme: 'dark'` on the dark canvas — dark field
 * surface with light text from the FieldShell `[data-theme='dark']` block.
 */
export const DarkTheme: Story = {
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Sacred theme via `styles.theme: 'sacred'` on the sacred canvas — the gold
 * accent palette from the FieldShell `[data-theme='sacred']` block.
 */
export const SacredTheme: Story = {
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

export const Required: Story = {
  args: {
    ...commonArgs,
    styles: {
      required: true,
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    ...commonArgs,
    styles: {
      disabled: true,
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const CustomWidth: Story = {
  args: {
    ...commonArgs,
    styles: {
      width: '300px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const WithBorder: Story = {
  args: {
    ...commonArgs,
    styles: {
      borderWidth: '2px',
      borderColor: '#007bff',
      borderRadius: '12px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const LargeSize: Story = {
  args: {
    ...commonArgs,
    styles: {
      height: '60px',
      fontSize: '18px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

/**
 * A11y regression (WCAG 2.1.1 / 4.1.2 — APG spinbutton). The input carries
 * `role="spinbutton"` with `aria-valuenow`/`aria-valuemin`, and is fully
 * keyboard-operable: Up/Down arrows step the value and Home jumps to the
 * floor (0), so a value can be set without a mouse. The +/- buttons are
 * native `<button>`s and remain operable with Enter/Space.
 */
export const KeyboardAccessible: Story = {
  args: {
    ...commonArgs,
    label: 'Quantity',
    initialValue: '3',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinbutton = canvas.getByRole('spinbutton')

    // Programmatic spinbutton semantics are present.
    await expect(spinbutton).toHaveAttribute('aria-valuemin', '0')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '3')
    await expect(spinbutton).toHaveValue('3')

    // Arrow keys step the value with no mouse.
    await userEvent.click(spinbutton)
    await userEvent.keyboard('{ArrowUp}')
    await expect(spinbutton).toHaveValue('4')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '4')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(spinbutton).toHaveValue('2')

    // Home resets to the floor.
    await userEvent.keyboard('{Home}')
    await expect(spinbutton).toHaveValue('0')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '0')

    // The +/- buttons work via keyboard activation (native button click).
    const increase = canvas.getByRole('button', { name: 'Increase value' })
    increase.focus()
    await expect(increase).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(spinbutton).toHaveValue('1')
  },
}

/**
 * A11y regression (WCAG 1.3.1 / 3.3.1 / 4.1.2 / 4.1.3). Pins the accessible
 * error contract FieldShell wires for the spinbutton: the input is reachable
 * by its `<label>`, carries `aria-invalid="true"`, and points via
 * `aria-describedby` at the `role="alert"` region that announces the message.
 */
export const AccessibleErrorState: Story = {
  args: {
    ...commonArgs,
    label: 'Order Quantity',
    error: 'Quantity is invalid',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Order Quantity')
    await expect(input).toHaveAttribute('role', 'spinbutton')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveAttribute('id', describedBy ?? '')
    await expect(alert).toHaveTextContent('Quantity is invalid')
  },
}

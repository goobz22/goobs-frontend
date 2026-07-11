/**
 * @fileoverview Storybook stories for the InternalIncrementNumberField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import InternalIncrementNumberField from './index'

const meta: Meta<typeof InternalIncrementNumberField> = {
  title: 'Components/Field/Number/InternalIncrement',
  component: InternalIncrementNumberField,
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
    min: {
      control: { type: 'number' },
      description: 'Minimum value allowed',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value allowed',
    },
    initialDelay: {
      control: { type: 'number' },
      description: 'Initial delay before repeat increment starts',
    },
    repeatInterval: {
      control: { type: 'number' },
      description: 'Interval between repeat increments',
    },

    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof InternalIncrementNumberField>

const commonArgs = {
  label: 'Quantity',
  initialValue: '1',
  min: 0,
  max: 100,
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
          <strong>Light Theme:</strong> Clean and professional numeric input
          with light backgrounds and internal increment controls.
          <br />
          <strong>Features:</strong> Optimized for quantity selection in bright
          environments, internal increment arrows, and accessible design.
        </div>
        <InternalIncrementNumberField {...args} />
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
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          increment controls, and smooth interactions.
        </div>
        <InternalIncrementNumberField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual numeric input
          with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative number
          selection, sacred color schemes, and transcendent user experience.
        </div>
        <InternalIncrementNumberField {...args} />
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

export const WithRange: Story = {
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
          <strong>With Range:</strong> Numeric input with custom min/max range
          restrictions for specific use cases.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Age',
    initialValue: '25',
    min: 18,
    max: 120,
    helperText: 'Enter age between 18 and 120',
    styles: {
      theme: 'light',
    },
  },
}

export const FastIncrement: Story = {
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
          <strong>Fast Increment:</strong> Dark theme with customized increment
          timing for rapid value changes.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Fast Counter',
    initialValue: '0',
    min: 0,
    max: 1000,
    initialDelay: 200,
    repeatInterval: 50,
    helperText: 'Fast increment/decrement timing',
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
          <strong>Disabled State:</strong> Field in disabled state with internal
          increment controls that cannot be modified.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '50',
    helperText: 'This field is disabled',
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

export const SacredCounter: Story = {
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
          <strong>Sacred Counter:</strong> Sacred theme for mystical counting
          with transcendent numeric input and divine increments.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Counter',
    initialValue: '7',
    min: 1,
    max: 77,
    helperText: 'Count with sacred precision',
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * A11y regression (WCAG 2.1.1 / 4.1.2 — APG spinbutton).
 *
 * Two things this pins:
 *  1. The +/- buttons are keyboard-operable. They previously bound only
 *     `onMouseDown`, so Enter/Space (which fire a `click`, never a
 *     `mousedown`) did nothing — the stepper was mouse-only. A keyboard
 *     `click` reports `detail === 0`, which now triggers a single step.
 *  2. The input is a proper spinbutton: `role="spinbutton"` with
 *     `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, and Up/Down/Home/End
 *     step it from the keyboard.
 */
export const KeyboardAccessible: Story = {
  render: args => (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <InternalIncrementNumberField {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Quantity',
    initialValue: '1',
    min: 0,
    max: 5,
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinbutton = canvas.getByRole('spinbutton')

    // Programmatic spinbutton semantics are present.
    await expect(spinbutton).toHaveAttribute('aria-valuemin', '0')
    await expect(spinbutton).toHaveAttribute('aria-valuemax', '5')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '1')
    await expect(spinbutton).toHaveValue('1')

    // Up/Down arrows step the value from the keyboard.
    await userEvent.click(spinbutton)
    await userEvent.keyboard('{ArrowUp}')
    await expect(spinbutton).toHaveValue('2')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '2')
    await userEvent.keyboard('{ArrowDown}')
    await expect(spinbutton).toHaveValue('1')

    // Home/End jump to the floor/ceiling (respecting min/max clamping).
    await userEvent.keyboard('{End}')
    await expect(spinbutton).toHaveValue('5')
    await userEvent.keyboard('{Home}')
    await expect(spinbutton).toHaveValue('0')

    // The critical fix: the +/- buttons respond to Enter/Space (keyboard
    // click, detail === 0) — the old mousedown-only wiring left them
    // inert for keyboard/AT users.
    const increase = canvas.getByRole('button', { name: 'Increase value' })
    increase.focus()
    await expect(increase).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(spinbutton).toHaveValue('1')
    await userEvent.keyboard(' ')
    await expect(spinbutton).toHaveValue('2')

    const decrease = canvas.getByRole('button', { name: 'Decrease value' })
    decrease.focus()
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
  render: args => (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <InternalIncrementNumberField {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Guest Count',
    error: 'Count is invalid',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Guest Count')
    await expect(input).toHaveAttribute('role', 'spinbutton')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveAttribute('id', describedBy ?? '')
    await expect(alert).toHaveTextContent('Count is invalid')
  },
}

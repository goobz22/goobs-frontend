// src/components/PasswordField/passwordfield.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import PasswordField from './index'

/**
 * Storybook metadata
 */
const meta: Meta<typeof PasswordField> = {
  title: 'Components/Field/Password',
  component: PasswordField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof PasswordField>

/**
 * 1) Basic usage
 *    - Uses `await` with `userEvent.click(...)`, so we keep `async`.
 */
export const Basic: Story = {
  args: {
    label: 'Password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Grab the input by label
    const input = canvas.getByLabelText('Password')

    // Initially, the type should be "password"
    expect(input).toHaveAttribute('type', 'password')

    // Click the eye icon to toggle visibility
    const eyeIcon = canvas.getByRole('img', { name: /toggle password/i })
    await userEvent.click(eyeIcon)
    // Now the type should be "text"
    expect(input).toHaveAttribute('type', 'text')
  },
}

/**
 * 2) With Placeholder
 *    - No await calls => remove `async`.
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'Enter your password',
    placeholder: '********',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Enter your password')
    // Confirm the placeholder is "********"
    expect(input).toHaveAttribute('placeholder', '********')
  },
}

/**
 * 3) Custom Colors
 *    - Uses `await` with `userEvent.type(...)`, so keep `async`.
 */
export const CustomColors: Story = {
  args: {
    label: 'Custom Colors',
    backgroundcolor: '#f3e5f5', // a light purple
    outlinecolor: '#ab47bc', // a deeper purple
    fontcolor: '#4a148c', // an even darker purple
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Custom Colors')
    // Type in some password
    await userEvent.type(input, 'mySecret123')
    expect(input).toHaveValue('mySecret123')
  },
}

/**
 * 4) Disabled
 *    - No await calls => remove `async`.
 */
export const DisabledField: Story = {
  args: {
    label: 'Disabled Password',
    disabled: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Disabled Password')
    // Ensure it's disabled
    expect(input).toBeDisabled()
  },
}

/**
 * 5) Controlled by external state (example)
 *    - Uses `await` with `userEvent.type(...)`, so keep `async`.
 */
export const ControlledExternalState: Story = {
  args: {
    label: 'Controlled Password',
    onChange: e => {
      console.log('Password changed =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Controlled Password')

    // Type a password
    await userEvent.type(input, 'External123')
    expect(input).toHaveValue('External123')
  },
}

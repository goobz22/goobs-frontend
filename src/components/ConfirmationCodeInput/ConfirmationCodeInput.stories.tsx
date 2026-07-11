/**
 * @fileoverview Storybook stories for the ConfirmationCodeInput component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, within } from 'storybook/test'
import { z } from 'zod'
import ConfirmationCodeInput from './index'
import Form from '../Form'
import Button from '../Button'

const meta: Meta<typeof ConfirmationCodeInput> = {
  title: 'Components/ConfirmationCodeInput',
  component: ConfirmationCodeInput,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    codeLength: {
      control: { type: 'number', min: 4, max: 8 },
      description: 'Number of input fields for the code',
    },
    isValid: {
      control: { type: 'boolean' },
      description: 'Whether the entered code is valid',
    },
    showActionButtons: {
      control: { type: 'boolean' },
      description: 'Show verify and send/resend buttons',
    },
    showSendResendButton: {
      control: { type: 'boolean' },
      description: 'Show send/resend button',
    },
    showSuccessState: {
      control: { type: 'boolean' },
      description: 'Show success state',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof ConfirmationCodeInput>

const commonArgs = {
  codeLength: 6,
  isValid: false,
  showActionButtons: true,
  showSendResendButton: true,
  showSuccessState: false,
  onDisableVerification: fn(),
  onVerify: fn(),
  onSendResend: fn(),
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
          <strong>Light Theme:</strong> Clean and professional code input with
          light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for readability in bright
          environments, intuitive validation, and accessible design.
        </div>
        <ConfirmationCodeInput {...args} />
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
          styling, and smooth interactions.
        </div>
        <ConfirmationCodeInput {...args} />
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

/**
 * Sacred theme. Beyond the palette, the sacred variant renders a purely-visual
 * bottom flourish of three floating "." glyphs. That decoration is `aria-hidden`
 * so a screen reader does not announce "period period period" after the code
 * field — decorative content must stay out of the reading order (WCAG 1.3.1).
 * The play function pins that the flourish is hidden from assistive tech.
 */
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
          <strong>Sacred Theme:</strong> Mystical and spiritual code input with
          sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative sessions, sacred
          color schemes, and transcendent user experience.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
  play: async ({ canvasElement }) => {
    // The sacred bottom flourish (three floating "." glyphs) is purely
    // decorative, so it is hidden from assistive tech via aria-hidden — a
    // screen reader must not read "period period period" after the code field
    // (WCAG 1.3.1). Asserting the hidden flourish exists fails first if the
    // aria-hidden is ever dropped.
    const decoration = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[aria-hidden="true"]')
    ).find(el => el.textContent?.replace(/\s/g, '') === '...')
    await expect(decoration).toBeTruthy()
  },
}

export const LightSuccessState: Story = {
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
          <strong>Light Success State:</strong> Clean and professional success
          confirmation with light theme styling.
          <br />
          <strong>Features:</strong> Clear success indicators and accessible
          design for bright environments.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkSuccessState: Story = {
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
          <strong>Dark Success State:</strong> Modern success confirmation with
          dark theme styling and high contrast.
          <br />
          <strong>Features:</strong> Optimized for low-light environments with
          clear success indicators.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredSuccessState: Story = {
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
          <strong>Sacred Success State:</strong> Mystical and spiritual success
          confirmation with sacred golden aesthetics.
          <br />
          <strong>Features:</strong> Ethereal animations, sacred typography, and
          transcendent success experience.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'sacred',
    },
  },
}

export const CustomCodeLength: Story = {
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
          <strong>Custom Code Length:</strong> 4-digit code input with dark
          theme styling.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    codeLength: 4,
    styles: {
      theme: 'dark',
    },
  },
}

export const MinimalLayout: Story = {
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
          <strong>Minimal Layout:</strong> Clean code input without action
          buttons for simple verification flows.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    showActionButtons: false,
    showSendResendButton: false,
    styles: {
      theme: 'light',
    },
  },
}

/**
 * Valid state (not yet the full success screen). `isValid` flips the status
 * dot green AND renders a checkmark glyph inside it, so the valid/invalid
 * distinction is carried by shape, not colour alone (WCAG 1.4.1). The dot is
 * a `role="status"` live region whose visually-hidden text ("Code is valid")
 * is announced to assistive tech on the transition (WCAG 4.1.3).
 */
export const ValidState: Story = {
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
          <strong>Valid State:</strong> The status indicator turns green and
          shows a checkmark glyph (a non-colour cue) when the code is valid.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    value: '123456',
    styles: {
      theme: 'light',
    },
  },
}

/**
 * Disabled state. `styles.disabled` sets `data-disabled` on the root, dims the
 * container, and applies the native `disabled` attribute to every digit cell
 * (so the disabled state is programmatic, not colour-only — WCAG 1.4.1/4.1.2).
 */
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
          <strong>Disabled State:</strong> Every digit cell is natively disabled
          and the container is dimmed via <code>data-disabled</code>.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '12',
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

/**
 * Consumer-controlled heading level. The success message renders as a real
 * heading whose level is set by `headingLevel` (here `2`) so it slots into the
 * host document outline without skipping levels (WCAG 1.3.1 / 2.4.6). The
 * success container is a `role="status"` region so the confirmation is
 * announced when it appears (WCAG 4.1.3).
 */
export const CustomHeadingLevel: Story = {
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
          <strong>Custom Heading Level:</strong> The success message renders as
          an <code>&lt;h2&gt;</code> via <code>headingLevel</code>.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    headingLevel: 2,
    styles: {
      theme: 'light',
    },
  },
}

/**
 * Form-bound validation error (WCAG 3.3.1 Error Identification, 4.1.2 / 4.1.3).
 * The component is bound to a `<Form>` by `name` (no explicit value/onChange —
 * the engine owns the value) with a schema that requires all six digits.
 * Submitting empty makes the engine report an error, which the component
 * surfaces as `aria-invalid="true"` on EVERY digit cell AND as a visible,
 * linked `role="alert"` message the cells reference via `aria-describedby` —
 * so a bound field's failure is IDENTIFIED to assistive tech, not just flagged
 * "invalid" six times with no explanation. The play function pins this whole
 * contract so a future edit can't silently break it.
 */
const codeFormSchema = z.object({
  verificationCode: z
    .string()
    .length(6, 'Enter all 6 digits of the confirmation code.'),
})

export const FormBoundValidationError: Story = {
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
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Form-Bound Validation Error:</strong> Submitting the empty,
          form-bound field flags every digit cell <code>aria-invalid</code> and
          renders a linked <code>role=&quot;alert&quot;</code> error the cells
          point at via <code>aria-describedby</code>.
        </div>
        <Form
          schema={codeFormSchema}
          initialValues={{ verificationCode: '' }}
          subject="confirmation code"
          id="cci-validation-form"
          onSubmit={fn()}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <ConfirmationCodeInput
              name="verificationCode"
              isValid={false}
              showActionButtons={false}
              onDisableVerification={fn()}
              styles={{ theme: 'light' }}
            />
            <Button
              type="submit"
              action="save"
              text="Verify code"
              styles={{ theme: 'light' }}
            />
          </div>
        </Form>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const firstCell = canvas.getByRole('textbox', { name: /digit 1 of 6/i })
    const lastCell = canvas.getByRole('textbox', { name: /digit 6 of 6/i })

    // Pre-submit: no engine error yet, so no invalid state is exposed.
    await expect(firstCell).not.toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()

    // Submit the empty form → the engine validates and reports the error.
    await userEvent.click(canvas.getByRole('button', { name: /verify code/i }))

    // Every digit cell now advertises the invalid state (WCAG 4.1.2).
    await expect(firstCell).toHaveAttribute('aria-invalid', 'true')
    await expect(lastCell).toHaveAttribute('aria-invalid', 'true')

    // A visible, linked error message identifies WHAT is wrong (WCAG 3.3.1)…
    const alert = await canvas.findByRole('alert')
    await expect(alert).toHaveTextContent(
      'Enter all 6 digits of the confirmation code.'
    )

    // …and each cell is programmatically associated with it (aria-describedby).
    await expect(firstCell).toHaveAttribute('aria-describedby', alert.id)
    await expect(lastCell).toHaveAttribute('aria-describedby', alert.id)
  },
}

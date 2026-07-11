/**
 * @fileoverview Storybook stories for the Password component.
 * These stories showcase the various states, themes, and styling capabilities of the Password field.
 * The Password component provides secure password input with visibility toggle functionality.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import PasswordField from './index'

// Themed demo surfaces for mixed-theme stories. The Password input has a
// transparent background, so its theme text color composites directly against
// whatever is behind it — each themed block must render on the canvas color of
// its own theme (sacred #0e0e0e / light #ffffff / dark #111827) to hold WCAG
// contrast.
const demoSurface: Record<'light' | 'dark' | 'sacred', React.CSSProperties> = {
  light: { backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px' },
  dark: { backgroundColor: '#111827', padding: '1rem', borderRadius: '8px' },
  sacred: { backgroundColor: '#0e0e0e', padding: '1rem', borderRadius: '8px' },
}

// Wrapper component for state management
const PasswordFieldWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (newValue: string) => {
    setValue(newValue)
  }
  return <PasswordField {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof PasswordField> = {
  title: 'Components/Field/Password',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PasswordField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <PasswordFieldWithState
      label="Password"
      placeholder="Enter your password"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <PasswordFieldWithState
      label="Secure Password"
      placeholder="Enter secure password"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <PasswordFieldWithState
      label="Secret Incantation"
      placeholder="Enter sacred words..."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <PasswordFieldWithState
      label="Custom Styled Password"
      placeholder="Enter password"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 235, 238, 0.95)',
        borderColor: 'rgba(220, 38, 127, 0.4)',
        borderFocusedColor: 'rgba(220, 38, 127, 1)',
        textColor: 'rgba(136, 19, 55, 1)',
        labelColor: 'rgba(136, 19, 55, 0.7)',
      }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <PasswordFieldWithState
      label="Neon Password"
      placeholder="Enter neon password"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderFocusedColor: 'rgba(255, 215, 0, 1)',
        textColor: 'rgba(255, 215, 0, 1)',
        labelColor: 'rgba(255, 215, 0, 0.7)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordFieldWithState
        label="Large Padding"
        placeholder="Extra space inside"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <PasswordFieldWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <PasswordFieldWithState
        label="Asymmetric Padding"
        placeholder="Different padding sides"
        styles={{
          theme: 'light',
          paddingLeft: '32px',
          paddingRight: '16px',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordFieldWithState
        label="Large Text"
        placeholder="Bigger password field"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <PasswordFieldWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <PasswordFieldWithState
        label="Small & Light"
        placeholder="Subtle appearance"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={demoSurface.light}>
        <PasswordFieldWithState
          label="Password"
          initialValue="weak"
          error="Password is too weak. Must be at least 8 characters."
          styles={{ theme: 'light' }}
        />
      </div>
      <div style={demoSurface.dark}>
        <PasswordFieldWithState
          label="Confirm Password"
          placeholder="Confirm your password"
          error="Passwords do not match."
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            footerTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <div style={demoSurface.sacred}>
        <PasswordFieldWithState
          label="Sacred Key"
          initialValue="forbidden"
          error="The sacred key is corrupted."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={demoSurface.light}>
        <PasswordFieldWithState
          label="Required Password"
          placeholder="Enter your password"
          required
          styles={{ theme: 'light' }}
        />
      </div>
      <div style={demoSurface.light}>
        <PasswordFieldWithState
          label="Current Password"
          placeholder="Enter current password"
          required
          error="This field is required"
          styles={{ theme: 'light' }}
        />
      </div>
      <div style={demoSurface.dark}>
        <PasswordFieldWithState
          label="New Password"
          placeholder="Enter new password"
          required
          styles={{ theme: 'dark' }}
        />
      </div>
      <div style={demoSurface.sacred}>
        <PasswordFieldWithState
          label="Custom Required Password"
          placeholder="Enter sacred password"
          required
          styles={{
            theme: 'sacred',
            requiredIndicatorText: ' (required)',
            requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
          }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PasswordFieldWithState
            label="Basic Password"
            placeholder="Enter password"
            styles={{ theme: 'light' }}
          />
          <PasswordFieldWithState
            label="Password Field"
            initialValue="weak"
            error="Password too weak"
            styles={{ theme: 'light' }}
          />
          <PasswordFieldWithState
            label="Required Password"
            placeholder="Required field"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — rendered on its own dark surface so the
          transparent inputs and dark-theme text composite against the
          background they were designed for */}
      <div style={demoSurface.dark}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PasswordFieldWithState
            label="Basic Dark"
            placeholder="Enter password"
            styles={{ theme: 'dark' }}
          />
          <PasswordFieldWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <PasswordFieldWithState
            label="Large Size"
            placeholder="Enter password"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — gold-on-near-black by design; needs the
          sacred canvas color behind it */}
      <div style={demoSurface.sacred}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PasswordFieldWithState
            label="Sacred Key"
            placeholder="Secret incantation"
            styles={{ theme: 'sacred' }}
          />
          <PasswordFieldWithState
            label="Sacred Password"
            initialValue="forbidden"
            error="Key corrupted"
            styles={{ theme: 'sacred' }}
          />
          <PasswordFieldWithState
            label="Divine Password"
            placeholder="Enter divine key"
            styles={{
              theme: 'sacred',
              borderRadius: '16px',
              padding: '18px',
            }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dark-themed neon field: sits on its own dark surface, and the
              neon purple is purple-400 (#c084fc) — 6.71:1 on #111827 and
              7.90:1 on the near-black input (deep purple 147,51,234 only
              reaches ~2.5:1 on dark) */}
          <div style={demoSurface.dark}>
            <PasswordFieldWithState
              label="Neon Style"
              placeholder="Enter password"
              styles={{
                theme: 'dark',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderFocusedColor: 'rgba(147, 51, 234, 1)',
                textColor: 'rgba(192, 132, 252, 1)',
                labelColor: 'rgba(192, 132, 252, 1)',
                borderRadius: '20px',
                borderWidth: '2px',
              }}
            />
          </div>
          <PasswordFieldWithState
            label="Soft Rounded"
            placeholder="Enter password"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <PasswordFieldWithState
            label="Minimal"
            placeholder="Enter password"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
              padding: '12px 0px',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={demoSurface.light}>
        <PasswordFieldWithState
          label="Disabled Light"
          initialValue="cannot-edit"
          disabled
          styles={{ theme: 'light' }}
        />
      </div>
      <div style={demoSurface.dark}>
        <PasswordFieldWithState
          label="Disabled Dark"
          initialValue="locked-password"
          disabled
          styles={{ theme: 'dark' }}
        />
      </div>
      <div style={demoSurface.sacred}>
        <PasswordFieldWithState
          label="Disabled Sacred"
          initialValue="sealed-key"
          disabled
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const PasswordValidationDemo = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

  const validatePassword = (pwd: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (pwd.length < minLength) {
      return 'Password must be at least 8 characters long'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return ''
  }

  const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (pwd !== confirmPwd) {
      return 'Passwords do not match'
    }
    return ''
  }

  const handleSubmit = () => {
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    )

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })
  }

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    setErrors(prev => ({
      ...prev,
      password: validatePassword(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }))
  }

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword)
    setErrors(prev => ({
      ...prev,
      confirmPassword: validateConfirmPassword(password, newConfirmPassword),
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={handlePasswordChange}
        helperText={errors.password}
        styles={{ theme: 'light', required: true }}
      />
      <PasswordField
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        helperText={errors.confirmPassword}
        styles={{ theme: 'light', required: true }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // blue-600: white text reaches 5.17:1 (blue-500 #3B82F6 was 3.67:1)
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Validate
      </button>
    </div>
  )
}

export const ValidationDemo: Story = {
  render: () => <PasswordValidationDemo />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <PasswordFieldWithState
      label="Test Password Input"
      placeholder="Enter password for testing"
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Enter password for testing')
    const label = canvas.getByText('Test Password Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // Check that input type is password
    expect(input).toHaveAttribute('type', 'password')

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, 'SecurePassword123!', { delay: 50 })

    // Check value (should be masked)
    await expect(input).toHaveValue('SecurePassword123!')
  },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES (regression guards for the 2026-07-11 a11y audit)
// --------------------------------------------------------------------------

/**
 * The show/hide eye is a toggle BUTTON. This pins its programmatic state
 * (`aria-pressed`), its STABLE accessible name (which must NOT invert against
 * the pressed state), the input `type` flip, and the polite `role="status"`
 * live region that speaks the visibility change to screen readers.
 * WCAG 4.1.2 (Name, Role, Value) + 4.1.3 (Status Messages).
 */
export const AccessibleToggleState: Story = {
  name: 'A11y: toggle pressed-state + announcement',
  render: () => (
    <PasswordFieldWithState
      label="Password"
      initialValue="s3cr3t-value"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Password')
    const toggle = canvas.getByRole('button', { name: 'Show password' })
    const status = canvas.getByRole('status')

    // Resting: masked, toggle not pressed, nothing announced yet.
    expect(input).toHaveAttribute('type', 'password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(status).toBeEmptyDOMElement()

    // Reveal → type flips, pressed flips, state is announced.
    await userEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(status).toHaveTextContent('Password shown')
    // The name stays stable so it never contradicts aria-pressed.
    expect(toggle).toHaveAccessibleName('Show password')

    // Mask again → everything reverts and the change is announced.
    await userEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(status).toHaveTextContent('Password hidden')
  },
}

/**
 * Both the input and the eye toggle expose a visible keyboard-focus indicator
 * via CSS `:focus-visible` (the native outline is reset for layout). The input
 * ring is pure-CSS and hydration-independent. WCAG 2.4.7 (Focus Visible).
 */
export const FocusVisibleIndicator: Story = {
  name: 'A11y: input & toggle focus-visible',
  render: () => (
    <PasswordFieldWithState
      label="Password"
      placeholder="Enter password"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Password')
    const toggle = canvas.getByRole('button', { name: 'Show password' })

    await userEvent.click(input)
    expect(input).toHaveFocus()
    // A text input matches :focus-visible on any focus, so the ring shows.
    expect(input.matches(':focus-visible')).toBe(true)

    // Tab to the toggle — it gets its own keyboard-focus ring.
    await userEvent.tab()
    expect(toggle).toHaveFocus()
    expect(toggle.matches(':focus-visible')).toBe(true)
  },
}

/**
 * A label-less usage (`label=""`) can still be named via `ariaLabel`, advertise
 * its purpose via `autoComplete` (password managers / WCAG 1.3.5), and — the
 * cardinal password-field rule — must NEVER block paste. WCAG 4.1.2 / 1.3.5.
 */
export const AccessibleNameAndPurpose: Story = {
  name: 'A11y: name without label + autocomplete + paste',
  render: () => (
    <PasswordFieldWithState
      label=""
      ariaLabel="Account password"
      autoComplete="current-password"
      placeholder="Password"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Account password')
    expect(input).toHaveAttribute('aria-label', 'Account password')
    expect(input).toHaveAttribute('autocomplete', 'current-password')

    // Paste must work — password managers and clipboard fills depend on it.
    await userEvent.click(input)
    await userEvent.paste('P@ste-Works-123')
    expect(input).toHaveValue('P@ste-Works-123')
  },
}

/**
 * The focus/border transition is dropped under `prefers-reduced-motion`
 * (WCAG 2.3.3). The `@media` query is engine-evaluated from the OS setting and
 * can't be toggled from a play fn, so this asserts the guard STRUCTURALLY: a
 * reduced-motion block sets `transition: none` on this field's input class.
 */
export const ReducedMotion: Story = {
  name: 'A11y: reduced-motion guard',
  render: () => (
    <PasswordFieldWithState
      label="Password"
      placeholder="Enter password"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Password')
    const inputClass = Array.from(input.classList).find(c => /input/i.test(c))
    expect(inputClass).toBeTruthy()

    let guarded = false
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        continue // cross-origin sheet — skip
      }
      for (const rule of Array.from(rules)) {
        if (
          rule instanceof CSSMediaRule &&
          rule.conditionText.includes('prefers-reduced-motion') &&
          rule.cssText.includes(inputClass as string) &&
          /transition:\s*none/.test(rule.cssText)
        ) {
          guarded = true
        }
      }
    }
    expect(guarded).toBe(true)
  },
}

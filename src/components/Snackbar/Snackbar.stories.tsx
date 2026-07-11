/**
 * @fileoverview Storybook stories for the Snackbar component.
 * Demonstrates different severity levels, themes, and behaviors.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Snackbar from './index'

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the snackbar is visible',
    },
    message: {
      control: 'text',
      description: 'The message to display in the snackbar',
    },
    severity: {
      control: { type: 'select' },
      options: ['error', 'warning', 'info', 'success'],
      description: 'The severity level of the message',
    },
    autoHideDuration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-hiding',
    },
    onClose: { action: 'closed' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Snackbar>

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

/** Success snackbar with light theme. */
export const LightThemeSuccess: Story = {
  name: 'Themes/Light Theme - Success',
  args: {
    open: true,
    message: 'Operation completed successfully!',
    severity: 'success',
    autoHideDuration: 6000,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Error snackbar with light theme. */
export const LightThemeError: Story = {
  name: 'Themes/Light Theme - Error',
  args: {
    open: true,
    message: 'An error occurred while processing your request.',
    severity: 'error',
    autoHideDuration: 6000,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Warning snackbar with light theme. */
export const LightThemeWarning: Story = {
  name: 'Themes/Light Theme - Warning',
  args: {
    open: true,
    message: 'Please review your input before proceeding.',
    severity: 'warning',
    autoHideDuration: 6000,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Info snackbar with light theme. */
export const LightThemeInfo: Story = {
  name: 'Themes/Light Theme - Info',
  args: {
    open: true,
    message: 'Your session will expire in 5 minutes.',
    severity: 'info',
    autoHideDuration: 6000,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Success snackbar with dark theme. */
export const DarkThemeSuccess: Story = {
  name: 'Themes/Dark Theme - Success',
  args: {
    open: true,
    message: 'Operation completed successfully!',
    severity: 'success',
    autoHideDuration: 6000,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** Error snackbar with dark theme. */
export const DarkThemeError: Story = {
  name: 'Themes/Dark Theme - Error',
  args: {
    open: true,
    message: 'An error occurred while processing your request.',
    severity: 'error',
    autoHideDuration: 6000,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** Warning snackbar with dark theme. */
export const DarkThemeWarning: Story = {
  name: 'Themes/Dark Theme - Warning',
  args: {
    open: true,
    message: 'Please review your input before proceeding.',
    severity: 'warning',
    autoHideDuration: 6000,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** Info snackbar with dark theme. */
export const DarkThemeInfo: Story = {
  name: 'Themes/Dark Theme - Info',
  args: {
    open: true,
    message: 'Your session will expire in 5 minutes.',
    severity: 'info',
    autoHideDuration: 6000,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** Success snackbar with sacred theme. */
export const SacredThemeSuccess: Story = {
  name: 'Themes/Sacred Theme - Success',
  args: {
    open: true,
    message: 'Operation completed successfully!',
    severity: 'success',
    autoHideDuration: 6000,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** Error snackbar with sacred theme. */
export const SacredThemeError: Story = {
  name: 'Themes/Sacred Theme - Error',
  args: {
    open: true,
    message: 'An error occurred while processing your request.',
    severity: 'error',
    autoHideDuration: 6000,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** Warning snackbar with sacred theme. */
export const SacredThemeWarning: Story = {
  name: 'Themes/Sacred Theme - Warning',
  args: {
    open: true,
    message: 'Please review your input before proceeding.',
    severity: 'warning',
    autoHideDuration: 6000,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** Info snackbar with sacred theme. */
export const SacredThemeInfo: Story = {
  name: 'Themes/Sacred Theme - Info',
  args: {
    open: true,
    message: 'Your session will expire in 5 minutes.',
    severity: 'info',
    autoHideDuration: 6000,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// SEVERITY STORIES
// --------------------------------------------------------------------------

// Shared "All Severities" component. `theme` threads through to each Snackbar's
// inner Alert so the toast palette matches the story's canvas: a light-themed
// Alert rendered on the dark/sacred canvas failed WCAG contrast (the success
// message sat at ~3.9:1 on the composited alert surface). Demo-button
// backgrounds use the campaign light severity-text grades, each verified ≥4.5:1
// under white text (success 5.02, error 6.47, warning 5.02, info 6.70).
const AllSeveritiesComponent: React.FC<{
  theme: 'light' | 'dark' | 'sacred'
}> = ({ theme }) => {
  const [openStates, setOpenStates] = useState({
    success: true,
    error: false,
    warning: false,
    info: false,
  })

  const handleClose = (severity: keyof typeof openStates) => {
    setOpenStates(prev => ({ ...prev, [severity]: false }))
  }

  const handleShow = (severity: keyof typeof openStates) => {
    setOpenStates(prev => ({ ...prev, [severity]: true }))
  }

  // Heading color follows the canvas (gold on sacred, white on dark, default on
  // light). Only affects the demo chrome, not the Snackbars themselves.
  const headingColor =
    theme === 'sacred' ? '#FFD700' : theme === 'dark' ? 'white' : undefined

  const triggers: {
    severity: keyof typeof openStates
    label: string
    background: string
  }[] = [
    { severity: 'success', label: 'Show Success', background: '#15803d' },
    { severity: 'error', label: 'Show Error', background: '#b91c1c' },
    { severity: 'warning', label: 'Show Warning', background: '#b45309' },
    { severity: 'info', label: 'Show Info', background: '#1d4ed8' },
  ]

  const messages: Record<keyof typeof openStates, string> = {
    success: 'Operation completed successfully!',
    error: 'An error occurred while processing your request.',
    warning: 'Please review your input before proceeding.',
    info: 'Your session will expire in 5 minutes.',
  }

  return (
    <div style={{ padding: '2rem', color: headingColor }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Click buttons to show different snackbars:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {triggers.map(trigger => (
            <button
              key={trigger.severity}
              onClick={() => handleShow(trigger.severity)}
              style={{
                padding: '8px 16px',
                backgroundColor: trigger.background,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {trigger.label}
            </button>
          ))}
        </div>
      </div>

      {triggers.map(trigger => (
        <Snackbar
          key={trigger.severity}
          open={openStates[trigger.severity]}
          onClose={() => handleClose(trigger.severity)}
          message={messages[trigger.severity]}
          severity={trigger.severity}
          autoHideDuration={6000}
          styles={{ theme }}
        />
      ))}
    </div>
  )
}

/** All severity levels in light theme. */
export const AllSeveritiesLight: Story = {
  name: 'Severity/All Severities - Light Theme',
  render: () => <AllSeveritiesComponent theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/** All severity levels in dark theme. */
export const AllSeveritiesDark: Story = {
  name: 'Severity/All Severities - Dark Theme',
  render: () => <AllSeveritiesComponent theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

/** All severity levels in sacred theme. */
export const AllSeveritiesSacred: Story = {
  name: 'Severity/All Severities - Sacred Theme',
  render: () => <AllSeveritiesComponent theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// BEHAVIOR STORIES
// --------------------------------------------------------------------------

/** Snackbar with custom auto-hide duration. */
export const CustomDuration: Story = {
  name: 'Behavior/Custom Duration',
  args: {
    open: true,
    message: 'This snackbar will auto-hide in 3 seconds',
    severity: 'info',
    autoHideDuration: 3000,
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Snackbar that doesn't auto-hide (`autoHideDuration: 0` disables the timer).
 * The play function pins the real behavior: the snackbar must STILL be
 * visible well after mount — under the old always-schedule-a-timer logic it
 * hid after 0ms, so this assertion fails against that code.
 */
export const NoAutoHide: Story = {
  name: 'Behavior/No Auto-Hide',
  args: {
    open: true,
    message: 'This snackbar will not auto-hide - you must close it manually',
    severity: 'warning',
    autoHideDuration: 0,
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    // Give the (buggy) 0ms timer every chance to fire before asserting.
    await new Promise(resolve => setTimeout(resolve, 300))
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(
        'This snackbar will not auto-hide - you must close it manually'
      )
    ).toBeVisible()
  },
}

/**
 * WCAG 2.2.1 (Timing Adjustable) — hovering the snackbar PAUSES its auto-hide
 * countdown so a user reading the message is never rushed. The play function
 * pins the behavior: with a short auto-hide, the snackbar is hovered before the
 * timer elapses, stays `data-paused="true"` and VISIBLE well past
 * `autoHideDuration`, then dismisses only after the pointer leaves. Against the
 * old always-run timer this assertion fails (the toast vanishes while hovered).
 */
export const PauseOnHover: Story = {
  name: 'Behavior/Pause On Hover (WCAG 2.2.1)',
  args: {
    open: true,
    message: 'Hover me — I will wait until you move away.',
    severity: 'info',
    autoHideDuration: 1200,
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvasElement.querySelector(
      '[data-component="Snackbar"]'
    ) as HTMLElement
    await expect(root).toBeInTheDocument()

    // Hovering pauses the auto-hide countdown.
    await userEvent.hover(root)
    await waitFor(() => expect(root).toHaveAttribute('data-paused', 'true'))

    // Well past the auto-hide window it is STILL visible, because it is paused.
    await new Promise(resolve => setTimeout(resolve, 1600))
    await expect(
      canvas.getByText('Hover me — I will wait until you move away.')
    ).toBeVisible()

    // Leaving resumes a fresh full-duration countdown; the snackbar then closes.
    await userEvent.unhover(root)
    await waitFor(() => expect(root).not.toHaveAttribute('data-paused'))
    await waitFor(
      () =>
        expect(
          canvas.queryByText('Hover me — I will wait until you move away.')
        ).not.toBeInTheDocument(),
      { timeout: 2500 }
    )
  },
}

/**
 * WCAG 2.2.1 keyboard/AT parity — when focus is WITHIN the snackbar (the user
 * has tabbed to the Close button) the auto-hide countdown pauses, so the
 * dismiss control can never disappear from under the keyboard. Blurring away
 * resumes the countdown.
 */
export const PauseOnFocus: Story = {
  name: 'Behavior/Pause On Focus (WCAG 2.2.1)',
  args: {
    open: true,
    message: 'Focus the close button and the timer holds.',
    severity: 'warning',
    autoHideDuration: 1200,
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvasElement.querySelector(
      '[data-component="Snackbar"]'
    ) as HTMLElement
    const closeButton = canvas.getByRole('button', { name: 'Close' })

    // Moving focus into the snackbar pauses the countdown.
    closeButton.focus()
    await expect(closeButton).toHaveFocus()
    await waitFor(() => expect(root).toHaveAttribute('data-paused', 'true'))

    // Still visible past the auto-hide window while focused.
    await new Promise(resolve => setTimeout(resolve, 1600))
    await expect(
      canvas.getByText('Focus the close button and the timer holds.')
    ).toBeVisible()

    // Focus leaving the snackbar resumes the countdown.
    closeButton.blur()
    await waitFor(() => expect(root).not.toHaveAttribute('data-paused'))
  },
}

/**
 * Controlled wrapper for the pause-flag reset regression. The parent keeps the
 * Snackbar MOUNTED and only toggles `open` (an external button re-opens it,
 * `onClose` closes it), so React state on the ONE Snackbar instance persists
 * across an open → closed → open cycle — exactly the reuse pattern that the
 * pause-flag reset must survive.
 */
const PauseResetOnReopenComponent: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '2rem' }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1d4ed8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Show snackbar
      </button>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        message="Reused toast — must auto-hide again after reopen."
        severity="info"
        autoHideDuration={1000}
      />
    </div>
  )
}

/**
 * WCAG 2.2.1 lifecycle regression — the auto-hide pause flags MUST reset when
 * the snackbar closes, so a REUSED instance still auto-dismisses on its next
 * open. The parent keeps the Snackbar mounted and toggles `open`, so a toast
 * dismissed WHILE paused (here: hovered, then closed via its own Close button so
 * the node unmounts under the pointer and no `mouseleave` fires) must not leave
 * the pause state stuck. The play function reopens the same instance and asserts
 * it is NOT paused and auto-dismisses again. Against the pre-fix code the stuck
 * pause flag means the reopened toast never schedules a timer and stays forever,
 * so both assertions fail.
 */
export const PauseFlagResetsOnReopen: Story = {
  name: 'Behavior/Pause Flag Resets On Reopen (WCAG 2.2.1)',
  render: () => <PauseResetOnReopenComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const showButton = canvas.getByRole('button', { name: 'Show snackbar' })
    const message = 'Reused toast — must auto-hide again after reopen.'

    // 1) Open the toast, then hover it so the auto-hide countdown is PAUSED.
    await userEvent.click(showButton)
    const root = await waitFor(() => {
      const el = canvasElement.querySelector('[data-component="Snackbar"]')
      if (!el) throw new Error('snackbar did not open')
      return el as HTMLElement
    })
    await userEvent.hover(root)
    await waitFor(() => expect(root).toHaveAttribute('data-paused', 'true'))

    // 2) Dismiss via the inner Close button while STILL hovered. The node
    //    unmounts under the pointer, so no `mouseleave` is delivered — pre-fix
    //    this left the hover pause flag stuck true across the close.
    const closeButton = within(root).getByRole('button', { name: 'Close' })
    await userEvent.click(closeButton)
    await waitFor(() =>
      expect(canvas.queryByText(message)).not.toBeInTheDocument()
    )

    // 3) Reopen the SAME instance. Because the flags reset on close, the reused
    //    toast is NOT paused (pre-fix it would still carry data-paused="true").
    await userEvent.click(showButton)
    const reopened = await waitFor(() => {
      const el = canvasElement.querySelector('[data-component="Snackbar"]')
      if (!el) throw new Error('snackbar did not reopen')
      return el as HTMLElement
    })
    await expect(reopened).not.toHaveAttribute('data-paused')

    // 4) A fresh countdown was scheduled, so it auto-dismisses again. Against
    //    the pre-fix stuck-flag code no timer is ever scheduled and this waitFor
    //    times out (the toast stays visible forever).
    await waitFor(
      () => expect(canvas.queryByText(message)).not.toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

// Component for Interactive
const InteractiveComponent: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Show Snackbar
      </button>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        message="This is an interactive snackbar!"
        severity="success"
        autoHideDuration={4000}
      />
    </div>
  )
}

/** Interactive snackbar with manual control. */
export const Interactive: Story = {
  name: 'Behavior/Interactive',
  render: () => <InteractiveComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByText('Show Snackbar')
    await userEvent.click(button)
    // The click must actually open the snackbar.
    await expect(
      await canvas.findByText('This is an interactive snackbar!')
    ).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// REAL-WORLD USE CASES
// --------------------------------------------------------------------------

// Component for Form Submission
const FormSubmissionComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState<'success' | 'error'>('success')
  const [message, setMessage] = useState('')

  const handleSubmit = (success: boolean) => {
    if (success) {
      setSeverity('success')
      setMessage('Form submitted successfully! Your data has been saved.')
    } else {
      setSeverity('error')
      setMessage(
        'Failed to submit form. Please check your input and try again.'
      )
    }
    setOpen(true)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <h3>Form Submission Demo</h3>
        <p>Click the buttons below to simulate form submission:</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => handleSubmit(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#15803d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit Successfully
          </button>
          <button
            onClick={() => handleSubmit(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#b91c1c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit with Error
          </button>
        </div>
      </div>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        message={message}
        severity={severity}
        autoHideDuration={5000}
      />
    </div>
  )
}

/** Form submission feedback. */
export const FormSubmission: Story = {
  name: 'Use Cases/Form Submission',
  render: () => <FormSubmissionComponent />,
  globals: { backgrounds: { value: 'light' } },
}

// Component for File Upload
const FileUploadComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>(
    'success'
  )
  const [message, setMessage] = useState('')

  const handleUpload = (type: 'success' | 'error' | 'warning') => {
    setSeverity(type)
    switch (type) {
      case 'success':
        setMessage('File uploaded successfully! document.pdf has been saved.')
        break
      case 'error':
        setMessage(
          'Upload failed. File size exceeds the maximum limit of 10MB.'
        )
        break
      case 'warning':
        setMessage('File uploaded with warnings. Some formatting may be lost.')
        break
    }
    setOpen(true)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <h3>File Upload Demo</h3>
        <p>Click the buttons below to simulate file upload scenarios:</p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => handleUpload('success')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#15803d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Upload Success
          </button>
          <button
            onClick={() => handleUpload('error')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#b91c1c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Upload Error
          </button>
          <button
            onClick={() => handleUpload('warning')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#b45309',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Upload Warning
          </button>
        </div>
      </div>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        message={message}
        severity={severity}
        autoHideDuration={6000}
      />
    </div>
  )
}

/** File upload feedback. */
export const FileUpload: Story = {
  name: 'Use Cases/File Upload',
  render: () => <FileUploadComponent />,
  globals: { backgrounds: { value: 'light' } },
}

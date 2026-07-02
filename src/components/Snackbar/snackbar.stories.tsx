/**
 * @fileoverview Storybook stories for the Snackbar component.
 * Demonstrates different severity levels, themes, and behaviors.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within } from 'storybook/test'
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

// Component for All Severities Light
const AllSeveritiesLightComponent: React.FC = () => {
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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Click buttons to show different snackbars:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleShow('success')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Success
          </button>
          <button
            onClick={() => handleShow('error')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Error
          </button>
          <button
            onClick={() => handleShow('warning')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Warning
          </button>
          <button
            onClick={() => handleShow('info')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Info
          </button>
        </div>
      </div>

      <Snackbar
        open={openStates.success}
        onClose={() => handleClose('success')}
        message="Operation completed successfully!"
        severity="success"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.error}
        onClose={() => handleClose('error')}
        message="An error occurred while processing your request."
        severity="error"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.warning}
        onClose={() => handleClose('warning')}
        message="Please review your input before proceeding."
        severity="warning"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.info}
        onClose={() => handleClose('info')}
        message="Your session will expire in 5 minutes."
        severity="info"
        autoHideDuration={6000}
      />
    </div>
  )
}

/** All severity levels in light theme. */
export const AllSeveritiesLight: Story = {
  name: 'Severity/All Severities - Light Theme',
  render: () => <AllSeveritiesLightComponent />,
  globals: { backgrounds: { value: 'light' } },
}

// Component for All Severities Dark
const AllSeveritiesDarkComponent: React.FC = () => {
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

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Click buttons to show different snackbars:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleShow('success')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Success
          </button>
          <button
            onClick={() => handleShow('error')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Error
          </button>
          <button
            onClick={() => handleShow('warning')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Warning
          </button>
          <button
            onClick={() => handleShow('info')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Info
          </button>
        </div>
      </div>

      <Snackbar
        open={openStates.success}
        onClose={() => handleClose('success')}
        message="Operation completed successfully!"
        severity="success"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.error}
        onClose={() => handleClose('error')}
        message="An error occurred while processing your request."
        severity="error"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.warning}
        onClose={() => handleClose('warning')}
        message="Please review your input before proceeding."
        severity="warning"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.info}
        onClose={() => handleClose('info')}
        message="Your session will expire in 5 minutes."
        severity="info"
        autoHideDuration={6000}
      />
    </div>
  )
}

/** All severity levels in dark theme. */
export const AllSeveritiesDark: Story = {
  name: 'Severity/All Severities - Dark Theme',
  render: () => <AllSeveritiesDarkComponent />,
  globals: { backgrounds: { value: 'dark' } },
}

// Component for All Severities Sacred
const AllSeveritiesSacredComponent: React.FC = () => {
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

  return (
    <div style={{ padding: '2rem', color: '#FFD700' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Click buttons to show different snackbars:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleShow('success')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Success
          </button>
          <button
            onClick={() => handleShow('error')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Error
          </button>
          <button
            onClick={() => handleShow('warning')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Warning
          </button>
          <button
            onClick={() => handleShow('info')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show Info
          </button>
        </div>
      </div>

      <Snackbar
        open={openStates.success}
        onClose={() => handleClose('success')}
        message="Operation completed successfully!"
        severity="success"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.error}
        onClose={() => handleClose('error')}
        message="An error occurred while processing your request."
        severity="error"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.warning}
        onClose={() => handleClose('warning')}
        message="Please review your input before proceeding."
        severity="warning"
        autoHideDuration={6000}
      />
      <Snackbar
        open={openStates.info}
        onClose={() => handleClose('info')}
        message="Your session will expire in 5 minutes."
        severity="info"
        autoHideDuration={6000}
      />
    </div>
  )
}

/** All severity levels in sacred theme. */
export const AllSeveritiesSacred: Story = {
  name: 'Severity/All Severities - Sacred Theme',
  render: () => <AllSeveritiesSacredComponent />,
  globals: { backgrounds: { value: 'dark' } },
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
              backgroundColor: '#4caf50',
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
              backgroundColor: '#f44336',
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
              backgroundColor: '#4caf50',
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
              backgroundColor: '#f44336',
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
              backgroundColor: '#ff9800',
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

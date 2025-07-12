/**
 * @fileoverview Storybook stories for the Dialog component.
 * These stories showcase the various themes and styling options for the Dialog component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect, userEvent } from '@storybook/test'
import Dialog from './index'
import Button from '../Button'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: { control: 'boolean' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

// Sample dialog content component
const DialogContent = () => (
  <div style={{ padding: '24px', minWidth: '300px' }}>
    <h2
      style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 'bold' }}
    >
      Confirm Action
    </h2>
    <p style={{ margin: '0 0 24px 0', color: '#666' }}>
      Are you sure you want to proceed with this action? This cannot be undone.
    </p>
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <Button styles={{ theme: 'light' }}>Cancel</Button>
      <Button
        styles={{ theme: 'light', backgroundColor: '#dc2626', color: 'white' }}
      >
        Confirm
      </Button>
    </div>
  </div>
)

// Interactive wrapper for stories
const InteractiveDialog = ({
  styles,
  children,
}: {
  styles?: any
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '20px' }}>
      <Button
        styles={{ theme: styles?.theme || 'light' }}
        onClick={() => setOpen(true)}
      >
        Open Dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} styles={styles}>
        {children}
      </Dialog>
    </div>
  )
}

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const Light: Story = {
  name: 'Light/Basic',
  render: () => (
    <InteractiveDialog styles={{ theme: 'light' }}>
      <DialogContent />
    </InteractiveDialog>
  ),
}

export const LightFullWidth: Story = {
  name: 'Light/Full Width',
  render: () => (
    <InteractiveDialog
      styles={{ theme: 'light', fullWidth: true, maxWidth: '600px' }}
    >
      <DialogContent />
    </InteractiveDialog>
  ),
}

export const LightCustomSize: Story = {
  name: 'Light/Custom Size',
  render: () => (
    <InteractiveDialog
      styles={{ theme: 'light', maxWidth: '800px', minHeight: '400px' }}
    >
      <div style={{ padding: '24px' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Large Dialog
        </h2>
        <p style={{ margin: '0 0 16px 0', color: '#666' }}>
          This dialog demonstrates custom sizing options. You can set maxWidth,
          minHeight, and other dimensional properties through the styles prop.
        </p>
        <div
          style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <p>Content area with custom height</p>
        </div>
      </div>
    </InteractiveDialog>
  ),
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Basic',
  render: () => (
    <InteractiveDialog styles={{ theme: 'dark' }}>
      <div style={{ padding: '24px', minWidth: '300px', color: 'white' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Dark Theme Dialog
        </h2>
        <p style={{ margin: '0 0 24px 0', color: '#d1d5db' }}>
          This dialog uses the dark theme with improved contrast and styling.
        </p>
        <div
          style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
        >
          <Button styles={{ theme: 'dark' }}>Cancel</Button>
          <Button
            styles={{
              theme: 'dark',
              backgroundColor: '#2563eb',
              color: 'white',
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </InteractiveDialog>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

export const Sacred: Story = {
  name: 'Sacred/Basic',
  render: () => (
    <InteractiveDialog styles={{ theme: 'sacred' }}>
      <div style={{ padding: '24px', minWidth: '300px', color: '#f5f5dc' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          Sacred Theme Dialog
        </h2>
        <p style={{ margin: '0 0 24px 0', color: '#f5f5dc' }}>
          This dialog uses the sacred theme with mystical golden accents and
          special effects.
        </p>
        <div
          style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
        >
          <Button styles={{ theme: 'sacred' }}>Cancel</Button>
          <Button styles={{ theme: 'sacred' }}>Confirm</Button>
        </div>
      </div>
    </InteractiveDialog>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOMIZATION STORIES
// --------------------------------------------------------------------------

export const CustomBackdrop: Story = {
  name: 'Customization/Custom Backdrop',
  render: () => (
    <InteractiveDialog
      styles={{
        theme: 'light',
        backdropBackgroundColor: 'rgba(59, 130, 246, 0.3)',
        backdropBlur: '4px',
      }}
    >
      <div style={{ padding: '24px', minWidth: '300px' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Custom Backdrop
        </h2>
        <p style={{ margin: '0 0 24px 0', color: '#666' }}>
          This dialog has a custom blue backdrop with enhanced blur effect.
        </p>
        <Button styles={{ theme: 'light' }}>Close</Button>
      </div>
    </InteractiveDialog>
  ),
}

export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  render: () => (
    <InteractiveDialog
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(254, 242, 242, 0.95)',
        borderColor: '#fca5a5',
        borderWidth: '2px',
      }}
    >
      <div style={{ padding: '24px', minWidth: '300px' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#dc2626',
          }}
        >
          Error Dialog
        </h2>
        <p style={{ margin: '0 0 24px 0', color: '#991b1b' }}>
          This dialog uses custom colors to indicate an error state.
        </p>
        <Button
          styles={{
            theme: 'light',
            backgroundColor: '#dc2626',
            color: 'white',
          }}
        >
          Understand
        </Button>
      </div>
    </InteractiveDialog>
  ),
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

// Component for Interaction Test
const InteractionTestComponent: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '20px' }}>
      <Button
        styles={{ theme: 'light' }}
        onClick={() => setOpen(true)}
        data-testid="open-dialog"
      >
        Open Test Dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '24px' }}>
          <h2 data-testid="dialog-title">Test Dialog</h2>
          <p data-testid="dialog-content">
            This dialog can be closed by clicking the backdrop, pressing Escape,
            or clicking the close button.
          </p>
          <Button
            styles={{ theme: 'light' }}
            onClick={() => setOpen(false)}
            data-testid="close-dialog"
          >
            Close Dialog
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => <InteractionTestComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test opening dialog
    const openButton = canvas.getByTestId('open-dialog')
    await userEvent.click(openButton)

    // Check dialog is visible
    const dialogTitle = canvas.getByTestId('dialog-title')
    await expect(dialogTitle).toBeVisible()

    // Test closing dialog
    const closeButton = canvas.getByTestId('close-dialog')
    await userEvent.click(closeButton)

    // Check dialog is closed
    await expect(dialogTitle).not.toBeVisible()
  },
}

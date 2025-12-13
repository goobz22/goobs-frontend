/**
 * @fileoverview Storybook stories for the Popover component.
 * These stories showcase the various themes and styling options for the Popover component.
 */
import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect, userEvent } from 'storybook/test'
import Popover from './index'
import Button from '../Button'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
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
type Story = StoryObj<typeof Popover>

// Sample popover content component
const PopoverContent = ({ theme }: { theme?: string }) => (
  <div style={{ padding: '16px', minWidth: '200px' }}>
    <h3
      style={{
        margin: '0 0 8px 0',
        fontSize: '1rem',
        fontWeight: 'bold',
        color:
          theme === 'sacred' ? '#FFD700' : theme === 'dark' ? 'white' : '#333',
      }}
    >
      Popover Content
    </h3>
    <p
      style={{
        margin: '0 0 12px 0',
        fontSize: '0.875rem',
        color:
          theme === 'sacred'
            ? '#f5f5dc'
            : theme === 'dark'
              ? '#d1d5db'
              : '#666',
      }}
    >
      This is some content inside the popover. It can contain any React
      elements.
    </p>
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        styles={{ theme: (theme as any) || 'light', fontSize: '0.875rem' }}
      >
        Action
      </Button>
    </div>
  </div>
)

// Interactive wrapper for stories
const InteractivePopover = ({
  styles,
  children,
}: {
  styles?: any
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '100px' }}>
      <Button
        ref={anchorRefCallback}
        styles={{ theme: styles?.theme || 'light' }}
        onClick={() => setOpen(!open)}
      >
        Toggle Popover
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        styles={styles}
      >
        {children}
      </Popover>
    </div>
  )
}

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const Light: Story = {
  name: 'Light/Basic',
  render: () => (
    <InteractivePopover styles={{ theme: 'light' }}>
      <PopoverContent theme="light" />
    </InteractivePopover>
  ),
}

export const LightWithCustomContent: Story = {
  name: 'Light/Custom Content',
  render: () => (
    <InteractivePopover styles={{ theme: 'light', padding: '20px' }}>
      <div style={{ minWidth: '300px' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.125rem',
            fontWeight: 'bold',
          }}
        >
          User Profile
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
            }}
          />
          <div>
            <p style={{ margin: '0', fontWeight: 'bold' }}>John Doe</p>
            <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>
              john.doe@example.com
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
          <Button styles={{ theme: 'light', width: '100%' }}>
            View Profile
          </Button>
        </div>
      </div>
    </InteractivePopover>
  ),
}

export const LightCustomSize: Story = {
  name: 'Light/Custom Size',
  render: () => (
    <InteractivePopover
      styles={{
        theme: 'light',
        maxWidth: '400px',
        minHeight: '200px',
        padding: '24px',
      }}
    >
      <div>
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Large Popover
        </h3>
        <p style={{ margin: '0 0 16px 0', color: '#666' }}>
          This popover demonstrates custom sizing options. You can control
          width, height, and padding through the styles prop.
        </p>
        <div
          style={{
            height: '100px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ margin: '0', color: '#666' }}>Custom content area</p>
        </div>
      </div>
    </InteractivePopover>
  ),
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Basic',
  render: () => (
    <InteractivePopover styles={{ theme: 'dark' }}>
      <PopoverContent theme="dark" />
    </InteractivePopover>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithMenu: Story = {
  name: 'Dark/Menu',
  render: () => (
    <InteractivePopover styles={{ theme: 'dark', padding: '8px' }}>
      <div style={{ minWidth: '180px' }}>
        {['Profile', 'Settings', 'Help', 'Sign Out'].map(item => (
          <div
            key={item}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              color: '#d1d5db',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </InteractivePopover>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES (CONTINUED)
// --------------------------------------------------------------------------

export const DarkBasic: Story = {
  name: 'Dark/Basic Popover',
  render: () => (
    <InteractivePopover styles={{ theme: 'dark' }}>
      <PopoverContent theme="dark" />
    </InteractivePopover>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithContent: Story = {
  name: 'Dark/With Content',
  render: () => (
    <InteractivePopover styles={{ theme: 'dark', padding: '20px' }}>
      <div style={{ minWidth: '250px', color: '#f5f5dc' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          Powers
        </h3>
        <div style={{ marginBottom: '16px' }}>
          {['Divine Protection', 'Mystic Insight', 'Sacred Healing'].map(
            power => (
              <div
                key={power}
                style={{
                  padding: '6px 0',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {power}
              </div>
            )
          )}
        </div>
        <Button styles={{ theme: 'dark', width: '100%' }}>
          Activate Power
        </Button>
      </div>
    </InteractivePopover>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOMIZATION STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  render: () => (
    <InteractivePopover
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(254, 242, 242, 0.95)',
        borderColor: '#fca5a5',
        borderWidth: '2px',
      }}
    >
      <div style={{ padding: '16px', minWidth: '200px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#dc2626',
          }}
        >
          Warning
        </h3>
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '0.875rem',
            color: '#991b1b',
          }}
        >
          This popover uses custom colors to indicate a warning state.
        </p>
        <Button
          styles={{
            theme: 'light',
            backgroundColor: '#dc2626',
            color: 'white',
          }}
        >
          Acknowledge
        </Button>
      </div>
    </InteractivePopover>
  ),
}

export const CustomPosition: Story = {
  name: 'Customization/Custom Position',
  render: () => (
    <InteractivePopover
      styles={{
        theme: 'light',
        marginTop: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div style={{ padding: '16px', minWidth: '200px', textAlign: 'center' }}>
        <h3
          style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold' }}
        >
          Custom Position
        </h3>
        <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>
          This popover has custom positioning with centered alignment.
        </p>
      </div>
    </InteractivePopover>
  ),
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

// Component for Interaction Test
const InteractionTestComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '100px' }}>
      <Button
        ref={anchorRefCallback}
        styles={{ theme: 'light' }}
        onClick={() => setOpen(!open)}
        data-testid="toggle-popover"
      >
        Toggle Test Popover
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '16px' }}>
          <h3 data-testid="popover-title">Test Popover</h3>
          <p data-testid="popover-content">
            This popover can be closed by clicking outside or pressing Escape.
          </p>
          <Button
            styles={{ theme: 'light' }}
            onClick={() => setOpen(false)}
            data-testid="close-popover"
          >
            Close Popover
          </Button>
        </div>
      </Popover>
    </div>
  )
}

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => <InteractionTestComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test opening popover
    const toggleButton = canvas.getByTestId('toggle-popover')
    await userEvent.click(toggleButton)

    // Check popover is visible
    const popoverTitle = canvas.getByTestId('popover-title')
    await expect(popoverTitle).toBeVisible()

    // Test closing popover
    const closeButton = canvas.getByTestId('close-popover')
    await userEvent.click(closeButton)

    // Check popover is closed
    await expect(popoverTitle).not.toBeVisible()
  },
}

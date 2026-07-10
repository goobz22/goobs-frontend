/**
 * @fileoverview Storybook stories for the Popover component.
 * These stories showcase the various themes and styling options for the Popover component.
 */
import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
import Popover, { type PopoverStyles } from './index'
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
      {/* Button renders its label from the `text` prop — JSX children are
          dropped by the component, so children-based labels render an
          EMPTY button (no accessible name). */}
      <Button
        text="Action"
        styles={{ theme: theme || 'light', fontSize: '0.875rem' }}
      />
    </div>
  </div>
)

// Interactive wrapper for stories
const InteractivePopover = ({
  styles,
  children,
}: {
  styles: PopoverStyles
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
        text="Toggle Popover"
        styles={{ theme: styles.theme || 'light' }}
        onClick={() => setOpen(!open)}
      />
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
  globals: { backgrounds: { value: 'light' } },
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
          <Button
            text="View Profile"
            styles={{ theme: 'light', width: '100%' }}
          />
        </div>
      </div>
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Default',
  render: () => (
    <InteractivePopover styles={{ theme: 'dark' }}>
      <PopoverContent theme="dark" />
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'dark' } },
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
  globals: { backgrounds: { value: 'dark' } },
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
  globals: { backgrounds: { value: 'dark' } },
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
        <Button
          text="Activate Power"
          styles={{ theme: 'dark', width: '100%' }}
        />
      </div>
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

/**
 * Dedicated sacred baseline. Passes the component's real theme prop
 * (`styles: { theme: 'sacred' }`), so the surface emits `data-theme="sacred"`
 * and renders the sacred CSS override block: `--goobs-sacred-surface`
 * background with the sacred ambient gradient, gold border, and
 * `--goobs-shadow-sacred-glow`. The play step clicks the trigger so the
 * baseline captures the OPEN sacred surface, not just the toggle button.
 */
export const Sacred: Story = {
  name: 'Themes/Sacred',
  render: () => (
    <InteractivePopover styles={{ theme: 'sacred' }}>
      <PopoverContent theme="sacred" />
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle Popover' })
    )
    // The popover portals to document.body, so query the whole document.
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Popover Content')).toBeVisible()
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
            // #b91c1c (not #dc2626): 16px bold is below the WCAG large-text
            // threshold, and #dc2626 on the pink surface is 4.45 (< 4.5).
            // #b91c1c reads the same warning red at 5.96.
            color: '#b91c1c',
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
          text="Acknowledge"
          styles={{
            theme: 'light',
            backgroundColor: '#dc2626',
            color: 'white',
          }}
        />
      </div>
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Demonstrates the positioning overrides `PopoverStyles` actually supports.
 * The popover surface is `position: fixed`; `top` and `left` replace the
 * anchor-derived coordinates (piped in as `--popover-top` / `--popover-left`),
 * and `marginTop: '0'` removes the default 0.5rem gap below the anchor. The
 * popover therefore renders pinned to the top-left corner of the viewport
 * instead of hanging below its trigger button.
 */
export const CustomPosition: Story = {
  name: 'Customization/Custom Position',
  render: () => (
    <InteractivePopover
      styles={{
        theme: 'light',
        top: '24px',
        left: '24px',
        marginTop: '0',
      }}
    >
      <div style={{ padding: '16px', minWidth: '200px', textAlign: 'center' }}>
        <h3
          style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold' }}
        >
          Custom Position
        </h3>
        <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>
          This popover overrides top and left, so it is pinned to the
          viewport&apos;s top-left corner instead of its anchor.
        </p>
      </div>
    </InteractivePopover>
  ),
  globals: { backgrounds: { value: 'light' } },
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
        text="Toggle Test Popover"
        styles={{ theme: 'light' }}
        onClick={() => setOpen(!open)}
        data-testid="toggle-popover"
      />
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
            text="Close Popover"
            styles={{ theme: 'light' }}
            onClick={() => setOpen(false)}
            data-testid="close-popover"
          />
        </div>
      </Popover>
    </div>
  )
}

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => <InteractionTestComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test opening popover — the trigger lives inside the canvas...
    const toggleButton = canvas.getByTestId('toggle-popover')
    await userEvent.click(toggleButton)

    // ...but the popover PORTALS to document.body, outside the canvas
    // element, so its content must be queried against the whole document
    // (same pattern as the Themes/Sacred play).
    const body = within(canvasElement.ownerDocument.body)
    const popoverTitle = await body.findByTestId('popover-title')
    await expect(popoverTitle).toBeVisible()

    // Test closing popover — the close button is portalled too
    const closeButton = body.getByTestId('close-popover')
    await userEvent.click(closeButton)

    // Check popover is closed (unmounted — detached nodes are not visible)
    await expect(popoverTitle).not.toBeVisible()
  },
}

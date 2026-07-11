/**
 * @fileoverview Storybook stories for the Popover component.
 * These stories showcase the various themes and styling options for the Popover component.
 */
import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent, waitFor } from 'storybook/test'
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

// --------------------------------------------------------------------------
// A11Y — MODAL DIALOG FOCUS MANAGEMENT
// --------------------------------------------------------------------------

/**
 * Exercises the WAI-ARIA APG Dialog(Modal) focus contract the default
 * `role="dialog"` + `aria-modal="true"` surface now honours:
 *   1. Opening moves focus INTO the surface (first focusable child).
 *   2. Tab is trapped — from the last focusable, Tab wraps to the first, and
 *      Shift+Tab from the first wraps to the last (WCAG 2.4.3 Focus Order).
 *   3. Escape closes the dialog and RESTORES focus to the trigger (2.1.2 / 4.1.2).
 *   4. `ariaLabelledBy` gives the dialog an accessible name (4.1.2).
 * Native buttons are used inside so the test asserts real focusability without
 * coupling to any other component's internals.
 */
const FocusManagementComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '120px' }}>
      <button
        ref={anchorRefCallback}
        type="button"
        onClick={() => setOpen(previous => !previous)}
        style={{ padding: '8px 16px' }}
      >
        Open Dialog
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        ariaLabelledBy="fm-dialog-title"
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '16px', minWidth: '220px' }}>
          <h3 id="fm-dialog-title" style={{ margin: '0 0 12px 0' }}>
            Confirm action
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" style={{ padding: '6px 12px' }}>
              First action
            </button>
            <button type="button" style={{ padding: '6px 12px' }}>
              Last action
            </button>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export const DialogFocusManagement: Story = {
  name: 'A11y/Dialog Focus Management',
  render: () => <FocusManagementComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open Dialog' })
    await userEvent.click(trigger)

    // The popover PORTALS to document.body, so query the whole document.
    const body = within(canvasElement.ownerDocument.body)

    // The dialog exposes its accessible name from the ariaLabelledBy heading.
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Confirm action')

    // 1. Opening moved focus INTO the surface (first focusable child).
    const firstAction = body.getByRole('button', { name: 'First action' })
    const lastAction = body.getByRole('button', { name: 'Last action' })
    await waitFor(() => expect(firstAction).toHaveFocus())

    // 2. Tab from the LAST focusable wraps back to the FIRST (trap).
    lastAction.focus()
    await userEvent.tab()
    await waitFor(() => expect(firstAction).toHaveFocus())

    // 2b. Shift+Tab from the FIRST wraps forward to the LAST (trap).
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(lastAction).toHaveFocus())

    // 3. Escape closes the dialog and RESTORES focus to the trigger.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

// --------------------------------------------------------------------------
// A11Y — MODAL DIALOG BACKGROUND ISOLATION
// --------------------------------------------------------------------------

/**
 * Regression story for the `aria-modal="true"` contract COMPLETION: a modal
 * dialog must remove the background from the accessibility tree, not merely trap
 * keyboard focus. On open, every `document.body` sibling of the portalled surface
 * is marked `aria-hidden="true"` so a screen-reader virtual cursor (VoiceOver /
 * NVDA browse mode) cannot wander into the background; on close it is restored.
 *
 * Isolation uses `aria-hidden`, NOT `inert` — the surface has no backdrop scrim
 * and dismisses via a document-level outside-click, so the background must stay
 * pointer-clickable. `aria-hidden` hides from AT without blocking pointer events;
 * `inert` would swallow the dismissing click. The play step proves the background
 * gains a hidden ancestor while open, that the dialog surface itself is NOT
 * hidden, and that the background is fully restored on close.
 */
const BackgroundIsolationComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '120px' }}>
      <p data-testid="background-text">Background content behind the dialog.</p>
      <button
        ref={anchorRefCallback}
        type="button"
        onClick={() => setOpen(previous => !previous)}
        style={{ padding: '8px 16px' }}
      >
        Open Dialog
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        ariaLabelledBy="bi-dialog-title"
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '16px', minWidth: '220px' }}>
          <h3 id="bi-dialog-title" style={{ margin: '0 0 12px 0' }}>
            Isolated dialog
          </h3>
          <button type="button" style={{ padding: '6px 12px' }}>
            Inside action
          </button>
        </div>
      </Popover>
    </div>
  )
}

export const DialogBackgroundIsolation: Story = {
  name: 'A11y/Dialog Background Isolation',
  render: () => <BackgroundIsolationComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const doc = canvasElement.ownerDocument
    const body = within(doc.body)

    const trigger = canvas.getByRole('button', { name: 'Open Dialog' })
    // Captured before open: after open the story root becomes aria-hidden, and
    // getByRole would then skip elements inside it (accessibility-tree filtered).
    const backgroundText = canvas.getByTestId('background-text')

    // Walk from a node up to <body>, reporting whether any ancestor (the
    // isolated body-level sibling) is `aria-hidden="true"`.
    const hasHiddenAncestor = (element: Element): boolean => {
      let node: Element | null = element
      while (node && node !== doc.body) {
        if (node.getAttribute('aria-hidden') === 'true') return true
        node = node.parentElement
      }
      return false
    }

    // Before open: the background is fully exposed to assistive tech.
    await expect(hasHiddenAncestor(backgroundText)).toBe(false)

    await userEvent.click(trigger)

    // The dialog is announced (surface itself is NOT aria-hidden)...
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(hasHiddenAncestor(dialog)).toBe(false)

    // ...and the background is now removed from the accessibility tree, so a
    // virtual cursor can't wander into it (COMPLETES the aria-modal contract).
    await waitFor(() => expect(hasHiddenAncestor(backgroundText)).toBe(true))

    // Closing RESTORES the background to the accessibility tree.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    await waitFor(() => expect(hasHiddenAncestor(backgroundText)).toBe(false))
  },
}

// --------------------------------------------------------------------------
// A11Y — TRIGGER DISCLOSURE SEMANTICS (menu-button pattern)
// --------------------------------------------------------------------------

/**
 * Regression story for the trigger disclosure contract on the NON-modal popup
 * roles (WAI-ARIA APG menu-button / disclosure; WCAG 4.1.2). A control that
 * toggles a `role="menu"` (or listbox/grid) popover must advertise, ON THE
 * TRIGGER ITSELF:
 *   - `aria-haspopup="menu"` — there is a popup of this kind,
 *   - `aria-expanded` — reflecting whether it is currently open, and
 *   - `aria-controls` — the id of the surface it controls (present only while
 *     the surface is in the DOM).
 * The Popover owns the anchor, so it wires these by default; the play step
 * proves each is set on open and torn down (expanded→false, controls removed)
 * on close, without the consumer wiring anything.
 */
const MenuDisclosureComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '120px' }}>
      <button
        ref={anchorRefCallback}
        type="button"
        onClick={() => setOpen(previous => !previous)}
        style={{ padding: '8px 16px' }}
      >
        Actions
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        role="menu"
        ariaLabel="Row actions"
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '8px', minWidth: '160px' }}>
          <button type="button" role="menuitem" style={{ display: 'block' }}>
            Edit
          </button>
          <button type="button" role="menuitem" style={{ display: 'block' }}>
            Delete
          </button>
        </div>
      </Popover>
    </div>
  )
}

export const TriggerDisclosureSemantics: Story = {
  name: 'A11y/Trigger Disclosure Semantics',
  render: () => <MenuDisclosureComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Actions' })

    // Closed: the trigger already advertises it owns a menu popup, collapsed,
    // and controls nothing yet (the surface is not in the DOM).
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).not.toHaveAttribute('aria-controls')

    // Open: expanded flips true and aria-controls points at the live surface.
    await userEvent.click(trigger)
    const menu = await body.findByRole('menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const controls = trigger.getAttribute('aria-controls')
    await expect(controls).toBeTruthy()
    await expect(menu).toHaveAttribute('id', controls as string)

    // Close via Escape: expanded returns to false and the stale controls IDREF
    // is removed (the surface it referenced is gone).
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menu).not.toBeInTheDocument())
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).not.toHaveAttribute('aria-controls')
  },
}

// --------------------------------------------------------------------------
// A11Y — TOOLTIP DESCRIPTION ASSOCIATION
// --------------------------------------------------------------------------

/**
 * Regression story for the `role="tooltip"` association fix (WCAG 1.3.1 / 4.1.2).
 * A tooltip is only useful to a screen reader if the element it describes points
 * at it via `aria-describedby`. The Popover now links the trigger to the surface
 * while a `role="tooltip"` popover is open (appending, so it never clobbers an
 * existing describedby) and removes the link on close. The play step proves the
 * trigger gains a describedby IDREF resolving to the tooltip surface on open, and
 * that it is fully removed on close.
 */
const TooltipDescriptionComponent: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const anchorRefCallback = useCallback((el: HTMLButtonElement | null) => {
    setAnchorEl(el)
  }, [])

  return (
    <div style={{ padding: '120px' }}>
      <button
        ref={anchorRefCallback}
        type="button"
        onClick={() => setOpen(previous => !previous)}
        style={{ padding: '8px 16px' }}
      >
        Show hint
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        role="tooltip"
        styles={{ theme: 'light' }}
      >
        <div style={{ padding: '8px 12px' }}>Saves without leaving the page.</div>
      </Popover>
    </div>
  )
}

export const TooltipDescription: Story = {
  name: 'A11y/Tooltip Description Association',
  render: () => <TooltipDescriptionComponent />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Show hint' })

    // Closed: no description link yet.
    await expect(trigger).not.toHaveAttribute('aria-describedby')

    // Open: the trigger is described by the tooltip surface.
    await userEvent.click(trigger)
    const tip = await body.findByText('Saves without leaving the page.')
    const surface = tip.closest('[data-component="Popover"]') as HTMLElement
    const describedBy = trigger.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    await expect((describedBy as string).split(/\s+/)).toContain(
      surface.getAttribute('id')
    )

    // Close: the association is fully removed.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(surface).not.toBeInTheDocument())
    await expect(trigger).not.toHaveAttribute('aria-describedby')
  },
}

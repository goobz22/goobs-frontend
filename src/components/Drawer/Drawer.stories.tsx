/**
 * @fileoverview Storybook stories for the Drawer component.
 * Demonstrates light, dark, and sacred themes, the temporary/persistent/
 * permanent variants, and each anchor edge. Interactive variants use a small
 * stateful wrapper so the drawer can be opened and closed.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import Drawer from './index'
import Button from '../Button'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the drawer is open',
    },
    anchor: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Which side the drawer opens from',
    },
    variant: {
      control: 'select',
      options: ['permanent', 'persistent', 'temporary'],
      description: 'The variant of the drawer',
    },
    children: {
      control: false,
      description: 'Drawer content',
    },
    styles: {
      control: 'object',
      description: 'Component styling including theme and layout',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Drawer>

// --------------------------------------------------------------------------
// SHARED CONTENT
// --------------------------------------------------------------------------

const DrawerMenu = ({
  theme,
}: {
  theme: 'light' | 'dark' | 'sacred'
}): React.JSX.Element => {
  const color =
    theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937'
  return (
    <div style={{ padding: '24px', minWidth: '240px', color }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Navigation</h3>
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span style={{ cursor: 'pointer' }}>Dashboard</span>
        <span style={{ cursor: 'pointer' }}>Projects</span>
        <span style={{ cursor: 'pointer' }}>Team</span>
        <span style={{ cursor: 'pointer' }}>Reports</span>
        <span style={{ cursor: 'pointer' }}>Settings</span>
      </nav>
    </div>
  )
}

// Accessible menu variant: uses REAL <nav> + <a href> links and a native
// <button> so the drawer's focus trap has genuine tab stops to cycle through,
// and gives the heading an id so the drawer can reference it as its accessible
// name via `ariaLabelledBy`.
const AccessibleDrawerMenu = ({
  theme,
  headingId,
  onClose,
}: {
  theme: 'light' | 'dark' | 'sacred'
  headingId: string
  onClose?: () => void
}): React.JSX.Element => {
  const color =
    theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937'
  return (
    <div style={{ padding: '24px', minWidth: '240px', color }}>
      <h3 id={headingId} style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>
        Navigation
      </h3>
      <nav
        aria-label="Primary"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <a href="#dashboard" style={{ color }}>
          Dashboard
        </a>
        <a href="#projects" style={{ color }}>
          Projects
        </a>
        <a href="#team" style={{ color }}>
          Team
        </a>
        <a href="#reports" style={{ color }}>
          Reports
        </a>
        <a href="#settings" style={{ color }}>
          Settings
        </a>
      </nav>
      {onClose && (
        <button type="button" onClick={onClose} style={{ marginTop: '16px' }}>
          Close
        </button>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// INTERACTIVE WRAPPER
// --------------------------------------------------------------------------
// The temporary/persistent drawer needs an open state plus a trigger to open
// it; this wrapper supplies both.

const InteractiveDrawer = ({
  theme,
  anchor = 'left',
  variant = 'temporary',
}: {
  theme: 'light' | 'dark' | 'sacred'
  anchor?: 'left' | 'right' | 'top' | 'bottom'
  variant?: 'permanent' | 'persistent' | 'temporary'
}): React.JSX.Element => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ padding: '24px', minHeight: '420px' }}>
      <Button
        text="Open Drawer"
        styles={{ theme }}
        onClick={() => setOpen(true)}
      />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        variant={variant}
        styles={{ theme }}
      >
        <DrawerMenu theme={theme} />
      </Drawer>
    </div>
  )
}

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  render: () => <InteractiveDrawer theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  render: () => <InteractiveDrawer theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  render: () => <InteractiveDrawer theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// ANCHOR STORIES
// --------------------------------------------------------------------------

export const AnchorLeft: Story = {
  name: 'Anchor/Left',
  render: () => <InteractiveDrawer theme="light" anchor="left" />,
  globals: { backgrounds: { value: 'light' } },
}

export const AnchorRight: Story = {
  name: 'Anchor/Right',
  render: () => <InteractiveDrawer theme="light" anchor="right" />,
  globals: { backgrounds: { value: 'light' } },
}

export const AnchorTop: Story = {
  name: 'Anchor/Top',
  render: () => <InteractiveDrawer theme="light" anchor="top" />,
  globals: { backgrounds: { value: 'light' } },
}

export const AnchorBottom: Story = {
  name: 'Anchor/Bottom',
  render: () => <InteractiveDrawer theme="light" anchor="bottom" />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// VARIANT STORIES
// --------------------------------------------------------------------------

/**
 * A permanent drawer is always open and renders inline (no backdrop), so it is
 * shown directly without a trigger button. Because it is never dismissable it is
 * exposed to assistive tech as a `complementary` landmark (NOT a modal-style
 * `role="dialog"`); `ariaLabelledBy` points at the in-panel heading so the
 * landmark carries an accessible name, letting screen-reader users jump to it
 * via landmark navigation (WCAG 1.3.1 / 4.1.2).
 */
export const PermanentVariant: Story = {
  name: 'Variant/Permanent',
  render: () => (
    <div style={{ display: 'flex', minHeight: '420px' }}>
      <Drawer
        variant="permanent"
        styles={{ theme: 'light' }}
        ariaLabelledBy="permanent-drawer-heading"
      >
        <AccessibleDrawerMenu
          theme="light"
          headingId="permanent-drawer-heading"
        />
      </Drawer>
      <div style={{ flex: 1, padding: '24px', color: '#1F2937' }}>
        <h2 style={{ marginTop: 0 }}>Main Content</h2>
        <p>
          A permanent drawer stays open beside the page content and does not use
          a backdrop.
        </p>
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const TemporaryVariant: Story = {
  name: 'Variant/Temporary',
  render: () => <InteractiveDrawer theme="light" variant="temporary" />,
  globals: { backgrounds: { value: 'light' } },
}

export const PersistentVariant: Story = {
  name: 'Variant/Persistent',
  render: () => <InteractiveDrawer theme="light" variant="persistent" />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------

// Wrapper for the accessible temporary (modal) drawer: passes `ariaLabelledBy`
// pointing at the in-panel heading, and renders real focusable content so the
// focus trap, initial focus, and focus-restore behaviours are exercisable.
const AccessibleDrawer = ({
  theme = 'light',
  anchor = 'left',
}: {
  theme?: 'light' | 'dark' | 'sacred'
  anchor?: 'left' | 'right' | 'top' | 'bottom'
}): React.JSX.Element => {
  const [open, setOpen] = useState(false)
  const headingId = 'drawer-nav-heading'
  return (
    <div style={{ padding: '24px', minHeight: '420px' }}>
      <Button
        text="Open Drawer"
        styles={{ theme }}
        onClick={() => setOpen(true)}
      />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        variant="temporary"
        styles={{ theme }}
        ariaLabelledBy={headingId}
      >
        <AccessibleDrawerMenu
          theme={theme}
          headingId={headingId}
          onClose={() => setOpen(false)}
        />
      </Drawer>
    </div>
  )
}

/**
 * Accessible temporary (modal) drawer. Demonstrates the WAI-ARIA Dialog
 * pattern: `ariaLabelledBy` points at the in-panel `<h3>` so screen readers
 * announce the drawer on open; focus moves into the panel, Tab/Shift+Tab are
 * trapped within it, Escape (or the Close button) dismisses it, and focus
 * returns to the trigger button. The slide honours `prefers-reduced-motion`.
 */
export const AccessibleNameAndFocusTrap: Story = {
  name: 'Accessibility/Accessible Name + Focus Trap',
  render: () => <AccessibleDrawer theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Sacred-theme accessible drawer. Confirms the accessible-name wiring and focus
 * trap apply across themes, and that the decorative glyph canvas is
 * `aria-hidden` (screen readers ignore it) and frozen under reduced motion.
 */
export const AccessibleSacred: Story = {
  name: 'Accessibility/Accessible Sacred',
  render: () => <AccessibleDrawer theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

// Wrapper demonstrating the modal drawer's background isolation. While the
// temporary (modal) drawer is open, body scroll is locked (parity with the
// sibling Dialog) and every element behind the scrim is marked `inert` +
// `aria-hidden`, so neither the pointer nor a virtual cursor can reach it. The
// page is intentionally tall (to show the scroll-lock) and includes a focusable
// background link (to show it becomes unreachable). Opens by default so the
// locked/inerted background state is what the snapshot captures.
const ModalIsolationDrawer = (): React.JSX.Element => {
  const [open, setOpen] = useState(true)
  const headingId = 'modal-isolation-heading'
  return (
    <div style={{ padding: '24px', minHeight: '1200px' }}>
      <Button
        text="Open Drawer"
        styles={{ theme: 'light' }}
        onClick={() => setOpen(true)}
      />
      <h2 style={{ color: '#1F2937' }}>Main Content</h2>
      <p style={{ maxWidth: '520px', color: '#1F2937' }}>
        This page is intentionally tall. While the modal drawer is open the body
        cannot scroll and every element here is marked <code>inert</code> +{' '}
        <code>aria-hidden</code>, so neither the pointer nor a virtual cursor can
        reach it — only the drawer is reachable.
      </p>
      <a href="#background-target" style={{ color: '#2563EB' }}>
        A background link (unreachable while the modal is open)
      </a>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        styles={{ theme: 'light' }}
        ariaLabelledBy={headingId}
      >
        <AccessibleDrawerMenu
          theme="light"
          headingId={headingId}
          onClose={() => setOpen(false)}
        />
      </Drawer>
    </div>
  )
}

/**
 * Modal background isolation (WAI-ARIA Dialog(Modal)). While the temporary
 * (modal) drawer is open the page behind the scrim is locked from scrolling and
 * marked `inert` + `aria-hidden`, so it is unreachable by pointer and by a
 * virtual cursor even where an AT only imperfectly honours `aria-modal` —
 * matching the sibling Dialog's body scroll-lock and going beyond it with
 * enforced background inerting. The backdrop scrim stays clickable to dismiss,
 * and any goobs overlay opened from inside the drawer (which portals to
 * `document.body`) stays interactive. Opens by default so the isolated
 * background is exercised.
 */
export const ModalBackgroundIsolation: Story = {
  name: 'Accessibility/Modal Background Isolation',
  render: () => <ModalIsolationDrawer />,
  globals: { backgrounds: { value: 'light' } },
}

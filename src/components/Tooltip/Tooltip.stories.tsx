/**
 * @fileoverview Storybook stories for the StyledTooltip component. Pins the
 * hover-trigger wiring, placement/arrow variants, and — via the controlled
 * `open` prop — the open bubble itself (content surface, arrow, and the
 * light/dark/sacred bubble palettes), which hover-only stories never capture.
 * These stories are the Tooltip regression spec — goobs has no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import StyledTooltip from './index'
import Button from '../Button'

const meta: Meta<typeof StyledTooltip> = {
  title: 'Components/Tooltip',
  component: StyledTooltip,
  argTypes: {
    title: {
      control: 'text',
      description: 'The tooltip content text',
    },
    tooltipplacement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    arrow: { control: 'boolean' },
    enterDelay: { control: 'number' },
    leaveDelay: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof StyledTooltip>

const defaultArgs = {
  title: 'This is a helpful tooltip',
  tooltipplacement: 'top' as const,
  arrow: true,
  enterDelay: 100,
  leaveDelay: 0,
}

// Basic tooltip story
export const Basic: Story = {
  name: 'Basic/Light Theme',
  render: args => (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button>Hover me</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
  },
}

// Sacred theme tooltip story
export const SacredTheme: Story = {
  name: 'Basic/Sacred Theme',
  render: args => (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#000',
        minHeight: '200px',
      }}
    >
      <StyledTooltip {...args}>
        <Button styles={{ theme: 'sacred' }}>Hover me</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Sacred wisdom revealed',
    styles: {
      theme: 'sacred',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// Different placements
export const Placements: Story = {
  render: () => (
    <div
      style={{
        padding: '4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
        placeItems: 'center',
      }}
    >
      <StyledTooltip title="Top tooltip" tooltipplacement="top">
        <Button>Top</Button>
      </StyledTooltip>
      <StyledTooltip title="Bottom tooltip" tooltipplacement="bottom">
        <Button>Bottom</Button>
      </StyledTooltip>
      <StyledTooltip title="Left tooltip" tooltipplacement="left">
        <Button>Left</Button>
      </StyledTooltip>
      <StyledTooltip title="Right tooltip" tooltipplacement="right">
        <Button>Right</Button>
      </StyledTooltip>
    </div>
  ),
}

// --------------------------------------------------------------------------
// OPEN BUBBLE — controlled `open` prop renders the bubble without hover, so
// the tooltip's actual visual output (content surface + arrow) is in the
// snapshot. The shared play function pins that the open bubble element
// really mounted with `data-state="open"` and shows the title text.
// --------------------------------------------------------------------------

const assertOpenBubble =
  (theme: 'light' | 'dark' | 'sacred', titleText: string) =>
  async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    // The visual bubble is force-open via the controlled `open` prop — no hover.
    // Query it by its data-component selector rather than by text: the title
    // now also lives in the persistent, visually hidden role="tooltip"
    // description, so a text query would ambiguously match two elements.
    const bubbleRoot = canvasElement.querySelector('[data-component="Tooltip"]')
    await expect(bubbleRoot).not.toBeNull()
    await expect(bubbleRoot).toHaveTextContent(titleText)
    await expect(bubbleRoot).toHaveAttribute('data-state', 'open')
    await expect(bubbleRoot).toHaveAttribute('data-theme', theme)
    // The visual bubble is decorative; screen readers get the text from the
    // persistent role="tooltip" description referenced by aria-describedby.
    await expect(bubbleRoot).toHaveAttribute('aria-hidden', 'true')
    const trigger = canvas.getByRole('button')
    const describedby = trigger.getAttribute('aria-describedby')
    await expect(describedby).toBeTruthy()
    const description = canvasElement.ownerDocument.getElementById(
      describedby as string
    )
    await expect(description).not.toBeNull()
    await expect(description).toHaveAttribute('role', 'tooltip')
    await expect(description).toHaveTextContent(titleText)
  }

/**
 * Light-theme bubble held open via the controlled `open` prop: the white
 * content surface, dark text, and bottom arrow are rendered above the
 * trigger with no hover — this is the bubble the snapshot pins.
 */
export const OpenLight: Story = {
  name: 'Open/Light Bubble',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button styles={{ theme: 'light' }}>Anchor</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Light bubble, always open',
    open: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: assertOpenBubble('light', 'Light bubble, always open'),
}

/**
 * Dark-theme bubble held open on a dark backdrop: the dark content surface
 * and light text stay legible against the dark canvas, arrow pointing at
 * the trigger below.
 */
export const OpenDark: Story = {
  name: 'Open/Dark Bubble',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button styles={{ theme: 'dark' }}>Anchor</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Dark bubble, always open',
    open: true,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
  play: assertOpenBubble('dark', 'Dark bubble, always open'),
}

/**
 * Sacred-theme bubble held open on the sacred backdrop: the black/gold
 * bubble palette with the wider 6px sacred arrow — the only snapshot of the
 * sacred bubble's actual visual output.
 */
export const OpenSacred: Story = {
  name: 'Open/Sacred Bubble',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button styles={{ theme: 'sacred' }}>Anchor</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Sacred bubble, always open',
    open: true,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
  play: assertOpenBubble('sacred', 'Sacred bubble, always open'),
}

// --------------------------------------------------------------------------
// A11Y — keyboard + screen-reader behavior. Pins the accessibility contract
// that hover-only stories can't reach: the tooltip opens on keyboard FOCUS
// (WCAG 2.1.1), the trigger is programmatically described by the tooltip text
// via aria-describedby -> a persistent role="tooltip" element (WCAG 1.3.1 /
// 4.1.2), and Escape dismisses it without moving focus (WCAG 1.4.13).
// --------------------------------------------------------------------------
export const KeyboardFocusAndEscape: Story = {
  name: 'A11y/Keyboard Focus & Escape',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button>Focus me</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Shown on focus, dismissable with Escape',
    enterDelay: 0,
    leaveDelay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')

    // Association is present even before the tooltip is shown (WCAG 1.3.1 /
    // 4.1.2): the trigger is described by a persistent role="tooltip" element.
    const describedby = trigger.getAttribute('aria-describedby')
    await expect(describedby).toBeTruthy()
    const description = canvasElement.ownerDocument.getElementById(
      describedby as string
    )
    await expect(description).not.toBeNull()
    await expect(description).toHaveAttribute('role', 'tooltip')
    await expect(description).toHaveTextContent(
      'Shown on focus, dismissable with Escape'
    )

    // Closed initially — the animated visual bubble is not mounted.
    await expect(
      canvasElement.querySelector('[data-component="Tooltip"]')
    ).toBeNull()

    // Keyboard focus opens the visual bubble, same as a pointer hover (WCAG
    // 2.1.1 Keyboard) — hover-only tooltips are invisible to keyboard users.
    trigger.focus()
    await expect(trigger).toHaveFocus()
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-component="Tooltip"]')
      ).not.toBeNull()
    )

    // Escape dismisses the tooltip WITHOUT moving focus (WCAG 1.4.13
    // Dismissable) — focus stays on the trigger.
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-component="Tooltip"]')
      ).toBeNull()
    )
    await expect(trigger).toHaveFocus()
  },
}

/**
 * WCAG 1.4.13 (Content on Hover or Focus — *Hoverable*): the shown bubble is
 * pointer-interactive (`pointer-events: auto`) and a transparent bridge spans
 * the trigger↔bubble arrow gap, so a pointer user can move onto the bubble to
 * read it without it closing. The play hovers the trigger to open the bubble,
 * asserts it is now pointer-interactive (a pre-fix `pointer-events: none` bubble
 * reports `'none'` here), then moves the pointer off the trigger and onto the
 * bubble and confirms it stays open.
 */
export const Hoverable: Story = {
  name: 'A11y/Hoverable Bubble',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        <Button>Hover me</Button>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'Hover onto me to keep me open',
    enterDelay: 0,
    // A non-zero leave delay bridges the pointer's transit from trigger to
    // bubble; the fix is what lets the pointer LAND on the bubble at all.
    leaveDelay: 150,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    const getBubble = () =>
      canvasElement.querySelector('[data-component="Tooltip"]')

    // Hover the trigger → the visual bubble opens.
    await userEvent.hover(trigger)
    const bubble = await waitFor(() => {
      const found = getBubble()
      if (!found) throw new Error('tooltip bubble did not open on hover')
      return found as HTMLElement
    })

    // The shown bubble is pointer-interactive — the core of the Hoverable fix.
    // A pre-fix `pointer-events: none` bubble would report 'none' here.
    const view = canvasElement.ownerDocument.defaultView
    await expect(view?.getComputedStyle(bubble).pointerEvents).toBe('auto')

    // Leaving the trigger arms the close; moving onto the bubble cancels it, so
    // the tooltip stays open while the pointer rests on the bubble (Hoverable).
    await userEvent.unhover(trigger)
    await userEvent.hover(bubble)
    await expect(getBubble()).not.toBeNull()

    // Leaving the bubble finally dismisses it.
    await userEvent.unhover(bubble)
    await waitFor(() => expect(getBubble()).toBeNull())
  },
}

/**
 * WCAG 2.1.1 / 4.1.2 (non-focusable trigger self-heal): when the child is a
 * decorative, `aria-hidden` element (an info icon — the single most common
 * tooltip case) it can neither receive keyboard focus nor carry a useful
 * `aria-describedby`. The wrapper self-heals into a focusable, labelled
 * `role="button"` trigger, so a keyboard user can open the tooltip and a screen
 * reader announces the text on focus. The play asserts the wrapper became the
 * named button, that keyboard focus opens the bubble, and that Escape dismisses
 * it without moving focus.
 */
export const NonFocusableTrigger: Story = {
  name: 'A11y/Non-focusable (icon) Trigger',
  render: args => (
    <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
      <StyledTooltip {...args}>
        {/* Decorative, non-interactive icon — hidden from AT, not focusable. */}
        <span aria-hidden="true" style={{ fontSize: '1.25rem', cursor: 'help' }}>
          {'ⓘ'}
        </span>
      </StyledTooltip>
    </div>
  ),
  args: {
    ...defaultArgs,
    title: 'More information about this feature',
    enterDelay: 0,
    leaveDelay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const getBubble = () =>
      canvasElement.querySelector('[data-component="Tooltip"]')

    // The wrapper self-healed into the focusable, labelled trigger: a pre-fix
    // plain <div> wrapper has no button role, so getByRole would throw here.
    const trigger = canvas.getByRole('button')
    await expect(trigger).toHaveAttribute('tabindex', '0')
    await expect(trigger).toHaveAccessibleName(
      'More information about this feature'
    )

    // The decorative child is NOT given aria-describedby (AT would ignore it);
    // the description is carried by the focusable wrapper's name instead.
    const icon = trigger.querySelector('[aria-hidden="true"]')
    await expect(icon).not.toBeNull()
    await expect(icon).not.toHaveAttribute('aria-describedby')

    // Closed initially.
    await expect(getBubble()).toBeNull()

    // Keyboard focus on the self-healed wrapper opens the visual bubble
    // (WCAG 2.1.1) — impossible when the wrapper was a non-focusable <div>.
    trigger.focus()
    await expect(trigger).toHaveFocus()
    await waitFor(() => expect(getBubble()).not.toBeNull())

    // Escape dismisses without moving focus (WCAG 1.4.13 Dismissable).
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(getBubble()).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

// With and without arrow
export const ArrowVariants: Story = {
  render: () => (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
      }}
    >
      <StyledTooltip title="With arrow" arrow={true}>
        <Button>With Arrow</Button>
      </StyledTooltip>
      <StyledTooltip title="Without arrow" arrow={false}>
        <Button>Without Arrow</Button>
      </StyledTooltip>
    </div>
  ),
}

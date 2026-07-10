/**
 * @fileoverview Storybook stories for the StyledTooltip component. Pins the
 * hover-trigger wiring, placement/arrow variants, and — via the controlled
 * `open` prop — the open bubble itself (content surface, arrow, and the
 * light/dark/sacred bubble palettes), which hover-only stories never capture.
 * These stories are the Tooltip regression spec — goobs has no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { expect, within } from 'storybook/test'
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
    // The bubble is force-open via the controlled `open` prop — no hover.
    const bubble = await canvas.findByText(titleText)
    await expect(bubble).toBeVisible()
    const bubbleRoot = canvasElement.querySelector(
      '[data-component="Tooltip"]'
    )
    await expect(bubbleRoot).not.toBeNull()
    await expect(bubbleRoot).toHaveAttribute('data-state', 'open')
    await expect(bubbleRoot).toHaveAttribute('data-theme', theme)
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
        <Button>Anchor</Button>
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

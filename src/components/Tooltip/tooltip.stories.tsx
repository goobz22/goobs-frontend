import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
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
  tags: ['autodocs'],
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
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// Different placements
export const Placements: Story = {
  name: 'Placements',
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

// With and without arrow
export const ArrowVariants: Story = {
  name: 'Arrow Variants',
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

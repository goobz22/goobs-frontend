/**
 * @fileoverview Storybook stories for the Accordion component.
 * Demonstrates different states, themes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Accordion from './index'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultExpanded: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '500px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Accordion>

const sampleDetails = (
  <p style={{ padding: '1rem', margin: 0 }}>
    This is the detailed content of the accordion. It can contain any React
    node.
  </p>
)

// --------------------------------------------------------------------------
// Basic Stories
// --------------------------------------------------------------------------

/** A default, collapsed accordion. */
export const Default: Story = {
  args: {
    summary: 'Default Accordion',
    details: sampleDetails,
  },
}

/** An accordion that is expanded by default. */
export const ExpandedByDefault: Story = {
  name: 'State/Expanded by Default',
  args: {
    ...Default.args,
    summary: 'Expanded by Default',
    defaultExpanded: true,
  },
}

/** A disabled accordion that cannot be interacted with. */
export const Disabled: Story = {
  name: 'State/Disabled',
  args: {
    ...Default.args,
    summary: 'Disabled Accordion',
    disabled: true,
  },
}

// --------------------------------------------------------------------------
// Theming Stories
// --------------------------------------------------------------------------

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  name: 'Theme/Sacred',
  args: {
    ...Default.args,
    summary: 'Sacred Theme Accordion',
    sacredtheme: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** A sacred theme accordion that is also disabled. */
export const SacredDisabled: Story = {
  name: 'Theme/Sacred Disabled',
  args: {
    ...SacredTheme.args,
    summary: 'Sacred & Disabled',
    disabled: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** The premium accordion without its default outline. */
export const PremiumNoOutline: Story = {
  name: 'Theme/Premium No Outline',
  args: {
    ...Default.args,
    summary: 'Premium Without Outline',
    outline: false,
  },
}

// --------------------------------------------------------------------------
// Composition Stories
// --------------------------------------------------------------------------

/** Multiple accordions can be used together. */
export const Multiple: Story = {
  name: 'Composition/Multiple',
  render: () => (
    <>
      <Accordion summary="First Item" details={sampleDetails} />
      <Accordion summary="Second Item" details={sampleDetails} />
      <Accordion summary="Third Item" details={sampleDetails} />
    </>
  ),
}

/** Accordions can be nested within each other. */
export const Nested: Story = {
  name: 'Composition/Nested',
  args: {
    summary: 'Parent Accordion',
    details: (
      <div style={{ padding: '1rem' }}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p>This is the parent's content.</p>
        <Accordion summary="Nested Accordion" details={sampleDetails} />
      </div>
    ),
  },
}

// --------------------------------------------------------------------------
// Controlled Story
// --------------------------------------------------------------------------

const ControlledAccordionExample = () => {
  const [expanded, setExpanded] = React.useState<boolean | undefined>(undefined)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button onClick={() => setExpanded(prev => !prev)}>
        Toggle Externally
      </button>
      <Accordion
        summary="Controlled Accordion"
        details={sampleDetails}
        expanded={expanded}
        onChange={(_, newExpanded) => setExpanded(newExpanded)}
      />
    </div>
  )
}

/** An accordion whose state is controlled by an external component. */
export const Controlled: Story = {
  name: 'State/Controlled',
  render: () => <ControlledAccordionExample />,
}

// --------------------------------------------------------------------------
// Interaction Test
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  name: 'Interaction Test',
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const summary = canvas.getByText('Default Accordion')

    // Check it&apos;s initially collapsed
    await expect(
      canvas.queryByText('This is the detailed content', { exact: false })
    ).toBeNull()

    // Click to expand
    await userEvent.click(summary)
    await expect(
      canvas.getByText('This is the detailed content', { exact: false })
    ).toBeVisible()

    // Click to collapse
    await userEvent.click(summary)
    await expect(
      canvas.queryByText('This is the detailed content', { exact: false })
    ).toBeNull()
  },
}

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
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    defaultExpanded: { control: 'boolean' },
    expanded: { control: 'boolean' },
    summary: { control: 'text' },
    details: { control: 'text' },
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/** A default, collapsed accordion with light theme. */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  args: {
    summary: 'Light Theme Accordion',
    details: sampleDetails,
    styles: { theme: 'light' },
  },
}

/** A dark theme accordion. */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    summary: 'Dark Theme Accordion',
    details: sampleDetails,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    summary: 'Sacred Theme Accordion',
    details: sampleDetails,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** An accordion that is expanded by default. */
export const ExpandedByDefault: Story = {
  name: 'State/Expanded by Default',
  args: {
    summary: 'Expanded by Default',
    details: sampleDetails,
    defaultExpanded: true,
    styles: { theme: 'light' },
  },
}

/** A disabled accordion that cannot be interacted with. */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Accordion
        summary="Disabled Light"
        details={sampleDetails}
        styles={{ theme: 'light', disabled: true }}
      />
      <Accordion
        summary="Disabled Dark"
        details={sampleDetails}
        styles={{ theme: 'dark', disabled: true }}
      />
      <Accordion
        summary="Disabled Sacred"
        details={sampleDetails}
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

/** A sacred theme accordion that is also disabled. */
export const SacredDisabled: Story = {
  name: 'State/Sacred Disabled',
  args: {
    summary: 'Sacred & Disabled',
    details: sampleDetails,
    styles: { theme: 'sacred', disabled: true },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

/** The premium accordion without its default outline. */
export const PremiumNoOutline: Story = {
  name: 'Styling/Premium No Outline',
  args: {
    summary: 'Premium Without Outline',
    details: sampleDetails,
    styles: { theme: 'light', outline: false },
  },
}

/** Custom colors and styling. */
export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    summary: 'Custom Styled Accordion',
    details: sampleDetails,
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(255, 240, 245, 0.95)',
      borderColor: 'rgba(255, 20, 147, 0.4)',
      summaryBackgroundColor: 'rgba(255, 20, 147, 0.1)',
      summaryColor: 'rgba(139, 0, 139, 1)',
    },
  },
}

// --------------------------------------------------------------------------
// COMPOSITION STORIES
// --------------------------------------------------------------------------

/** Multiple accordions can be used together. */
export const Multiple: Story = {
  name: 'Composition/Multiple',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Accordion
        summary="First Item"
        details={sampleDetails}
        styles={{ theme: 'light' }}
      />
      <Accordion
        summary="Second Item"
        details={sampleDetails}
        styles={{ theme: 'light' }}
      />
      <Accordion
        summary="Third Item"
        details={sampleDetails}
        defaultExpanded={true}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

/** Accordions can be nested within each other. */
export const Nested: Story = {
  name: 'Composition/Nested',
  args: {
    summary: 'Parent Accordion',
    details: (
      <div style={{ padding: '1rem' }}>
        <p>This is the parent&apos;s content.</p>
        <Accordion
          summary="Nested Accordion"
          details={sampleDetails}
          styles={{ theme: 'light' }}
        />
      </div>
    ),
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// CONTROLLED STORY
// --------------------------------------------------------------------------

const ControlledAccordionExample = () => {
  const [expanded, setExpanded] = React.useState<boolean | undefined>(undefined)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button
        onClick={() => setExpanded(prev => !prev)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Toggle Externally (Current: {expanded ? 'Expanded' : 'Collapsed'})
      </button>
      <Accordion
        summary="Controlled Accordion"
        details={sampleDetails}
        expanded={expanded}
        onChange={(_, newExpanded) => setExpanded(newExpanded)}
        styles={{ theme: 'light' }}
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
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  name: 'Comprehensive Showcase',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Basic Light"
            details={sampleDetails}
            styles={{ theme: 'light' }}
          />
          <Accordion
            summary="Light Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'light' }}
          />
          <Accordion
            summary="Light Disabled"
            details={sampleDetails}
            styles={{ theme: 'light', disabled: true }}
          />
        </div>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Basic Dark"
            details={sampleDetails}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Dark Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Dark Disabled"
            details={sampleDetails}
            styles={{ theme: 'dark', disabled: true }}
          />
        </div>
      </div>

      {/* Sacred Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Sacred Basic"
            details={sampleDetails}
            styles={{ theme: 'sacred' }}
          />
          <Accordion
            summary="Sacred Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'sacred' }}
          />
          <Accordion
            summary="Sacred Disabled"
            details={sampleDetails}
            styles={{ theme: 'sacred', disabled: true }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Custom Colors"
            details={sampleDetails}
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderColor: 'rgba(147, 51, 234, 0.3)',
              summaryBackgroundColor: 'rgba(147, 51, 234, 0.2)',
              summaryColor: 'rgba(147, 51, 234, 1)',
            }}
          />
          <Accordion
            summary="Rounded Style"
            details={sampleDetails}
            styles={{
              theme: 'light',
              borderRadius: '16px',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
            }}
          />
          <Accordion
            summary="Minimal Style"
            details={sampleDetails}
            styles={{
              theme: 'light',
              outline: false,
              borderRadius: '0px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  name: 'Interaction Test',
  args: {
    summary: 'Test Accordion',
    details: sampleDetails,
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const summary = canvas.getByText('Test Accordion')

    // Check it's initially collapsed
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

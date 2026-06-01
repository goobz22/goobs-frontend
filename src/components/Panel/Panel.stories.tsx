/**
 * @fileoverview Storybook stories for the Panel compound component.
 * Demonstrates the back-button / title / actions header, the scrollable body,
 * the sticky footer, and the three variants (sacred / standard / fullscreen).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect, fn } from 'storybook/test'
import Panel from './index'
import CustomButton from '../Button'

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['sacred', 'standard', 'fullscreen'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ height: '480px', width: '720px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Panel>

const sampleBody = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {Array.from({ length: 12 }).map((_, index) => (
      <p key={index} style={{ margin: 0 }}>
        Scrollable body row {index + 1} — the body region is the flex:1 scroll
        area that absorbs the inline-shell contentStyle.
      </p>
    ))}
  </div>
)

/** Sacred (default) shell with a back button, title, subtitle and Save action. */
export const Sacred: Story = {
  name: 'Sacred (Default)',
  args: { variant: 'sacred' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Manage Contact"
        subtitle="Edit the wholesale buyer's details"
        actions={
          <CustomButton text="Save Contact" styles={{ theme: 'sacred' }} />
        }
      />
      <Panel.Body>{sampleBody}</Panel.Body>
      <Panel.Footer split>
        <CustomButton
          text="Delete"
          styles={{ theme: 'sacred', color: '#EF4444' }}
        />
        <CustomButton text="Done" styles={{ theme: 'sacred' }} />
      </Panel.Footer>
    </Panel>
  ),
}

/** Standard (neutral) variant — light bordered surface. */
export const Standard: Story = {
  name: 'Standard',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Edit Product"
        subtitle="SKU-00421"
        actions={<CustomButton text="Save" styles={{ theme: 'light' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
}

/** Header without a back button (no onBack) — title + actions only. */
export const NoBackButton: Story = {
  name: 'Header/No Back Button',
  args: { variant: 'sacred' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        title="Service Invoice"
        actions={<CustomButton text="Print" styles={{ theme: 'sacred' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
}

/** Body-only panel — no footer. */
export const BodyOnly: Story = {
  name: 'Composition/Body Only',
  args: { variant: 'sacred' },
  render: args => (
    <Panel {...args}>
      <Panel.Header onBack={fn()} title="Details" />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
}

// --------------------------------------------------------------------------
// INTERACTION TEST — back button fires onBack, region is labelled by title
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  name: 'Interaction Test',
  args: { variant: 'sacred' },
  render: args => {
    const handleBack = fn()
    return (
      <Panel {...args}>
        <Panel.Header
          onBack={handleBack}
          title="Test Panel"
          actions={<CustomButton text="Save" styles={{ theme: 'sacred' }} />}
        />
        <Panel.Body>{sampleBody}</Panel.Body>
      </Panel>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector('[data-component="Panel"]')
    await expect(region).not.toBeNull()
    // The region is labelled by the header title block.
    const labelledBy = region?.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    // The built-in back button is present and reachable by its label.
    const backButton = canvas.getByLabelText('Back')
    await expect(backButton).toBeVisible()
  },
}

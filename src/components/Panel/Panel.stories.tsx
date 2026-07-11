/**
 * @fileoverview Storybook stories for the Panel compound component.
 * Demonstrates the back-button / title / actions header, the scrollable body,
 * the sticky footer, and the three variants (sacred / standard / fullscreen).
 * These stories are the Panel regression spec — goobs has no unit tests.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
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

/**
 * Fullscreen takeover variant — the panel escapes the story's 480×720
 * decorator box and pins to the whole viewport (`position: fixed; inset: 0`),
 * keeping the sacred header/body/footer chrome edge-to-edge. The play
 * function pins the computed `position: fixed` + `data-panel-variant`
 * attribute so a CSS regression that un-pins the takeover fails here.
 */
export const Fullscreen: Story = {
  args: { variant: 'fullscreen' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Fullscreen Takeover"
        subtitle="Pinned to the viewport with fixed inset:0"
        actions={<CustomButton text="Save" styles={{ theme: 'sacred' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
      <Panel.Footer>
        <CustomButton text="Close" styles={{ theme: 'sacred' }} />
      </Panel.Footer>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>(
      '[data-component="Panel"]'
    )
    await expect(region).not.toBeNull()
    await expect(region).toHaveAttribute('data-panel-variant', 'fullscreen')
    // The fullscreen class pins the panel to the viewport, escaping the
    // decorator's 480x720 box.
    const computed = window.getComputedStyle(region as HTMLElement)
    await expect(computed.position).toBe('fixed')
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST — back button fires onBack, region is labelled by title
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
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
    // The region is labelled by the header title.
    const labelledBy = region?.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    // aria-labelledby must resolve to a REAL heading element (WCAG 1.3.1):
    // the title is an <h1>-<h6>, not a styled div/span, and it carries the id.
    const labelTarget = canvasElement.querySelector(`#${labelledBy}`)
    await expect(labelTarget).not.toBeNull()
    await expect((labelTarget as HTMLElement).tagName).toMatch(/^H[1-6]$/)
    // Default heading level is 2.
    await expect((labelTarget as HTMLElement).tagName).toBe('H2')
    // The scroll body is keyboard-reachable (WCAG 2.1.1): tabIndex=0.
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await expect(body).toHaveAttribute('tabindex', '0')
    // The built-in back button is present and reachable by its label.
    const backButton = canvas.getByLabelText('Back')
    await expect(backButton).toBeVisible()
    // The decorative back-arrow glyph is hidden from AT (button label names it).
    const backIcon = backButton.querySelector('svg')
    await expect(backIcon).toHaveAttribute('aria-hidden', 'true')
  },
}

/**
 * Heading level is consumer-controllable via `headingLevel` — the title
 * renders as a real `<h3>` here (default is `<h2>`). The play function pins
 * the rendered heading tag and its aria-labelledby linkage so a regression
 * that reverts the title to a non-semantic span fails.
 */
export const HeadingLevel: Story = {
  name: 'A11y/Heading Level',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        headingLevel={3}
        title="Section Heading"
        subtitle="Rendered as a real <h3>"
        actions={<CustomButton text="Save" styles={{ theme: 'light' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-component="Panel"]')
    const labelledBy = region?.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    const heading = canvasElement.querySelector(`#${labelledBy}`)
    await expect(heading).not.toBeNull()
    await expect((heading as HTMLElement).tagName).toBe('H3')
    await expect(heading).toHaveTextContent('Section Heading')
  },
}

/**
 * Header-less composition (Body only). The root must NOT emit a dangling
 * `aria-labelledby` when no `Panel.Header` supplies the title id — the play
 * function pins that the attribute is absent so the region is never left
 * pointing at a non-existent element (WCAG 1.3.1 / 4.1.2).
 */
export const HeaderlessRegion: Story = {
  name: 'A11y/Header-less (no dangling label)',
  args: { variant: 'sacred' },
  render: args => (
    <Panel {...args}>
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-component="Panel"]')
    await expect(region).not.toBeNull()
    // No header → no aria-labelledby (rather than a broken IDREF).
    await expect(region).not.toHaveAttribute('aria-labelledby')
    // The body is still keyboard-scrollable on its own.
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await expect(body).toHaveAttribute('tabindex', '0')
  },
}

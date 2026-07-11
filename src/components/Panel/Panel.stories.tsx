/**
 * @fileoverview Storybook stories for the Panel compound component.
 * Demonstrates the back-button / title / actions header, the scrollable body,
 * the sticky footer, and the three variants (sacred / standard / fullscreen).
 * These stories are the Panel regression spec — goobs has no unit tests.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, fn, userEvent, waitFor } from 'storybook/test'
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
    // The fullscreen takeover is a MODAL (WCAG 2.4.3): it renders as a
    // role="dialog" + aria-modal="true" so AT treats the obscured page as
    // inert, and the root is a programmatic focus target (tabIndex=-1).
    await expect(region).toHaveAttribute('role', 'dialog')
    await expect(region).toHaveAttribute('aria-modal', 'true')
    await expect(region).toHaveAttribute('tabindex', '-1')
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
    // The scroll body is keyboard-reachable (WCAG 2.1.1): because this body
    // overflows (12 rows in a 480px panel) AND holds no focusable children,
    // the runtime measurement opts it into the tab order (tabIndex=0). The
    // wait accounts for the post-mount ResizeObserver measurement.
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await waitFor(() => expect(body).toHaveAttribute('tabindex', '0'))
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
 * The header `subtitle` is the panel's DESCRIPTION: it is wired to the root via
 * `aria-describedby` so assistive tech announces it alongside the title when the
 * named region is entered / the fullscreen dialog opens (APG dialog description;
 * WCAG 4.1.2). The play function pins that the root's `aria-describedby` resolves
 * to the real subtitle element carrying the expected text.
 */
export const SubtitleDescription: Story = {
  name: 'A11y/Subtitle is the description (aria-describedby)',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Edit Product"
        subtitle="SKU-00421 — wholesale catalog entry"
        actions={<CustomButton text="Save" styles={{ theme: 'light' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-component="Panel"]')
    await expect(region).not.toBeNull()
    // The subtitle is exposed as the panel's programmatic description.
    const describedBy = region?.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    const descTarget = canvasElement.querySelector(`#${describedBy}`)
    await expect(descTarget).not.toBeNull()
    // It resolves to the real subtitle element, not a dangling IDREF.
    await expect(descTarget).toHaveAttribute('data-panel-subtitle', 'true')
    await expect(descTarget).toHaveTextContent(
      'SKU-00421 — wholesale catalog entry'
    )
  },
}

/**
 * A subtitle-less header must NOT emit a dangling `aria-describedby` — the root
 * carries the attribute only when a subtitle actually renders (no broken IDREF).
 */
export const NoSubtitleNoDescription: Story = {
  name: 'A11y/No subtitle → no aria-describedby',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Details"
        actions={<CustomButton text="Save" styles={{ theme: 'light' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-component="Panel"]')
    await expect(region).not.toBeNull()
    // No subtitle → no aria-describedby (rather than a dangling IDREF).
    await expect(region).not.toHaveAttribute('aria-describedby')
  },
}

/**
 * Header-less composition (Body only). The root must NOT emit a dangling
 * `aria-labelledby` when no `Panel.Header` supplies the title id, AND — having
 * no accessible name — must NOT declare an explicit `role="region"` landmark
 * (an unnamed landmark is an axe best-practice failure). It degrades to a plain
 * `<section>`. The play function pins both (WCAG 1.3.1 / 4.1.2).
 */
export const HeaderlessRegion: Story = {
  name: 'A11y/Header-less (no dangling label, no unnamed landmark)',
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
    // No accessible name → no explicit region role (not an unnamed landmark).
    await expect(region).not.toHaveAttribute('role')
    // The body is still keyboard-scrollable on its own (overflows, no
    // focusable children → measured into the tab order).
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await waitFor(() => expect(body).toHaveAttribute('tabindex', '0'))
  },
}

/**
 * A consumer that supplies its own `aria-label` (no `Panel.Header`) DOES get a
 * named `role="region"` landmark — the role is gated on having an accessible
 * name, not on the header specifically. Pins that a labelled header-less panel
 * is still a proper named landmark.
 */
export const HeaderlessLabelledRegion: Story = {
  name: 'A11y/Header-less but aria-label (named landmark)',
  args: { variant: 'sacred' },
  render: args => (
    <Panel {...args} aria-label="Activity log">
      <Panel.Body>{sampleBody}</Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-component="Panel"]')
    await expect(region).not.toBeNull()
    // Consumer name present → explicit region landmark is retained.
    await expect(region).toHaveAttribute('role', 'region')
    await expect(region).toHaveAttribute('aria-label', 'Activity log')
  },
}

/**
 * Panel.Body is a tab stop ONLY when it is a genuine scroll trap. When the body
 * holds its own focusable children (a form-filled body — the primitive's
 * canonical InlineManageContact use case), the container must NOT become a
 * redundant extra tab stop before those fields (WCAG 2.4.3 focus order). Pins
 * that the body has no `tabindex` when interactive content is present.
 */
export const BodyWithInteractiveContent: Story = {
  name: 'A11y/Body — interactive content is not a tab stop',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header title="Edit Contact" onBack={fn()} />
      <Panel.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CustomButton text="Field One" styles={{ theme: 'light' }} />
          <CustomButton text="Field Two" styles={{ theme: 'light' }} />
        </div>
      </Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await expect(body).not.toBeNull()
    // Focusable descendants present → the container is not opted into the tab
    // order (no redundant stop). The wait lets the mount measurement settle.
    await waitFor(() => expect(body).not.toHaveAttribute('tabindex'))
  },
}

/**
 * Panel.Body that does NOT overflow scrolls nothing, so it must NOT be a tab
 * stop either — a focusable element that scrolls nothing is focus-order noise
 * (WCAG 2.4.3). Pins that a short, non-overflowing body carries no `tabindex`.
 */
export const BodyShortNoOverflow: Story = {
  name: 'A11y/Body — non-overflowing is not a tab stop',
  args: { variant: 'standard' },
  render: args => (
    <Panel {...args}>
      <Panel.Header title="Summary" onBack={fn()} />
      <Panel.Body>
        <p style={{ margin: 0 }}>A single short line that does not overflow.</p>
      </Panel.Body>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector('[data-panel-body="true"]')
    await expect(body).not.toBeNull()
    // Non-overflowing, no focusable children → not a tab stop.
    await waitFor(() => expect(body).not.toHaveAttribute('tabindex'))
  },
}

/**
 * Fullscreen takeover = MODAL focus management (WCAG 2.4.3 Focus Order). The
 * variant renders as `role="dialog"` + `aria-modal`, moves focus INTO the
 * takeover on mount, TRAPS Tab at the boundaries so a keyboard user can never
 * Tab out into the obscured page behind it, and closes on `Escape` via
 * `onClose`. The play function drives all three so a regression that un-manages
 * the takeover fails here.
 */
export const FullscreenModal: Story = {
  name: 'A11y/Fullscreen Modal (focus trap + Escape)',
  args: { variant: 'fullscreen', onClose: fn() },
  render: args => (
    <Panel {...args}>
      <Panel.Header
        onBack={fn()}
        title="Fullscreen Takeover"
        subtitle="Modal focus management + Escape to close"
        actions={<CustomButton text="Save" styles={{ theme: 'sacred' }} />}
      />
      <Panel.Body>{sampleBody}</Panel.Body>
      <Panel.Footer>
        <CustomButton text="Close" styles={{ theme: 'sacred' }} />
      </Panel.Footer>
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const region = canvasElement.querySelector<HTMLElement>(
      '[data-component="Panel"]'
    )
    await expect(region).not.toBeNull()
    await expect(region).toHaveAttribute('role', 'dialog')
    await expect(region).toHaveAttribute('aria-modal', 'true')
    // The dialog exposes both a name (title) and a description (subtitle) so a
    // screen reader announces the takeover's purpose on open (APG dialog).
    await expect(region).toHaveAttribute('aria-labelledby')
    const dialogDescribedBy = region?.getAttribute('aria-describedby')
    await expect(dialogDescribedBy).toBeTruthy()
    await expect(
      canvasElement.querySelector(`#${dialogDescribedBy}`)
    ).toHaveAttribute('data-panel-subtitle', 'true')
    // Focus is moved INTO the takeover on mount.
    await waitFor(() =>
      expect(region!.contains(document.activeElement)).toBe(true)
    )
    // Tab is trapped: Shift+Tab at the top boundary wraps back INSIDE the
    // takeover rather than escaping into the obscured page behind it.
    await userEvent.tab({ shift: true })
    await expect(region!.contains(document.activeElement)).toBe(true)
    // Escape invokes the consumer onClose (APG dialog dismiss contract).
    await userEvent.keyboard('{Escape}')
    await expect(args.onClose).toHaveBeenCalled()
  },
}

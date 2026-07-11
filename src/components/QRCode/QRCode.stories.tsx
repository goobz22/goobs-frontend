/**
 * @fileoverview Storybook stories for the QRCode component.
 * QRCode renders a scannable QR code from a `value` string onto a canvas, with
 * optional title, verify button, confirmation-code input, and a success state.
 * These stories showcase the light / dark / sacred themes and the key states.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import QRCode from './index'

// argTypes below reference the additive `headingLevel` prop; keep it exercised
// by the SemanticHeadingLevel + SuccessAnnouncement stories.

const meta: Meta<typeof QRCode> = {
  title: 'Components/QRCode',
  component: QRCode,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    size: { control: 'number' },
    level: { control: { type: 'select' }, options: ['L', 'M', 'Q', 'H'] },
    title: { control: 'text' },
    headingLevel: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
    },
    bgColor: { control: 'color' },
    fgColor: { control: 'color' },
    styles: { control: 'object' },
  },
  decorators: [
    Story => (
      <div style={{ width: '320px', padding: '1rem', textAlign: 'center' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleValue =
  'otpauth://totp/ThothOS:matthew@example.com?secret=JBSWY3DPEHPK3PXP&issuer=ThothOS'

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const Default: Story = {
  args: {
    value: sampleValue,
    size: 220,
    title: 'Scan to set up MFA',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  args: {
    value: sampleValue,
    size: 220,
    title: 'Scan to set up MFA',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  args: {
    value: sampleValue,
    size: 220,
    title: 'Scan the sacred sigil',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// VALUE / CONTENT VARIATIONS
// --------------------------------------------------------------------------

export const PlainUrl: Story = {
  name: 'Plain URL Value',
  args: {
    value: 'https://thothos.com',
    size: 220,
    title: 'thothos.com',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const HighErrorCorrection: Story = {
  args: {
    value: sampleValue,
    size: 220,
    level: 'H',
    title: 'High redundancy (level H)',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// STYLE OVERRIDES — QR container frame knobs
// --------------------------------------------------------------------------

/**
 * Exercises the implemented QRCodeStyles frame knobs on the QR container:
 * `backgroundColor` ('#FFF8E7' cream, feeds --qr-bg-color), `borderColor` +
 * `borderWidth` (3px solid '#B45309' amber, feeds --qr-border), `borderRadius`
 * ('4px' near-square corners), `padding` ('8px' tight frame), and
 * `styles.size` (240 — overrides the top-level `size={200}`, so --qr-size
 * pins the framed box at 240px).
 */
export const CustomFrame: Story = {
  name: 'Custom Frame Overrides',
  args: {
    value: sampleValue,
    size: 200,
    title: 'Custom framed QR',
    styles: {
      theme: 'light',
      backgroundColor: '#FFF8E7',
      borderColor: '#B45309',
      borderWidth: '3px',
      borderRadius: '4px',
      padding: '8px',
      size: 240,
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pins the width-only border branch: `borderWidth: '6px'` with no
 * borderColor/qrBorderColor emits --qr-border-width, thickening the sacred
 * theme's default gold border to 6px while keeping its color and glow.
 */
export const ThickSacredBorder: Story = {
  name: 'Width-Only Border (Sacred)',
  args: {
    value: sampleValue,
    size: 220,
    title: 'Thick sacred border',
    styles: {
      theme: 'sacred',
      borderWidth: '6px',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// MISSING VALUE — ERROR FALLBACK
// --------------------------------------------------------------------------

export const NoValue: Story = {
  name: 'No Value (Error State)',
  args: {
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// SUCCESS STATE
// --------------------------------------------------------------------------

export const SuccessState: Story = {
  name: 'Verification Success',
  args: {
    value: sampleValue,
    showSuccessState: true,
    successMessage: 'Verification Successful',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const SuccessStateSacred: Story = {
  name: 'Verification Success (Sacred)',
  args: {
    value: sampleValue,
    showSuccessState: true,
    successMessage: 'The rite is complete',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// WITH CONFIRMATION INPUT + VERIFY BUTTON (stateful)
// --------------------------------------------------------------------------

export const WithConfirmationInput: Story = {
  render: function WithConfirmationStory() {
    const [code, setCode] = useState('')

    return (
      <QRCode
        value={sampleValue}
        size={220}
        title="Enter the 6-digit code"
        showConfirmationInput
        confirmationCode={code}
        onConfirmationCodeChange={setCode}
        showVerifyButton
        onVerify={() => console.log('verify', code)}
        styles={{ theme: 'light' }}
      />
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY — semantic heading level + announced success transition
// --------------------------------------------------------------------------

/**
 * Exercises the additive `headingLevel` prop (WCAG 1.3.1 / 2.4.6): the `title`
 * renders as a real `<h2>` instead of the fixed default `<h5>`, so the panel
 * slots into a surrounding document outline without skipping levels. Inspect
 * the DOM — the heading text is an `<h2>`, and the canvas exposes
 * `role="img"` + an `aria-label` naming the code.
 */
export const SemanticHeadingLevel: Story = {
  name: 'Semantic Heading Level (h2)',
  args: {
    value: sampleValue,
    size: 220,
    title: 'Scan to set up MFA',
    headingLevel: 2,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Exercises the success-state announcement (WCAG 4.1.3): toggling
 * `showSuccessState` swaps the QR panel for the success pane with NO focus
 * move, so a persistent, always-mounted `role="status"` live region announces
 * the success message. The check icon and (sacred) glyph are decorative and
 * `aria-hidden`, so assistive tech reads only the heading + the announcement.
 * Toggle the button with a screen reader running to hear "Verification
 * Successful" announced without the focus leaving the toggle button.
 */
export const SuccessAnnouncement: Story = {
  name: 'Announced Success Transition',
  render: function SuccessAnnouncementStory() {
    const [verified, setVerified] = useState(false)

    return (
      <div>
        <button
          type="button"
          onClick={() => setVerified(v => !v)}
          style={{ marginBottom: '1rem' }}
        >
          {verified ? 'Reset' : 'Mark verified'}
        </button>
        <QRCode
          value={sampleValue}
          size={220}
          title="Scan to set up MFA"
          headingLevel={2}
          showSuccessState={verified}
          successMessage="Verification Successful"
          onDisableVerification={() => setVerified(false)}
          styles={{ theme: 'light' }}
        />
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Sacred success pane: verifies the decorative Egyptian glyph (𓊹) carries
 * `aria-hidden` so a screen reader does not read it as a stray character
 * (WCAG 1.1.1), while the persistent live region still announces the message.
 */
export const SacredSuccessAnnouncement: Story = {
  name: 'Announced Success Transition (Sacred)',
  render: function SacredSuccessAnnouncementStory() {
    const [verified, setVerified] = useState(false)

    return (
      <div>
        <button
          type="button"
          onClick={() => setVerified(v => !v)}
          style={{ marginBottom: '1rem' }}
        >
          {verified ? 'Reset' : 'Complete the rite'}
        </button>
        <QRCode
          value={sampleValue}
          size={220}
          title="Scan the sacred sigil"
          headingLevel={2}
          showSuccessState={verified}
          successMessage="The rite is complete"
          onDisableVerification={() => setVerified(false)}
          styles={{ theme: 'sacred' }}
        />
      </div>
    )
  },
  globals: { backgrounds: { value: 'dark' } },
}

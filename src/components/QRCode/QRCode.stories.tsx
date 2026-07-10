/**
 * @fileoverview Storybook stories for the QRCode component.
 * QRCode renders a scannable QR code from a `value` string onto a canvas, with
 * optional title, verify button, confirmation-code input, and a success state.
 * These stories showcase the light / dark / sacred themes and the key states.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import QRCode from './index'

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

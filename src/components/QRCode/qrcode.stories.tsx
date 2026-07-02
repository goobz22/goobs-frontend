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
}

export const HighErrorCorrection: Story = {
  args: {
    value: sampleValue,
    size: 220,
    level: 'H',
    title: 'High redundancy (level H)',
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// MISSING VALUE — ERROR FALLBACK
// --------------------------------------------------------------------------

export const NoValue: Story = {
  name: 'No Value (Error State)',
  args: {
    styles: { theme: 'light' },
  },
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
}

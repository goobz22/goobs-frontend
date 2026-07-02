/**
 * @fileoverview Storybook stories for MoneyText — the read-only currency
 * formatter sibling of USDField. No FieldShell, no input; just a formatted
 * <span>. Shares the parsing core (formatMoney) with the editable field.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import MoneyText from './MoneyText'

const meta: Meta<typeof MoneyText> = {
  title: 'Components/Field/USD/MoneyText',
  component: MoneyText,
  argTypes: {
    value: { control: 'text' },
    currency: { control: 'text' },
    mono: { control: 'boolean' },
    tone: {
      control: { type: 'select' },
      options: [undefined, 'total', 'due'],
    },
    emptyText: { control: 'text' },
  },
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof MoneyText>

/** Plain positive amount → "$1,234.50". */
export const Positive: Story = {
  args: { value: 1234.5 },
}

/** Negative amount → "-$42.00" (sign before the symbol). */
export const Negative: Story = {
  args: { value: -42 },
}

/** A numeric STRING parses the same way → "$1,200.50". */
export const FromString: Story = {
  name: 'From string',
  args: { value: '1200.5' },
}

/** Total tone — bolder, gold. */
export const TotalTone: Story = {
  name: 'Tone: total',
  args: { value: 9875.21, tone: 'total', mono: true },
}

/** Due tone — warning palette. */
export const DueTone: Story = {
  name: 'Tone: due',
  args: { value: 320, tone: 'due' },
}

/** Non-USD currency. */
export const Euro: Story = {
  args: { value: 120, currency: 'EUR' },
}

/** Unparseable value renders the placeholder dash. */
export const Empty: Story = {
  args: { value: '', emptyText: '—' },
}

/** A monospace column of figures aligning on the decimal point. */
export const MonoColumn: Story = {
  name: 'Mono column (alignment)',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
      }}
    >
      <MoneyText value={1234.5} mono />
      <MoneyText value={42} mono />
      <MoneyText value={9875.21} mono />
      <MoneyText value={-150} mono />
      <MoneyText value={108234.07} mono tone="total" />
    </div>
  ),
}

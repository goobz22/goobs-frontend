// src/components/Searchbar/searchbar.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import Searchbar from './index'

/**
 * Setup Storybook metadata
 */
const meta: Meta<typeof Searchbar> = {
  title: 'Components/Field/Search',
  component: Searchbar,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof Searchbar>

/**
 * 1) Basic usage (no label, no special colors)
 */
export const Basic: Story = {
  args: {
    placeholder: 'Search...',
    value: '',
    onChange: e => {
      console.log('Basic search input =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The input might have "Search..." as the placeholder
    const inputEl = canvas.getByPlaceholderText('Search...') // returns HTMLElement

    // Initially empty
    expect((inputEl as HTMLInputElement).value).toBe('')

    // Type something
    await userEvent.type(inputEl, 'Hello')
    expect((inputEl as HTMLInputElement).value).toBe('Hello')
  },
}

/**
 * 2) With Label
 */
export const WithLabel: Story = {
  args: {
    label: 'Search Label',
    placeholder: 'Search items',
    value: '',
    onChange: e => {
      console.log('WithLabel input =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The label is visible
    expect(canvas.getByText('Search Label')).toBeInTheDocument()

    // Type some text
    const inputEl = canvas.getByLabelText('Search Label') // returns HTMLElement
    await userEvent.type(inputEl, 'Apple')
    expect((inputEl as HTMLInputElement).value).toBe('Apple')
  },
}

/**
 * 3) Custom Colors
 */
export const CustomColors: Story = {
  args: {
    label: 'Colored Search',
    placeholder: 'Look here...',
    value: '',
    backgroundcolor: '#e3f2fd', // Light blue
    iconcolor: '#0d47a1', // Darker blue
    outlinecolor: '#64b5f6', // Another shade of blue
    fontcolor: '#1a237e', // Deep purple for text
    onChange: e => {
      console.log('CustomColors input =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inputEl = canvas.getByLabelText('Colored Search')
    // Type "Colored"
    await userEvent.type(inputEl, 'Colored')
    expect((inputEl as HTMLInputElement).value).toBe('Colored')
  },
}

/**
 * 4) Outline None
 */
export const NoOutline: Story = {
  args: {
    label: 'No Border',
    placeholder: 'Try typing...',
    value: '',
    outlinecolor: 'none',
    onChange: e => {
      console.log('NoOutline input =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inputEl = canvas.getByLabelText('No Border')

    // Type "Borderless"
    await userEvent.type(inputEl, 'Borderless')
    expect((inputEl as HTMLInputElement).value).toBe('Borderless')
  },
}

/**
 * 5) Pre-filled Value
 */
export const Prefilled: Story = {
  args: {
    label: 'Prefilled Search',
    placeholder: 'Modify me...',
    value: 'Initial text',
    onChange: e => {
      console.log('Prefilled input =>', e.target.value)
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm initial value
    const inputEl = canvas.getByLabelText('Prefilled Search')
    expect((inputEl as HTMLInputElement).value).toBe('Initial text')

    // Clear it and type new text
    await userEvent.clear(inputEl)
    await userEvent.type(inputEl, 'New content')
    expect((inputEl as HTMLInputElement).value).toBe('New content')
  },
}

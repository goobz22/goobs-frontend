// src/components/Toolbar/toolbar.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import CustomToolbar from './index'

import type { SearchbarProps } from '../Field/Search'
import type { DropdownProps } from '../Field/Dropdown/Regular'
import type { CustomButtonProps } from '../Button'

/**
 * Sample button data
 */
const sampleButtons: CustomButtonProps[] = [
  { text: 'Button 1', onClick: () => console.log('Button 1 clicked') },
  { text: 'Button 2', onClick: () => console.log('Button 2 clicked') },
]

/**
 * Sample search props
 */
const sampleSearchProps: SearchbarProps = {
  label: 'Search Something',
  placeholder: 'Type here...',
  value: '',
  onChange: e => console.log('Searching =>', e.target.value),
}

/**
 * Single sample dropdown
 */
const sampleDropdown: DropdownProps = {
  label: 'Pick an Option',
  options: [
    { value: 'Alpha', attribute1: 'Alpha' },
    { value: 'Beta', attribute1: 'Beta' },
    { value: 'Gamma', attribute1: 'Gamma' },
  ],
  onChange: e => console.log('Single dropdown =>', e.target.value),
}

const meta: Meta<typeof CustomToolbar> = {
  title: 'Components/Toolbar',
  component: CustomToolbar,
  parameters: {
    a11y: { disable: false },
  },
}
export default meta

type Story = StoryObj<typeof CustomToolbar>

/**
 * 1) Basic story
 */
export const Basic: Story = {
  args: {
    buttons: sampleButtons,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Button 1')).toBeInTheDocument()
    expect(canvas.getByText('Button 2')).toBeInTheDocument()
    await userEvent.click(canvas.getByText('Button 1'))
  },
}

/**
 * 2) With Search
 */
export const WithSearch: Story = {
  args: {
    buttons: [{ text: 'New Button' }],
    searchbarProps: sampleSearchProps,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('New Button')).toBeInTheDocument()
    const input = canvas.getByLabelText('Search Something', {
      selector: 'input',
    })
    await userEvent.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  },
}

/**
 * 3) With single Dropdown
 */
export const WithDropdown: Story = {
  args: {
    buttons: [{ text: 'Only Button' }],
    dropdowns: [sampleDropdown],
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Only Button')).toBeInTheDocument()
    expect(canvas.getByText('Pick an Option')).toBeInTheDocument()
  },
}

/**
 * 4) Full Setup
 */
export const FullSetup: Story = {
  args: {
    buttons: sampleButtons,
    searchbarProps: sampleSearchProps,
    rightCenterProps: {
      selectedRows: [],
      rows: [],
      onDuplicate: () => console.log('duplicate'),
      onDelete: () => console.log('delete'),
      onManage: () => console.log('manage'),
      onShow: () => console.log('show'),
      handleClose: () => console.log('close'),
    },
    dropdowns: [sampleDropdown],
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Button 1')).toBeInTheDocument()
    expect(canvas.getByText('Button 2')).toBeInTheDocument()
    expect(canvas.getByLabelText('Search Something')).toBeInTheDocument()
    expect(canvas.getByText('Pick an Option')).toBeInTheDocument()
  },
}

// src/components/Toolbar/toolbar.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import CustomToolbar from './index'

import type { SearchbarProps } from '../Field/Search'
import type { DropdownProps } from '../Field/Dropdown/Regular'
import type { ButtonProps } from '../Button'

const sampleButtons: ButtonProps[] = [
  { text: 'Button 1', onClick: () => console.log('Button 1 clicked') },
  { text: 'Button 2', onClick: () => console.log('Button 2 clicked') },
]

const sampleSearchProps: SearchbarProps = {
  label: 'Search Something',
  placeholder: 'Type here...',
  value: '',
  onChange: e => console.log('Searching =>', e.target.value),
}

const sampleDropdown: DropdownProps = {
  label: 'Pick an Option',
  options: [{ value: 'Alpha' }, { value: 'Beta' }, { value: 'Gamma' }],
  onChange: e => console.log('Single dropdown =>', e.target.value),
}

const meta: Meta<typeof CustomToolbar> = {
  title: 'Components/Toolbar',
  component: CustomToolbar,
  argTypes: {
    styles: {
      control: 'object',
      description: 'Toolbar styling configuration',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof CustomToolbar>

/**
 * 1) Light Theme
 */
export const LightTheme: Story = {
  name: 'Light Theme',
  render: args => (
    <div className="p-4 bg-gray-100">
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    buttons: sampleButtons,
    searchbarProps: sampleSearchProps,
    rightCenterProps: {
      selectedRows: ['1'],
      rows: [{ id: '1' }],
      onDuplicate: () => console.log('duplicate'),
      onDelete: () => console.log('delete'),
    },
    dropdowns: [sampleDropdown],
    styles: { theme: 'light' },
  },
}

/**
 * 2) Dark Theme
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: args => (
    <div className="p-4 bg-gray-900">
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    ...LightTheme.args,
    styles: { theme: 'dark' },
  },
}

/**
 * 3) Sacred Theme
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="p-4 bg-black">
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    ...LightTheme.args,
    styles: { theme: 'sacred' },
  },
}

const InteractiveDemoRenderer = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [showButtons, setShowButtons] = React.useState(true)
  const [showSearch, setShowSearch] = React.useState(true)
  const [showRightCenter, setShowRightCenter] = React.useState(true)
  const [showDropdowns, setShowDropdowns] = React.useState(true)

  const backgroundClass =
    theme === 'sacred'
      ? 'bg-black'
      : theme === 'dark'
        ? 'bg-gray-900'
        : 'bg-gray-100'

  return (
    <div className={`p-4 ${backgroundClass}`}>
      <div className="fixed top-24 right-4 z-50 p-4 bg-white rounded-lg border shadow-lg">
        <h3 className="text-lg font-bold mb-2">Controls</h3>
        <div className="flex flex-col gap-2">
          <label>
            <span className="block text-sm font-medium mb-1">Theme:</span>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              className="w-full p-1 border rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sacred">Sacred</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showButtons}
              onChange={e => setShowButtons(e.target.checked)}
            />{' '}
            Show Buttons
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSearch}
              onChange={e => setShowSearch(e.target.checked)}
            />{' '}
            Show Search
          </label>
          <label>
            <input
              type="checkbox"
              checked={showRightCenter}
              onChange={e => setShowRightCenter(e.target.checked)}
            />{' '}
            Show Right Center
          </label>
          <label>
            <input
              type="checkbox"
              checked={showDropdowns}
              onChange={e => setShowDropdowns(e.target.checked)}
            />{' '}
            Show Dropdowns
          </label>
        </div>
      </div>
      <CustomToolbar
        buttons={showButtons ? sampleButtons : undefined}
        searchbarProps={showSearch ? sampleSearchProps : undefined}
        rightCenterProps={
          showRightCenter
            ? { selectedRows: ['1'], rows: [{ id: '1' }] }
            : undefined
        }
        dropdowns={showDropdowns ? [sampleDropdown] : undefined}
        styles={{ theme }}
      />
    </div>
  )
}

/**
 * 4) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

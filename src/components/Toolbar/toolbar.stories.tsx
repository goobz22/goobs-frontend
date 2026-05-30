// src/components/Toolbar/toolbar.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import CustomToolbar, { type CustomToolbarProps } from './index'

import type { SearchbarProps } from '../Field/Search'
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
    <div style={{ padding: '16px', background: '#f3f4f6' }}>
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    buttons: sampleButtons,
    searchbarProps: sampleSearchProps,
    styles: { theme: 'light' },
  },
}

/**
 * 2) Dark Theme
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: args => (
    <div style={{ padding: '16px', background: '#111827' }}>
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
    <div style={{ padding: '16px', background: '#000000' }}>
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

  const backgroundColor =
    theme === 'sacred' ? '#000000' : theme === 'dark' ? '#111827' : '#f3f4f6'

  return (
    <div style={{ padding: '16px', background: backgroundColor }}>
      <div
        style={{
          position: 'fixed',
          top: '96px',
          right: '16px',
          zIndex: 50,
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>
            <span
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Theme:
            </span>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
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
        </div>
      </div>
      {(() => {
        const toolbarProps: CustomToolbarProps = { styles: { theme } }
        if (showButtons) toolbarProps.buttons = sampleButtons
        if (showSearch) toolbarProps.searchbarProps = sampleSearchProps
        return <CustomToolbar {...toolbarProps} />
      })()}
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

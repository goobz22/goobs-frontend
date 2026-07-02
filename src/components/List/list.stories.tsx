/**
 * @fileoverview Storybook stories for the List component.
 * These stories showcase the different themes and density of the List,
 * composing the ListItem, ListItemIcon, and ListItemText subcomponents
 * to demonstrate real-world usage with React and JSX.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { List, ListItem, ListItemIcon, ListItemText } from './'
import HomeIcon from '../Icons/Home'
import AccountIcon from '../Icons/Account'
import SettingsIcon from '../Icons/Settings'

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

type Theme = 'light' | 'dark' | 'sacred'

interface MockListEntry {
  primary: string
  secondary: string
  icon: (theme: Theme) => React.ReactNode
}

const mockEntries: MockListEntry[] = [
  {
    primary: 'Home',
    secondary: 'Return to the dashboard',
    icon: theme => <HomeIcon styles={{ theme }} />,
  },
  {
    primary: 'Account',
    secondary: 'Manage your profile and details',
    icon: theme => <AccountIcon styles={{ theme }} />,
  },
  {
    primary: 'Settings',
    secondary: 'Configure your preferences',
    icon: theme => <SettingsIcon styles={{ theme }} />,
  },
]

/**
 * Renders the mock entries as a full List for a given theme/density,
 * keeping the styles prop shape consistent across every subcomponent.
 */
const renderList = (theme: Theme, dense = false) => (
  <List styles={{ theme, dense }}>
    {mockEntries.map(entry => (
      <ListItem key={entry.primary} styles={{ theme, dense }}>
        <ListItemIcon styles={{ theme, dense }}>
          {entry.icon(theme)}
        </ListItemIcon>
        <ListItemText
          primary={entry.primary}
          secondary={entry.secondary}
          styles={{ theme, dense }}
        />
      </ListItem>
    ))}
  </List>
)

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '320px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof List>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A list with light theme styling.
 */
export const LightTheme: Story = {
  render: () => renderList('light'),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A list with dark theme styling.
 */
export const DarkTheme: Story = {
  render: () => renderList('dark'),
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * A list with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  render: () => renderList('sacred'),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// DENSITY STORIES
// --------------------------------------------------------------------------

/**
 * A compact list using the `dense` styling option.
 */
export const Dense: Story = {
  name: 'State/Dense',
  render: () => renderList('light', true),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A list of plain text-only items, with no icons or secondary text.
 */
export const TextOnly: Story = {
  name: 'Variant/Text Only',
  render: () => (
    <List styles={{ theme: 'light' }}>
      {mockEntries.map(entry => (
        <ListItem key={entry.primary} styles={{ theme: 'light' }}>
          <ListItemText primary={entry.primary} styles={{ theme: 'light' }} />
        </ListItem>
      ))}
    </List>
  ),
  globals: { backgrounds: { value: 'light' } },
}

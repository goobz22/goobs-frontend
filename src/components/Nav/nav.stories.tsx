// src/components/Nav/nav.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Nav, { NavItem } from './index'

const sampleNavItems: NavItem[] = [
  {
    navType: 'mainNav',
    title: 'Dashboard',
    route: '/dashboard',
    trigger: 'route',
  },
  {
    navType: 'mainNav',
    title: 'Users',
    expanding: true,
    subnavs: [
      {
        navType: 'subNav',
        title: 'User List',
        route: '/users/list',
        trigger: 'route',
      },
      {
        navType: 'subNav',
        title: 'Add User',
        route: '/users/add',
        trigger: 'route',
      },
    ],
  },
]

const meta: Meta<typeof Nav> = {
  title: 'Components/Nav',
  component: Nav,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    showSearchableNav: { control: 'boolean' },
    showTitle: { control: 'boolean' },
    showLine: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Nav>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  args: {
    items: sampleNavItems,
    verticalNavTitle: 'Admin Menu',
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    items: sampleNavItems,
    sacredTitle: 'Scroll of Thoth',
    sacredSubtitle: 'The Divine Archives',
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(true)
  const [showTitle, setShowTitle] = React.useState(true)
  const [showLine, setShowLine] = React.useState(true)

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <label>
          <input
            type="checkbox"
            checked={sacred}
            onChange={e => setSacred(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Sacred Theme</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSearch}
            onChange={e => setShowSearch(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Show Search</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={showTitle}
            onChange={e => setShowTitle(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Show Title</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={showLine}
            onChange={e => setShowLine(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Show Line</span>
        </label>
      </div>
      <Nav
        items={sampleNavItems}
        sacredtheme={sacred}
        showSearchableNav={showSearch}
        showTitle={showTitle}
        showLine={showLine}
        verticalNavTitle="Interactive Menu"
        sacredTitle="Dynamic Scroll"
        sacredSubtitle="The Ever-changing Texts"
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

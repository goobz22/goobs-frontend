// src/components/DataGrid/datagrid.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import DataGrid from './index'
import { DatagridProps, ColumnDef, RowData } from './types'
import { ButtonProps } from '../Button'

const sampleColumns: ColumnDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', type: 'default', width: 110 },
]

const sampleRows: RowData[] = [
  { id: '1', name: 'John Doe', age: 35 },
  { id: '2', name: 'Jane Doe', age: 32 },
  { id: '3', name: 'Peter Pan', age: 100 },
]

const commonArgs: Partial<DatagridProps> = {
  columns: sampleColumns,
  rows: sampleRows,
  buttons: [{ text: 'Add New' }] as ButtonProps[],
  dropdowns: [
    { label: 'Filter', options: [{ value: 'all' }, { value: 'active' }] },
  ],
  searchbarProps: { value: '', onChange: () => {} },
}

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, custom colors, and layout properties.',
    },
    showIdColumns: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof DataGrid>

export const LightTheme: Story = {
  name: 'Light Theme',
  render: args => (
    <div
      style={{ backgroundColor: '#f3f4f6', height: '100vh', padding: '1rem' }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: args => (
    <div
      style={{ backgroundColor: '#1e293b', height: '100vh', padding: '1rem' }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div style={{ backgroundColor: 'black', height: '100vh', padding: '1rem' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

// Create a proper React component for the interactive demo
const InteractiveDemoComponent: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [showIds, setShowIds] = React.useState(true)

  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark':
        return '#1e293b'
      case 'sacred':
        return 'black'
      default:
        return '#f3f4f6'
    }
  }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: getBackgroundColor(),
        height: '100vh',
      }}
    >
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
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            <span style={{ marginRight: '0.5rem' }}>Theme:</span>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sacred">Sacred</option>
            </select>
          </label>
        </div>
        <label>
          <input
            type="checkbox"
            checked={showIds}
            onChange={e => setShowIds(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Show ID Columns</span>
        </label>
      </div>
      <DataGrid
        columns={sampleColumns}
        rows={sampleRows}
        buttons={[{ text: 'Add New' }] as ButtonProps[]}
        dropdowns={[
          { label: 'Filter', options: [{ value: 'all' }, { value: 'active' }] },
        ]}
        searchbarProps={{ value: '', onChange: () => {} }}
        styles={{
          theme: theme,
        }}
        showIdColumns={showIds}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoComponent />,
}

// Custom styling example
export const CustomStyling: Story = {
  name: 'Custom Styling',
  render: args => (
    <div
      style={{ backgroundColor: '#f3f4f6', height: '100vh', padding: '1rem' }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
    },
  },
}

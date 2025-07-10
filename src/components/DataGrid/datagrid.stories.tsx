// src/components/DataGrid/datagrid.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import DataGrid from './index'
import { DatagridProps, ColumnDef, RowData } from './types'
import { CustomButtonProps } from '../Button'

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
  buttons: [{ text: 'Add New' }] as CustomButtonProps[],
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
    sacredtheme: { control: 'boolean' },
    showIdColumns: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof DataGrid>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{ backgroundColor: '#f3f4f6', height: '100vh', padding: '1rem' }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    sacredtheme: false,
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
    sacredtheme: true,
  },
}

// Create a proper React component for the interactive demo
const InteractiveDemoComponent: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [showIds, setShowIds] = React.useState(true)

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: sacred ? 'black' : '#f3f4f6',
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
            checked={showIds}
            onChange={e => setShowIds(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Show ID Columns</span>
        </label>
      </div>
      <DataGrid
        columns={sampleColumns}
        rows={sampleRows}
        buttons={[{ text: 'Add New' }] as CustomButtonProps[]}
        dropdowns={[
          { label: 'Filter', options: [{ value: 'all' }, { value: 'active' }] },
        ]}
        searchbarProps={{ value: '', onChange: () => {} }}
        sacredtheme={sacred}
        showIdColumns={showIds}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoComponent />,
}

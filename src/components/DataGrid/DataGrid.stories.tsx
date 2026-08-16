/**
 * @fileoverview Storybook stories for the DataGrid component: the three
 * themes, filters + metrics, manage-row CRUD, inline row creation and
 * validation, responsive card views, the composite-field subsystem
 * (CompositeFieldConfig[] column type -> CompositeFieldEditModal ->
 * batched onCompositeFieldSave), and read-only permission rendering.
 * These stories are the DataGrid regression spec — goobs has no unit tests.
 */

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import DataGrid from './index'
import type {
  DatagridProps,
  ColumnDef,
  CompositeFieldConfig,
  RowData,
  DataGridFilter,
  MetricCardData,
} from './types'
import type { DropdownOption } from '../Field/Dropdown/Regular'
import type { ButtonProps } from '../Button'
import cssStyles from './DataGrid.module.css'

const sampleColumns: ColumnDef[] = [
  { field: 'id', headerName: 'ID', width: 90, resizable: true },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    resizable: true,
    creationField: {
      type: 'text',
      required: true,
      placeholder: 'Enter full name',
    },
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'default',
    width: 110,
    resizable: true,
    creationField: {
      type: 'internalIncrement',
      required: true,
      placeholder: 'Enter age',
      min: 18,
      max: 100,
      validation: value => {
        const num = Number(value)
        if (isNaN(num) || num < 18 || num > 100) {
          return 'Age must be between 18 and 100'
        }
        return undefined
      },
    },
  },
  {
    field: 'email',
    headerName: 'Email Address',
    width: 200,
    resizable: true,
    creationField: {
      type: 'text',
      required: true,
      placeholder: 'Enter email address',
      validation: value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(String(value))) {
          return 'Please enter a valid email address'
        }
        return undefined
      },
    },
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 140,
    resizable: true,
    type: 'dropdown',
    dropdownOptions: [
      { value: 'Engineering' },
      { value: 'Marketing' },
      { value: 'HR' },
      { value: 'Sales' },
      { value: 'Finance' },
      { value: 'Operations' },
      { value: 'Customer Service' },
      { value: 'Product' },
      { value: 'Legal' },
      { value: 'Design' },
      { value: 'Data Science' },
      { value: 'Security' },
      { value: 'Administration' },
      { value: 'Business Development' },
      { value: 'Quality Assurance' },
      { value: 'Adventure' },
      { value: 'Construction' },
    ],
    creationField: {
      type: 'searchableDropdown',
      required: true,
      placeholder: 'Select department',
      options: [
        { value: 'Engineering' },
        { value: 'Marketing' },
        { value: 'HR' },
        { value: 'Sales' },
        { value: 'Finance' },
        { value: 'Operations' },
        { value: 'Customer Service' },
        { value: 'Product' },
        { value: 'Legal' },
        { value: 'Design' },
        { value: 'Data Science' },
        { value: 'Security' },
        { value: 'Administration' },
        { value: 'Business Development' },
        { value: 'Quality Assurance' },
      ],
    },
  },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'currency',
    width: 120,
    resizable: true,
    creationField: {
      type: 'text',
      required: true,
      placeholder: 'Enter salary',
      validation: value => {
        const num = Number(value)
        if (isNaN(num) || num < 0) {
          return 'Salary must be a positive number'
        }
        return undefined
      },
    },
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
    resizable: true,
    creationField: {
      type: 'date',
      required: true,
      placeholder: 'Select start date',
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    resizable: true,
    type: 'dropdown',
    dropdownOptions: [
      { value: 'Active' },
      { value: 'On Leave' },
      { value: 'Vacation' },
      { value: 'Training' },
      { value: 'Remote' },
      { value: 'Probation' },
      { value: 'Intern' },
      { value: 'Flying' },
      { value: 'Building' },
    ],
    creationField: {
      type: 'searchableDropdown',
      required: true,
      placeholder: 'Select status',
      options: [
        { value: 'Active' },
        { value: 'On Leave' },
        { value: 'Vacation' },
        { value: 'Training' },
        { value: 'Remote' },
        { value: 'Probation' },
        { value: 'Intern' },
      ],
      defaultValue: 'Active',
    },
  },
]

const sampleRows: RowData[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 35,
    email: 'john.doe@company.com',
    department: 'Engineering',
    salary: 75000,
    startDate: '2020-01-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Doe',
    age: 32,
    email: 'jane.doe@company.com',
    department: 'Marketing',
    salary: 68000,
    startDate: '2021-03-22',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Peter Pan',
    age: 100,
    email: 'peter.pan@neverland.com',
    department: 'Adventure',
    salary: 50000,
    startDate: '1904-12-27',
    status: 'Flying',
  },
  {
    id: '4',
    name: 'Alice Wonder',
    age: 28,
    email: 'alice.wonder@rabbit.hole',
    department: 'HR',
    salary: 55000,
    startDate: '2022-07-10',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Bob Builder',
    age: 45,
    email: 'bob.builder@construction.com',
    department: 'Construction',
    salary: 82000,
    startDate: '2018-05-03',
    status: 'Building',
  },
  ...Array.from({ length: 95 }, (_, i) => {
    const id = (i + 6).toString()
    const firstNames = [
      'Michael',
      'Sarah',
      'David',
      'Emma',
      'Chris',
      'Jessica',
      'Ryan',
      'Ashley',
      'Kevin',
      'Amanda',
      'Daniel',
      'Jennifer',
      'Matthew',
      'Lisa',
      'James',
      'Maria',
      'Andrew',
      'Michelle',
      'Joshua',
      'Elizabeth',
      'Brandon',
      'Nicole',
      'Tyler',
      'Rachel',
      'Jacob',
      'Stephanie',
      'Nicholas',
      'Rebecca',
      'Anthony',
      'Laura',
      'William',
      'Melissa',
      'Samuel',
      'Amy',
      'Joseph',
      'Angela',
      'Alexander',
      'Deborah',
      'Adam',
      'Sharon',
    ]
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
      'Hernandez',
      'Lopez',
      'Gonzalez',
      'Wilson',
      'Anderson',
      'Thomas',
      'Taylor',
      'Moore',
      'Jackson',
      'Martin',
      'Lee',
      'Perez',
      'Thompson',
      'White',
      'Harris',
      'Sanchez',
      'Clark',
      'Ramirez',
      'Lewis',
      'Robinson',
      'Walker',
      'Young',
      'Allen',
      'King',
      'Wright',
      'Scott',
      'Torres',
      'Nguyen',
      'Hill',
      'Flores',
    ]
    const departments = [
      'Engineering',
      'Marketing',
      'HR',
      'Sales',
      'Finance',
      'Operations',
      'Customer Service',
      'Product',
      'Legal',
      'Design',
      'Data Science',
      'Security',
      'Administration',
      'Business Development',
      'Quality Assurance',
    ]
    const statuses = [
      'Active',
      'On Leave',
      'Vacation',
      'Training',
      'Remote',
      'Probation',
      'Intern',
    ]

    const firstName = firstNames[i % firstNames.length] ?? 'User'
    const lastName =
      lastNames[Math.floor(i / firstNames.length) % lastNames.length] ?? 'User'
    const department = departments[i % departments.length]
    const status = statuses[i % statuses.length]
    const age = 22 + (i % 43) // Age between 22-65
    const baseSalary = 40000 + (i % 20) * 5000 + Math.floor(i / 20) * 2000 // Varied salaries
    const years = 2018 + (i % 6)
    const months = String(1 + (i % 12)).padStart(2, '0')
    const days = String(1 + (i % 28)).padStart(2, '0')

    return {
      id,
      name: `${firstName} ${lastName}`,
      age,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      salary: baseSalary,
      startDate: `${years}-${months}-${days}`,
      status,
    }
  }),
]

// Sample metrics for employee data
const employeeMetrics: MetricCardData[] = [
  {
    title: 'Total Employees',
    value: 100,
    subtitle: 'Active workforce',
    trend: {
      value: 12.5,
      isPositive: true,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Average Salary',
    value: '$67,250',
    subtitle: 'Per employee',
    trend: {
      value: 8.2,
      isPositive: true,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Active Status',
    value: '85%',
    subtitle: '85 of 100 employees',
    trend: {
      value: 5.0,
      isPositive: true,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Departments',
    value: 15,
    subtitle: 'Active divisions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

// Sample filters for the filter section
const sampleFilters: DataGridFilter[] = [
  {
    label: 'Department',
    value: 'all',
    type: 'dropdown',
    options: [
      { value: 'all' },
      { value: 'Engineering' },
      { value: 'Marketing' },
      { value: 'HR' },
      { value: 'Sales' },
      { value: 'Finance' },
      { value: 'Operations' },
      { value: 'Customer Service' },
      { value: 'Product' },
      { value: 'Legal' },
      { value: 'Design' },
      { value: 'Data Science' },
      { value: 'Security' },
      { value: 'Administration' },
      { value: 'Business Development' },
      { value: 'Quality Assurance' },
      { value: 'Adventure' },
      { value: 'Construction' },
    ],
    onChange: (value: DropdownOption | null) => {
      console.log('Department filter changed:', value)
    },
    placeholder: 'All Departments',
  },
  {
    label: 'Status',
    value: 'all',
    type: 'dropdown',
    options: [
      { value: 'all' },
      { value: 'Active' },
      { value: 'On Leave' },
      { value: 'Vacation' },
      { value: 'Training' },
      { value: 'Remote' },
      { value: 'Probation' },
      { value: 'Intern' },
      { value: 'Flying' },
      { value: 'Building' },
    ],
    onChange: (value: DropdownOption | null) => {
      console.log('Status filter changed:', value)
    },
    placeholder: 'All Statuses',
  },
]

const commonArgs = {
  columns: sampleColumns,
  rows: sampleRows,
  buttons: [{ text: 'Add New' }] as ButtonProps[],
  searchbarProps: { value: '', onChange: () => {} },
  filters: sampleFilters,
  metrics: employeeMetrics,
  permissions: { access: 'write' },
  // Add manage row callback functions so the toolbar shows when rows are selected
  onManage: (selectedRows: string[]) => {
    console.log('Manage rows:', selectedRows)
  },
  onDelete: (selectedRows: string[]) => {
    console.log('Delete rows:', selectedRows)
  },
  onDuplicate: (selectedRows: string[]) => {
    console.log('Duplicate rows:', selectedRows)
  },
  onShow: (selectedRows: string[]) => {
    console.log('Show rows:', selectedRows)
  },
  // Required callback for inline editing saves
  onCellSave: (rowId: string, field: string, value: string) => {
    console.log('Cell save:', { rowId, field, value })
  },
  // Inline row creation
  onRowCreation: (rowData: Record<string, any>) => {
    console.log('Row creation:', rowData)
    // In a real app, this would save to backend
    return Promise.resolve()
  },
} satisfies DatagridProps

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
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
  render: args => (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
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
  render: args => (
    <div
      style={{
        backgroundColor: '#1e293b',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
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
  render: args => (
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
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
        searchbarProps={{ value: '', onChange: () => {} }}
        filters={sampleFilters}
        permissions={{ access: 'write' }}
        styles={{
          theme: theme,
        }}
        showIdColumns={showIds}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
        }}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
}

// Custom styling example
export const CustomStyling: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
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

// Column Resize Demo Component
const ColumnResizeDemoComponent: React.FC<DatagridProps> = args => {
  const [columnWidths, setColumnWidths] = React.useState<
    Record<string, number>
  >({})

  const handleColumnResize = (columnField: string, newWidth: number) => {
    console.log(`Column ${columnField} resized to ${newWidth}px`)
    setColumnWidths(prev => ({ ...prev, [columnField]: newWidth }))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        <strong>Resize Demo:</strong> Hover over column borders to see resize
        handles. Drag to resize columns.
        <br />
        <strong>Filter Demo:</strong> Use the filter section above the table to
        filter data.
        <br />
        <strong>Metrics Demo:</strong> Key performance indicators are displayed
        at the top.
        {Object.keys(columnWidths).length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Resized columns:</strong>{' '}
            {JSON.stringify(columnWidths, null, 2)}
          </div>
        )}
      </div>
      <DataGrid
        {...args}
        showIdColumns={true}
        onColumnResize={handleColumnResize}
        filters={sampleFilters}
        metrics={employeeMetrics}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
        }}
      />
    </div>
  )
}

// Column Resize Demo
export const ColumnResizeDemo: Story = {
  render: args => <ColumnResizeDemoComponent {...args} />,
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
  // Light-themed demo with an unpainted wrapper: pin the light canvas so the
  // #666 helper text doesn't inherit the default sacred (#0e0e0e) backdrop.
  globals: { backgrounds: { value: 'light' } },
}

// Financial Statements Data and Filters
const financialColumns: ColumnDef[] = [
  { field: 'id', headerName: 'Transaction ID', width: 120, resizable: true },
  { field: 'date', headerName: 'Date', width: 120, resizable: true },
  {
    field: 'description',
    headerName: 'Description',
    width: 250,
    resizable: true,
  },
  { field: 'category', headerName: 'Category', width: 140, resizable: true },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'currency',
    width: 120,
    resizable: true,
  },
  { field: 'type', headerName: 'Type', width: 100, resizable: true },
  { field: 'account', headerName: 'Account', width: 150, resizable: true },
  { field: 'status', headerName: 'Status', width: 100, resizable: true },
]

const financialRows: RowData[] = [
  {
    id: 'TXN-001',
    date: '2024-01-15',
    description: 'Office Supplies Purchase',
    category: 'Office Expenses',
    amount: -245.5,
    type: 'Expense',
    account: 'Business Checking',
    status: 'Cleared',
  },
  {
    id: 'TXN-002',
    date: '2024-01-18',
    description: 'Client Payment - ABC Corp',
    category: 'Revenue',
    amount: 5000.0,
    type: 'Income',
    account: 'Business Checking',
    status: 'Cleared',
  },
  {
    id: 'TXN-003',
    date: '2024-02-01',
    description: 'Monthly Software Subscription',
    category: 'Technology',
    amount: -99.99,
    type: 'Expense',
    account: 'Business Credit Card',
    status: 'Pending',
  },
  {
    id: 'TXN-004',
    date: '2024-02-10',
    description: 'Consulting Services Revenue',
    category: 'Revenue',
    amount: 2500.0,
    type: 'Income',
    account: 'Business Checking',
    status: 'Cleared',
  },
  {
    id: 'TXN-005',
    date: '2024-02-15',
    description: 'Equipment Purchase',
    category: 'Capital Expenses',
    amount: -1200.0,
    type: 'Expense',
    account: 'Business Checking',
    status: 'Cleared',
  },
  {
    id: 'TXN-006',
    date: '2024-03-01',
    description: 'Marketing Campaign',
    category: 'Marketing',
    amount: -750.0,
    type: 'Expense',
    account: 'Business Credit Card',
    status: 'Cleared',
  },
  {
    id: 'TXN-007',
    date: '2024-03-12',
    description: 'Project Payment - XYZ Ltd',
    category: 'Revenue',
    amount: 8500.0,
    type: 'Income',
    account: 'Business Checking',
    status: 'Cleared',
  },
  ...Array.from({ length: 125 }, (_, i) => {
    const txnNumber = String(i + 8).padStart(3, '0')
    const id = `TXN-${txnNumber}`

    const incomeDescriptions = [
      'Client Payment - Professional Services',
      'Monthly Retainer Fee',
      'Project Milestone Payment',
      'Consulting Revenue',
      'Software License Sale',
      'Training Workshop Revenue',
      'Product Sales Revenue',
      'Subscription Revenue',
      'Partnership Commission',
      'Investment Returns',
      'Rental Income',
      'Interest Income',
      'Grant Funding',
      'Contract Payment',
      'Service Fee Revenue',
    ]

    const expenseDescriptions = [
      'Office Rent Payment',
      'Utility Bills',
      'Internet & Phone Service',
      'Software Subscription',
      'Marketing Advertisement',
      'Business Travel',
      'Equipment Maintenance',
      'Professional Services',
      'Insurance Premium',
      'Office Supplies',
      'Parking & Transportation',
      'Business Meals',
      'Conference & Training',
      'Legal Fees',
      'Accounting Services',
      'Bank Fees',
      'Postage & Shipping',
      'Website & Domain',
      'Cloud Storage',
      'Security Services',
    ]

    const categories = [
      'Revenue',
      'Office Expenses',
      'Technology',
      'Marketing',
      'Travel',
      'Professional Services',
      'Insurance',
      'Utilities',
      'Equipment',
      'Training & Development',
      'Legal & Compliance',
      'Banking & Finance',
      'Communication',
      'Supplies',
      'Transportation',
      'Capital Expenses',
    ]

    const accounts = [
      'Business Checking',
      'Business Credit Card',
      'Savings Account',
      'Petty Cash',
    ]
    const statuses = ['Cleared', 'Pending', 'Reconciled', 'Processing']

    const isIncome = i % 3 === 0 // Roughly 1/3 income, 2/3 expenses
    const type = isIncome ? 'Income' : 'Expense'
    const descriptions = isIncome ? incomeDescriptions : expenseDescriptions
    const description = descriptions[i % descriptions.length]

    // Generate varied amounts
    let amount: number
    if (isIncome) {
      amount = 500 + Math.random() * 15000 // Income: $500 - $15,500
    } else {
      amount = -(25 + Math.random() * 2000) // Expenses: $25 - $2,025
    }
    amount = Math.round(amount * 100) / 100 // Round to 2 decimal places

    const category = categories[i % categories.length]
    const account = accounts[i % accounts.length]
    const status = statuses[i % statuses.length]

    // Generate dates across 2023-2024
    const year = i % 2 === 0 ? 2024 : 2023
    const month = String(1 + (i % 12)).padStart(2, '0')
    const day = String(1 + (i % 28)).padStart(2, '0')
    const date = `${year}-${month}-${day}`

    return {
      id,
      date,
      description,
      category,
      amount,
      type,
      account,
      status,
    }
  }),
]

const financialFilters: DataGridFilter[] = [
  {
    label: 'Transaction Date Range',
    value: { start: null, end: null },
    type: 'daterange',
    onChange: (value: { start: Date | null; end: Date | null }) => {
      console.log('Date range filter changed:', value)
    },
  },
  {
    label: 'Category',
    value: 'all',
    type: 'dropdown',
    options: [
      { value: 'all' },
      { value: 'Revenue' },
      { value: 'Office Expenses' },
      { value: 'Technology' },
      { value: 'Marketing' },
      { value: 'Travel' },
      { value: 'Professional Services' },
      { value: 'Insurance' },
      { value: 'Utilities' },
      { value: 'Equipment' },
      { value: 'Training & Development' },
      { value: 'Legal & Compliance' },
      { value: 'Banking & Finance' },
      { value: 'Communication' },
      { value: 'Supplies' },
      { value: 'Transportation' },
      { value: 'Capital Expenses' },
    ],
    onChange: (value: DropdownOption | null) => {
      console.log('Category filter changed:', value)
    },
    placeholder: 'All Categories',
  },
  {
    label: 'Transaction Type',
    value: 'all',
    type: 'dropdown',
    options: [{ value: 'all' }, { value: 'Income' }, { value: 'Expense' }],
    onChange: (value: DropdownOption | null) => {
      console.log('Type filter changed:', value)
    },
    placeholder: 'All Types',
  },
  {
    label: 'Status',
    value: 'all',
    type: 'dropdown',
    options: [
      { value: 'all' },
      { value: 'Cleared' },
      { value: 'Pending' },
      { value: 'Reconciled' },
      { value: 'Processing' },
    ],
    onChange: (value: DropdownOption | null) => {
      console.log('Status filter changed:', value)
    },
    placeholder: 'All Statuses',
  },
]

// Financial metrics for transaction data
const financialMetrics: MetricCardData[] = [
  {
    title: 'Total Revenue',
    value: '$342,750',
    subtitle: 'Incoming transactions',
    trend: {
      value: 15.3,
      isPositive: true,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Total Expenses',
    value: '$187,420',
    subtitle: 'Outgoing transactions',
    trend: {
      value: 3.2,
      isPositive: false,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  {
    title: 'Net Income',
    value: '$155,330',
    subtitle: 'Profit margin',
    trend: {
      value: 22.8,
      isPositive: true,
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Transactions',
    value: 132,
    subtitle: 'Total processed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
]

export const FinancialStatements: Story = {
  name: 'Financial Statements with Date Filters',
  render: args => (
    <div
      style={{ backgroundColor: '#f3f4f6', height: '100vh', padding: '1rem' }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        <strong>Financial Demo:</strong> This story showcases date range
        filtering with financial transaction data.
        <br />
        <strong>Features:</strong> Date range filter, currency formatting,
        category-based filtering, and financial metrics.
      </div>
      <DataGrid
        {...args}
        columns={financialColumns}
        rows={financialRows}
        buttons={[{ text: 'Add Transaction' }] as ButtonProps[]}
        searchbarProps={{ value: '', onChange: () => {} }}
        filters={financialFilters}
        metrics={financialMetrics}
        styles={{
          theme: 'light',
        }}
        showIdColumns={true}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
        }}
      />
    </div>
  ),
  args: {
    columns: financialColumns,
    rows: financialRows,
    filters: financialFilters,
    metrics: financialMetrics,
    styles: {
      theme: 'light',
    },
  },
}

export const SacredThemeWithMetrics: Story = {
  name: 'Sacred Theme with Metrics',
  render: args => (
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}>
        <strong>Sacred Theme Demo:</strong> Experience the mystical design with
        ancient glyphs and golden accents.
        <br />
        <strong>Features:</strong> Sacred metrics with animated glyphs, mystical
        styling, and ethereal effects.
      </div>
      <DataGrid
        {...args}
        columns={sampleColumns}
        rows={sampleRows}
        buttons={[{ text: 'Add Sacred Entity' }] as ButtonProps[]}
        searchbarProps={{ value: '', onChange: () => {} }}
        filters={sampleFilters}
        metrics={employeeMetrics}
        styles={{
          theme: 'sacred',
        }}
        showIdColumns={true}
        onRowCreation={(rowData: Record<string, any>) => {
          console.log('Row creation:', rowData)
          return Promise.resolve()
        }}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
        }}
      />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    filters: sampleFilters,
    metrics: employeeMetrics,
    styles: {
      theme: 'sacred',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'dark' } },
}

const onManageAction = fn()
const onDeleteAction = fn()
const onDuplicateAction = fn()
const onShowAction = fn()

export const ManageRowDemo: Story = {
  render: args => (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        <strong>Manage Row Demo:</strong> Click on the checkboxes to select
        rows. The manage row toolbar will appear with options to manage, delete,
        duplicate, and show selected rows.
        <br />
        <strong>Test Instructions:</strong>
        <br />
        1. Click on row checkboxes to select rows
        <br />
        2. Notice the toolbar appears with manage options
        <br />
        3. Check the console for callback logs when clicking manage actions
      </div>
      <DataGrid
        {...args}
        showIdColumns={true}
        onManage={selectedRows => {
          console.log('🔧 Manage action called with rows:', selectedRows)
          onManageAction(
            `Managing ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
          )
        }}
        onDelete={selectedRows => {
          console.log('🗑️ Delete action called with rows:', selectedRows)
          onDeleteAction(
            `Deleting ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
          )
        }}
        onDuplicate={selectedRows => {
          console.log('📋 Duplicate action called with rows:', selectedRows)
          onDuplicateAction(
            `Duplicating ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
          )
        }}
        onShow={selectedRows => {
          console.log('👁️ Show action called with rows:', selectedRows)
          onShowAction(
            `Showing ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
          )
        }}
        onSelectionChange={selectedRows => {
          console.log('✅ Selection changed to:', selectedRows)
        }}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
        }}
      />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    buttons: [{ text: 'Add New' }] as ButtonProps[],
    searchbarProps: { value: '', onChange: () => {} },
    styles: {
      theme: 'light',
    },
  },
  // Light-themed demo with an unpainted wrapper: pin the light canvas so the
  // #666 instruction text doesn't inherit the default sacred (#0e0e0e) backdrop.
  globals: { backgrounds: { value: 'light' } },
}

// Inline Row Creation Demo Component
const InlineRowCreationDemo: React.FC<DatagridProps> = args => {
  const [rows, setRows] = React.useState(sampleRows)
  const [createdCount, setCreatedCount] = React.useState(0)

  const handleRowCreation = async (rowData: Record<string, unknown>) => {
    console.log('Creating new row:', rowData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Create new row with generated ID
    const newRow = {
      id: `new-${Date.now()}`,
      name: String(rowData.name || ''),
      age: Number(rowData.age) || 0,
      email: String(rowData.email || ''),
      department: String(rowData.department || ''),
      salary: Number(rowData.salary) || 0,
      startDate: rowData.startDate
        ? new Date(String(rowData.startDate)).toISOString().split('T')[0]
        : '',
      status: String(rowData.status || 'Active'),
    }

    setRows(prev => [newRow, ...prev])
    setCreatedCount(prev => prev + 1)
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Inline Row Creation:</strong> Click &quot;Add Row&quot; to
        create new rows directly in the table.
        <br />
        <strong>Features:</strong> Field validation, different input types
        (text, date, dropdowns), and required field indicators.
        <br />
        <strong>Rows Created:</strong> {createdCount}
      </div>
      <DataGrid
        {...args}
        rows={rows}
        onRowCreation={handleRowCreation}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
          // Update existing row
          setRows(prev =>
            prev.map(row =>
              row.id === rowId ? { ...row, [field]: value } : row
            )
          )
        }}
      />
    </div>
  )
}

export const InlineRowCreation: Story = {
  name: 'Inline Row Creation Demo',
  render: args => <InlineRowCreationDemo {...args} />,
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    searchbarProps: { value: '', onChange: () => {} },
    styles: {
      theme: 'light',
    },
  },
}

// Simple demo specifically for testing validation errors
const ValidationTestDemo: React.FC<DatagridProps> = args => {
  const [rows, setRows] = React.useState(sampleRows)

  const handleRowCreation = async (rowData: Record<string, unknown>) => {
    console.log('Creating new row:', rowData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Create new row with generated ID
    const newRow = {
      id: `new-${Date.now()}`,
      name: String(rowData.name || ''),
      age: Number(rowData.age) || 0,
      email: String(rowData.email || ''),
      department: String(rowData.department || ''),
      salary: Number(rowData.salary) || 0,
      startDate: rowData.startDate
        ? new Date(String(rowData.startDate)).toISOString().split('T')[0]
        : '',
      status: String(rowData.status || 'Active'),
    }

    setRows(prev => [newRow, ...prev])
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Validation Error Testing:</strong> Click &quot;Add Row&quot;
        then try to save without filling required fields.
        <br />
        <strong>Expected Behavior:</strong> A snackbar should appear with
        validation errors.
        <br />
        <strong>Required Fields:</strong> Name, Age, Email, Department
      </div>
      <DataGrid
        {...args}
        rows={rows}
        onRowCreation={handleRowCreation}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
          setRows(prev =>
            prev.map(row =>
              row.id === rowId ? { ...row, [field]: value } : row
            )
          )
        }}
      />
    </div>
  )
}

export const ValidationErrorDemo: Story = {
  name: 'Validation Error Snackbar Demo',
  render: args => <ValidationTestDemo {...args} />,
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    searchbarProps: { value: '', onChange: () => {} },
    styles: {
      theme: 'light',
    },
  },
}

// Billing Information Example Component
const BillingInformationExampleDemo: React.FC = () => {
  const [rows, setRows] = React.useState<RowData[]>([
    {
      id: '1',
      name: 'John Doe',
      streetAddress1: '123 Main St',
      streetAddress2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
      phoneNumber: '(555) 123-4567',
    },
    {
      id: '2',
      name: 'Jane Smith',
      streetAddress1: '456 Oak Ave',
      streetAddress2: '',
      city: 'Los Angeles',
      state: 'CA',
      zipcode: '90210',
      phoneNumber: '(555) 987-6543',
    },
  ])

  const billingColumns: ColumnDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      creationField: {
        type: 'text',
        required: true,
        placeholder: 'Enter full name',
      },
    },
    {
      field: 'streetAddress1',
      headerName: 'Street Address 1',
      width: 200,
      creationField: {
        type: 'text',
        required: true,
        placeholder: 'Enter street address',
      },
    },
    {
      field: 'streetAddress2',
      headerName: 'Street Address 2',
      width: 200,
      creationField: {
        type: 'text',
        required: false,
        placeholder: 'Apt, suite, etc. (optional)',
      },
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
      creationField: {
        type: 'text',
        required: true,
        placeholder: 'Enter city',
      },
    },
    {
      field: 'state',
      headerName: 'State',
      width: 100,
      creationField: {
        type: 'searchableDropdown',
        required: true,
        placeholder: 'Select state',
        options: [
          { value: 'NY' },
          { value: 'CA' },
          { value: 'TX' },
          { value: 'FL' },
          { value: 'IL' },
        ],
      },
    },
    {
      field: 'zipcode',
      headerName: 'Zip Code',
      width: 120,
      creationField: {
        type: 'text',
        required: true,
        placeholder: 'Enter zip code',
        validation: value => {
          const zipRegex = /^\d{5}(-\d{4})?$/
          if (!zipRegex.test(String(value))) {
            return 'Please enter a valid zip code'
          }
          return undefined
        },
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      width: 150,
      creationField: {
        type: 'text',
        required: true,
        placeholder: 'Enter phone number',
        validation: value => {
          const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
          if (!phoneRegex.test(String(value))) {
            return 'Please enter phone as (555) 123-4567'
          }
          return undefined
        },
      },
    },
  ]

  const handleRowCreation = async (rowData: Record<string, unknown>) => {
    console.log('Creating billing information:', rowData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))

    const newRow = {
      id: `billing-${Date.now()}`,
      name: String(rowData.name || ''),
      streetAddress1: String(rowData.streetAddress1 || ''),
      streetAddress2: String(rowData.streetAddress2 || ''),
      city: String(rowData.city || ''),
      state: String(rowData.state || ''),
      zipcode: String(rowData.zipcode || ''),
      phoneNumber: String(rowData.phoneNumber || ''),
    }

    setRows(prev => [newRow, ...prev])
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Billing Information:</strong> Example of replacing a popup form
        with inline row creation.
        <br />
        <strong>Features:</strong> Address validation, state dropdown, phone
        number formatting, and required field validation.
      </div>
      <DataGrid
        columns={billingColumns}
        rows={rows}
        onRowCreation={handleRowCreation}
        onCellSave={(rowId: string, field: string, value: string) => {
          console.log('Cell save:', { rowId, field, value })
          setRows(prev =>
            prev.map(row =>
              row.id === rowId ? { ...row, [field]: value } : row
            )
          )
        }}
        searchbarProps={{ value: '', onChange: () => {} }}
        permissions={{ access: 'write' }}
        styles={{
          theme: 'light',
        }}
      />
    </div>
  )
}

export const BillingInformationExample: Story = {
  render: () => <BillingInformationExampleDemo />,
  args: {},
}

// Responsive viewport stories
export const Mobile: Story = {
  name: 'Mobile (Card View)',
  render: () => (
    <div
      style={{
        backgroundColor: '#e5e7eb',
        minHeight: '100vh',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '375px',
          maxWidth: '375px',
          backgroundColor: '#f3f4f6',
          minHeight: '667px',
          padding: '0.5rem',
          boxSizing: 'border-box',
          overflow: 'auto',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
        }}
      >
        <DataGrid {...commonArgs} styles={{ theme: 'light' }} />
      </div>
    </div>
  ),
}

export const Tablet: Story = {
  name: 'Tablet (Card View)',
  render: () => (
    <div
      style={{
        backgroundColor: '#e5e7eb',
        minHeight: '100vh',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '768px',
          maxWidth: '768px',
          backgroundColor: '#f3f4f6',
          minHeight: '1024px',
          padding: '1rem',
          boxSizing: 'border-box',
          overflow: 'auto',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
        }}
      >
        <DataGrid {...commonArgs} styles={{ theme: 'light' }} />
      </div>
    </div>
  ),
}

export const Desktop: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#e5e7eb',
        minHeight: '100vh',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '1440px',
          maxWidth: '1440px',
          backgroundColor: '#f3f4f6',
          minHeight: '900px',
          padding: '1rem',
          boxSizing: 'border-box',
          overflow: 'auto',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
        }}
      >
        <DataGrid {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

// ============================================================================
// COMPOSITE-FIELD SUBSYSTEM
// A column whose `type` is CompositeFieldConfig[] opens the
// CompositeFieldEditModal for multi-field editing when its cell is clicked
// on a selected row. Saves batch into `onCompositeFieldSave`.
// ============================================================================

const compositeContactFields: CompositeFieldConfig[] = [
  {
    field: 'contactName',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter contact name',
  },
  {
    field: 'contactEmail',
    label: 'Email',
    type: 'text',
    helperText: 'Work email preferred',
  },
  {
    field: 'contactPhone',
    label: 'Phone',
    type: 'phoneNumber',
  },
]

const compositeColumns: ColumnDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'company', headerName: 'Company', width: 200 },
  {
    field: 'contact',
    headerName: 'Contact',
    width: 280,
    // CompositeFieldConfig[] column type: clicking this cell on a selected
    // row opens the multi-field edit modal instead of an inline editor.
    type: compositeContactFields,
    // The composite cell itself displays a summary of the underlying
    // row fields (the row has no `contact` key of its own).
    renderCell: ({ row }) =>
      `${String(row.contactName ?? '')} · ${String(row.contactEmail ?? '')}`,
  },
  { field: 'status', headerName: 'Status', width: 120 },
]

const compositeRows: RowData[] = [
  {
    id: '1',
    company: 'Acme Corp',
    contactName: 'John Doe',
    contactEmail: 'john.doe@acme.com',
    contactPhone: '(555) 123-4567',
    status: 'Active',
  },
  {
    id: '2',
    company: 'Globex Inc',
    contactName: 'Jane Smith',
    contactEmail: 'jane.smith@globex.com',
    contactPhone: '(555) 987-6543',
    status: 'Prospect',
  },
  {
    id: '3',
    company: 'Initech LLC',
    contactName: 'Bill Lumbergh',
    contactEmail: 'bill.lumbergh@initech.com',
    contactPhone: '(555) 246-8100',
    status: 'Churned',
  },
]

const onCompositeSaveAction = fn()

/**
 * The composite-field editing flow end to end. Pins the observable
 * contract: the `contact` column (type: CompositeFieldConfig[]) renders its
 * summary via renderCell; once its row is selected the cell reports
 * `data-cell-state="editable"`, and clicking it opens the
 * CompositeFieldEditModal (`[data-composite-modal="true"]`, an "Edit
 * fields" dialog) with one labelled control per CompositeFieldConfig —
 * each wrapped in `[data-field-name]`, seeded from the row's current
 * values, required fields starred, helper text shown. "Save Changes"
 * fires the batched `onCompositeFieldSave(rowId, fieldUpdates)` callback
 * exactly once with ALL composite field values (not per-field
 * `onCellSave`), closes the modal, and the grid cell optimistically shows
 * the edited summary.
 */
export const CompositeField: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: compositeColumns,
    rows: compositeRows,
    dataGrid: 'composite-demo',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: {
      theme: 'light',
    },
    onCellSave: fn(),
    onCompositeFieldSave: onCompositeSaveAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Scope every cell query to the desktop <tr> — the hidden mobile card
    // view duplicates the row content at this viewport.
    const row = canvasElement.querySelector<HTMLElement>('tr[data-row-id="1"]')
    if (!row) {
      throw new Error('Desktop table row [data-row-id="1"] did not render')
    }

    // 1. Select the row (a click on any cell of an unselected row toggles
    //    selection).
    const companyCell = row.querySelector<HTMLElement>(
      '[data-field-name="company"]'
    )
    if (!companyCell) throw new Error('Company cell did not render')
    await userEvent.click(companyCell)
    await expect(row).toHaveAttribute('data-row-state', 'selected')

    // 2. The composite column now advertises editability.
    const contactCell = row.querySelector<HTMLElement>(
      '[data-field-name="contact"]'
    )
    if (!contactCell) throw new Error('Composite contact cell did not render')
    await expect(contactCell).toHaveAttribute('data-cell-state', 'editable')

    // 3. Clicking the composite cell opens the multi-field edit modal,
    //    seeded from the row data.
    await userEvent.click(contactCell)
    const modal = await canvas.findByRole('dialog', { name: 'Edit fields' })
    await expect(modal).toBeVisible()
    await expect(modal).toHaveAttribute('data-composite-modal', 'true')
    await expect(modal).toHaveAttribute('data-composite-row-id', '1')

    const nameInput = modal.querySelector<HTMLInputElement>(
      '[data-field-name="contactName"] input'
    )
    if (!nameInput) throw new Error('Composite Full Name input did not render')
    await expect(nameInput).toHaveValue('John Doe')

    // Required marker on the required field, helper text on the email field.
    await expect(within(modal).getByText('Full Name *')).toBeVisible()
    await expect(within(modal).getByText('Work email preferred')).toBeVisible()

    // 4. Edit one field and save — the batched onCompositeFieldSave fires
    //    once with the full field-update record (this pins the wired-up
    //    callback; it used to be a dead prop).
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jane Roe')
    await userEvent.click(
      within(modal).getByRole('button', { name: 'Save Changes' })
    )
    await waitFor(() =>
      expect(onCompositeSaveAction).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          contactName: 'Jane Roe',
          contactEmail: 'john.doe@acme.com',
        })
      )
    )

    // 5. The modal closes and the grid optimistically shows the edit.
    await waitFor(() =>
      expect(canvas.queryByRole('dialog', { name: 'Edit fields' })).toBeNull()
    )
    await waitFor(() =>
      expect(contactCell).toHaveTextContent('Jane Roe · john.doe@acme.com')
    )
  },
}

/**
 * The `permissions.access: 'read'` rendering — "view only, no editing".
 * Pins the observable read-only contract: write-verb toolbar buttons
 * ("Add Contact") are filtered out while read-safe ones ("Download
 * Report") stay; rows remain selectable but a selected row's cells stay
 * `data-cell-state="idle"` (no editable affordance, no inline editor);
 * clicking a composite-field cell does NOT open the
 * CompositeFieldEditModal; and the row-actions toolbar offers only the
 * read verb (View) — Add/Edit/Duplicate/Delete are absent even with a
 * row selected and all write callbacks supplied.
 */
export const ReadOnlyPermissions: Story = {
  name: 'Read-Only Permissions',
  render: args => (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: compositeColumns,
    rows: compositeRows,
    dataGrid: 'composite-readonly',
    permissions: { access: 'read' },
    buttons: [{ text: 'Download Report' }, { text: 'Add Contact' }],
    searchbarProps: { value: '', onChange: () => {} },
    styles: {
      theme: 'light',
    },
    onCellSave: fn(),
    onCompositeFieldSave: fn(),
    onRowCreation: fn(),
    onManage: fn(),
    onShow: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Read mode filters write-verb custom buttons out of the toolbar and
    // keeps read-safe ones.
    await expect(
      canvas.getByRole('button', { name: 'Download Report' })
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Add Contact' })
    ).toBeNull()

    const row = canvasElement.querySelector<HTMLElement>('tr[data-row-id="1"]')
    if (!row) {
      throw new Error('Desktop table row [data-row-id="1"] did not render')
    }

    // Selection is a view-level interaction and stays available.
    const companyCell = row.querySelector<HTMLElement>(
      '[data-field-name="company"]'
    )
    if (!companyCell) throw new Error('Company cell did not render')
    await userEvent.click(companyCell)
    await expect(row).toHaveAttribute('data-row-state', 'selected')

    // A selected row's cells never advertise editability in read mode.
    const contactCell = row.querySelector<HTMLElement>(
      '[data-field-name="contact"]'
    )
    if (!contactCell) throw new Error('Composite contact cell did not render')
    await expect(contactCell).toHaveAttribute('data-cell-state', 'idle')

    // Row actions expose only the read verb; every write verb is withheld
    // even though all the write callbacks were supplied.
    await expect(canvas.getByRole('button', { name: 'View' })).toBeVisible()
    for (const writeVerb of ['Add', 'Edit', 'Duplicate', 'Delete']) {
      await expect(
        canvas.queryByRole('button', { name: writeVerb })
      ).toBeNull()
    }

    // Clicking the composite cell must NOT open the edit modal. In read
    // mode the click falls through to row selection (toggling it off) —
    // wait for that positive signal so the no-modal check runs after the
    // click was fully processed.
    await userEvent.click(contactCell)
    await waitFor(() => expect(row).toHaveAttribute('data-row-state', 'idle'))
    await expect(
      canvasElement.querySelector('[data-composite-modal]')
    ).toBeNull()
  },
}

/**
 * ACCESSIBILITY — table header semantics + sort state.
 *
 * Pins the native-table a11y contract the audit added:
 *  - every column header is a `<th scope="col" role="columnheader">` so
 *    assistive tech associates each data cell with its column (WCAG 1.3.1);
 *  - the leading select-all checkbox has a programmatic name (WCAG 4.1.2);
 *  - the grid reports both aria-rowcount and aria-colcount;
 *  - sorting a column via its header menu exposes `aria-sort` on that header
 *    ("ascending"/"descending"), which was previously never emitted.
 */
export const AccessibleHeaderSemantics: Story = {
  name: 'A11y — Header Semantics & Sort',
  render: args => (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-headers',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    // 1. The grid root exposes row + column counts.
    const grid = canvasElement.querySelector<HTMLElement>('[role="grid"]')
    if (!grid) throw new Error('Grid root [role="grid"] did not render')
    await expect(grid).toHaveAttribute('aria-rowcount')
    await expect(grid).toHaveAttribute('aria-colcount')

    // 2. Column headers are real scoped <th> cells.
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    if (!nameHeader) throw new Error('Name column header did not render')
    await expect(nameHeader).toHaveAttribute('scope', 'col')
    await expect(nameHeader).toHaveAttribute('role', 'columnheader')
    // Unsorted headers carry no aria-sort.
    await expect(nameHeader).not.toHaveAttribute('aria-sort')

    // 3. The select-all checkbox has an accessible name.
    await expect(
      within(canvasElement).getByRole('checkbox', { name: 'Select all rows' })
    ).toBeInTheDocument()

    // 4. Sorting via the header menu surfaces aria-sort. The menu is a
    //    portalled Popover, so query document.body for its items.
    const menuTrigger = nameHeader.querySelector<HTMLButtonElement>(
      '[data-action="open-column-menu"]'
    )
    if (!menuTrigger) throw new Error('Column menu trigger did not render')
    await expect(menuTrigger).toHaveAttribute('aria-haspopup', 'menu')
    await userEvent.click(menuTrigger)

    const sortAsc = await waitFor(() => {
      const btn = document.body.querySelector<HTMLButtonElement>(
        '[data-column-menu-for="name"] [data-action="sort-asc"]'
      )
      if (!btn) throw new Error('Sort ascending menu item did not appear')
      return btn
    })
    await userEvent.click(sortAsc)

    await waitFor(() =>
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    )
  },
}

/**
 * ACCESSIBILITY — dialog + menu overlays.
 *
 * Pins the overlay semantics the audit added:
 *  - the Manage Columns modal is a labelled `role="dialog" aria-modal`, moves
 *    focus in, and closes on Escape (WCAG 2.1.2 / 4.1.2);
 *  - the footer export control is a proper menu button (aria-haspopup +
 *    aria-expanded) opening a `role="menu"`.
 */
export const AccessibleOverlays: Story = {
  name: 'A11y — Dialog & Menu Overlays',
  render: args => (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-overlays',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // --- Manage Columns dialog ------------------------------------------
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    if (!nameHeader) throw new Error('Name column header did not render')
    const menuTrigger = nameHeader.querySelector<HTMLButtonElement>(
      '[data-action="open-column-menu"]'
    )
    if (!menuTrigger) throw new Error('Column menu trigger did not render')
    await userEvent.click(menuTrigger)

    const manageBtn = await waitFor(() => {
      const btn = document.body.querySelector<HTMLButtonElement>(
        '[data-column-menu-for="name"] [data-action="manage-columns"]'
      )
      if (!btn) throw new Error('Manage-columns menu item did not appear')
      return btn
    })
    await userEvent.click(manageBtn)

    // The dialog renders inline inside the grid (not portalled).
    const dialog = await canvas.findByRole('dialog')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    // aria-labelledby resolves to the visible "Manage Columns" heading.
    const labelId = dialog.getAttribute('aria-labelledby')
    if (!labelId) throw new Error('Dialog is missing aria-labelledby')
    // getElementById avoids CSS-escaping the colon-bearing useId value.
    await expect(
      canvasElement.ownerDocument.getElementById(labelId)
    ).toHaveTextContent('Manage Columns')

    // Escape closes the dialog (keyboard operable, WCAG 2.1.2).
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull())

    // --- Export menu button ---------------------------------------------
    const exportBtn = canvas.getByRole('button', { name: 'Export options' })
    await expect(exportBtn).toHaveAttribute('aria-haspopup', 'menu')
    await expect(exportBtn).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(exportBtn)
    await expect(exportBtn).toHaveAttribute('aria-expanded', 'true')
    // The menu is portalled to document.body with a menu role.
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]')
      if (!menu) throw new Error('Export menu [role="menu"] did not appear')
    })
  },
}

// ============================================================================
// ACCESSIBILITY — keyboard operability + status messages (adversarial-review
// fixes D2/D4/D5, the footer menu keyboard model, and the coverage gaps the
// review flagged: mobile-card a11y, column-visibility labels, focus-visible +
// reduced-motion CSS). goobs has no unit tests — these play stories are the
// regression net for behaviour that could otherwise silently regress green.
// ============================================================================

const onColumnResizeSpy = fn()

/**
 * ACCESSIBILITY — APG Grid keyboard navigation (WCAG 2.1.1) + valid grid
 * semantics (D2 / D3). Pins: the interactive-grid role/aria live on the real
 * `<table>` (not the outer wrapper) with `<thead>/<tbody>` rowgroups; the grid
 * body is a single tab stop (one `tabindex="0"` cell); Arrow keys move focus
 * between cells; Space selects a row and Enter edits an editable cell of a
 * selected row; and the pagination count is a `role="status"` region (4.1.3).
 */
export const AccessibleGridKeyboard: Story = {
  name: 'A11y — Grid Keyboard Navigation',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-grid-kbd',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    // 1. Grid semantics sit on the real <table> with rowgroups (D3).
    const table = canvasElement.querySelector<HTMLTableElement>(
      'table[role="grid"]'
    )
    if (!table) throw new Error('table[role="grid"] did not render')
    await expect(table).toHaveAttribute('aria-rowcount')
    await expect(table).toHaveAttribute('aria-colcount')
    await expect(table.querySelector('thead')).toHaveAttribute(
      'role',
      'rowgroup'
    )
    await expect(table.querySelector('tbody')).toHaveAttribute(
      'role',
      'rowgroup'
    )

    // Review fix (aria-rowindex): every row carries its absolute 1-based index
    // even though only the current page is in the DOM (aria-rowcount is the full
    // count). The column-header row is index 1, so page-1 data rows are 2, 3, …
    // (WCAG 1.3.1).
    await expect(table.querySelector('thead tr')).toHaveAttribute(
      'aria-rowindex',
      '1'
    )
    await expect(
      table.querySelector('tr[data-row-id="1"]')
    ).toHaveAttribute('aria-rowindex', '2')
    await expect(
      table.querySelector('tr[data-row-id="2"]')
    ).toHaveAttribute('aria-rowindex', '3')

    // 2. Exactly one data cell is in the tab order (roving tabindex).
    await expect(
      table.querySelectorAll('td[role="gridcell"][tabindex="0"]').length
    ).toBe(1)

    // 3. Arrow keys move focus between cells.
    const row1 = table.querySelector<HTMLElement>('tr[data-row-id="1"]')
    const nameCell1 = row1?.querySelector<HTMLTableCellElement>(
      'td[data-field-name="name"]'
    )
    if (!nameCell1) throw new Error('name cell of row 1 did not render')
    nameCell1.focus()
    await expect(nameCell1).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    const nameCell2 = table
      .querySelector<HTMLElement>('tr[data-row-id="2"]')
      ?.querySelector<HTMLTableCellElement>('td[data-field-name="name"]')
    await waitFor(() => expect(nameCell2).toHaveFocus())

    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => {
      const activeCell = document.activeElement as HTMLElement
      expect(activeCell.getAttribute('role')).toBe('gridcell')
      expect(activeCell.getAttribute('data-field-name')).not.toBe('name')
    })

    // 4. Space selects the row; Enter then edits the (editable) name cell.
    nameCell2!.focus()
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(nameCell2!.closest('tr')).toHaveAttribute(
        'data-row-state',
        'selected'
      )
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(nameCell2).toHaveAttribute('data-cell-state', 'editing')
    )

    // Review fix (D1 — text/phone editors): the inline editor input now has a
    // programmatic accessible name from the column header ("Name"), not the
    // empty label="" it used to render with (WCAG 1.3.1 / 4.1.2).
    await waitFor(() =>
      expect(
        within(nameCell2!).getByRole('textbox', { name: 'Name' })
      ).toBeInTheDocument()
    )

    // 5. The pagination count is an announced status region (WCAG 4.1.3).
    await expect(
      canvasElement.querySelector('[data-pagination-status][role="status"]')
    ).toBeInTheDocument()
  },
}

/**
 * ACCESSIBILITY — the SPECIALIZED (non-text) inline editors expose the column
 * header as their input's accessible name (D1 / R3, WCAG 1.3.1 / 4.1.2). The
 * round-3 story already pinned the `text` editor; this pins the rest of the
 * class now that the leaf Field components accept `ariaLabel` and the four
 * DataGrid editor callsites thread `column.headerName` into every branch:
 *   - `age` edits as an `internalIncrement` → a real `<input role="spinbutton">`
 *     named "Age" (before the fix it rendered a nameless input).
 *   - `department` edits as a `dropdown` → a `role="combobox"` trigger named
 *     "Department" (before the fix its aria-label was the empty `label=""`).
 * A single grid tracks one editing cell, so opening the department editor
 * closes the age one — no explicit dismissal needed.
 */
export const AccessibleSpecializedEditorNames: Story = {
  name: 'A11y — Specialized Cell Editor Names',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-editor-names',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector<HTMLTableElement>(
      'table[role="grid"]'
    )
    if (!table) throw new Error('table[role="grid"] did not render')
    const row = table.querySelector<HTMLElement>('tr[data-row-id="1"]')
    if (!row) throw new Error('Desktop row [data-row-id="1"] did not render')

    // 1. Open the AGE cell editor from the keyboard (select-then-edit, the same
    //    contract the round-3 story exercises for the text editor). The age
    //    column edits as an `internalIncrement` — a specialized, non-text leaf
    //    whose input carries no visible <label>, so the threaded ariaLabel is
    //    its ONLY accessible name.
    const ageCell = row.querySelector<HTMLTableCellElement>(
      'td[data-field-name="age"]'
    )
    if (!ageCell) throw new Error('Age cell of row 1 did not render')
    ageCell.focus()
    await expect(ageCell).toHaveFocus()
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(row).toHaveAttribute('data-row-state', 'selected')
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(ageCell).toHaveAttribute('data-cell-state', 'editing')
    )
    // The specialized number editor's input is named "Age" by the column header.
    await waitFor(() =>
      expect(
        within(ageCell).getByRole('spinbutton', { name: 'Age' })
      ).toBeInTheDocument()
    )

    // 2. Open the DEPARTMENT cell editor (a dropdown → combobox). The grid
    //    tracks a single editing cell, so this closes the age editor. The
    //    combobox trigger is likewise named by the column header, "Department"
    //    (it used to expose only the empty label="").
    const deptCell = row.querySelector<HTMLTableCellElement>(
      'td[data-field-name="department"]'
    )
    if (!deptCell) throw new Error('Department cell of row 1 did not render')
    deptCell.focus()
    await expect(deptCell).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(deptCell).toHaveAttribute('data-cell-state', 'editing')
    )
    await waitFor(() =>
      expect(
        within(deptCell).getByRole('combobox', { name: 'Department' })
      ).toBeInTheDocument()
    )
  },
}

/**
 * ACCESSIBILITY — keyboard column resize / reorder / menu roving (D4 / D5,
 * WCAG 2.1.1). Pins: the resize handle is a focusable `role="separator"` whose
 * Arrow keys change the column width; the column-actions menu supports Arrow
 * roving between its items; and "Move column right" reorders columns from the
 * keyboard (a pointer-free alternative to header drag-and-drop).
 */
export const AccessibleColumnKeyboard: Story = {
  name: 'A11y — Column Keyboard (Resize / Reorder / Menu)',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-col-kbd',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
    onColumnResize: onColumnResizeSpy,
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    if (!nameHeader) throw new Error('Name column header did not render')

    // 1. Keyboard resize: the handle is an operable separator (D4).
    const resizeHandle = nameHeader.querySelector<HTMLElement>(
      '[data-action="resize-handle"]'
    )
    if (!resizeHandle) throw new Error('Resize handle did not render')
    await expect(resizeHandle).toHaveAttribute('role', 'separator')
    await expect(resizeHandle).toHaveAttribute('aria-orientation', 'vertical')
    resizeHandle.focus()
    await expect(resizeHandle).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(onColumnResizeSpy).toHaveBeenCalled())
    const resizeCall = onColumnResizeSpy.mock.calls.at(-1) as
      | [string, number]
      | undefined
    await expect(resizeCall?.[0]).toBe('name')
    await expect(resizeCall?.[1] ?? 0).toBeGreaterThan(150)

    // 2. Menu arrow-key roving (D5): the Popover focuses the first item on
    //    open, ArrowDown moves to the next.
    const menuTrigger = nameHeader.querySelector<HTMLButtonElement>(
      '[data-action="open-column-menu"]'
    )
    if (!menuTrigger) throw new Error('Column menu trigger did not render')
    await userEvent.click(menuTrigger)
    const sortAsc = await waitFor(() => {
      const btn = document.body.querySelector<HTMLButtonElement>(
        '[data-column-menu-for="name"] [data-action="sort-asc"]'
      )
      if (!btn) throw new Error('Column menu did not open')
      return btn
    })
    await waitFor(() => expect(sortAsc).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    const sortDesc = document.body.querySelector<HTMLButtonElement>(
      '[data-column-menu-for="name"] [data-action="sort-desc"]'
    )
    await waitFor(() => expect(sortDesc).toHaveFocus())

    // 3. Keyboard reorder via the menu (D4): "Move column right" swaps name
    //    with the next column, so the first data header becomes "age".
    const moveRight = document.body.querySelector<HTMLButtonElement>(
      '[data-column-menu-for="name"] [data-action="move-right"]'
    )
    if (!moveRight) throw new Error('Move-right menu item did not render')
    await userEvent.click(moveRight)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('thead th[role="columnheader"]')
      ).toHaveAttribute('data-column-header', 'age')
    )
  },
}

/**
 * ACCESSIBILITY — footer export menu keyboard model (WCAG 2.1.1). Pins the
 * menu-button pattern the review flagged as missing: opening the menu moves
 * focus INTO it (first item), and Arrow keys roving-cycle between the
 * portalled menuitems (previously the portalled items fell to the end of the
 * page tab order with no keyboard model).
 */
export const AccessibleFooterMenuKeyboard: Story = {
  name: 'A11y — Footer Menu Keyboard',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-footer-kbd',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const exportBtn = within(canvasElement).getByRole('button', {
      name: 'Export options',
    })
    await userEvent.click(exportBtn)

    // Focus moves into the menu (first item) on open.
    const firstItem = await waitFor(() => {
      const item = document.body.querySelector<HTMLButtonElement>(
        '[role="menu"] [role="menuitem"]'
      )
      if (!item) throw new Error('Export menu did not open')
      return item
    })
    await waitFor(() => expect(firstItem).toHaveFocus())

    const items = document.body.querySelectorAll<HTMLButtonElement>(
      '[role="menu"] [role="menuitem"]'
    )
    await expect(items.length).toBeGreaterThanOrEqual(2)

    // ArrowDown moves to the next item; ArrowUp wraps back.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(items[1]).toHaveFocus())
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(items[0]).toHaveFocus())
  },
}

/**
 * ACCESSIBILITY — column-visibility checkbox names (issue 7, WCAG 1.3.1 /
 * 4.1.2). The Manage Columns dialog's toggles have only an adjacent plain
 * `<span>` name; this pins that each toggle carries a programmatic
 * "Show <column> column" accessible name.
 */
export const AccessibleColumnVisibility: Story = {
  name: 'A11y — Column Visibility Labels',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-col-vis',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    const menuTrigger = nameHeader?.querySelector<HTMLButtonElement>(
      '[data-action="open-column-menu"]'
    )
    if (!menuTrigger) throw new Error('Column menu trigger did not render')
    await userEvent.click(menuTrigger)

    const manageBtn = await waitFor(() => {
      const btn = document.body.querySelector<HTMLButtonElement>(
        '[data-column-menu-for="name"] [data-action="manage-columns"]'
      )
      if (!btn) throw new Error('Manage-columns menu item did not appear')
      return btn
    })
    await userEvent.click(manageBtn)

    const dialog = await canvas.findByRole('dialog')
    await expect(
      within(dialog).getByRole('checkbox', {
        name: 'Show Email Address column',
      })
    ).toBeInTheDocument()
    await expect(
      within(dialog).getByRole('checkbox', { name: 'Show Department column' })
    ).toBeInTheDocument()
  },
}

/**
 * ACCESSIBILITY — mobile card view (issues 10 & 12 + D6). The card view is in
 * the DOM at every viewport (display:none on desktop), so its accessibility
 * ATTRIBUTES are asserted directly: the row Card is a keyboard-operable
 * `role="row"` (tabindex), each field label is associated with its input via
 * `htmlFor`, the expand toggle exposes `aria-expanded`, the card container is a
 * valid grid owner (D3), and the pagination count is a status region (4.1.3).
 */
export const AccessibleMobileCard: Story = {
  name: 'A11y — Mobile Card Semantics',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-mobile',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    // The mobile card container is a valid grid owner for its role="row" cards
    // (D3), and carries row/column counts.
    const mobileGrid = canvasElement.querySelector<HTMLElement>(
      '[role="grid"][aria-label="Data grid (card view)"]'
    )
    if (!mobileGrid) throw new Error('Mobile card grid did not render')
    await expect(mobileGrid).toHaveAttribute('aria-rowcount')

    // D6: the row card is a keyboard-operable role="row".
    const card = canvasElement.querySelector<HTMLElement>('[data-card="true"]')
    if (!card) throw new Error('Mobile card did not render')
    await expect(card).toHaveAttribute('role', 'row')
    await expect(card).toHaveAttribute('tabindex', '0')

    // Review fix (mobile grid ownership): the card (role="row") now owns
    // role="gridcell" field cells, so the grid → row → gridcell chain is valid.
    // Previously every card owned zero cells (axe aria-required-children).
    await expect(
      card.querySelectorAll('[role="gridcell"]').length
    ).toBeGreaterThan(0)
    // Review fix (aria-rowindex): the first card is absolute row 1 of the full
    // filtered set — only a page of cards is in the DOM, so aria-rowindex pins
    // the true position (WCAG 1.3.1).
    await expect(card).toHaveAttribute('aria-rowindex', '1')

    // Issue 10: field labels are associated with their inputs via htmlFor.
    const label = card.querySelector<HTMLLabelElement>('label[for]')
    if (!label) throw new Error('Card field label htmlFor association missing')
    await expect(label.getAttribute('for')).toBeTruthy()

    // Issue 12: the expand/collapse toggle exposes its state.
    const expandBtn = card.querySelector<HTMLButtonElement>(
      'button[aria-expanded]'
    )
    if (!expandBtn) throw new Error('Card expand toggle aria-expanded missing')
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false')

    // WCAG 4.1.3: the mobile pagination count is an announced status region.
    await expect(
      mobileGrid.parentElement?.querySelector('[role="status"]')
    ).toBeInTheDocument()
  },
}

/**
 * ACCESSIBILITY — CSS-only fixes shipped (issues 4 & 5). Focus indicators
 * (:focus-visible) and prefers-reduced-motion neutralization are pure CSS, so
 * they're guarded by scanning the injected stylesheet for the DataGrid-specific
 * rules — a regression that deletes them fails this story with a green suite
 * otherwise.
 */
export const AccessibleStyleGuards: Story = {
  name: 'A11y — Focus-Visible & Reduced-Motion CSS',
  render: args => (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-css',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async () => {
    const cellClass = cssStyles.cell
    const exportMenuClass = cssStyles.exportMenu
    if (!cellClass || !exportMenuClass)
      throw new Error('DataGrid module classes missing (cell/exportMenu)')
    let hasCellFocusRing = false
    let hasReducedMotion = false

    const scan = (rules: CSSRuleList) => {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        if (rule instanceof CSSStyleRule) {
          if (
            rule.selectorText.includes(cellClass) &&
            rule.selectorText.includes(':focus-visible')
          ) {
            hasCellFocusRing = true
          }
        } else if (rule instanceof CSSMediaRule) {
          if (
            rule.media.mediaText.includes('prefers-reduced-motion') &&
            rule.cssText.includes(exportMenuClass)
          ) {
            hasReducedMotion = true
          }
          scan(rule.cssRules)
        }
      }
    }

    for (let s = 0; s < document.styleSheets.length; s++) {
      try {
        scan(document.styleSheets[s]!.cssRules)
      } catch {
        // Cross-origin stylesheet — skip (cssRules access throws).
      }
    }

    // The keyboard focus ring on the roving grid cell (issue 4) …
    await expect(hasCellFocusRing).toBe(true)
    // … and the reduced-motion neutralization block (issue 5) both shipped.
    await expect(hasReducedMotion).toBe(true)
  },
}

/**
 * ACCESSIBILITY — the column-actions dialog focus contract + the grid's ARIA
 * child structure. Pins the two defects that, measured downstream in ThothOS,
 * owned 74 % of that app's critical a11y findings (`aria-required-children`
 * x42) and 90 % of its keyboard findings (`dialog-focus-*` x54) from this ONE
 * component.
 *
 * WHY THIS STORY EXISTS ALONGSIDE `AccessibleColumnKeyboard`, which already
 * opens this same menu: that story pins arrow-key roving and asserts focus
 * lands on the first item, so the "focus moved IN" half was covered. The other
 * two thirds of the reported triad — focus TRAPPED while open, focus RESTORED
 * to the trigger on close — were implemented in Popover but pinned NOWHERE, so
 * either could have regressed silently and taken every consumer's keyboard
 * board with it. An implemented-but-unpinned behaviour is one careless edit
 * from being an unimplemented one.
 *
 * The structural half pins the shape of a regression that actually SHIPPED:
 * in the published 0.200.0 the `role="grid"` sat on the outer wrapper `<div>`,
 * which also contains the toolbar, filters and footer. A grid may only own
 * rows, so every consumer page reported `aria-required-children`. The role now
 * lives on the `<table>` that genuinely owns the rows, and this asserts BOTH
 * halves: the table has it, the wrapper must NOT.
 *
 * ⚠️ REQUIRES A VIEWPORT >= 768px, and this is worth knowing before debugging a
 * red here. Below that breakpoint `.desktopView` is `display: none`, so the
 * whole `<table>` — column-actions trigger included — has no layout box:
 * `.focus()` on the trigger silently does nothing, the dialog's
 * previously-focused element is therefore `<body>`, and the focus-restore
 * assertion fails while the component is entirely correct. Measured at 764px
 * this story reports "focus not restored"; at 1440px every assertion passes.
 * A narrow runner viewport is the likeliest cause of a red here, so check that
 * BEFORE concluding the focus contract regressed. (The sibling
 * `AccessibleColumnKeyboard` story has the same dependency.)
 */
export const AccessibleColumnMenuFocusContract: Story = {
  name: 'A11y — Column Menu Focus Contract',
  render: args => (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    dataGrid: 'a11y-column-menu-focus',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    // ── 1. The grid role sits on the element that OWNS rows, not on the
    //       wrapper that also holds toolbar/filter/footer chrome.
    const wrapper = canvasElement.querySelector<HTMLElement>(
      `.${cssStyles.datagrid}`
    )
    if (!wrapper) throw new Error('DataGrid wrapper did not render')
    await expect(wrapper).not.toHaveAttribute('role', 'grid')

    const table = canvasElement.querySelector<HTMLTableElement>(
      'table[role="grid"]'
    )
    if (!table) throw new Error('table[role="grid"] did not render')

    // Every direct child of the grid must be a rowgroup, and every child of a
    // rowgroup a row — the exact chain `aria-required-children` checks.
    //
    // Rows are matched by ACCESSIBILITY ROLE, not by the presence of a role
    // ATTRIBUTE. `<tr>` already has an implicit `row` role and axe honours it,
    // so the header `<tr>` legitimately carries no attribute while the data
    // rows set one explicitly. Asserting the attribute instead of the role
    // reds on correct markup — this assertion was written that way first and
    // failed here against a perfectly valid grid.
    const gridChildren = Array.from(table.children)
    await expect(gridChildren.length).toBeGreaterThan(0)
    for (const child of gridChildren) {
      await expect(child).toHaveAttribute('role', 'rowgroup')
      for (const grandchild of Array.from(child.children)) {
        const isRow =
          grandchild.tagName === 'TR' ||
          grandchild.getAttribute('role') === 'row'
        await expect(isRow).toBe(true)
      }
    }

    // ── 2. Opening the column-actions dialog moves focus INTO it.
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    if (!nameHeader) throw new Error('Name column header did not render')
    const menuTrigger = nameHeader.querySelector<HTMLButtonElement>(
      '[data-action="open-column-menu"]'
    )
    if (!menuTrigger) throw new Error('Column menu trigger did not render')

    await userEvent.click(menuTrigger)
    const menu = await waitFor(() => {
      const el = document.body.querySelector<HTMLElement>(
        '[data-column-menu-for="name"]'
      )
      if (!el) throw new Error('Column menu did not open')
      return el
    })
    // The portalled surface is a named dialog, and focus is inside it.
    const dialog = menu.closest('[role="dialog"]')
    if (!dialog) throw new Error('Column menu is not inside a role="dialog"')
    await expect(dialog).toHaveAttribute('aria-label')
    await waitFor(() =>
      expect(menu.contains(document.activeElement)).toBe(true)
    )

    // ── 3. Focus is TRAPPED: tabbing off the last menu item cycles back into
    //       the dialog instead of escaping to the page behind it.
    const items = Array.from(
      menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    )
    await expect(items.length).toBeGreaterThan(1)
    items[items.length - 1]!.focus()
    await userEvent.tab()
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true)
    )
    // Shift+Tab off the first item must not escape backwards either.
    items[0]!.focus()
    await userEvent.tab({ shift: true })
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true)
    )

    // ── 4. Escape closes the dialog AND returns focus to the trigger, so a
    //       keyboard user is not dropped at the top of the document.
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-column-menu-for="name"]')
      ).toBeNull()
    )
    await waitFor(() => expect(menuTrigger).toHaveFocus())
  },
}

/** Columns with EXPLICIT narrow resize bounds, so the contract story can drive
 *  the range to both ends without a 1200px column reflowing the table. `status`
 *  is deliberately non-resizable: its header must expose NO handle at all. */
const resizeContractColumns: ColumnDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    minWidth: 80,
    maxWidth: 260,
    resizable: true,
  },
  { field: 'age', headerName: 'Age', width: 110, resizable: true },
  { field: 'status', headerName: 'Status', width: 120, resizable: false },
]

const onResizeContractSpy = fn()

/**
 * ACCESSIBILITY — the column-RESIZE handle contract, pinned in BOTH directions.
 *
 * Sibling of `AccessibleColumnMenuFocusContract`, and it exists for the same
 * reason one layer in. That story's fix (moving `role="grid"` onto the element
 * that owns rows) took `aria-required-children` to zero downstream in ThothOS —
 * and the structurally-invalid grid had been MASKING this element: a focusable
 * `role="separator"` published to assistive tech with an `aria-label` but
 * without the attributes its role requires. It surfaced as all 18 of the app's
 * remaining critical `aria-required-attr` findings, one component, desktop only.
 *
 * WHY THE ATTRIBUTES ARE MANDATORY, not decoration: ARIA classes a separator as
 * structure when it is inert and as a RANGE WIDGET the moment it is focusable
 * (axe's `aria-required-attr` encodes exactly that — `isStaticSeparator()`
 * exempts only the non-focusable case). A range widget owes `aria-valuenow`,
 * and owes a real `aria-valuemin`/`aria-valuemax` too, because ARIA's implicit
 * range is 0–100: publish a 200px column's width with no bounds and AT
 * announces "200 out of 100".
 *
 * THE TWO DIRECTIONS, which is the whole point of the story:
 *   1. Keyboard-operable ⇒ fully described. Focusable + named ⇒ it must carry
 *      valuenow/min/max, the value must sit inside the range, and the keys must
 *      genuinely move the width (APG window splitter: Arrows nudge, Home/End
 *      hit the bounds, Enter collapses and restores).
 *   2. Not keyboard-operable ⇒ not in the AT tree. The honest alternative to
 *      building the range out was removing the handle from accessibility
 *      entirely — so any handle that is NOT focusable must also be unnamed and
 *      `aria-hidden`. Advertising a role you do not implement is the defect;
 *      either half alone lets it come back.
 *
 * The assertions re-implement the axe rule locally over EVERY separator in the
 * grid, so a second focusable separator added anywhere in this component is
 * caught here rather than downstream in a consumer's a11y board.
 *
 * ⚠️ Like its siblings this needs a viewport >= 768px — below that `.desktopView`
 * is `display: none`, the handles have no layout box, and `.focus()` silently
 * does nothing. Check the runner viewport before concluding the contract broke.
 */
export const AccessibleResizeHandleContract: Story = {
  name: 'A11y — Resize Handle Contract',
  render: args => (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <DataGrid {...args} />
    </div>
  ),
  args: {
    columns: resizeContractColumns,
    rows: sampleRows,
    dataGrid: 'a11y-resize-contract',
    permissions: { access: 'write' },
    searchbarProps: { value: '', onChange: () => {} },
    styles: { theme: 'light' },
    onCellSave: fn(),
    onColumnResize: onResizeContractSpy,
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const numericAttr = (el: Element, attr: string): number => {
      const raw = el.getAttribute(attr)
      if (raw === null) throw new Error(`${attr} is missing from ${el.tagName}`)
      const value = Number(raw)
      if (Number.isNaN(value))
        throw new Error(`${attr}="${raw}" is not a number`)
      return value
    }

    // ── DIRECTION 2 (checked FIRST, over every separator in the grid): the
    //    axe rule itself — a separator exposed to AT while focusable must
    //    carry aria-valuenow; one that is not focusable must not be named.
    const separators = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[role="separator"]')
    )
    await expect(separators.length).toBeGreaterThan(0)
    for (const separator of separators) {
      const focusable =
        separator.tabIndex >= 0 &&
        separator.getAttribute('aria-hidden') !== 'true'
      const named = Boolean(separator.getAttribute('aria-label')?.trim())
      if (focusable) {
        // Operable ⇒ it owes the range widget's required attribute.
        await expect(separator).toHaveAttribute('aria-valuenow')
        await expect(named).toBe(true)
      } else {
        // Inert ⇒ it must not advertise itself to AT at all.
        await expect(named).toBe(false)
      }
    }

    // A column that opted OUT of resizing exposes no handle whatsoever — the
    // honest way to have no keyboard resize, and the reason direction 2 above
    // has no "named but inert" instance to trip over.
    const statusHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="status"]'
    )
    if (!statusHeader) throw new Error('Status column header did not render')
    await expect(
      statusHeader.querySelector('[data-action="resize-handle"]')
    ).toBeNull()

    // ── DIRECTION 1: the resizable column's handle is a fully described,
    //    genuinely operable window splitter.
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="name"]'
    )
    if (!nameHeader) throw new Error('Name column header did not render')
    const handle = nameHeader.querySelector<HTMLElement>(
      '[data-action="resize-handle"]'
    )
    if (!handle) throw new Error('Resize handle did not render')

    await expect(handle).toHaveAttribute('role', 'separator')
    await expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    await expect(handle).toHaveAttribute('aria-label', 'Resize Name column')
    await expect(handle.tabIndex).toBe(0)

    // The published range matches the column's declared bounds, and the
    // current value sits inside it (an implicit 0–100 range would not).
    const min = numericAttr(handle, 'aria-valuemin')
    const max = numericAttr(handle, 'aria-valuemax')
    await expect(min).toBe(80)
    await expect(max).toBe(260)
    const startValue = numericAttr(handle, 'aria-valuenow')
    await expect(startValue).toBe(150)
    await expect(startValue).toBeGreaterThanOrEqual(min)
    await expect(startValue).toBeLessThanOrEqual(max)
    await expect(handle).toHaveAttribute('aria-valuetext', '150 pixels')

    // The splitter names what it resizes, and that idref resolves to THIS
    // column's header cell (a dangling aria-controls is its own a11y finding).
    const controls = handle.getAttribute('aria-controls')
    if (!controls) throw new Error('aria-controls is missing from the handle')
    await expect(document.getElementById(controls)).toBe(nameHeader)

    // ── The keys actually move the width, and the exposure tracks it.
    handle.focus()
    await expect(handle).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(numericAttr(handle, 'aria-valuenow')).toBe(startValue + 10)
    )
    await waitFor(() => expect(onResizeContractSpy).toHaveBeenCalled())
    await expect(onResizeContractSpy.mock.calls.at(-1)).toEqual([
      'name',
      startValue + 10,
    ])
    await expect(handle).toHaveAttribute(
      'aria-valuetext',
      `${startValue + 10} pixels`
    )

    // Shift makes the step 50px, from the 10px-wider width the Arrow left above.
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    await waitFor(() =>
      expect(numericAttr(handle, 'aria-valuenow')).toBe(startValue + 10 - 50)
    )

    // Home / End hit the published bounds exactly — the announced range is the
    // reachable range, not an aspiration.
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(numericAttr(handle, 'aria-valuenow')).toBe(max))
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(numericAttr(handle, 'aria-valuenow')).toBe(max))

    await userEvent.keyboard('{Home}')
    await waitFor(() => expect(numericAttr(handle, 'aria-valuenow')).toBe(min))
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    await waitFor(() => expect(numericAttr(handle, 'aria-valuenow')).toBe(min))

    // Enter cycles collapse ⇄ restore (APG). From the minimum, the first Enter
    // restores the width the previous collapse captured.
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(numericAttr(handle, 'aria-valuenow')).toBe(min + 10)
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(numericAttr(handle, 'aria-valuenow')).toBe(min))
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(numericAttr(handle, 'aria-valuenow')).toBe(min + 10)
    )

    // ── A column that declares no bounds still publishes a real range (the
    //    library defaults), so no consumer can produce an undescribed handle
    //    just by omitting minWidth/maxWidth.
    const ageHandle = canvasElement.querySelector<HTMLElement>(
      'th[data-column-header="age"] [data-action="resize-handle"]'
    )
    if (!ageHandle) throw new Error('Age resize handle did not render')
    await expect(numericAttr(ageHandle, 'aria-valuemin')).toBe(50)
    await expect(numericAttr(ageHandle, 'aria-valuemax')).toBe(1200)
    await expect(numericAttr(ageHandle, 'aria-valuenow')).toBe(110)
  },
}

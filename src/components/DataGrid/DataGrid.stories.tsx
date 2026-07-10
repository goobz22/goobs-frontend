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

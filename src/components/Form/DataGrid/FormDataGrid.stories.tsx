/**
 * @fileoverview Storybook stories for FormDataGrid — the styled shell that
 * frames a full DataGrid with a form-style header (title + description +
 * sacred-only shimmer) and an optional Alert slot between header and grid.
 * The component's own header calls it "the primary way to use DataGrid in
 * ThothOS": it maps the boolean `sacredtheme` prop onto the canonical
 * 'sacred' | 'light' theme and propagates it to both the DataGrid and the
 * Alert. NOTE: despite living under Form/, FormDataGrid does NOT consume the
 * zod Form context — it is a standalone wrapper, so no <Form> harness is
 * required. These stories are the FormDataGrid regression spec — goobs has
 * no unit tests.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, fn, userEvent, waitFor } from 'storybook/test'
import FormDataGrid from './index'
import type {
  ColumnDef,
  RowData,
  MetricCardData,
  DataGridFilter,
} from '../../DataGrid/types'

// NOTE: the meta is declared BEFORE the sample data on purpose — the
// story-coverage lint extracts the first `title:` literal in the file as the
// meta title, and the sample rows/metrics below carry their own `title` keys.
const meta: Meta<typeof FormDataGrid> = {
  title: 'Components/Form/DataGrid',
  component: FormDataGrid,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sacredtheme: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof FormDataGrid>

// --------------------------------------------------------------------------
// SAMPLE DATA — a realistic ThothOS-style employee directory
// --------------------------------------------------------------------------

const employeeColumns: ColumnDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 170,
    creationField: {
      type: 'text',
      required: true,
      placeholder: 'Enter full name',
    },
  },
  {
    field: 'email',
    headerName: 'Email Address',
    width: 220,
    creationField: {
      type: 'text',
      required: true,
      placeholder: 'user@company.com',
    },
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 150,
    type: 'dropdown',
    dropdownOptions: [
      { value: 'Engineering' },
      { value: 'Sales' },
      { value: 'Support' },
      { value: 'Finance' },
    ],
    creationField: {
      type: 'searchableDropdown',
      required: true,
      placeholder: 'Select department',
      options: [
        { value: 'Engineering' },
        { value: 'Sales' },
        { value: 'Support' },
        { value: 'Finance' },
      ],
    },
  },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'currency',
    width: 130,
    creationField: {
      type: 'usd',
      required: true,
      placeholder: 'Enter salary',
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    type: 'dropdown',
    dropdownOptions: [
      { value: 'Active' },
      { value: 'On Leave' },
      { value: 'Remote' },
    ],
  },
]

const employeeRows: RowData[] = [
  {
    _id: 'emp-1',
    name: 'Alice Nguyen',
    email: 'alice.nguyen@company.com',
    department: 'Engineering',
    salary: 98000,
    status: 'Active',
  },
  {
    _id: 'emp-2',
    name: 'Marcus Webb',
    email: 'marcus.webb@company.com',
    department: 'Sales',
    salary: 72000,
    status: 'Remote',
  },
  {
    _id: 'emp-3',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    department: 'Support',
    salary: 61000,
    status: 'Active',
  },
  {
    _id: 'emp-4',
    name: 'Diego Alvarez',
    email: 'diego.alvarez@company.com',
    department: 'Finance',
    salary: 84500,
    status: 'On Leave',
  },
]

const employeeMetrics: MetricCardData[] = [
  { title: 'Total Employees', value: 4, subtitle: 'Across 4 departments' },
  { title: 'Active', value: 2, trend: { value: 12.5, isPositive: true } },
  { title: 'Average Salary', value: '$78,875' },
]

const departmentFilter: DataGridFilter = {
  label: 'Department',
  value: 'all',
  options: [
    { value: 'all' },
    { value: 'Engineering' },
    { value: 'Sales' },
    { value: 'Support' },
    { value: 'Finance' },
  ],
  onChange: fn(),
  type: 'dropdown',
}

/**
 * Sacred default: `data-theme="sacred"` shell with the gold serif title, the
 * description subheading, the sacred-only shimmer bar, and the full DataGrid
 * (metrics + filter + rows) rendered below in write mode.
 */
export const Sacred: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  args: {
    title: 'Employee Directory',
    description: 'Manage all employee records for your company',
    sacredtheme: true,
    datagrid: {
      columns: employeeColumns,
      rows: employeeRows,
      permissions: { access: 'write' },
      metrics: employeeMetrics,
      filters: [departmentFilter],
      onManage: fn(),
      onDelete: fn(),
      onRowCreation: fn(),
      onCellSave: fn(),
      // NOTE: no `styles` here on purpose — FormDataGrid owns theme
      // propagation and passes its own `styles={{ theme }}` to the DataGrid
      // (any caller-supplied datagrid.styles is overridden).
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Employee Directory')).toBeVisible()
    await expect(
      canvas.getByText('Manage all employee records for your company')
    ).toBeVisible()
    // The grid renders the row data below the header. DataGrid keeps BOTH the
    // desktop table and the MobileCardView in the DOM (CSS media queries hide
    // one), so the same cell text legitimately appears twice.
    const rowCells = await canvas.findAllByText('Alice Nguyen')
    await expect(rowCells.length).toBeGreaterThan(0)
  },
}

/**
 * Light theme (`sacredtheme={false}`): `data-theme="light"` shell — dark
 * heading text on the white surface, NO shimmer bar, and the light-theme
 * DataGrid below.
 */
export const Light: Story = {
  globals: { backgrounds: { value: 'light' } },
  args: {
    title: 'Employee Directory',
    description: 'Manage all employee records for your company',
    sacredtheme: false,
    datagrid: {
      columns: employeeColumns,
      rows: employeeRows,
      permissions: { access: 'write' },
      metrics: employeeMetrics,
      onManage: fn(),
      onDelete: fn(),
      onRowCreation: fn(),
    },
  },
}

/**
 * Info alert slot: the optional Alert renders BETWEEN the header and the
 * grid, themed sacred to match the shell, with no close button (no onClose).
 */
export const SacredWithInfoAlert: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  args: {
    title: 'Employee Directory',
    description: 'Manage all employee records for your company',
    sacredtheme: true,
    alert: {
      severity: 'info',
      message: 'Select a row, then use the toolbar to edit or delete it',
    },
    datagrid: {
      columns: employeeColumns,
      rows: employeeRows,
      permissions: { access: 'write' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Select a row, then use the toolbar to edit or delete it'
      )
    ).toBeVisible()
    // No onClose was passed, so the Alert renders WITHOUT a close button.
    await expect(
      canvas.queryByRole('button', { name: '✕' })
    ).not.toBeInTheDocument()
  },
}

/**
 * Dismissible error alert: passing `onClose` renders the ✕ close button;
 * clicking it fires the callback after the Alert's 200ms fade-out.
 */
export const DismissibleErrorAlert: Story = {
  globals: { backgrounds: { value: 'light' } },
  args: {
    title: 'Employee Directory',
    description: 'Manage all employee records for your company',
    sacredtheme: false,
    alert: {
      severity: 'error',
      message: 'Failed to sync 1 employee record — retry or dismiss',
      onClose: fn(),
    },
    datagrid: {
      columns: employeeColumns,
      rows: employeeRows,
      permissions: { access: 'write' },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Failed to sync 1 employee record — retry or dismiss'
      )
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: '✕' }))
    // The Alert defers onClose by 200ms (fade-out) before invoking it.
    await waitFor(() => expect(args.alert?.onClose).toHaveBeenCalled())
  },
}

/**
 * Read-only permissions: the grid renders the same header + rows but with
 * `access: 'read'` — no Add/Edit/Delete toolbar actions and no inline
 * editing, pinning the view-only presentation of the wrapper.
 */
export const ReadOnly: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  args: {
    title: 'Payroll Snapshot',
    description: 'A read-only view of current employee compensation',
    sacredtheme: true,
    datagrid: {
      columns: employeeColumns,
      rows: employeeRows,
      permissions: { access: 'read' },
    },
  },
}

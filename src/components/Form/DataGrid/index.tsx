/**
 * =============================================================================
 * FORM DATAGRID COMPONENT
 * =============================================================================
 *
 * A styled wrapper component that combines a DataGrid with a form-like header
 * containing title, description, and optional alert messages.
 *
 * COMPONENT HIERARCHY:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  FormDataGrid (this component)                                           │
 * │  ├── Title Container                                                     │
 * │  │   ├── Title (styled heading)                                         │
 * │  │   ├── Description (styled subheading)                                │
 * │  │   └── Shimmer Effect (sacred theme only)                             │
 * │  ├── Alert (optional - error/warning/info/success messages)             │
 * │  └── DataGrid (full-featured data table from goobs-frontend)            │
 * │      ├── MetricSection (KPI cards)                                       │
 * │      ├── FilterSection (search & filters)                                │
 * │      ├── Toolbar (action buttons)                                        │
 * │      ├── Table (rows, columns, inline editing)                           │
 * │      └── Footer (pagination, status)                                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PURPOSE:
 * - Provides consistent styling for DataGrid instances across the application
 * - Adds contextual title and description above the grid
 * - Supports alert messages for user feedback (errors, warnings, etc.)
 * - Handles theme propagation (sacred/light) to all child components
 *
 * THEMING:
 * - Sacred Theme (default): Dark background with gold accents, blur effects,
 *   animated glow pulse, Cinzel/Crimson Text fonts
 * - Light Theme: White/light gray background, standard fonts, no animations
 *
 * USAGE IN THOTHOS:
 * ```tsx
 * import FormDataGrid from 'goobs-frontend/components/Form/DataGrid'
 *
 * <FormDataGrid
 *   title="Employee Directory"
 *   description="Manage all employee records"
 *   sacredtheme={true}
 *   alert={{ severity: 'info', message: 'Click a row to edit' }}
 *   datagrid={{
 *     columns: [...],
 *     rows: [...],
 *     onRowsChange: handleRowsChange,
 *     // ... other DataGrid props
 *   }}
 * />
 * ```
 *
 * DATAGRIDS PROP PASSTHROUGH:
 * All properties in the `datagrid` prop are passed directly to the underlying
 * DataGrid component. See DataGrid types for full documentation:
 * - columns: ColumnDef[] - Column definitions with field, headerName, type, etc.
 * - rows: RowData[] - Array of data objects with an 'id' field
 * - onRowsChange: Callback when rows are modified
 * - onRowCreated: Callback when new row is created
 * - metrics: MetricCardData[] - KPI cards above the table
 * - filters: DataGridFilter[] - Additional filter controls
 * - buttons: ButtonProps[] - Custom toolbar buttons
 * - permissions: { access: 'read' | 'write' | 'no-access' }
 * - pagination: { pageSize, pageSizeOptions }
 * - ... and many more (see DatagridProps interface)
 *
 * =============================================================================
 */

'use client'

import { useMemo, type ElementType } from 'react'
import type { DatagridProps, RowData } from '../../DataGrid/types'
import DataGrid from '../../DataGrid'
import Alert, { AlertProps } from '../../Alert'
import cssStyles from './FormDataGrid.module.css'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the FormDataGrid wrapper component.
 *
 * @property title - Main heading displayed above the DataGrid
 * @property description - Subheading/explanatory text below the title
 * @property datagrid - Full DataGrid configuration (columns, rows, handlers, etc.)
 * @property sacredtheme - Use sacred (dark/gold) theme. Default: true
 * @property alert - Optional alert message to display between header and grid
 */
export interface FormDataGridProps<TRow extends RowData = RowData> {
  /** Main heading displayed above the DataGrid */
  title: string
  /**
   * Semantic level for the `title` heading — the title renders as a real
   * `<h1>`–`<h6>` element (not a styled `<div>`) so screen-reader users can
   * jump to it by heading navigation and crawlers see a genuine heading. Set
   * this to match the wrapper's position in the surrounding document outline
   * (e.g. `3` when the grid sits inside an `<h2>` section). Default `2`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Subheading/explanatory text below the title */
  description: string
  /**
   * Full DataGrid configuration object.
   * All properties are passed directly to the underlying DataGrid component.
   * @see DatagridProps for complete property documentation
   */
  datagrid: DatagridProps<TRow>
  /**
   * @deprecated Use the `styles.theme` union (`'sacred' | 'light' | 'dark'`),
   * the house convention emitted as `data-theme`. This boolean only maps to
   * `'sacred'` (true, the default) or `'light'` (false) and cannot express the
   * `dark` palette. Still honored: it is mapped to the theme string internally.
   * - true (default): Dark background, gold accents, animated effects
   * - false: Light/white theme with standard styling
   */
  sacredtheme?: boolean
  /**
   * Optional alert message displayed between header and grid.
   * Useful for displaying errors, warnings, or informational messages.
   * @property severity - 'error' | 'warning' | 'info' | 'success'
   * @property message - Text content of the alert
   * @property onClose - Optional callback to make alert dismissible
   */
  alert?: AlertProps
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * FORM DATAGRID COMPONENT
 * -----------------------
 * Renders a styled DataGrid with header (title + description) and optional alert.
 *
 * This component serves as the primary way to use DataGrid in ThothOS,
 * providing consistent styling and theme propagation across all instances.
 *
 * KEY RESPONSIBILITIES:
 * 1. Display title and description with theme-appropriate styling
 * 2. Show optional alert messages for user feedback
 * 3. Wrap DataGrid and pass through all configuration
 * 4. Propagate theme settings to DataGrid and Alert components
 *
 * @example Basic usage with sacred theme:
 * ```tsx
 * <FormDataGrid
 *   title="Employees"
 *   description="Manage employee records"
 *   datagrid={{ columns, rows, onRowsChange }}
 * />
 * ```
 *
 * @example With alert and light theme:
 * ```tsx
 * <FormDataGrid
 *   title="Reports"
 *   description="View and export reports"
 *   sacredtheme={false}
 *   alert={{ severity: 'error', message: 'Failed to load data' }}
 *   datagrid={{ columns, rows }}
 * />
 * ```
 */
function FormDataGrid<TRow extends RowData = RowData>({
  title,
  headingLevel = 2,
  description,
  datagrid,
  sacredtheme = true,
  alert,
}: FormDataGridProps<TRow>) {
  // Theme variant as a data-attribute, mirroring the goobs Card/DataGrid house
  // pattern. The boolean `sacredtheme` maps to the canonical 'sacred' | 'light'.
  const theme: 'sacred' | 'light' = sacredtheme ? 'sacred' : 'light'

  // The title is the section heading — render it as a genuine `<h1>`–`<h6>`
  // (never a styled <div>) so it is reachable by heading navigation and is a
  // real heading in the SSR'd/crawled HTML. `.title` resets the default heading
  // margin, so the visual output is unchanged.
  const HeadingTag = `h${headingLevel}` as ElementType

  /**
   * Memoized DataGrid styles to prevent unnecessary re-renders.
   * Converts boolean sacredtheme to DataGrid's theme string format.
   */
  const dataGridStyles = useMemo(() => ({ theme }), [theme])

  /**
   * Memoized Alert styles for theme consistency.
   */
  const alertStyles = useMemo(() => ({ theme }), [theme])

  return (
    <div className={cssStyles.container} data-theme={theme}>
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER SECTION
          Contains title, description, and optional shimmer effect (sacred theme)
          ───────────────────────────────────────────────────────────────────── */}
      <div className={cssStyles.titleContainer} data-theme={theme}>
        <HeadingTag className={cssStyles.title} data-theme={theme}>
          {title}
        </HeadingTag>
        <p className={cssStyles.description} data-theme={theme}>
          {description}
        </p>
        {sacredtheme && <div className={cssStyles.shimmer} aria-hidden="true" />}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ALERT SECTION (Optional)
          Displays error/warning/info/success messages between header and grid
          ───────────────────────────────────────────────────────────────────── */}
      {alert && (
        <div className={cssStyles.alertContainer}>
          {(() => {
            // Build alert props, conditionally including onClose if provided
            const baseProps: AlertProps = {
              severity: alert.severity,
              message: alert.message,
              styles: alertStyles,
            }
            return alert.onClose ? (
              <Alert {...baseProps} onClose={alert.onClose} />
            ) : (
              <Alert {...baseProps} />
            )
          })()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          DATAGRID SECTION
          Full-featured data table with all configuration passed through
          See DatagridProps for complete documentation of available options
          ───────────────────────────────────────────────────────────────────── */}
      <div className={cssStyles.dataGridContainer} data-theme={theme}>
        <DataGrid {...datagrid} styles={dataGridStyles} />
      </div>
    </div>
  )
}

export default FormDataGrid

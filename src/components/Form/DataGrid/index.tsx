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

import React, { useMemo } from 'react'
import type { DatagridProps } from '../../DataGrid/types'
import DataGrid from '../../DataGrid'
import Alert, { AlertProps } from '../../Alert'

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
export interface FormDataGridProps {
  /** Main heading displayed above the DataGrid */
  title: string
  /** Subheading/explanatory text below the title */
  description: string
  /**
   * Full DataGrid configuration object.
   * All properties are passed directly to the underlying DataGrid component.
   * @see DatagridProps for complete property documentation
   */
  datagrid: DatagridProps
  /**
   * Use sacred (dark/gold) theme styling.
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
// STYLE GENERATOR
// =============================================================================

/**
 * Generates all styles for the FormDataGrid component.
 * Styles are theme-aware and change based on sacredtheme parameter.
 *
 * SACRED THEME FEATURES:
 * - Dark translucent background with blur
 * - Gold (#FFD700) accent colors
 * - Animated glow pulse on container
 * - Cinzel font for titles, Crimson Text for body
 * - Decorative shimmer effect under title
 *
 * LIGHT THEME FEATURES:
 * - Clean white/light backgrounds
 * - Standard Merriweather font
 * - No animations
 *
 * @param sacredtheme - Whether to use sacred (dark/gold) theme
 * @returns Object containing all component styles
 */
const getStyles = (sacredtheme?: boolean) => ({
  /**
   * Main container style.
   * Sacred theme adds: dark background, blur, gold border, glow animation
   */
  container: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
    ...(sacredtheme && {
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      animation: 'form-datagrid-glow-pulse 2s infinite alternate',
    }),
  } as React.CSSProperties,

  /**
   * Floating glyph style for decorative elements.
   * Only used in sacred theme for mystical aesthetic.
   */
  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '1.125rem',
    zIndex: 10,
    animation: 'form-datagrid-float 8s infinite alternate',
  } as React.CSSProperties,

  /**
   * Header glyph container for decorative symbols.
   */
  headerGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.375rem',
    marginBottom: '0.25rem',
  } as React.CSSProperties,

  /**
   * Title container with centered layout.
   * Sacred theme adds: centered text, gold bottom border
   */
  titleContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.75rem',
    padding: '0 0.5rem',
    boxSizing: 'border-box',
    ...(sacredtheme && {
      textAlign: 'center',
      borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
      paddingBottom: '0.75rem',
    }),
  } as React.CSSProperties,

  /**
   * Main title style with responsive font sizing.
   * Sacred theme: Cinzel font, gold color, text shadow
   * Light theme: Merriweather font, black color
   */
  title: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
    fontWeight: 700,
    color: 'black',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      color: '#FFD700',
      textAlign: 'center',
      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      letterSpacing: '0.05em',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      marginBottom: '0.5rem',
    }),
  } as React.CSSProperties,

  /**
   * Description/subtitle style with responsive sizing.
   * Sacred theme: Crimson Text font, white color, centered
   * Light theme: Merriweather font, black color, left-aligned
   */
  description: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Merriweather, serif',
    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
    fontWeight: 400,
    color: 'black',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    ...(sacredtheme && {
      fontFamily: 'Crimson Text, serif',
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
    }),
  } as React.CSSProperties,

  /**
   * Animated shimmer line under the title (sacred theme only).
   * Creates a flowing gold light effect.
   */
  shimmer: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '2px',
    overflow: 'hidden',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
      animation: 'form-datagrid-data-flow 3s infinite',
    },
  } as React.CSSProperties,

  /**
   * Container for alert messages.
   * Provides consistent spacing above the DataGrid.
   */
  alertContainer: {
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  /**
   * Container wrapping the DataGrid component.
   * Sacred theme adds dark semi-transparent background.
   */
  dataGridContainer: {
    ...(sacredtheme && {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.5)',
      boxSizing: 'border-box',
    }),
  } as React.CSSProperties,

  /**
   * Footer glyph container for decorative elements.
   */
  footerGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.125rem',
    marginTop: '0.5rem',
    opacity: 0.5,
  } as React.CSSProperties,

  /**
   * Individual footer glyph style.
   */
  footerGlyph: {
    color: '#FFD700',
    fontSize: '0.75rem',
    animation: 'form-datagrid-float 3s infinite alternate',
  } as React.CSSProperties,
})

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
function FormDataGrid({
  title,
  description,
  datagrid,
  sacredtheme = true,
  alert,
}: FormDataGridProps) {
  // Generate theme-aware styles
  const styles = getStyles(sacredtheme)

  /**
   * Memoized DataGrid styles to prevent unnecessary re-renders.
   * Converts boolean sacredtheme to DataGrid's theme string format.
   */
  const dataGridStyles = useMemo(
    () => ({
      theme: sacredtheme ? 'sacred' : ('light' as 'sacred' | 'light'),
    }),
    [sacredtheme]
  )

  /**
   * Memoized Alert styles for theme consistency.
   */
  const alertStyles = useMemo(
    () => ({
      theme: sacredtheme ? 'sacred' : ('light' as 'sacred' | 'light'),
    }),
    [sacredtheme]
  )

  return (
    <div style={styles.container}>
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER SECTION
          Contains title, description, and optional shimmer effect (sacred theme)
          ───────────────────────────────────────────────────────────────────── */}
      <div style={{ ...styles.titleContainer, position: 'relative' }}>
        <div style={styles.title}>{title}</div>
        <div style={styles.description}>{description}</div>
        {sacredtheme && <div style={styles.shimmer} />}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ALERT SECTION (Optional)
          Displays error/warning/info/success messages between header and grid
          ───────────────────────────────────────────────────────────────────── */}
      {alert && (
        <div style={styles.alertContainer}>
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
      <div style={styles.dataGridContainer}>
        <DataGrid {...datagrid} styles={dataGridStyles} />
      </div>
    </div>
  )
}

export default FormDataGrid

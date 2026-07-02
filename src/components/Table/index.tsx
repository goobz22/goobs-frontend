'use client'

import React, { type CSSProperties } from 'react'
import cssStyles from './Table.module.css'

/**
 * Public theming + per-caller override surface. Self-contained local
 * interface (identical shape to the legacy `TableStyles` from src/theme/table.ts
 * that callers relied on) — the global theme system is being torn down and the
 * Table no longer imports from it.
 */
export interface TableStyles {
  theme?: 'sacred' | 'light' | 'dark'
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  width?: string
  maxWidth?: string
  color?: string
  headerBackgroundColor?: string
  headerColor?: string
  fontFamily?: string
  cellBorderColor?: string
}

type CSSVarStyle = CSSProperties & Record<`--${string}`, string>

/** Resolve the active theme name, defaulting to sacred (the hardcoded base). */
const resolveTheme = (styles?: TableStyles): 'sacred' | 'light' | 'dark' =>
  styles?.theme ?? 'sacred'

/**
 * `data-theme` for the SUBCOMPONENTS (head/row/cell). Unlike the container,
 * these emit the attribute ONLY when the caller explicitly themed THIS element.
 * When omitted, the attribute is absent so the element inherits the container's
 * theme via the `.container[data-theme=…] .head/.cell/.row` cascade in the CSS
 * module. The previous `?? 'sacred'` default stamped data-theme='sacred' on every
 * unthemed leaf, pinning them to the gold sacred palette even inside a light
 * container — that is why components-table--light showed gold text on cream when
 * the Light story themed only the container + table, not each cell. */
const subThemeAttr = (
  styles?: TableStyles
): { 'data-theme': 'sacred' | 'light' | 'dark' } | undefined =>
  styles?.theme ? { 'data-theme': styles.theme } : undefined

/*
 * The helpers below build the CSS-custom-property override object for a
 * styled element. Each scalar override (when supplied) maps to the `var(--…)`
 * hook the CSS module reads, so an override wins over the theme default
 * without inline-styling the whole element. Omitted overrides leave the var
 * unset → CSS fallback applies.
 */

/**
 * Overrides that target DESCENDANT elements (head / cells). CSS custom
 * properties inherit down the DOM, so setting these once on a wrapper
 * (TableContainer or Table) reaches every head/cell `var(--…)` lookup unless
 * a closer element re-sets the same var (its own inline value wins).
 */
const descendantVars = (styles?: TableStyles): CSSVarStyle => {
  const vars: CSSVarStyle = {}
  if (styles?.headerBackgroundColor)
    vars['--table-header-bg'] = styles.headerBackgroundColor
  if (styles?.headerColor) vars['--table-header-color'] = styles.headerColor
  if (styles?.fontFamily) vars['--table-font-family'] = styles.fontFamily
  if (styles?.color) vars['--table-cell-color'] = styles.color
  if (styles?.cellBorderColor)
    vars['--table-cell-border'] = styles.cellBorderColor
  return vars
}

const containerVars = (styles?: TableStyles): CSSVarStyle | undefined => {
  const vars: CSSVarStyle = descendantVars(styles)
  if (styles?.backgroundColor)
    vars['--table-container-bg'] = styles.backgroundColor
  if (styles?.borderColor) vars['--table-container-border'] = styles.borderColor
  if (styles?.borderRadius)
    vars['--table-container-radius'] = styles.borderRadius
  if (styles?.width) vars['--table-container-width'] = styles.width
  if (styles?.maxWidth) vars['--table-container-max-width'] = styles.maxWidth
  return Object.keys(vars).length > 0 ? vars : undefined
}

const tableVars = (styles?: TableStyles): CSSVarStyle | undefined => {
  const vars: CSSVarStyle = descendantVars(styles)
  if (styles?.backgroundColor) vars['--table-bg'] = styles.backgroundColor
  return Object.keys(vars).length > 0 ? vars : undefined
}

const headerVars = (styles?: TableStyles): CSSVarStyle | undefined => {
  const vars: CSSVarStyle = {}
  if (styles?.headerBackgroundColor)
    vars['--table-header-bg'] = styles.headerBackgroundColor
  if (styles?.headerColor) vars['--table-header-color'] = styles.headerColor
  if (styles?.fontFamily) vars['--table-font-family'] = styles.fontFamily
  return Object.keys(vars).length > 0 ? vars : undefined
}

const cellVars = (styles?: TableStyles): CSSVarStyle | undefined => {
  const vars: CSSVarStyle = {}
  if (styles?.color) vars['--table-cell-color'] = styles.color
  if (styles?.fontFamily) vars['--table-font-family'] = styles.fontFamily
  if (styles?.cellBorderColor)
    vars['--table-cell-border'] = styles.cellBorderColor
  // Header-cell overrides (legacy spread `header` over the cell when isHeader).
  if (styles?.headerBackgroundColor)
    vars['--table-header-bg'] = styles.headerBackgroundColor
  if (styles?.headerColor) vars['--table-header-color'] = styles.headerColor
  return Object.keys(vars).length > 0 ? vars : undefined
}

export interface SimpleTableProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableContainerProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableHeadProps {
  children: React.ReactNode
  styles?: TableStyles
}

export interface TableBodyProps {
  children: React.ReactNode
}

export interface TableRowProps {
  children: React.ReactNode
  hover?: boolean
  styles?: TableStyles
}

export interface TableCellProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  styles?: TableStyles
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  styles,
}) => {
  const overrides = containerVars(styles)
  return (
    <div
      className={cssStyles.container}
      data-theme={resolveTheme(styles)}
      {...(overrides && { style: overrides })}
    >
      {children}
    </div>
  )
}

/**
 * Semantic table primitive rendering a `<table>`, composed with the exported
 * `TableContainer`, `TableHead`, `TableBody`, `TableRow`, and `TableCell`
 * parts. `styles.theme` stamps `data-theme` on the `<table>` so unthemed
 * head/row/cell descendants cascade to that palette (same mechanism as
 * `TableContainer`); scalar overrides (`backgroundColor` → the table surface,
 * plus the header/cell/font vars, which inherit to descendants) map to the
 * CSS-variable hooks the module reads. When container and table declare
 * DIFFERENT themes, the innermost explicit `data-theme` on a leaf wins;
 * between the two cascades, dark outranks light (rule order) — theme them
 * consistently.
 */
export const Table: React.FC<SimpleTableProps> = ({ children, styles }) => {
  const overrides = tableVars(styles)
  return (
    <table
      className={cssStyles.table}
      data-component="Table"
      {...subThemeAttr(styles)}
      {...(overrides && { style: overrides })}
    >
      {children}
    </table>
  )
}

export const TableHead: React.FC<TableHeadProps> = ({ children, styles }) => {
  const overrides = headerVars(styles)
  return (
    <thead
      className={cssStyles.head}
      {...subThemeAttr(styles)}
      {...(overrides && { style: overrides })}
    >
      {children}
    </thead>
  )
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={cssStyles.table}>{children}</tbody>
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  hover = false,
  styles,
}) => {
  return (
    <tr
      className={cssStyles.row}
      {...subThemeAttr(styles)}
      data-hover={hover ? 'true' : 'false'}
    >
      {children}
    </tr>
  )
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  styles,
}) => {
  const isHeader =
    React.isValidElement(children) &&
    (children as React.ReactElement).type === 'th'

  const overrides = cellVars(styles)

  return (
    <td
      className={cssStyles.cell}
      {...subThemeAttr(styles)}
      {...(isHeader && { 'data-header-cell': 'true' })}
      style={{ textAlign: align, ...(overrides ?? {}) }}
    >
      {children}
    </td>
  )
}

export default Table

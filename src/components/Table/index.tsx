'use client'

import React, { type CSSProperties } from 'react'
import cssStyles from './Table.module.css'

/**
 * Shared styling surface for every Table part. `theme` picks the palette; each
 * scalar override maps to a `--table-*` CSS custom property that
 * Table.module.css reads, so a supplied value beats the theme default and an
 * omitted one falls back to it. The vars inherit down the DOM: set once on
 * `TableContainer` (or `Table`) they reach every head/cell lookup unless a
 * closer part re-sets the same var. Each part reads only the keys noted on
 * its members.
 */
export interface TableStyles {
  /**
   * Palette: 'sacred' (default), 'light', or 'dark'. TableContainer always
   * stamps its `data-theme`; the other parts stamp it only when explicitly
   * themed, otherwise they inherit the container's cascade.
   */
  theme?: 'sacred' | 'light' | 'dark'
  /**
   * Surface color: the wrapper background on TableContainer, the `<table>`
   * background on Table; not read by head/row/cell.
   */
  backgroundColor?: string
  /** Container border color (read by TableContainer only). */
  borderColor?: string
  /** Container corner radius (read by TableContainer only). */
  borderRadius?: string
  /** Container width (read by TableContainer only). */
  width?: string
  /** Container max-width (read by TableContainer only). */
  maxWidth?: string
  /** Body-cell text color; inherits to cells when set on TableContainer or Table. */
  color?: string
  /**
   * Header background; applies via TableHead or a header cell, and inherits
   * down when set on TableContainer or Table.
   */
  headerBackgroundColor?: string
  /** Header text color; same read points and inheritance as headerBackgroundColor. */
  headerColor?: string
  /** Font family for header and cells; inherits down from any wrapper part. */
  fontFamily?: string
  /** Cell border color; read by TableCell, inheriting from TableContainer/Table. */
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

/** Props for the `Table` part (the `<table>` element). */
export interface SimpleTableProps {
  children: React.ReactNode
  /**
   * Shared styling surface. On this part, `theme` stamps `data-theme` on the
   * `<table>` (cascading to unthemed descendants) and `backgroundColor`
   * paints the table surface; the header/cell/font keys inherit down to
   * head and cells. See TableStyles for per-key read points.
   */
  styles?: TableStyles
}

/** Props for the `TableContainer` wrapper around a `Table`. */
export interface TableContainerProps {
  children: React.ReactNode
  /**
   * Shared styling surface. The container reads `theme` (always stamped,
   * sacred default), `backgroundColor`, `borderColor`, `borderRadius`,
   * `width`, and `maxWidth`; the header/cell/font keys set here inherit
   * down to every part inside. See TableStyles for per-key read points.
   */
  styles?: TableStyles
}

/** Props for the `TableHead` part (the `<thead>` element). */
export interface TableHeadProps {
  children: React.ReactNode
  /**
   * Shared styling surface. The head reads `headerBackgroundColor`,
   * `headerColor`, and `fontFamily`; `theme` stamps `data-theme` only when
   * set here (otherwise the container's cascade applies).
   */
  styles?: TableStyles
}

/** Props for the `TableBody` part (the `<tbody>` element) — rows only, no styling surface of its own. */
export interface TableBodyProps {
  children: React.ReactNode
}

/** Props for the `TableRow` part (the `<tr>` element). */
export interface TableRowProps {
  children: React.ReactNode
  /** Enables the row hover highlight (emitted as `data-hover="true"`). Default false. */
  hover?: boolean
  /**
   * Shared styling surface. A row has no scalar hooks of its own; `theme`
   * stamps `data-theme` only when set here (otherwise the container's
   * cascade applies).
   */
  styles?: TableStyles
}

/** Props for the `TableCell` part (the `<td>` element). */
export interface TableCellProps {
  /**
   * Cell content. When the direct child is a `<th>` element, the cell is
   * flagged `data-header-cell="true"` so the CSS module styles it as a
   * header cell.
   */
  children: React.ReactNode
  /** Horizontal text alignment, applied as an inline `text-align`. Default 'left'. */
  align?: 'left' | 'center' | 'right'
  /**
   * Shared styling surface. The cell reads `color`, `fontFamily`,
   * `cellBorderColor`, plus the header background/color keys (for
   * header-cell usage); `theme` stamps `data-theme` only when set here.
   */
  styles?: TableStyles
}

/**
 * Wrapper `<div>` that owns the border, corner radius, and width chrome around
 * a `Table`. It ALWAYS stamps `data-theme` (sacred default), so unthemed
 * head/row/cell descendants inherit its palette through the CSS-module
 * cascade; scalar overrides land as `--table-*` custom properties, and the
 * header/cell/font keys set here inherit down to every part inside.
 */
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

/**
 * `<thead>` part. Honors the header background/color and `fontFamily`
 * overrides; stamps `data-theme` only when explicitly themed via
 * `styles.theme`, otherwise it inherits the container's cascade.
 */
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

/**
 * `<tbody>` part. Purely structural — it accepts rows and exposes no styling
 * surface; theme and overrides reach its rows via the container/table cascade.
 */
export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={cssStyles.table}>{children}</tbody>
}

/**
 * `<tr>` part. `hover` turns on the CSS hover highlight via a
 * `data-hover="true"` attribute; `data-theme` is stamped only when this row is
 * explicitly themed, otherwise the container's cascade applies.
 */
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

/**
 * `<td>` part. `align` maps to an inline `text-align` (left default). When its
 * direct child is a `<th>` element the cell is flagged
 * `data-header-cell="true"` and styled as a header cell, honoring the header
 * background/color overrides; otherwise the body-cell color/border/font
 * overrides apply. `data-theme` is stamped only when explicitly themed.
 */
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

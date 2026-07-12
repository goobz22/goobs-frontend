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

/**
 * Which table section a cell is being rendered in. `TableHead` provides
 * `'head'` and `TableBody` provides `'body'` so a `TableCell` can resolve the
 * semantically-correct element WITHOUT any prop from the caller: a cell inside
 * `TableHead` renders as `<th scope="col">` (column header) instead of a plain
 * `<td>`, giving screen readers the column↔cell association a data table needs
 * (WCAG 1.3.1 / 4.1.2). The context carries no DOM node, so `<thead>`/`<tbody>`
 * remain the direct `<table>` children.
 */
const TableSectionContext = React.createContext<'head' | 'body' | undefined>(
  undefined
)

/** Resolve the active theme name, defaulting to sacred (the hardcoded base). */
const resolveTheme = (styles?: TableStyles): 'sacred' | 'light' | 'dark' =>
  styles?.theme ?? 'sacred'

/** Compose class names, dropping falsy entries (the library's no-clsx pattern). */
const joinClasses = (...names: Array<string | undefined>): string =>
  names.filter(Boolean).join(' ')

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
   * Optional table caption rendered as a real `<caption>` (the `<table>`'s
   * accessible name and the first thing a screen reader announces for it).
   * Supply it whenever a page has more than one table so assistive tech and
   * crawlers can tell them apart (WCAG 1.3.1 / 2.4.6). Omitted → no caption.
   */
  caption?: React.ReactNode
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
   * Accessible name for the horizontally-scrollable region. The container is
   * always keyboard-focusable (`tabIndex=0`) so keyboard-only users can scroll
   * an overflowing table with the arrow keys (WCAG 2.1.1); supplying this name
   * additionally promotes it to a labelled `role="region"` landmark so screen
   * readers announce the scrollable area meaningfully. Omitted → focusable but
   * unlabelled (no `region` role, to avoid an unnamed landmark).
   */
  ariaLabel?: string
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

/** Props for the `TableCell` part (renders `<td>`, or `<th>` for a header cell). */
export interface TableCellProps {
  /**
   * Cell content. A cell resolves to a header `<th>` automatically when it
   * sits inside a `TableHead`; passing a raw `<th>` child (the legacy pattern)
   * is unwrapped to the same real `<th>` rather than emitting invalid
   * `<td><th>` markup — and the raw `<th>`'s own attributes
   * (`colSpan`/`rowSpan`/`scope`/`id`/`className`/`style`/…) are forwarded onto
   * that `<th>`, so the unwrap is lossless. Header cells are flagged
   * `data-header-cell="true"` so the CSS module styles them as header cells.
   */
  children: React.ReactNode
  /** Horizontal text alignment, applied as an inline `text-align`. Default 'left'. */
  align?: 'left' | 'center' | 'right'
  /**
   * Force the rendered element. Omit to auto-resolve: cells in a `TableHead`
   * render as `<th>`, cells elsewhere as `<td>`. Pass `'th'` to mark a
   * body-row header cell (pair with `scope="row"`); pass `'td'` to keep a
   * head cell a plain data cell.
   */
  component?: 'td' | 'th'
  /**
   * `scope` for a header cell — only emitted when the cell renders as `<th>`.
   * Defaults BY SECTION: `'col'` for a header cell in a `TableHead` (a column
   * header, associating down its column) and `'row'` for a header cell in a
   * body row (`component="th"`, or an unwrapped raw `<th>` — a row header,
   * associating across its row). Pass it explicitly to override — e.g. a
   * `'col'` header rendered outside a `TableHead`.
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
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
  ariaLabel,
  styles,
}) => {
  const overrides = containerVars(styles)
  return (
    <div
      className={cssStyles.container}
      data-theme={resolveTheme(styles)}
      // The container is the scroll viewport (overflow-x: auto). Making it
      // focusable lets keyboard-only users scroll an overflowing table via the
      // arrow keys (WCAG 2.1.1); the :focus-visible ring in the CSS module marks
      // it. A supplied name promotes it to a labelled region landmark.
      tabIndex={0}
      {...(ariaLabel && { role: 'region', 'aria-label': ariaLabel })}
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
export const Table: React.FC<SimpleTableProps> = ({
  children,
  caption,
  styles,
}) => {
  const overrides = tableVars(styles)
  return (
    <table
      className={cssStyles.table}
      data-component="Table"
      {...subThemeAttr(styles)}
      {...(overrides && { style: overrides })}
    >
      {caption != null && (
        <caption className={cssStyles.caption}>{caption}</caption>
      )}
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
      <TableSectionContext.Provider value="head">
        {children}
      </TableSectionContext.Provider>
    </thead>
  )
}

/**
 * `<tbody>` part. Purely structural — it accepts rows and exposes no styling
 * surface; theme and overrides reach its rows via the container/table cascade.
 */
export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody className={cssStyles.table}>
      <TableSectionContext.Provider value="body">
        {children}
      </TableSectionContext.Provider>
    </tbody>
  )
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
 * Cell part. `align` maps to an inline `text-align` (left default). An explicit
 * `component` forces the element in both directions — `'th'` a header cell,
 * `'td'` a plain data cell (the escape hatch for a non-header corner cell inside
 * a `<thead>`). With `component` omitted the element auto-resolves to a semantic
 * header `<th scope="col">` when the cell sits inside a `TableHead` or a raw
 * `<th>` child is passed (that child is unwrapped — its content AND its other
 * attributes, colSpan/rowSpan/scope/id/className/style, are carried onto the
 * `<th>` — so we never emit invalid `<td><th>` nesting nor drop the caller's
 * attributes); otherwise a body `<td>` is rendered. Header cells are flagged
 * `data-header-cell="true"` and styled as header cells, honoring the header
 * background/color overrides; body cells honor the color/border/font overrides.
 * `scope` defaults BY SECTION — `'col'` for a header cell in a `TableHead`
 * (column header) and `'row'` for a header cell in a body row (`component="th"`
 * or an unwrapped raw `<th>`); pass it explicitly to override. `data-theme` is
 * stamped only when explicitly themed.
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  component,
  scope,
  styles,
}) => {
  const section = React.useContext(TableSectionContext)
  const childIsRawTh =
    React.isValidElement(children) &&
    (children as React.ReactElement).type === 'th'

  // The full props of a legacy raw <th> child (the deprecated
  // `<TableCell><th …>…</th></TableCell>` pattern). We unwrap the child — a
  // <th>/<td> can't contain another <th> — but we forward its attributes
  // (colSpan/rowSpan/scope/id/className/style/…) onto the real <th> we render,
  // so the unwrap is LOSSLESS instead of hoisting only the text and silently
  // dropping every other attribute the caller put on the raw <th>.
  const rawThProps: React.ThHTMLAttributes<HTMLTableCellElement> | undefined =
    childIsRawTh
      ? (
          children as React.ReactElement<
            React.ThHTMLAttributes<HTMLTableCellElement>
          >
        ).props
      : undefined

  // An explicit `component` prop is authoritative in BOTH directions: `'th'`
  // forces a header cell, `'td'` forces a plain data cell (the escape hatch for
  // a non-header corner cell inside a `<thead>` — a standard cross-tab layout).
  // Only when `component` is omitted does the cell auto-resolve: header when it
  // sits inside a TableHead or a raw <th> child was supplied (legacy pattern).
  const renderAsHeader =
    component != null ? component === 'th' : section === 'head' || childIsRawTh

  const content = rawThProps ? rawThProps.children : children

  const overrides = cellVars(styles)
  // Default `scope` by the cell's SECTION, not merely by header-ness: a header
  // cell in the `<thead>` is a COLUMN header (`scope="col"`, associates down);
  // a header cell in a body row (`component="th"`, or an unwrapped raw <th>) is
  // a ROW header (`scope="row"`, associates across). Gating the default on
  // `renderAsHeader` alone wrongly stamped `scope="col"` on a body-row `<th>`,
  // making a screen reader associate it down a phantom column instead of across
  // its row. Precedence: an explicit `scope` prop wins, then a `scope` on the
  // raw <th> child, then this section-derived default.
  const resolvedScope =
    scope ??
    rawThProps?.scope ??
    (renderAsHeader ? (section === 'head' ? 'col' : 'row') : undefined)
  const style = { textAlign: align, ...(overrides ?? {}) }

  return renderAsHeader ? (
    <th
      {...rawThProps}
      className={joinClasses(cssStyles.cell, rawThProps?.className)}
      {...subThemeAttr(styles)}
      data-header-cell="true"
      {...(resolvedScope && { scope: resolvedScope })}
      style={{ ...style, ...rawThProps?.style }}
    >
      {content}
    </th>
  ) : (
    <td
      className={cssStyles.cell}
      {...subThemeAttr(styles)}
      style={style}
    >
      {content}
    </td>
  )
}

export default Table

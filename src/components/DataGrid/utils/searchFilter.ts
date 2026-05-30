/**
 * =============================================================================
 * DATAGRID SMART SEARCH
 * =============================================================================
 *
 * Cross-column row search extracted from the retired `DataGrid/FilterSection`.
 * Lives here (not goobs `<FilterSection>`) because the algorithm needs
 * column-metadata access — the unified filter section is presentation-only
 * and doesn't know what columns its host renders.
 *
 * ALGORITHM
 *   1. Split the input on whitespace into individual terms.
 *   2. For each term, classify as a column-header lookup (matches a
 *      `column.headerName` or `column.field`) OR a content term.
 *   3. If the entire input is column-header lookups, show ALL rows (the
 *      user is locating a column, not narrowing data).
 *   4. Otherwise filter rows where any cell value (coerced to lowercase
 *      string, with object values JSON-stringified) includes any of the
 *      content terms.
 * =============================================================================
 */
import type { ColumnDef, RowData } from '../types'

function toLowerCaseString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).toLowerCase()
    } catch {
      return ''
    }
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value).toLowerCase()
  }
  return ''
}

export function filterRowsBySearch(
  rows: RowData[],
  columns: ColumnDef[],
  searchValue: string
): RowData[] {
  if (!searchValue.trim() || rows.length === 0) return rows

  const searchTerms = searchValue.toLowerCase().trim().split(/\s+/)

  const columnHeaderTerms: string[] = []
  const contentTerms: string[] = []

  for (const term of searchTerms) {
    const matchesColumn = columns.some(col => {
      const headerMatch = col.headerName?.toLowerCase().includes(term) ?? false
      const fieldMatch = col.field.toLowerCase().includes(term)
      return headerMatch || fieldMatch
    })
    if (matchesColumn) columnHeaderTerms.push(term)
    else contentTerms.push(term)
  }

  if (columnHeaderTerms.length > 0 && contentTerms.length === 0) {
    return rows
  }

  if (contentTerms.length > 0) {
    return rows.filter(row =>
      contentTerms.some(term =>
        columns.some(col => {
          const cellValue = toLowerCaseString(row[col.field])
          return cellValue.includes(term)
        })
      )
    )
  }

  return rows
}

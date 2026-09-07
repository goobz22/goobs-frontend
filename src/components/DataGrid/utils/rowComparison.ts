import type { RowData } from '../types'

/**
 * Efficiently compares two arrays of rows to determine if they're equal
 * Uses ID and update timestamp for comparison to avoid deep object comparison
 */
export function areRowsEqual(
  a: RowData[] | undefined,
  b: RowData[] | undefined
): boolean {
  // Handle undefined/null cases
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false

  // Empty arrays are equal
  if (a.length === 0) return true

  // Create signatures based on IDs and timestamps for efficient comparison
  // This avoids expensive deep equality checks
  const createSignature = (rows: RowData[]): string => {
    return rows
      .map(row => {
        const id = row._id || row.id || ''
        const updated = row.updatedAt || row.createdAt || ''
        // Include a hash of critical fields that might change
        const title = typeof row.title === 'string' ? row.title : ''
        const status = typeof row.status === 'string' ? row.status : ''
        return `${id}-${updated}-${title}-${status}`
      })
      .join('|')
  }

  const aSignature = createSignature(a)
  const bSignature = createSignature(b)

  return aSignature === bSignature
}

// `getRowKey` and `areRowIdsEqual` were removed 2026-09-07: neither had a single
// caller. `areRowsEqual` above is the one comparison DataGrid actually uses
// (`DataGrid/index.tsx`, `utils/useInitializeGrid.tsx`), and row keys are
// computed at the render sites in `DataGrid/Table/Rows`.

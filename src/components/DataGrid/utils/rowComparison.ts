import isEqual from 'lodash/isEqual'
import type { RowData } from '../types'

/**
 * Compare the values the grid may render, including fields added by later reads.
 * IDs and timestamps alone cannot detect updated derived cells such as order labels.
 */
export function areRowsEqual(
  a: RowData[] | undefined,
  b: RowData[] | undefined
): boolean {
  // Handle undefined/null cases
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false

  if (a === b) return true
  return isEqual(a, b)
}

// `getRowKey` and `areRowIdsEqual` were removed 2026-09-07: neither had a single
// caller. `areRowsEqual` above is the one comparison DataGrid actually uses
// (`DataGrid/index.tsx`, `utils/useInitializeGrid.tsx`), and row keys are
// computed at the render sites in `DataGrid/Table/Rows`.

import type { RowData } from '../types'

/**
 * Efficiently compares two arrays of rows to determine if they're equal
 * Uses ID and update timestamp for comparison to avoid deep object comparison
 */
export function areRowsEqual(a: RowData[] | undefined, b: RowData[] | undefined): boolean {
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

/**
 * Creates a stable key from a row for comparison purposes
 */
export function getRowKey(row: RowData): string {
  const id = row._id || row.id || Math.random().toString(36)
  const updated = row.updatedAt || row.createdAt || ''
  return `${id}-${updated}`
}

/**
 * Compares rows by their IDs only (useful for checking if the set of rows changed)
 */
export function areRowIdsEqual(a: RowData[] | undefined, b: RowData[] | undefined): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  
  const aIds = a.map(r => r._id || r.id || '').sort().join(',')
  const bIds = b.map(r => r._id || r.id || '').sort().join(',')
  
  return aIds === bIds
}
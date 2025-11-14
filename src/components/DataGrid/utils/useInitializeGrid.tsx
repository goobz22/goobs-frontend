'use client'
import { useRef, useEffect } from 'react'
import { useColumnVisibility } from '../context/ColumnVisibilityContext'
import { areRowsEqual } from './rowComparison'
import type { ColumnDef, RowData } from '../types'

interface UseInitializeGridProps {
  columns: ColumnDef[]
  providedRows: RowData[]
  setRows: (rows: RowData[]) => void
}

/**
 * A custom hook that:
 * 1) Syncs the local rows whenever the parent-provided `rows` changes.
 * 2) Initializes columns in the context the very first time.
 */
export function useInitializeGrid({
  columns,
  providedRows,
  setRows,
}: UseInitializeGridProps) {
  const { columnVisibility, setColumns, saveVisibility } = useColumnVisibility()

  // We'll track whether we've run the "first-time" logic for columns and visibility
  const initialized = useRef(false)

  // (1) Sync local rows if parent changes them
  // Use a ref to track previous rows to avoid unnecessary updates
  const prevRowsRef = useRef<RowData[] | undefined>(undefined)
  useEffect(() => {
    // Only update if rows have actually changed using efficient comparison
    if (!areRowsEqual(prevRowsRef.current, providedRows)) {
      setRows(providedRows || [])
      prevRowsRef.current = providedRows
    }
  }, [providedRows, setRows])

  // (2) Initialize columns in context (only once)
  useEffect(() => {
    if (!initialized.current) {
      // Save column fields
      setColumns(columns.map(col => col.field))

      // If some columns have never been set in columnVisibility, default them to `true`
      const initialVisibility: Record<string, boolean> = {}
      columns.forEach(column => {
        if (columnVisibility[column.field] === undefined) {
          initialVisibility[column.field] = true
        }
      })

      // If we have at least one column that was never set, update our context
      if (Object.keys(initialVisibility).length > 0) {
        saveVisibility({ ...columnVisibility, ...initialVisibility })
      }

      initialized.current = true
    }
  }, [columns, columnVisibility, setColumns, saveVisibility])
}

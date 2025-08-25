'use client'
import { useRef, useEffect } from 'react'
import { useSetAtom, useAtomValue, createStore } from 'jotai'
import {
  columnsAtom,
  columnVisibilityAtom,
  columnVisibilityActions,
} from '../Jotai/atom'
import { areRowsEqual } from './rowComparison'
import type { ColumnDef, RowData } from '../types'

// Create a single shared store instance
export const dataGridStore = createStore()

interface UseInitializeGridProps {
  columns: ColumnDef[]
  providedRows: RowData[]
  setRows: (rows: RowData[]) => void
}

/**
 * A custom hook that:
 * 1) Syncs the local rows whenever the parent-provided `rows` changes.
 * 2) Initializes columns in Jotai the very first time.
 */
export function useInitializeGrid({
  columns,
  providedRows,
  setRows,
}: UseInitializeGridProps) {
  // We retrieve or modify atoms here, so that DataGrid doesn't need its own useEffect.
  // Use the custom store instead of the default one
  const setColumns = useSetAtom(columnsAtom, { store: dataGridStore })
  const columnVisibility = useAtomValue(columnVisibilityAtom, {
    store: dataGridStore,
  })
  const updateVisibility = useSetAtom(columnVisibilityActions, {
    store: dataGridStore,
  })

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

  // (2) Initialize columns in Jotai (only once)
  useEffect(() => {
    if (!initialized.current) {
      // Save column fields in columnsAtom
      setColumns(columns.map(col => col.field))

      // If some columns have never been set in columnVisibility, default them to `true`
      const initialVisibility: Record<string, boolean> = {}
      columns.forEach(column => {
        if (columnVisibility[column.field] === undefined) {
          initialVisibility[column.field] = true
        }
      })

      // If we have at least one column that was never set, update our Jotai atom
      if (Object.keys(initialVisibility).length > 0) {
        updateVisibility({
          type: 'save',
          newState: { ...columnVisibility, ...initialVisibility },
        })
      }

      initialized.current = true
    }
  }, [columns, columnVisibility, setColumns, updateVisibility])
}

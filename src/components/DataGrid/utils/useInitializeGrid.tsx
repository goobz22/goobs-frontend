'use client'
import { useRef, useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import {
  columnsAtom,
  columnVisibilityAtom,
  columnVisibilityActions,
} from '../Jotai/atom'
import type { ColumnDef, RowData } from '../types'

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
  const setColumns = useSetAtom(columnsAtom)
  const columnVisibility = useAtomValue(columnVisibilityAtom)
  const updateVisibility = useSetAtom(columnVisibilityActions)

  // We'll track whether we've run the "first-time" logic for columns and visibility
  const initialized = useRef(false)

  // (1) Sync local rows if parent changes them
  useEffect(() => {
    setRows(providedRows || [])
  }, [providedRows, setRows])

  // (2) Initialize columns in Jotai (only once)
  useEffect(() => {
    if (!initialized.current) {
      console.log('Initializing columns and visibility:', columns)

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
        console.log(
          'Setting initial visibility for columns:',
          initialVisibility
        )
        updateVisibility({
          type: 'save',
          newState: { ...columnVisibility, ...initialVisibility },
        })
      }

      initialized.current = true
    }
  }, [columns, columnVisibility, setColumns, updateVisibility])
}

'use client'

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react'
import type { ColumnData } from '../types'

interface UseComputeBoardResizeParams {
  /** All columns in their normal order */
  columns: ColumnData[]
  /** The fixed width you want each visible column to occupy (e.g. 300px) */
  columnWidth: number
  /**
   * Whether to reserve space for an overflow "dropdown" column on the far right.
   * If true and columns don't fit, the last column is replaced by a special
   * "overflow" column (with a dropdown).
   */
  showOverflowDropdown: boolean
}

/**
 * A custom hook to handle "fitting" columns horizontally:
 * - We measure how many columns at `columnWidth` can fit in the container
 * - Remaining columns become "overflow" columns.
 * - We track which overflow column is selected by ID.
 */
export function useComputeBoardResize({
  columns,
  columnWidth,
  showOverflowDropdown,
}: UseComputeBoardResizeParams) {
  // A ref to the container whose width we measure
  const containerRef = useRef<HTMLDivElement>(null)

  // Subset of columns that fit
  const [fittedColumns, setFittedColumns] = useState<ColumnData[]>([])
  // The columns that don’t fit
  const [overflowColumns, setOverflowColumns] = useState<ColumnData[]>([])
  // The _id of whichever overflow column is currently selected
  const [selectedOverflowColumnId, setSelectedOverflowColumnId] = useState('')

  const recalcColumns = useCallback(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.offsetWidth

    // We'll reserve space for a separate "overflow" column if showOverflowDropdown is true
    const overflowReservedWidth = showOverflowDropdown ? columnWidth : 0

    let usedWidth = 0
    const canFit: ColumnData[] = []
    let theOverflow: ColumnData[] = []

    for (let i = 0; i < columns.length; i++) {
      // If adding another column + the "overflow" column fits in the container, keep going
      if (usedWidth + columnWidth + overflowReservedWidth <= containerWidth) {
        const col = columns[i]
        if (!col) continue
        canFit.push(col)
        usedWidth += columnWidth
      } else {
        // Everything else is overflow
        theOverflow = columns.slice(i)

        // Optional: If there's overflow, you might move the last fitted column
        // to the overflow group as well, to ensure there's space for the dropdown
        if (theOverflow.length > 0 && canFit.length > 0) {
          const lastFitted = canFit.pop()
          if (lastFitted) {
            theOverflow = [lastFitted, ...theOverflow]
          }
        }
        break
      }
    }

    setFittedColumns(canFit)
    setOverflowColumns(theOverflow)

    // Update the selected overflow column so it’s always valid
    if (theOverflow.length > 0) {
      // If currently selected column is not in the new overflow array, pick the first one
      const stillExists = theOverflow.some(
        c => c._id === selectedOverflowColumnId
      )
      if (!stillExists) {
        const firstOverflowColumn = theOverflow[0]
        if (firstOverflowColumn) {
          setSelectedOverflowColumnId(firstOverflowColumn._id)
        }
      }
    } else {
      // If no overflow, reset
      if (selectedOverflowColumnId !== '') {
        setSelectedOverflowColumnId('')
      }
    }
  }, [columns, columnWidth, showOverflowDropdown, selectedOverflowColumnId])

  // Recalculate whenever the container resizes
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(() => {
      recalcColumns()
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [recalcColumns])

  // Also recalc on window resize
  useEffect(() => {
    const handleResize = () => recalcColumns()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [recalcColumns])

  // Recalc once on mount
  useEffect(() => {
    recalcColumns()
  }, [recalcColumns])

  return {
    containerRef,
    fittedColumns,
    overflowColumns,
    selectedOverflowColumnId,
    setSelectedOverflowColumnId,
  }
}

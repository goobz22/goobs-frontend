'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to calculate the number of rows that can fit in the available container height
 * @param containerRef - Reference to the container element
 * @param headerHeight - Height of the header element (default: 60px)
 * @param footerHeight - Height of the footer element (default: 56px)
 * @param rowHeight - Height of each row (default: 53px)
 * @param minRows - Minimum number of rows to display (default: 5)
 * @param maxRows - Maximum number of rows to display (default: 100)
 * @returns The number of rows that can fit in the available height
 */
export function useAutoRowHeight(
  containerRef: React.RefObject<HTMLDivElement | null>,
  {
    headerHeight = 60,
    footerHeight = 56,
    rowHeight = 53,
    minRows = 5,
    maxRows = 100,
  }: {
    headerHeight?: number
    footerHeight?: number
    rowHeight?: number
    minRows?: number
    maxRows?: number
  } = {}
): number {
  const [rowsToShow, setRowsToShow] = useState<number>(minRows)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    // Function to calculate the number of rows
    const calculateRows = (): void => {
      if (!containerRef.current) return

      // Get the height of the container
      const containerHeight = containerRef.current.clientHeight

      // Calculate available height for rows
      const availableHeight = containerHeight - headerHeight - footerHeight

      // Calculate how many rows can fit
      let calculatedRows = Math.floor(availableHeight / rowHeight)

      // Apply min/max constraints
      calculatedRows = Math.max(calculatedRows, minRows)
      calculatedRows = Math.min(calculatedRows, maxRows)

      setRowsToShow(calculatedRows)
    }

    // Calculate immediately on mount
    calculateRows()

    // Set up resize observer to recalculate on container size changes
    if (containerRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(calculateRows)
      resizeObserverRef.current.observe(containerRef.current)
    }

    // Also listen to window resize events
    window.addEventListener('resize', calculateRows)

    // Clean up
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      window.removeEventListener('resize', calculateRows)
    }
  }, [containerRef, headerHeight, footerHeight, rowHeight, minRows, maxRows])

  return rowsToShow
}

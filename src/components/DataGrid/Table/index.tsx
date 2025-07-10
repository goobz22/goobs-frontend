'use client'

import React, { useState, useEffect } from 'react'
import type { TableProps, RowData } from '../types'
import { useComputeTableResize } from '../utils/useComputeTableResize'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'

export function getRowId(row: RowData): string {
  return String(row.id ?? row._id ?? '')
}

function useIsMobile(width = 500) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < width)
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [width])
  return isMobile
}

const getStyles = (sacredtheme: boolean, isMobile: boolean) => ({
  tableContainer: {
    width: '100%',
    overflowX: isMobile ? 'auto' : 'hidden',
    minWidth: isMobile ? '100%' : undefined,
    ...(sacredtheme && {
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }),
  } as React.CSSProperties,
  tableWrapper: {
    overflowX: 'visible',
    width: '100%',
    ...(isMobile && { minWidth: '100%' }),
    ...(sacredtheme && {
      '&::-webkit-scrollbar': { height: '0.5rem' },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '0.375rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 215, 0, 0.5)',
        borderRadius: '0.375rem',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
      },
    }),
  } as React.CSSProperties,
  table: {
    width: '100%',
    minWidth: 'max-content',
    tableLayout: 'auto',
    ...(isMobile && { minWidth: '100%' }),
    ...(sacredtheme && {
      backgroundColor: 'transparent',
      '& td': {
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'serif',
      },
      '& th': {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
      },
      '& tr:hover': { backgroundColor: 'rgba(255, 215, 0, 0.05)' },
    }),
  } as React.CSSProperties,
})

function Table({
  columns,
  rows,
  onRowClick,
  selectedRowIds = [],
  allRowsSelected = false,
  someRowsSelected = false,
  onHeaderCheckboxChange,
  onRowCheckboxChange,
  sacredtheme = false,
}: TableProps) {
  const isMobile = useIsMobile(500)
  const {
    containerRef,
    fittedDesktopColumns,
    overflowDesktopColumns,
    selectedOverflowField,
    setSelectedOverflowField,
  } = useComputeTableResize({
    columns: columns.map(col =>
      col.width ? { ...col, computedWidth: col.width } : col
    ),
    checkboxSelection: true,
    showOverflowDropdown: !isMobile,
  })

  useEffect(() => {
    if (!selectedOverflowField && overflowDesktopColumns.length > 0) {
      setSelectedOverflowField(overflowDesktopColumns[0].field)
    }
  }, [selectedOverflowField, overflowDesktopColumns, setSelectedOverflowField])

  useEffect(() => {
    if (isMobile && !selectedOverflowField && columns.length > 0) {
      setSelectedOverflowField(columns[0].field)
    }
  }, [isMobile, selectedOverflowField, columns, setSelectedOverflowField])

  const finalDesktopColumns = !isMobile
    ? overflowDesktopColumns.length > 0
      ? [
          ...fittedDesktopColumns,
          { field: '__overflow__', headerName: 'More Columns' },
        ]
      : fittedDesktopColumns
    : []
  const styles = getStyles(sacredtheme, isMobile)

  return (
    <div style={styles.tableContainer}>
      <div ref={containerRef} style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <ColumnHeaderRow
              isMobile={isMobile}
              allRowsSelected={allRowsSelected}
              someRowsSelected={someRowsSelected}
              handleHeaderCheckboxChange={onHeaderCheckboxChange}
              finalDesktopColumns={finalDesktopColumns}
              overflowDesktopColumns={overflowDesktopColumns}
              selectedOverflowField={selectedOverflowField}
              setSelectedOverflowField={setSelectedOverflowField}
              allColumns={columns}
              sacredtheme={sacredtheme}
            />
          </thead>
          <Rows
            rows={rows}
            finalDesktopColumns={finalDesktopColumns}
            overflowDesktopColumns={overflowDesktopColumns}
            selectedOverflowField={selectedOverflowField}
            isMobile={isMobile}
            mobileSelectedColumn={selectedOverflowField}
            selectedRowIds={selectedRowIds}
            onRowClick={onRowClick}
            onRowCheckboxChange={onRowCheckboxChange}
            allColumns={columns}
            sacredtheme={sacredtheme}
          />
        </table>
      </div>
    </div>
  )
}

Table.displayName = 'Table'
export default Table

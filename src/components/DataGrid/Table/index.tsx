'use client'

import React from 'react'
import {
  Box,
  useMediaQuery,
  Table as MuiTable,
  TableContainer,
  TableHead,
} from '@mui/material'
import type { TableProps, RowData } from '../types'
import { useComputeTableResize } from '../utils/useComputeTableResize'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'

// Replace "any" with "RowData" to fix "Unexpected any" error
export function getRowId(row: RowData): string {
  return String(row._id ?? row.id ?? '')
}

function Table({
  columns,
  rows,
  onRowClick,
  selectedRowIds = [],
  allRowsSelected = false,
  someRowsSelected = false,
  onHeaderCheckboxChange,
  onRowCheckboxChange,
}: TableProps) {
  // We'll consider mobile if screen width < 500px
  const isMobile = !useMediaQuery('(min-width:500px)')

  // Our existing desktop "resizing" logic
  const {
    containerRef,
    fittedDesktopColumns,
    overflowDesktopColumns,
    selectedOverflowField,
    setSelectedOverflowField,
  } = useComputeTableResize({
    columns: columns.map(col => {
      // We keep this "computedWidth" approach if desired,
      // but it's optional. It won't break anything.
      if (col.width) {
        return { ...col, computedWidth: col.width }
      }
      return col
    }),
    checkboxSelection: true,
    showOverflowDropdown: !isMobile,
  })

  // Decide which columns to render in the <TableHead /> for desktop.
  // On mobile, we skip the “__overflow__” approach and just show the single dropdown.
  const finalDesktopColumns = !isMobile
    ? overflowDesktopColumns.length > 0
      ? [
          ...fittedDesktopColumns,
          { field: '__overflow__', headerName: 'More Columns' },
        ]
      : fittedDesktopColumns
    : []

  return (
    // The main wrapper. Key: allow horizontal scroll if table is too wide.
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {/* We set the "ref" here so that useComputeTableResize can measure width. */}
      <TableContainer ref={containerRef} sx={{ overflowX: 'auto' }}>
        <MuiTable
          sx={{
            // Let columns expand to their set widths
            tableLayout: 'auto',
            // Force the table's minimum width to accommodate large columns
            minWidth: 'fit-content',
          }}
        >
          {/* Table Header */}
          <TableHead>
            <ColumnHeaderRow
              isMobile={isMobile}
              // Everything related to row selection
              allRowsSelected={allRowsSelected}
              someRowsSelected={someRowsSelected}
              handleHeaderCheckboxChange={onHeaderCheckboxChange}
              // Desktop columns
              finalDesktopColumns={finalDesktopColumns}
              // Overflow columns (desktop)
              overflowDesktopColumns={overflowDesktopColumns}
              // Current “selected” column for overflow or mobile
              selectedOverflowField={selectedOverflowField}
              setSelectedOverflowField={setSelectedOverflowField}
              // The entire columns array so we can present them all on mobile
              allColumns={columns}
            />
          </TableHead>

          {/* Table Rows */}
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
          />
        </MuiTable>
      </TableContainer>
    </Box>
  )
}

Table.displayName = 'Table'
export default Table

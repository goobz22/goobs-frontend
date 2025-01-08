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
    columns,
    checkboxSelection: true, // or false, depending on your config
    showOverflowDropdown: !isMobile, // only show overflow column on desktop
  })

  // Decide which columns to actually render in the <TableHead /> for desktop.
  // On mobile, skip the "__overflow__" approach entirely, relying on a single dropdown instead.
  const finalDesktopColumns = !isMobile
    ? overflowDesktopColumns.length > 0
      ? [
          ...fittedDesktopColumns,
          {
            field: '__overflow__',
            headerName: 'More Columns',
          },
        ]
      : fittedDesktopColumns
    : []

  return (
    <Box sx={{ width: '100%', overflow: 'visible' }}>
      <TableContainer ref={containerRef} sx={{ overflow: 'visible' }}>
        <MuiTable sx={{ minWidth: 'max-content', overflow: 'visible' }}>
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
            // Desktop columns
            finalDesktopColumns={finalDesktopColumns}
            overflowDesktopColumns={overflowDesktopColumns}
            // Which column is “active” if we’re on mobile or using overflow
            selectedOverflowField={selectedOverflowField}
            // If we are on mobile or not
            isMobile={isMobile}
            // In mobile, Rows will display row[mobileSelectedColumn]
            mobileSelectedColumn={selectedOverflowField}
            // Row selection
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

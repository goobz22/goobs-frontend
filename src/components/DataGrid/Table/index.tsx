'use client'

import React from 'react'
import {
  Box,
  useMediaQuery,
  Table as MuiTable,
  TableContainer,
  TableHead,
  alpha,
} from '@mui/material'
import type { TableProps, RowData } from '../types'
import { useComputeTableResize } from '../utils/useComputeTableResize'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'

// Replace "any" with "RowData" to fix "Unexpected any" error
export function getRowId(row: RowData): string {
  return String(row.id ?? row._id ?? '')
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
  sacredtheme = false,
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

  // Initialize selectedOverflowField if it's empty but we have overflow columns
  React.useEffect(() => {
    if (!selectedOverflowField && overflowDesktopColumns.length > 0) {
      setSelectedOverflowField(overflowDesktopColumns[0].field)
    }
  }, [selectedOverflowField, overflowDesktopColumns, setSelectedOverflowField])

  // Initialize selectedOverflowField for mobile if nothing is selected
  React.useEffect(() => {
    if (isMobile && !selectedOverflowField && columns.length > 0) {
      setSelectedOverflowField(columns[0].field)
    }
  }, [isMobile, selectedOverflowField, columns, setSelectedOverflowField])

  // Decide which columns to render in the <TableHead /> for desktop.
  // On mobile, we skip the "__overflow__" approach and just show the single dropdown.
  const finalDesktopColumns = !isMobile
    ? overflowDesktopColumns.length > 0
      ? [
          ...fittedDesktopColumns,
          { field: '__overflow__', headerName: 'More Columns' },
        ]
      : fittedDesktopColumns
    : []

  return (
    // The main wrapper - Allow horizontal scroll on mobile for content visibility
    <Box
      sx={{
        width: '100%',
        overflowX: isMobile ? 'auto' : 'hidden',
        // Ensure minimum width for mobile content
        minWidth: isMobile ? '100%' : 'auto',
        ...(sacredtheme && {
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${alpha('#FFD700', 0.3)}`,
          backgroundColor: alpha('#000000', 0.5),
        }),
      }}
    >
      {/* We set the "ref" here so that useComputeTableResize can measure width. */}
      <TableContainer
        ref={containerRef}
        sx={{
          overflowX: isMobile ? 'auto' : 'visible',
          // Ensure proper width on mobile
          width: '100%',
          minWidth: isMobile ? '100%' : 'auto',
          ...(sacredtheme && {
            backgroundColor: 'transparent',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 215, 0, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.7)',
              },
            },
          }),
        }}
      >
        <MuiTable
          sx={{
            // Set width to 100% to fit container
            width: '100%',
            // Keep tableLayout as 'auto' to respect column widths
            tableLayout: 'auto',
            // Force the table's minimum width to accommodate content
            minWidth: isMobile ? '100%' : 'fit-content',
            ...(sacredtheme && {
              backgroundColor: 'transparent',
              '& .MuiTableCell-root': {
                borderBottom: `1px solid ${alpha('#FFD700', 0.2)}`,
                color: alpha('#ffffff', 0.9),
                fontFamily: '"Crimson Text", serif',
              },
              '& .MuiTableCell-head': {
                backgroundColor: alpha('#FFD700', 0.1),
                color: '#FFD700',
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${alpha('#FFD700', 0.3)}`,
              },
              '& .MuiTableRow-root': {
                '&:hover': {
                  backgroundColor: alpha('#FFD700', 0.05),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha('#FFD700', 0.15),
                  '&:hover': {
                    backgroundColor: alpha('#FFD700', 0.2),
                  },
                },
              },
              '& .MuiCheckbox-root': {
                color: alpha('#FFD700', 0.6),
                '&.Mui-checked': {
                  color: '#FFD700',
                },
                '&.MuiCheckbox-indeterminate': {
                  color: '#FFD700',
                },
              },
            }),
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
              // Current "selected" column for overflow or mobile
              selectedOverflowField={selectedOverflowField}
              setSelectedOverflowField={setSelectedOverflowField}
              // The entire columns array so we can present them all on mobile
              allColumns={columns}
              sacredtheme={sacredtheme}
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
            allColumns={columns}
            sacredtheme={sacredtheme}
          />
        </MuiTable>
      </TableContainer>
    </Box>
  )
}

Table.displayName = 'Table'
export default Table

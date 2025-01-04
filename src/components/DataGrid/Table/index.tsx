'use client'

import React from 'react'
import {
  Box,
  useMediaQuery,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAtomValue } from 'jotai'
import { columnVisibilityAtom } from '../Jotai/atom'
import Dropdown from '../../Dropdown'
import type { DropdownProps } from '../../Dropdown'
import * as palette from '../../../styles/palette'
import type { TableProps, TableRef, RowData } from '../types'

/**
 * Safely get the unique identifier for a given row, which must have _id.
 */
function getRowId(row: RowData): string {
  return String(row._id ?? '')
}

/**
 * A styled Box that completely hides any scrollbar—content beyond the box's boundaries is clipped.
 */
const StyledScrollBox = styled(Box)(() => ({
  width: '100%',
  overflow: 'hidden', // Hides both horizontal and vertical scrollbars
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari
  },
}))

const DEFAULT_ROW_HEIGHT = 40

const Table = React.forwardRef<TableRef, TableProps>(
  (
    {
      columns,
      rows,
      rowHeight = DEFAULT_ROW_HEIGHT,
      onRowClick,
      selectedRows = [],
      onSelectionChange,
      checkboxSelection = false,
      selectedColumns = [],
      onColumnHeaderClick,
    },
    ref
  ) => {
    // ---------------------------------------------------------
    // 1) Single-column layout on mobile/tablet <= 900px
    // ---------------------------------------------------------
    const isMobileOrTablet = useMediaQuery('(max-width:900px)')

    // Which column is selected for the single-column view
    const [mobileSelectedColumn, setMobileSelectedColumn] = React.useState(
      () => columns[0]?.field || ''
    )

    React.useEffect(() => {
      // If the previously selected column no longer exists, reset to first
      if (!columns.some(col => col.field === mobileSelectedColumn)) {
        setMobileSelectedColumn(columns[0]?.field || '')
      }
    }, [columns, mobileSelectedColumn])

    // ---------------------------------------------------------
    // 2) Column visibility from Jotai
    // ---------------------------------------------------------
    const columnVisibility = useAtomValue(columnVisibilityAtom)

    // ---------------------------------------------------------
    // 3) Imperative methods exposed via ref
    // ---------------------------------------------------------
    React.useImperativeHandle(ref, () => ({
      getAllColumns: () => columns,
      getSelectedRows: () =>
        new Map(
          rows
            .filter(row => selectedRows.includes(getRowId(row)))
            .map(row => [getRowId(row), row])
        ),
      forceUpdate: () => {},
      setPage: () => {},
      setPageSize: () => {},
      getRowIndex: (id: string) => rows.findIndex(row => getRowId(row) === id),
      isRowSelected: (id: string) => selectedRows.includes(id),
    }))

    // ---------------------------------------------------------
    // 4) Selection logic
    // ---------------------------------------------------------
    const allRowsSelected =
      rows.length > 0 && rows.every(r => selectedRows.includes(getRowId(r)))
    const someRowsSelected =
      rows.length > 0 && rows.some(r => selectedRows.includes(getRowId(r)))

    const handleHeaderCheckboxChange = () => {
      if (!onSelectionChange) return
      if (allRowsSelected) {
        onSelectionChange([])
      } else {
        const allIds = rows.map(r => getRowId(r))
        onSelectionChange(allIds)
      }
    }

    const handleRowCheckboxChange = (rowId: string) => {
      if (!onSelectionChange) return
      if (selectedRows.includes(rowId)) {
        onSelectionChange(selectedRows.filter(id => id !== rowId))
      } else {
        onSelectionChange([...selectedRows, rowId])
      }
    }

    // ---------------------------------------------------------
    // 5) Mobile / Tablet Table (single-column)
    // ---------------------------------------------------------
    if (isMobileOrTablet) {
      // Dropdown props for selecting which column is displayed
      const mobileDropdown: DropdownProps = {
        label: 'Select Column',
        options: columns.map(c => ({ value: c.field })),
        value: mobileSelectedColumn,
        onChange: e => {
          const newField = e.target.value as string
          setMobileSelectedColumn(newField)
        },
        shrunklabelposition: 'aboveNotch',
      }

      return (
        <StyledScrollBox>
          <TableContainer>
            <MuiTable
              sx={{
                minWidth: '300px',
                // Let the row/cell height be controlled by rowHeight
                '& td, & th': { height: `${rowHeight}px` },
              }}
            >
              <TableHead>
                <TableRow>
                  {checkboxSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allRowsSelected}
                        indeterminate={!allRowsSelected && someRowsSelected}
                        onChange={handleHeaderCheckboxChange}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Dropdown {...mobileDropdown} />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    {checkboxSelection && <TableCell />}
                    <TableCell>No data available</TableCell>
                  </TableRow>
                ) : (
                  rows.map(row => {
                    const rowId = getRowId(row)
                    return (
                      <TableRow key={rowId}>
                        {checkboxSelection && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(rowId)}
                              onChange={() => handleRowCheckboxChange(rowId)}
                            />
                          </TableCell>
                        )}
                        <TableCell
                          onClick={
                            onRowClick ? () => onRowClick(row) : undefined
                          }
                        >
                          {String(row[mobileSelectedColumn] ?? '')}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </StyledScrollBox>
      )
    }

    // ---------------------------------------------------------
    // 6) Desktop Table (multi-column), no scroll
    // ---------------------------------------------------------
    const visibleColumns = columns.filter(
      col => columnVisibility[col.field] !== false
    )

    return (
      <StyledScrollBox>
        <TableContainer>
          <MuiTable
            sx={{
              // The table can expand, but no scrollbar to show the overflow
              minWidth: 'max-content',
              '& td, & th': { height: `${rowHeight}px` },
            }}
          >
            <TableHead>
              <TableRow>
                {checkboxSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allRowsSelected}
                      indeterminate={!allRowsSelected && someRowsSelected}
                      onChange={handleHeaderCheckboxChange}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((col, colIndex) => (
                  <TableCell
                    key={`${col.field}-${colIndex}`}
                    onClick={
                      onColumnHeaderClick
                        ? () => onColumnHeaderClick(col.field)
                        : undefined
                    }
                    sx={{
                      backgroundColor: selectedColumns.includes(col.field)
                        ? palette.marine.light
                        : undefined,
                      cursor: onColumnHeaderClick ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  {checkboxSelection && <TableCell />}
                  <TableCell colSpan={visibleColumns.length}>
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, rowIndex) => {
                  const rowId = getRowId(row)
                  return (
                    <TableRow
                      key={rowId}
                      hover
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {checkboxSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(rowId)}
                            onChange={() => handleRowCheckboxChange(rowId)}
                          />
                        </TableCell>
                      )}

                      {visibleColumns.map((col, colIndex) => {
                        // If there's a custom renderCell function:
                        if (typeof col.renderCell === 'function') {
                          const cellParams = {
                            row,
                            value: row[col.field],
                            field: col.field,
                            rowIndex,
                            columnIndex: colIndex,
                          }
                          return (
                            <TableCell
                              key={`${col.field}-${colIndex}`}
                              sx={{
                                backgroundColor: selectedColumns.includes(
                                  col.field
                                )
                                  ? palette.marine.light
                                  : undefined,
                              }}
                            >
                              {col.renderCell(cellParams)}
                            </TableCell>
                          )
                        }

                        // Otherwise, just show the raw data
                        return (
                          <TableCell
                            key={`${col.field}-${colIndex}`}
                            sx={{
                              backgroundColor: selectedColumns.includes(
                                col.field
                              )
                                ? palette.marine.light
                                : undefined,
                            }}
                          >
                            {String(row[col.field] ?? '')}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </StyledScrollBox>
    )
  }
)

Table.displayName = 'Table'
export default Table

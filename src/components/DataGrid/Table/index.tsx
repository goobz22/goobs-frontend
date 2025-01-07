'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery,
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material'
import SearchableDropdown from '../../SearchableDropdown'
import type { SearchableDropdownProps } from '../../SearchableDropdown'
import { white, black } from '../../../styles/palette'
import type { TableProps, TableRef, RowData } from '../types'
import { useComputeTableResize } from '../utils/useComputeTableResize'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'

// A utility to get a row's unique ID
export function getRowId(row: RowData): string {
  return String(row._id ?? row.id ?? '')
}

const Table = forwardRef<TableRef, TableProps>(
  (
    {
      columns,
      rows,
      onRowClick,
      selectedRows = [],
      // We assume these four props come from the parent (DataGrid)
      allRowsSelected = false,
      someRowsSelected = false,
      onHeaderCheckboxChange,
      onRowCheckboxChange,

      checkboxSelection = false,
      selectedColumns = [],
      onColumnHeaderClick,
    },
    ref
  ) => {
    // 1) Decide breakpoints
    const isMobile = useMediaQuery('(max-width:600px)')
    const showOverflowDropdown = useMediaQuery('(min-width:500px)')

    // Mobile single-column
    const [mobileSelectedColumn, setMobileSelectedColumn] = useState(
      columns[0]?.field || ''
    )

    // 2) Use custom hook for column sizing & overflow logic
    const {
      containerRef,
      fittedDesktopColumns,
      overflowDesktopColumns,
      selectedOverflowField,
      setSelectedOverflowField,
    } = useComputeTableResize({
      columns,
      checkboxSelection,
      showOverflowDropdown,
    })

    // Expose imperative methods to parent
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

    // If the previously selected column doesn't exist anymore, reset
    useEffect(() => {
      if (!columns.some(col => col.field === mobileSelectedColumn)) {
        setMobileSelectedColumn(columns[0]?.field || '')
      }
    }, [columns, mobileSelectedColumn])

    // final set of columns => fitted + optional overflow
    const finalDesktopColumns = [...fittedDesktopColumns]
    if (overflowDesktopColumns.length > 0 && showOverflowDropdown) {
      finalDesktopColumns.push({
        field: '__overflow__',
        headerName: 'More Columns',
        width: 250, // forced 250px
      })
    }

    // ----------------------------------------------------------------
    // Render
    // ----------------------------------------------------------------

    // MOBILE LAYOUT
    if (isMobile) {
      const mobileDropdownProps: SearchableDropdownProps = {
        label: 'Select Column',
        options: columns.map(c => ({ value: c.field })),
        backgroundcolor: white.main,
        outlinecolor: 'none',
        fontcolor: black.main,
        shrunkfontcolor: black.main,
        unshrunkfontcolor: black.main,
        shrunklabelposition: 'aboveNotch',
        placeholder: 'Search...',
        onChange: newVal => {
          if (newVal) {
            setMobileSelectedColumn(newVal.value)
          } else {
            setMobileSelectedColumn('')
          }
        },
      }

      return (
        <Box sx={{ width: '100%', overflow: 'visible' }}>
          <TableContainer ref={containerRef} sx={{ overflow: 'visible' }}>
            <MuiTable sx={{ minWidth: '300px', overflow: 'visible' }}>
              <TableHead>
                <TableRow>
                  {checkboxSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allRowsSelected}
                        indeterminate={!allRowsSelected && someRowsSelected}
                        onChange={onHeaderCheckboxChange}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    {/* Force the dropdown's OutlinedInput to 45px */}
                    <Box
                      sx={{
                        height: '45px',
                        '& .MuiAutocomplete-root .MuiOutlinedInput-root': {
                          height: '45px !important',
                          minHeight: '45px !important',
                          lineHeight: '45px !important',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '5px !important',
                          paddingRight: '5px !important',
                        },
                      }}
                    >
                      <SearchableDropdown {...mobileDropdownProps} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* MOBILE ROWS */}
              <Rows
                rows={rows}
                finalDesktopColumns={finalDesktopColumns}
                overflowDesktopColumns={overflowDesktopColumns}
                selectedOverflowField={selectedOverflowField}
                isMobile
                mobileSelectedColumn={mobileSelectedColumn}
                checkboxSelection={checkboxSelection}
                selectedRows={selectedRows}
                handleRowCheckboxChange={onRowCheckboxChange}
                onRowClick={onRowClick}
              />
            </MuiTable>
          </TableContainer>
        </Box>
      )
    }

    // DESKTOP/TABLET LAYOUT
    return (
      <Box sx={{ width: '100%', overflow: 'visible' }}>
        <TableContainer ref={containerRef} sx={{ overflow: 'visible' }}>
          <MuiTable sx={{ minWidth: 'max-content', overflow: 'visible' }}>
            <TableHead>
              <ColumnHeaderRow
                checkboxSelection={checkboxSelection}
                allRowsSelected={allRowsSelected}
                someRowsSelected={someRowsSelected}
                handleHeaderCheckboxChange={onHeaderCheckboxChange}
                finalDesktopColumns={finalDesktopColumns}
                onColumnHeaderClick={onColumnHeaderClick}
                selectedColumns={selectedColumns}
                overflowDesktopColumns={overflowDesktopColumns}
                selectedOverflowField={selectedOverflowField}
                setSelectedOverflowField={setSelectedOverflowField}
              />
            </TableHead>

            <Rows
              rows={rows}
              finalDesktopColumns={finalDesktopColumns}
              overflowDesktopColumns={overflowDesktopColumns}
              selectedOverflowField={selectedOverflowField}
              isMobile={false}
              mobileSelectedColumn="" // not used in desktop
              checkboxSelection={checkboxSelection}
              selectedRows={selectedRows}
              handleRowCheckboxChange={onRowCheckboxChange}
              onRowClick={onRowClick}
            />
          </MuiTable>
        </TableContainer>
      </Box>
    )
  }
)

Table.displayName = 'Table'
export default Table

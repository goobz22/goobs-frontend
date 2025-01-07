'use client'

import React, { useState } from 'react'
import { Box, Alert } from '@mui/material'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import ManageRow from './ManageRow'
import { woad } from '../../styles/palette'
import { useColumnSelection } from './utils/useSelectColumn'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { DatagridProps, RowData, TableRef } from './types'

function DataGrid({
  columns,
  rows: providedRows,
  buttons,
  dropdowns,
  searchbarProps,
  error = null,
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  selectedRows: externalSelectedRows,
  onSelectionChange: externalOnSelectionChange,
  checkboxSelection = false,
}: DatagridProps) {
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([])
  const tableRef = React.useRef<TableRef>(null)

  // Initialize grid data, columns, etc.
  useInitializeGrid({
    columns,
    providedRows,
    setRows,
  })

  // Decide which row selection to use: external or internal
  const selectedRows = externalSelectedRows || internalSelectedRows

  // A single function to update selected row IDs
  const handleSelectionChange = (newSelectedIds: string[]) => {
    if (externalOnSelectionChange) {
      externalOnSelectionChange(newSelectedIds)
    } else {
      setInternalSelectedRows(newSelectedIds)
    }
  }

  // Toggling a single row when user clicks on the row
  const handleRowClick = (row: RowData) => {
    selectRow(row, selectedRows, handleSelectionChange)
  }

  // Toggling a single row via the row checkbox
  const handleRowCheckboxChange = (rowId: string) => {
    if (selectedRows.includes(rowId)) {
      handleSelectionChange(selectedRows.filter(id => id !== rowId))
    } else {
      handleSelectionChange([...selectedRows, rowId])
    }
  }

  // Toggling all rows via the header checkbox
  // Removed the unused 'e' parameter to avoid the warning:
  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => {
    selectAllRows(rows, selectedRows, handleSelectionChange)
  }

  // Hook for column selection
  const { selectedColumns, toggleColumnSelection } = useColumnSelection()

  // Hook for searching
  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns,
    rows,
    searchbarProps,
  })

  // Hook for manage row
  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  // Basic pagination logic
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  // Compute the "all selected" / "some selected" booleans
  const allRowsSelected = rows.length > 0 && selectedRows.length === rows.length
  const someRowsSelected =
    rows.length > 0 &&
    selectedRows.length > 0 &&
    selectedRows.length < rows.length

  return (
    <Box
      sx={{
        position: 'relative',
        marginLeft: '250px',
        marginTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        width: 'calc(100%)',
        overflow: 'hidden',
        p: 0,
        m: 0,
        backgroundColor: woad.main,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <CustomToolbar
        buttons={buttons}
        dropdowns={dropdowns}
        searchbarProps={updatedSearchbarProps}
        middleComponent={
          selectedRows.length > 0 ? (
            <ManageRow
              selectedRows={selectedRows}
              rows={rows}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onManage={handleManage}
              onShow={onShow}
              handleClose={handleManageRowClose}
            />
          ) : null
        }
      />

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Table
          ref={tableRef}
          columns={columns}
          rows={visibleRows}
          onRowClick={handleRowClick}
          // The parent is controlling row selection, so pass booleans + handlers:
          checkboxSelection={checkboxSelection}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onRowCheckboxChange={handleRowCheckboxChange}
          selectedColumns={selectedColumns}
          onColumnHeaderClick={toggleColumnSelection}
        />

        <CustomFooter
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          columns={columns}
        />
      </Box>
    </Box>
  )
}

export default DataGrid

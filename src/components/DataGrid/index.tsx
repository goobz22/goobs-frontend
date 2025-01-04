'use client'
import React, { useState } from 'react'
import { Box, Alert } from '@mui/material'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import ManageRow from './ManageRow'
import { woad } from '../../styles/palette'
import { useColumnSelection } from './utils/useColumn'
import { useRowClick } from './utils/useRowClick'
import { useSearchbar } from './utils/useSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'

// --- Import all needed types from the types folder ---
import { DatagridProps, RowData } from './types'
import type { TableRef } from './types' // <-- import our TableRef

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
}: DatagridProps) {
  console.log('DataGrid render:', {
    columns,
    providedRows,
    externalSelectedRows,
  })

  // Local copies of rows, pagination, and selection
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([])

  // NOTE: Use the interface from TableRef, not HTMLDivElement
  const tableRef = React.useRef<TableRef>(null)

  // Hook that encapsulates "sync rows" + "initialize columns in Jotai" logic
  useInitializeGrid({
    columns,
    providedRows,
    setRows,
  })

  // Decide which row selection to use: external or internal
  const selectedRows = externalSelectedRows || internalSelectedRows

  // Update row selection
  const handleSelectionChange = (newSelectedIds: string[]) => {
    console.log('Selection changed:', {
      previous: selectedRows,
      new: newSelectedIds,
      timestamp: new Date().toISOString(),
    })
    if (externalOnSelectionChange) {
      externalOnSelectionChange(newSelectedIds)
    } else {
      setInternalSelectedRows(newSelectedIds)
    }
  }

  // Hook for column selection (highlighting entire column)
  const { selectedColumns, toggleColumnSelection, clearColumnSelection } =
    useColumnSelection()

  // Hook for searching (updating column visibility automatically if desired)
  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns,
    rows,
    searchbarProps,
    // If you want to let the search hide columns automatically:
    // updateVisibility: useSetAtom(columnVisibilityActions),
  })

  // Hook for row & column-header clicks
  const { handleRowClick, handleColumnHeaderClick } = useRowClick({
    selectedColumns,
    clearColumnSelection,
    selectedRows,
    handleSelectionChange,
    toggleColumnSelection,
  })

  // Hook for manage row
  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  // Basic pagination logic for the final row subset
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  // Example tweak: rename the "name" field to "Administration Company"
  const updatedColumns = columns.map(col => ({
    ...col,
    headerName:
      col.field === 'name' ? 'Administration Company' : col.headerName,
  }))

  console.log('DataGrid final render with:', {
    visibleRows,
    selectedRows,
    selectedColumns,
    page,
    pageSize,
  })

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
        // Pass the updated searchbar props from our hook
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
          ref={tableRef} // <-- pass our ref to the Table
          columns={updatedColumns}
          rows={visibleRows}
          onRowClick={handleRowClick}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          checkboxSelection
          selectedColumns={selectedColumns}
          onColumnHeaderClick={handleColumnHeaderClick}
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

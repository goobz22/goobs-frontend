'use client'

import React, { useState } from 'react'
import { Box, Alert } from '@mui/material'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import ManageRow from './ManageRow'
import { woad } from '../../styles/palette'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { DatagridProps, RowData } from './types'

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
  onSelectionChange,
}: DatagridProps) {
  // Local state
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Initialize columns/rows if needed
  useInitializeGrid({ columns, providedRows, setRows })

  // 1) When row selection changes
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const handleRowClick = (row: RowData) => {
    selectRow(row, selectedRows, handleSelectionChange)
  }

  const handleRowCheckboxChange = (rowId: string) => {
    if (selectedRows.includes(rowId)) {
      handleSelectionChange(selectedRows.filter(id => id !== rowId))
    } else {
      handleSelectionChange([...selectedRows, rowId])
    }
  }

  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => {
    selectAllRows(rows, selectedRows, handleSelectionChange)
  }

  // 2) Search logic
  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns,
    rows,
    searchbarProps,
  })

  // 3) Manage row logic
  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  // 4) Pagination
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  // Determine if "all rows" are currently selected
  const allRowsSelected =
    rows.length > 0 &&
    rows.every(r => selectedRows.includes(String(r._id ?? r.id)))
  const someRowsSelected =
    rows.length > 0 &&
    selectedRows.length > 0 &&
    selectedRows.length < rows.length

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // Increase or remove height if you want more vertical space:
        height: 'calc(100vh - 60px)',
        // The key: allow horizontal scroll so columns with big widths can be scrolled
        overflow: 'auto',
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
        customComponent={
          selectedRows.length > 0 ? (
            <ManageRow
              selectedRows={selectedRows}
              rows={rows}
              onDuplicate={
                onDuplicate ? () => onDuplicate(selectedRows) : undefined
              }
              onDelete={onDelete ? () => onDelete(selectedRows) : undefined}
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
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* 
          This is the actual <Table/> component (not the file).
          Just leaving it as-is, but inside it we do a horizontal scroll and tableLayout: 'auto'.
        */}
        <Table
          columns={columns}
          rows={visibleRows}
          selectedRowIds={selectedRows}
          onRowClick={handleRowClick}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onRowCheckboxChange={handleRowCheckboxChange}
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

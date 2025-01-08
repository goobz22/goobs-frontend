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
}: DatagridProps) {
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  useInitializeGrid({ columns, providedRows, setRows })

  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
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

  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns,
    rows,
    searchbarProps,
  })

  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  const allRowsSelected = rows.length > 0 && selectedRows.length === rows.length
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
        height: 'calc(100vh - 60px)',
        width: '100%',
        overflow: 'hidden',
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
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
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

'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Box, Alert, useMediaQuery } from '@mui/material'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import { woad } from '../../styles/palette'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
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
  showIdColumns = false,
}: DatagridProps) {
  // Detect mobile devices for responsive behavior
  const isMobile = !useMediaQuery('(min-width:500px)')

  // Create ref for the container to measure available height
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter columns to hide ID columns based on showIdColumns prop
  const filteredColumns = useMemo(() => {
    if (showIdColumns) {
      return columns
    }
    return columns.filter(col => col.field !== 'id' && col.field !== '_id')
  }, [columns, showIdColumns])

  // Local state
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)

  // Automatically calculate the number of rows that can fit in the container
  const autoPageSize = useAutoRowHeight(containerRef, {
    // Adjust these values based on your actual layout measurements
    headerHeight: 150, // Toolbar + table header
    footerHeight: 56, // Footer height
    rowHeight: 53, // Average row height
    minRows: 5, // Minimum number of rows to show
  })

  // Use calculated pageSize instead of fixed value
  const [pageSize, setPageSize] = useState<number>(10) // Initial default value

  // Update pageSize when autoPageSize changes
  useEffect(() => {
    if (autoPageSize > 0) {
      setPageSize(autoPageSize)
    }
  }, [autoPageSize])

  // Initialize columns/rows if needed
  useInitializeGrid({ columns: filteredColumns, providedRows, setRows })

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
    columns: filteredColumns,
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

  // Reset page when rowCount or pageSize changes to prevent empty pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredRows.length / pageSize)
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1)
    }
  }, [filteredRows.length, pageSize, page])

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
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // Increase or remove height if you want more vertical space:
        height: 'calc(100vh - 60px)',
        // Allow horizontal scroll on mobile for content visibility
        overflow: isMobile ? 'auto' : 'hidden',
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
        dropdowns={dropdowns?.[0] ? [dropdowns[0]] : undefined}
        searchbarProps={updatedSearchbarProps}
        rightCenterProps={
          selectedRows.length > 0
            ? {
                selectedRows,
                rows,
                onDuplicate: onDuplicate
                  ? () => onDuplicate(selectedRows)
                  : undefined,
                onDelete: onDelete
                  ? () => {
                      // Call the onDelete handler and clear selection after it completes
                      onDelete(selectedRows)
                      // Clear the selection after delete operation
                      handleSelectionChange([])
                    }
                  : undefined,
                onManage: handleManage,
                onShow: onShow,
                handleClose: handleManageRowClose,
              }
            : undefined
        }
      />

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          // Ensure this container doesn't create scrollbars on mobile
          overflow: isMobile ? 'visible' : 'hidden',
        }}
      >
        {/* Table component */}
        <Table
          columns={filteredColumns}
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
          columns={filteredColumns}
        />
      </Box>
    </Box>
  )
}

export default DataGrid

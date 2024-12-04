'use client'
import React, { useState, useEffect } from 'react'
import { Box, Alert, CircularProgress } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import {
  columnVisibilityAtom,
  columnsAtom,
  columnVisibilityActions,
} from './Jotai/atom'
import CustomToolbar from '../Toolbar'
import Table, { ColumnDef, RowData } from './Table'
import CustomFooter from './Footer'
import ManageRow from './ManageRow'
import type { CustomButtonProps } from '../Button'
import type { DropdownProps } from '../Dropdown'
import type { SearchbarProps } from '../Searchbar'
import { woad } from '../../styles/palette'
import { useSearchbar } from './utils/useSearchbar'

export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[]
  buttons?: CustomButtonProps[]
  dropdowns?: Omit<DropdownProps, 'onChange'>[]
  searchbarProps?: Omit<SearchbarProps, 'onChange' | 'value'>
  onRefresh?: () => void
  loading?: boolean
  error?: Error | null
  onDuplicate?: () => void
  onDelete?: () => void
  checkboxSelection?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

function DataGrid({
  columns,
  rows: providedRows,
  buttons,
  dropdowns,
  searchbarProps,
  loading = false,
  error = null,
  onDuplicate,
  onDelete,
}: DatagridProps) {
  console.log('DataGrid render:', { columns, providedRows })

  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [manageRowOpen, setManageRowOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const tableRef = React.useRef(null)
  const initialized = React.useRef(false)

  // Jotai state setup
  const setColumns = useSetAtom(columnsAtom)
  const [columnVisibility] = useAtom(columnVisibilityAtom)
  const updateVisibility = useSetAtom(columnVisibilityActions)

  const {
    handleSearchChange,
    filteredRows,
    visibleColumns: searchVisibleColumns,
    tags,
  } = useSearchbar({
    columns,
    rows,
    searchValue,
    setSearchValue,
  })

  // Update Jotai visibility state when search changes columns visibility
  useEffect(() => {
    if (tags.length > 0) {
      const newVisibility: { [key: string]: boolean } = {}
      columns.forEach(column => {
        newVisibility[column.field] = searchVisibleColumns.has(column.field)
      })
      console.log('Updating column visibility from search:', newVisibility)
      updateVisibility({
        type: 'save',
        newState: newVisibility,
      })
    }
  }, [searchVisibleColumns, columns, updateVisibility, tags])

  useEffect(() => {
    setRows(providedRows || [])
  }, [providedRows])

  // Initialize columns and visibility in Jotai
  useEffect(() => {
    if (!initialized.current) {
      console.log('Initializing columns and visibility:', columns)
      setColumns(columns.map(col => col.field))

      // Initialize visibility for new columns
      const initialVisibility: { [key: string]: boolean } = {}
      columns.forEach(column => {
        if (columnVisibility[column.field] === undefined) {
          initialVisibility[column.field] = true
        }
      })

      if (Object.keys(initialVisibility).length > 0) {
        console.log(
          'Setting initial visibility for columns:',
          initialVisibility
        )
        updateVisibility({
          type: 'save',
          newState: { ...columnVisibility, ...initialVisibility },
        })
      }

      initialized.current = true
    }
  }, [columns, setColumns, columnVisibility, updateVisibility])

  const handleRowClick = (row: RowData) => {
    console.log('Row clicked:', row)
    const newSelection = selectedRows.includes(row.id)
      ? selectedRows.filter(id => id !== row.id)
      : [...selectedRows, row.id]

    setSelectedRows(newSelection)
    setManageRowOpen(newSelection.length > 0)
  }

  const handleSelectionChange = (selectedIds: string[]) => {
    console.log('Selection changed:', selectedIds)
    setSelectedRows(selectedIds)
    setManageRowOpen(selectedIds.length > 0)
  }

  const updatedSearchbarProps = {
    ...searchbarProps,
    value: searchValue,
    onChange: handleSearchChange,
  }

  // Get visible columns based on both Jotai state and search
  const visibleColumns = columns.filter(column => {
    const isVisibleInJotai = columnVisibility[column.field] !== false
    const isVisibleInSearch =
      tags.length === 0 || searchVisibleColumns.has(column.field)
    const isVisible = isVisibleInJotai && isVisibleInSearch

    console.log(`Column ${column.field} visibility:`, {
      jotai: isVisibleInJotai,
      search: isVisibleInSearch,
      final: isVisible,
    })

    return isVisible
  })

  // Calculate visible rows based on current page and pageSize
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  console.log('DataGrid rendering with:', {
    visibleColumns,
    visibleRows,
    page,
    pageSize,
    selectedRows,
  })

  if (loading) {
    return (
      <Box
        sx={{
          position: 'relative',
          marginTop: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)',
          width: 'calc(100vh)',
          backgroundColor: woad.main,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
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
        />

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Table
            ref={tableRef}
            columns={visibleColumns}
            rows={visibleRows}
            loading={loading}
            page={page}
            pageSize={pageSize}
            rowCount={filteredRows.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={handleRowClick}
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
            checkboxSelection
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

      <ManageRow
        open={manageRowOpen}
        handleClose={() => setManageRowOpen(false)}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </>
  )
}

export default DataGrid

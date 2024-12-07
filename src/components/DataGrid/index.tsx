'use client'
import React, { useState, useEffect } from 'react'
import { Box, Alert } from '@mui/material'
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
  onManage?: () => void
  onShow?: () => void
  checkboxSelection?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

interface ExtendedRowData extends RowData {
  _id: string
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

  const [rows, setRows] = useState<ExtendedRowData[]>(
    (providedRows as ExtendedRowData[]) || []
  )
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([])
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
    setRows((providedRows as ExtendedRowData[]) || [])
  }, [providedRows])

  useEffect(() => {
    if (!initialized.current) {
      console.log('Initializing columns and visibility:', columns)
      setColumns(columns.map(col => col.field))

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

  const selectedRows = externalSelectedRows || internalSelectedRows

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

  const handleRowClick = (row: ExtendedRowData) => {
    console.log('Row clicked:', row)
    const newSelection = selectedRows.includes(row._id)
      ? selectedRows.filter(id => id !== row._id)
      : [...selectedRows, row._id]

    handleSelectionChange(newSelection)
  }

  const handleManageRowClose = () => {
    if (!onManage) {
      handleSelectionChange([])
    }
  }

  const handleManage = () => {
    console.log('DataGrid handleManage called with selectedRows:', selectedRows)
    if (onManage) {
      onManage()
    }
  }

  const updatedSearchbarProps = {
    ...searchbarProps,
    value: searchValue,
    onChange: handleSearchChange,
  }

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

  const startIndex = page * pageSize
  const visibleRows = (filteredRows as ExtendedRowData[]).slice(
    startIndex,
    startIndex + pageSize
  )

  console.log('DataGrid rendering with:', {
    visibleColumns,
    visibleRows,
    page,
    pageSize,
    selectedRows,
  })

  const updatedColumns = columns.map(column => ({
    ...column,
    headerName:
      column.field === 'name' ? 'Administration Company' : column.headerName,
  }))

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
            columns={updatedColumns}
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
    </>
  )
}

export default DataGrid

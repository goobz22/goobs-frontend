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
import { useColumnSelection } from './utils/useColumn'

export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[] // <— Must have ._id or .id
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

  // local copies
  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const tableRef = React.useRef(null)
  const initialized = React.useRef(false)

  // Jotai atoms
  const setColumns = useSetAtom(columnsAtom)
  const [columnVisibility] = useAtom(columnVisibilityAtom)
  const updateVisibility = useSetAtom(columnVisibilityActions)

  // Hook for searching
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

  // Hook for column selection (highlighting entire column)
  const { selectedColumns, toggleColumnSelection, clearColumnSelection } =
    useColumnSelection()

  // If search introduces tags, hide columns not matching
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

  // Sync local rows if parent changes them
  useEffect(() => {
    setRows(providedRows || [])
  }, [providedRows])

  // Initialize columns in Jotai
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

  // When user clicks a row: if a column is selected, clear it; then toggle the row
  const handleRowClick = (row: RowData) => {
    if (selectedColumns.length > 0) {
      clearColumnSelection()
    }
    const rowId = row._id || row.id
    if (rowId) {
      const newSel = selectedRows.includes(rowId)
        ? selectedRows.filter(id => id !== rowId)
        : [...selectedRows, rowId]
      handleSelectionChange(newSel)
    }
  }

  // When user clicks a column header: if any row is selected, clear rows; then toggle the column
  const handleColumnHeaderClick = (field: string) => {
    if (selectedRows.length > 0) {
      handleSelectionChange([])
    }
    toggleColumnSelection(field)
  }

  // If user clicks "Close" in ManageRow but there's no onManage prop, clear row selection
  const handleManageRowClose = () => {
    if (!onManage) {
      handleSelectionChange([])
    }
  }

  // Called if user clicks "Manage" in ManageRow
  const handleManage = () => {
    console.log('DataGrid handleManage with selectedRows:', selectedRows)
    onManage?.()
  }

  // Combine parent & local search props
  const updatedSearchbarProps = {
    ...searchbarProps,
    value: searchValue,
    onChange: handleSearchChange,
  }

  // Columns not hidden by Jotai or search-based logic
  const visibleColumns = columns.filter(column => {
    const isVisibleInJotai = columnVisibility[column.field] !== false
    const isVisibleInSearch =
      tags.length === 0 || searchVisibleColumns.has(column.field)
    return isVisibleInJotai && isVisibleInSearch
  })

  // Basic pagination logic
  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  console.log('DataGrid rendering with:', {
    visibleColumns,
    visibleRows,
    page,
    pageSize,
    selectedRows,
    selectedColumns,
  })

  // Example tweak: rename the "name" field to "Administration Company"
  const updatedColumns = columns.map(col => ({
    ...col,
    headerName:
      col.field === 'name' ? 'Administration Company' : col.headerName,
  }))

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
          columns={updatedColumns}
          rows={visibleRows}
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
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

'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import FilterSection from './FilterSection'
import MetricSection from './MetricSection'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
import { DatagridProps, RowData } from './types'
import { getDataGridStyles, SACRED_GLYPHS } from '../../theme'

function arePropsEqual(
  prevProps: Readonly<DatagridProps>,
  nextProps: Readonly<DatagridProps>
) {
  const keysToCompare: (keyof DatagridProps)[] = [
    'columns',
    'rows',
    'buttons',
    'dropdowns',
    'searchbarProps',
    'error',
    'showIdColumns',
    'filters',
    'metrics',
    'styles',
  ]
  for (const key of keysToCompare) {
    if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
      return false
    }
  }
  return true
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
  onSelectionChange,
  showIdColumns = false,
  filters,
  metrics,
  styles,
}: DatagridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isSacredTheme = styles?.theme === 'sacred'
  const computedStyles = getDataGridStyles(styles)

  const filteredColumns = useMemo(() => {
    if (showIdColumns) return columns
    return columns.filter(col => col.field !== 'id' && col.field !== '_id')
  }, [columns, showIdColumns])

  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)

  const autoPageSize = useAutoRowHeight(containerRef, {
    headerHeight:
      (filters?.length ? 50 : 0) + (metrics?.length ? 120 : 0) + 150,
    footerHeight: 56,
    rowHeight: 53,
    minRows: 5,
  })

  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => {
    if (autoPageSize > 0) setPageSize(autoPageSize)
  }, [autoPageSize])

  useInitializeGrid({ columns: filteredColumns, providedRows, setRows })

  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const handleRowClick = (row: RowData) =>
    selectRow(row, selectedRows, handleSelectionChange)
  const handleRowCheckboxChange = (rowId: string) => {
    if (selectedRows.includes(rowId))
      handleSelectionChange(selectedRows.filter(id => id !== rowId))
    else handleSelectionChange([...selectedRows, rowId])
  }
  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => selectAllRows(rows, selectedRows, handleSelectionChange)

  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns: filteredColumns,
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

  useEffect(() => {
    const totalPages = Math.ceil(filteredRows.length / pageSize)
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1)
    }
  }, [filteredRows.length, pageSize, page])

  const allRowsSelected =
    rows.length > 0 &&
    rows.every(r => selectedRows.includes(String(r._id ?? r.id)))
  const someRowsSelected =
    rows.length > 0 &&
    selectedRows.length > 0 &&
    selectedRows.length < rows.length

  return (
    <div ref={containerRef} style={computedStyles.container}>
      {isSacredTheme && (
        <>
          <div
            style={{ ...computedStyles.glyph, top: '0.75rem', left: '0.75rem' }}
          >
            {SACRED_GLYPHS[23]}
          </div>
          <div
            style={{
              ...computedStyles.glyph,
              top: '0.75rem',
              right: '0.75rem',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[22]}
          </div>
        </>
      )}
      {error && <div style={computedStyles.error}>{error.message}</div>}
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
                      onDelete(selectedRows)
                      handleSelectionChange([])
                    }
                  : undefined,
                onManage: onManage ? handleManage : undefined,
                onShow: onShow ? () => onShow(selectedRows) : undefined,
                handleClose: handleManageRowClose,
              }
            : undefined
        }
        styles={{
          theme: styles?.theme || 'light',
        }}
      />
      {filters && Array.isArray(filters) && filters.length > 0 && (
        <FilterSection filters={filters} styles={styles} />
      )}
      {metrics && Array.isArray(metrics) && metrics.length > 0 && (
        <MetricSection metrics={metrics} styles={styles} />
      )}
      <div style={computedStyles.tableContainer}>
        <Table
          columns={filteredColumns}
          rows={visibleRows}
          selectedRowIds={selectedRows}
          onRowClick={handleRowClick}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onRowCheckboxChange={handleRowCheckboxChange}
          styles={styles}
        />
        <CustomFooter
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          columns={filteredColumns}
          styles={styles}
        />
      </div>
      {isSacredTheme && (
        <div style={computedStyles.footerContainer}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <p
              key={index}
              style={{
                ...computedStyles.footerGlyph,
                animationDelay: `${2 + index * 0.3}s`,
              }}
            >
              {glyph}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(DataGrid, arePropsEqual)

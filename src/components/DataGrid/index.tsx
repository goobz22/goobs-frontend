'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import FilterSection from './FilterSection'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
import { DatagridProps, RowData } from './types'

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

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
    'sacredtheme',
  ]
  for (const key of keysToCompare) {
    if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
      return false
    }
  }
  return true
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '0.5rem',
          animation: 'datagrid-glow-pulse 2s infinite alternate',
        }
      : {
          backgroundColor: '#1E293B',
        }),
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    fontSize: '1.125rem',
    color: 'rgba(255, 215, 0, 0.3)',
    zIndex: 10,
    animation: 'datagrid-float 8s infinite alternate',
  } as React.CSSProperties,
  error: {
    marginBottom: '0.5rem',
    padding: '1rem',
    borderWidth: '1px',
    borderRadius: '0.25rem',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#F87171',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        }
      : {
          backgroundColor: '#FEF2F2',
          color: '#B91C1C',
          borderColor: '#FECACA',
        }),
  } as React.CSSProperties,
  tableContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    margin: 0,
    padding: 0,
    '::before': sacredtheme
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '100%',
          overflow: 'hidden',
        }
      : {},
    '::after': sacredtheme
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'linear-gradient(to bottom, transparent, #FFD700, transparent)',
          animation: 'datagrid-datastream 4s linear infinite',
        }
      : {},
  } as React.CSSProperties,
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.125rem',
    marginTop: '0.5rem',
    opacity: 0.5,
  } as React.CSSProperties,
  footerGlyph: {
    color: '#FFD700',
    fontSize: '0.75rem',
    animation: `datagrid-float 3s ease-in-out infinite`,
  } as React.CSSProperties,
})

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
  sacredtheme = false,
}: DatagridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const styles = getStyles(sacredtheme)

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
    <div ref={containerRef} style={styles.container}>
      {sacredtheme && (
        <>
          <div style={{ ...styles.glyph, top: '0.75rem', left: '0.75rem' }}>
            {SACRED_GLYPHS[23]}
          </div>
          <div
            style={{
              ...styles.glyph,
              top: '0.75rem',
              right: '0.75rem',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[22]}
          </div>
        </>
      )}
      {error && <div style={styles.error}>{error.message}</div>}
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
        sacredtheme={sacredtheme}
      />
      {filters && Array.isArray(filters) && filters.length > 0 && (
        <FilterSection filters={filters} sacredtheme={sacredtheme} />
      )}
      <div style={styles.tableContainer}>
        <Table
          columns={filteredColumns}
          rows={visibleRows}
          selectedRowIds={selectedRows}
          onRowClick={handleRowClick}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onRowCheckboxChange={handleRowCheckboxChange}
          sacredtheme={sacredtheme}
        />
        <CustomFooter
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          columns={filteredColumns}
          sacredtheme={sacredtheme}
        />
      </div>
      {sacredtheme && (
        <div style={styles.footerContainer}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
            <p
              key={index}
              style={{
                ...styles.footerGlyph,
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

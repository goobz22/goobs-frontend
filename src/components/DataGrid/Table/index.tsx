'use client'

import React from 'react'
import { CircularProgress } from '@mui/material'
import ContentSection from '../../Content'
import type { ContentSectionProps } from '../../Content'
import type { BorderProp } from '../../Grid'
import { useAtomValue } from 'jotai'
import { columnVisibilityAtom } from '../Jotai/atom'

export interface ColumnDef {
  field: string
  headerName: string
  width?: number
  flex?: number
  renderCell?: (params: CellParams) => React.ReactNode
  renderHeader?: (params: HeaderParams) => React.ReactNode
  computedWidth?: number
  headerText?: string
  index?: number
}

export interface CellParams<T = unknown> {
  row: RowData
  value: T
  field: string
  rowIndex: number
  columnIndex: number
}

export interface HeaderParams {
  column: ColumnDef
  columnIndex: number
}

export interface RowData {
  id: string
  [key: string]: unknown
}

export interface TableProps {
  columns: ColumnDef[]
  rows: RowData[]
  loading?: boolean
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  rowHeight?: number
  headerHeight?: number
  onRowClick?: (row: RowData) => void
  selectedRows?: string[]
  checkboxSelection?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  getCellText?: (params: CellParams) => string
  getHeaderText?: (params: HeaderParams) => string
}

interface TableRef {
  getAllColumns: () => ColumnDef[]
  getSelectedRows: () => Map<string, RowData>
  forceUpdate: () => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  getRowIndex: (id: string) => number
  isRowSelected: (id: string) => boolean
}

const DEFAULT_ROW_HEIGHT = 40

const Table = React.forwardRef<TableRef, TableProps>(
  (
    {
      columns,
      rows,
      loading = false,
      rowHeight = DEFAULT_ROW_HEIGHT,
      onRowClick,
      selectedRows = [],
    },
    ref
  ) => {
    const columnVisibility = useAtomValue(columnVisibilityAtom)

    console.log('Table render:', {
      columns,
      rows,
      columnVisibility,
      selectedRows,
    })

    // Filter visible columns
    const visibleColumns = columns.filter(column => {
      const isVisible = columnVisibility[column.field] !== false
      console.log(`Column ${column.field} visibility:`, isVisible)
      return isVisible
    })

    React.useImperativeHandle(ref, () => ({
      getAllColumns: () => visibleColumns,
      getSelectedRows: () =>
        new Map(
          rows
            .filter(row => selectedRows.includes(row.id))
            .map(row => [row.id, row])
        ),
      forceUpdate: () => {},
      setPage: () => {},
      setPageSize: () => {},
      getRowIndex: (id: string) => rows.findIndex(row => row.id === id),
      isRowSelected: (id: string) => selectedRows.includes(id),
    }))

    if (loading) {
      return (
        <ContentSection
          grids={[
            {
              grid: {
                gridconfig: {
                  gridwidth: '100%',
                  gridname: 'loading-container',
                  alignment: 'left',
                },
              },
              typography: {
                columnconfig: {
                  row: 1,
                  column: 1,
                },
                component: CircularProgress as React.ElementType,
              },
            },
          ]}
        />
      )
    }

    if (rows.length === 0) {
      return (
        <ContentSection
          grids={[
            {
              grid: {
                gridconfig: {
                  gridwidth: '100%',
                  gridname: 'empty-table',
                  alignment: 'left',
                },
              },
              typography: {
                columnconfig: {
                  row: 1,
                  column: 1,
                },
                text: 'No data available',
              },
            },
          ]}
        />
      )
    }

    console.log('Table config - visibleColumns:', visibleColumns)

    const tableConfig: ContentSectionProps = {
      grids: [
        {
          grid: {
            gridconfig: {
              gridwidth: '100%',
              gridname: 'data-table',
              alignment: 'left',
            },
          },
          typography: [
            // Header row
            ...visibleColumns.map((column, columnIndex) => ({
              columnconfig: {
                row: 1,
                column: columnIndex + 1,
              },
              text: column.headerName,
              cellconfig: {
                border: 'solid' as BorderProp,
                minHeight: `${rowHeight}px`,
                width: column.width ? `${column.width}px` : '200px',
                mobilewidth: '100%',
                tabletwidth: '100%',
                computerwidth: '100%',
              },
            })),
            // Data rows
            ...rows.flatMap((row, rowIndex) =>
              visibleColumns.map((column, columnIndex) => ({
                columnconfig: {
                  row: rowIndex + 2,
                  column: columnIndex + 1,
                },
                text: String(row[column.field] || ''),
                cellconfig: {
                  border: 'solid' as BorderProp,
                  minHeight: `${rowHeight}px`,
                  width: column.width ? `${column.width}px` : '200px',
                  mobilewidth: '100%',
                  tabletwidth: '100%',
                  computerwidth: '100%',
                  onClick: onRowClick ? () => onRowClick(row) : undefined,
                  backgroundColor: selectedRows.includes(row.id)
                    ? 'rgba(0, 0, 0, 0.04)'
                    : undefined,
                },
              }))
            ),
          ],
        },
      ],
    }

    return <ContentSection {...tableConfig} />
  }
)

Table.displayName = 'Table'

export default Table

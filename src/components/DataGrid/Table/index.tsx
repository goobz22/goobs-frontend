'use client'

import React from 'react'
import { CircularProgress } from '@mui/material'
import ContentSection from '../../Content'
import type { ContentSectionProps } from '../../Content'
import { useAtomValue } from 'jotai'
import { columnVisibilityAtom } from '../Jotai/atom'
import * as palette from '../../../styles/palette'

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
  _id: string
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
      onSelectionChange,
      checkboxSelection = false,
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
            .filter(row => selectedRows.includes(row._id))
            .map(row => [row._id, row])
        ),
      forceUpdate: () => {},
      setPage: () => {},
      setPageSize: () => {},
      getRowIndex: (id: string) => rows.findIndex(row => row._id === id),
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

    const allRowsSelected =
      rows.length > 0 && rows.every(row => selectedRows.includes(row._id))
    const someRowsSelected =
      rows.length > 0 && rows.some(row => selectedRows.includes(row._id))

    const handleHeaderCheckboxChange = () => {
      if (onSelectionChange) {
        if (allRowsSelected) {
          onSelectionChange([])
        } else {
          onSelectionChange(rows.map(row => row._id))
        }
      }
    }

    const handleRowCheckboxChange = (rowId: string) => {
      if (onSelectionChange) {
        if (selectedRows.includes(rowId)) {
          onSelectionChange(selectedRows.filter(id => id !== rowId))
        } else {
          onSelectionChange([...selectedRows, rowId])
        }
      }
    }

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
          checkbox: checkboxSelection
            ? [
                // Header checkbox
                {
                  columnconfig: {
                    row: 1,
                    column: 1,
                  },
                  checked: allRowsSelected,
                  indeterminate: !allRowsSelected && someRowsSelected,
                  onChange: () => handleHeaderCheckboxChange(),
                  cellconfig: {
                    minHeight: `${rowHeight}px`,
                    width: '60px',
                  },
                },
                // Row checkboxes
                ...rows.map((row, rowIndex) => ({
                  columnconfig: {
                    row: rowIndex + 2,
                    column: 1,
                  },
                  checked: selectedRows.includes(row._id),
                  onChange: () => handleRowCheckboxChange(row._id),
                  cellconfig: {
                    minHeight: `${rowHeight}px`,
                    width: '60px',
                  },
                })),
              ]
            : [],
          typography: [
            // Header row
            ...visibleColumns.map((column, columnIndex) => ({
              columnconfig: {
                row: 1,
                column: checkboxSelection ? columnIndex + 2 : columnIndex + 1,
              },
              text: column.headerName,
              cellconfig: {
                minHeight: `${rowHeight}px`,
                width: column.width ? `${column.width}px` : '200px',
                mobilewidth: '100%',
                tabletwidth: '100%',
                computerwidth: '100%',
                wrap: 'nowrap' as const,
              },
            })),
            // Data rows
            ...(rows.length === 0
              ? visibleColumns.map((_, columnIndex) => ({
                  columnconfig: {
                    row: 2,
                    column: checkboxSelection
                      ? columnIndex + 2
                      : columnIndex + 1,
                  },
                  text: columnIndex === 0 ? 'No data available' : '',
                  cellconfig: {
                    minHeight: `${rowHeight}px`,
                    width: '200px',
                    mobilewidth: '100%',
                    tabletwidth: '100%',
                    computerwidth: '100%',
                  },
                }))
              : rows.flatMap((row, rowIndex) =>
                  visibleColumns.map((column, columnIndex) => ({
                    columnconfig: {
                      row: rowIndex + 2,
                      column: checkboxSelection
                        ? columnIndex + 2
                        : columnIndex + 1,
                    },
                    text: String(row[column.field] || ''),
                    cellconfig: {
                      minHeight: `${rowHeight}px`,
                      width: column.width ? `${column.width}px` : '200px',
                      mobilewidth: '100%',
                      tabletwidth: '100%',
                      computerwidth: '100%',
                      onClick: onRowClick ? () => onRowClick(row) : undefined,
                      backgroundColor: selectedRows.includes(row._id)
                        ? palette.marine.light
                        : undefined,
                    },
                  }))
                )),
          ],
        },
      ],
    }

    return <ContentSection {...tableConfig} />
  }
)

Table.displayName = 'Table'

export default Table

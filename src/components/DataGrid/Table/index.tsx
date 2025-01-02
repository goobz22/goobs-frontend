'use client'

import React from 'react'
import { useMediaQuery, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import ContentSection from '../../Content'
import type { ContentSectionProps } from '../../Content'
import { useAtomValue } from 'jotai'
import { columnVisibilityAtom } from '../Jotai/atom'
import * as palette from '../../../styles/palette'
import type { DropdownProps } from '../../Dropdown'

/**
 * Represents a column definition in the table.
 */
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

/**
 * Cell params passed to renderCell functions, if any.
 */
export interface CellParams<T = unknown> {
  row: RowData
  value: T
  field: string
  rowIndex: number
  columnIndex: number
}

/**
 * Header params passed to renderHeader functions, if any.
 */
export interface HeaderParams {
  column: ColumnDef
  columnIndex: number
}

/**
 * Represents a row of data in the table. Must have an `_id` or `id`.
 */
export interface RowData {
  _id?: string
  id?: string
  [key: string]: unknown
}

/**
 * Props for the Table component.
 * Note: We removed `loading` from here, so there's no loading prop now.
 */
export interface TableProps {
  columns: ColumnDef[]
  rows: RowData[]
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
  selectedColumns?: string[]
  onColumnHeaderClick?: (field: string) => void
}

/**
 * Methods exposed via ref.
 */
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

/**
 * Safely get the unique identifier for a given row.
 */
function getRowId(row: RowData): string {
  return String(row._id ?? row.id ?? '')
}

/**
 * A styled Box that shows a custom scrollbar for horizontal scrolling.
 */
const StyledScrollBox = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  /* Customize scrollbar style for a more visible track/thumb */
  scrollbarWidth: 'thin', // for Firefox
  '&::-webkit-scrollbar': {
    height: '8px', // horizontal scrollbar height
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
}))

const Table = React.forwardRef<TableRef, TableProps>(
  (
    {
      columns,
      rows,
      rowHeight = DEFAULT_ROW_HEIGHT,
      onRowClick,
      selectedRows = [],
      onSelectionChange,
      checkboxSelection = false,
      selectedColumns = [],
      onColumnHeaderClick,
      // ...
    },
    ref
  ) => {
    /**
     * Single-column layout on screens up to 900px (mobile & tablet).
     */
    const isMobileOrTablet = useMediaQuery('(max-width:900px)')

    // Track which column is selected for mobile/tablet single-column
    const [mobileSelectedColumn, setMobileSelectedColumn] = React.useState(
      () => columns[0]?.field || ''
    )

    // If columns change, ensure our selected column is still valid
    React.useEffect(() => {
      if (!columns.some(col => col.field === mobileSelectedColumn)) {
        setMobileSelectedColumn(columns[0]?.field || '')
      }
    }, [columns, mobileSelectedColumn])

    const columnVisibility = useAtomValue(columnVisibilityAtom)

    // Expose certain methods via ref
    React.useImperativeHandle(ref, () => ({
      getAllColumns: () => columns,
      getSelectedRows: () =>
        new Map(
          rows
            .filter(row => selectedRows.includes(getRowId(row)))
            .map(row => [getRowId(row), row])
        ),
      forceUpdate: () => {},
      setPage: () => {},
      setPageSize: () => {},
      getRowIndex: (id: string) => rows.findIndex(row => getRowId(row) === id),
      isRowSelected: (id: string) => selectedRows.includes(id),
    }))

    // ======================================
    // DESKTOP LAYOUT (screens wider than 900px)
    // ======================================
    if (!isMobileOrTablet) {
      // Filter out columns hidden by Jotai
      const visibleColumns = columns.filter(
        col => columnVisibility[col.field] !== false
      )

      // Are we selecting all or some rows?
      const allRowsSelected =
        rows.length > 0 && rows.every(r => selectedRows.includes(getRowId(r)))
      const someRowsSelected =
        rows.length > 0 && rows.some(r => selectedRows.includes(getRowId(r)))

      const handleHeaderCheckboxChange = () => {
        if (!onSelectionChange) return
        onSelectionChange(allRowsSelected ? [] : rows.map(r => getRowId(r)))
      }

      const handleRowCheckboxChange = (rowId: string) => {
        if (!onSelectionChange) return
        if (selectedRows.includes(rowId)) {
          onSelectionChange(selectedRows.filter(id => id !== rowId))
        } else {
          onSelectionChange([...selectedRows, rowId])
        }
      }

      const desktopTableConfig: ContentSectionProps = {
        grids: [
          {
            grid: {
              gridconfig: {
                gridwidth: 'max-content',
                gridname: 'data-table-desktop',
                alignment: 'left',
              },
            },
            checkbox: checkboxSelection
              ? [
                  {
                    columnconfig: {
                      row: 1,
                      column: 1,
                    },
                    checked: allRowsSelected,
                    indeterminate: !allRowsSelected && someRowsSelected,
                    onChange: handleHeaderCheckboxChange,
                    cellconfig: {
                      minHeight: `${rowHeight}px`,
                      width: '60px',
                    },
                  },
                  ...rows.map((row, rowIndex) => {
                    const rowId = getRowId(row)
                    return {
                      columnconfig: {
                        row: rowIndex + 2,
                        column: 1,
                      },
                      checked: selectedRows.includes(rowId),
                      onChange: () => handleRowCheckboxChange(rowId),
                      cellconfig: {
                        minHeight: `${rowHeight}px`,
                        width: '60px',
                      },
                    }
                  }),
                ]
              : [],
            // Typography for desktop
            typography: [
              // Header row
              ...visibleColumns.map((col, colIndex) => ({
                columnconfig: {
                  row: 1,
                  column: checkboxSelection ? colIndex + 2 : colIndex + 1,
                },
                text: col.headerName,
                cellconfig: {
                  minHeight: `${rowHeight}px`,
                  width: col.width ? `${col.width}px` : '200px',
                  wrap: 'nowrap' as const,
                  onClick: onColumnHeaderClick
                    ? () => onColumnHeaderClick(col.field)
                    : undefined,
                  backgroundColor: selectedColumns.includes(col.field)
                    ? palette.marine.light
                    : undefined,
                },
              })),
              // Data rows
              ...(rows.length === 0
                ? visibleColumns.map((_, colIndex) => ({
                    columnconfig: {
                      row: 2,
                      column: checkboxSelection ? colIndex + 2 : colIndex + 1,
                    },
                    text: colIndex === 0 ? 'No data available' : '',
                    cellconfig: {
                      minHeight: `${rowHeight}px`,
                      width: '200px',
                    },
                  }))
                : rows.flatMap((row, rowIndex) =>
                    visibleColumns.map((col, colIndex) => ({
                      columnconfig: {
                        row: rowIndex + 2,
                        column: checkboxSelection ? colIndex + 2 : colIndex + 1,
                      },
                      text: String(row[col.field] ?? ''),
                      cellconfig: {
                        minHeight: `${rowHeight}px`,
                        width: col.width ? `${col.width}px` : '200px',
                        onClick: onRowClick ? () => onRowClick(row) : undefined,
                        backgroundColor: selectedColumns.includes(col.field)
                          ? palette.marine.light
                          : undefined,
                      },
                    }))
                  )),
            ],
          },
        ],
      }

      return (
        <StyledScrollBox>
          <ContentSection {...desktopTableConfig} />
        </StyledScrollBox>
      )
    }

    // ==========================================
    // MOBILE / TABLET LAYOUT (screens <= 900px)
    // ==========================================
    const mobileDropdown: DropdownProps = {
      label: 'Select Column',
      options: columns.map(c => ({ value: c.field })),
      value: mobileSelectedColumn,
      onChange: e => {
        const newField = e.target.value as string
        setMobileSelectedColumn(newField)
      },
      shrunklabelposition: 'aboveNotch',
    }

    // “Select all” logic for mobile/tablet
    const allRowsSelected =
      rows.length > 0 && rows.every(r => selectedRows.includes(getRowId(r)))
    const someRowsSelected =
      rows.length > 0 && rows.some(r => selectedRows.includes(getRowId(r)))

    const handleHeaderCheckboxChangeMobile = () => {
      if (!onSelectionChange) return
      onSelectionChange(allRowsSelected ? [] : rows.map(r => getRowId(r)))
    }

    const handleRowCheckboxChangeMobile = (rowId: string) => {
      if (!onSelectionChange) return
      if (selectedRows.includes(rowId)) {
        onSelectionChange(selectedRows.filter(id => id !== rowId))
      } else {
        onSelectionChange([...selectedRows, rowId])
      }
    }

    const mobileOrTabletConfig: ContentSectionProps = {
      grids: [
        {
          grid: {
            gridconfig: {
              gridwidth: 'max-content',
              gridname: 'data-table-mobile',
              alignment: 'left',
            },
          },
          checkbox: checkboxSelection
            ? [
                // “Select all” in row 1, col 1
                {
                  columnconfig: {
                    row: 1,
                    column: 1,
                  },
                  checked: allRowsSelected,
                  indeterminate: !allRowsSelected && someRowsSelected,
                  onChange: handleHeaderCheckboxChangeMobile,
                  cellconfig: {
                    minHeight: `${rowHeight}px`,
                    width: '50px',
                  },
                },
                // Each row's checkbox in col 1
                ...rows.map((row, index) => {
                  const rowId = getRowId(row)
                  return {
                    columnconfig: {
                      row: index + 2,
                      column: 1,
                    },
                    checked: selectedRows.includes(rowId),
                    onChange: () => handleRowCheckboxChangeMobile(rowId),
                    cellconfig: {
                      minHeight: `${rowHeight}px`,
                      width: '50px',
                    },
                  }
                }),
              ]
            : [],
          dropdown: {
            ...mobileDropdown,
            columnconfig: {
              row: 1,
              column: 2,
            },
            cellconfig: {
              minHeight: `${rowHeight}px`,
              width: '200px',
            },
          },
          // Data for whichever column is selected
          typography:
            rows.length === 0
              ? [
                  {
                    columnconfig: {
                      row: 2,
                      column: checkboxSelection ? 2 : 1,
                    },
                    text: 'No data available',
                    cellconfig: { minHeight: `${rowHeight}px` },
                  },
                ]
              : rows.map((row, index) => {
                  const cellText = String(row[mobileSelectedColumn] ?? '')
                  return {
                    columnconfig: {
                      row: index + 2,
                      column: 2,
                    },
                    text: cellText,
                    cellconfig: {
                      minHeight: `${rowHeight}px`,
                      onClick: onRowClick ? () => onRowClick(row) : undefined,
                    },
                  }
                }),
        },
      ],
    }

    return (
      <StyledScrollBox>
        <ContentSection {...mobileOrTabletConfig} />
      </StyledScrollBox>
    )
  }
)

Table.displayName = 'Table'
export default Table

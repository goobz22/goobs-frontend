'use client'

import React from 'react'
import { TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import StyledTooltip from '../../../Tooltip'
import type { RowData, ColumnDef } from '../../types'

function getRowId(row: RowData): string {
  return String(row._id ?? row.id ?? '')
}

interface RowsProps {
  // Data & columns
  rows: RowData[]
  finalDesktopColumns: ColumnDef[]
  overflowDesktopColumns: ColumnDef[]
  selectedOverflowField: string

  // Mobile logic
  isMobile: boolean
  mobileSelectedColumn: string

  // Selections
  checkboxSelection: boolean
  selectedRows: string[]
  handleRowCheckboxChange: (rowId: string) => void

  // Row click
  onRowClick?: (row: RowData) => void
}

const Rows: React.FC<RowsProps> = ({
  rows,
  finalDesktopColumns,
  overflowDesktopColumns,
  selectedOverflowField,
  isMobile,
  mobileSelectedColumn,
  checkboxSelection,
  selectedRows,
  handleRowCheckboxChange,
  onRowClick,
}) => {
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          {checkboxSelection && <TableCell />}
          <TableCell colSpan={finalDesktopColumns.length || 1}>
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  // -------------------------------------
  // Mobile rendering (single column)
  // -------------------------------------
  if (isMobile) {
    return (
      <TableBody>
        {rows.map(row => {
          const rowId = getRowId(row)
          return (
            <TableRow
              key={rowId}
              hover
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {checkboxSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(rowId)}
                    onChange={() => handleRowCheckboxChange(rowId)}
                  />
                </TableCell>
              )}
              <TableCell
                sx={{
                  maxWidth: 200,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <StyledTooltip
                  title={String(row[mobileSelectedColumn] ?? '')}
                  tooltipcolor="#444"
                  tooltipplacement="top"
                  offsetX={0}
                  offsetY={5}
                  arrow
                >
                  <span>{String(row[mobileSelectedColumn] ?? '')}</span>
                </StyledTooltip>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }

  // -------------------------------------
  // Desktop/tablet rendering (multi column)
  // -------------------------------------
  return (
    <TableBody>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row)
        return (
          <TableRow
            key={rowId}
            hover
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {checkboxSelection && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(rowId)}
                  onChange={() => handleRowCheckboxChange(rowId)}
                />
              </TableCell>
            )}
            {finalDesktopColumns.map((col, columnIndex) => {
              // Handle overflow column
              if (col.field === '__overflow__') {
                const actualCol = overflowDesktopColumns.find(
                  c => c.field === selectedOverflowField
                )
                const fieldToRender = actualCol?.field
                const cellValue =
                  fieldToRender != null ? row[fieldToRender] : undefined

                return (
                  <TableCell
                    key={`overflow-${rowId}-${columnIndex}`}
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <StyledTooltip
                      title={String(cellValue ?? '')}
                      tooltipcolor="#444"
                      tooltipplacement="top"
                      offsetX={0}
                      offsetY={5}
                      arrow
                    >
                      <span>{String(cellValue ?? '')}</span>
                    </StyledTooltip>
                  </TableCell>
                )
              }

              // Normal column
              let cellContent: React.ReactNode
              if (typeof col.renderCell === 'function') {
                const cellParams = {
                  row,
                  value: row[col.field],
                  field: col.field,
                  rowIndex,
                  columnIndex,
                }
                cellContent = col.renderCell(cellParams)
              } else {
                cellContent = String(row[col.field] ?? '')
              }

              return (
                <TableCell
                  key={`${col.field}-${rowId}-${columnIndex}`}
                  sx={{
                    // Force ID columns to exactly 60px
                    ...(col.field === 'id' || col.field === '_id'
                      ? {
                          width: '60px',
                          minWidth: '60px',
                          maxWidth: '60px',
                        }
                      : {
                          maxWidth: 200,
                        }),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <StyledTooltip
                    title={String(cellContent ?? '')}
                    tooltipcolor="#444"
                    tooltipplacement="top"
                    offsetX={0}
                    offsetY={5}
                    arrow
                  >
                    <span>{cellContent}</span>
                  </StyledTooltip>
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default Rows

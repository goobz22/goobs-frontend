'use client'

import React from 'react'
import { TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import StyledTooltip from '../../../Tooltip'
import type { RowData, ColumnDef } from '../../types'
import { getRowId } from '../index'

interface RowsProps {
  rows: RowData[]
  finalDesktopColumns: ColumnDef[]
  overflowDesktopColumns: ColumnDef[]
  selectedOverflowField: string

  // Mobile logic
  isMobile: boolean
  mobileSelectedColumn: string

  // Current selected row IDs
  selectedRowIds: string[]

  // Row click
  onRowClick?: (row: RowData) => void

  // Toggling row checkbox
  onRowCheckboxChange: (rowId: string) => void
}

const Rows: React.FC<RowsProps> = ({
  rows,
  finalDesktopColumns,
  overflowDesktopColumns,
  selectedOverflowField,
  isMobile,
  mobileSelectedColumn,
  selectedRowIds,
  onRowClick,
  onRowCheckboxChange,
}) => {
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          {/* Extra cell for checkbox column */}
          <TableCell />
          <TableCell colSpan={finalDesktopColumns.length || 1}>
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  // -------------------------------------
  // Mobile: single-column approach
  // -------------------------------------
  if (isMobile) {
    return (
      <TableBody>
        {rows.map(row => {
          const rowId = getRowId(row)
          const isSelected = selectedRowIds.includes(rowId)

          return (
            <TableRow
              key={rowId}
              hover
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.08)' : 'unset',
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected}
                  onChange={e => {
                    e.stopPropagation()
                    onRowCheckboxChange(rowId)
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  maxWidth: 200,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingLeft: 5, // <--- changed to 5
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
  // Desktop/tablet: multi-column approach
  // -------------------------------------
  return (
    <TableBody>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row)
        const isSelected = selectedRowIds.includes(rowId)

        return (
          <TableRow
            key={rowId}
            hover
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.08)' : 'unset',
            }}
          >
            {/* Checkbox cell */}
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSelected}
                onChange={e => {
                  e.stopPropagation()
                  onRowCheckboxChange(rowId)
                }}
              />
            </TableCell>

            {finalDesktopColumns.map((col, columnIndex) => {
              // Overflow logic
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
                      paddingLeft: 5, // <--- changed to 5
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

              // Respect manual widths if present
              const widthStyles = col.width
                ? {
                    width: col.width,
                    minWidth: col.width,
                    maxWidth: col.width,
                  }
                : col.field === 'id' || col.field === '_id'
                  ? {
                      width: '60px',
                      minWidth: '60px',
                      maxWidth: '60px',
                    }
                  : {
                      maxWidth: 200,
                    }

              return (
                <TableCell
                  key={`${col.field}-${rowId}-${columnIndex}`}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingLeft: 1, // <--- changed to 5
                    ...widthStyles,
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

'use client'

import React from 'react'
import { TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import StyledTooltip from '../../../Tooltip'
import type { RowData, ColumnDef } from '../../types'
import { getRowId } from '../index'

/**
 * Safely convert a value to a string without triggering the default
 * '[object Object]' for objects. If the type is:
 *  - string/number/boolean => return it (lowercased if desired).
 *  - object => JSON.stringify it (or fallback to '').
 *  - null/undefined => ''.
 *  - otherwise => ''.
 */
function safeString(value: unknown): string {
  if (value == null) return ''

  switch (typeof value) {
    case 'string':
      // Return the string as-is or .toLowerCase() if you want consistency:
      return value
    case 'number':
    case 'boolean':
      return String(value)
    case 'object':
      try {
        return JSON.stringify(value)
      } catch {
        return ''
      }
    default:
      // e.g., symbol, function => ''
      return ''
  }
}

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

          // Safely stringify the mobile column value for tooltips
          const cellValueStr = safeString(row[mobileSelectedColumn])

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
                  title={cellValueStr}
                  tooltipcolor="#444"
                  tooltipplacement="top"
                  offsetX={0}
                  offsetY={5}
                  arrow
                >
                  <span>{cellValueStr}</span>
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
                const cellValueStr = safeString(cellValue)

                return (
                  <TableCell
                    key={`overflow-${rowId}-${columnIndex}`}
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingLeft: 5,
                    }}
                  >
                    <StyledTooltip
                      title={cellValueStr}
                      tooltipcolor="#444"
                      tooltipplacement="top"
                      offsetX={0}
                      offsetY={5}
                      arrow
                    >
                      <span>{cellValueStr}</span>
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
                // Because row[col.field] is unknown, cast to ReactNode or fallback to a string
                const val = row[col.field] as React.ReactNode | undefined
                // If it's not a valid ReactNode (e.g. object?), fallback to string:
                cellContent =
                  val && (typeof val === 'string' || React.isValidElement(val))
                    ? val
                    : safeString(val)
              }

              // Tooltip text needs a string, so convert cellContent safely
              const cellContentStr = safeString(cellContent)

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

              // Adjust cell styles for custom rendered cells that may contain lists
              const isCustomRendered = typeof col.renderCell === 'function'
              const cellStyles = {
                whiteSpace: isCustomRendered ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                paddingLeft: 1, // or 5 if desired
                ...(isCustomRendered ? { padding: '8px 4px' } : {}),
                ...widthStyles,
              }

              return (
                <TableCell
                  key={`${col.field}-${rowId}-${columnIndex}`}
                  sx={cellStyles}
                >
                  {React.isValidElement(cellContent) ? (
                    cellContent // Directly render React elements without wrapping in tooltip
                  ) : (
                    <StyledTooltip
                      title={cellContentStr}
                      tooltipcolor="#444"
                      tooltipplacement="top"
                      offsetX={0}
                      offsetY={5}
                      arrow
                    >
                      <span>{cellContent}</span>
                    </StyledTooltip>
                  )}
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

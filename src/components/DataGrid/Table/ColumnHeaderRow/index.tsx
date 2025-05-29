'use client'

import React from 'react'
import { TableRow, TableCell, Checkbox } from '@mui/material'
import type { ColumnDef } from '../../types'
import { white } from '../../../../styles/palette'
import SearchableDropdown from '../../../Field/Dropdown/Searchable'

interface ColumnHeaderRowProps {
  isMobile: boolean
  allRowsSelected: boolean
  someRowsSelected: boolean
  handleHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>

  // Desktop columns
  finalDesktopColumns: ColumnDef[]
  overflowDesktopColumns: ColumnDef[]

  // The entire columns array if we need them on mobile
  allColumns: ColumnDef[]

  // The chosen "overflow" column or mobile column
  selectedOverflowField: string
  setSelectedOverflowField: React.Dispatch<React.SetStateAction<string>>
}

const ColumnHeaderRow: React.FC<ColumnHeaderRowProps> = ({
  isMobile,
  allRowsSelected,
  someRowsSelected,
  handleHeaderCheckboxChange,
  finalDesktopColumns,
  overflowDesktopColumns,
  allColumns,
  selectedOverflowField,
  setSelectedOverflowField,
}) => {
  // If we're mobile, just render a single dropdown + "select all" checkbox
  if (isMobile) {
    const mobileOptions = allColumns.map(col => ({
      value: col.headerName ?? col.field, // Use headerName for display consistency
    }))

    // Find the currently-selected column as an object
    const currentMobileChoice =
      mobileOptions.find(opt => {
        // Find by matching either headerName or field
        const matchingColumn = allColumns.find(
          c => c.field === selectedOverflowField
        )
        return (
          matchingColumn &&
          opt.value === (matchingColumn.headerName ?? matchingColumn.field)
        )
      }) || (mobileOptions.length > 0 ? mobileOptions[0] : null)

    const handleMobileChange = (value: { value: string } | null) => {
      if (value && value.value) {
        // Find the column that matches the selected headerName/field
        const matchingColumn = allColumns.find(
          col => (col.headerName ?? col.field) === value.value
        )
        if (matchingColumn) {
          setSelectedOverflowField(matchingColumn.field)
        }
      } else {
        // Default to first column if no selection
        setSelectedOverflowField(
          allColumns.length > 0 ? allColumns[0].field : ''
        )
      }
    }

    return (
      <TableRow
        sx={{
          overflow: 'visible',
          '& th.MuiTableCell-head': {
            lineHeight: '45px !important',
            padding: '0px 5px 5px !important',
            verticalAlign: 'bottom',
          },
        }}
      >
        {/* "Select all" checkbox cell */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={allRowsSelected}
            indeterminate={!allRowsSelected && someRowsSelected}
            onChange={handleHeaderCheckboxChange}
          />
        </TableCell>

        {/* One cell for the single dropdown containing all columns */}
        <TableCell
          sx={{
            // Match the data cell width for consistency
            width: '100%',
            minWidth: 200,
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'visible',
            position: 'relative',
            zIndex: 100,
            paddingLeft: 0,
            paddingRight: 8,
          }}
        >
          <SearchableDropdown
            label="Columns"
            options={mobileOptions}
            defaultValue={currentMobileChoice?.value || ''}
            onChange={handleMobileChange}
            backgroundcolor={white.main}
            fontcolor="black"
            inputfontcolor="black"
            shrunkfontcolor="black"
            unshrunkfontcolor="black"
            shrunklabelposition="aboveNotch"
            style={{
              marginBottom: 0,
              marginTop: 0,
              width: '100%',
            }}
          />
        </TableCell>
      </TableRow>
    )
  }

  // ---------------------------
  // Desktop logic
  // ---------------------------
  const handleOverflowChange = (value: { value: string } | null) => {
    // If using headerName for value in dropdown, we need to find the corresponding field
    if (value && value.value) {
      // Try to find a column with matching headerName first
      const matchingColumn = overflowDesktopColumns.find(
        col => col.headerName === value.value || col.field === value.value
      )

      // If found, use its field property, otherwise use the value directly
      setSelectedOverflowField(
        matchingColumn ? matchingColumn.field : value.value
      )
    } else {
      setSelectedOverflowField('')
    }
  }

  return (
    <TableRow
      sx={{
        overflow: 'visible',
        '& th.MuiTableCell-head': {
          lineHeight: '45px !important',
          padding: '0px 5px 5px !important',
          verticalAlign: 'bottom',
        },
      }}
    >
      {/* "Select all" checkbox cell */}
      <TableCell padding="checkbox">
        <Checkbox
          checked={allRowsSelected}
          indeterminate={!allRowsSelected && someRowsSelected}
          onChange={handleHeaderCheckboxChange}
        />
      </TableCell>

      {/* Normal columns or the overflow dropdown cell */}
      {finalDesktopColumns.map(col => {
        if (col.field === '__overflow__') {
          return (
            <TableCell
              key="overflow-header"
              sx={{
                width: 275, // Increased width for dropdown (was 200)
                minWidth: 275,
                boxSizing: 'border-box',
                overflow: 'visible',
                position: 'relative',
                zIndex: 100, // Increased z-index to ensure dropdown appears above other elements
                paddingLeft: 0, // <-- remove left padding here
                height: '55px',
              }}
            >
              <SearchableDropdown
                label="More Columns"
                options={overflowDesktopColumns.map(oc => ({
                  value: oc.headerName ?? oc.field,
                }))}
                defaultValue={
                  selectedOverflowField
                    ? // Find the matching column's display name
                      (overflowDesktopColumns.find(
                        oc => oc.field === selectedOverflowField
                      )?.headerName ?? selectedOverflowField)
                    : // If no selection yet, use the first option's value
                      overflowDesktopColumns.length > 0
                      ? (overflowDesktopColumns[0].headerName ??
                        overflowDesktopColumns[0].field)
                      : ''
                }
                onChange={handleOverflowChange}
                backgroundcolor={white.main}
                fontcolor="black"
                inputfontcolor="black"
                shrunkfontcolor="black"
                unshrunkfontcolor="black"
                shrunklabelposition="onNotch"
                style={{
                  marginBottom: 0,
                  marginTop: 0,
                }}
              />
            </TableCell>
          )
        }

        // If col.width is set, we respect it; otherwise fallback.
        const widthStyles = col.width
          ? {
              width: col.width,
              minWidth: col.width,
              maxWidth: col.width,
            }
          : col.field === 'id' || col.field === '_id'
            ? {
                width: '100px',
                minWidth: '100px',
                maxWidth: '100px',
              }
            : {
                maxWidth: 200,
              }

        return (
          <TableCell
            key={col.field}
            sx={{
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              verticalAlign: 'bottom',
              paddingLeft: 0, // <-- remove left padding for normal columns
              ...widthStyles,
            }}
          >
            {col.headerName ?? col.field}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default ColumnHeaderRow

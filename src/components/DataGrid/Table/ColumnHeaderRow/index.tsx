'use client'

import React from 'react'
import { TableRow, TableCell, Checkbox } from '@mui/material'
import type { ColumnDef } from '../../types'
import { white } from '../../../../styles/palette'
import SearchableDropdown from '../../../SearchableDropdown'

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

  // The chosen “overflow” column or mobile column
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
  // If we're mobile, just render a single dropdown + “select all” checkbox
  if (isMobile) {
    const mobileOptions = allColumns.map(col => ({
      value: col.field,
      label: col.headerName ?? col.field,
    }))

    // Find the currently-selected column as an object
    const currentMobileChoice =
      mobileOptions.find(opt => opt.value === selectedOverflowField) || null

    const handleMobileChange = (value: { value: string } | null) => {
      setSelectedOverflowField(value?.value || '')
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
            // Enough width to hold the dropdown
            width: 275,
            boxSizing: 'border-box',
            overflow: 'visible',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <SearchableDropdown
            label="Columns"
            options={mobileOptions}
            // Set defaultValue or value depending on how you wrote your component:
            defaultValue={currentMobileChoice?.value || ''}
            onChange={handleMobileChange}
            backgroundcolor={white.main}
            fontcolor="black"
            inputfontcolor="black"
            shrunkfontcolor="black"
            unshrunkfontcolor="black"
            shrunklabelposition="aboveNotch"
          />
        </TableCell>
      </TableRow>
    )
  }

  // -------------------------------------
  // Otherwise, DESKTOP logic remains the same
  // -------------------------------------
  const handleOverflowChange = (value: { value: string } | null) => {
    setSelectedOverflowField(value?.value || '')
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
          // Overflow cell with "More Columns" searchable dropdown
          return (
            <TableCell
              key="overflow-header"
              sx={{
                width: 275,
                boxSizing: 'border-box',
                overflow: 'visible',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <SearchableDropdown
                label="More Columns"
                options={overflowDesktopColumns.map(oc => ({
                  value: oc.field,
                  label: oc.headerName ?? oc.field,
                }))}
                defaultValue={selectedOverflowField}
                onChange={handleOverflowChange}
                backgroundcolor={white.main}
                fontcolor="black"
                inputfontcolor="black"
                shrunkfontcolor="black"
                unshrunkfontcolor="black"
                shrunklabelposition="aboveNotch"
              />
            </TableCell>
          )
        }

        // Normal (non-overflow) column cell
        return (
          <TableCell
            key={col.field}
            sx={{
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              verticalAlign: 'bottom',
              ...(col.field === 'id' || col.field === '_id'
                ? {
                    width: '100px',
                    minWidth: '100px',
                    maxWidth: '100px',
                  }
                : {
                    maxWidth: 200,
                  }),
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

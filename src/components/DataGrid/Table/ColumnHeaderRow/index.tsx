'use client'

import React from 'react'
import { TableRow, TableCell, Checkbox, Box } from '@mui/material'
import type { ColumnDef } from '../../types'
import * as palette from '../../../../styles/palette'
import { black, white } from '../../../../styles/palette'
import SearchableDropdown from '../../../SearchableDropdown'
import type { SearchableDropdownProps } from '../../../SearchableDropdown'

interface ColumnHeaderRowProps {
  // For checkbox selection
  checkboxSelection: boolean
  allRowsSelected: boolean
  someRowsSelected: boolean
  handleHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>

  // Columns
  finalDesktopColumns: ColumnDef[]
  onColumnHeaderClick?: (field: string) => void
  selectedColumns: string[]

  // Overflow logic
  overflowDesktopColumns: ColumnDef[]
  selectedOverflowField: string
  setSelectedOverflowField: React.Dispatch<React.SetStateAction<string>>
}

const ColumnHeaderRow: React.FC<ColumnHeaderRowProps> = ({
  checkboxSelection,
  allRowsSelected,
  someRowsSelected,
  handleHeaderCheckboxChange,
  finalDesktopColumns,
  onColumnHeaderClick,
  selectedColumns,
  overflowDesktopColumns,
  setSelectedOverflowField,
}) => {
  // This dropdown is for columns that overflow
  const overflowDropdownProps: SearchableDropdownProps = {
    label: 'More Columns',
    options: overflowDesktopColumns.map(oc => ({ value: oc.field })),
    backgroundcolor: white.main,
    outlinecolor: 'none',
    fontcolor: black.main,
    shrunkfontcolor: black.main,
    unshrunkfontcolor: black.main,
    shrunklabelposition: 'aboveNotch',
    placeholder: 'Search...',
    onChange: newVal => {
      if (newVal) {
        setSelectedOverflowField(newVal.value)
      } else {
        setSelectedOverflowField('')
      }
    },
  }

  return (
    <TableRow
      sx={{
        '& th.MuiTableCell-head': {
          // Forced to 45px in the parent <TableHead> styles
          lineHeight: '45px !important',
          padding: '0px 5px !important',
          verticalAlign: 'middle',
        },
      }}
    >
      {checkboxSelection && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={allRowsSelected}
            indeterminate={!allRowsSelected && someRowsSelected}
            onChange={handleHeaderCheckboxChange}
          />
        </TableCell>
      )}
      {finalDesktopColumns.map(col => {
        if (col.field === '__overflow__') {
          return (
            <TableCell
              key="overflow-header"
              sx={{
                width: 250,
                verticalAlign: 'bottom',
                overflow: 'visible',
              }}
            >
              {/* Force the dropdown's OutlinedInput to 45px */}
              <Box
                sx={{
                  width: '250px',
                  position: 'relative',
                  height: '45px',
                  '& .MuiAutocomplete-root .MuiOutlinedInput-root': {
                    height: '45px !important',
                    minHeight: '45px !important',
                    lineHeight: '45px !important',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '5px !important',
                    paddingRight: '5px !important',
                  },
                }}
              >
                <SearchableDropdown {...overflowDropdownProps} />
              </Box>
            </TableCell>
          )
        }

        return (
          <TableCell
            key={col.field}
            onClick={
              onColumnHeaderClick
                ? () => onColumnHeaderClick(col.field)
                : undefined
            }
            sx={{
              backgroundColor: selectedColumns.includes(col.field)
                ? palette.marine.light
                : undefined,
              cursor: onColumnHeaderClick ? 'pointer' : 'default',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              verticalAlign: 'bottom',
              // Force ID columns to exactly 100px
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

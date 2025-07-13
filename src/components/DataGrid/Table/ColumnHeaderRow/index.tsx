'use client'

import React from 'react'
import type { ColumnDef } from '../../types'
import type { DataGridStyles } from '../../../../theme'
import SearchableDropdown from '../../../Field/Dropdown/Searchable'
import Checkbox from '../../../Checkbox'

interface ColumnHeaderRowProps {
  isMobile: boolean
  allRowsSelected: boolean
  someRowsSelected: boolean
  handleHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>
  finalDesktopColumns: ColumnDef[]
  overflowDesktopColumns: ColumnDef[]
  allColumns: ColumnDef[]
  selectedOverflowField: string
  setSelectedOverflowField: React.Dispatch<React.SetStateAction<string>>
  styles?: DataGridStyles
}

const getStyles = () => ({
  headerRow: {
    overflow: 'visible',
  } as React.CSSProperties,
  headerCell: {
    padding: '0 0 5px 0',
    lineHeight: '45px',
    verticalAlign: 'bottom',
  } as React.CSSProperties,
  checkboxCell: {
    padding: 0,
    width: '3rem',
  } as React.CSSProperties,
  mobileDropdownCell: {
    width: '100%',
    minWidth: '200px',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    overflow: 'visible',
    position: 'relative',
    zIndex: 50,
    paddingRight: '0.5rem',
  } as React.CSSProperties,
  overflowCell: {
    width: '275px',
    minWidth: '275px',
    boxSizing: 'border-box' as const,
    overflow: 'visible',
    position: 'relative',
    zIndex: 50,
    height: '55px',
  } as React.CSSProperties,
  columnHeader: (width?: number) =>
    ({
      userSelect: 'none',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      verticalAlign: 'bottom',
      padding: 0,
      width: width ? `${width}px` : undefined,
      minWidth: width ? `${width}px` : undefined,
      maxWidth: width ? `${width}px` : '200px',
    }) as React.CSSProperties,
})

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
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const componentStyles = getStyles()

  // Wrapper function to convert boolean to ChangeEvent
  const handleCheckboxChange = (checked: boolean) => {
    const fakeEvent = {
      target: { checked },
      currentTarget: { checked },
    } as React.ChangeEvent<HTMLInputElement>
    handleHeaderCheckboxChange(fakeEvent)
  }
  if (isMobile) {
    const mobileOptions = allColumns.map(col => ({
      value: col.headerName ?? col.field,
    }))
    const currentMobileChoice =
      mobileOptions.find(opt => {
        const matchingColumn = allColumns.find(
          c => c.field === selectedOverflowField
        )
        return (
          matchingColumn &&
          opt.value === (matchingColumn.headerName ?? matchingColumn.field)
        )
      }) || (mobileOptions.length > 0 ? mobileOptions[0] : null)

    const handleMobileChange = (value: { value: string } | null) => {
      if (value?.value) {
        const matchingColumn = allColumns.find(
          col => (col.headerName ?? col.field) === value.value
        )
        if (matchingColumn) setSelectedOverflowField(matchingColumn.field)
      } else {
        setSelectedOverflowField(
          allColumns.length > 0 ? allColumns[0].field : ''
        )
      }
    }

    return (
      <tr style={componentStyles.headerRow}>
        <th
          style={{
            ...componentStyles.headerCell,
            ...componentStyles.checkboxCell,
          }}
        >
          <Checkbox
            checked={allRowsSelected}
            indeterminate={someRowsSelected}
            onChange={handleCheckboxChange}
            styles={{
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
          />
        </th>
        <th
          style={{
            ...componentStyles.headerCell,
            ...componentStyles.mobileDropdownCell,
          }}
        >
          <SearchableDropdown
            label="Columns"
            options={mobileOptions}
            defaultValue={currentMobileChoice?.value || ''}
            onChange={handleMobileChange}
            styles={{
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
          />
        </th>
      </tr>
    )
  }

  const handleOverflowChange = (value: { value: string } | null) => {
    if (value?.value) {
      const matchingColumn = overflowDesktopColumns.find(
        col => col.headerName === value.value || col.field === value.value
      )
      setSelectedOverflowField(
        matchingColumn ? matchingColumn.field : value.value
      )
    } else {
      setSelectedOverflowField('')
    }
  }

  return (
    <tr style={componentStyles.headerRow}>
      <th
        style={{
          ...componentStyles.headerCell,
          ...componentStyles.checkboxCell,
        }}
      >
        <Checkbox
          checked={allRowsSelected}
          indeterminate={someRowsSelected}
          onChange={handleCheckboxChange}
          styles={{
            theme: isSacredTheme ? 'sacred' : 'light',
          }}
        />
      </th>
      {finalDesktopColumns.map(col => {
        if (col.field === '__overflow__') {
          return (
            <th
              key="overflow-header"
              style={{
                ...componentStyles.headerCell,
                ...componentStyles.overflowCell,
              }}
            >
              <SearchableDropdown
                label="More Columns"
                options={overflowDesktopColumns.map(oc => ({
                  value: oc.headerName ?? oc.field,
                }))}
                defaultValue={
                  selectedOverflowField
                    ? (overflowDesktopColumns.find(
                        oc => oc.field === selectedOverflowField
                      )?.headerName ?? selectedOverflowField)
                    : overflowDesktopColumns.length > 0
                      ? (overflowDesktopColumns[0].headerName ??
                        overflowDesktopColumns[0].field)
                      : ''
                }
                onChange={handleOverflowChange}
                styles={{
                  theme: isSacredTheme ? 'sacred' : 'light',
                }}
              />
            </th>
          )
        }
        return (
          <th
            key={col.field}
            style={{
              ...componentStyles.headerCell,
              ...componentStyles.columnHeader(col.width),
            }}
          >
            {col.headerName ?? col.field}
          </th>
        )
      })}
    </tr>
  )
}

export default ColumnHeaderRow

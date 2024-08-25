'use client'
import React from 'react'
import Dropdown, { DropdownProps } from './../../../Dropdown'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedDropdownProps extends DropdownProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useDropdown = (grid: {
  dropdown?: ExtendedDropdownProps | ExtendedDropdownProps[]
}) => {
  if (!grid.dropdown) return null

  const renderDropdown = (
    dropdownItem: ExtendedDropdownProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = dropdownItem

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

    const mergedConfig: columnconfig = {
      ...(itemColumnConfig as columnconfig),
      cellconfig: {
        ...cellconfig,
      },
      component: <Dropdown key={`dropdown-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.dropdown)) {
    return grid.dropdown.map(renderDropdown)
  } else {
    return [renderDropdown(grid.dropdown, 0)]
  }
}

export default useDropdown

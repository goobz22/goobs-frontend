'use client'
import React from 'react'
import SearchableDropdown, {
  SearchableDropdownProps,
} from './../../../SearchableDropdown'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedSearchableDropdownProps
  extends SearchableDropdownProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useSearchableDropdown = (grid: {
  searchableDropdown?:
    | ExtendedSearchableDropdownProps
    | ExtendedSearchableDropdownProps[]
}) => {
  if (!grid.searchableDropdown) return null

  const renderSearchableDropdown = (
    searchableDropdownItem: ExtendedSearchableDropdownProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = searchableDropdownItem

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
      component: (
        <SearchableDropdown
          key={`searchable-dropdown-${index}`}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.searchableDropdown)) {
    return grid.searchableDropdown.map(renderSearchableDropdown)
  } else {
    return [renderSearchableDropdown(grid.searchableDropdown, 0)]
  }
}

export default useSearchableDropdown

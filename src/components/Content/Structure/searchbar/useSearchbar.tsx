'use client'
import React from 'react'
import Searchbar, { SearchbarProps } from './../../../Searchbar'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedSearchbarProps extends SearchbarProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useSearchbar = (grid: {
  searchbar?: ExtendedSearchbarProps | ExtendedSearchbarProps[]
}) => {
  if (!grid.searchbar) return null

  const renderSearchbar = (
    searchbarItem: ExtendedSearchbarProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = searchbarItem

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
      component: <Searchbar key={`searchbar-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.searchbar)) {
    return grid.searchbar.map(renderSearchbar)
  } else {
    return [renderSearchbar(grid.searchbar, 0)]
  }
}

export default useSearchbar

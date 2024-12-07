'use client'
import React from 'react'
import { columnconfig, cellconfig } from '../../../Grid'
import DataGridCheckbox from './../../../../components/Checkbox'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedCheckboxProps {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
  onClick?: (event: React.MouseEvent) => void
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const useCheckbox = (grid: {
  checkbox?: ExtendedCheckboxProps | ExtendedCheckboxProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.checkbox) return null

  const renderCheckbox = (
    checkboxProps: ExtendedCheckboxProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = checkboxProps

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

    // Merge the existing columnconfig with the new props
    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: <DataGridCheckbox key={`checkbox-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.checkbox)) {
    return grid.checkbox.map(renderCheckbox)
  } else {
    return renderCheckbox(grid.checkbox, 0)
  }
}

export default useCheckbox

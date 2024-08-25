'use client'
import React from 'react'
import DateField, { DateFieldProps } from './../../../DateField'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedDateFieldProps extends DateFieldProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useDateField = (grid: {
  datefield?: ExtendedDateFieldProps | ExtendedDateFieldProps[]
}) => {
  if (!grid.datefield) return null

  const renderDateField = (
    dateFieldItem: ExtendedDateFieldProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = dateFieldItem

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
      component: <DateField key={`datefield-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.datefield)) {
    return grid.datefield.map(renderDateField)
  } else {
    return [renderDateField(grid.datefield, 0)]
  }
}

export default useDateField

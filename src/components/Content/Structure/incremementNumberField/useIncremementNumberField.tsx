'use client'
import React from 'react'
import IncrementNumberField, {
  IncrementNumberFieldProps,
} from './../../../IncrementNumberField'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedIncrementNumberFieldProps
  extends IncrementNumberFieldProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useIncrementNumberField = (grid: {
  incrementNumberField?:
    | ExtendedIncrementNumberFieldProps
    | ExtendedIncrementNumberFieldProps[]
}) => {
  if (!grid.incrementNumberField) return null

  const renderIncrementNumberField = (
    incrementNumberFieldItem: ExtendedIncrementNumberFieldProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = incrementNumberFieldItem

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
        <IncrementNumberField
          key={`increment-number-field-${index}`}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.incrementNumberField)) {
    return grid.incrementNumberField.map(renderIncrementNumberField)
  } else {
    return [renderIncrementNumberField(grid.incrementNumberField, 0)]
  }
}

export default useIncrementNumberField

'use client'
import React from 'react'
import NumberField, { NumberFieldProps } from './../../../NumberField'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedNumberFieldProps extends NumberFieldProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useNumberField = (grid: {
  numberField?: ExtendedNumberFieldProps | ExtendedNumberFieldProps[]
}) => {
  if (!grid.numberField) return null

  const renderNumberField = (
    numberFieldItem: ExtendedNumberFieldProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = numberFieldItem

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
      component: <NumberField key={`number-field-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.numberField)) {
    return grid.numberField.map(renderNumberField)
  } else {
    return [renderNumberField(grid.numberField, 0)]
  }
}

export default useNumberField

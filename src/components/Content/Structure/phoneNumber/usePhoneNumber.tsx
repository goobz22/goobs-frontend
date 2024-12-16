'use client'
import React from 'react'
import PhoneNumberField from '../../../PhoneNumberField'
import { columnconfig, cellconfig } from '../../../Grid'
import type { TextFieldProps } from '../../../TextField'

export type ExtendedPhoneNumberFieldProps = TextFieldProps & {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const usePhoneNumber = (grid: {
  phoneNumberField?:
    | ExtendedPhoneNumberFieldProps
    | ExtendedPhoneNumberFieldProps[]
}) => {
  if (!grid.phoneNumberField) return null

  const renderPhoneNumberField = (
    phoneNumberFieldItem: ExtendedPhoneNumberFieldProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = phoneNumberFieldItem

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
        <PhoneNumberField key={`phone-number-field-${index}`} {...restProps} />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.phoneNumberField)) {
    return grid.phoneNumberField.map(renderPhoneNumberField)
  } else {
    return [renderPhoneNumberField(grid.phoneNumberField, 0)]
  }
}

export default usePhoneNumber

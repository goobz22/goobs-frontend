'use client'
import React from 'react'
import PasswordField, { PasswordFieldProps } from './../../../PasswordField'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedPasswordFieldProps extends PasswordFieldProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const usePasswordField = (grid: {
  passwordField?: ExtendedPasswordFieldProps | ExtendedPasswordFieldProps[]
}) => {
  if (!grid.passwordField) return null

  const renderPasswordField = (
    passwordFieldItem: ExtendedPasswordFieldProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = passwordFieldItem

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
        <PasswordField key={`password-field-${index}`} {...restProps} />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.passwordField)) {
    return grid.passwordField.map(renderPasswordField)
  } else {
    return [renderPasswordField(grid.passwordField, 0)]
  }
}

export default usePasswordField

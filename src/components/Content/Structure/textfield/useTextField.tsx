import React from 'react'
import TextField, {
  CustomTextFieldProps,
} from '../../../../components/TextField'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedTextFieldProps
  extends Omit<CustomTextFieldProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useTextField = (grid: {
  textfield?: ExtendedTextFieldProps | ExtendedTextFieldProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.textfield) return null

  const renderTextField = (
    component: ExtendedTextFieldProps,
    index: number
  ): columnconfig => {
    const {
      name,
      label,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      error,
      InputProps,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = component

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
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <TextField
          key={`textfield-${index}`}
          name={name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          error={error}
          InputProps={InputProps}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.textfield)) {
    return grid.textfield.map(renderTextField)
  } else {
    return renderTextField(grid.textfield, 0)
  }
}

export default useTextField

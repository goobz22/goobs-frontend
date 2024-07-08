'use client'
import React from 'react'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../../../ConfirmationCodeInput'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedConfirmationCodeInputsProps
  extends Omit<ConfirmationCodeInputsProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useConfirmationInput = (grid: {
  confirmationcodeinput?:
    | ExtendedConfirmationCodeInputsProps
    | ExtendedConfirmationCodeInputsProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.confirmationcodeinput) return null

  const renderConfirmationInput = (
    confirmationCodeInputProps: ExtendedConfirmationCodeInputsProps,
    index: number
  ): columnconfig => {
    const {
      identifier,
      isValid,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = confirmationCodeInputProps

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

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <ConfirmationCodeInputs
          key={`confirmationcodeinput-${index}`}
          identifier={identifier}
          isValid={isValid}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.confirmationcodeinput)) {
    return grid.confirmationcodeinput.map(renderConfirmationInput)
  } else {
    return renderConfirmationInput(grid.confirmationcodeinput, 0)
  }
}

export default useConfirmationInput

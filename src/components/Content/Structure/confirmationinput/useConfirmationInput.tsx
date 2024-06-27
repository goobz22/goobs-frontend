'use client'
import React from 'react'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../../../ConfirmationCodeInput'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedConfirmationCodeInputsProps
  extends ConfirmationCodeInputsProps {
  columnconfig?: columnconfig
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

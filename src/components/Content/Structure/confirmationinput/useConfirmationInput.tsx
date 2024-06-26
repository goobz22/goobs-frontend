'use client'

import React from 'react'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from './../../../../components/ConfirmationCodeInput'
import { columnconfig } from 'goobs-repo'

const useConfirmationInput = (grid: {
  confirmationcodeinput?:
    | ConfirmationCodeInputsProps
    | ConfirmationCodeInputsProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.confirmationcodeinput) return null

  const renderConfirmationInput = (
    confirmationCodeInputProps: ConfirmationCodeInputsProps,
    index: number
  ): columnconfig => {
    const { identifier, isValid, columnconfig } = confirmationCodeInputProps

    // Extend the existing columnconfig with the component
    return {
      ...columnconfig,
      component: (
        <ConfirmationCodeInputs
          key={`confirmationcodeinput-${index}`}
          identifier={identifier}
          isValid={isValid}
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

'use client'
import React from 'react'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../../../ConfirmationCodeInput'

const useConfirmationInput = (props: {
  confirmationcodeinput?:
    | ConfirmationCodeInputsProps
    | ConfirmationCodeInputsProps[]
}): React.ReactElement[] | null => {
  if (!props.confirmationcodeinput) return null

  const renderConfirmationInput = (
    confirmationCodeInputProps: ConfirmationCodeInputsProps,
    index: number
  ): React.ReactElement => {
    return (
      <ConfirmationCodeInputs
        key={`confirmationcodeinput-${index}`}
        {...confirmationCodeInputProps}
      />
    )
  }

  if (Array.isArray(props.confirmationcodeinput)) {
    return props.confirmationcodeinput.map((item, index) =>
      renderConfirmationInput(item, index)
    )
  } else {
    return [renderConfirmationInput(props.confirmationcodeinput, 0)]
  }
}

export default useConfirmationInput

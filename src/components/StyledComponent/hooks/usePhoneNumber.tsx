import { StyledComponentProps } from '..'
import { formatPhoneNumber } from '../utils/formatPhoneNumber'
import React, { useCallback } from 'react'

export const usePhoneNumber = (
  props: StyledComponentProps & {
    onChange?: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
  }
) => {
  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target.value
      const digitsOnly = input.replace(/\D/g, '')
      const formattedValue = formatPhoneNumber(digitsOnly)

      if (props.onChange) {
        props.onChange({
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        })
      }
    },
    [props]
  )

  return {
    handlePhoneNumberChange,
  }
}

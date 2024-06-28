import { StyledComponentProps } from '..'
import React, { useCallback } from 'react'

/**
 * formatPhoneNumber function formats a given string of digits into a standard US phone number format.
 * It ensures the number starts with "+1" and adds the appropriate dashes for area code and subsequent digits.
 * @param value The string of digits to format.
 * @returns The formatted phone number string.
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // Ensure the number starts with +1
  let formattedNumber = '+1 '

  if (digits.length > 0) {
    // Add the area code
    formattedNumber += digits.slice(0, 3)

    if (digits.length > 3) {
      // Add first dash and next three digits
      formattedNumber += '-' + digits.slice(3, 6)

      if (digits.length > 6) {
        // Add second dash and last four digits
        formattedNumber += '-' + digits.slice(6, 10)
      }
    }
  }

  return formattedNumber
}

/**
 * usePhoneNumber hook provides functionality for handling phone number input changes.
 * It formats the input value using the formatPhoneNumber function and calls the onChange callback with the formatted value.
 * @param props The props for the phone number input component.
 * @returns An object containing the handlePhoneNumberChange function.
 */
export const usePhoneNumber = (
  props: StyledComponentProps & {
    onChange?: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
  }
) => {
  /**
   * handlePhoneNumberChange function is called when the phone number input value changes.
   * It formats the input value using the formatPhoneNumber function and calls the onChange callback with the formatted value.
   * @param e The change event triggered by the phone number input.
   */
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

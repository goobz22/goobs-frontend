'use client'

import React, { useState, useCallback } from 'react'

/**
 * Formats a string of digits into a US phone number format.
 * The "+1" country code is always added at the beginning.
 *
 * @param {string} value - The input string to be formatted.
 * @returns {string} A formatted phone number string.
 *
 * @example
 * formatPhoneNumber("1234567890") // returns "+1 123-456-7890"
 * formatPhoneNumber("12345") // returns "+1 123-45"
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  const limitedDigits = digits.slice(0, 10)
  let formattedNumber = '+1 '

  if (limitedDigits.length > 0) {
    formattedNumber += limitedDigits.slice(0, 3)
    if (limitedDigits.length > 3) {
      formattedNumber += '-' + limitedDigits.slice(3, 6)
      if (limitedDigits.length > 6) {
        formattedNumber += '-' + limitedDigits.slice(6)
      }
    }
  }
  return formattedNumber.trim()
}

/**
 * A custom React hook for managing and formatting a phone number input.
 *
 * @param {string} [initialValue=''] - The initial value of the phone number.
 * @param {string} [componentvariant=''] - The variant of the component.
 * @returns {Object} An object containing the current phone number state and functions to update it.
 * @property {string} phoneNumber - The current formatted phone number.
 * @property {function} handlePhoneNumberChange - A function to handle changes to the phone number input.
 * @property {function} updatePhoneNumber - A function to directly update the phone number.
 * @property {function} checkAndUpdatePhoneNumber - A function to check and update the phone number based on component variant and initial value.
 *
 * @example
 * const { phoneNumber, handlePhoneNumberChange, updatePhoneNumber, checkAndUpdatePhoneNumber } = usePhoneNumber();
 */
export const usePhoneNumber = (
  initialValue: string = '',
  componentvariant: string = ''
) => {
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(initialValue)
  )

  /**
   * Handles changes to the phone number input.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
   */
  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target.value
      let strippedInput = input.replace(/^\+1\s?/, '').replace(/\D/g, '')
      // Ensure we don't exceed 10 digits
      strippedInput = strippedInput.slice(0, 10)
      // Only format if there's actual input beyond "+1 "
      const formattedValue =
        strippedInput.length > 0 ? formatPhoneNumber(strippedInput) : '+1 '
      setPhoneNumber(formattedValue)
    },
    []
  )

  /**
   * Updates the phone number state with a new value.
   *
   * @param {string} newValue - The new phone number value to set.
   */
  const updatePhoneNumber = useCallback((newValue: string) => {
    setPhoneNumber(formatPhoneNumber(newValue))
  }, [])

  /**
   * Checks and updates the phone number based on component variant and initial value.
   * This function replaces the useEffect from the original implementation.
   */
  const checkAndUpdatePhoneNumber = useCallback(() => {
    if (componentvariant === 'phonenumber' && initialValue) {
      updatePhoneNumber(initialValue)
    }
  }, [componentvariant, initialValue, updatePhoneNumber])

  return {
    phoneNumber,
    handlePhoneNumberChange,
    updatePhoneNumber,
    checkAndUpdatePhoneNumber,
  }
}

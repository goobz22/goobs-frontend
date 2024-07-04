'use client'

import { useCallback } from 'react'
import { debounce } from 'lodash'
import { get, set, StringValue, JSONValue } from 'goobs-cache'

/**
 * Validates if the given string is in a valid email format
 * @param {string} email - The email string to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const result = emailRegex.test(email)
  return result
}

/**
 * Interface for helper footer messages
 */
export interface HelperFooterMessage {
  status: 'error' | 'success'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  formname: string
  required: boolean
}

/**
 * Custom hook for form validation and helper footer messages
 * @returns {Object} An object containing the validateField function
 */
export const useHelperFooter = () => {
  /**
   * Handles generic error creation for form fields
   */
  const handleGenericErrorCreation = useCallback(
    (
      formData: FormData,
      name: string,
      label: string,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const value = formData.get(name) as string

      if (required && (!value || !value.trim())) {
        return {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      return undefined
    },
    []
  )

  /**
   * Handles email validation and error creation
   */
  const handleEmailErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const email = formData.get('email') as string

      if (required && (!email || !email.trim())) {
        return {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      if (!email) {
        return undefined
      }

      if (email && !isValidEmailFormat(email)) {
        return {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      return {
        status: 'success',
        statusMessage: 'Email is valid.',
        spreadMessage: 'Email is valid.',
        spreadMessagePriority: 1,
        formname,
        required,
      }
    },
    []
  )

  /**
   * Handles password validation and error creation
   */
  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const password = formData.get('verifyPassword') as string

      // Store the password in the cache
      await set(
        'verifyPassword',
        { type: 'string', value: password } as StringValue,
        new Date(Date.now() + 30 * 60 * 1000),
        'client'
      )

      if (required && (!password || !password.trim())) {
        return {
          status: 'error',
          statusMessage: 'Password is required.',
          spreadMessage: 'Password is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      if (!password) {
        return undefined
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      const passwordComplexityStatus: 'error' | 'success' = passwordRegex.test(
        password
      )
        ? 'success'
        : 'error'

      if (passwordComplexityStatus === 'error') {
        return {
          status: 'error',
          statusMessage:
            'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
          spreadMessage: 'Invalid password.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      return {
        status: 'success',
        statusMessage: 'Password meets all requirements.',
        spreadMessage: 'Password is valid.',
        spreadMessagePriority: 1,
        formname,
        required,
      }
    },
    []
  )

  /**
   * Handles password confirmation validation and error creation
   */
  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const confirmPassword = formData.get('confirmPassword') as string

      if (required && (!confirmPassword || !confirmPassword.trim())) {
        return {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      if (!confirmPassword) {
        return undefined
      }

      const verifyPasswordResult = await get('verifyPassword', 'client')
      let verifyPassword: string | undefined

      if (
        verifyPasswordResult &&
        typeof verifyPasswordResult === 'object' &&
        'value' in verifyPasswordResult
      ) {
        verifyPassword = (verifyPasswordResult as StringValue).value
      }

      if (!verifyPassword) {
        return {
          status: 'error',
          statusMessage: 'Please enter your password first.',
          spreadMessage: 'Password not set.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      if (confirmPassword !== verifyPassword) {
        return {
          status: 'error',
          statusMessage: 'Passwords do not match.',
          spreadMessage: 'Passwords do not match.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      return {
        status: 'success',
        statusMessage: 'Passwords match.',
        spreadMessage: 'Passwords match.',
        spreadMessagePriority: 4,
        formname,
        required,
      }
    },
    []
  )

  /**
   * Handles phone number validation and error creation
   */
  const handlePhoneNumberErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const phoneNumber = formData.get('phoneNumber') as string

      if (required && (!phoneNumber || !phoneNumber.trim())) {
        return {
          status: 'error',
          statusMessage:
            'Phone number is required. Please enter a phone number.',
          spreadMessage: 'Phone number is required.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      if (!phoneNumber) {
        return undefined
      }

      const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
      const length = digitsOnly.length

      if (
        (length === 10 && !digitsOnly.startsWith('1')) ||
        (length === 11 && digitsOnly.startsWith('1'))
      ) {
        return {
          status: 'success',
          statusMessage: 'Phone number is valid.',
          spreadMessage: 'Phone number is valid.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      } else {
        return {
          status: 'error',
          statusMessage:
            'Please enter a valid 10-digit phone number or a 10-digit number starting with 1.',
          spreadMessage: 'Invalid phone number format.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }
    },
    []
  )

  /**
   * Validates a form field and updates the helper footer messages
   */
  const validateField = useCallback(
    (
      name: string,
      formData: FormData,
      label: string,
      required: boolean,
      formname: string
    ) => {
      const debouncedValidation = debounce(async () => {
        let validationResult: HelperFooterMessage | undefined

        // Determine which validation function to use based on the field name
        switch (name) {
          case 'email':
            validationResult = handleEmailErrorCreation(
              formData,
              required,
              formname
            )
            break
          case 'verifyPassword':
            validationResult = await handlePasswordErrorCreation(
              formData,
              required,
              formname
            )
            break
          case 'confirmPassword':
            validationResult = await handleConfirmPasswordErrorCreation(
              formData,
              required,
              formname
            )
            break
          case 'phoneNumber':
            validationResult = handlePhoneNumberErrorCreation(
              formData,
              required,
              formname
            )
            break
          default:
            validationResult = handleGenericErrorCreation(
              formData,
              name,
              label,
              required,
              formname
            )
        }

        // Update the helper footer messages in the cache
        const helperFooterResult = await get('helperFooter', 'client')
        let currentHelperFooter: Record<string, HelperFooterMessage> = {}
        if (
          helperFooterResult &&
          typeof helperFooterResult === 'object' &&
          'value' in helperFooterResult
        ) {
          currentHelperFooter = (helperFooterResult as JSONValue)
            .value as Record<string, HelperFooterMessage>
        }

        if (validationResult) {
          currentHelperFooter[name] = validationResult
        } else {
          delete currentHelperFooter[name]
        }

        await set(
          'helperFooter',
          { type: 'json', value: currentHelperFooter } as JSONValue,
          new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiration
          'client'
        )
      }, 300)

      debouncedValidation()
    },
    [
      handleEmailErrorCreation,
      handlePasswordErrorCreation,
      handleConfirmPasswordErrorCreation,
      handlePhoneNumberErrorCreation,
      handleGenericErrorCreation,
    ]
  )

  return {
    validateField,
  }
}

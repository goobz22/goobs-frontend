'use client'

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import React from 'react'
import { get, set, StringValue } from 'goobs-cache'

/**
 * Validates if the given string is a valid email format.
 *
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Represents a message for the helper footer.
 *
 * @interface HelperFooterMessage
 * @property {('error' | 'success')} status - The status of the message.
 * @property {string} statusMessage - The detailed status message.
 * @property {string} spreadMessage - A condensed version of the message for spreading.
 * @property {number} spreadMessagePriority - The priority of the spread message.
 * @property {string} formname - The name of the form this message is associated with.
 * @property {boolean} required - Indicates if the field associated with this message is required.
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
 * A custom hook for managing form validation and helper messages.
 *
 * @returns {Object} An object containing validation functions and helper footer state.
 */
export const useHelperFooter = () => {
  const [helperFooterValue, setHelperFooterValue] = useState<
    Record<string, HelperFooterMessage>
  >({})
  const helperFooterRef = useRef<Record<string, HelperFooterMessage>>({})

  /**
   * Handles creation of generic error messages for form fields.
   *
   * @param {FormData} formData - The form data to validate.
   * @param {string} name - The name of the form field.
   * @param {string} label - The label of the form field.
   * @param {boolean} required - Whether the field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} An error message object if there's an error, undefined otherwise.
   */
  const handleGenericErrorCreation = useCallback(
    (
      formData: FormData,
      name: string,
      label: string,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log(`Handling generic error creation for ${name}`)
      const value = formData.get(name) as string
      if (required && (!value || !value.trim())) {
        console.log(`Error: ${label} is required`)
        return {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }
      console.log(`No error for ${name}`)
      return undefined
    },
    []
  )

  /**
   * Handles creation of email-specific error messages.
   *
   * @param {FormData} formData - The form data to validate.
   * @param {boolean} required - Whether the email field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} An error or success message object, or undefined if no message is needed.
   */
  const handleEmailErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log('Handling email error creation')
      const email = formData.get('email') as string
      if (required && (!email || !email.trim())) {
        console.log('Error: Email is required')
        return {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }
      if (!email) return undefined
      if (email && !isValidEmailFormat(email)) {
        console.log('Error: Invalid email format')
        return {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }
      console.log('Email is valid')
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
   * Handles creation of password-specific error messages and stores the password in the client cache.
   *
   * @param {FormData} formData - The form data to validate.
   * @param {boolean} required - Whether the password field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} An error or success message object, or undefined if no message is needed.
   */
  const handlePasswordErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log('Handling password error creation')
      const password = formData.get('verifyPassword') as string
      console.log('Password received:', password)

      const debouncedPasswordStorage = debounce(async () => {
        console.log('Attempting to store password in goobs-cache client store')
        try {
          if (password) {
            console.log('Setting password in goobs-cache:', password)
            await set(
              'verifyPassword',
              { type: 'string', value: password } as StringValue,
              new Date(Date.now() + 30 * 60 * 1000),
              'client'
            )
            console.log('Password set operation completed')

            // Immediately retrieve the password to verify it was stored
            console.log('Attempting to retrieve password from client store')
            const storedPassword = await get('verifyPassword', 'client')
            console.log('Raw stored password result:', storedPassword)

            if (storedPassword && storedPassword.value) {
              console.log(
                'Immediately retrieved password from client store:',
                storedPassword.value
              )
            } else {
              console.log('Retrieved password is null or undefined')
            }
          } else {
            console.log('Password is null or empty, not storing in goobs-cache')
          }
        } catch (error) {
          console.error('Error interacting with goobs-cache:', error)
        }
      }, 2000)

      debouncedPasswordStorage()

      if (required && (!password || !password.trim())) {
        console.log('Error: Password is required')
        return {
          status: 'error',
          statusMessage: 'Password is required.',
          spreadMessage: 'Password is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }
      if (!password) return undefined
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      const passwordComplexityStatus: 'error' | 'success' = passwordRegex.test(
        password
      )
        ? 'success'
        : 'error'
      if (passwordComplexityStatus === 'error') {
        console.log('Error: Invalid password complexity')
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
      console.log('Password meets all requirements')
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
   * Handles creation of confirm password error messages by comparing with the stored password.
   *
   * @param {FormData} formData - The form data to validate.
   * @param {boolean} required - Whether the confirm password field is required.
   * @param {string} formname - The name of the form.
   * @returns {Promise<HelperFooterMessage | undefined>} A promise that resolves to an error or success message object, or undefined if no message is needed.
   */
  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('Handling confirm password error creation')
      const confirmPassword = formData.get('confirmPassword') as string
      console.log('Confirm password received:', confirmPassword)

      if (required && (!confirmPassword || !confirmPassword.trim())) {
        console.log('Error: Password confirmation is required')
        return {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }
      if (!confirmPassword) return undefined

      console.log(
        'Attempting to retrieve verify password from goobs-cache client store'
      )
      let verifyPasswordResult
      try {
        verifyPasswordResult = await get('verifyPassword', 'client')
        console.log('Retrieved verify password result:', verifyPasswordResult)
      } catch (error) {
        console.error('Error retrieving password from goobs-cache:', error)
      }

      let verifyPassword: string | undefined
      if (
        verifyPasswordResult &&
        typeof verifyPasswordResult === 'object' &&
        'value' in verifyPasswordResult &&
        verifyPasswordResult.value &&
        typeof verifyPasswordResult.value === 'object' &&
        'value' in verifyPasswordResult.value
      ) {
        verifyPassword = verifyPasswordResult.value.value
        console.log('Verify password from client store:', verifyPassword)
      } else {
        console.log(
          'Verify password not found in client store or in unexpected format'
        )
      }

      if (!verifyPassword) {
        console.log('Error: Password not set')
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
        console.log('Error: Passwords do not match')
        return {
          status: 'error',
          statusMessage: 'Passwords do not match.',
          spreadMessage: 'Passwords do not match.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      console.log('Passwords match')
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
   * Handles creation of phone number error messages.
   *
   * @param {FormData} formData - The form data to validate.
   * @param {boolean} required - Whether the phone number field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} An error or success message object, or undefined if no message is needed.
   */
  const handlePhoneNumberErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log('Handling phone number error creation')
      const phoneNumber = formData.get('phoneNumber') as string
      if (required && (!phoneNumber || !phoneNumber.trim())) {
        console.log('Error: Phone number is required')
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
      if (!phoneNumber) return undefined
      const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
      const length = digitsOnly.length
      if (
        (length === 10 && !digitsOnly.startsWith('1')) ||
        (length === 11 && digitsOnly.startsWith('1'))
      ) {
        console.log('Phone number is valid')
        return {
          status: 'success',
          statusMessage: 'Phone number is valid.',
          spreadMessage: 'Phone number is valid.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
      } else {
        console.log('Error: Invalid phone number format')
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
   * Validates a specific field in the form.
   *
   * @param {string} name - The name of the field to validate.
   * @param {FormData} formData - The form data to validate.
   * @param {string} label - The label of the field.
   * @param {boolean} required - Whether the field is required.
   * @param {string} formname - The name of the form.
   */
  const validateField = useCallback(
    (
      name: string,
      formData: FormData,
      label: string,
      required: boolean,
      formname: string
    ) => {
      console.log(`Validating field: ${name}`)
      const validation = () => {
        let validationResult: HelperFooterMessage | undefined
        switch (name) {
          case 'email':
            validationResult = handleEmailErrorCreation(
              formData,
              required,
              formname
            )
            break
          case 'verifyPassword':
            validationResult = handlePasswordErrorCreation(
              formData,
              required,
              formname
            )
            break
          case 'confirmPassword':
            handleConfirmPasswordErrorCreation(
              formData,
              required,
              formname
            ).then(result => {
              validationResult = result
              updateHelperFooter(name, validationResult)
            })
            return
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

        updateHelperFooter(name, validationResult)
      }

      validation()
    },
    [
      handleEmailErrorCreation,
      handlePasswordErrorCreation,
      handleConfirmPasswordErrorCreation,
      handlePhoneNumberErrorCreation,
      handleGenericErrorCreation,
    ]
  )

  const updateHelperFooter = (
    name: string,
    validationResult: HelperFooterMessage | undefined
  ) => {
    if (validationResult) {
      helperFooterRef.current = {
        ...helperFooterRef.current,
        [name]: validationResult,
      }
    } else {
      helperFooterRef.current = Object.fromEntries(
        Object.entries(helperFooterRef.current).filter(([key]) => key !== name)
      )
    }

    console.log('Updated helperFooterRef:', helperFooterRef.current)
    setHelperFooterValue({ ...helperFooterRef.current })
    console.log('Helper footer updated in state')
  }

  const validateRequiredField = useCallback(
    (required: boolean, formname: string, name: string, label: string) => {
      console.log('validateRequiredField: Starting', {
        required,
        formname,
        name,
        label,
      })
      if (required && formname && name && label) {
        console.log('validateRequiredField: Validating required field')
        const emptyFormData = new FormData()
        emptyFormData.append(name, '')
        validateField(name, emptyFormData, label, required, formname)
      } else {
        console.log(
          'validateRequiredField: Not validating (missing required props)'
        )
      }
    },
    [validateField]
  )

  const useShowErrorEffect = (
    formSubmitted: boolean,
    hasInput: boolean,
    isFocused: boolean,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    useEffect(() => {
      const showError = formSubmitted || (hasInput && !isFocused)
      console.log('useShowErrorEffect: Setting showError to', showError, {
        formSubmitted,
        hasInput,
        isFocused,
      })
      setShowError(showError)
    }, [formSubmitted, hasInput, isFocused, setShowError])
  }

  return useMemo(
    () => ({
      validateField,
      validateRequiredField,
      helperFooterValue,
      useShowErrorEffect,
    }),
    [validateField, validateRequiredField, helperFooterValue]
  )
}

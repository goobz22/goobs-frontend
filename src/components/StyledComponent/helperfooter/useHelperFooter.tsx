'use client'

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { get, set, StringValue, JSONValue } from 'goobs-cache'

/**
 * Validates if the given string is a valid email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Interface representing a helper footer message.
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
 * Custom hook for managing helper footer messages and form validation.
 * @returns {Object} An object containing functions and values for managing helper footers.
 */
export const useHelperFooter = () => {
  const [helperFooterValue, setHelperFooterValue] = useState<
    Record<string, HelperFooterMessage>
  >({})
  const helperFooterRef = useRef<Record<string, HelperFooterMessage>>({})

  /**
   * Stores a helper footer message in the cache.
   * @param {string} name - The name of the field associated with the message.
   * @param {HelperFooterMessage | undefined} message - The message to store, or undefined to remove the message.
   */
  const storeHelperFooter = useCallback(
    async (name: string, message: HelperFooterMessage | undefined) => {
      if (message) {
        const key = `helperFooter_${message.formname}_${name}`
        await set(
          key,
          { type: 'json', value: message } as JSONValue,
          new Date(Date.now() + 30 * 60 * 1000),
          'client'
        )
      }
    },
    []
  )

  /**
   * Fetches all helper footer messages for a given form.
   * @param {string} formname - The name of the form to fetch messages for.
   * @returns {Promise<HelperFooterMessage[]>} A promise that resolves to an array of HelperFooterMessages.
   */
  const fetchHelperFooters = useCallback(
    async (formname: string): Promise<HelperFooterMessage[]> => {
      const allKeys = (await get('helperFooter_keys', 'client')) as JSONValue
      const helperFooters: HelperFooterMessage[] = []
      if (allKeys && 'value' in allKeys && Array.isArray(allKeys.value)) {
        for (const key of allKeys.value) {
          if (
            typeof key === 'string' &&
            key.startsWith(`helperFooter_${formname}_`)
          ) {
            const result = (await get(key, 'client')) as JSONValue
            if (
              result &&
              'value' in result &&
              typeof result.value === 'object' &&
              result.value !== null
            ) {
              helperFooters.push(result.value as HelperFooterMessage)
            }
          }
        }
      }
      return helperFooters
    },
    []
  )

  /**
   * Updates the list of helper footer keys in the cache.
   * @param {string} name - The name of the new key to add.
   */
  const updateHelperFooterKeys = useCallback(async (name: string) => {
    const currentKeys = (await get('helperFooter_keys', 'client')) as JSONValue
    let keys: string[] = []
    if (
      currentKeys &&
      'value' in currentKeys &&
      Array.isArray(currentKeys.value)
    ) {
      keys = currentKeys.value as string[]
    }
    if (!keys.includes(`helperFooter_${name}`)) {
      keys.push(`helperFooter_${name}`)
      await set(
        'helperFooter_keys',
        { type: 'json', value: keys } as JSONValue,
        new Date(Date.now() + 30 * 60 * 1000),
        'client'
      )
    }
  }, [])

  /**
   * Handles generic error creation for form fields.
   * @param {FormData} formData - The form data.
   * @param {string} name - The name of the field.
   * @param {string} label - The label of the field.
   * @param {boolean} required - Whether the field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} A HelperFooterMessage if there's an error, undefined otherwise.
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
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter(name, message)
        updateHelperFooterKeys(name)
        return message
      }
      return undefined
    },
    [storeHelperFooter, updateHelperFooterKeys]
  )

  /**
   * Handles email-specific error creation.
   * @param {FormData} formData - The form data.
   * @param {boolean} required - Whether the email field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} A HelperFooterMessage if there's an error, undefined otherwise.
   */
  const handleEmailErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const email = formData.get('email') as string
      if (required && (!email || !email.trim())) {
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('email', message)
        updateHelperFooterKeys('email')
        return message
      }
      if (!email) return undefined
      if (email && !isValidEmailFormat(email)) {
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('email', message)
        updateHelperFooterKeys('email')
        return message
      }
      const message: HelperFooterMessage = {
        status: 'success',
        statusMessage: 'Email is valid.',
        spreadMessage: 'Email is valid.',
        spreadMessagePriority: 1,
        formname,
        required,
      }
      storeHelperFooter('email', message)
      updateHelperFooterKeys('email')
      return message
    },
    [storeHelperFooter, updateHelperFooterKeys]
  )

  /**
   * Handles password-specific error creation.
   * @param {FormData} formData - The form data.
   * @param {boolean} required - Whether the password field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} A HelperFooterMessage if there's an error, undefined otherwise.
   */
  const handlePasswordErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const password = formData.get('verifyPassword') as string
      console.log('handlePasswordErrorCreation - Password:', password)

      const debouncedPasswordStorage = debounce(async () => {
        try {
          if (password) {
            console.log('Storing password in goobs-cache...')
            await set(
              'verifyPassword',
              { type: 'string', value: password } as StringValue,
              new Date(Date.now() + 30 * 60 * 1000),
              'client'
            )
            console.log('Password stored successfully')
          } else {
            console.log('No password to store')
          }
        } catch (error) {
          console.error('Error interacting with goobs-cache:', error)
        }
      }, 2000)

      debouncedPasswordStorage()

      if (required && (!password || !password.trim())) {
        console.log('Password is required but not provided')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Password is required.',
          spreadMessage: 'Password is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
        storeHelperFooter('verifyPassword', message)
        updateHelperFooterKeys('verifyPassword')
        return message
      }
      if (!password) return undefined

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      const passwordComplexityStatus: 'error' | 'success' = passwordRegex.test(
        password
      )
        ? 'success'
        : 'error'
      console.log('Password complexity status:', passwordComplexityStatus)

      if (passwordComplexityStatus === 'error') {
        console.log('Password does not meet complexity requirements')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage:
            'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
          spreadMessage: 'Invalid password.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('verifyPassword', message)
        updateHelperFooterKeys('verifyPassword')
        return message
      }

      console.log('Password meets all requirements')
      const message: HelperFooterMessage = {
        status: 'success',
        statusMessage: 'Password meets all requirements.',
        spreadMessage: 'Password is valid.',
        spreadMessagePriority: 1,
        formname,
        required,
      }
      storeHelperFooter('verifyPassword', message)
      updateHelperFooterKeys('verifyPassword')
      return message
    },
    [storeHelperFooter, updateHelperFooterKeys]
  )

  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const confirmPassword = formData.get('confirmPassword') as string
      console.log(
        'handleConfirmPasswordErrorCreation - Confirm Password:',
        confirmPassword
      )

      if (required && (!confirmPassword || !confirmPassword.trim())) {
        console.log('Confirm password is required but not provided')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
        storeHelperFooter('confirmPassword', message)
        updateHelperFooterKeys('confirmPassword')
        return message
      }
      if (!confirmPassword) return undefined

      let verifyPasswordResult
      try {
        console.log('Retrieving password from goobs-cache...')
        verifyPasswordResult = await get('verifyPassword', 'client')
        console.log('Retrieved password result:', verifyPasswordResult)
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
        'value' in verifyPasswordResult.value &&
        typeof verifyPasswordResult.value.value === 'string'
      ) {
        verifyPassword = verifyPasswordResult.value.value
        console.log('Verify password retrieved:', verifyPassword)
      } else {
        console.log('Invalid or missing verify password result')
      }

      if (!verifyPassword) {
        console.log('Verify password not found')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Please enter your password first.',
          spreadMessage: 'Password not set.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
        storeHelperFooter('confirmPassword', message)
        updateHelperFooterKeys('confirmPassword')
        return message
      }

      console.log('Comparing passwords:', { confirmPassword, verifyPassword })
      if (confirmPassword !== verifyPassword) {
        console.log('Passwords do not match')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: 'Passwords do not match.',
          spreadMessage: 'Passwords do not match.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
        storeHelperFooter('confirmPassword', message)
        updateHelperFooterKeys('confirmPassword')
        return message
      }

      console.log('Passwords match')
      const message: HelperFooterMessage = {
        status: 'success',
        statusMessage: 'Passwords match.',
        spreadMessage: 'Passwords match.',
        spreadMessagePriority: 4,
        formname,
        required,
      }
      storeHelperFooter('confirmPassword', message)
      updateHelperFooterKeys('confirmPassword')
      return message
    },
    [storeHelperFooter, updateHelperFooterKeys]
  )

  /**
   * Handles phone number-specific error creation.
   * @param {FormData} formData - The form data.
   * @param {boolean} required - Whether the phone number field is required.
   * @param {string} formname - The name of the form.
   * @returns {HelperFooterMessage | undefined} A HelperFooterMessage if there's an error, undefined otherwise.
   */
  const handlePhoneNumberErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      const phoneNumber = formData.get('phoneNumber') as string
      if (required && (!phoneNumber || !phoneNumber.trim())) {
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage:
            'Phone number is required. Please enter a phone number.',
          spreadMessage: 'Phone number is required.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('phoneNumber', message)
        updateHelperFooterKeys('phoneNumber')
        return message
      }
      if (!phoneNumber) return undefined
      const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
      const length = digitsOnly.length
      if (
        (length === 10 && !digitsOnly.startsWith('1')) ||
        (length === 11 && digitsOnly.startsWith('1'))
      ) {
        const message: HelperFooterMessage = {
          status: 'success',
          statusMessage: 'Phone number is valid.',
          spreadMessage: 'Phone number is valid.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('phoneNumber', message)
        updateHelperFooterKeys('phoneNumber')
        return message
      } else {
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage:
            'Please enter a valid 10-digit phone number or a 10-digit number starting with 1.',
          spreadMessage: 'Invalid phone number format.',
          spreadMessagePriority: 1,
          formname,
          required,
        }
        storeHelperFooter('phoneNumber', message)
        updateHelperFooterKeys('phoneNumber')
        return message
      }
    },
    [storeHelperFooter, updateHelperFooterKeys]
  )

  /**
   * Updates the helper footer state and cache with new validation results.
   * @param {string} name - The name of the field.
   * @param {HelperFooterMessage | undefined} validationResult - The validation result for the field.
   */
  const updateHelperFooter = useCallback(
    (name: string, validationResult: HelperFooterMessage | undefined): void => {
      if (validationResult) {
        helperFooterRef.current = {
          ...helperFooterRef.current,
          [name]: validationResult,
        }
      } else {
        const newHelperFooter: Record<string, HelperFooterMessage> = {}
        Object.keys(helperFooterRef.current).forEach(key => {
          if (key !== name) {
            newHelperFooter[key] = helperFooterRef.current[key]
          }
        })
        helperFooterRef.current = newHelperFooter
      }

      setHelperFooterValue({ ...helperFooterRef.current })
      void storeHelperFooter(name, validationResult)
    },
    [storeHelperFooter]
  )

  /**
   * Validates a specific field in the form.
   * @param {string} name - The name of the field to validate.
   * @param {FormData} formData - The form data.
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
      const validation = async () => {
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
      updateHelperFooter,
    ]
  )

  /**
   * Validates a required field in the form.
   * @param {boolean} required - Whether the field is required.
   * @param {string} formname - The name of the form.
   * @param {string} name - The name of the field.
   * @param {string} label - The label of the field.
   */
  const validateRequiredField = useCallback(
    (required: boolean, formname: string, name: string, label: string) => {
      if (required && formname && name && label) {
        const emptyFormData = new FormData()
        emptyFormData.append(name, '')
        validateField(name, emptyFormData, label, required, formname)
      }
    },
    [validateField]
  )

  /**
   * Custom effect hook to manage the visibility of error messages.
   * @param {boolean} formSubmitted - Whether the form has been submitted.
   * @param {boolean} hasInput - Whether the field has input.
   * @param {boolean} isFocused - Whether the field is currently focused.
   * @returns {boolean} Whether the error should be shown.
   */
  const useShowErrorEffect = (
    formSubmitted: boolean,
    hasInput: boolean,
    isFocused: boolean
  ): boolean => {
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
      const shouldShowError = formSubmitted || (hasInput && !isFocused)
      setShowError(shouldShowError)
    }, [formSubmitted, hasInput, isFocused])

    return showError
  }

  return useMemo(
    () => ({
      validateField,
      validateRequiredField,
      helperFooterValue,
      useShowErrorEffect,
      fetchHelperFooters,
    }),
    [
      validateField,
      validateRequiredField,
      helperFooterValue,
      fetchHelperFooters,
    ]
  )
}

export default useHelperFooter

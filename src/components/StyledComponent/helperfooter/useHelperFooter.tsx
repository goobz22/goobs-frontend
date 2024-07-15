'use client'

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { get, set, StringValue, JSONValue } from 'goobs-cache'

const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export interface HelperFooterMessage {
  status: 'error' | 'success' | 'emptyAndRequired'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  required: boolean
}

export const useHelperFooter = () => {
  const [helperFooterValue, setHelperFooterValue] = useState<
    Record<string, HelperFooterMessage>
  >({})
  const helperFooterRef = useRef<Record<string, HelperFooterMessage>>({})

  const handleGenericErrorCreation = useCallback(
    async (
      formData: FormData,
      name: string,
      label: string,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const value = formData.get(name) as string
      if (required && (!value || !value.trim())) {
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: 1,
          required,
        }
        const jsonValue: JSONValue = {
          type: 'json',
          value: {
            [name]: {
              status: message.status,
              statusMessage: message.statusMessage,
              spreadMessage: message.spreadMessage,
              spreadMessagePriority: message.spreadMessagePriority,
              required: message.required,
            },
          },
        }
        await set('helperfooter', formname, jsonValue, 'client')
        console.log(
          `Stored helper footer for ${name}:`,
          message,
          `storeName: ${formname}`
        )
        return message
      }
      return undefined
    },
    []
  )

  const handleEmailErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const email = formData.get('email') as string
      let message: HelperFooterMessage | undefined

      if (required && (!email || !email.trim())) {
        message = {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          required,
        }
      } else if (email && !isValidEmailFormat(email)) {
        message = {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          required,
        }
      } else if (email) {
        message = {
          status: 'success',
          statusMessage: 'Email is valid.',
          spreadMessage: 'Email is valid.',
          spreadMessagePriority: 1,
          required,
        }
      }

      if (message) {
        const jsonValue: JSONValue = {
          type: 'json',
          value: {
            email: {
              status: message.status,
              statusMessage: message.statusMessage,
              spreadMessage: message.spreadMessage,
              spreadMessagePriority: message.spreadMessagePriority,
              required: message.required,
            },
          },
        }
        await set('helperfooter', formname, jsonValue, 'client')
        console.log(
          `Stored helper footer for email:`,
          message,
          `storeName: ${formname}`
        )
      }

      return message
    },
    []
  )

  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const password = formData.get('verifyPassword') as string
      console.log('handlePasswordErrorCreation - Password:', password)

      const debouncedPasswordStorage = debounce(async () => {
        try {
          if (password) {
            console.log('Storing password in goobs-cache...')
            await set(
              'validate',
              formname,
              { type: 'string', value: password } as StringValue,
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

      let message: HelperFooterMessage | undefined

      if (required && (!password || !password.trim())) {
        message = {
          status: 'error',
          statusMessage: 'Password is required.',
          spreadMessage: 'Password is required.',
          spreadMessagePriority: 4,
          required,
        }
      } else if (password) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const passwordComplexityStatus: 'error' | 'success' =
          passwordRegex.test(password) ? 'success' : 'error'

        if (passwordComplexityStatus === 'error') {
          message = {
            status: 'error',
            statusMessage:
              'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
            spreadMessage: 'Invalid password.',
            spreadMessagePriority: 1,
            required,
          }
        } else {
          message = {
            status: 'success',
            statusMessage: 'Password meets all requirements.',
            spreadMessage: 'Password is valid.',
            spreadMessagePriority: 1,
            required,
          }
        }
      }

      if (message) {
        const jsonValue: JSONValue = {
          type: 'json',
          value: {
            verifyPassword: {
              status: message.status,
              statusMessage: message.statusMessage,
              spreadMessage: message.spreadMessage,
              spreadMessagePriority: message.spreadMessagePriority,
              required: message.required,
            },
          },
        }
        await set('helperfooter', formname, jsonValue, 'client')
        console.log(
          `Stored helper footer for verifyPassword:`,
          message,
          `storeName: ${formname}`
        )
      }

      return message
    },
    []
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

      let message: HelperFooterMessage | undefined

      if (required && (!confirmPassword || !confirmPassword.trim())) {
        message = {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 4,
          required,
        }
      } else if (confirmPassword) {
        let verifyPasswordResult
        try {
          console.log('Retrieving password from goobs-cache...')
          verifyPasswordResult = await get('validate', formname, 'client')
          console.log('Retrieved password result:', verifyPasswordResult)
        } catch (error) {
          console.error('Error retrieving password from goobs-cache:', error)
        }

        let verifyPassword: string | undefined
        if (
          verifyPasswordResult &&
          typeof verifyPasswordResult === 'object' &&
          'type' in verifyPasswordResult &&
          verifyPasswordResult.type === 'string' &&
          'value' in verifyPasswordResult &&
          typeof verifyPasswordResult.value === 'string'
        ) {
          verifyPassword = verifyPasswordResult.value
          console.log('Verify password retrieved:', verifyPassword)
        } else {
          console.log('Invalid or missing verify password result')
        }

        if (!verifyPassword) {
          message = {
            status: 'error',
            statusMessage: 'Please enter your password first.',
            spreadMessage: 'Password not set.',
            spreadMessagePriority: 4,
            required,
          }
        } else if (confirmPassword !== verifyPassword) {
          message = {
            status: 'error',
            statusMessage: 'Passwords do not match.',
            spreadMessage: 'Passwords do not match.',
            spreadMessagePriority: 4,
            required,
          }
        } else {
          message = {
            status: 'success',
            statusMessage: 'Passwords match.',
            spreadMessage: 'Passwords match.',
            spreadMessagePriority: 4,
            required,
          }
        }
      }

      if (message) {
        const jsonValue: JSONValue = {
          type: 'json',
          value: {
            confirmPassword: {
              status: message.status,
              statusMessage: message.statusMessage,
              spreadMessage: message.spreadMessage,
              spreadMessagePriority: message.spreadMessagePriority,
              required: message.required,
            },
          },
        }
        await set('helperfooter', formname, jsonValue, 'client')
        console.log(
          `Stored helper footer for confirmPassword:`,
          message,
          `storeName: ${formname}`
        )
      }

      return message
    },
    []
  )

  const handlePhoneNumberErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const phoneNumber = formData.get('phoneNumber') as string
      let message: HelperFooterMessage | undefined

      if (required && (!phoneNumber || !phoneNumber.trim())) {
        message = {
          status: 'error',
          statusMessage:
            'Phone number is required. Please enter a phone number.',
          spreadMessage: 'Phone number is required.',
          spreadMessagePriority: 1,
          required,
        }
      } else if (phoneNumber) {
        const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
        const length = digitsOnly.length
        if (
          (length === 10 && !digitsOnly.startsWith('1')) ||
          (length === 11 && digitsOnly.startsWith('1'))
        ) {
          message = {
            status: 'success',
            statusMessage: 'Phone number is valid.',
            spreadMessage: 'Phone number is valid.',
            spreadMessagePriority: 1,
            required,
          }
        } else {
          message = {
            status: 'error',
            statusMessage:
              'Please enter a valid 10-digit phone number or a 10-digit number starting with 1.',
            spreadMessage: 'Invalid phone number format.',
            spreadMessagePriority: 1,
            required,
          }
        }
      }

      if (message) {
        const jsonValue: JSONValue = {
          type: 'json',
          value: {
            phoneNumber: {
              status: message.status,
              statusMessage: message.statusMessage,
              spreadMessage: message.spreadMessage,
              spreadMessagePriority: message.spreadMessagePriority,
              required: message.required,
            },
          },
        }
        await set('helperfooter', formname, jsonValue, 'client')
        console.log(
          `Stored helper footer for phoneNumber:`,
          message,
          `storeName: ${formname}`
        )
      }

      return message
    },
    []
  )

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
    },
    []
  )

  const initializeRequiredFields = useCallback(
    async (formname: string) => {
      console.log(`Initializing required fields for ${formname}`)
      const fields = await get('helperfooter', formname, 'client')
      if (
        fields &&
        typeof fields === 'object' &&
        'type' in fields &&
        fields.type === 'json' &&
        'value' in fields
      ) {
        Object.entries(fields.value as Record<string, unknown>).forEach(
          ([field, message]) => {
            if (message && typeof message === 'object' && 'status' in message) {
              updateHelperFooter(field, message as HelperFooterMessage)
              console.log(`Initialized required field ${field}:`, message)
            }
          }
        )
      }
    },
    [updateHelperFooter]
  )

  const validateField = useCallback(
    async (
      name: string,
      formData: FormData,
      label: string,
      required: boolean,
      formname: string
    ) => {
      console.log(`Validating field: ${name}`)
      let validationResult: HelperFooterMessage | undefined

      switch (name) {
        case 'email':
          validationResult = await handleEmailErrorCreation(
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
          validationResult = await handlePhoneNumberErrorCreation(
            formData,
            required,
            formname
          )
          break
        default:
          validationResult = await handleGenericErrorCreation(
            formData,
            name,
            label,
            required,
            formname
          )
      }

      updateHelperFooter(name, validationResult)
      console.log(`Validation result for ${name}:`, validationResult)
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

  const validateRequiredField = useCallback(
    (required: boolean, formname: string, name: string, label: string) => {
      console.log(`Validating required field: ${name}`)
      if (required && formname && name && label) {
        const emptyFormData = new FormData()
        emptyFormData.append(name, '')
        validateField(name, emptyFormData, label, required, formname)
      }
    },
    [validateField]
  )

  const useShowErrorEffect = (
    formSubmitted: boolean,
    hasInput: boolean,
    isFocused: boolean
  ): boolean => {
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
      const shouldShowError = formSubmitted || (hasInput && !isFocused)
      setShowError(shouldShowError)
      console.log('Show error state updated:', shouldShowError)
    }, [formSubmitted, hasInput, isFocused])

    return showError
  }

  const fetchHelperFooters = useCallback(
    async (formname: string): Promise<HelperFooterMessage[]> => {
      console.log(`Fetching helper footers for ${formname}`)
      const helperFooters = await get('helperfooter', formname, 'client')
      if (
        helperFooters &&
        typeof helperFooters === 'object' &&
        'type' in helperFooters &&
        helperFooters.type === 'json' &&
        'value' in helperFooters &&
        typeof helperFooters.value === 'object' &&
        helperFooters.value !== null
      ) {
        const value = helperFooters.value as Record<string, unknown>
        return Object.values(value).filter(
          (item): item is HelperFooterMessage => {
            return (
              typeof item === 'object' &&
              item !== null &&
              'status' in item &&
              'statusMessage' in item &&
              'spreadMessage' in item &&
              'spreadMessagePriority' in item &&
              'required' in item
            )
          }
        )
      }
      return []
    },
    []
  )

  return useMemo(
    () => ({
      validateField,
      validateRequiredField,
      helperFooterValue,
      useShowErrorEffect,
      initializeRequiredFields,
      fetchHelperFooters,
    }),
    [
      validateField,
      validateRequiredField,
      helperFooterValue,
      initializeRequiredFields,
      fetchHelperFooters,
    ]
  )
}

export default useHelperFooter

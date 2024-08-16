'use client'

import { useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { session } from 'goobs-cache'
import { ClientLogger } from 'goobs-testing'

const isValidEmailFormat = (email: string): boolean => {
  ClientLogger.debug('Validating email format:', { email })
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const isValid = emailRegex.test(email)
  ClientLogger.debug('Email format is valid:', { isValid })
  return isValid
}

export interface HelperFooterMessage {
  status: 'error' | 'success' | 'emptyAndRequired'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  required: boolean
  hasInput?: boolean
}

export const useInputHelperFooter = (
  helperFooterAtom: ReturnType<
    typeof session.atom<Record<string, HelperFooterMessage>>
  >
) => {
  ClientLogger.debug('useInputHelperFooter hook called')

  const validateAtom = useMemo(() => session.atom(''), [])

  const [helperFooterValue, setHelperFooters] =
    session.useAtom(helperFooterAtom)
  const [validateValue, setValidateValue] = session.useAtom(validateAtom)

  const handleGenericErrorCreation = useCallback(
    async (
      formData: FormData,
      name: string,
      label: string,
      formname: string,
      priority?: number
    ): Promise<HelperFooterMessage | undefined> => {
      ClientLogger.debug('handleGenericErrorCreation called:', {
        name,
        label,
        formname,
        priority,
      })
      const value = formData.get(name) as string
      ClientLogger.debug('Form data value:', { value })
      if (!value || !value.trim()) {
        ClientLogger.debug('Value is empty or whitespace')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: priority ?? 1,
          required: true,
        }
        ClientLogger.debug('Created error message:', { message })
        setHelperFooters(prev => ({ ...prev, [name]: message }))
        return message
      } else {
        ClientLogger.debug(
          'Value is not empty, removing helper footer from cache'
        )
        setHelperFooters(prev => {
          const newState = { ...prev }
          delete newState[name]
          return newState
        })
      }
      ClientLogger.debug('Returning undefined (no error)')
      return undefined
    },
    [setHelperFooters]
  )

  const handleEmailErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      ClientLogger.debug('handleEmailErrorCreation called:', { formname })
      const email = formData.get('email') as string
      ClientLogger.debug('Email value:', { email })
      let message: HelperFooterMessage | undefined

      if (!email || !email.trim()) {
        ClientLogger.debug('Email is empty or whitespace')
        message = {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          required: true,
        }
      } else if (!isValidEmailFormat(email)) {
        ClientLogger.debug('Email format is invalid')
        message = {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          required: true,
        }
      } else {
        ClientLogger.debug('Email is valid')
        message = {
          status: 'success',
          statusMessage: 'Email is valid.',
          spreadMessage: 'Email is valid.',
          spreadMessagePriority: 1,
          required: true,
        }
      }

      if (message) {
        ClientLogger.debug('Message created:', { message })
        if (message.status === 'success') {
          ClientLogger.debug('Removing helper footer from cache')
          setHelperFooters(prev => {
            const newState = { ...prev }
            delete newState['email']
            return newState
          })
        } else {
          setHelperFooters(prev => ({ ...prev, email: message }))
        }
      }

      ClientLogger.debug('Returning message:', { message })
      return message
    },
    [setHelperFooters]
  )

  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      ClientLogger.debug('handlePasswordErrorCreation called:', { formname })
      const password = formData.get('verifyPassword') as string
      ClientLogger.debug('Password value:', { passwordProvided: !!password })

      const debouncedPasswordStorage = debounce(() => {
        if (password) {
          ClientLogger.debug('Storing password in cache (debounced)')
          setValidateValue(password)
        }
      }, 2000)

      debouncedPasswordStorage()

      let message: HelperFooterMessage | undefined

      if (!password || !password.trim()) {
        ClientLogger.debug('Password is empty or whitespace')
        message = {
          status: 'error',
          statusMessage: 'Password is required.',
          spreadMessage: 'Password is required.',
          spreadMessagePriority: 2,
          required: true,
        }
      } else {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const passwordComplexityStatus: 'error' | 'success' =
          passwordRegex.test(password) ? 'success' : 'error'
        ClientLogger.debug('Password complexity status:', {
          passwordComplexityStatus,
        })

        if (passwordComplexityStatus === 'error') {
          message = {
            status: 'error',
            statusMessage:
              'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
            spreadMessage: 'Invalid password.',
            spreadMessagePriority: 1,
            required: true,
          }
        } else {
          message = {
            status: 'success',
            statusMessage: 'Password meets all requirements.',
            spreadMessage: 'Password is valid.',
            spreadMessagePriority: 1,
            required: true,
          }
        }
      }

      if (message) {
        ClientLogger.debug('Message created:', { message })
        if (message.status === 'success') {
          ClientLogger.debug('Removing helper footer from cache')
          setHelperFooters(prev => {
            const newState = { ...prev }
            delete newState['verifyPassword']
            return newState
          })
        } else {
          setHelperFooters(prev => ({ ...prev, verifyPassword: message }))
        }
      }

      ClientLogger.debug('Returning message:', { message })
      return message
    },
    [setHelperFooters, setValidateValue]
  )

  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      ClientLogger.debug('handleConfirmPasswordErrorCreation called:', {
        formname,
      })
      const confirmPassword = formData.get('confirmPassword') as string
      ClientLogger.debug('Confirm password value:', {
        passwordProvided: !!confirmPassword,
      })

      let message: HelperFooterMessage | undefined

      if (!confirmPassword || !confirmPassword.trim()) {
        ClientLogger.debug('Confirm password is empty or whitespace')
        message = {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 3,
          required: true,
        }
      } else {
        ClientLogger.debug('Fetched verify password from session atom')

        if (!validateValue) {
          ClientLogger.debug('Verify password not found')
          message = {
            status: 'error',
            statusMessage: 'Please enter your password first.',
            spreadMessage: 'Password not set.',
            spreadMessagePriority: 3,
            required: true,
          }
        } else if (confirmPassword !== validateValue) {
          ClientLogger.debug('Passwords do not match')
          message = {
            status: 'error',
            statusMessage: 'Passwords do not match.',
            spreadMessage: 'Passwords do not match.',
            spreadMessagePriority: 3,
            required: true,
          }
        } else {
          ClientLogger.debug('Passwords match')
          message = {
            status: 'success',
            statusMessage: 'Passwords match.',
            spreadMessage: 'Passwords match.',
            spreadMessagePriority: 3,
            required: true,
          }
        }
      }

      if (message) {
        ClientLogger.debug('Message created:', { message })
        if (message.status === 'success') {
          ClientLogger.debug('Removing helper footer from cache')
          setHelperFooters(prev => {
            const newState = { ...prev }
            delete newState['confirmPassword']
            return newState
          })
        } else {
          setHelperFooters(prev => ({ ...prev, confirmPassword: message }))
        }
      }

      ClientLogger.debug('Returning message:', { message })
      return message
    },
    [setHelperFooters, validateValue]
  )

  const handlePhoneNumberErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      ClientLogger.debug('handlePhoneNumberErrorCreation called:', { formname })
      const phoneNumber = formData.get('phoneNumber') as string
      ClientLogger.debug('Phone number value:', { phoneNumber })
      let message: HelperFooterMessage | undefined

      if (!phoneNumber || !phoneNumber.trim()) {
        ClientLogger.debug('Phone number is empty or whitespace')
        message = {
          status: 'error',
          statusMessage:
            'Phone number is required. Please enter a phone number.',
          spreadMessage: 'Phone number is required.',
          spreadMessagePriority: 3,
          required: true,
        }
      } else {
        const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
        const length = digitsOnly.length
        ClientLogger.debug('Phone number length (digits only):', { length })
        if (
          (length === 10 && !digitsOnly.startsWith('1')) ||
          (length === 11 && digitsOnly.startsWith('1'))
        ) {
          ClientLogger.debug('Phone number is valid')
          message = {
            status: 'success',
            statusMessage: 'Phone number is valid.',
            spreadMessage: 'Phone number is valid.',
            spreadMessagePriority: 1,
            required: true,
          }
        } else {
          ClientLogger.debug('Phone number is invalid')
          message = {
            status: 'error',
            statusMessage:
              'Please enter a valid 10-digit phone number or a 10-digit number starting with 1.',
            spreadMessage: 'Invalid phone number format.',
            spreadMessagePriority: 1,
            required: true,
          }
        }
      }

      if (message) {
        ClientLogger.debug('Message created:', { message })
        if (message.status === 'success') {
          ClientLogger.debug('Removing helper footer from cache')
          setHelperFooters(prev => {
            const newState = { ...prev }
            delete newState['phoneNumber']
            return newState
          })
        } else {
          setHelperFooters(prev => ({ ...prev, phoneNumber: message }))
        }
      }

      ClientLogger.debug('Returning message:', { message })
      return message
    },
    [setHelperFooters]
  )

  const updateHelperFooter = useCallback(
    (name: string, validationResult: HelperFooterMessage | undefined): void => {
      ClientLogger.debug('updateHelperFooter called:', {
        name,
        validationResult,
      })
      if (validationResult) {
        ClientLogger.debug('Updating helper footer with new validation result')
        setHelperFooters(prev => ({ ...prev, [name]: validationResult }))
      } else {
        ClientLogger.debug('Removing field from helper footer')
        setHelperFooters(prev => {
          const newState = { ...prev }
          delete newState[name]
          return newState
        })
      }

      ClientLogger.debug('Helper footer updated')
    },
    [setHelperFooters]
  )

  const validateField = useCallback(
    async (
      name: string,
      formData: FormData,
      label: string,
      formname: string,
      priority?: number
    ) => {
      ClientLogger.debug('validateField called:', {
        name,
        label,
        formname,
        priority,
      })
      let validationResult: HelperFooterMessage | undefined

      switch (name) {
        case 'email':
          ClientLogger.debug('Validating email field')
          validationResult = await handleEmailErrorCreation(formData, formname)
          break
        case 'verifyPassword':
          ClientLogger.debug('Validating password field')
          validationResult = await handlePasswordErrorCreation(
            formData,
            formname
          )
          break
        case 'confirmPassword':
          ClientLogger.debug('Validating confirm password field')
          validationResult = await handleConfirmPasswordErrorCreation(
            formData,
            formname
          )
          break
        case 'phoneNumber':
          ClientLogger.debug('Validating phone number field')
          validationResult = await handlePhoneNumberErrorCreation(
            formData,
            formname
          )
          break
        default:
          ClientLogger.debug('Validating generic field')
          validationResult = await handleGenericErrorCreation(
            formData,
            name,
            label,
            formname,
            priority
          )
      }

      ClientLogger.debug('Validation result:', { validationResult })
      updateHelperFooter(name, validationResult)
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

  const useShowErrorEffect = useCallback(
    (
      formSubmitted: boolean,
      hasInput: boolean,
      isFocused: boolean
    ): boolean => {
      ClientLogger.debug('useShowErrorEffect called:', {
        formSubmitted,
        hasInput,
        isFocused,
      })

      const shouldShowError = formSubmitted || (hasInput && !isFocused)
      ClientLogger.debug('Calculating shouldShowError:', {
        shouldShowError,
        formSubmitted,
        hasInput,
        isFocused,
      })

      ClientLogger.debug('Returning showError:', { shouldShowError })
      return shouldShowError
    },
    []
  )

  const fetchHelperFooters = useCallback(
    async (formname: string): Promise<HelperFooterMessage[]> => {
      ClientLogger.debug('fetchHelperFooters called:', { formname })
      ClientLogger.debug('Fetched helper footers from session atom:', {
        helperFooterValue,
      })

      const filteredHelperFooters = Object.values(helperFooterValue).filter(
        (item): item is HelperFooterMessage => {
          const isValidHelperFooter =
            typeof item === 'object' &&
            item !== null &&
            'status' in item &&
            'statusMessage' in item &&
            'spreadMessage' in item &&
            'spreadMessagePriority' in item &&
            'required' in item
          ClientLogger.debug('Checking if item is valid HelperFooterMessage:', {
            item,
            isValid: isValidHelperFooter,
          })
          return isValidHelperFooter
        }
      )
      ClientLogger.debug('Filtered helper footers:', { filteredHelperFooters })
      return filteredHelperFooters
    },
    [helperFooterValue]
  )

  const result = useMemo(
    () => ({
      validateField,
      useShowErrorEffect,
      fetchHelperFooters,
      helperFooterValue,
    }),
    [validateField, useShowErrorEffect, fetchHelperFooters, helperFooterValue]
  )

  ClientLogger.debug('useInputHelperFooter returning result:', { result })
  return result
}

export default useInputHelperFooter

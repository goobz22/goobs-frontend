'use client'

import { useCallback, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'
import { session } from 'goobs-cache'

const isValidEmailFormat = (email: string): boolean => {
  console.log('Validating email format:', email)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const isValid = emailRegex.test(email)
  console.log('Email format is valid:', isValid)
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

export const useInputHelperFooter = () => {
  console.log('useInputHelperFooter hook called')

  const helperFooterAtom = session.atom<
    | Record<string, HelperFooterMessage>
    | Promise<Record<string, HelperFooterMessage>>
  >({})
  const validateAtom = session.atom<string>('')

  const handleGenericErrorCreation = useCallback(
    async (
      formData: FormData,
      name: string,
      label: string,
      formname: string,
      priority?: number
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handleGenericErrorCreation called:', {
        name,
        label,
        formname,
        priority,
      })
      const value = formData.get(name) as string
      console.log('Form data value:', value)
      if (!value || !value.trim()) {
        console.log('Value is empty or whitespace')
        const message: HelperFooterMessage = {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: priority ?? 1,
          required: true,
        }
        console.log('Created error message:', message)
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        setHelperFooter(prev => {
          if (prev instanceof Promise) {
            return prev
          }
          return { ...prev, [name]: message }
        })
        return message
      } else {
        console.log('Value is not empty, removing helper footer from cache')
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        setHelperFooter(prev => {
          if (prev instanceof Promise) {
            return prev
          }
          const newState = { ...prev }
          delete newState[name]
          return newState
        })
      }
      console.log('Returning undefined (no error)')
      return undefined
    },
    [helperFooterAtom]
  )

  const handleEmailErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handleEmailErrorCreation called:', { formname })
      const email = formData.get('email') as string
      console.log('Email value:', email)
      let message: HelperFooterMessage | undefined

      if (!email || !email.trim()) {
        console.log('Email is empty or whitespace')
        message = {
          status: 'error',
          statusMessage: 'Please enter an email address.',
          spreadMessage: 'Email is required.',
          spreadMessagePriority: 1,
          required: true,
        }
      } else if (!isValidEmailFormat(email)) {
        console.log('Email format is invalid')
        message = {
          status: 'error',
          statusMessage: 'Please enter a valid email address.',
          spreadMessage: 'Invalid email format.',
          spreadMessagePriority: 1,
          required: true,
        }
      } else {
        console.log('Email is valid')
        message = {
          status: 'success',
          statusMessage: 'Email is valid.',
          spreadMessage: 'Email is valid.',
          spreadMessagePriority: 1,
          required: true,
        }
      }

      if (message) {
        console.log('Message created:', message)
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        if (message.status === 'success') {
          console.log('Removing helper footer from cache')
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            const newState = { ...prev }
            delete newState['email']
            return newState
          })
        } else {
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            return { ...prev, email: message! }
          })
        }
      }

      console.log('Returning message:', message)
      return message
    },
    [helperFooterAtom]
  )

  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handlePasswordErrorCreation called:', { formname })
      const password = formData.get('verifyPassword') as string
      console.log('Password value:', password ? '[REDACTED]' : 'empty')

      const [, setValidate] = session.useAtom(validateAtom)
      const debouncedPasswordStorage = debounce(() => {
        if (password) {
          console.log('Storing password in cache (debounced)')
          setValidate(password)
        }
      }, 2000)

      debouncedPasswordStorage()

      let message: HelperFooterMessage | undefined

      if (!password || !password.trim()) {
        console.log('Password is empty or whitespace')
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
        console.log('Password complexity status:', passwordComplexityStatus)

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
        console.log('Message created:', message)
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        if (message.status === 'success') {
          console.log('Removing helper footer from cache')
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            const newState = { ...prev }
            delete newState['verifyPassword']
            return newState
          })
        } else {
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            return { ...prev, verifyPassword: message }
          })
        }
      }

      console.log('Returning message:', message)
      return message
    },
    [helperFooterAtom, validateAtom]
  )

  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handleConfirmPasswordErrorCreation called:', { formname })
      const confirmPassword = formData.get('confirmPassword') as string
      console.log(
        'Confirm password value:',
        confirmPassword ? '[REDACTED]' : 'empty'
      )

      let message: HelperFooterMessage | undefined

      if (!confirmPassword || !confirmPassword.trim()) {
        console.log('Confirm password is empty or whitespace')
        message = {
          status: 'error',
          statusMessage: 'Please confirm your password.',
          spreadMessage: 'Password confirmation is required.',
          spreadMessagePriority: 3,
          required: true,
        }
      } else {
        const [verifyPassword] = session.useAtom(validateAtom)
        console.log('Fetched verify password from session atom')

        if (!verifyPassword) {
          console.log('Verify password not found')
          message = {
            status: 'error',
            statusMessage: 'Please enter your password first.',
            spreadMessage: 'Password not set.',
            spreadMessagePriority: 3,
            required: true,
          }
        } else if (confirmPassword !== verifyPassword) {
          console.log('Passwords do not match')
          message = {
            status: 'error',
            statusMessage: 'Passwords do not match.',
            spreadMessage: 'Passwords do not match.',
            spreadMessagePriority: 3,
            required: true,
          }
        } else {
          console.log('Passwords match')
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
        console.log('Message created:', message)
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        if (message.status === 'success') {
          console.log('Removing helper footer from cache')
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            const newState = { ...prev }
            delete newState['confirmPassword']
            return newState
          })
        } else {
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            return { ...prev, confirmPassword: message }
          })
        }
      }

      console.log('Returning message:', message)
      return message
    },
    [helperFooterAtom, validateAtom]
  )

  const handlePhoneNumberErrorCreation = useCallback(
    async (
      formData: FormData,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handlePhoneNumberErrorCreation called:', { formname })
      const phoneNumber = formData.get('phoneNumber') as string
      console.log('Phone number value:', phoneNumber)
      let message: HelperFooterMessage | undefined

      if (!phoneNumber || !phoneNumber.trim()) {
        console.log('Phone number is empty or whitespace')
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
        console.log('Phone number length (digits only):', length)
        if (
          (length === 10 && !digitsOnly.startsWith('1')) ||
          (length === 11 && digitsOnly.startsWith('1'))
        ) {
          console.log('Phone number is valid')
          message = {
            status: 'success',
            statusMessage: 'Phone number is valid.',
            spreadMessage: 'Phone number is valid.',
            spreadMessagePriority: 1,
            required: true,
          }
        } else {
          console.log('Phone number is invalid')
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
        console.log('Message created:', message)
        const [, setHelperFooter] = session.useAtom(helperFooterAtom)
        if (message.status === 'success') {
          console.log('Removing helper footer from cache')
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            const newState = { ...prev }
            delete newState['phoneNumber']
            return newState
          })
        } else {
          setHelperFooter(prev => {
            if (prev instanceof Promise) {
              return prev
            }
            return { ...prev, phoneNumber: message }
          })
        }
      }

      console.log('Returning message:', message)
      return message
    },
    [helperFooterAtom]
  )

  const updateHelperFooter = useCallback(
    (name: string, validationResult: HelperFooterMessage | undefined): void => {
      console.log('updateHelperFooter called:', { name, validationResult })
      const [, setHelperFooter] = session.useAtom(helperFooterAtom)
      if (validationResult) {
        console.log('Updating helper footer with new validation result')
        setHelperFooter(prev => {
          if (prev instanceof Promise) {
            return prev
          }
          return { ...prev, [name]: validationResult }
        })
      } else {
        console.log('Removing field from helper footer')
        setHelperFooter(prev => {
          if (prev instanceof Promise) {
            return prev
          }
          const newState = { ...prev }
          delete newState[name]
          return newState
        })
      }

      console.log('Setting new helper footer value')
    },
    [helperFooterAtom]
  )

  const validateField = useCallback(
    async (
      name: string,
      formData: FormData,
      label: string,
      formname: string,
      priority?: number
    ) => {
      console.log('validateField called:', { name, label, formname, priority })
      let validationResult: HelperFooterMessage | undefined

      switch (name) {
        case 'email':
          console.log('Validating email field')
          validationResult = await handleEmailErrorCreation(formData, formname)
          break
        case 'verifyPassword':
          console.log('Validating password field')
          validationResult = await handlePasswordErrorCreation(
            formData,
            formname
          )
          break
        case 'confirmPassword':
          console.log('Validating confirm password field')
          validationResult = await handleConfirmPasswordErrorCreation(
            formData,
            formname
          )
          break
        case 'phoneNumber':
          console.log('Validating phone number field')
          validationResult = await handlePhoneNumberErrorCreation(
            formData,
            formname
          )
          break
        default:
          console.log('Validating generic field')
          validationResult = await handleGenericErrorCreation(
            formData,
            name,
            label,
            formname,
            priority
          )
      }

      console.log('Validation result:', validationResult)
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

  const useShowErrorEffect = (
    formSubmitted: boolean,
    hasInput: boolean,
    isFocused: boolean
  ): boolean => {
    console.log('useShowErrorEffect called:', {
      formSubmitted,
      hasInput,
      isFocused,
    })
    const showErrorAtom = session.atom<boolean>(false)
    const [showError, setShowError] = session.useAtom(showErrorAtom)

    useEffect(() => {
      const shouldShowError = formSubmitted || (hasInput && !isFocused)
      console.log('Calculating shouldShowError:', {
        shouldShowError,
        formSubmitted,
        hasInput,
        isFocused,
      })
      setShowError(shouldShowError)
    }, [formSubmitted, hasInput, isFocused, setShowError])

    console.log('Returning showError:', showError)
    return showError
  }

  const fetchHelperFooters = useCallback(
    async (formname: string): Promise<HelperFooterMessage[]> => {
      console.log('fetchHelperFooters called:', { formname })
      const [helperFooters] = session.useAtom(helperFooterAtom)
      console.log('Fetched helper footers from session atom:', helperFooters)

      if (helperFooters instanceof Promise) {
        return []
      }

      const filteredHelperFooters = Object.values(helperFooters).filter(
        (item): item is HelperFooterMessage => {
          const isValidHelperFooter =
            typeof item === 'object' &&
            item !== null &&
            'status' in item &&
            'statusMessage' in item &&
            'spreadMessage' in item &&
            'spreadMessagePriority' in item &&
            'required' in item
          console.log('Checking if item is valid HelperFooterMessage:', {
            item,
            isValid: isValidHelperFooter,
          })
          return isValidHelperFooter
        }
      )
      console.log('Filtered helper footers:', filteredHelperFooters)
      return filteredHelperFooters
    },
    [helperFooterAtom]
  )

  const result = useMemo(
    () => ({
      validateField,
      useShowErrorEffect,
      fetchHelperFooters,
    }),
    [validateField, fetchHelperFooters]
  )

  console.log('useInputHelperFooter returning result:', result)
  return result
}

export default useInputHelperFooter

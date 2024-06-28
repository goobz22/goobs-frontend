'use client'

import { useCallback } from 'react'
import { debounce } from 'lodash'
import { useAtom } from 'jotai'
import {
  helperFooterAtom,
  HelperFooterMessage,
} from '../../../atoms/helperfooter'
import { get, set } from 'goobs-cache'

const isValidEmailFormat = (email: string): boolean => {
  console.log('Validating email format for:', email)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const result = emailRegex.test(email)
  console.log('Email validation result:', result)
  return result
}

export const useHelperFooter = () => {
  const [helperFooterAtomValue, setHelperFooterAtomValue] =
    useAtom(helperFooterAtom)

  console.log('useHelperFooter hook initialized')

  const handleGenericErrorCreation = useCallback(
    (
      formData: FormData,
      name: string,
      label: string,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log(`handleGenericErrorCreation called for ${name}`)
      const value = formData.get(name) as string

      if (required && (!value || !value.trim())) {
        console.log(`${name} is required but empty`)
        return {
          status: 'error',
          statusMessage: `${label} is required. Please enter a ${label.toLowerCase()}.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority: 1,
          formname,
          required,
        }
      }

      if (!value) {
        console.log(`${name} is empty, clearing error`)
        return undefined
      }

      console.log(`${name} is valid or not required`)
      return undefined
    },
    []
  )

  const handleEmailErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log('handleEmailErrorCreation called')
      const email = formData.get('email') as string
      console.log('Email value:', email)

      if (required && (!email || !email.trim())) {
        console.log('Email is required but empty')
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
        console.log('Email is empty, clearing error')
        return undefined
      }

      if (email && !isValidEmailFormat(email)) {
        console.log('Email format is invalid')
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

  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handlePasswordErrorCreation called')
      const password = formData.get('verifyPassword') as string
      console.log('Password value:', password)

      // Always store the password in the cache, even if it's invalid
      await set(
        'verifyPassword',
        { type: 'string', value: password },
        new Date(Date.now() + 30 * 60 * 1000)
      )
      console.log('Password stored in cache:', password)

      if (required && (!password || !password.trim())) {
        console.log('Password is required but empty')
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
        console.log('Password is empty, clearing error')
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
        console.log('Password does not meet complexity requirements')
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

      console.log('Password validation complete')
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

  const handleConfirmPasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      console.log('handleConfirmPasswordErrorCreation called')
      const confirmPassword = formData.get('confirmPassword') as string
      console.log('Confirm password value:', confirmPassword)

      if (required && (!confirmPassword || !confirmPassword.trim())) {
        console.log('Confirm password is required but empty')
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
        console.log('Confirm password is empty, clearing error')
        return undefined
      }

      const verifyPassword = await get('verifyPassword')
      console.log('Verify password retrieved from store:', verifyPassword)

      if (!verifyPassword) {
        console.log('Original password not found in store')
        return {
          status: 'error',
          statusMessage: 'Please enter your password first.',
          spreadMessage: 'Password not set.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      console.log('Comparing passwords:')
      console.log('Confirm password:', confirmPassword)
      console.log('Verify password:', verifyPassword)

      if (confirmPassword !== verifyPassword) {
        console.log('Passwords do not match')
        return {
          status: 'error',
          statusMessage: 'Passwords do not match.',
          spreadMessage: 'Passwords do not match.',
          spreadMessagePriority: 4,
          formname,
          required,
        }
      }

      console.log('Confirm password validation complete')
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

  const handlePhoneNumberErrorCreation = useCallback(
    (
      formData: FormData,
      required: boolean,
      formname: string
    ): HelperFooterMessage | undefined => {
      console.log('handlePhoneNumberErrorCreation called')
      const phoneNumber = formData.get('phoneNumber') as string
      console.log('Phone number value:', phoneNumber)

      if (required && (!phoneNumber || !phoneNumber.trim())) {
        console.log('Phone number is required but empty')
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
        console.log('Phone number is empty, clearing error')
        return undefined
      }

      const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
      const length = digitsOnly.length
      console.log('Phone number length (digits only):', length)

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
        console.log('Phone number is invalid')
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

  const getHelperFooterOption = useCallback(
    (name: string, label: string, required: boolean, formname: string) => {
      console.log(`getHelperFooterOption called for ${name}`)
      switch (name) {
        case 'email':
          console.log('Returning email validation function')
          return (formData: FormData) =>
            handleEmailErrorCreation(formData, required, formname)
        case 'verifyPassword':
          console.log('Returning password validation function')
          return (formData: FormData) =>
            handlePasswordErrorCreation(formData, required, formname)
        case 'confirmPassword':
          console.log('Returning confirm password validation function')
          return (formData: FormData) =>
            handleConfirmPasswordErrorCreation(formData, required, formname)
        case 'phoneNumber':
          console.log('Returning phone number validation function')
          return (formData: FormData) =>
            handlePhoneNumberErrorCreation(formData, required, formname)
        default:
          console.log('Returning generic validation function')
          return (formData: FormData) =>
            handleGenericErrorCreation(
              formData,
              name,
              label,
              required,
              formname
            )
      }
    },
    [
      handleEmailErrorCreation,
      handlePasswordErrorCreation,
      handleConfirmPasswordErrorCreation,
      handlePhoneNumberErrorCreation,
      handleGenericErrorCreation,
    ]
  )

  const validateField = useCallback(
    (
      name: string,
      formData: FormData,
      label: string,
      required: boolean,
      formname: string
    ) => {
      console.log(`validateField called for ${name}`)
      const helperFooterOption = getHelperFooterOption(
        name,
        label,
        required,
        formname
      )
      if (helperFooterOption) {
        const debouncedHelperFooterOption = debounce(async () => {
          console.log(`Debounced validation running for ${name}`)
          const validationResult = await helperFooterOption(formData)
          console.log(`Validation result for ${name}:`, validationResult)
          setHelperFooterAtomValue(prevState => {
            if (validationResult) {
              return { ...prevState, [name]: validationResult }
            } else {
              const newState = { ...prevState }
              delete newState[name]
              return newState
            }
          })
        }, 300)

        debouncedHelperFooterOption()
      } else {
        console.log(`No helper footer option found for ${name}`)
      }
    },
    [getHelperFooterOption, setHelperFooterAtomValue]
  )

  return {
    helperFooterAtomValue,
    validateField,
  }
}

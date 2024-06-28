'use client'

import { useCallback } from 'react'
import { debounce } from 'lodash'
import { useAtom } from 'jotai'
import {
  helperFooterAtom,
  HelperFooterMessage,
} from '../../../atoms/helperfooter'
import { get, set } from 'goobs-cache'

/**
 * isValidEmailFormat function checks if the provided email string is in a valid email format.
 * @param email The email string to validate.
 * @returns A boolean indicating whether the email is in a valid format.
 */
const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const result = emailRegex.test(email)
  return result
}

/**
 * useHelperFooter hook provides functions for validating form fields and managing helper footer messages.
 * It handles validation for email, password, confirm password, phone number, and generic fields.
 * @returns An object containing the helperFooterAtomValue and validateField function.
 */
export const useHelperFooter = () => {
  const [helperFooterAtomValue, setHelperFooterAtomValue] =
    useAtom(helperFooterAtom)

  /**
   * handleGenericErrorCreation function handles validation for generic form fields.
   * It checks if the field is required and not empty, and returns an error message if applicable.
   * @param formData The form data object containing field values.
   * @param name The name of the field being validated.
   * @param label The label of the field being validated.
   * @param required A boolean indicating whether the field is required.
   * @param formname The name of the form the field belongs to.
   * @returns A HelperFooterMessage object if an error is detected, otherwise undefined.
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
   * handleEmailErrorCreation function handles validation for email fields.
   * It checks if the email is required, not empty, and in a valid format.
   * @param formData The form data object containing field values.
   * @param required A boolean indicating whether the email field is required.
   * @param formname The name of the form the email field belongs to.
   * @returns A HelperFooterMessage object with the validation result.
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
   * handlePasswordErrorCreation function handles validation for password fields.
   * It checks if the password is required, not empty, and meets the complexity requirements.
   * @param formData The form data object containing field values.
   * @param required A boolean indicating whether the password field is required.
   * @param formname The name of the form the password field belongs to.
   * @returns A Promise that resolves to a HelperFooterMessage object with the validation result.
   */
  const handlePasswordErrorCreation = useCallback(
    async (
      formData: FormData,
      required: boolean,
      formname: string
    ): Promise<HelperFooterMessage | undefined> => {
      const password = formData.get('verifyPassword') as string

      // Always store the password in the cache, even if it's invalid
      await set(
        'verifyPassword',
        { type: 'string', value: password },
        new Date(Date.now() + 30 * 60 * 1000)
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
   * handleConfirmPasswordErrorCreation function handles validation for confirm password fields.
   * It checks if the confirm password is required, not empty, and matches the original password.
   * @param formData The form data object containing field values.
   * @param required A boolean indicating whether the confirm password field is required.
   * @param formname The name of the form the confirm password field belongs to.
   * @returns A Promise that resolves to a HelperFooterMessage object with the validation result.
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

      const verifyPassword = await get('verifyPassword')

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
   * handlePhoneNumberErrorCreation function handles validation for phone number fields.
   * It checks if the phone number is required, not empty, and in a valid format.
   * @param formData The form data object containing field values.
   * @param required A boolean indicating whether the phone number field is required.
   * @param formname The name of the form the phone number field belongs to.
   * @returns A HelperFooterMessage object with the validation result.
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
   * getHelperFooterOption function returns the appropriate validation function based on the field name.
   * @param name The name of the field being validated.
   * @param label The label of the field being validated.
   * @param required A boolean indicating whether the field is required.
   * @param formname The name of the form the field belongs to.
   * @returns The validation function for the specified field.
   */
  const getHelperFooterOption = useCallback(
    (name: string, label: string, required: boolean, formname: string) => {
      switch (name) {
        case 'email':
          return (formData: FormData) =>
            handleEmailErrorCreation(formData, required, formname)
        case 'verifyPassword':
          return (formData: FormData) =>
            handlePasswordErrorCreation(formData, required, formname)
        case 'confirmPassword':
          return (formData: FormData) =>
            handleConfirmPasswordErrorCreation(formData, required, formname)
        case 'phoneNumber':
          return (formData: FormData) =>
            handlePhoneNumberErrorCreation(formData, required, formname)
        default:
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

  /**
   * validateField function validates a specific form field and updates the helper footer atom.
   * It debounces the validation to prevent excessive updates.
   * @param name The name of the field being validated.
   * @param formData The form data object containing field values.
   * @param label The label of the field being validated.
   * @param required A boolean indicating whether the field is required.
   * @param formname The name of the form the field belongs to.
   */
  const validateField = useCallback(
    (
      name: string,
      formData: FormData,
      label: string,
      required: boolean,
      formname: string
    ) => {
      const helperFooterOption = getHelperFooterOption(
        name,
        label,
        required,
        formname
      )
      if (helperFooterOption) {
        const debouncedHelperFooterOption = debounce(async () => {
          const validationResult = await helperFooterOption(formData)
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
      }
    },
    [getHelperFooterOption, setHelperFooterAtomValue]
  )

  return {
    helperFooterAtomValue,
    validateField,
  }
}

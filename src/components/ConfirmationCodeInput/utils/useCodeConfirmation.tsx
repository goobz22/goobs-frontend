'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ConfirmationCodeInputsProps } from '..'

/**
 * Represents the state of each digit in the confirmation code.
 */
interface CodeState {
  code1: string
  code2: string
  code3: string
  code4: string
  code5: string
  code6: string
}

/**
 * Props for the useCodeConfirmation hook.
 * Extends ConfirmationCodeInputsProps and includes the code length.
 */
interface UseCodeConfirmationProps extends ConfirmationCodeInputsProps {
  /** The length of the confirmation code */
  codeLength: number
}

/**
 * useCodeConfirmation hook handles the state and logic for a confirmation code input.
 * It manages the code state, handles input changes, and provides keyboard navigation functionality.
 *
 * @param codeLength The length of the confirmation code.
 * @param isValid A boolean indicating whether the entered code is valid.
 * @returns An object containing handlers and state for the confirmation code input.
 */
export const useCodeConfirmation = ({
  codeLength,
  isValid,
}: UseCodeConfirmationProps) => {
  /** State to store each digit of the code */
  const [code, setCode] = useState<CodeState>({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  })

  /** State to store the color of the icon (indicating validity) */
  const [iconColor, setIconColor] = useState<string>('red')

  /**
   * Effect to update the icon color based on code validity
   */
  useEffect(() => {
    setIconColor(isValid ? 'green' : 'red')
  }, [isValid])

  /**
   * Handles changes in the code input fields.
   * Updates the code state when an input value changes.
   *
   * @param event The change event triggered by the input.
   * @param index The index of the input field (0-based).
   */
  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = event.target.value.replace(/[^0-9]/g, '')
      setCode(prevCode => ({
        ...prevCode,
        [`code${index + 1}`]: value,
      }))
    },
    []
  )

  /**
   * Handles keydown events on the input fields.
   * Provides functionality for backspace, left arrow, and right arrow keys.
   *
   * @param event The keydown event triggered by the input.
   * @param index The index of the input field (0-based).
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (
        event.key === 'Backspace' &&
        !code[`code${index + 1}` as keyof CodeState] &&
        index > 0
      ) {
        // Handle backspace when current field is empty
        setCode(prevCode => ({
          ...prevCode,
          [`code${index}`]: '',
        }))
      } else if (event.key === 'ArrowLeft') {
        // Handle left arrow key
        if (index > 0) {
          const prevInput = document.querySelector(
            `input[identifier=code${index}]`
          ) as HTMLInputElement | null
          if (prevInput) {
            prevInput.focus()
            setTimeout(() => {
              if (code[`code${index}` as keyof CodeState]) {
                prevInput.setSelectionRange(
                  prevInput.value.length,
                  prevInput.value.length
                )
              } else {
                prevInput.setSelectionRange(0, 0)
              }
            }, 0)
          }
        }
      } else if (event.key === 'ArrowRight') {
        // Handle right arrow key
        if (index < codeLength - 1) {
          const nextInput = document.querySelector(
            `input[identifier=code${index + 2}]`
          ) as HTMLInputElement | null
          if (nextInput) {
            nextInput.focus()
            setTimeout(() => {
              if (code[`code${index + 2}` as keyof CodeState]) {
                nextInput.setSelectionRange(
                  nextInput.value.length,
                  nextInput.value.length
                )
              } else {
                nextInput.setSelectionRange(0, 0)
              }
            }, 0)
          }
        }
      }
    },
    [code, codeLength]
  )

  /** Combines all code digits into a single string */
  const combinedCode = Object.values(code).join('')

  return {
    handleCodeChange,
    handleKeyDown,
    combinedCode,
    iconColor,
  }
}

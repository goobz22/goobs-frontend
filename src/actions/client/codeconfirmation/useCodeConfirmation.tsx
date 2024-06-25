'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ConfirmationCodeInputsProps } from './../../../components/ConfirmationCodeInput'

interface CodeState {
  code1: string
  code2: string
  code3: string
  code4: string
  code5: string
  code6: string
}

interface UseCodeConfirmationProps extends ConfirmationCodeInputsProps {
  codeLength: number
}

export const useCodeConfirmation = ({
  codeLength,
  isValid,
}: UseCodeConfirmationProps) => {
  const [code, setCode] = useState<CodeState>({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  })

  const [iconColor, setIconColor] = useState<string>('red')

  useEffect(() => {
    if (isValid) {
      setIconColor('green')
    } else {
      setIconColor('red')
    }
  }, [isValid])

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (
        event.key === 'Backspace' &&
        !code[`code${index + 1}` as keyof CodeState] &&
        index > 0
      ) {
        setCode(prevCode => ({
          ...prevCode,
          [`code${index}`]: '',
        }))
      } else if (event.key === 'ArrowLeft') {
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

  const combinedCode = Object.values(code).join('')

  return {
    handleCodeChange,
    handleKeyDown,
    combinedCode,
    iconColor,
  }
}

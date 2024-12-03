'use client'
import React, { ChangeEvent, KeyboardEvent, useState, useCallback } from 'react'
import { Input, Box } from '@mui/material'
import { columnconfig } from '../Grid'
import { red, green } from '../../styles/palette'

export interface ConfirmationCodeInputsProps {
  identifier?: string
  columnconfig?: columnconfig
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  onChange?: (value: string) => void
  value?: string
}

interface UseCodeConfirmationProps {
  codeLength: number
  onChange?: (value: string) => void
}

const useCodeConfirmation = ({
  codeLength,
  onChange,
}: UseCodeConfirmationProps) => {
  const [code, setCode] = useState<Record<string, string>>(
    Object.fromEntries(
      Array.from({ length: codeLength }, (_, i) => [`code${i + 1}`, ''])
    )
  )

  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = event.target.value.replace(/\D/g, '') // Only keep digits
      if (value.length <= 1) {
        // Only process if it's a single digit or empty
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index + 1}`]: value,
          }
          const combinedValue = Object.values(newCode).join('')
          onChange?.(combinedValue)
          return newCode
        })
      }
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      // Allow only numeric keys, navigation keys, and backspace
      const allowedKeys = [
        'Backspace',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Delete',
        'Home',
        'End',
      ]

      if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
        event.preventDefault()
        return
      }

      if (event.key === 'Backspace' && !code[`code${index + 1}`] && index > 0) {
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index}`]: '',
          }
          const combinedValue = Object.values(newCode).join('')
          onChange?.(combinedValue)
          return newCode
        })

        const prevInput = document.querySelector(
          `input[name=code${index}]`
        ) as HTMLInputElement | null
        if (prevInput) {
          prevInput.focus()
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        const prevInput = document.querySelector(
          `input[name=code${index}]`
        ) as HTMLInputElement | null
        if (prevInput) {
          prevInput.focus()
        }
      } else if (event.key === 'ArrowRight' && index < codeLength - 1) {
        const nextInput = document.querySelector(
          `input[name=code${index + 2}]`
        ) as HTMLInputElement | null
        if (nextInput) {
          nextInput.focus()
        }
      }
    },
    [code, codeLength, onChange]
  )

  return {
    handleCodeChange,
    handleKeyDown,
  }
}

const ConfirmationCodeInputs: React.FC<ConfirmationCodeInputsProps> = ({
  codeLength = 6,
  isValid,
  onChange,
  value,
  'aria-label': ariaLabel,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  ...props
}) => {
  const { handleCodeChange, handleKeyDown } = useCodeConfirmation({
    codeLength,
    onChange,
  })

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = event.target.value.replace(/\D/g, '') // Only keep digits
    if (inputValue.length <= 1) {
      // Only process if it's a single digit or empty
      handleCodeChange(event, index)
      if (inputValue) {
        const nextInput = document.querySelector(
          `input[name=code${index + 2}]`
        ) as HTMLInputElement | null
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const handleKeyDownWrapper = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    handleKeyDown(event, index)
  }

  // Split the value into individual digits
  const digits = value?.split('') || Array(codeLength).fill('')

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
    >
      <Box display="flex" gap={1}>
        {Array.from({ length: codeLength }, (_, index) => (
          <Input
            key={index}
            name={`code${index + 1}`}
            value={digits[index] || ''}
            inputProps={{
              maxLength: 1,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              'aria-label': `Code Digit ${index + 1}`,
              'aria-required': ariaRequired,
              'aria-invalid': ariaInvalid,
            }}
            sx={{
              border: '1px solid',
              borderColor: 'black',
              borderRadius: 1,
              width: 50,
              height: 50,
              input: {
                textAlign: 'center',
                color: 'black',
              },
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange(event, index)
            }
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDownWrapper(event, index)
            }
            {...props}
          />
        ))}
      </Box>
      <Box
        width={20}
        height={20}
        borderRadius="50%"
        bgcolor={isValid ? green.main : red.main}
        ml={2}
        role="status"
        aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
      />
    </Box>
  )
}

export default ConfirmationCodeInputs

'use client'
import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useCallback,
  FC,
} from 'react'
import { Input, Box } from '@mui/material'
import { red, green } from '../../styles/palette'

export interface ConfirmationCodeInputsProps {
  identifier?: string
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
      // Only keep digits
      const value = event.target.value.replace(/\D/g, '')
      if (value.length <= 1) {
        // Only process if it's a single digit or empty
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index + 1}`]: value,
          }
          // Combine all code pieces
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

      // If user pressed backspace on an empty input, move cursor to previous
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

        // Move focus to previous input
        const prevInput = document.querySelector<HTMLInputElement>(
          `input[name=code${index}]`
        )
        if (prevInput) {
          prevInput.focus()
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        // Move focus left
        const prevInput = document.querySelector<HTMLInputElement>(
          `input[name=code${index}]`
        )
        if (prevInput) {
          prevInput.focus()
        }
      } else if (event.key === 'ArrowRight' && index < codeLength - 1) {
        // Move focus right
        const nextInput = document.querySelector<HTMLInputElement>(
          `input[name=code${index + 2}]`
        )
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

const ConfirmationCodeInputs: FC<ConfirmationCodeInputsProps> = ({
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

  // For manual changes (typing digits), also handle auto-focus next field
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = event.target.value.replace(/\D/g, '') // Only keep digits
    if (inputValue.length <= 1) {
      handleCodeChange(event, index)
      if (inputValue) {
        const nextInput = document.querySelector<HTMLInputElement>(
          `input[name=code${index + 2}]`
        )
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

  // Safely create an array of string digits
  const digits: string[] = value
    ? value.split('')
    : Array.from({ length: codeLength }, () => '')

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

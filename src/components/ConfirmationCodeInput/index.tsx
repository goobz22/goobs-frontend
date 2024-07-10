'use client'
import React, { ChangeEvent, KeyboardEvent } from 'react'
import { Input, Box } from '@mui/material'
import { useCodeConfirmation } from './utils/useCodeConfirmation'
import { columnconfig } from '../../components/Grid'
import { red, green } from '../../styles/palette'
import { set } from 'goobs-cache'

export interface ConfirmationCodeInputsProps {
  identifier?: string
  columnconfig?: columnconfig
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
}

/**
 * ConfirmationCodeInputs component renders a set of input fields for entering a confirmation code.
 * It uses the useCodeConfirmation hook to handle code changes and key events.
 * @param props The props for the ConfirmationCodeInputs component.
 * @returns The rendered ConfirmationCodeInputs component.
 */
const ConfirmationCodeInputs: React.FC<ConfirmationCodeInputsProps> = ({
  codeLength = 6,
  isValid,
  'aria-label': ariaLabel,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  ...props
}) => {
  const { handleCodeChange, handleKeyDown, combinedCode } = useCodeConfirmation(
    {
      codeLength,
      isValid,
    }
  )

  /**
   * handleChange function is called when the value of an input field changes.
   * It updates the code state using the handleCodeChange function from the useCodeConfirmation hook.
   * If the input field has a value, it focuses on the next input field.
   * @param event The change event triggered by the input field.
   * @param index The index of the input field.
   */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    handleCodeChange(event, index)
    if (event.target.value) {
      const nextInput = document.querySelector(
        `input[name=code${index + 2}]`
      ) as HTMLInputElement | null
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  /**
   * handleKeyDownWrapper function is a wrapper for the handleKeyDown function from the useCodeConfirmation hook.
   * It is called when a key is pressed while an input field is focused.
   * @param event The keyboard event triggered by the input field.
   * @param index The index of the input field.
   */
  const handleKeyDownWrapper = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    handleKeyDown(event, index)
  }

  /**
   * useEffect hook is used to set the verification code into an atom using goobs-cache.
   * It sets the code whenever the combinedCode changes and the code is valid.
   */
  React.useEffect(() => {
    if (isValid) {
      set(
        'verificationCode',
        combinedCode,
        new Date(Date.now() + 3600000),
        'memory'
      )
    }
  }, [combinedCode, isValid])

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
            inputProps={{
              maxLength: 1,
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

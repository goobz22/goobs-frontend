'use client'

import React, { forwardRef, RefObject, ChangeEvent, KeyboardEvent } from 'react'
import { Input, Box, Icon, Typography, useTheme } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import { useCodeConfirmation } from '@/actions/client/codeconfirmation/useCodeConfirmation'
import { HelperFooterMessage } from '@/types/validation'

interface ConfirmationCodeInputsProps {
  helperfooter?: HelperFooterMessage
  name?: string
  index?: number
  inputRef?: RefObject<HTMLInputElement>
  // eslint-disable-next-line no-unused-vars
  onCodeChange?: (event: ChangeEvent<HTMLInputElement>, index: number) => void
  // eslint-disable-next-line no-unused-vars
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, index: number) => void
}

const ConfirmationCodeInputs: React.FC<ConfirmationCodeInputsProps> = ({
  helperfooter,
  ...props
}) => {
  const { inputRefs, handleCodeChange, handleKeyDown, combinedCode } =
    useCodeConfirmation(6)
  const theme = useTheme()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" gap={1}>
        {Array.from({ length: 6 }, (_, index) => (
          <ConfirmationCodeInput
            key={index}
            index={index}
            onCodeChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            inputRef={inputRefs.current[index]}
            helperfooter={helperfooter}
            {...props}
          />
        ))}
      </Box>
      <input type="hidden" name="verificationCode" value={combinedCode} />
      {helperfooter && (
        <>
          <Box mt={2}>
            <Icon
              component={
                helperfooter.status === 'success' ? CheckIcon : ErrorIcon
              }
              sx={{
                color:
                  helperfooter.status === 'success'
                    ? theme.palette.green.main
                    : theme.palette.red.main,
                fontSize: 20,
              }}
            />
          </Box>
          <Typography
            variant="merrihelperfooter"
            color={
              helperfooter.status === 'error'
                ? theme.palette.red.main
                : theme.palette.green.main
            }
            mt={1}
          >
            {helperfooter.statusMessage}
          </Typography>
        </>
      )}
    </Box>
  )
}

const ConfirmationCodeInput = forwardRef<
  HTMLInputElement,
  ConfirmationCodeInputsProps
>(function ConfirmationCodeInput({
  index = 0,
  onCodeChange,
  onKeyDown,
  inputRef,
  helperfooter,
  ...props
}) {
  const theme = useTheme()

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCodeChange) {
      onCodeChange(event, index)
    }
    if (event.target.value && inputRef?.current?.nextSibling) {
      ;(inputRef.current.nextSibling as HTMLInputElement).focus()
    }
  }

  // eslint-disable-next-line no-unused-vars
  return (
    <Input
      inputRef={inputRef}
      inputProps={{
        maxLength: 1,
      }}
      sx={{
        border: '1px solid',
        borderColor:
          helperfooter?.status === 'error'
            ? theme.palette.red.main
            : helperfooter?.status === 'success'
              ? theme.palette.green.dark
              : 'black',
        borderRadius: 1,
        width: 50,
        height: 50,
        input: {
          textAlign: 'center',
          color: 'black',
        },
      }}
      onChange={handleChange}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
        onKeyDown && onKeyDown(event, index)
      }
      {...props}
    />
  )
})

export default ConfirmationCodeInputs

'use client'
import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useCallback,
  FC,
} from 'react'
import { Input, Box } from '@mui/material'
import { red, green } from '../../styles/palette'
import CustomButton, { CustomButtonProps } from '../Button'

export interface ConfirmationCodeInputsProps {
  identifier?: string
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  onChange?: (value: string) => void
  value?: string

  /** Whether a verification code has been sent (to toggle between "Send Code" and "Resend Code") */
  codeSent?: boolean

  /** Callback function for when the Verify button is clicked */
  onVerify?: () => void | Promise<void>

  /** Callback function for when the Send/Resend button is clicked */
  onSendResend?: () => void | Promise<void>

  /** Custom props for the Verify button */
  verifyButtonProps?: Partial<CustomButtonProps>

  /** Custom props for the Send/Resend button */
  sendResendButtonProps?: Partial<CustomButtonProps>

  /** Whether to show action buttons (verify and send/resend) */
  showActionButtons?: boolean

  /** Whether to show the Send/Resend button. If false, only the Verify button will be shown. */
  showSendResendButton?: boolean
}

interface UseCodeConfirmationProps {
  codeLength: number
  onChange?: (value: string) => void
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  setInternalValue: React.Dispatch<React.SetStateAction<string>>
}

const useCodeConfirmation = ({
  codeLength,
  onChange,
  inputRefs,
  setInternalValue,
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

      // Handle the case when the input is cleared
      if (value === '') {
        // When clearing, we just update the code
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index + 1}`]: value,
          }
          // Combine all code pieces
          const combinedValue = Object.values(newCode).join('')

          // Update both internal state and external handler
          setInternalValue(combinedValue)
          onChange?.(combinedValue)
          return newCode
        })
        return
      }

      // Handle direct value setting via typing
      if (value.length <= 1) {
        // Only process if it's a single digit or empty
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index + 1}`]: value,
          }
          // Combine all code pieces
          const combinedValue = Object.values(newCode).join('')

          // Update both internal state and external handler
          setInternalValue(combinedValue)
          onChange?.(combinedValue)
          return newCode
        })
      }
    },
    [onChange, setInternalValue]
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
        event.preventDefault()
        setCode(prevCode => {
          const newCode = {
            ...prevCode,
            [`code${index}`]: '',
          }
          const combinedValue = Object.values(newCode).join('')

          // Update both internal state and external handler
          setInternalValue(combinedValue)
          onChange?.(combinedValue)
          return newCode
        })

        // Move focus to previous input
        setTimeout(() => {
          if (inputRefs && inputRefs.current && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus()
          }
        }, 0)
      } else if (event.key === 'ArrowLeft' && index > 0) {
        // Move focus left
        event.preventDefault()
        if (inputRefs && inputRefs.current && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus()
        }
      } else if (event.key === 'ArrowRight' && index < codeLength - 1) {
        // Move focus right
        event.preventDefault()
        if (inputRefs && inputRefs.current && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus()
        }
      }
    },
    [code, codeLength, onChange, inputRefs, setInternalValue]
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
  value = '',
  'aria-label': ariaLabel,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  codeSent = false,
  onVerify,
  onSendResend,
  verifyButtonProps = {},
  sendResendButtonProps = {},
  showActionButtons = false,
  showSendResendButton = true,
  ...props
}) => {
  // Initialize internal state with the value prop
  const [internalValue, setInternalValue] = useState(value)

  // Create refs for each input
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, codeLength)
    // Fill with nulls if needed
    while (inputRefs.current.length < codeLength) {
      inputRefs.current.push(null)
    }
  }, [codeLength])

  // Update internal state when value prop changes
  useEffect(() => {
    // Only update if the value actually changed to avoid infinite loops
    if (internalValue !== value) {
      setInternalValue(value)
    }
  }, [value, internalValue])

  // Custom onChange handler that updates both internal state and calls the external onChange
  const handleChangeWithState = (newValue: string) => {
    // Set internal state only if it's changed
    if (internalValue !== newValue) {
      setInternalValue(newValue)
    }

    // Call external onChange if provided
    if (onChange && newValue !== value) {
      onChange(newValue)
    }
  }

  const { handleCodeChange, handleKeyDown } = useCodeConfirmation({
    codeLength,
    onChange: handleChangeWithState,
    inputRefs,
    setInternalValue, // Pass setInternalValue to ensure direct updates
  })

  // Special document-level handler for left arrow
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        const activeIndex = inputRefs.current.findIndex(
          ref => ref === document.activeElement
        )
        if (activeIndex > 0) {
          e.preventDefault()
          inputRefs.current[activeIndex - 1]?.focus()
        }
      }
    }

    document.addEventListener(
      'keydown',
      handleGlobalKeyDown as unknown as EventListener
    )
    return () => {
      document.removeEventListener(
        'keydown',
        handleGlobalKeyDown as unknown as EventListener
      )
    }
  }, [])

  // Calculate container width based on number of inputs
  // Each input is 40px + 4px gap (MUI spacing 1) between them
  const inputAreaWidth = codeLength * 40 + (codeLength - 1) * 8 + 44 // Add 44px for the indicator dot and margin

  // Calculate button container width - ensure minimum width for buttons
  // Each button should be at least 120px for good UX
  const minButtonWidth = 120
  // If only showing the verify button, we need less space
  const buttonContainerWidth = showSendResendButton
    ? Math.max(inputAreaWidth, minButtonWidth * 2 + 16) // 16px for gap between buttons
    : Math.max(inputAreaWidth, minButtonWidth)

  // For manual changes (typing digits), also handle auto-focus next field
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = event.target.value.replace(/\D/g, '') // Only keep digits

    // Handle case when user types multiple digits at once
    if (inputValue.length > 1) {
      // Take only the last character typed
      const lastChar = inputValue.charAt(inputValue.length - 1)
      event.target.value = lastChar
    }

    // Apply the change to state
    handleCodeChange(event, index)

    // Only move focus if there's a non-empty value and not the last input
    if (inputValue && inputValue.length > 0 && index < codeLength - 1) {
      // Focus next input
      setTimeout(() => {
        if (inputRefs.current && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus()
        }
      }, 0)
    } else if (inputValue === '' && index > 0) {
      // If input is cleared and not the first input, try to focus the previous input
      setTimeout(() => {
        if (inputRefs.current && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus()
        }
      }, 0)
    }
  }

  const handleKeyDownWrapper = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Direct focus handling for left arrow
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      if (inputRefs.current && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
      return
    }

    // For other keys, use the normal handler
    handleKeyDown(event, index)
  }

  // Safely create an array of string digits from internal state
  const digits: string[] = internalValue
    ? internalValue.split('')
    : Array.from({ length: codeLength }, () => '')

  // Check if all code fields are filled
  const allFieldsFilled =
    digits.filter(digit => digit !== '' && digit !== undefined).length >=
    codeLength

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
      width={`${inputAreaWidth}px`}
      position="relative"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        position="relative"
        marginBottom={2}
      >
        <Box display="flex" gap={1}>
          {Array.from({ length: codeLength }, (_, index) => (
            <Input
              key={`code-input-${index}-${digits[index] || ''}`}
              name={`code${index + 1}`}
              value={digits[index] || ''}
              inputRef={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el
              }}
              inputProps={{
                maxLength: 1,
                pattern: '[0-9]*',
                inputMode: 'numeric',
                'aria-label': `Code Digit ${index + 1}`,
                'aria-required': ariaRequired,
                'aria-invalid': ariaInvalid,
                'data-testid': `code-input-${index + 1}`,
                'data-index': index,
              }}
              sx={{
                border: '1px solid',
                borderColor: 'black',
                borderRadius: 1,
                width: 40,
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
              onFocus={() => {
                inputRefs.current[index]?.focus()
              }}
              {...props}
            />
          ))}
        </Box>

        <Box
          width={20}
          height={20}
          borderRadius="50%"
          bgcolor={isValid ? green.main : red.main}
          position="static"
          role="status"
          aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
          alignSelf="center"
          marginRight={2}
        />
      </Box>

      {showActionButtons && (
        <Box
          display="flex"
          justifyContent={showSendResendButton ? 'space-between' : 'center'}
          width={`${buttonContainerWidth}px`}
          marginTop={1}
          sx={{
            // Center the button container if it's wider than input area
            marginLeft:
              buttonContainerWidth > inputAreaWidth
                ? `${-(buttonContainerWidth - inputAreaWidth) / 2}px`
                : 0,
          }}
        >
          {showSendResendButton && (
            <CustomButton
              text={codeSent ? 'Resend Code' : 'Send Code'}
              fontcolor="white"
              backgroundcolor="black"
              width={
                showSendResendButton
                  ? `${buttonContainerWidth / 2 - 8}px`
                  : '100%'
              }
              height="40px"
              {...sendResendButtonProps}
              onClick={() => {
                if (onSendResend) void onSendResend()
              }}
              // Send/Resend button is always enabled, preserve any custom disableButton setting
              disableButton={sendResendButtonProps?.disableButton || 'false'}
            />
          )}
          <CustomButton
            text="Verify Phone"
            fontcolor="white"
            backgroundcolor="black"
            width={
              showSendResendButton
                ? `${buttonContainerWidth / 2 - 8}px`
                : '100%'
            }
            height="40px"
            {...verifyButtonProps}
            onClick={() => {
              if (onVerify) void onVerify()
            }}
            disableButton={allFieldsFilled ? 'false' : 'true'}
          />
        </Box>
      )}
    </Box>
  )
}

export default ConfirmationCodeInputs

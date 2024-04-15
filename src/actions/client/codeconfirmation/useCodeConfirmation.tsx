'use client'
import React, { useRef, useCallback, useState } from 'react'
import { HelperFooterMessage, IconProps } from '@/types/validation'

interface CodeState {
  code1: string
  code2: string
  code3: string
  code4: string
  code5: string
  code6: string
}

export const useCodeConfirmation = (
  codeLength: number,
  resendErrorServer?: () => Promise<HelperFooterMessage>,
  // eslint-disable-next-line no-unused-vars
  verifyErrorServer?: (verificationCode: string) => Promise<HelperFooterMessage>
) => {
  const [code, setCode] = useState<CodeState>({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  })
  const [confirmationStatus, setConfirmationStatus] =
    useState<HelperFooterMessage>({
      status: 'success',
      statusMessage: '',
    })
  const [iconStatus, setIconStatus] = useState<IconProps>({
    status: 'success',
  })
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    Array(codeLength)
      .fill(null)
      .map(() => React.createRef())
  )

  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = event.target.value.replace(/[^0-9]/g, '')
      setCode(prevCode => ({
        ...prevCode,
        [`code${index + 1}`]: value,
      }))
      if (value && index < codeLength - 1) {
        inputRefs.current[index + 1].current?.focus()
      }
    },
    [codeLength, inputRefs]
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
        inputRefs.current[index - 1].current?.focus()
      } else if (event.key === 'ArrowLeft') {
        if (index > 0) {
          const prevInput = inputRefs.current[index - 1].current
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
          const nextInput = inputRefs.current[index + 1].current
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
    [code, codeLength, inputRefs]
  )

  const handleResendError = async () => {
    if (resendErrorServer) {
      const result = await resendErrorServer()
      setConfirmationStatus(prevStatus => ({
        ...prevStatus,
        status: result?.status || 'success',
        statusMessage: result?.statusMessage || 'Resend Successful',
      }))
    }
  }

  const handleVerifyError = async () => {
    if (verifyErrorServer) {
      const result = await verifyErrorServer(combinedCode)
      setConfirmationStatus(prevStatus => ({
        ...prevStatus,
        status: result?.status || 'success',
        statusMessage: result?.statusMessage || 'Verification Successful',
      }))
      setIconStatus({
        status: result?.status === 'error' ? 'error' : 'success',
      })
    }
  }

  const combinedCode = Object.values(code).join('')

  return {
    inputRefs,
    handleCodeChange,
    handleKeyDown,
    combinedCode,
    confirmationStatus,
    iconStatus,
    handleResendError,
    handleVerifyError,
  }
}

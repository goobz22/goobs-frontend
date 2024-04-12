'use client'

import React, { useRef, useCallback, useState } from 'react'
import { HelperFooterMessage, ValidationProps } from '@/types/validation'

interface CodeState {
  code1: string
  code2: string
  code3: string
  code4: string
  code5: string
  code6: string
}

interface ConfirmationStatus {
  iconStatus: 'error' | 'success'
  helperFooterStatus: 'error' | 'success'
  helperFooterMessage: string
}

export const useCodeConfirmation = (
  codeLength: number,
  resendErrorServer?: () => Promise<HelperFooterMessage | null>,
  verifyErrorServer?: (
    props: ValidationProps
  ) => Promise<HelperFooterMessage | null>
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
    useState<ConfirmationStatus>({
      iconStatus: 'success',
      helperFooterStatus: 'success',
      helperFooterMessage: '',
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
        helperFooterStatus: result?.status || 'success',
        helperFooterMessage: result?.statusMessage || 'Resend Successful',
      }))
    }
  }

  const handleVerifyError = async () => {
    if (verifyErrorServer) {
      const result = await verifyErrorServer({
        identifier: combinedCode,
        value: combinedCode,
      })
      setConfirmationStatus(prevStatus => ({
        ...prevStatus,
        iconStatus: result?.status || 'success',
        helperFooterStatus: result?.status || 'success',
        helperFooterMessage: result?.statusMessage || 'Verification Successful',
      }))
    }
  }

  const combinedCode = Object.values(code).join('')

  return {
    inputRefs,
    handleCodeChange,
    handleKeyDown,
    combinedCode,
    confirmationStatus,
    handleResendError,
    handleVerifyError,
  }
}

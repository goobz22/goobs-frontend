'use client'

import React, { useEffect, useRef, useMemo, type FC } from 'react'
import QRCode from 'qrcode'
import { getQRCodeStyles, type QRCodeStyles } from '../../theme/qrcode'
import CustomButton, { ButtonProps } from '../Button'
import CheckCircle from '../Icons/CheckCircle'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'
import cssStyles from './QRCode.module.css'

export interface QRCodeProps {
  value?: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  title?: string
  showVerifyButton?: boolean
  onVerify?: () => void | Promise<void>
  onDisableVerification?: () => void | Promise<void>
  verifyButtonProps?: Partial<ButtonProps>
  disableVerificationButtonProps?: Partial<ButtonProps>
  showSuccessState?: boolean
  successMessage?: string
  showConfirmationInput?: boolean
  confirmationCode?: string
  onConfirmationCodeChange?: (value: string) => void
  confirmationCodeProps?: Partial<ConfirmationCodeInputsProps>
  onSecretGenerated?: (secret: string) => void
  styles?: QRCodeStyles
}

const QRCodeComponent: FC<QRCodeProps> = React.memo(
  ({
    value,
    size = 256,
    level = 'H',
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    title,
    showVerifyButton = false,
    onVerify,
    onDisableVerification,
    verifyButtonProps = {},
    disableVerificationButtonProps = {},
    showSuccessState = false,
    successMessage = 'Verification Successful',
    showConfirmationInput = false,
    confirmationCode = '',
    onConfirmationCodeChange,
    confirmationCodeProps = {},
    styles,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const qrValue = value

    const responsiveSize = useMemo(() => {
      if (typeof window !== 'undefined') {
        return Math.min(size, window.innerWidth - 32)
      }
      return size
    }, [size])

    const computedStyles = getQRCodeStyles(styles, responsiveSize)

    // Generate QR code on canvas
    useEffect(() => {
      if (canvasRef.current && qrValue) {
        QRCode.toCanvas(
          canvasRef.current,
          qrValue,
          {
            width:
              styles?.theme === 'sacred' ? responsiveSize - 40 : responsiveSize,
            margin: 2,
            color: {
              dark: fgColor,
              light: bgColor,
            },
            errorCorrectionLevel: level,
          },
          error => {
            if (error) console.error('QR Code generation error:', error)
          }
        )
      }
    }, [qrValue, responsiveSize, bgColor, fgColor, level, styles?.theme])

    if (!qrValue) {
      return (
        <div style={computedStyles.errorContainer} role="alert">
          <span style={computedStyles.errorText}>
            Error: No QR code value provided
          </span>
        </div>
      )
    }

    if (showSuccessState) {
      return (
        <div style={computedStyles.successContainer}>
          {styles?.theme === 'sacred' && (
            <span style={computedStyles.glyph}>𓊹</span>
          )}
          <CheckCircle style={computedStyles.successIcon} />
          <h5 style={computedStyles.successMessage}>{successMessage}</h5>
          <div style={{ ...computedStyles.buttonContainer, width: '100%' }}>
            <CustomButton
              text="Disable Verification"
              styles={{
                theme: styles?.theme || 'light',
                width: '100%',
                minHeight: '40px',
              }}
              {...disableVerificationButtonProps}
              onClick={() => {
                const result = onDisableVerification?.()
                if (result instanceof Promise) {
                  result.catch(console.error)
                }
              }}
            />
          </div>
        </div>
      )
    }

    return (
      <>
        {title && <h5 style={computedStyles.title}>{title}</h5>}
        <div
          className={cssStyles.qrCodeContainer}
          style={computedStyles.qrCodeContainer}
        >
          <canvas
            ref={canvasRef}
            className={cssStyles.canvas}
            aria-label={`QR Code for ${title || 'MFA Setup'}`}
            data-testid="mfa-qrcode"
          />
        </div>
        {showConfirmationInput && (
          <div style={computedStyles.confirmationContainer}>
            <ConfirmationCodeInputs
              isValid={false}
              codeLength={6}
              value={confirmationCode}
              onChange={val => onConfirmationCodeChange?.(val)}
              showActionButtons={false}
              onDisableVerification={() => {}}
              {...confirmationCodeProps}
            />
          </div>
        )}
        {showVerifyButton && (
          <div style={computedStyles.buttonContainer}>
            <CustomButton
              text="Verify Code"
              styles={{
                theme: styles?.theme || 'light',
                width: '100%',
                minHeight: '40px',
              }}
              {...verifyButtonProps}
              onClick={() => {
                const result = onVerify?.()
                if (result instanceof Promise) {
                  result.catch(console.error)
                }
              }}
              disabled={
                verifyButtonProps?.disabled ||
                (showConfirmationInput && confirmationCode.length < 6)
              }
            />
          </div>
        )}
      </>
    )
  }
)

QRCodeComponent.displayName = 'QRCodeComponent'

export default QRCodeComponent

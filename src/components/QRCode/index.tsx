'use client'

import React, { useMemo, useEffect } from 'react'
import type { FC } from 'react'
import QRCode from 'react-qr-code'
import { authenticator } from 'otplib'
import { getQRCodeStyles, type QRCodeStyles } from '../../theme/qrcode'
import CustomButton, { ButtonProps } from '../Button'
import CheckCircle from '../Icons/CheckCircle'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'

export interface QRCodeProps {
  /** The value/URL for the QR code (if provided, username and appName are ignored) */
  value?: string
  /** The username for the QR code */
  username?: string
  /** The app name for the QR code */
  appName?: string
  /** The size of the QR code */
  size?: number
  /** QR code error correction level */
  level?: 'L' | 'M' | 'Q' | 'H'
  /** Background color */
  bgColor?: string
  /** Foreground color */
  fgColor?: string
  /** The title to display above the QR code */
  title?: string
  /** Callback when the secret is generated */
  onSecretGenerated?: (secret: string) => void
  /** Whether to show the verify button */
  showVerifyButton?: boolean
  /** Callback when verify is clicked */
  onVerify?: () => void | Promise<void>
  /** Callback when disable verification is clicked */
  onDisableVerification?: () => void | Promise<void>
  /** Props for the verify button */
  verifyButtonProps?: Partial<ButtonProps>
  /** Props for the disable verification button */
  disableVerificationButtonProps?: Partial<ButtonProps>
  /** Whether to show the success state */
  showSuccessState?: boolean
  /** The success message to display */
  successMessage?: string
  /** Whether to show the confirmation input */
  showConfirmationInput?: boolean
  /** The confirmation code value */
  confirmationCode?: string
  /** Callback when confirmation code changes */
  onConfirmationCodeChange?: (value: string) => void
  /** Props for the confirmation code input */
  confirmationCodeProps?: Partial<ConfirmationCodeInputsProps>
  /** Custom styles to apply using the theme system */
  styles?: QRCodeStyles
}

const QRCodeComponent: FC<QRCodeProps> = React.memo(
  ({
    value,
    username,
    appName = 'ThothOS',
    size = 256,
    level = 'H',
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    title,
    onSecretGenerated,
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
    const { secret, otpAuth } = useMemo(() => {
      // If value is provided, use it directly
      if (value) {
        return { secret: '', otpAuth: value }
      }
      // Otherwise generate from username and appName
      if (username) {
        const generatedSecret = authenticator.generateSecret()
        const otpAuthUrl = authenticator.keyuri(
          username,
          appName,
          generatedSecret
        )
        return { secret: generatedSecret, otpAuth: otpAuthUrl }
      }
      return { secret: '', otpAuth: '' }
    }, [value, username, appName])

    useEffect(() => {
      if (onSecretGenerated && secret) {
        onSecretGenerated(secret)
      }
    }, [secret, onSecretGenerated])

    const responsiveSize = useMemo(() => {
      if (typeof window !== 'undefined') {
        return Math.min(size, window.innerWidth - 32)
      }
      return size
    }, [size])

    const computedStyles = getQRCodeStyles(styles, responsiveSize)

    if (!otpAuth) {
      return (
        <div style={computedStyles.errorContainer} role="alert">
          <span style={computedStyles.errorText}>
            Error: Failed to generate QR code
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
      <div style={computedStyles.container}>
        {title && <h5 style={computedStyles.title}>{title}</h5>}
        <div style={computedStyles.qrCodeContainer}>
          <QRCode
            value={otpAuth}
            size={
              styles?.theme === 'sacred' ? responsiveSize - 40 : responsiveSize
            }
            level={level}
            bgColor={styles?.theme === 'sacred' ? bgColor : bgColor}
            fgColor={styles?.theme === 'sacred' ? fgColor : fgColor}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            aria-label={`QR Code for ${title || 'MFA Setup'}`}
            data-testid="mfa-qrcode"
          />
        </div>
        {username && (
          <div style={computedStyles.infoText}>{`${appName}: ${username}`}</div>
        )}
        {showConfirmationInput && (
          <div style={computedStyles.confirmationContainer}>
            <ConfirmationCodeInputs
              isValid={false}
              codeLength={6}
              value={confirmationCode}
              onChange={val => onConfirmationCodeChange?.(val)}
              showActionButtons={false}
              onDisableVerification={() => {}}
              styles={{ theme: styles?.theme || 'light' }}
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
      </div>
    )
  }
)

QRCodeComponent.displayName = 'QRCodeComponent'

export default QRCodeComponent

export function verifyMFAToken(token: string, secret: string): boolean {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token')
  }
  if (!secret || typeof secret !== 'string') {
    throw new Error('Invalid secret')
  }

  try {
    authenticator.options = {
      window: 1,
      step: 30,
      digits: 6,
    }
    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error('MFA verification error:', error)
    return false
  }
}

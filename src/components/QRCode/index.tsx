import React, { useMemo, useEffect, FC } from 'react'
import QRCode from 'react-qr-code'
import { authenticator } from 'otplib'
import CustomButton, { CustomButtonProps } from '../Button'
import CheckCircle from '../Icons/CheckCircle'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'

export interface QRCodeProps {
  username: string
  appName?: string
  size?: number
  title?: string
  style?: React.CSSProperties
  onSecretGenerated?: (secret: string) => void
  showVerifyButton?: boolean
  onVerify?: () => void | Promise<void>
  onDisableVerification?: () => void | Promise<void>
  verifyButtonProps?: Partial<CustomButtonProps>
  disableVerificationButtonProps?: Partial<CustomButtonProps>
  showSuccessState?: boolean
  successMessage?: string
  showConfirmationInput?: boolean
  confirmationCode?: string
  onConfirmationCodeChange?: (value: string) => void
  confirmationCodeProps?: Partial<ConfirmationCodeInputsProps>
  showDisableConfirmation?: boolean
  sacredtheme?: boolean
}

const premiumStyles = {
  container: {
    padding: '1.5rem',
    display: 'inline-block',
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
  } as React.CSSProperties,
  title: {
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: 'Merriweather, serif',
    fontSize: '1.25rem',
  } as React.CSSProperties,
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
  } as React.CSSProperties,
  infoText: {
    marginTop: '1rem',
    textAlign: 'center',
    fontFamily: 'Merriweather, serif',
  } as React.CSSProperties,
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    width: '100%',
  } as React.CSSProperties,
  successIcon: {
    width: '60px',
    height: '60px',
    color: '#22C55E',
  } as React.CSSProperties,
  successMessage: {
    textAlign: 'center',
    fontFamily: 'Merriweather, serif',
    fontSize: '1.25rem',
  } as React.CSSProperties,
  buttonContainer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  } as React.CSSProperties,
  confirmationContainer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  } as React.CSSProperties,
  errorContainer: {
    padding: '1rem',
  } as React.CSSProperties,
  errorText: {
    fontFamily: 'Merriweather, serif',
    color: '#DC2626',
  } as React.CSSProperties,
  glyph: {
    display: 'none',
  } as React.CSSProperties,
  decorativeGlyphs: {
    display: 'none',
  } as React.CSSProperties,
  decorativeGlyph: {
    display: 'none',
  } as React.CSSProperties,
}

const sacredStyles = {
  ...premiumStyles,
  container: {
    ...premiumStyles.container,
    backgroundColor: 'black',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    animation: 'sacred-glow-pulse 2s infinite alternate',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,
  title: {
    ...premiumStyles.title,
    color: '#FFD700',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  qrCodeContainer: {
    ...premiumStyles.qrCodeContainer,
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '2px solid rgba(255, 215, 0, 0.6)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,
  infoText: {
    ...premiumStyles.infoText,
    fontStyle: 'italic',
    letterSpacing: '0.05em',
    color: 'rgba(255, 215, 0, 0.9)',
  } as React.CSSProperties,
  successContainer: {
    ...premiumStyles.successContainer,
    position: 'relative',
  } as React.CSSProperties,
  successIcon: {
    width: '60px',
    height: '60px',
    color: '#FFD700',
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
    animation: 'sacred-float 3s infinite ease-in-out',
  } as React.CSSProperties,
  successMessage: {
    ...premiumStyles.successMessage,
    fontWeight: 600,
    color: '#FFD700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.25rem',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
  decorativeGlyphs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,
  decorativeGlyph: {
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.875rem',
    animation: 'float-glyph 3s infinite ease-in-out',
  } as React.CSSProperties,
  errorText: {
    ...premiumStyles.errorText,
    color: '#FFD700',
  } as React.CSSProperties,
}

const QRCodeComponent: FC<QRCodeProps> = React.memo(
  ({
    username,
    appName = 'ThothOS',
    size = 256,
    title,
    style,
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
    sacredtheme = false,
  }) => {
    const { secret, otpAuth } = useMemo(() => {
      const generatedSecret = authenticator.generateSecret()
      const otpAuthUrl = authenticator.keyuri(
        username,
        appName,
        generatedSecret
      )
      return { secret: generatedSecret, otpAuth: otpAuthUrl }
    }, [username, appName])

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

    const styles = sacredtheme ? sacredStyles : premiumStyles

    if (!otpAuth) {
      return (
        <div style={{ ...styles.errorContainer, ...style }} role="alert">
          <span style={styles.errorText}>
            Error: Failed to generate QR code
          </span>
        </div>
      )
    }

    if (showSuccessState) {
      return (
        <div style={{ ...styles.successContainer, ...style }}>
          {sacredtheme && <span style={styles.glyph}>𓊹</span>}
          <CheckCircle style={styles.successIcon} />
          <h5 style={styles.successMessage}>{successMessage}</h5>
          <div style={{ ...styles.buttonContainer, width: '100%' }}>
            <CustomButton
              text="Disable Verification"
              fontcolor={sacredtheme ? '#000000' : 'white'}
              backgroundcolor={sacredtheme ? '#FFD700' : 'black'}
              width="100%"
              height="40px"
              {...disableVerificationButtonProps}
              onClick={() => {
                const result = onDisableVerification?.()
                if (result instanceof Promise) {
                  result.catch(console.error)
                }
              }}
              sacredtheme={sacredtheme}
            />
          </div>
        </div>
      )
    }

    return (
      <div style={{ ...styles.container, ...style }}>
        {title && <h5 style={styles.title}>{title}</h5>}
        <div
          style={{
            ...styles.qrCodeContainer,
            width: responsiveSize,
            height: responsiveSize,
          }}
        >
          <QRCode
            value={otpAuth}
            size={sacredtheme ? responsiveSize - 32 : responsiveSize}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            aria-label={`QR Code for ${title || 'MFA Setup'}`}
            data-testid="mfa-qrcode"
          />
        </div>
        <div style={styles.infoText}>{`${appName}: ${username}`}</div>
        {showConfirmationInput && (
          <div style={styles.confirmationContainer}>
            <ConfirmationCodeInputs
              isValid={false}
              codeLength={6}
              value={confirmationCode}
              onChange={onConfirmationCodeChange}
              showActionButtons={false}
              onDisableVerification={() => {}}
              sacredtheme={sacredtheme}
              {...confirmationCodeProps}
            />
          </div>
        )}
        {showVerifyButton && (
          <div style={styles.buttonContainer}>
            <CustomButton
              text="Verify Code"
              fontcolor={sacredtheme ? '#000000' : 'white'}
              backgroundcolor={sacredtheme ? '#FFD700' : 'black'}
              width="100%"
              height="40px"
              {...verifyButtonProps}
              onClick={() => {
                const result = onVerify?.()
                if (result instanceof Promise) {
                  result.catch(console.error)
                }
              }}
              disableButton={
                verifyButtonProps?.disableButton ||
                (showConfirmationInput && confirmationCode.length < 6
                  ? 'true'
                  : 'false')
              }
              sacredtheme={sacredtheme}
            />
          </div>
        )}
        {sacredtheme && (
          <div style={styles.decorativeGlyphs}>
            {['𓂀', '𓊖', '𓏏'].map((glyph, i) => (
              <span
                key={i}
                style={{
                  ...styles.decorativeGlyph,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2.5 + i * 0.5}s`,
                }}
              >
                {glyph}
              </span>
            ))}
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

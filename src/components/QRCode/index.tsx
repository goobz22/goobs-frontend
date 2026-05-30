'use client'

import React, {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type FC,
} from 'react'
import QRCode from 'qrcode'
import CustomButton, { ButtonProps } from '../Button'
import CheckCircle from '../Icons/CheckCircle'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'
import cssStyles from './QRCode.module.css'

export interface QRCodeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  padding?: string

  // Text styling
  titleColor?: string
  titleFontSize?: string
  titleFontWeight?: string | number
  infoTextColor?: string

  // QR Code container styling
  qrBackgroundColor?: string
  qrBorderColor?: string
  qrBoxShadow?: string

  // Success state styling
  successIconColor?: string
  successMessageColor?: string

  // Error styling
  errorTextColor?: string

  // Layout and sizing
  size?: number
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  showGlyphs?: boolean
}

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

    // The theme variant drives the [data-theme] attribute on each themed
    // element. Default 'light' preserves the prior runtime behaviour.
    const theme = styles?.theme || 'light'

    // Runtime-measured responsive size — stays in JS, surfaced to CSS as the
    // --qr-size custom property on the QR container.
    const responsiveSize = useMemo(() => {
      if (typeof window !== 'undefined') {
        return Math.min(size, window.innerWidth - 32)
      }
      return size
    }, [size])

    // Caller-supplied style overrides arrive as CSS custom properties so the
    // selectors stay in the CSS module (recipe: dynamic/user-prop styling).
    // Plain inline objects — the React Compiler memoizes the component;
    // manual useMemo here would fight its inferred dependencies.
    const qrContainerVars: Record<string, string> = {
      '--qr-size': `${responsiveSize}px`,
    }
    if (styles?.qrBackgroundColor) {
      qrContainerVars['--qr-bg-color'] = styles.qrBackgroundColor
    }
    if (styles?.qrBorderColor) {
      qrContainerVars['--qr-border'] = `1px solid ${styles.qrBorderColor}`
    }
    if (styles?.qrBoxShadow) {
      qrContainerVars['--qr-box-shadow'] = styles.qrBoxShadow
    }
    const qrContainerStyle = qrContainerVars as CSSProperties

    const titleVars: Record<string, string> = {}
    if (styles?.titleColor) titleVars['--qr-title-color'] = styles.titleColor
    if (styles?.titleFontSize) {
      titleVars['--qr-title-font-size'] = styles.titleFontSize
    }
    if (styles?.titleFontWeight !== undefined) {
      titleVars['--qr-title-font-weight'] = String(styles.titleFontWeight)
    }
    const titleStyle = titleVars as CSSProperties

    // The CheckCircle icon's color/size API is its `style` prop (it renders an
    // <svg fill="currentColor" style={...}>), so the success-icon visuals stay
    // in JS rather than a className. Values mirror the CSS .successIcon class.
    const isSacred = theme === 'sacred'
    const successIconStyle: CSSProperties = {
      width: '60px',
      height: '60px',
      color: styles?.successIconColor || (isSacred ? '#FFD700' : '#22C55E'),
      ...(isSacred && {
        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
      }),
    }

    const successMessageStyle = (
      styles?.successMessageColor
        ? { '--qr-success-message-color': styles.successMessageColor }
        : {}
    ) as CSSProperties

    const errorTextStyle = (
      styles?.errorTextColor
        ? { '--qr-error-text-color': styles.errorTextColor }
        : {}
    ) as CSSProperties

    // Generate QR code on canvas
    useEffect(() => {
      if (canvasRef.current && qrValue) {
        QRCode.toCanvas(
          canvasRef.current,
          qrValue,
          {
            width: theme === 'sacred' ? responsiveSize - 40 : responsiveSize,
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
    }, [qrValue, responsiveSize, bgColor, fgColor, level, theme])

    if (!qrValue) {
      return (
        <div
          className={cssStyles.errorContainer}
          role="alert"
          data-component="QRCode"
        >
          <span
            className={cssStyles.errorText}
            data-theme={theme}
            style={errorTextStyle}
          >
            Error: No QR code value provided
          </span>
        </div>
      )
    }

    if (showSuccessState) {
      return (
        <div
          className={cssStyles.successContainer}
          data-component="QRCode"
          data-theme={theme}
        >
          {theme === 'sacred' && <span className={cssStyles.glyph}>𓊹</span>}
          <CheckCircle style={successIconStyle} />
          <h5
            className={cssStyles.successMessage}
            data-theme={theme}
            style={successMessageStyle}
          >
            {successMessage}
          </h5>
          <div
            className={cssStyles.buttonContainer}
            style={{ width: '100%' }}
          >
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
        {title && (
          <h5 className={cssStyles.title} data-theme={theme} style={titleStyle}>
            {title}
          </h5>
        )}
        <div
          className={cssStyles.qrCodeContainer}
          data-component="QRCode"
          data-theme={theme}
          style={qrContainerStyle}
        >
          <canvas
            ref={canvasRef}
            className={cssStyles.canvas}
            aria-label={`QR Code for ${title || 'MFA Setup'}`}
            data-testid="mfa-qrcode"
          />
        </div>
        {showConfirmationInput && (
          <div className={cssStyles.confirmationContainer}>
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
          <div className={cssStyles.buttonContainer}>
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

'use client'

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type FC,
} from 'react'
import QRCode from 'qrcode'
import CustomButton, { ButtonProps } from '../Button'
import CheckCircle from '../Icons/CheckCircle'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'
import cssStyles from './QRCode.module.css'

/**
 * Styling surface for the QR panel. `theme` maps to `data-theme` on each
 * themed element; the scalar overrides ride in as `--qr-*` CSS custom
 * properties, set only when provided so the theme defaults apply otherwise.
 */
export interface QRCodeStyles {
  /** `data-theme` variant for the frame, title, and states: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // ----- QR container (the framed box around the canvas) -----
  /** Frame background; the more specific `qrBackgroundColor` wins when both are set. */
  backgroundColor?: string
  /** Frame border color; the more specific `qrBorderColor` wins when both are set. */
  borderColor?: string
  /** Frame corner radius (theme default otherwise). */
  borderRadius?: string
  /**
   * Frame border width (default '1px' when combined with a border-color
   * override; alone it keeps the theme's default border color).
   */
  borderWidth?: string
  /** Frame inner padding (theme default otherwise). */
  padding?: string
  /** Frame background; wins over `backgroundColor`. */
  qrBackgroundColor?: string
  /** Frame border color; wins over `borderColor`. */
  qrBorderColor?: string
  /** Frame box shadow (theme default otherwise). */
  qrBoxShadow?: string

  // ----- Title text -----
  /** Title heading color (theme default otherwise). */
  titleColor?: string
  /** Title heading font size (theme default otherwise). */
  titleFontSize?: string
  /** Title heading font weight (theme default otherwise). */
  titleFontWeight?: string | number

  // ----- Success state -----
  /** Success-state check icon color. Default: gold on sacred, green otherwise. */
  successIconColor?: string
  /** Success-state message text color (theme default otherwise). */
  successMessageColor?: string

  // ----- Error state -----
  /** Text color of the no-value error message (theme default otherwise). */
  errorTextColor?: string

  /** QR pixel size; overrides the top-level `size` prop when both are set. */
  size?: number
}

export interface QRCodeProps {
  /**
   * Text encoded into the QR code. When omitted or empty, the component
   * renders an inline error message instead of a canvas.
   */
  value?: string
  /**
   * Rendered pixel size (default 256), clamped to the viewport width minus
   * 32px; `styles.size` wins when both are set. The sacred theme draws the
   * canvas 40px smaller to leave room for the frame.
   */
  size?: number
  /** QR error-correction level. Default 'H'. */
  level?: 'L' | 'M' | 'Q' | 'H'
  /** Light-module color drawn on the canvas (independent of theme). Default '#FFFFFF'. */
  bgColor?: string
  /** Dark-module color drawn on the canvas (independent of theme). Default '#000000'. */
  fgColor?: string
  /** Heading rendered above the frame; also names the canvas aria-label ('MFA Setup' fallback). */
  title?: string
  /**
   * Heading level (`h1`–`h6`) rendered for the `title` heading and the
   * success-state message, so the consumer can slot this panel correctly into
   * the surrounding document outline and avoid a skipped-heading-level
   * violation (WCAG 1.3.1 / 2.4.6). Matches the library-wide `headingLevel`
   * convention (Accordion, EmptyState, ConfirmationCodeInput). Defaults to
   * `5`, preserving the historical `<h5>`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Renders a full-width "Verify Code" button under the QR. Default false. */
  showVerifyButton?: boolean
  /** Verify-button click handler; a returned promise's rejection is caught and logged. */
  onVerify?: () => void | Promise<void>
  /** Click handler for the success-state "Disable Verification" button; promise rejections are caught and logged. */
  onDisableVerification?: () => void | Promise<void>
  /**
   * Extra Button props spread onto the verify button. Note its `disabled`
   * is combined with the built-in gate (disabled until 6 code digits are
   * entered while `showConfirmationInput` is set).
   */
  verifyButtonProps?: Partial<ButtonProps>
  /** Extra Button props spread onto the success-state "Disable Verification" button. */
  disableVerificationButtonProps?: Partial<ButtonProps>
  /**
   * Replaces the QR frame with the success pane: check icon, message, and
   * the "Disable Verification" button. Default false.
   */
  showSuccessState?: boolean
  /** Success-pane message. Default 'Verification Successful'. */
  successMessage?: string
  /** Renders a 6-digit confirmation-code input under the QR and gates the verify button on it. Default false. */
  showConfirmationInput?: boolean
  /** Controlled value of the confirmation-code input. Default ''. */
  confirmationCode?: string
  /** Called with the confirmation-code input's new value. */
  onConfirmationCodeChange?: (value: string) => void
  /** Extra ConfirmationCodeInputs props spread onto the code input. */
  confirmationCodeProps?: Partial<ConfirmationCodeInputsProps>
  /** Theme plus frame/title/state styling overrides. See QRCodeStyles. */
  styles?: QRCodeStyles
  /**
   * `data-testid` for the QR canvas (default `'mfa-qrcode'`). Override it to
   * disambiguate multiple QR codes on one page so their test ids don't collide.
   * Matches the additive `data-testid` prop convention (see Markdown).
   */
  'data-testid'?: string
}

/**
 * MFA-style QR panel: draws `value` onto a canvas inside a themed frame, with
 * an optional title, 6-digit confirmation-code input, and Verify button.
 * `showSuccessState` swaps the whole panel for a success pane (check icon,
 * message, "Disable Verification" button); a missing `value` renders an
 * inline error instead. Themed light (default) / dark / sacred via
 * `styles.theme`, with scalar overrides riding in as `--qr-*` CSS custom
 * properties; the canvas module colors come from `bgColor`/`fgColor`, not the
 * theme.
 */
const QRCodeComponent: FC<QRCodeProps> = React.memo(
  ({
    value,
    size = 256,
    level = 'H',
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    title,
    headingLevel = 5,
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
    'data-testid': dataTestId = 'mfa-qrcode',
    styles,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const qrValue = value

    // The theme variant drives the [data-theme] attribute on each themed
    // element. Default 'light' preserves the prior runtime behaviour.
    const theme = styles?.theme || 'light'

    // Consumer-controlled heading tag for the title + success message. Renders
    // a real <h1>–<h6> at the caller's outline level (default h5, preserving
    // prior DOM) rather than a fixed <h5> that could skip levels (WCAG 1.3.1 /
    // 2.4.6). Capitalised local so JSX treats it as an element type; the
    // `.title` / `.successMessage` CSS keys off className + data-theme, not the
    // tag, so visuals are unchanged.
    const HeadingTag = `h${headingLevel}` as ElementType

    // The success pane replaces the QR panel with no focus move, so its arrival
    // is a status message that must be announced (WCAG 4.1.3). A persistent,
    // always-mounted role="status" region (below) announces the message as a
    // CONTENT MUTATION — the reliable pattern (a region created together with
    // its content is frequently missed by NVDA/JAWS), mirroring
    // ConfirmationCodeInput / SaveButton. Derived from the previous render via
    // the adjust-state-during-render pattern (no effect). Gated on qrValue too:
    // a missing value shows the error branch, never the success pane.
    const inSuccessView = Boolean(qrValue) && showSuccessState
    const [successAnnouncement, setSuccessAnnouncement] = useState(
      inSuccessView ? successMessage : ''
    )
    const [prevInSuccessView, setPrevInSuccessView] = useState(inSuccessView)
    if (prevInSuccessView !== inSuccessView) {
      setPrevInSuccessView(inSuccessView)
      setSuccessAnnouncement(inSuccessView ? successMessage : '')
    }

    // Runtime-measured responsive size — stays in JS, surfaced to CSS as the
    // --qr-size custom property on the QR container. styles.size overrides
    // the top-level size prop when both are provided.
    const requestedSize = styles?.size ?? size
    const responsiveSize = useMemo(() => {
      if (typeof window !== 'undefined') {
        return Math.min(requestedSize, window.innerWidth - 32)
      }
      return requestedSize
    }, [requestedSize])

    // Caller-supplied style overrides arrive as CSS custom properties so the
    // selectors stay in the CSS module (recipe: dynamic/user-prop styling).
    // Plain inline objects — the React Compiler memoizes the component;
    // manual useMemo here would fight its inferred dependencies.
    const qrContainerVars: Record<string, string> = {
      '--qr-size': `${responsiveSize}px`,
    }
    const qrBackground = styles?.qrBackgroundColor || styles?.backgroundColor
    if (qrBackground) {
      qrContainerVars['--qr-bg-color'] = qrBackground
    }
    const qrBorderColor = styles?.qrBorderColor || styles?.borderColor
    if (qrBorderColor) {
      qrContainerVars['--qr-border'] =
        `${styles?.borderWidth || '1px'} solid ${qrBorderColor}`
    } else if (styles?.borderWidth) {
      // Width-only override: keep each theme's default border color.
      qrContainerVars['--qr-border-width'] = styles.borderWidth
    }
    if (styles?.borderRadius) {
      qrContainerVars['--qr-border-radius'] = styles.borderRadius
    }
    if (styles?.padding) {
      qrContainerVars['--qr-padding'] = styles.padding
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

    // Branch content is computed into a local so the persistent live region
    // (below) stays mounted across ALL states — that is what makes the success
    // announcement reliable (WCAG 4.1.3).
    let content: React.ReactNode
    if (!qrValue) {
      content = (
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
    } else if (showSuccessState) {
      content = (
        <div
          className={cssStyles.successContainer}
          data-component="QRCode"
          data-theme={theme}
        >
          {/* Decorative Egyptian glyph — hidden from assistive tech so it is
              not read as a stray character (WCAG 1.1.1). */}
          {theme === 'sacred' && (
            <span className={cssStyles.glyph} aria-hidden="true">
              𓊹
            </span>
          )}
          {/* The success heading already conveys the state, so the check icon
              is decorative and hidden from AT (WCAG 1.1.1). goobs icons default
              to aria-hidden when unnamed, but it is set explicitly here. */}
          <CheckCircle
            aria-hidden="true"
            focusable="false"
            style={successIconStyle}
          />
          <HeadingTag
            className={cssStyles.successMessage}
            data-theme={theme}
            style={successMessageStyle}
          >
            {successMessage}
          </HeadingTag>
          <div className={cssStyles.buttonContainer} style={{ width: '100%' }}>
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
    } else {
      content = (
        <>
          {title && (
            <HeadingTag
              className={cssStyles.title}
              data-theme={theme}
              style={titleStyle}
            >
              {title}
            </HeadingTag>
          )}
          <div
            className={cssStyles.qrCodeContainer}
            data-component="QRCode"
            data-theme={theme}
            style={qrContainerStyle}
          >
            {/* role="img" makes the aria-label the authoritative text
                alternative for the canvas bitmap (WCAG 1.1.1 / 4.1.2); some
                screen readers otherwise ignore an aria-label on a bare
                <canvas>. */}
            <canvas
              ref={canvasRef}
              className={cssStyles.canvas}
              role="img"
              aria-label={`QR Code for ${title || 'MFA Setup'}`}
              data-testid={dataTestId}
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

    return (
      <>
        {/* Persistent, always-mounted polite live region. It is empty (silent)
            in the QR and error states; when the success pane arrives it is
            populated with the success message (via successAnnouncement) so the
            confirmation is announced without a focus move (WCAG 4.1.3). */}
        <div className={cssStyles.srOnly} role="status" aria-live="polite">
          {successAnnouncement}
        </div>
        {content}
      </>
    )
  }
)

QRCodeComponent.displayName = 'QRCodeComponent'

export default QRCodeComponent

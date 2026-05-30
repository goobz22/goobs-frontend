/**
 * @fileoverview Defines the Alert component for displaying important messages.
 * It supports multiple severity levels and light, dark, and sacred themes.
 */
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import ErrorIcon from '../Icons/Error'
import WarningIcon from '../Icons/Warning'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Alert.module.css'

// --------------------------------------------------------------------------
// STYLES CONTRACT
// --------------------------------------------------------------------------

/**
 * Comprehensive styling options for {@link Alert}. Transcribed verbatim from
 * the former `AlertStyles` in `src/theme/alert.ts` so the public prop contract
 * is unchanged; the component now consumes these as CSS custom properties via
 * its CSS module rather than feeding a JS theme generator.
 */
export interface AlertStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  fontFamily?: string
  fontSize?: string
  lineHeight?: string | number
  padding?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string

  // Severity styling overrides
  errorBackgroundColor?: string
  errorBorderColor?: string
  errorColor?: string
  errorTextShadow?: string
  warningBackgroundColor?: string
  warningBorderColor?: string
  warningColor?: string
  warningTextShadow?: string
  infoBackgroundColor?: string
  infoBorderColor?: string
  infoColor?: string
  infoTextShadow?: string
  successBackgroundColor?: string
  successBorderColor?: string
  successColor?: string
  successTextShadow?: string

  // Icon styling
  iconWidth?: string
  iconHeight?: string
  iconFilter?: string
  iconHoverTransform?: string
  iconHoverFilter?: string

  // Message styling
  messageColor?: string
  messageFontWeight?: string | number
  messageLetterSpacing?: string

  // Close button styling
  closeButtonWidth?: string
  closeButtonHeight?: string
  closeButtonBorderRadius?: string
  closeButtonBorder?: string
  closeButtonBackground?: string
  closeButtonColor?: string
  closeButtonFontSize?: string
  closeButtonFontFamily?: string
  closeButtonTextShadow?: string
  closeButtonHoverBackground?: string
  closeButtonHoverBorderColor?: string
  closeButtonHoverTransform?: string
  closeButtonHoverBoxShadow?: string

  // Layout and spacing
  gap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AlertProps {
  /** The severity of the alert, which determines the icon and color scheme. */
  severity: 'error' | 'warning' | 'info' | 'success'
  /** The message to be displayed in the alert. */
  message: string
  /** Callback fired when the alert is closed. If not provided, the close button will not be shown. */
  onClose?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: AlertStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC<{
  severity: 'error' | 'warning' | 'info' | 'success'
}> = () => {
  return null
}

// Map of caller-supplied AlertStyles keys → CSS custom properties. Each var is
// set ONLY when the caller provides the value, so the CSS fallback (the theme
// value transcribed into Alert.module.css) applies otherwise — replicating the
// old `styles.x || baseTheme.x` precedence without a JS computedStyles object.
type DynamicStyle = React.CSSProperties & Record<string, string | undefined>

// --------------------------------------------------------------------------
// MAIN ALERT COMPONENT
// --------------------------------------------------------------------------

/**
 * A component for displaying important messages with different severity levels and themes.
 */
const Alert: React.FC<AlertProps> = ({ severity, message, onClose, styles }) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, 200)
  }, [onClose])

  const Icon = {
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,
    success: CheckCircleIcon,
  }[severity]

  // The container theme defaulted to 'light' in the old getAlertTheme; the icon
  // defaulted to 'sacred'. Both behaviours are preserved verbatim.
  const containerTheme = styles?.theme || 'light'
  const isSacredTheme = styles?.theme === 'sacred'

  // Diagnostic bus — emit a toast.shown event whenever a message surfaces.
  // This is the single feedback chokepoint: the FormDataGrid success/error
  // Alert AND the Snackbar's inner Alert both flow through here, so wiring it
  // once covers every toast the app shows. Keyed on [severity, message] so a
  // changed message re-emits. 'warning' → 'warn' to match the host bus's
  // toast level vocabulary. No-op when no bus is present.
  useEffect(() => {
    if (!message) return
    emitDiag({
      type: 'toast.shown',
      level: severity === 'warning' ? 'warn' : severity,
      message,
    })
  }, [severity, message])

  // Caller-supplied overrides → CSS custom properties (set only when provided).
  const dynamicStyle: DynamicStyle = {}
  if (styles?.gap) dynamicStyle['--alert-gap'] = styles.gap
  if (styles?.borderWidth)
    dynamicStyle['--alert-border-width'] = styles.borderWidth
  if (styles?.borderRadius)
    dynamicStyle['--alert-border-radius'] = styles.borderRadius
  if (styles?.boxShadow) dynamicStyle['--alert-box-shadow'] = styles.boxShadow
  if (styles?.backdropFilter)
    dynamicStyle['--alert-backdrop-filter'] = styles.backdropFilter
  if (styles?.fontFamily)
    dynamicStyle['--alert-font-family'] = styles.fontFamily
  if (styles?.fontSize) dynamicStyle['--alert-font-size'] = styles.fontSize
  if (styles?.lineHeight != null)
    dynamicStyle['--alert-line-height'] = String(styles.lineHeight)
  if (styles?.padding) dynamicStyle['--alert-padding'] = styles.padding

  // A caller transitionDuration replaces the whole transition (old getAlertTheme:
  // `all ${duration} ${easing || cubic-bezier(0.4,0,0.2,1)}`). Otherwise the CSS
  // fallback (TRANSITIONS.medium for light/dark, .premium for sacred) applies.
  if (styles?.transitionDuration)
    dynamicStyle['--alert-transition'] =
      `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`

  // The old getAlertTheme fed styles.backgroundColor into the container's
  // `background` shorthand; severity backgroundColor (a longhand declared
  // after) still wins, so this only shows through when the caller also nulls
  // severity. Set it on the element's `background` to mirror that precedence.
  if (styles?.backgroundColor) dynamicStyle.background = styles.backgroundColor
  if (styles?.backgroundImage)
    dynamicStyle['--alert-background-image'] = styles.backgroundImage

  // Margins / dimensions (unset → unconstrained, matching the old undefined).
  if (styles?.margin) dynamicStyle['--alert-margin'] = styles.margin
  if (styles?.marginTop) dynamicStyle['--alert-margin-top'] = styles.marginTop
  if (styles?.marginBottom)
    dynamicStyle['--alert-margin-bottom'] = styles.marginBottom
  if (styles?.marginLeft)
    dynamicStyle['--alert-margin-left'] = styles.marginLeft
  if (styles?.marginRight)
    dynamicStyle['--alert-margin-right'] = styles.marginRight
  if (styles?.width) dynamicStyle['--alert-width'] = styles.width
  if (styles?.maxWidth) dynamicStyle['--alert-max-width'] = styles.maxWidth
  if (styles?.minWidth) dynamicStyle['--alert-min-width'] = styles.minWidth
  if (styles?.height) dynamicStyle['--alert-height'] = styles.height
  if (styles?.maxHeight) dynamicStyle['--alert-max-height'] = styles.maxHeight
  if (styles?.minHeight) dynamicStyle['--alert-min-height'] = styles.minHeight

  // Hover overrides.
  if (styles?.hoverTransform)
    dynamicStyle['--alert-hover-transform'] = styles.hoverTransform
  if (styles?.hoverBoxShadow)
    dynamicStyle['--alert-hover-box-shadow'] = styles.hoverBoxShadow
  if (styles?.hoverBorderColor)
    dynamicStyle['--alert-hover-border-color'] = styles.hoverBorderColor

  // Per-severity overrides (background/border/color/text-shadow).
  if (styles?.errorBackgroundColor)
    dynamicStyle['--alert-error-bg'] = styles.errorBackgroundColor
  if (styles?.errorBorderColor)
    dynamicStyle['--alert-error-border'] = styles.errorBorderColor
  if (styles?.errorColor) dynamicStyle['--alert-error-color'] = styles.errorColor
  if (styles?.errorTextShadow)
    dynamicStyle['--alert-error-text-shadow'] = styles.errorTextShadow
  if (styles?.warningBackgroundColor)
    dynamicStyle['--alert-warning-bg'] = styles.warningBackgroundColor
  if (styles?.warningBorderColor)
    dynamicStyle['--alert-warning-border'] = styles.warningBorderColor
  if (styles?.warningColor)
    dynamicStyle['--alert-warning-color'] = styles.warningColor
  if (styles?.warningTextShadow)
    dynamicStyle['--alert-warning-text-shadow'] = styles.warningTextShadow
  if (styles?.infoBackgroundColor)
    dynamicStyle['--alert-info-bg'] = styles.infoBackgroundColor
  if (styles?.infoBorderColor)
    dynamicStyle['--alert-info-border'] = styles.infoBorderColor
  if (styles?.infoColor) dynamicStyle['--alert-info-color'] = styles.infoColor
  if (styles?.infoTextShadow)
    dynamicStyle['--alert-info-text-shadow'] = styles.infoTextShadow
  if (styles?.successBackgroundColor)
    dynamicStyle['--alert-success-bg'] = styles.successBackgroundColor
  if (styles?.successBorderColor)
    dynamicStyle['--alert-success-border'] = styles.successBorderColor
  if (styles?.successColor)
    dynamicStyle['--alert-success-color'] = styles.successColor
  if (styles?.successTextShadow)
    dynamicStyle['--alert-success-text-shadow'] = styles.successTextShadow

  // Message overrides.
  if (styles?.messageFontWeight != null)
    dynamicStyle['--alert-message-font-weight'] = String(
      styles.messageFontWeight
    )
  if (styles?.messageLetterSpacing)
    dynamicStyle['--alert-message-letter-spacing'] = styles.messageLetterSpacing
  if (styles?.messageColor)
    dynamicStyle['--alert-message-color'] = styles.messageColor

  // Close-button overrides.
  if (styles?.closeButtonWidth)
    dynamicStyle['--alert-close-width'] = styles.closeButtonWidth
  if (styles?.closeButtonHeight)
    dynamicStyle['--alert-close-height'] = styles.closeButtonHeight
  if (styles?.closeButtonBorderRadius)
    dynamicStyle['--alert-close-radius'] = styles.closeButtonBorderRadius
  if (styles?.closeButtonBorder)
    dynamicStyle['--alert-close-border'] = styles.closeButtonBorder
  if (styles?.closeButtonBackground)
    dynamicStyle['--alert-close-bg'] = styles.closeButtonBackground
  if (styles?.closeButtonColor)
    dynamicStyle['--alert-close-color'] = styles.closeButtonColor
  if (styles?.closeButtonFontSize)
    dynamicStyle['--alert-close-font-size'] = styles.closeButtonFontSize
  if (styles?.closeButtonFontFamily)
    dynamicStyle['--alert-close-font-family'] = styles.closeButtonFontFamily
  if (styles?.closeButtonTextShadow)
    dynamicStyle['--alert-close-text-shadow'] = styles.closeButtonTextShadow
  if (styles?.closeButtonHoverBackground)
    dynamicStyle['--alert-close-hover-bg'] = styles.closeButtonHoverBackground
  if (styles?.closeButtonHoverBorderColor)
    dynamicStyle['--alert-close-hover-border-color'] =
      styles.closeButtonHoverBorderColor
  if (styles?.closeButtonHoverTransform)
    dynamicStyle['--alert-close-hover-transform'] =
      styles.closeButtonHoverTransform
  if (styles?.closeButtonHoverBoxShadow)
    dynamicStyle['--alert-close-hover-box-shadow'] =
      styles.closeButtonHoverBoxShadow

  // The icon's size + filter still flow to the Icon child as an inline `style`:
  // the Icon merges its own per-theme filter UNDER the caller style, so only an
  // inline value preserves the old precedence (sacred had a drop-shadow filter,
  // light/dark deferred to the Icon's own filter via `undefined`). The icon
  // hover TRANSFORM lives in the CSS module (.root:hover .icon) since nothing
  // sets transform inline.
  const sacredIcon = isSacredTheme
  const iconStyle: React.CSSProperties = {
    width: styles?.iconWidth || (sacredIcon ? '24px' : '20px'),
    height: styles?.iconHeight || (sacredIcon ? '24px' : '20px'),
  }
  const iconFilter =
    styles?.iconFilter ??
    (sacredIcon ? 'drop-shadow(0 0 6px currentColor)' : undefined)
  if (iconFilter) iconStyle.filter = iconFilter
  if (styles?.iconHoverTransform)
    dynamicStyle['--alert-icon-hover-transform'] = styles.iconHoverTransform

  return (
    <div
      className={cssStyles.root}
      data-component="Alert"
      data-theme={containerTheme}
      data-severity={severity}
      data-closing={isClosing || undefined}
      data-state={isClosing ? 'closing' : 'open'}
      data-outline={styles?.outline === false ? 'false' : undefined}
      style={dynamicStyle}
      role="alert"
    >
      {isSacredTheme && <SacredGlyphs severity={severity} />}

      <Icon
        styles={{ theme: styles?.theme || 'sacred' }}
        className={cssStyles.icon}
        style={iconStyle}
      />

      <div className={cssStyles.message}>{message}</div>

      {onClose && (
        <button onClick={handleClose} className={cssStyles.closeButton}>
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert

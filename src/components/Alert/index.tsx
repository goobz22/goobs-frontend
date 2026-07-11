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
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  /** Container background; set on the `background` shorthand, so the severity background (a longhand) still wins unless that is also overridden. */
  backgroundColor?: string
  /** Container border color; highest-precedence border hook (caller > severity > theme). */
  borderColor?: string
  /** Container border radius. */
  borderRadius?: string
  /** Container border width. */
  borderWidth?: string
  /** Container box shadow. */
  boxShadow?: string
  /** Container backdrop-filter (e.g. a blur). */
  backdropFilter?: string
  /** Container background-image. */
  backgroundImage?: string
  /** Message font family. */
  fontFamily?: string
  /** Message font size. */
  fontSize?: string
  /** Message line height. */
  lineHeight?: string | number
  /** Container padding. */
  padding?: string

  // Hover states
  /** Container background on hover. */
  hoverBackgroundColor?: string
  /** Container border color on hover. */
  hoverBorderColor?: string
  /** Container box shadow on hover. */
  hoverBoxShadow?: string
  /** Container transform on hover. */
  hoverTransform?: string

  // Severity styling overrides
  /** Background when severity is 'error'. */
  errorBackgroundColor?: string
  /** Border color when severity is 'error'. */
  errorBorderColor?: string
  /** Text/icon color when severity is 'error'. */
  errorColor?: string
  /** Text shadow when severity is 'error'. */
  errorTextShadow?: string
  /** Background when severity is 'warning'. */
  warningBackgroundColor?: string
  /** Border color when severity is 'warning'. */
  warningBorderColor?: string
  /** Text/icon color when severity is 'warning'. */
  warningColor?: string
  /** Text shadow when severity is 'warning'. */
  warningTextShadow?: string
  /** Background when severity is 'info'. */
  infoBackgroundColor?: string
  /** Border color when severity is 'info'. */
  infoBorderColor?: string
  /** Text/icon color when severity is 'info'. */
  infoColor?: string
  /** Text shadow when severity is 'info'. */
  infoTextShadow?: string
  /** Background when severity is 'success'. */
  successBackgroundColor?: string
  /** Border color when severity is 'success'. */
  successBorderColor?: string
  /** Text/icon color when severity is 'success'. */
  successColor?: string
  /** Text shadow when severity is 'success'. */
  successTextShadow?: string

  // Icon styling
  /** Severity icon width (default 20px; 24px on sacred). */
  iconWidth?: string
  /** Severity icon height (default 20px; 24px on sacred). */
  iconHeight?: string
  /** Severity icon CSS filter (sacred defaults to a currentColor drop-shadow glow). */
  iconFilter?: string
  /** Severity icon transform on container hover. */
  iconHoverTransform?: string
  /** Severity icon filter on container hover. */
  iconHoverFilter?: string

  // Message styling
  /** Message text color (overrides the severity color). */
  messageColor?: string
  /** Message font weight. */
  messageFontWeight?: string | number
  /** Message letter spacing. */
  messageLetterSpacing?: string

  // Close button styling
  /** Close button width. */
  closeButtonWidth?: string
  /** Close button height. */
  closeButtonHeight?: string
  /** Close button border radius. */
  closeButtonBorderRadius?: string
  /** Close button border shorthand. */
  closeButtonBorder?: string
  /** Close button background. */
  closeButtonBackground?: string
  /** Close button text color. */
  closeButtonColor?: string
  /** Close button font size. */
  closeButtonFontSize?: string
  /** Close button font family. */
  closeButtonFontFamily?: string
  /** Close button text shadow. */
  closeButtonTextShadow?: string
  /** Close button background on hover. */
  closeButtonHoverBackground?: string
  /** Close button border color on hover. */
  closeButtonHoverBorderColor?: string
  /** Close button transform on hover. */
  closeButtonHoverTransform?: string
  /** Close button box shadow on hover. */
  closeButtonHoverBoxShadow?: string

  // Layout and spacing
  /** Flex gap between icon, message, and close button. */
  gap?: string
  /** Container margin shorthand. */
  margin?: string
  /** Container top margin. */
  marginTop?: string
  /** Container bottom margin. */
  marginBottom?: string
  /** Container left margin. */
  marginLeft?: string
  /** Container right margin. */
  marginRight?: string

  // Transitions
  /** Replaces the whole container transition with `all <duration> <easing>`. */
  transitionDuration?: string
  /** Easing used with transitionDuration (default cubic-bezier(0.4, 0, 0.2, 1)); ignored without it. */
  transitionEasing?: string

  // States
  /** Set false to remove the container border entirely (default: bordered). */
  outline?: boolean

  // Dimensions
  /** Container width. */
  width?: string
  /** Container max-width. */
  maxWidth?: string
  /** Container min-width. */
  minWidth?: string
  /** Container height. */
  height?: string
  /** Container max-height. */
  maxHeight?: string
  /** Container min-height. */
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
  /**
   * Callback fired when the alert is closed. If not provided, the close button
   * will not be shown.
   *
   * A11y — focus restoration is the CONSUMER's responsibility. Activating Close
   * fires this callback after the 200ms exit animation; the parent typically
   * unmounts the Alert, which drops keyboard focus to `<body>`. The Alert cannot
   * know where focus should return (the APG Alert pattern does not own focus), so
   * to keep a logical focus order (WCAG 2.4.3) the consumer should move focus to
   * a sensible element in `onClose` — e.g. the control that surfaced the alert.
   */
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
const Alert: React.FC<AlertProps> = ({
  severity,
  message,
  onClose,
  styles,
}) => {
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

  // A11y: the severity is conveyed VISUALLY by the icon shape + color scheme
  // only. The decorative icon is aria-hidden (below), so without this the
  // severity would be lost to assistive tech and conveyed by color/icon alone
  // (WCAG 1.4.1 / 1.3.1). This visually-hidden prefix restores the severity to
  // the assertive announcement ("Error: <message>") for screen-reader users.
  const severityLabel = {
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    success: 'Success',
  }[severity]

  // The container theme defaults to 'light'. The icon follows the SAME theme as
  // the container for visual consistency (it previously defaulted to 'sacred',
  // which rendered a gold icon inside an un-themed light Alert).
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
  if (styles?.hoverBackgroundColor)
    dynamicStyle['--alert-hover-background'] = styles.hoverBackgroundColor
  // Caller borderColor overrides the severity border (highest-precedence hook
  // in the border cascade: caller > severity > theme fallback).
  if (styles?.borderColor)
    dynamicStyle['--alert-border-color-override'] = styles.borderColor

  // Per-severity overrides (background/border/color/text-shadow).
  if (styles?.errorBackgroundColor)
    dynamicStyle['--alert-error-bg'] = styles.errorBackgroundColor
  if (styles?.errorBorderColor)
    dynamicStyle['--alert-error-border'] = styles.errorBorderColor
  if (styles?.errorColor)
    dynamicStyle['--alert-error-color'] = styles.errorColor
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
  if (styles?.iconHoverFilter)
    dynamicStyle['--alert-icon-hover-filter'] = styles.iconHoverFilter

  // Defensive guard: an out-of-enum `severity` leaves `Icon` undefined, which
  // would throw "Element type is invalid / is not a function" when React tries
  // to render <Icon/>. Placed after all hooks (rules-of-hooks safe).
  if (!Icon) {
    console.warn(`Alert: unknown severity "${severity}"`)
    return (
      <div className={cssStyles.root} data-component="Alert" role="alert">
        Unknown severity level: {severity}
      </div>
    )
  }

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

      {/* Decorative severity icon: the shape/colour it conveys is redundant with
          the severity prefix + message text, so it is hidden from assistive tech
          (WCAG 1.1.1). aria-hidden spreads onto the inner <svg> via the Icon's
          {...props}. */}
      <Icon
        styles={{ theme: containerTheme }}
        className={cssStyles.icon}
        style={iconStyle}
        aria-hidden="true"
      />

      {/* Visually-hidden severity word — see severityLabel note above. */}
      <span className={cssStyles.severityLabel}>{severityLabel}: </span>

      <div className={cssStyles.message}>{message}</div>

      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className={cssStyles.closeButton}
          data-action="close"
          aria-label="Close"
        >
          {/* Glyph is decorative; the accessible name comes from aria-label. */}
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </div>
  )
}

export default Alert

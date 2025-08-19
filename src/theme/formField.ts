// --------------------------------------------------------------------------
// SHARED FORM FIELD THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'

// One-time global reset to prevent unwanted uppercase/capitalization on text inputs
let formFieldGlobalsInjected = false
const injectFormFieldGlobalResets = () => {
  if (formFieldGlobalsInjected) return
  if (typeof document === 'undefined') return
  try {
    const styleId = 'formfield-global-resets'
    if (document.getElementById(styleId)) {
      formFieldGlobalsInjected = true
      return
    }
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Enforce no text transform on inputs across the app */
      input, textarea, [contenteditable="true"], [contenteditable=""] {
        text-transform: none !important;
      }
    `
    document.head.appendChild(style)
    formFieldGlobalsInjected = true
  } catch {}
}

export interface FormFieldTheme {
  background: string
  border: {
    default: string
    focused: string
    error: string
  }
  text: string
  label: {
    default: string
    focused: string
    error: string
    shrunkBackground: string
  }
  adornment: {
    default: string
    focused: string
  }
  footerText: {
    default: string
    error: string
    info: string
  }
  fontFamily: string
}

export interface FormFieldStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Custom colors (all must be rgba format)
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  textColor?: string
  labelColor?: string
  labelFocusedColor?: string
  labelErrorColor?: string
  labelShrunkBackgroundColor?: string
  adornmentColor?: string
  adornmentFocusedColor?: string
  footerTextColor?: string
  footerTextErrorColor?: string
  footerTextInfoColor?: string
  fontFamily?: string

  // Required field styling
  requiredIndicatorColor?: string
  requiredIndicatorText?: string

  // Field state
  disabled?: boolean
  required?: boolean
  helperTextType?: 'error' | 'info'

  // Layout and spacing
  padding?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Border and shape
  borderRadius?: string
  borderWidth?: string

  // Typography
  fontSize?: string
  fontWeight?: string | number
  lineHeight?: string

  // Dimensions
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string

  // Adornment positioning
  startAdornmentOffset?: string
  endAdornmentOffset?: string

  // Arrow positioning (for dropdowns)
  arrowTop?: string
  arrowRight?: string
  arrowBottom?: string
  arrowLeft?: string
  arrowPadding?: string

  // Label positioning
  labelOffset?: string
  labelShrunkOffset?: string

  // Footer spacing
  footerMarginTop?: string
  footerFontSize?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

export const formFieldThemes: Record<
  'light' | 'dark' | 'sacred',
  FormFieldTheme
> = {
  light: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: {
      default: 'rgba(209, 213, 219, 1)', // #D1D5DB
      focused: 'rgba(59, 130, 246, 1)', // #3B82F6
      error: 'rgba(239, 68, 68, 1)', // #EF4444
    },
    text: 'rgba(31, 41, 55, 1)',
    label: {
      default: 'rgba(107, 114, 128, 1)', // #6B7280
      focused: 'rgba(59, 130, 246, 1)', // #3B82F6
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      shrunkBackground: 'rgba(255, 255, 255, 0.95)',
    },
    adornment: {
      default: 'rgba(107, 114, 128, 1)', // #6B7280
      focused: 'rgba(59, 130, 246, 1)', // #3B82F6
    },
    footerText: {
      default: 'rgba(107, 114, 128, 1)', // #6B7280
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      info: 'rgba(59, 130, 246, 1)', // #3B82F6
    },
    fontFamily: '"Inter", sans-serif',
  },
  dark: {
    background: 'rgba(31, 41, 55, 0.95)',
    border: {
      default: 'rgba(75, 85, 99, 1)', // #4B5563
      focused: 'rgba(96, 165, 250, 1)', // #60A5FA
      error: 'rgba(239, 68, 68, 1)', // #EF4444
    },
    text: 'rgba(255, 255, 255, 1)',
    label: {
      default: 'rgba(156, 163, 175, 1)', // #9CA3AF
      focused: 'rgba(96, 165, 250, 1)', // #60A5FA
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      shrunkBackground: 'rgba(31, 41, 55, 0.95)',
    },
    adornment: {
      default: 'rgba(156, 163, 175, 1)', // #9CA3AF
      focused: 'rgba(96, 165, 250, 1)', // #60A5FA
    },
    footerText: {
      default: 'rgba(156, 163, 175, 1)', // #9CA3AF
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      info: 'rgba(96, 165, 250, 1)', // #60A5FA
    },
    fontFamily: '"Inter", sans-serif',
  },
  sacred: {
    background: 'rgba(10, 10, 10, 0.9)',
    border: {
      default: 'rgba(255, 215, 0, 0.4)', // Gold with transparency
      focused: 'rgba(255, 215, 0, 1)', // #FFD700
      error: 'rgba(239, 68, 68, 1)', // #EF4444
    },
    text: 'rgba(255, 215, 0, 1)', // #FFD700
    label: {
      default: 'rgba(255, 215, 0, 0.9)', // Gold for sacred theme labels
      focused: 'rgba(255, 215, 0, 1)', // #FFD700
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      shrunkBackground: 'rgba(10, 10, 10, 0.9)',
    },
    adornment: {
      default: 'rgba(255, 215, 0, 0.7)', // Gold for sacred theme adornments
      focused: 'rgba(255, 215, 0, 1)', // #FFD700
    },
    footerText: {
      default: 'rgba(255, 215, 0, 0.6)', // Gold for sacred theme footer text
      error: 'rgba(239, 68, 68, 1)', // #EF4444
      info: 'rgba(255, 215, 0, 0.8)', // Gold with slight transparency
    },
    // Cinzel renders lowercase as small caps, which makes inputs appear uppercased.
    // Use Inter for form fields to preserve true lowercase input rendering.
    fontFamily: '"Inter", sans-serif',
  },
}

// Helper function to get computed theme with custom style overrides
export const getFormFieldTheme = (styles?: FormFieldStyles): FormFieldTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = formFieldThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    background: styles.backgroundColor || baseTheme.background,
    border: {
      default: styles.borderColor || baseTheme.border.default,
      focused: styles.borderFocusedColor || baseTheme.border.focused,
      error: styles.borderErrorColor || baseTheme.border.error,
    },
    text: styles.textColor || baseTheme.text,
    label: {
      default: styles.labelColor || baseTheme.label.default,
      focused: styles.labelFocusedColor || baseTheme.label.focused,
      error: styles.labelErrorColor || baseTheme.label.error,
      shrunkBackground:
        styles.labelShrunkBackgroundColor || baseTheme.label.shrunkBackground,
    },
    adornment: {
      default: styles.adornmentColor || baseTheme.adornment.default,
      focused: styles.adornmentFocusedColor || baseTheme.adornment.focused,
    },
    footerText: {
      default: styles.footerTextColor || baseTheme.footerText.default,
      error: styles.footerTextErrorColor || baseTheme.footerText.error,
      info: styles.footerTextInfoColor || baseTheme.footerText.info,
    },
    fontFamily: styles.fontFamily || baseTheme.fontFamily,
  }
}

// --------------------------------------------------------------------------
// SHARED STYLE GENERATORS
// --------------------------------------------------------------------------

export const getSharedFormFieldStyles = (
  styles?: FormFieldStyles,
  isFocused?: boolean
) => {
  // Ensure global resets are applied on first use in the client
  injectFormFieldGlobalResets()

  const themeConfig = getFormFieldTheme(styles)

  // Determine helper text type
  const helperTextType = styles?.helperTextType || 'info'
  const isError = helperTextType === 'error'

  const borderColor = isError
    ? themeConfig.border.error
    : isFocused
      ? themeConfig.border.focused
      : themeConfig.border.default

  const labelColor = isError
    ? themeConfig.label.error
    : themeConfig.label.default

  const adornmentColor = isFocused
    ? themeConfig.adornment.focused
    : themeConfig.adornment.default

  const footerTextColor =
    helperTextType === 'error'
      ? themeConfig.footerText.error
      : helperTextType === 'info'
        ? themeConfig.footerText.info
        : themeConfig.footerText.default

  const transition = styles?.transitionDuration
    ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
    : 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'

  return {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
    isError,
    helperTextType,
  }
}

export const getSharedLabelStyles = (
  labelColor: string,
  themeConfig: FormFieldTheme
): React.CSSProperties => ({
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  color: labelColor,
  fontFamily: themeConfig.fontFamily,
  fontWeight: 600,
  lineHeight: '1.2',
  letterSpacing: '0.01em',
  pointerEvents: 'auto',
  textTransform: 'none',
})

export const getSharedContainerStyles = (
  styles?: FormFieldStyles
): React.CSSProperties => ({
  position: 'relative',
  width: styles?.width || '100%',
  minWidth: styles?.minWidth,
  maxWidth: styles?.maxWidth,
  height: styles?.height || 'auto',
  minHeight: styles?.minHeight,
  maxHeight: styles?.maxHeight,
  marginTop: styles?.marginTop || '0',
  marginBottom: styles?.marginBottom,
  marginLeft: styles?.marginLeft,
  marginRight: styles?.marginRight,
  margin: styles?.margin,
  // Ensure inputs and text content do not inherit uppercase from parent containers
  textTransform: 'none',
})

export const getSharedFooterTextStyles = (
  footerTextColor: string,
  themeConfig: FormFieldTheme,
  styles?: FormFieldStyles
): React.CSSProperties => ({
  display: 'block',
  marginTop: styles?.footerMarginTop || '8px',
  fontSize: styles?.footerFontSize || '12px',
  color: footerTextColor,
  fontFamily: themeConfig.fontFamily,
  lineHeight: '1.3',
  fontWeight: 400,
  textTransform: 'none',
})

export const getSharedAdornmentStyles = (
  adornmentColor: string
): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  color: adornmentColor,
})

// --------------------------------------------------------------------------
// SHARED REQUIRED FIELD UTILITIES
// --------------------------------------------------------------------------

export interface SharedFormFieldProps {
  /** The label for the input. Can be a string or a React node. */
  label?: React.ReactNode
  /** Error message to display. */
  error?: string
  /** Whether the field is required. */
  required?: boolean
  /** Whether the field is disabled. */
  disabled?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: FormFieldStyles
}

export const getRequiredLabelText = (
  label: string,
  required?: boolean,
  styles?: FormFieldStyles
): string => {
  if (!label || !required) return label

  const indicator = styles?.requiredIndicatorText || ' *'
  return `${label}${indicator}`
}

export const getRequiredIndicatorStyle = (
  styles?: FormFieldStyles
): React.CSSProperties => ({
  color: styles?.requiredIndicatorColor || 'rgba(239, 68, 68, 1)',
})

export const getRequiredProps = (required?: boolean) => ({
  required: !!required,
  'aria-required': !!required,
})

export const validateRequired = (
  value: string,
  required?: boolean
): string | undefined => {
  if (required && (!value || value.trim() === '')) {
    return 'This field is required'
  }
  return undefined
}

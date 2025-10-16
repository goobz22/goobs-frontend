// --------------------------------------------------------------------------
// CONFIRMATION CODE INPUT THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ConfirmationCodeInputTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    padding: string
    backgroundImage?: string
  }
  containerHover: {
    transform: string
    boxShadow: string
    borderColor?: string
  }
  successContainer: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    padding: string
    backgroundImage?: string
  }
  successIcon: {
    fontSize: string
    color: string
    filter?: string
    animation?: string
  }
  successMessage: {
    fontSize: string
    lineHeight: string
    color: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    textTransform: string
    textShadow?: string
  }
  input: {
    width: string
    height: string
    padding: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    color: string
    backgroundColor: string
    borderColor: string
    borderRadius: string
    borderWidth: string
    textShadow?: string
    animation?: string
  }
  inputFocus: {
    borderColor: string
    borderWidth: string
    transform: string
    boxShadow: string
  }
  statusIndicator: {
    width: string
    height: string
    borderRadius: string
    backgroundColor: string
    animation?: string
  }
  statusIndicatorValid: {
    backgroundColor: string
    animation?: string
  }
  transition: string
}

export interface ConfirmationCodeInputStyles {
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
  padding?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string

  // Success container styling
  successBackgroundColor?: string
  successBorderColor?: string
  successBorderRadius?: string
  successBoxShadow?: string
  successBackdropFilter?: string
  successBackgroundImage?: string
  successPadding?: string

  // Success icon styling
  successIconFontSize?: string
  successIconColor?: string
  successIconFilter?: string
  successIconAnimation?: string

  // Success message styling
  successMessageFontSize?: string
  successMessageLineHeight?: string
  successMessageColor?: string
  successMessageFontFamily?: string
  successMessageFontWeight?: string | number
  successMessageLetterSpacing?: string
  successMessageTextTransform?: string
  successMessageTextShadow?: string

  // Input styling
  inputWidth?: string
  inputHeight?: string
  inputPadding?: string
  inputFontSize?: string
  inputFontFamily?: string
  inputFontWeight?: string | number
  inputLetterSpacing?: string
  inputColor?: string
  inputBackgroundColor?: string
  inputBorderColor?: string
  inputBorderRadius?: string
  inputBorderWidth?: string
  inputTextShadow?: string
  inputAnimation?: string

  // Input focus styling
  inputFocusBorderColor?: string
  inputFocusBorderWidth?: string
  inputFocusTransform?: string
  inputFocusBoxShadow?: string

  // Status indicator styling
  statusIndicatorWidth?: string
  statusIndicatorHeight?: string
  statusIndicatorBorderRadius?: string
  statusIndicatorBackgroundColor?: string
  statusIndicatorAnimation?: string
  statusIndicatorValidBackgroundColor?: string
  statusIndicatorValidAnimation?: string

  // Layout and spacing
  gap?: string
  inputGap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}

export const confirmationCodeInputThemes: Record<
  'light' | 'dark' | 'sacred',
  ConfirmationCodeInputTheme
> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '12px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: SHADOWS.light.medium,
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    successContainer: {
      background: 'rgba(240, 253, 244, 0.95)',
      border: '1px solid rgba(74, 222, 128, 0.4)',
      borderRadius: '12px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
    },
    successIcon: {
      fontSize: '3.75rem',
      color: 'rgb(34, 197, 94)',
      filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
    },
    successMessage: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      color: 'rgb(21, 128, 61)',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em',
      textTransform: 'none',
    },
    input: {
      width: '3rem',
      height: '3.5rem',
      padding: '0',
      fontSize: '1.25rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0.05em',
      color: 'rgb(31, 41, 55)',
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: 'rgb(209, 213, 219)',
      borderRadius: '8px',
      borderWidth: '1px',
    },
    inputFocus: {
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: '2px',
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    statusIndicator: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      backgroundColor: 'rgb(239, 68, 68)',
    },
    statusIndicatorValid: {
      backgroundColor: 'rgb(34, 197, 94)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(96, 165, 250, 0.4)',
    },
    successContainer: {
      background: 'rgba(20, 83, 45, 0.3)',
      border: '1px solid rgba(74, 222, 128, 0.4)',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
    },
    successIcon: {
      fontSize: '3.75rem',
      color: 'rgb(187, 247, 208)',
      filter: 'drop-shadow(0 2px 4px rgba(187, 247, 208, 0.3))',
    },
    successMessage: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      color: 'rgb(187, 247, 208)',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em',
      textTransform: 'none',
    },
    input: {
      width: '3rem',
      height: '3.5rem',
      padding: '0',
      fontSize: '1.25rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0.05em',
      color: 'rgb(243, 244, 246)',
      backgroundColor: 'rgb(55, 65, 81)',
      borderColor: 'rgb(107, 114, 128)',
      borderRadius: '8px',
      borderWidth: '1px',
    },
    inputFocus: {
      borderColor: 'rgb(96, 165, 250)',
      borderWidth: '2px',
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
    },
    statusIndicator: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      backgroundColor: 'rgb(248, 113, 113)',
    },
    statusIndicatorValid: {
      backgroundColor: 'rgb(74, 222, 128)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.95)',
      border: '2px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.sacred.medium,
      borderColor: 'rgba(255, 215, 0, 0.6)',
    },
    successContainer: {
      background: 'rgba(10, 10, 10, 0.95)',
      border: '2px solid rgba(255, 215, 0, 0.6)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.medium,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
      backgroundImage: `
        radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
      `,
    },
    successIcon: {
      fontSize: '3.75rem',
      color: '#FFD700',
      filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
      animation: 'sacred-pulse 1.5s infinite',
    },
    successMessage: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      color: '#FFD700',
      fontFamily: '"Cinzel", serif',
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
    },
    input: {
      width: '3rem',
      height: '3.5rem',
      padding: '0',
      fontSize: '1.25rem',
      fontFamily: 'monospace',
      fontWeight: '600',
      letterSpacing: '0.1em',
      color: '#FFD700',
      backgroundColor: 'rgba(26, 26, 26, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.5)',
      borderRadius: '8px',
      borderWidth: '1px',
      textShadow: '0 0 2px rgba(255, 215, 0, 0.5)',
      animation: 'sacred-input-glow 3s infinite alternate',
    },
    inputFocus: {
      borderColor: '#FFD700',
      borderWidth: '2px',
      transform: 'scale(1.05)',
      boxShadow:
        '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.3)',
    },
    statusIndicator: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
    },
    statusIndicatorValid: {
      backgroundColor: '#FFD700',
      animation: 'sacred-status-glow 1.5s infinite alternate',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getConfirmationCodeInputTheme = (
  styles?: ConfirmationCodeInputStyles
): ConfirmationCodeInputTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = confirmationCodeInputThemes[theme]

  if (!styles) {
    return baseTheme
  }

  // Compute optional values so we can include them conditionally
  const containerBackgroundImage =
    styles.backgroundImage ?? baseTheme.container.backgroundImage
  const hoverBorderColor =
    styles.hoverBorderColor ?? baseTheme.containerHover.borderColor
  const successBackgroundImage =
    styles.successBackgroundImage ?? baseTheme.successContainer.backgroundImage
  const successIconFilter =
    styles.successIconFilter ?? baseTheme.successIcon.filter
  const successIconAnimation =
    styles.successIconAnimation ?? baseTheme.successIcon.animation
  const successMessageTextShadow =
    styles.successMessageTextShadow ?? baseTheme.successMessage.textShadow
  const inputTextShadow = styles.inputTextShadow ?? baseTheme.input.textShadow
  const inputAnimation = styles.inputAnimation ?? baseTheme.input.animation
  const statusIndicatorAnimation =
    styles.statusIndicatorAnimation ?? baseTheme.statusIndicator.animation
  const statusIndicatorValidAnimation =
    styles.statusIndicatorValidAnimation ??
    baseTheme.statusIndicatorValid.animation

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      padding: styles.padding || baseTheme.container.padding,
      ...(containerBackgroundImage !== undefined
        ? { backgroundImage: containerBackgroundImage }
        : {}),
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      ...(hoverBorderColor !== undefined
        ? { borderColor: hoverBorderColor }
        : {}),
    },
    successContainer: {
      background:
        styles.successBackgroundColor || baseTheme.successContainer.background,
      border: styles.successBorderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.successBorderColor}`
        : baseTheme.successContainer.border,
      borderRadius:
        styles.successBorderRadius || baseTheme.successContainer.borderRadius,
      boxShadow:
        styles.successBoxShadow || baseTheme.successContainer.boxShadow,
      backdropFilter:
        styles.successBackdropFilter ||
        baseTheme.successContainer.backdropFilter,
      padding: styles.successPadding || baseTheme.successContainer.padding,
      ...(successBackgroundImage !== undefined
        ? { backgroundImage: successBackgroundImage }
        : {}),
    },
    successIcon: {
      fontSize: styles.successIconFontSize || baseTheme.successIcon.fontSize,
      color: styles.successIconColor || baseTheme.successIcon.color,
      ...(successIconFilter !== undefined ? { filter: successIconFilter } : {}),
      ...(successIconAnimation !== undefined
        ? { animation: successIconAnimation }
        : {}),
    },
    successMessage: {
      fontSize:
        styles.successMessageFontSize || baseTheme.successMessage.fontSize,
      lineHeight:
        styles.successMessageLineHeight || baseTheme.successMessage.lineHeight,
      color: styles.successMessageColor || baseTheme.successMessage.color,
      fontFamily:
        styles.successMessageFontFamily || baseTheme.successMessage.fontFamily,
      fontWeight:
        styles.successMessageFontWeight || baseTheme.successMessage.fontWeight,
      letterSpacing:
        styles.successMessageLetterSpacing ||
        baseTheme.successMessage.letterSpacing,
      textTransform:
        styles.successMessageTextTransform ||
        baseTheme.successMessage.textTransform,
      ...(successMessageTextShadow !== undefined
        ? { textShadow: successMessageTextShadow }
        : {}),
    },
    input: {
      width: styles.inputWidth || baseTheme.input.width,
      height: styles.inputHeight || baseTheme.input.height,
      padding: styles.inputPadding || baseTheme.input.padding,
      fontSize: styles.inputFontSize || baseTheme.input.fontSize,
      fontFamily: styles.inputFontFamily || baseTheme.input.fontFamily,
      fontWeight: styles.inputFontWeight || baseTheme.input.fontWeight,
      letterSpacing: styles.inputLetterSpacing || baseTheme.input.letterSpacing,
      color: styles.inputColor || baseTheme.input.color,
      backgroundColor:
        styles.inputBackgroundColor || baseTheme.input.backgroundColor,
      borderColor: styles.inputBorderColor || baseTheme.input.borderColor,
      borderRadius: styles.inputBorderRadius || baseTheme.input.borderRadius,
      borderWidth: styles.inputBorderWidth || baseTheme.input.borderWidth,
      ...(inputTextShadow !== undefined ? { textShadow: inputTextShadow } : {}),
      ...(inputAnimation !== undefined ? { animation: inputAnimation } : {}),
    },
    inputFocus: {
      borderColor:
        styles.inputFocusBorderColor || baseTheme.inputFocus.borderColor,
      borderWidth:
        styles.inputFocusBorderWidth || baseTheme.inputFocus.borderWidth,
      transform: styles.inputFocusTransform || baseTheme.inputFocus.transform,
      boxShadow: styles.inputFocusBoxShadow || baseTheme.inputFocus.boxShadow,
    },
    statusIndicator: {
      width: styles.statusIndicatorWidth || baseTheme.statusIndicator.width,
      height: styles.statusIndicatorHeight || baseTheme.statusIndicator.height,
      borderRadius:
        styles.statusIndicatorBorderRadius ||
        baseTheme.statusIndicator.borderRadius,
      backgroundColor:
        styles.statusIndicatorBackgroundColor ||
        baseTheme.statusIndicator.backgroundColor,
      ...(statusIndicatorAnimation !== undefined
        ? { animation: statusIndicatorAnimation }
        : {}),
    },
    statusIndicatorValid: {
      backgroundColor:
        styles.statusIndicatorValidBackgroundColor ||
        baseTheme.statusIndicatorValid.backgroundColor,
      ...(statusIndicatorValidAnimation !== undefined
        ? { animation: statusIndicatorValidAnimation }
        : {}),
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Helper function to parse border shorthand into individual properties
const parseBorder = (borderString: string) => {
  const parts = borderString.split(' ')
  return {
    borderWidth: parts[0] || '1px',
    borderStyle: parts[1] || 'solid',
    borderColor: parts.slice(2).join(' ') || 'transparent',
  }
}

// Main style generator function
export const getConfirmationCodeInputStyles = (
  styles?: ConfirmationCodeInputStyles,
  isHovered?: boolean,
  isValid?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getConfirmationCodeInputTheme(styles)
  const containerBorder = parseBorder(themeConfig.container.border)
  const successContainerBorder = parseBorder(
    themeConfig.successContainer.border
  )

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    background: themeConfig.container.background,
    borderWidth: containerBorder.borderWidth,
    borderStyle: containerBorder.borderStyle,
    borderColor: containerBorder.borderColor,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    padding: themeConfig.container.padding,
    backgroundImage: themeConfig.container.backgroundImage,
    transition: themeConfig.transition,
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'default',
    ...(isHovered &&
      !isDisabled && {
        transform: themeConfig.containerHover.transform,
        boxShadow: themeConfig.containerHover.boxShadow,
        borderColor: themeConfig.containerHover.borderColor,
      }),
  }

  const successContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '400px',
    background: themeConfig.successContainer.background,
    borderWidth: successContainerBorder.borderWidth,
    borderStyle: successContainerBorder.borderStyle,
    borderColor: successContainerBorder.borderColor,
    borderRadius: themeConfig.successContainer.borderRadius,
    boxShadow: themeConfig.successContainer.boxShadow,
    backdropFilter: themeConfig.successContainer.backdropFilter,
    padding: themeConfig.successContainer.padding,
    backgroundImage: themeConfig.successContainer.backgroundImage,
    transition: themeConfig.transition,
  }

  const successIconStyle: React.CSSProperties = {
    fontSize: themeConfig.successIcon.fontSize,
    color: themeConfig.successIcon.color,
    filter: themeConfig.successIcon.filter,
    animation: themeConfig.successIcon.animation,
  }

  const successMessageStyle: React.CSSProperties = {
    fontSize: themeConfig.successMessage.fontSize,
    lineHeight: themeConfig.successMessage.lineHeight,
    color: themeConfig.successMessage.color,
    fontFamily: themeConfig.successMessage.fontFamily,
    fontWeight: themeConfig.successMessage.fontWeight,
    letterSpacing: themeConfig.successMessage.letterSpacing,
    textTransform: themeConfig.successMessage.textTransform as any,
    textShadow: themeConfig.successMessage.textShadow,
    textAlign: 'center',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    maxWidth: '100%',
    margin: 0,
  }

  const inputStyle: React.CSSProperties = {
    width: themeConfig.input.width,
    height: themeConfig.input.height,
    padding: themeConfig.input.padding,
    fontSize: themeConfig.input.fontSize,
    fontFamily: themeConfig.input.fontFamily,
    fontWeight: themeConfig.input.fontWeight,
    letterSpacing: themeConfig.input.letterSpacing,
    color: themeConfig.input.color,
    backgroundColor: themeConfig.input.backgroundColor,
    borderWidth: themeConfig.input.borderWidth,
    borderStyle: 'solid',
    borderColor: themeConfig.input.borderColor,
    borderRadius: themeConfig.input.borderRadius,
    textShadow: themeConfig.input.textShadow,
    animation: themeConfig.input.animation,
    textAlign: 'center',
    outline: 'none',
    transition: themeConfig.transition,
  }

  const inputFocusStyle: React.CSSProperties = {
    borderColor: themeConfig.inputFocus.borderColor,
    borderWidth: themeConfig.inputFocus.borderWidth,
    transform: themeConfig.inputFocus.transform,
    boxShadow: themeConfig.inputFocus.boxShadow,
  }

  const statusIndicatorStyle: React.CSSProperties = {
    width: themeConfig.statusIndicator.width,
    height: themeConfig.statusIndicator.height,
    borderRadius: themeConfig.statusIndicator.borderRadius,
    backgroundColor: isValid
      ? themeConfig.statusIndicatorValid.backgroundColor
      : themeConfig.statusIndicator.backgroundColor,
    animation: isValid
      ? themeConfig.statusIndicatorValid.animation
      : themeConfig.statusIndicator.animation,
    transition: themeConfig.transition,
  }

  const mainContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: styles?.gap || '1.25rem',
  }

  const inputsRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: styles?.inputGap || '0.75rem',
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  }

  return {
    container: containerStyle,
    successContainer: successContainerStyle,
    successIcon: successIconStyle,
    successMessage: successMessageStyle,
    input: inputStyle,
    inputFocus: inputFocusStyle,
    statusIndicator: statusIndicatorStyle,
    mainContent: mainContentStyle,
    inputsRow: inputsRowStyle,
    inputGroup: inputGroupStyle,
    buttonContainer: buttonContainerStyle,
  }
}

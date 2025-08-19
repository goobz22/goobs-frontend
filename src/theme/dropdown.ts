// --------------------------------------------------------------------------
// DROPDOWN THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface DropdownTheme {
  // Container styling
  container: {
    position: string
    width: string
    minWidth: string
    maxWidth: string
    height: string
    minHeight: string
    maxHeight: string
    fontFamily: string
  }

  // Label styling
  label: {
    color: string
    fontSize: string
    fontWeight: string | number
    marginBottom: string
    fontFamily: string
  }

  // Trigger/Input styling
  trigger: {
    background: string
    border: string
    borderRadius: string
    borderColor: string
    borderFocusedColor: string
    borderErrorColor: string
    color: string
    fontSize: string
    fontFamily: string
    padding: string
    minHeight: string
    cursor: string
    transition: string
    height: string
  }

  // Dropdown menu styling
  dropdown: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    marginTop: string
    maxHeight: string
    zIndex: number
  }

  // Option styling
  option: {
    background: string
    color: string
    fontSize: string
    fontFamily: string
    padding: string
    cursor: string
    transition: string
    hoverBackground: string
    hoverColor: string
  }

  // Arrow/Icon styling
  icon: {
    color: string
    size: string
    transition: string
  }

  // Footer text styling
  footerText: {
    color: string
    fontSize: string
    fontFamily: string
    marginTop: string
  }

  // Disabled states
  disabled: {
    background: string
    color: string
    borderColor: string
    cursor: string
    iconColor: string
  }

  // Scrollbar styling
  scrollbar: {
    width: string
    trackBackground: string
    thumbBackground: string
    thumbHoverBackground: string
    borderRadius: string
  }

  // Sacred theme specific
  sacred: {
    glow: string
    textShadow: string
  }
}

export interface DropdownStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container dimensions
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  maxHeight?: string

  // Styling overrides
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  borderRadius?: string
  borderWidth?: string
  textColor?: string
  fontSize?: string
  fontFamily?: string
  padding?: string

  // Label styling
  labelColor?: string
  labelFontSize?: string
  labelFontWeight?: string | number
  labelMarginBottom?: string

  // Dropdown menu styling
  dropdownBackground?: string
  dropdownBorderColor?: string
  dropdownBorderRadius?: string
  dropdownBoxShadow?: string
  dropdownMarginTop?: string
  dropdownMaxHeight?: string
  dropdownZIndex?: number

  // Option styling
  optionBackground?: string
  optionColor?: string
  optionFontSize?: string
  optionPadding?: string
  optionHoverBackground?: string
  optionHoverColor?: string

  // Icon styling
  iconColor?: string
  iconSize?: string

  // Footer text styling
  footerTextColor?: string
  footerTextFontSize?: string
  footerTextMarginTop?: string

  // States
  disabled?: boolean
  required?: boolean
  helperTextType?: 'error' | 'info'

  // Spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // Required field styling
  requiredIndicatorColor?: string
  requiredIndicatorText?: string
}

export const dropdownThemes: Record<
  'light' | 'dark' | 'sacred',
  DropdownTheme
> = {
  light: {
    container: {
      position: 'relative',
      width: '100%',
      minWidth: 'auto',
      maxWidth: 'none',
      height: 'auto',
      minHeight: 'auto',
      maxHeight: 'none',
      fontFamily: '"Inter", sans-serif',
    },
    label: {
      color: 'rgba(107, 114, 128, 1)',
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: '6px',
      fontFamily: '"Inter", sans-serif',
    },
    trigger: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(209, 213, 219, 1)',
      borderRadius: '8px',
      borderColor: 'rgba(209, 213, 219, 1)',
      borderFocusedColor: 'rgba(59, 130, 246, 1)',
      borderErrorColor: 'rgba(239, 68, 68, 1)',
      color: 'rgba(31, 41, 55, 1)',
      fontSize: '16px',
      fontFamily: '"Inter", sans-serif',
      padding: '8px 16px',
      minHeight: '40px',
      cursor: 'text',
      transition: TRANSITIONS.medium,
      height: '40px',
    },
    dropdown: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(209, 213, 219, 1)',
      borderRadius: '8px',
      boxShadow: SHADOWS.light.medium,
      marginTop: '4px',
      maxHeight: '240px',
      zIndex: 1000,
    },
    option: {
      background: 'transparent',
      color: 'rgba(31, 41, 55, 1)',
      fontSize: '14px',
      fontFamily: '"Inter", sans-serif',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: TRANSITIONS.medium,
      hoverBackground: 'rgba(243, 244, 246, 1)',
      hoverColor: 'rgba(31, 41, 55, 1)',
    },
    icon: {
      color: 'rgba(31, 41, 55, 1)',
      size: '20px',
      transition: TRANSITIONS.medium,
    },
    footerText: {
      color: 'rgba(107, 114, 128, 1)',
      fontSize: '12px',
      fontFamily: '"Inter", sans-serif',
      marginTop: '8px',
    },
    disabled: {
      background: 'rgba(224, 224, 224, 1)',
      color: 'rgba(158, 158, 158, 1)',
      borderColor: 'rgba(189, 189, 189, 1)',
      cursor: 'not-allowed',
      iconColor: 'rgba(158, 158, 158, 1)',
    },
    scrollbar: {
      width: '8px',
      trackBackground: 'rgba(243, 244, 246, 0.3)',
      thumbBackground: 'rgba(156, 163, 175, 0.6)',
      thumbHoverBackground: 'rgba(156, 163, 175, 0.8)',
      borderRadius: '4px',
    },
    sacred: {
      glow: '0 0 0 transparent',
      textShadow: 'none',
    },
  },
  dark: {
    container: {
      position: 'relative',
      width: '100%',
      minWidth: 'auto',
      maxWidth: 'none',
      height: 'auto',
      minHeight: 'auto',
      maxHeight: 'none',
      fontFamily: '"Inter", sans-serif',
    },
    label: {
      color: 'rgba(156, 163, 175, 1)',
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: '6px',
      fontFamily: '"Inter", sans-serif',
    },
    trigger: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 1)',
      borderRadius: '8px',
      borderColor: 'rgba(75, 85, 99, 1)',
      borderFocusedColor: 'rgba(96, 165, 250, 1)',
      borderErrorColor: 'rgba(239, 68, 68, 1)',
      color: 'rgba(255, 255, 255, 1)',
      fontSize: '16px',
      fontFamily: '"Inter", sans-serif',
      padding: '8px 16px',
      minHeight: '40px',
      cursor: 'text',
      transition: TRANSITIONS.medium,
      height: '40px',
    },
    dropdown: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 1)',
      borderRadius: '8px',
      boxShadow: SHADOWS.dark.medium,
      marginTop: '4px',
      maxHeight: '240px',
      zIndex: 1000,
    },
    option: {
      background: 'transparent',
      color: 'rgba(255, 255, 255, 1)',
      fontSize: '14px',
      fontFamily: '"Inter", sans-serif',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: TRANSITIONS.medium,
      hoverBackground: 'rgba(75, 85, 99, 1)',
      hoverColor: 'rgba(255, 255, 255, 1)',
    },
    icon: {
      color: 'rgba(255, 255, 255, 1)',
      size: '20px',
      transition: TRANSITIONS.medium,
    },
    footerText: {
      color: 'rgba(156, 163, 175, 1)',
      fontSize: '12px',
      fontFamily: '"Inter", sans-serif',
      marginTop: '8px',
    },
    disabled: {
      background: 'rgba(55, 65, 81, 1)',
      color: 'rgba(107, 114, 128, 1)',
      borderColor: 'rgba(75, 85, 99, 1)',
      cursor: 'not-allowed',
      iconColor: 'rgba(107, 114, 128, 1)',
    },
    scrollbar: {
      width: '8px',
      trackBackground: 'rgba(75, 85, 99, 0.3)',
      thumbBackground: 'rgba(156, 163, 175, 0.6)',
      thumbHoverBackground: 'rgba(156, 163, 175, 0.8)',
      borderRadius: '4px',
    },
    sacred: {
      glow: '0 0 0 transparent',
      textShadow: 'none',
    },
  },
  sacred: {
    container: {
      position: 'relative',
      width: '100%',
      minWidth: 'auto',
      maxWidth: 'none',
      height: 'auto',
      minHeight: 'auto',
      maxHeight: 'none',
      fontFamily: '"Cinzel", serif',
    },
    label: {
      color: 'rgba(255, 215, 0, 0.9)',
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: '6px',
      fontFamily: '"Cinzel", serif',
    },
    trigger: {
      background: 'rgba(10, 10, 10, 0.9)',
      border: '1px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '8px',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      borderFocusedColor: 'rgba(255, 215, 0, 1)',
      borderErrorColor: 'rgba(239, 68, 68, 1)',
      color: 'rgba(255, 215, 0, 1)',
      fontSize: '16px',
      fontFamily: '"Cinzel", serif',
      padding: '8px 16px',
      minHeight: '40px',
      cursor: 'text',
      transition: TRANSITIONS.medium,
      height: '40px',
    },
    dropdown: {
      background: 'rgba(10, 10, 10, 0.9)',
      border: '1px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
      marginTop: '4px',
      maxHeight: '240px',
      zIndex: 1000,
    },
    option: {
      background: 'transparent',
      color: 'rgba(255, 215, 0, 1)',
      fontSize: '14px',
      fontFamily: '"Cinzel", serif',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: TRANSITIONS.medium,
      hoverBackground: 'rgba(255, 215, 0, 0.1)',
      hoverColor: 'rgba(255, 215, 0, 1)',
    },
    icon: {
      color: 'rgba(255, 215, 0, 1)',
      size: '20px',
      transition: TRANSITIONS.medium,
    },
    footerText: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '12px',
      fontFamily: '"Cinzel", serif',
      marginTop: '8px',
    },
    disabled: {
      background: 'rgba(30, 30, 30, 0.8)',
      color: 'rgba(107, 114, 128, 1)',
      borderColor: 'rgba(255, 215, 0, 0.2)',
      cursor: 'not-allowed',
      iconColor: 'rgba(107, 114, 128, 1)',
    },
    scrollbar: {
      width: '8px',
      trackBackground: 'rgba(255, 215, 0, 0.1)',
      thumbBackground: 'rgba(255, 215, 0, 0.6)',
      thumbHoverBackground: 'rgba(255, 215, 0, 0.8)',
      borderRadius: '4px',
    },
    sacred: {
      glow: '0 0 10px rgba(255, 215, 0, 0.4)',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getDropdownTheme = (styles?: DropdownStyles): DropdownTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = dropdownThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      ...baseTheme.container,
      width: styles.width || baseTheme.container.width,
      minWidth: styles.minWidth || baseTheme.container.minWidth,
      maxWidth: styles.maxWidth || baseTheme.container.maxWidth,
      height: styles.height || baseTheme.container.height,
      minHeight: styles.minHeight || baseTheme.container.minHeight,
      maxHeight: styles.maxHeight || baseTheme.container.maxHeight,
      fontFamily: styles.fontFamily || baseTheme.container.fontFamily,
    },
    label: {
      ...baseTheme.label,
      color: styles.labelColor || baseTheme.label.color,
      fontSize: styles.labelFontSize || baseTheme.label.fontSize,
      fontWeight: styles.labelFontWeight || baseTheme.label.fontWeight,
      marginBottom: styles.labelMarginBottom || baseTheme.label.marginBottom,
      fontFamily: styles.fontFamily || baseTheme.label.fontFamily,
    },
    trigger: {
      ...baseTheme.trigger,
      background: styles.backgroundColor || baseTheme.trigger.background,
      borderColor: styles.borderColor || baseTheme.trigger.borderColor,
      borderFocusedColor:
        styles.borderFocusedColor || baseTheme.trigger.borderFocusedColor,
      borderErrorColor:
        styles.borderErrorColor || baseTheme.trigger.borderErrorColor,
      borderRadius: styles.borderRadius || baseTheme.trigger.borderRadius,
      color: styles.textColor || baseTheme.trigger.color,
      fontSize: styles.fontSize || baseTheme.trigger.fontSize,
      fontFamily: styles.fontFamily || baseTheme.trigger.fontFamily,
      padding: styles.padding || baseTheme.trigger.padding,
      minHeight: styles.minHeight || baseTheme.trigger.minHeight,
      border: `${styles.borderWidth || '1px'} solid ${styles.borderColor || baseTheme.trigger.borderColor}`,
      transition: styles.transitionDuration
        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
        : baseTheme.trigger.transition,
    },
    dropdown: {
      ...baseTheme.dropdown,
      background: styles.dropdownBackground || baseTheme.dropdown.background,
      border: `1px solid ${styles.dropdownBorderColor || styles.borderColor || baseTheme.dropdown.border.split(' ')[2]}`,
      borderRadius:
        styles.dropdownBorderRadius ||
        styles.borderRadius ||
        baseTheme.dropdown.borderRadius,
      boxShadow: styles.dropdownBoxShadow || baseTheme.dropdown.boxShadow,
      marginTop: styles.dropdownMarginTop || baseTheme.dropdown.marginTop,
      maxHeight: styles.dropdownMaxHeight || baseTheme.dropdown.maxHeight,
      zIndex: styles.dropdownZIndex || baseTheme.dropdown.zIndex,
    },
    option: {
      ...baseTheme.option,
      background: styles.optionBackground || baseTheme.option.background,
      color: styles.optionColor || styles.textColor || baseTheme.option.color,
      fontSize: styles.optionFontSize || baseTheme.option.fontSize,
      fontFamily: styles.fontFamily || baseTheme.option.fontFamily,
      padding: styles.optionPadding || baseTheme.option.padding,
      hoverBackground:
        styles.optionHoverBackground || baseTheme.option.hoverBackground,
      hoverColor: styles.optionHoverColor || baseTheme.option.hoverColor,
    },
    icon: {
      ...baseTheme.icon,
      color: styles.iconColor || styles.textColor || baseTheme.icon.color,
      size: styles.iconSize || baseTheme.icon.size,
    },
    footerText: {
      ...baseTheme.footerText,
      color: styles.footerTextColor || baseTheme.footerText.color,
      fontSize: styles.footerTextFontSize || baseTheme.footerText.fontSize,
      fontFamily: styles.fontFamily || baseTheme.footerText.fontFamily,
      marginTop: styles.footerTextMarginTop || baseTheme.footerText.marginTop,
    },
    disabled: baseTheme.disabled,
    scrollbar: baseTheme.scrollbar,
    sacred: baseTheme.sacred,
  }
}

// Main style generator function
export const getDropdownStyles = (
  styles?: DropdownStyles,
  isOpen?: boolean,
  isFocused?: boolean
) => {
  const themeConfig = getDropdownTheme(styles)
  const isError = styles?.helperTextType === 'error'
  const isSacred = styles?.theme === 'sacred'

  // Determine border color based on state
  const borderColor = isError
    ? themeConfig.trigger.borderErrorColor
    : isFocused || isOpen
      ? themeConfig.trigger.borderFocusedColor
      : themeConfig.trigger.borderColor

  const containerStyle: React.CSSProperties = {
    position: themeConfig.container.position as any,
    width: themeConfig.container.width,
    minWidth: themeConfig.container.minWidth,
    maxWidth: themeConfig.container.maxWidth,
    height: themeConfig.container.height,
    minHeight: themeConfig.container.minHeight,
    maxHeight: themeConfig.container.maxHeight,
    fontFamily: themeConfig.container.fontFamily,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: themeConfig.label.color,
    fontSize: themeConfig.label.fontSize,
    fontWeight: themeConfig.label.fontWeight,
    marginBottom: themeConfig.label.marginBottom,
    fontFamily: themeConfig.label.fontFamily,
    lineHeight: '1.2',
    letterSpacing: '0.01em',
  }

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: styles?.height || themeConfig.trigger.minHeight,
    minHeight: styles?.minHeight || themeConfig.trigger.minHeight,
    padding: themeConfig.trigger.padding,
    backgroundColor: themeConfig.trigger.background,
    border: `1px solid ${borderColor}`,
    borderRadius: themeConfig.trigger.borderRadius,
    color: themeConfig.trigger.color,
    fontSize: themeConfig.trigger.fontSize,
    fontFamily: themeConfig.trigger.fontFamily,
    cursor: themeConfig.trigger.cursor,
    outline: 'none',
    transition: themeConfig.trigger.transition,
    ...(styles?.disabled && {
      backgroundColor: themeConfig.disabled.background,
      color: themeConfig.disabled.color,
      borderColor: themeConfig.disabled.borderColor,
      cursor: themeConfig.disabled.cursor,
    }),
    ...(isSacred && {
      textShadow: themeConfig.sacred.textShadow,
      boxShadow: themeConfig.sacred.glow,
    }),
  }

  const inputStyle: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'inherit',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    width: '100%',
    padding: 0,
    height: '100%',
    cursor: 'inherit',
    ...(styles?.disabled && {
      cursor: themeConfig.disabled.cursor,
    }),
  }

  const arrowButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: themeConfig.icon.color,
    minWidth: themeConfig.icon.size,
    height: '100%',
    transition: themeConfig.icon.transition,
    ...(styles?.disabled && {
      color: themeConfig.disabled.iconColor,
      cursor: themeConfig.disabled.cursor,
    }),
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: themeConfig.dropdown.background,
    border: themeConfig.dropdown.border,
    borderRadius: themeConfig.dropdown.borderRadius,
    boxShadow: themeConfig.dropdown.boxShadow,
    marginTop: themeConfig.dropdown.marginTop,
    maxHeight: themeConfig.dropdown.maxHeight,
    overflowY: 'auto',
    zIndex: themeConfig.dropdown.zIndex,
    scrollbarWidth: 'thin',
    scrollbarColor: `${themeConfig.scrollbar.thumbBackground} ${themeConfig.scrollbar.trackBackground}`,
  }

  const optionStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: themeConfig.option.padding,
    backgroundColor: themeConfig.option.background,
    color: themeConfig.option.color,
    fontSize: themeConfig.option.fontSize,
    fontFamily: themeConfig.option.fontFamily,
    cursor: themeConfig.option.cursor,
    border: 'none',
    outline: 'none',
    transition: themeConfig.option.transition,
    textAlign: 'left',
  }

  const footerTextStyle: React.CSSProperties = {
    display: 'block',
    color: themeConfig.footerText.color,
    fontSize: themeConfig.footerText.fontSize,
    fontFamily: themeConfig.footerText.fontFamily,
    marginTop: themeConfig.footerText.marginTop,
    lineHeight: '1.3',
  }

  // Generate scrollbar styles
  const scrollbarStyles = `
    .dropdown-listbox::-webkit-scrollbar {
      width: ${themeConfig.scrollbar.width};
    }
    
    .dropdown-listbox::-webkit-scrollbar-track {
      background: ${themeConfig.scrollbar.trackBackground};
      border-radius: ${themeConfig.scrollbar.borderRadius};
    }
    
    .dropdown-listbox::-webkit-scrollbar-thumb {
      background: ${themeConfig.scrollbar.thumbBackground};
      border-radius: ${themeConfig.scrollbar.borderRadius};
    }
    
    .dropdown-listbox::-webkit-scrollbar-thumb:hover {
      background: ${themeConfig.scrollbar.thumbHoverBackground};
    }
  `

  return {
    container: containerStyle,
    label: labelStyle,
    trigger: triggerStyle,
    input: inputStyle,
    arrowButton: arrowButtonStyle,
    dropdown: dropdownStyle,
    option: optionStyle,
    footerText: footerTextStyle,
    scrollbarStyles,
    theme: themeConfig,
    // Helper function to get option hover styles
    getOptionHoverStyle: (): React.CSSProperties => ({
      backgroundColor: themeConfig.option.hoverBackground,
      color: themeConfig.option.hoverColor,
    }),
  }
}

// Required field utilities
export const getRequiredIndicatorStyle = (
  styles?: DropdownStyles
): React.CSSProperties => ({
  color: styles?.requiredIndicatorColor || '#EF4444',
  fontWeight: 'bold',
})

export const getRequiredProps = (required?: boolean) => ({
  ...(required && { 'aria-required': true }),
})

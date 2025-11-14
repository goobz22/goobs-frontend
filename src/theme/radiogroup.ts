// --------------------------------------------------------------------------
// RADIOGROUP THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface RadioGroupTheme {
  formControl: React.CSSProperties
  formLabel: React.CSSProperties
  label: React.CSSProperties
  labelHover: React.CSSProperties
  input: React.CSSProperties
  radioSpan: React.CSSProperties
  radioOuter: React.CSSProperties
  radioOuterHover: React.CSSProperties
  radioOuterChecked: React.CSSProperties
  radioInner: React.CSSProperties
  radioInnerChecked: React.CSSProperties
  text: React.CSSProperties
  textHover: React.CSSProperties
  glyph: React.CSSProperties
  transition: string
}

export interface RadioGroupStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Label styling
  labelColor?: string
  labelFontSize?: string
  labelFontWeight?: string | number
  labelFontFamily?: string

  // Radio button styling
  radioSize?: string
  radioOuterBorderColor?: string
  radioOuterBorderWidth?: string
  radioInnerColor?: string
  radioHoverBorderColor?: string
  radioHoverBackgroundColor?: string

  // Text styling
  textColor?: string
  textFontSize?: string
  textFontFamily?: string
  textHoverColor?: string

  // Layout and spacing
  padding?: string
  marginBottom?: string
  gap?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  showGlyph?: boolean
}

export const radioGroupThemes: Record<
  'light' | 'dark' | 'sacred',
  RadioGroupTheme
> = {
  light: {
    formControl: {
      position: 'relative',
    },
    formLabel: {
      marginBottom: '0.5rem',
      display: 'block',
      color: 'rgb(17, 24, 39)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.5rem 0',
      transition: TRANSITIONS.medium,
    },
    labelHover: {},
    input: {
      display: 'none',
    },
    radioSpan: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    radioOuter: {
      width: '20px',
      height: '20px',
      border: '2px solid #D1D5DB',
      borderRadius: '50%',
      marginRight: '0.75rem',
      transition: TRANSITIONS.medium,
    },
    radioOuterHover: {
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.04)',
    },
    radioOuterChecked: {
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
    },
    radioInner: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      position: 'absolute',
      left: '5px',
      top: '5px',
      transition: TRANSITIONS.medium,
      transform: 'scale(0)',
      backgroundColor: '#3B82F6',
    },
    radioInnerChecked: {
      transform: 'scale(1)',
    },
    text: {
      color: 'rgb(55, 65, 81)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
    },
    textHover: {},
    glyph: {
      position: 'absolute',
      top: '-5px',
      right: '0',
      fontSize: '16px',
      color: 'transparent',
      animation: 'none',
      display: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    formControl: {
      position: 'relative',
    },
    formLabel: {
      marginBottom: '0.5rem',
      display: 'block',
      color: 'rgb(243, 244, 246)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.5rem 0',
      transition: TRANSITIONS.medium,
    },
    labelHover: {},
    input: {
      display: 'none',
    },
    radioSpan: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    radioOuter: {
      width: '20px',
      height: '20px',
      border: '2px solid #6B7280',
      borderRadius: '50%',
      marginRight: '0.75rem',
      transition: TRANSITIONS.medium,
    },
    radioOuterHover: {
      borderColor: '#60A5FA',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
    },
    radioOuterChecked: {
      borderColor: '#60A5FA',
      backgroundColor: '#60A5FA',
    },
    radioInner: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      position: 'absolute',
      left: '5px',
      top: '5px',
      transition: TRANSITIONS.medium,
      transform: 'scale(0)',
      backgroundColor: '#60A5FA',
    },
    radioInnerChecked: {
      transform: 'scale(1)',
    },
    text: {
      color: 'rgb(209, 213, 219)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
    },
    textHover: {},
    glyph: {
      position: 'absolute',
      top: '-5px',
      right: '0',
      fontSize: '16px',
      color: 'transparent',
      animation: 'none',
      display: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    formControl: {
      position: 'relative',
    },
    formLabel: {
      marginBottom: '0.5rem',
      display: 'block',
      color: '#FFD700',
      fontWeight: '600',
      letterSpacing: '0.025em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
      fontFamily: 'Cinzel, serif',
      fontSize: '0.875rem',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.5rem 0',
      transition: TRANSITIONS.premium,
    },
    labelHover: {
      transform: 'translateX(4px)',
    },
    input: {
      display: 'none',
    },
    radioSpan: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    radioOuter: {
      width: '20px',
      height: '20px',
      border: '2px solid #FFD700',
      borderRadius: '50%',
      marginRight: '0.75rem',
      transition: TRANSITIONS.premium,
    },
    radioOuterHover: {
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    radioOuterChecked: {
      borderColor: '#FFD700',
      backgroundColor: '#FFD700',
    },
    radioInner: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      position: 'absolute',
      left: '5px',
      top: '5px',
      transition: TRANSITIONS.premium,
      transform: 'scale(0)',
      backgroundColor: '#FFD700',
    },
    radioInnerChecked: {
      transform: 'scale(1)',
    },
    text: {
      color: 'rgba(255, 215, 0, 0.9)',
      transition: TRANSITIONS.premium,
      fontFamily: 'Cinzel, serif',
      fontSize: '0.875rem',
    },
    textHover: {
      color: '#FFD700',
      textShadow: '0 0 3px rgba(255, 215, 0, 0.5)',
    },
    glyph: {
      position: 'absolute',
      top: '-5px',
      right: '0',
      fontSize: '16px',
      color: 'transparent',
      animation: 'none',
      display: 'none',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getRadioGroupTheme = (
  styles?: RadioGroupStyles
): RadioGroupTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = radioGroupThemes[theme]

  if (!styles) {
    return baseTheme
  }

  const radioSize = styles.radioSize || '20px'
  const radioDimension = parseInt(radioSize)

  // Calculate inner size to fill almost the entire inner area (minimal margin)
  const innerSize = `${radioDimension - 6}px`
  // Position the inner circle with 3px offset for centering
  const innerOffset = `3px`

  return {
    ...baseTheme,
    formLabel: {
      ...baseTheme.formLabel,
      color: styles.labelColor || baseTheme.formLabel.color,
      fontSize: styles.labelFontSize || baseTheme.formLabel.fontSize,
      fontWeight: styles.labelFontWeight || baseTheme.formLabel.fontWeight,
      fontFamily: styles.labelFontFamily || baseTheme.formLabel.fontFamily,
      marginBottom: styles.marginBottom || baseTheme.formLabel.marginBottom,
    },
    label: {
      ...baseTheme.label,
      padding: styles.padding || baseTheme.label.padding,
    },
    radioOuter: {
      ...baseTheme.radioOuter,
      width: radioSize,
      height: radioSize,
      border: `${styles.radioOuterBorderWidth || '2px'} solid ${styles.radioOuterBorderColor || (baseTheme.radioOuter.border && typeof baseTheme.radioOuter.border === 'string' ? baseTheme.radioOuter.border.split(' ')[2] : '#D1D5DB')}`,
    },
    radioOuterHover: {
      ...baseTheme.radioOuterHover,
      borderColor:
        styles.radioHoverBorderColor || baseTheme.radioOuterHover.borderColor,
      backgroundColor:
        styles.radioHoverBackgroundColor ||
        baseTheme.radioOuterHover.backgroundColor,
    },
    radioInner: {
      ...baseTheme.radioInner,
      width: innerSize,
      height: innerSize,
      left: innerOffset,
      top: innerOffset,
      backgroundColor:
        styles.radioInnerColor || baseTheme.radioInner.backgroundColor,
    },
    text: {
      ...baseTheme.text,
      color: styles.textColor || baseTheme.text.color,
      fontSize: styles.textFontSize || baseTheme.text.fontSize,
      fontFamily: styles.textFontFamily || baseTheme.text.fontFamily,
    },
    textHover: {
      ...baseTheme.textHover,
      color: styles.textHoverColor || baseTheme.textHover.color,
    },
    glyph: {
      ...baseTheme.glyph,
      display: styles.showGlyph ? 'block' : baseTheme.glyph.display,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getRadioGroupStyles = (
  styles?: RadioGroupStyles,
  hoveredLabel?: string | null
) => {
  const themeConfig = getRadioGroupTheme(styles)

  const getOptionStyles = (optionLabel: string, isChecked: boolean) => {
    const isHovered = hoveredLabel === optionLabel

    const labelStyle: React.CSSProperties = {
      ...themeConfig.label,
      ...(isHovered && themeConfig.labelHover),
    }

    const radioOuterStyle: React.CSSProperties = {
      ...themeConfig.radioOuter,
      ...(isHovered && themeConfig.radioOuterHover),
      ...(isChecked && themeConfig.radioOuterChecked),
    }

    const radioInnerStyle: React.CSSProperties = {
      ...themeConfig.radioInner,
      display: 'none', // Hide the inner circle completely
    }

    const textStyle: React.CSSProperties = {
      ...themeConfig.text,
      ...(isHovered && themeConfig.textHover),
    }

    return {
      label: labelStyle,
      radioOuter: radioOuterStyle,
      radioInner: radioInnerStyle,
      text: textStyle,
    }
  }

  return {
    formControl: themeConfig.formControl,
    formLabel: themeConfig.formLabel,
    input: themeConfig.input,
    radioSpan: themeConfig.radioSpan,
    glyph: themeConfig.glyph,
    getOptionStyles,
  }
}

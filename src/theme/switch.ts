/**
 * @fileoverview Switch component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface SwitchTheme {
  /** Main container styling */
  container: React.CSSProperties
  /** Container when disabled */
  containerDisabled: React.CSSProperties
  /** Track (background) styling */
  track: React.CSSProperties
  /** Track without outline */
  trackNoOutline: React.CSSProperties
  /** Track when checked */
  trackChecked: React.CSSProperties
  /** Track when focused */
  trackFocused: React.CSSProperties
  /** Track when disabled */
  trackDisabled: React.CSSProperties
  /** Thumb (switch handle) styling */
  thumb: React.CSSProperties
  /** Thumb when checked */
  thumbChecked: React.CSSProperties
  /** Thumb when disabled */
  thumbDisabled: React.CSSProperties
  /** Input element styling */
  input: React.CSSProperties
  /** Input when disabled */
  inputDisabled: React.CSSProperties
  /** Sacred glyph styling */
  glyph: React.CSSProperties
  /** Sacred glyph left position */
  glyphLeft: React.CSSProperties
  /** Sacred glyph right position */
  glyphRight: React.CSSProperties
  /** Sacred glyph when visible */
  glyphVisible: React.CSSProperties
  /** Sacred shimmer effect */
  shimmer: React.CSSProperties
  /** Left label styling */
  leftLabel: React.CSSProperties
  /** Right label styling */
  rightLabel: React.CSSProperties
}

export interface SwitchStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Whether to show outline */
  outline?: boolean
  /** Whether the switch is disabled */
  disabled?: boolean
  /** Whether the switch is checked */
  checked?: boolean
  /** Custom track width */
  trackWidth?: string
  /** Custom track height */
  trackHeight?: string
  /** Custom track background color */
  trackBackground?: string
  /** Custom track border color */
  trackBorderColor?: string
  /** Custom track border radius */
  trackBorderRadius?: string
  /** Custom thumb size */
  thumbSize?: string
  /** Custom thumb background color */
  thumbBackground?: string
  /** Custom thumb border color */
  thumbBorderColor?: string
  /** Custom label color */
  labelColor?: string
  /** Custom label font family */
  labelFontFamily?: string
  /** Custom label font size */
  labelFontSize?: string
  /** Custom label font weight */
  labelFontWeight?: string | number
  /** Custom transition duration */
  transitionDuration?: string
  /** Custom checked track color */
  checkedTrackColor?: string
  /** Custom checked thumb color */
  checkedThumbColor?: string
  /** Custom hover effects */
  hoverEffects?: boolean
  /** Custom focus effects */
  focusEffects?: boolean
  /** Custom sacred glyph left */
  sacredGlyphLeft?: string
  /** Custom sacred glyph right */
  sacredGlyphRight?: string
}

const lightTheme: SwitchTheme = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '8px',
    transition: TRANSITIONS.medium,
  },
  containerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  track: {
    position: 'relative',
    width: '48px',
    height: '24px',
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    borderRadius: '12px',
    transition: TRANSITIONS.medium,
    border: '1px solid rgba(156, 163, 175, 0.2)',
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
  },
  trackNoOutline: {
    border: 'none',
  },
  trackChecked: {
    backgroundColor: 'rgb(59, 130, 246)',
    borderColor: 'transparent',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  trackFocused: {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  },
  trackDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderColor: 'rgba(156, 163, 175, 0.1)',
  },
  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    boxShadow: SHADOWS.light.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#6B7280',
  },
  thumbChecked: {
    transform: 'translateX(24px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    color: '#3B82F6',
  },
  thumbDisabled: {
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    color: '#9CA3AF',
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
  inputDisabled: {
    cursor: 'not-allowed',
  },
  glyph: {
    display: 'none',
  },
  glyphLeft: {
    display: 'none',
  },
  glyphRight: {
    display: 'none',
  },
  glyphVisible: {
    display: 'none',
  },
  shimmer: {
    display: 'none',
  },
  leftLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgb(55, 65, 81)',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
    transition: TRANSITIONS.medium,
  },
  rightLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgb(55, 65, 81)',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
    transition: TRANSITIONS.medium,
  },
}

const darkTheme: SwitchTheme = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '8px',
    transition: TRANSITIONS.medium,
  },
  containerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  track: {
    position: 'relative',
    width: '48px',
    height: '24px',
    backgroundColor: 'rgba(75, 85, 99, 0.4)',
    borderRadius: '12px',
    transition: TRANSITIONS.medium,
    border: '1px solid rgba(75, 85, 99, 0.3)',
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
  },
  trackNoOutline: {
    border: 'none',
  },
  trackChecked: {
    backgroundColor: 'rgb(59, 130, 246)',
    borderColor: 'transparent',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
  },
  trackFocused: {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
  },
  trackDisabled: {
    backgroundColor: 'rgba(75, 85, 99, 0.2)',
    borderColor: 'rgba(75, 85, 99, 0.1)',
  },
  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: '#F3F4F6',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    boxShadow: SHADOWS.dark.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#4B5563',
  },
  thumbChecked: {
    transform: 'translateX(24px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    color: '#3B82F6',
  },
  thumbDisabled: {
    backgroundColor: 'rgba(107, 114, 128, 0.8)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    color: '#6B7280',
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
  inputDisabled: {
    cursor: 'not-allowed',
  },
  glyph: {
    display: 'none',
  },
  glyphLeft: {
    display: 'none',
  },
  glyphRight: {
    display: 'none',
  },
  glyphVisible: {
    display: 'none',
  },
  shimmer: {
    display: 'none',
  },
  leftLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgb(209, 213, 219)',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
    transition: TRANSITIONS.medium,
  },
  rightLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgb(209, 213, 219)',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
    transition: TRANSITIONS.medium,
  },
}

const sacredTheme: SwitchTheme = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '12px',
    transition: TRANSITIONS.premium,
  },
  containerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  track: {
    position: 'relative',
    width: '56px',
    height: '28px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '14px',
    transition: TRANSITIONS.premium,
    border: '2px solid rgba(255, 215, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
    backgroundImage: `
      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
  },
  trackNoOutline: {
    border: 'none',
    boxShadow: 'none',
  },
  trackChecked: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderColor: '#FFD700',
    boxShadow: SHADOWS.sacred.medium,
    backgroundImage: `
      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `,
  },
  trackFocused: {
    boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.3)',
  },
  trackDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.1)',
    boxShadow: 'none',
  },
  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '50%',
    transition: TRANSITIONS.premium,
    border: '1px solid rgba(255, 215, 0, 0.4)',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#FFD700',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)
    `,
  },
  thumbChecked: {
    transform: 'translateX(28px)',
    borderColor: '#FFD700',
    boxShadow:
      '0 0 25px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%)
    `,
  },
  thumbDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    boxShadow: 'none',
    color: 'rgba(255, 215, 0, 0.3)',
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
  inputDisabled: {
    cursor: 'not-allowed',
  },
  glyph: {
    position: 'absolute',
    fontSize: '8px',
    color: 'rgba(255, 215, 0, 0.3)',
    transition: TRANSITIONS.premium,
    pointerEvents: 'none',
    animation: 'sacredSwitchFloat 3s ease-in-out infinite',
  },
  glyphLeft: {
    left: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  glyphRight: {
    right: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  glyphVisible: {
    opacity: 0.6,
  },
  shimmer: {
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
    animation: 'sacredSwitchShimmer 2s ease-in-out infinite',
    borderRadius: 'inherit',
  },
  leftLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#FFD700',
    fontFamily: 'Cinzel, serif',
    userSelect: 'none',
    transition: TRANSITIONS.premium,
    textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
  },
  rightLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#FFD700',
    fontFamily: 'Cinzel, serif',
    userSelect: 'none',
    transition: TRANSITIONS.premium,
    textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
  },
}

export const getSwitchStyles = (
  styles?: SwitchStyles,
  isFocused?: boolean,
  isHovered?: boolean,
  isChecked?: boolean,
  isDisabled?: boolean
): SwitchTheme => {
  const baseTheme =
    styles?.theme === 'light'
      ? lightTheme
      : styles?.theme === 'sacred'
        ? sacredTheme
        : darkTheme

  const customStyles: SwitchTheme = {
    container: {
      ...baseTheme.container,
      ...(isDisabled && baseTheme.containerDisabled),
    },
    containerDisabled: baseTheme.containerDisabled,
    track: {
      ...baseTheme.track,
      ...(styles?.trackWidth && { width: styles.trackWidth }),
      ...(styles?.trackHeight && { height: styles.trackHeight }),
      ...(styles?.trackBackground && {
        backgroundColor: styles.trackBackground,
      }),
      ...(styles?.trackBorderColor && { borderColor: styles.trackBorderColor }),
      ...(styles?.trackBorderRadius && {
        borderRadius: styles.trackBorderRadius,
      }),
      ...(styles?.outline === false && baseTheme.trackNoOutline),
      ...(isChecked && {
        ...baseTheme.trackChecked,
        ...(styles?.checkedTrackColor && {
          backgroundColor: styles.checkedTrackColor,
        }),
      }),
      ...(isFocused &&
        styles?.focusEffects !== false &&
        baseTheme.trackFocused),
      ...(isDisabled && baseTheme.trackDisabled),
    },
    trackNoOutline: baseTheme.trackNoOutline,
    trackChecked: baseTheme.trackChecked,
    trackFocused: baseTheme.trackFocused,
    trackDisabled: baseTheme.trackDisabled,
    thumb: {
      ...baseTheme.thumb,
      ...(styles?.thumbSize && {
        width: styles.thumbSize,
        height: styles.thumbSize,
      }),
      ...(styles?.thumbBackground && {
        backgroundColor: styles.thumbBackground,
      }),
      ...(styles?.thumbBorderColor && { borderColor: styles.thumbBorderColor }),
      ...(isChecked && {
        ...baseTheme.thumbChecked,
        ...(styles?.checkedThumbColor && {
          backgroundColor: styles.checkedThumbColor,
        }),
      }),
      ...(isDisabled && baseTheme.thumbDisabled),
    },
    thumbChecked: baseTheme.thumbChecked,
    thumbDisabled: baseTheme.thumbDisabled,
    input: {
      ...baseTheme.input,
      ...(isDisabled && baseTheme.inputDisabled),
    },
    inputDisabled: baseTheme.inputDisabled,
    glyph: {
      ...baseTheme.glyph,
      ...(styles?.transitionDuration && {
        transition: `all ${styles.transitionDuration} ease`,
      }),
    },
    glyphLeft: {
      ...baseTheme.glyphLeft,
      ...(isHovered && baseTheme.glyphVisible),
    },
    glyphRight: {
      ...baseTheme.glyphRight,
      ...(isHovered && baseTheme.glyphVisible),
    },
    glyphVisible: baseTheme.glyphVisible,
    shimmer: baseTheme.shimmer,
    leftLabel: {
      ...baseTheme.leftLabel,
      ...(styles?.labelColor && { color: styles.labelColor }),
      ...(styles?.labelFontFamily && { fontFamily: styles.labelFontFamily }),
      ...(styles?.labelFontSize && { fontSize: styles.labelFontSize }),
      ...(styles?.labelFontWeight && { fontWeight: styles.labelFontWeight }),
    },
    rightLabel: {
      ...baseTheme.rightLabel,
      ...(styles?.labelColor && { color: styles.labelColor }),
      ...(styles?.labelFontFamily && { fontFamily: styles.labelFontFamily }),
      ...(styles?.labelFontSize && { fontSize: styles.labelFontSize }),
      ...(styles?.labelFontWeight && { fontWeight: styles.labelFontWeight }),
    },
  }

  return customStyles
}

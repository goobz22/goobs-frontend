/**
 * @fileoverview Tabs component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface TabsTheme {
  /** Main container styling */
  container: React.CSSProperties
  /** Tabs container styling */
  tabsContainer: React.CSSProperties
  /** Tabs inner container styling */
  tabsInnerContainer: React.CSSProperties
  /** Individual tab styling */
  tab: React.CSSProperties
  /** Tab hover styling */
  tabHover: React.CSSProperties
  /** Tab active styling */
  tabActive: React.CSSProperties
  /** Tab indicator styling */
  tabIndicator: React.CSSProperties
  /** Tab indicator active styling */
  tabIndicatorActive: React.CSSProperties
  /** Tab border styling */
  border: React.CSSProperties
  /** Sacred glyph styling */
  glyph: React.CSSProperties
  /** Tab content styling */
  tabContent: React.CSSProperties
  /** Transition duration */
  transition: string
}

export interface TabsStyles {
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
  height?: string
  minHeight?: string

  // Tab styling
  tabBackgroundColor?: string
  tabBorderColor?: string
  tabColor?: string
  tabFontFamily?: string
  tabFontSize?: string
  tabFontWeight?: string | number
  tabLetterSpacing?: string
  tabTextShadow?: string
  tabTextTransform?: string
  tabPadding?: string

  // Tab hover states
  tabHoverBackgroundColor?: string
  tabHoverColor?: string
  tabHoverTextShadow?: string

  // Tab active states
  tabActiveBackgroundColor?: string
  tabActiveColor?: string
  tabActiveFontWeight?: string | number
  tabActiveTextShadow?: string

  // Tab indicator styling
  indicatorHeight?: string
  indicatorColor?: string
  indicatorBoxShadow?: string

  // Sacred glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphOpacity?: number
  glyphAnimation?: string

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
  disabled?: boolean
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  maxHeight?: string

  // Alignment
  alignment?: 'left' | 'center' | 'right' | 'justify'

  // Tab border options
  tabLeftBorder?: boolean
  tabRightBorder?: boolean
  tabLeftBorderColor?: string
  tabRightBorderColor?: string
}

export const tabsThemes: Record<'light' | 'dark' | 'sacred', TabsTheme> = {
  light: {
    container: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: 'rgb(55, 65, 81)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: SHADOWS.light.small,
      padding: '8px 16px',
      minHeight: '56px',
    },
    tabsContainer: {
      width: '100%',
      height: '100%',
      padding: '0 8px',
    },
    tabsInnerContainer: {
      height: '100%',
      display: 'flex',
      position: 'relative',
      gap: '4px',
    },
    tab: {
      height: '100%',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: '14px',
      letterSpacing: '-0.025em',
      transition: TRANSITIONS.medium,
      position: 'relative',
      boxSizing: 'border-box',
      fontFamily: '"Inter", sans-serif',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      color: 'rgb(55, 65, 81)',
      cursor: 'pointer',
      minHeight: '40px',
      margin: '0 2px',
    },
    tabHover: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: 'rgb(29, 78, 216)',
      transform: 'translateY(-1px)',
    },
    tabActive: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: 'rgb(29, 78, 216)',
      fontWeight: 600,
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      transition: TRANSITIONS.medium,
      backgroundColor: 'transparent',
    },
    tabIndicatorActive: {
      backgroundColor: 'rgb(59, 130, 246)',
      height: '2px',
      boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)',
    },
    border: {
      borderLeft: '1px solid rgba(226, 232, 240, 0.8)',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
    },
    glyph: {
      fontSize: '12px',
      opacity: 0.6,
      animation: 'none',
    },
    tabContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      color: 'rgb(243, 244, 246)',
      borderBottom: '1px solid rgba(75, 85, 99, 0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      padding: '8px 16px',
      minHeight: '56px',
    },
    tabsContainer: {
      width: '100%',
      height: '100%',
      padding: '0 8px',
    },
    tabsInnerContainer: {
      height: '100%',
      display: 'flex',
      position: 'relative',
      gap: '4px',
    },
    tab: {
      height: '100%',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: '14px',
      letterSpacing: '-0.025em',
      transition: TRANSITIONS.medium,
      position: 'relative',
      boxSizing: 'border-box',
      fontFamily: '"Inter", sans-serif',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      color: 'rgb(243, 244, 246)',
      cursor: 'pointer',
      minHeight: '40px',
      margin: '0 2px',
    },
    tabHover: {
      backgroundColor: 'rgba(96, 165, 250, 0.15)',
      color: 'rgb(96, 165, 250)',
      transform: 'translateY(-1px)',
    },
    tabActive: {
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      color: 'rgb(96, 165, 250)',
      fontWeight: 600,
      boxShadow: '0 2px 4px rgba(96, 165, 250, 0.3)',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      transition: TRANSITIONS.medium,
      backgroundColor: 'transparent',
    },
    tabIndicatorActive: {
      backgroundColor: 'rgb(96, 165, 250)',
      height: '2px',
      boxShadow: '0 0 8px rgba(96, 165, 250, 0.4)',
    },
    border: {
      borderLeft: '1px solid rgba(75, 85, 99, 0.8)',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
    },
    glyph: {
      fontSize: '12px',
      opacity: 0.6,
      animation: 'none',
    },
    tabContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      color: 'rgba(255, 215, 0, 0.9)',
      borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      boxShadow: SHADOWS.sacred.small,
      padding: '12px 20px',
      minHeight: '64px',
    },
    tabsContainer: {
      width: '100%',
      height: '100%',
      padding: '0 12px',
    },
    tabsInnerContainer: {
      height: '100%',
      display: 'flex',
      position: 'relative',
      gap: '6px',
    },
    tab: {
      height: '100%',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: '15px',
      letterSpacing: '0.05em',
      transition: TRANSITIONS.premium,
      position: 'relative',
      boxSizing: 'border-box',
      fontFamily: '"Cinzel", serif',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      color: 'rgba(255, 215, 0, 0.8)',
      cursor: 'pointer',
      minHeight: '44px',
      margin: '0 3px',
    },
    tabHover: {
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      color: '#FFD700',
      textShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
    },
    tabActive: {
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      color: '#FFD700',
      fontWeight: 700,
      textShadow: '0 0 18px rgba(255, 215, 0, 0.9)',
      boxShadow:
        '0 4px 16px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      transition: TRANSITIONS.premium,
      backgroundColor: 'transparent',
    },
    tabIndicatorActive: {
      backgroundColor: '#FFD700',
      height: '4px',
      boxShadow:
        '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4)',
    },
    border: {
      borderLeft: '1px solid rgba(255, 215, 0, 0.3)',
      borderRight: 'none',
      borderTop: 'none',
      borderBottom: 'none',
    },
    glyph: {
      fontSize: '12px',
      opacity: 0.6,
      animation: 'glyph-rotate 10s linear infinite',
    },
    tabContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getTabsTheme = (styles?: TabsStyles): TabsTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = tabsThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      ...baseTheme.container,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      borderBottom: styles.borderColor || baseTheme.container.borderBottom,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
      height: styles.height || baseTheme.container.height,
      minHeight: styles.minHeight || baseTheme.container.minHeight,
    },
    tabsContainer: baseTheme.tabsContainer,
    tabsInnerContainer: baseTheme.tabsInnerContainer,
    tab: {
      ...baseTheme.tab,
      backgroundColor:
        styles.tabBackgroundColor || baseTheme.tab.backgroundColor,
      borderColor: styles.tabBorderColor || baseTheme.tab.borderColor,
      color: styles.tabColor || baseTheme.tab.color,
      fontFamily: styles.tabFontFamily || baseTheme.tab.fontFamily,
      fontSize: styles.tabFontSize || baseTheme.tab.fontSize,
      fontWeight: styles.tabFontWeight || baseTheme.tab.fontWeight,
      letterSpacing: styles.tabLetterSpacing || baseTheme.tab.letterSpacing,
      textShadow: styles.tabTextShadow || baseTheme.tab.textShadow,
      textTransform:
        (styles.tabTextTransform as React.CSSProperties['textTransform']) ||
        baseTheme.tab.textTransform,
      padding: styles.tabPadding || baseTheme.tab.padding,
    },
    tabHover: {
      ...baseTheme.tabHover,
      backgroundColor:
        styles.tabHoverBackgroundColor || baseTheme.tabHover.backgroundColor,
      color: styles.tabHoverColor || baseTheme.tabHover.color,
      textShadow: styles.tabHoverTextShadow || baseTheme.tabHover.textShadow,
    },
    tabActive: {
      ...baseTheme.tabActive,
      backgroundColor:
        styles.tabActiveBackgroundColor || baseTheme.tabActive.backgroundColor,
      color: styles.tabActiveColor || baseTheme.tabActive.color,
      fontWeight: styles.tabActiveFontWeight || baseTheme.tabActive.fontWeight,
      textShadow: styles.tabActiveTextShadow || baseTheme.tabActive.textShadow,
    },
    tabIndicator: baseTheme.tabIndicator,
    tabIndicatorActive: {
      ...baseTheme.tabIndicatorActive,
      height: styles.indicatorHeight || baseTheme.tabIndicatorActive.height,
      backgroundColor:
        styles.indicatorColor || baseTheme.tabIndicatorActive.backgroundColor,
      boxShadow:
        styles.indicatorBoxShadow || baseTheme.tabIndicatorActive.boxShadow,
    },
    border: baseTheme.border,
    glyph: {
      ...baseTheme.glyph,
      color: styles.glyphColor || baseTheme.glyph.color,
      fontSize: styles.glyphFontSize || baseTheme.glyph.fontSize,
      opacity: styles.glyphOpacity || baseTheme.glyph.opacity,
      animation: styles.glyphAnimation || baseTheme.glyph.animation,
    },
    tabContent: {
      ...baseTheme.tabContent,
      gap: styles.gap || baseTheme.tabContent.gap,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getTabsStyles = (
  styles?: TabsStyles,
  _hoveredTab?: string | null,
  _activeTab?: string | null,
  isDisabled?: boolean
) => {
  const themeConfig = getTabsTheme(styles)
  const alignment = styles?.alignment || 'left'

  const alignmentStyles = {
    left: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    right: { justifyContent: 'flex-end' },
    justify: { justifyContent: 'space-between' },
  }

  const containerStyle: React.CSSProperties = {
    ...themeConfig.container,
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto',
    // Layout styling
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    width: styles?.width,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    // Apply outline override
    ...(styles?.outline === false && {
      border: 'none',
      boxShadow: 'none',
    }),
  }

  const tabsInnerContainerStyle: React.CSSProperties = {
    ...themeConfig.tabsInnerContainer,
    ...alignmentStyles[alignment],
  }

  // Get default border color from theme
  const defaultBorderColor = 'rgba(226, 232, 240, 0.8)' // Light theme default

  const tabLeftBorderStyle: React.CSSProperties = styles?.tabLeftBorder
    ? {
        borderLeft: `1px solid ${styles.tabLeftBorderColor || defaultBorderColor}`,
      }
    : {}

  const tabRightBorderStyle: React.CSSProperties = styles?.tabRightBorder
    ? {
        borderRight: `1px solid ${styles.tabRightBorderColor || defaultBorderColor}`,
      }
    : {}

  return {
    container: containerStyle,
    tabsContainer: themeConfig.tabsContainer,
    tabsInnerContainer: tabsInnerContainerStyle,
    tab: themeConfig.tab,
    tabHover: themeConfig.tabHover,
    tabActive: themeConfig.tabActive,
    tabIndicator: themeConfig.tabIndicator,
    tabIndicatorActive: themeConfig.tabIndicatorActive,
    border: themeConfig.border,
    tabLeftBorder: tabLeftBorderStyle,
    tabRightBorder: tabRightBorderStyle,
    glyph: themeConfig.glyph,
    tabContent: themeConfig.tabContent,
    transition: themeConfig.transition,
  }
}

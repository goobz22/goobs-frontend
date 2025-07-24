// --------------------------------------------------------------------------
// DIVIDER THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface DividerTheme {
  container: {
    display: string
    alignItems: string
    width: string
    margin: string
  }
  line: {
    flex: string
    height: string
    backgroundColor: string
  }
  content: {
    margin: string
    color: string
    fontSize: string
    fontWeight: string | number
  }
}

export interface DividerStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Appearance
  color?: string
  backgroundColor?: string
  height?: string
  width?: string

  // Content styling
  fontSize?: string
  fontWeight?: string | number
  contentMargin?: string

  // Orientation
  orientation?: 'horizontal' | 'vertical'

  // States
  disabled?: boolean
}

export const dividerThemes: Record<'light' | 'dark' | 'sacred', DividerTheme> =
  {
    light: {
      container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '16px 0',
      },
      line: {
        flex: '1',
        height: '1px',
        backgroundColor: '#e0e0e0',
      },
      content: {
        margin: '0 16px',
        color: '#6b7280',
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },
    dark: {
      container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '16px 0',
      },
      line: {
        flex: '1',
        height: '1px',
        backgroundColor: '#4b5563',
      },
      content: {
        margin: '0 16px',
        color: '#9ca3af',
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },
    sacred: {
      container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '24px 0',
      },
      line: {
        flex: '1',
        height: '2px',
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
      },
      content: {
        margin: '0 24px',
        color: '#FFD700',
        fontSize: '0.9rem',
        fontWeight: 600,
      },
    },
  }

// Helper function to get computed theme with custom style overrides
export const getDividerTheme = (styles?: DividerStyles): DividerTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = dividerThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      display:
        styles.orientation === 'vertical'
          ? 'inline-flex'
          : baseTheme.container.display,
      alignItems: baseTheme.container.alignItems,
      width:
        styles.orientation === 'vertical'
          ? 'auto'
          : styles.width || baseTheme.container.width,
      margin: styles.margin || baseTheme.container.margin,
    },
    line: {
      flex: baseTheme.line.flex,
      height:
        styles.orientation === 'vertical'
          ? '100%'
          : styles.height || baseTheme.line.height,
      backgroundColor: styles.backgroundColor || baseTheme.line.backgroundColor,
    },
    content: {
      margin: styles.contentMargin || baseTheme.content.margin,
      color: styles.color || baseTheme.content.color,
      fontSize: styles.fontSize || baseTheme.content.fontSize,
      fontWeight: styles.fontWeight || baseTheme.content.fontWeight,
    },
  }
}

// Main style generator function
export const getDividerStyles = (
  styles?: DividerStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getDividerTheme(styles)
  const isVertical = styles?.orientation === 'vertical'

  const containerStyle: React.CSSProperties = {
    display: themeConfig.container.display as any,
    alignItems: themeConfig.container.alignItems as any,
    width: themeConfig.container.width,
    margin: themeConfig.container.margin,
    // Layout styling
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    // Vertical orientation adjustments
    ...(isVertical && {
      flexDirection: 'column' as const,
      height: styles?.height || 'auto',
      width: 'auto',
    }),
    // State-based styling
    ...(isDisabled && {
      opacity: 0.6,
    }),
  }

  const lineStyle: React.CSSProperties = {
    flex: themeConfig.line.flex,
    height: isVertical ? styles?.height || '100px' : themeConfig.line.height,
    width: isVertical ? themeConfig.line.height : 'auto',
    backgroundColor: themeConfig.line.backgroundColor,
  }

  const contentStyle: React.CSSProperties = {
    margin: themeConfig.content.margin,
    color: themeConfig.content.color,
    fontSize: themeConfig.content.fontSize,
    fontWeight: themeConfig.content.fontWeight,
  }

  return {
    container: containerStyle,
    line: lineStyle,
    content: contentStyle,
  }
}

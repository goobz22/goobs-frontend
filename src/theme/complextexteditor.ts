// --------------------------------------------------------------------------
// COMPLEX TEXT EDITOR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'
import { getFormFieldTheme, type FormFieldStyles } from './formField'

export interface ComplexTextEditorTheme {
  // Container styling
  container: {
    background: string
    borderRadius: string
    fontFamily: string
  }

  // Toolbar styling
  toolbar: {
    background: string
    borderColor: string
    borderRadius: string
    padding: string
    gap: string
  }

  // Toggle button group styling
  toggleGroup: {
    background: string
    borderColor: string
    borderRadius: string
  }

  // Editor area styling
  editorArea: {
    background: string
    borderColor: string
    color: string
    fontFamily: string
    fontSize: string
    lineHeight: string
    padding: string
    minHeight: string
    borderRadius: string
    boxShadow: string
  }

  // Scrollbar styling
  scrollbar: {
    width: string
    trackBackground: string
    thumbBackground: string
    thumbHoverBackground: string
    thumbActiveBackground: string
    thumbBorderRadius: string
    trackBorderRadius: string
    thumbBorder: string
  }

  // Sacred theme specific
  sacred: {
    glyph: {
      color: string
      filter: string
      animation: string
    }
    borderGlow: string
    textGlow: string
    backgroundImage: string
  }

  transition: string
}

export interface ComplexTextEditorStyles extends FormFieldStyles {
  // Editor-specific styling
  toolbarBackground?: string
  toolbarBorderColor?: string
  toolbarPadding?: string
  toolbarGap?: string

  // Toggle button styling
  toggleBackground?: string
  toggleBorderColor?: string
  toggleActiveBackground?: string
  toggleActiveColor?: string

  // Editor area styling
  editorBackground?: string
  editorBorderColor?: string
  editorFontFamily?: string
  editorFontSize?: string
  editorLineHeight?: string
  editorPadding?: string
  editorMinHeight?: string
  editorBoxShadow?: string

  // Sacred theme overrides
  sacredGlyphColor?: string
  sacredGlyphFilter?: string
  sacredGlyphAnimation?: string
  sacredBorderGlow?: string
  sacredTextGlow?: string
  sacredBackgroundImage?: string

  // Editor mode settings
  showToolbar?: boolean
  showModeToggle?: boolean
  defaultMode?: 'simple' | 'rich' | 'markdown'

  // Layout options
  accordionMode?: boolean
  accordionSummary?: React.ReactNode
  accordionDefaultExpanded?: boolean
}

export const complexTextEditorThemes: Record<
  'light' | 'dark' | 'sacred',
  ComplexTextEditorTheme
> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
    },
    toolbar: {
      background: 'rgba(248, 250, 252, 0.8)',
      borderColor: 'rgba(226, 232, 240, 0.8)',
      borderRadius: '8px 8px 0 0',
      padding: '8px',
      gap: '4px',
    },
    toggleGroup: {
      background: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(209, 213, 219, 1)',
      borderRadius: '6px',
    },
    editorArea: {
      background: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(209, 213, 219, 1)',
      color: 'rgba(31, 41, 55, 1)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      padding: '16px',
      minHeight: '120px',
      borderRadius: '0 0 8px 8px',
      boxShadow: SHADOWS.light.small,
    },
    scrollbar: {
      width: '8px',
      trackBackground: 'rgba(248, 250, 252, 1)',
      thumbBackground: 'rgba(203, 213, 225, 1)',
      thumbHoverBackground: 'rgba(148, 163, 184, 1)',
      thumbActiveBackground: 'rgba(100, 116, 139, 1)',
      thumbBorderRadius: '4px',
      trackBorderRadius: '4px',
      thumbBorder: 'none',
    },
    sacred: {
      glyph: {
        color: 'rgba(255, 215, 0, 0.2)',
        filter: 'none',
        animation: 'none',
      },
      borderGlow: 'none',
      textGlow: 'none',
      backgroundImage: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
    },
    toolbar: {
      background: 'rgba(17, 24, 39, 0.8)',
      borderColor: 'rgba(75, 85, 99, 0.8)',
      borderRadius: '8px 8px 0 0',
      padding: '8px',
      gap: '4px',
    },
    toggleGroup: {
      background: 'rgba(31, 41, 55, 0.9)',
      borderColor: 'rgba(75, 85, 99, 1)',
      borderRadius: '6px',
    },
    editorArea: {
      background: 'rgba(17, 24, 39, 1)',
      borderColor: 'rgba(75, 85, 99, 1)',
      color: 'rgba(243, 244, 246, 1)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      padding: '16px',
      minHeight: '120px',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
    },
    scrollbar: {
      width: '8px',
      trackBackground: 'rgba(31, 41, 55, 1)',
      thumbBackground: 'rgba(75, 85, 99, 1)',
      thumbHoverBackground: 'rgba(107, 114, 128, 1)',
      thumbActiveBackground: 'rgba(156, 163, 175, 1)',
      thumbBorderRadius: '4px',
      trackBorderRadius: '4px',
      thumbBorder: 'none',
    },
    sacred: {
      glyph: {
        color: 'rgba(255, 215, 0, 0.2)',
        filter: 'none',
        animation: 'none',
      },
      borderGlow: 'none',
      textGlow: 'none',
      backgroundImage: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.9)',
      borderRadius: '12px',
      fontFamily: '"Inter", sans-serif',
    },
    toolbar: {
      background: 'rgba(0, 0, 0, 0.5)',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      borderRadius: '12px 12px 0 0',
      padding: '12px',
      gap: '8px',
    },
    toggleGroup: {
      background: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      borderRadius: '8px',
    },
    editorArea: {
      background: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      color: 'rgba(255, 215, 0, 0.9)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      padding: '24px',
      minHeight: '150px',
      borderRadius: '0 0 12px 12px',
      boxShadow: SHADOWS.sacred.small,
    },
    scrollbar: {
      width: '12px',
      trackBackground: 'rgba(0, 0, 0, 0.5)',
      thumbBackground: 'rgba(255, 215, 0, 0.3)',
      thumbHoverBackground: 'rgba(255, 215, 0, 0.5)',
      thumbActiveBackground: 'rgba(255, 215, 0, 0.7)',
      thumbBorderRadius: '6px',
      trackBorderRadius: '6px',
      thumbBorder: '1px solid rgba(255, 215, 0, 0.2)',
    },
    sacred: {
      glyph: {
        color: 'rgba(255, 215, 0, 0.2)',
        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))',
        animation: 'complexTextEditorGlyphFloat 10s ease-in-out infinite',
      },
      borderGlow: '0 0 20px rgba(255, 215, 0, 0.3)',
      textGlow: '0 0 3px rgba(255, 215, 0, 0.3)',
      backgroundImage: `
        linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.05) 100%),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getComplexTextEditorTheme = (
  styles?: ComplexTextEditorStyles
): ComplexTextEditorTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = complexTextEditorThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      fontFamily: styles.fontFamily || baseTheme.container.fontFamily,
    },
    toolbar: {
      background: styles.toolbarBackground || baseTheme.toolbar.background,
      borderColor: styles.toolbarBorderColor || baseTheme.toolbar.borderColor,
      borderRadius: baseTheme.toolbar.borderRadius,
      padding: styles.toolbarPadding || baseTheme.toolbar.padding,
      gap: styles.toolbarGap || baseTheme.toolbar.gap,
    },
    toggleGroup: {
      background: styles.toggleBackground || baseTheme.toggleGroup.background,
      borderColor:
        styles.toggleBorderColor || baseTheme.toggleGroup.borderColor,
      borderRadius: baseTheme.toggleGroup.borderRadius,
    },
    editorArea: {
      background: styles.editorBackground || baseTheme.editorArea.background,
      borderColor: styles.editorBorderColor || baseTheme.editorArea.borderColor,
      color: styles.textColor || baseTheme.editorArea.color,
      fontFamily: styles.editorFontFamily || baseTheme.editorArea.fontFamily,
      fontSize: styles.editorFontSize || baseTheme.editorArea.fontSize,
      lineHeight: styles.editorLineHeight || baseTheme.editorArea.lineHeight,
      padding: styles.editorPadding || baseTheme.editorArea.padding,
      minHeight: styles.editorMinHeight || baseTheme.editorArea.minHeight,
      borderRadius: baseTheme.editorArea.borderRadius,
      boxShadow: styles.editorBoxShadow || baseTheme.editorArea.boxShadow,
    },
    scrollbar: {
      width: baseTheme.scrollbar.width,
      trackBackground: baseTheme.scrollbar.trackBackground,
      thumbBackground: baseTheme.scrollbar.thumbBackground,
      thumbHoverBackground: baseTheme.scrollbar.thumbHoverBackground,
      thumbActiveBackground: baseTheme.scrollbar.thumbActiveBackground,
      thumbBorderRadius: baseTheme.scrollbar.thumbBorderRadius,
      trackBorderRadius: baseTheme.scrollbar.trackBorderRadius,
      thumbBorder: baseTheme.scrollbar.thumbBorder,
    },
    sacred: {
      glyph: {
        color: styles.sacredGlyphColor || baseTheme.sacred.glyph.color,
        filter: styles.sacredGlyphFilter || baseTheme.sacred.glyph.filter,
        animation:
          styles.sacredGlyphAnimation || baseTheme.sacred.glyph.animation,
      },
      borderGlow: styles.sacredBorderGlow || baseTheme.sacred.borderGlow,
      textGlow: styles.sacredTextGlow || baseTheme.sacred.textGlow,
      backgroundImage:
        styles.sacredBackgroundImage || baseTheme.sacred.backgroundImage,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Scrollbar style injection function
const injectScrollbarStyles = (
  themeConfig: ComplexTextEditorTheme,
  theme: string
) => {
  const className = `complex-text-editor-scrollbar-${theme}`

  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return className
  }

  // Check if styles are already injected
  if (document.getElementById(className)) {
    return className
  }

  const style = document.createElement('style')
  style.id = className
  style.textContent = `
    .${className}::-webkit-scrollbar {
      width: ${themeConfig.scrollbar.width};
      height: ${themeConfig.scrollbar.width};
    }
    
    .${className}::-webkit-scrollbar-track {
      background: ${themeConfig.scrollbar.trackBackground};
      border-radius: ${themeConfig.scrollbar.trackBorderRadius};
    }
    
    .${className}::-webkit-scrollbar-thumb {
      background: ${themeConfig.scrollbar.thumbBackground};
      border-radius: ${themeConfig.scrollbar.thumbBorderRadius};
      border: ${themeConfig.scrollbar.thumbBorder};
    }
    
    .${className}::-webkit-scrollbar-thumb:hover {
      background: ${themeConfig.scrollbar.thumbHoverBackground};
    }
    
    .${className}::-webkit-scrollbar-thumb:active {
      background: ${themeConfig.scrollbar.thumbActiveBackground};
    }
    
    .${className}::-webkit-scrollbar-corner {
      background: ${themeConfig.scrollbar.trackBackground};
    }
  `

  document.head.appendChild(style)
  return className
}

// Main style generator function
export const getComplexTextEditorStyles = (
  styles?: ComplexTextEditorStyles,
  isFocused?: boolean
) => {
  const themeConfig = getComplexTextEditorTheme(styles)
  const formFieldTheme = getFormFieldTheme(styles)
  const isSacredTheme = styles?.theme === 'sacred'
  const theme = styles?.theme || 'light'

  // Inject scrollbar styles and get the class name
  const scrollbarClassName = injectScrollbarStyles(themeConfig, theme)

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    background: themeConfig.container.background,
    borderRadius: themeConfig.container.borderRadius,
    fontFamily: themeConfig.container.fontFamily,
    transition: themeConfig.transition,
    // Layout styling from FormFieldStyles
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    // Sacred theme effects
    ...(isSacredTheme && {
      backgroundImage: themeConfig.sacred.backgroundImage,
      boxShadow: themeConfig.sacred.borderGlow,
    }),
    // Disabled state
    ...(styles?.disabled && {
      opacity: 0.6,
      pointerEvents: 'none',
    }),
  }

  const toolbarStyle: React.CSSProperties = {
    display: styles?.showToolbar === false ? 'none' : 'flex',
    flexDirection: 'column',
    background: themeConfig.toolbar.background,
    borderBottom: `1px solid ${themeConfig.toolbar.borderColor}`,
    borderRadius: themeConfig.toolbar.borderRadius,
    padding: themeConfig.toolbar.padding,
    gap: themeConfig.toolbar.gap,
  }

  const toggleRowStyle: React.CSSProperties = {
    display: styles?.showModeToggle === false ? 'none' : 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }

  const editorAreaStyle: React.CSSProperties = {
    background: themeConfig.editorArea.background,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor:
      styles?.helperTextType === 'error'
        ? formFieldTheme.border.error
        : isFocused
          ? formFieldTheme.border.focused
          : themeConfig.editorArea.borderColor,
    borderRadius: themeConfig.editorArea.borderRadius,
    color:
      styles?.helperTextType === 'error'
        ? formFieldTheme.footerText.error
        : themeConfig.editorArea.color,
    fontFamily: themeConfig.editorArea.fontFamily,
    fontSize: themeConfig.editorArea.fontSize,
    lineHeight: themeConfig.editorArea.lineHeight,
    padding: themeConfig.editorArea.padding,
    minHeight: themeConfig.editorArea.minHeight,
    boxShadow: themeConfig.editorArea.boxShadow,
    transition: themeConfig.transition,
    outline: 'none',
    resize: 'vertical' as const,
    // Scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: `${themeConfig.scrollbar.thumbBackground} ${themeConfig.scrollbar.trackBackground}`,
    // Sacred theme effects
    ...(isSacredTheme && {
      textShadow: themeConfig.sacred.textGlow,
    }),
  }

  const sacredGlyphStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-20px',
    right: '20px',
    fontSize: '48px',
    color: themeConfig.sacred.glyph.color,
    filter: themeConfig.sacred.glyph.filter,
    animation: themeConfig.sacred.glyph.animation,
    pointerEvents: 'none',
    zIndex: 0,
    transition: themeConfig.transition,
  }

  return {
    container: containerStyle,
    toolbar: toolbarStyle,
    toggleRow: toggleRowStyle,
    editorArea: editorAreaStyle,
    sacredGlyph: sacredGlyphStyle,
    scrollbarClassName,
  }
}

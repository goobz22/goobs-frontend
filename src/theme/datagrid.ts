// --------------------------------------------------------------------------
// DATAGRID THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface DataGridTheme {
  container: {
    position: string
    display: string
    flexDirection: string
    width: string
    backgroundColor: string
    backdropFilter?: string
    border?: string
    borderRadius?: string
    animation?: string
  }
  error: {
    marginBottom: string
    padding: string
    borderWidth: string
    borderRadius: string
    backgroundColor: string
    color: string
    borderColor: string
  }
  tableContainer: {
    width: string
    display: string
    flexDirection: string
    alignItems: string
    position: string
    margin: string
    padding: string
  }
  table: {
    tableContainer: {
      width: string
      overflowX: string
      minWidth?: string
      borderRadius?: string
      overflow?: string
      border?: string
      backgroundColor?: string
    }
    tableWrapper: {
      overflowX: string
      width: string
      minWidth?: string
    }
    table: {
      width: string
      minWidth: string
      tableLayout: string
      backgroundColor?: string
    }
  }
  footerContainer: {
    display: string
    justifyContent: string
    gap: string
    marginTop: string
    opacity: number
  }
  footerGlyph: {
    color: string
    fontSize: string
    animation: string
  }
  glyph: {
    position: string
    fontSize: string
    color: string
    zIndex: number
    animation: string
  }
  transition: string
}

export interface DataGridStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  backdropFilter?: string
  animation?: string

  // Error states
  errorBackgroundColor?: string
  errorColor?: string
  errorBorderColor?: string

  // Layout
  width?: string
  height?: string
  maxWidth?: string
  minWidth?: string
  maxHeight?: string
  minHeight?: string

  // Spacing
  padding?: string
  margin?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

export const dataGridThemes: Record<
  'light' | 'dark' | 'sacred',
  DataGridTheme
> = {
  light: {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#F8FAFC',
      borderRadius: '0.5rem',
      border: '1px solid #E2E8F0',
    },
    error: {
      marginBottom: '0.5rem',
      padding: '1rem',
      borderWidth: '1px',
      borderRadius: '0.25rem',
      backgroundColor: '#FEF2F2',
      color: '#B91C1C',
      borderColor: '#FECACA',
    },
    tableContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      margin: '0',
      padding: '0',
    },
    table: {
      tableContainer: {
        width: '100%',
        overflowX: 'hidden',
        borderRadius: '0.5rem',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
      },
      tableWrapper: {
        overflowX: 'visible',
        width: '100%',
      },
      table: {
        width: '100%',
        minWidth: 'max-content',
        tableLayout: 'auto',
        backgroundColor: 'transparent',
      },
    },
    footerContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.125rem',
      marginTop: '0.5rem',
      opacity: 0.5,
    },
    footerGlyph: {
      color: '#64748B',
      fontSize: '0.75rem',
      animation: 'none',
    },
    glyph: {
      position: 'absolute',
      fontSize: '1.125rem',
      color: 'rgba(100, 116, 139, 0.3)',
      zIndex: 10,
      animation: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#1E293B',
      borderRadius: '0.5rem',
      border: '1px solid #334155',
    },
    error: {
      marginBottom: '0.5rem',
      padding: '1rem',
      borderWidth: '1px',
      borderRadius: '0.25rem',
      backgroundColor: 'rgba(127, 29, 29, 0.3)',
      color: '#F87171',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    tableContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      margin: '0',
      padding: '0',
    },
    table: {
      tableContainer: {
        width: '100%',
        overflowX: 'hidden',
        borderRadius: '0.5rem',
        border: '1px solid #334155',
        backgroundColor: '#1E293B',
      },
      tableWrapper: {
        overflowX: 'visible',
        width: '100%',
      },
      table: {
        width: '100%',
        minWidth: 'max-content',
        tableLayout: 'auto',
        backgroundColor: 'transparent',
      },
    },
    footerContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.125rem',
      marginTop: '0.5rem',
      opacity: 0.5,
    },
    footerGlyph: {
      color: '#64748B',
      fontSize: '0.75rem',
      animation: 'none',
    },
    glyph: {
      position: 'absolute',
      fontSize: '1.125rem',
      color: 'rgba(100, 116, 139, 0.3)',
      zIndex: 10,
      animation: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(16px)',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.5rem',
      animation: 'datagrid-glow-pulse 2s infinite alternate',
    },
    error: {
      marginBottom: '0.5rem',
      padding: '1rem',
      borderWidth: '1px',
      borderRadius: '0.25rem',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#F87171',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    tableContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      margin: '0',
      padding: '0',
    },
    table: {
      tableContainer: {
        width: '100%',
        overflowX: 'hidden',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      tableWrapper: {
        overflowX: 'visible',
        width: '100%',
      },
      table: {
        width: '100%',
        minWidth: 'max-content',
        tableLayout: 'auto',
        backgroundColor: 'transparent',
      },
    },
    footerContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.125rem',
      marginTop: '0.5rem',
      opacity: 0.5,
    },
    footerGlyph: {
      color: '#FFD700',
      fontSize: '0.75rem',
      animation: 'datagrid-float 3s ease-in-out infinite',
    },
    glyph: {
      position: 'absolute',
      fontSize: '1.125rem',
      color: 'rgba(255, 215, 0, 0.3)',
      zIndex: 10,
      animation: 'datagrid-float 8s infinite alternate',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getDataGridTheme = (styles?: DataGridStyles): DataGridTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = dataGridThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      position: baseTheme.container.position,
      display: baseTheme.container.display,
      flexDirection: baseTheme.container.flexDirection,
      width: styles.width || baseTheme.container.width,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      animation: styles.animation || baseTheme.container.animation,
    },
    error: {
      marginBottom: baseTheme.error.marginBottom,
      padding: baseTheme.error.padding,
      borderWidth: baseTheme.error.borderWidth,
      borderRadius: baseTheme.error.borderRadius,
      backgroundColor:
        styles.errorBackgroundColor || baseTheme.error.backgroundColor,
      color: styles.errorColor || baseTheme.error.color,
      borderColor: styles.errorBorderColor || baseTheme.error.borderColor,
    },
    tableContainer: baseTheme.tableContainer,
    table: baseTheme.table,
    footerContainer: baseTheme.footerContainer,
    footerGlyph: baseTheme.footerGlyph,
    glyph: baseTheme.glyph,
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getDataGridStyles = (styles?: DataGridStyles) => {
  const themeConfig = getDataGridTheme(styles)

  const containerStyle: React.CSSProperties = {
    position: themeConfig.container.position as any,
    display: themeConfig.container.display as any,
    flexDirection: themeConfig.container.flexDirection as any,
    width: themeConfig.container.width,
    backgroundColor: themeConfig.container.backgroundColor,
    backdropFilter: themeConfig.container.backdropFilter,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    animation: themeConfig.container.animation,
    transition: themeConfig.transition,
    // Layout styling
    height: styles?.height,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
  }

  const errorStyle: React.CSSProperties = {
    marginBottom: themeConfig.error.marginBottom,
    padding: themeConfig.error.padding,
    borderWidth: themeConfig.error.borderWidth,
    borderRadius: themeConfig.error.borderRadius,
    backgroundColor: themeConfig.error.backgroundColor,
    color: themeConfig.error.color,
    borderColor: themeConfig.error.borderColor,
    borderStyle: 'solid',
  }

  const tableContainerStyle: React.CSSProperties = {
    width: themeConfig.tableContainer.width,
    display: themeConfig.tableContainer.display as any,
    flexDirection: themeConfig.tableContainer.flexDirection as any,
    alignItems: themeConfig.tableContainer.alignItems as any,
    position: themeConfig.tableContainer.position as any,
    margin: themeConfig.tableContainer.margin,
    padding: themeConfig.tableContainer.padding,
  }

  const footerContainerStyle: React.CSSProperties = {
    display: themeConfig.footerContainer.display as any,
    justifyContent: themeConfig.footerContainer.justifyContent as any,
    gap: themeConfig.footerContainer.gap,
    marginTop: themeConfig.footerContainer.marginTop,
    opacity: themeConfig.footerContainer.opacity,
  }

  const footerGlyphStyle: React.CSSProperties = {
    color: themeConfig.footerGlyph.color,
    fontSize: themeConfig.footerGlyph.fontSize,
    animation: themeConfig.footerGlyph.animation,
  }

  const glyphStyle: React.CSSProperties = {
    position: themeConfig.glyph.position as any,
    fontSize: themeConfig.glyph.fontSize,
    color: themeConfig.glyph.color,
    zIndex: themeConfig.glyph.zIndex,
    animation: themeConfig.glyph.animation,
  }

  const tableStyles = {
    tableContainer: {
      width: themeConfig.table.tableContainer.width,
      overflowX: themeConfig.table.tableContainer.overflowX as any,
      minWidth: themeConfig.table.tableContainer.minWidth,
      borderRadius: themeConfig.table.tableContainer.borderRadius,
      overflow: themeConfig.table.tableContainer.overflow,
      border: themeConfig.table.tableContainer.border,
      backgroundColor: themeConfig.table.tableContainer.backgroundColor,
    } as React.CSSProperties,
    tableWrapper: {
      overflowX: themeConfig.table.tableWrapper.overflowX as any,
      width: themeConfig.table.tableWrapper.width,
      minWidth: themeConfig.table.tableWrapper.minWidth,
    } as React.CSSProperties,
    table: {
      width: themeConfig.table.table.width,
      minWidth: themeConfig.table.table.minWidth,
      tableLayout: themeConfig.table.table.tableLayout as any,
      backgroundColor: themeConfig.table.table.backgroundColor,
    } as React.CSSProperties,
  }

  return {
    container: containerStyle,
    error: errorStyle,
    tableContainer: tableContainerStyle,
    table: tableStyles,
    footerContainer: footerContainerStyle,
    footerGlyph: footerGlyphStyle,
    glyph: glyphStyle,
  }
}

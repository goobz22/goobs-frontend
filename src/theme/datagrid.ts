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
    padding?: string
  }
  contentWrapper: {
    display: string
    flexDirection: string
    width: string
    backgroundColor: string
    borderRadius: string
    border: string
    overflow: string
    boxShadow: string
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
      border?: string
      borderCollapse?: string
    }
    tableHeader: {
      backgroundColor: string
      borderBottom: string
      color: string
      fontWeight: string
    }
    tableRow: {
      borderBottom: string
      backgroundColor?: string
    }
    tableRowHover: {
      backgroundColor: string
    }
    tableCell: {
      padding: string
      borderRight?: string
      verticalAlign: string
      color: string
    }
    tableHeaderCell: {
      padding: string
      borderRight?: string
      verticalAlign: string
      fontWeight: string
      textAlign: string
      color: string
    }
  }
  scrollbar: {
    height: string
    width: string
    track: {
      backgroundColor: string
      borderRadius: string
    }
    thumb: {
      backgroundColor: string
      borderRadius: string
      border?: string
    }
    thumbHover: {
      backgroundColor: string
    }
  }
  sectionDivider: {
    height: string
    backgroundColor: string
    opacity: number
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

  // Content wrapper styling
  contentBackgroundColor?: string
  contentBorderColor?: string
  contentBorderRadius?: string
  contentBoxShadow?: string

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
      backgroundColor: 'transparent',
      borderRadius: '0.75rem',
      padding: '0',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '0.5rem',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
        backgroundColor: 'transparent',
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
        border: '1px solid #E2E8F0',
        borderCollapse: 'separate',
      },
      tableHeader: {
        backgroundColor: '#F8FAFC',
        borderBottom: '2px solid #E2E8F0',
        color: '#374151',
        fontWeight: '600',
      },
      tableRow: {
        borderBottom: '1px solid #F3F4F6',
        backgroundColor: '#FFFFFF',
      },
      tableRowHover: {
        backgroundColor: '#F9FAFB',
      },
      tableCell: {
        padding: '0.75rem',
        borderRight: '1px solid #F3F4F6',
        verticalAlign: 'middle',
        color: '#374151',
      },
      tableHeaderCell: {
        padding: '0.75rem',
        borderRight: '1px solid #E2E8F0',
        verticalAlign: 'middle',
        fontWeight: '600',
        textAlign: 'left',
        color: '#374151',
      },
    },
    scrollbar: {
      height: '8px',
      width: '8px',
      track: {
        backgroundColor: '#F1F5F9',
        borderRadius: '4px',
      },
      thumb: {
        backgroundColor: '#CBD5E1',
        borderRadius: '4px',
        border: '1px solid #E2E8F0',
      },
      thumbHover: {
        backgroundColor: '#94A3B8',
      },
    },
    sectionDivider: {
      height: '1px',
      backgroundColor: '#E2E8F0',
      opacity: 0.6,
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
      backgroundColor: 'transparent',
      borderRadius: '0.75rem',
      padding: '0',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#1E293B',
      borderRadius: '0.5rem',
      border: '1px solid #334155',
      overflow: 'hidden',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
        backgroundColor: 'transparent',
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
        border: '1px solid #334155',
        borderCollapse: 'separate',
      },
      tableHeader: {
        backgroundColor: '#1E293B',
        borderBottom: '2px solid #334155',
        color: '#E2E8F0',
        fontWeight: '600',
      },
      tableRow: {
        borderBottom: '1px solid #334155',
        backgroundColor: '#1E293B',
      },
      tableRowHover: {
        backgroundColor: '#273746',
      },
      tableCell: {
        padding: '0.75rem',
        borderRight: '1px solid #334155',
        verticalAlign: 'middle',
        color: '#E2E8F0',
      },
      tableHeaderCell: {
        padding: '0.75rem',
        borderRight: '1px solid #334155',
        verticalAlign: 'middle',
        fontWeight: '600',
        textAlign: 'left',
        color: '#E2E8F0',
      },
    },
    scrollbar: {
      height: '8px',
      width: '8px',
      track: {
        backgroundColor: '#1E293B',
        borderRadius: '4px',
      },
      thumb: {
        backgroundColor: '#475569',
        borderRadius: '4px',
        border: '1px solid #334155',
      },
      thumbHover: {
        backgroundColor: '#64748B',
      },
    },
    sectionDivider: {
      height: '1px',
      backgroundColor: '#334155',
      opacity: 0.6,
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
      backgroundColor: 'transparent',
      borderRadius: '0.75rem',
      padding: '0',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '0.5rem',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      overflow: 'hidden',
      boxShadow:
        '0 0 20px rgba(255, 215, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
        backgroundColor: 'transparent',
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
        border: '1px solid rgba(255, 215, 0, 0.5)',
        borderCollapse: 'separate',
      },
      tableHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderBottom: '2px solid rgba(255, 215, 0, 0.5)',
        color: '#FFD700',
        fontWeight: '600',
      },
      tableRow: {
        borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      },
      tableRowHover: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
      },
      tableCell: {
        padding: '0.75rem',
        borderRight: '1px solid rgba(255, 215, 0, 0.5)',
        verticalAlign: 'middle',
        color: '#FBBF24',
      },
      tableHeaderCell: {
        padding: '0.75rem',
        borderRight: '1px solid rgba(255, 215, 0, 0.5)',
        verticalAlign: 'middle',
        fontWeight: '600',
        textAlign: 'left',
        color: '#FFD700',
      },
    },
    scrollbar: {
      height: '8px',
      width: '8px',
      track: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '4px',
      },
      thumb: {
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 215, 0, 0.8)',
      },
      thumbHover: {
        backgroundColor: 'rgba(255, 215, 0, 0.8)',
      },
    },
    sectionDivider: {
      height: '1px',
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
      opacity: 0.8,
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

  const computedBackdropFilter =
    styles?.backdropFilter ?? baseTheme.container.backdropFilter
  const computedBorder = styles?.borderColor
    ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
    : baseTheme.container.border
  const computedAnimation = styles?.animation ?? baseTheme.container.animation
  const computedBorderRadius =
    styles?.borderRadius ?? baseTheme.container.borderRadius
  const computedPadding = styles?.padding ?? baseTheme.container.padding

  return {
    container: {
      position: baseTheme.container.position,
      display: baseTheme.container.display,
      flexDirection: baseTheme.container.flexDirection,
      width: styles.width || baseTheme.container.width,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      ...(computedBackdropFilter !== undefined
        ? { backdropFilter: computedBackdropFilter }
        : {}),
      ...(computedBorder !== undefined ? { border: computedBorder } : {}),
      ...(computedBorderRadius !== undefined
        ? { borderRadius: computedBorderRadius }
        : {}),
      ...(computedAnimation !== undefined
        ? { animation: computedAnimation }
        : {}),
      ...(computedPadding !== undefined ? { padding: computedPadding } : {}),
    },
    contentWrapper: {
      display: baseTheme.contentWrapper.display,
      flexDirection: baseTheme.contentWrapper.flexDirection,
      width: baseTheme.contentWrapper.width,
      backgroundColor:
        styles.contentBackgroundColor ||
        baseTheme.contentWrapper.backgroundColor,
      borderRadius:
        styles.contentBorderRadius || baseTheme.contentWrapper.borderRadius,
      border: styles.contentBorderColor
        ? `1px solid ${styles.contentBorderColor}`
        : baseTheme.contentWrapper.border,
      overflow: baseTheme.contentWrapper.overflow,
      boxShadow: styles.contentBoxShadow || baseTheme.contentWrapper.boxShadow,
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
    scrollbar: baseTheme.scrollbar,
    sectionDivider: baseTheme.sectionDivider,
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
    padding: themeConfig.container.padding,
    transition: themeConfig.transition,
    // Ensure the grid never causes page-level horizontal scroll
    overflowX: 'hidden',
    boxSizing: 'border-box',
    // Layout styling
    height: styles?.height,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    margin: styles?.margin,
  }

  const contentWrapperStyle: React.CSSProperties = {
    display: themeConfig.contentWrapper.display as any,
    flexDirection: themeConfig.contentWrapper.flexDirection as any,
    width: themeConfig.contentWrapper.width,
    backgroundColor: themeConfig.contentWrapper.backgroundColor,
    borderRadius: themeConfig.contentWrapper.borderRadius,
    border: themeConfig.contentWrapper.border,
    overflow: themeConfig.contentWrapper.overflow,
    boxShadow: themeConfig.contentWrapper.boxShadow,
    transition: themeConfig.transition,
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
  }

  const sectionDividerStyle: React.CSSProperties = {
    height: themeConfig.sectionDivider.height,
    backgroundColor: themeConfig.sectionDivider.backgroundColor,
    opacity: themeConfig.sectionDivider.opacity,
    width: '100%',
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
      // Include borders/padding in width calculations to avoid unexpected shift
      boxSizing: 'border-box',
    } as React.CSSProperties,
    tableWrapper: {
      overflowX: themeConfig.table.tableWrapper.overflowX as any,
      width: themeConfig.table.tableWrapper.width,
      minWidth: themeConfig.table.tableWrapper.minWidth,
      boxSizing: 'border-box',
    } as React.CSSProperties,
    table: {
      width: themeConfig.table.table.width,
      minWidth: themeConfig.table.table.minWidth,
      tableLayout: themeConfig.table.table.tableLayout as any,
      backgroundColor: themeConfig.table.table.backgroundColor,
      border: themeConfig.table.table.border,
      borderCollapse: themeConfig.table.table.borderCollapse as any,
    } as React.CSSProperties,
    tableHeader: {
      backgroundColor: themeConfig.table.tableHeader.backgroundColor,
      borderBottom: themeConfig.table.tableHeader.borderBottom,
      color: themeConfig.table.tableHeader.color,
      fontWeight: themeConfig.table.tableHeader.fontWeight,
    } as React.CSSProperties,
    tableRow: {
      borderBottom: themeConfig.table.tableRow.borderBottom,
      backgroundColor: themeConfig.table.tableRow.backgroundColor,
    } as React.CSSProperties,
    tableRowHover: {
      backgroundColor: themeConfig.table.tableRowHover.backgroundColor,
    } as React.CSSProperties,
    tableCell: {
      padding: themeConfig.table.tableCell.padding,
      borderRight: themeConfig.table.tableCell.borderRight,
      verticalAlign: themeConfig.table.tableCell.verticalAlign as any,
      color: themeConfig.table.tableCell.color,
    } as React.CSSProperties,
    tableHeaderCell: {
      padding: themeConfig.table.tableHeaderCell.padding,
      borderRight: themeConfig.table.tableHeaderCell.borderRight,
      verticalAlign: themeConfig.table.tableHeaderCell.verticalAlign as any,
      fontWeight: themeConfig.table.tableHeaderCell.fontWeight,
      textAlign: themeConfig.table.tableHeaderCell.textAlign as any,
      color: themeConfig.table.tableHeaderCell.color,
    } as React.CSSProperties,
  }

  return {
    container: containerStyle,
    contentWrapper: contentWrapperStyle,
    error: errorStyle,
    tableContainer: tableContainerStyle,
    table: tableStyles,
    scrollbar: themeConfig.scrollbar,
    sectionDivider: sectionDividerStyle,
    footerContainer: footerContainerStyle,
    footerGlyph: footerGlyphStyle,
    glyph: glyphStyle,
  }
}

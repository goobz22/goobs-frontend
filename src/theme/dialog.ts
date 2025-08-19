// --------------------------------------------------------------------------
// DIALOG THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface DialogTheme {
  backdrop: {
    position: string
    inset: string
    zIndex: number
    display: string
    alignItems: string
    justifyContent: string
    backgroundColor: string
    backdropFilter: string
    padding: string
    overflow: string
  }
  dialog: {
    position: string
    backgroundColor: string
    borderRadius: string
    boxShadow: string
    border: string
    backdropFilter: string
    backgroundImage?: string
    maxHeight: string
    maxWidth: string
    minWidth: string
    display: string
    flexDirection: string
  }
  content: {
    overflowY: string
    overflowX: string
    maxHeight: string
    scrollbarWidth: string
    scrollbarColor?: string
    msOverflowStyle?: string
    WebkitScrollbarWidth?: string
  }
  scrollbar: {
    width: string
    backgroundColor: string
    borderRadius: string
  }
  scrollbarThumb: {
    backgroundColor: string
    borderRadius: string
    border?: string
    backgroundImage?: string
  }
  scrollbarTrack: {
    backgroundColor: string
    borderRadius: string
  }
  transition: string
}

export interface DialogStyles {
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

  // Backdrop styling
  backdropBackgroundColor?: string
  backdropBlur?: string

  // Layout and sizing
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  padding?: string
  margin?: string

  // Scrolling
  enableScrolling?: boolean
  scrollbarStyle?: 'auto' | 'thin' | 'none'
  scrollbarColor?: string
  scrollbarThumbColor?: string
  scrollbarTrackColor?: string

  // States
  fullWidth?: boolean

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // Z-index
  zIndex?: number
}

export const dialogThemes: Record<'light' | 'dark' | 'sacred', DialogTheme> = {
  light: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
      padding: '1rem',
      overflow: 'hidden',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.large,
      border: '1px solid rgba(226, 232, 240, 0.8)',
      backdropFilter: 'blur(8px)',
      maxHeight: 'calc(100vh - 2rem)',
      maxWidth: 'calc(100vw - 2rem)',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 4rem)',
      scrollbarWidth: 'thin',
      scrollbarColor: '#CBD5E1 #F1F5F9',
      msOverflowStyle: 'auto',
      WebkitScrollbarWidth: '8px',
    },
    scrollbar: {
      width: '8px',
      backgroundColor: '#F1F5F9',
      borderRadius: '4px',
    },
    scrollbarThumb: {
      backgroundColor: '#CBD5E1',
      borderRadius: '4px',
      border: '1px solid #E2E8F0',
    },
    scrollbarTrack: {
      backgroundColor: '#F8FAFC',
      borderRadius: '4px',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(2px)',
      padding: '1rem',
      overflow: 'hidden',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      backdropFilter: 'blur(8px)',
      maxHeight: 'calc(100vh - 2rem)',
      maxWidth: 'calc(100vw - 2rem)',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 4rem)',
      scrollbarWidth: 'thin',
      scrollbarColor: '#4B5563 #1F2937',
      msOverflowStyle: 'auto',
      WebkitScrollbarWidth: '8px',
    },
    scrollbar: {
      width: '8px',
      backgroundColor: '#1F2937',
      borderRadius: '4px',
    },
    scrollbarThumb: {
      backgroundColor: '#4B5563',
      borderRadius: '4px',
      border: '1px solid #374151',
    },
    scrollbarTrack: {
      backgroundColor: '#111827',
      borderRadius: '4px',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(3px)',
      padding: '1rem',
      overflow: 'hidden',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.large,
      border: '2px solid rgba(255, 215, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
      `,
      maxHeight: 'calc(100vh - 2rem)',
      maxWidth: 'calc(100vw - 2rem)',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 4rem)',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 215, 0, 0.6) rgba(0, 0, 0, 0.8)',
      msOverflowStyle: 'auto',
      WebkitScrollbarWidth: '10px',
    },
    scrollbar: {
      width: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '5px',
    },
    scrollbarThumb: {
      backgroundColor: 'rgba(255, 215, 0, 0.6)',
      borderRadius: '5px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(45deg, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.4))',
    },
    scrollbarTrack: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '5px',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getDialogTheme = (styles?: DialogStyles): DialogTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = dialogThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    backdrop: {
      ...baseTheme.backdrop,
      backgroundColor:
        styles.backdropBackgroundColor || baseTheme.backdrop.backgroundColor,
      backdropFilter: styles.backdropBlur
        ? `blur(${styles.backdropBlur})`
        : baseTheme.backdrop.backdropFilter,
      zIndex: styles.zIndex || baseTheme.backdrop.zIndex,
    },
    dialog: {
      ...baseTheme.dialog,
      backgroundColor:
        styles.backgroundColor || baseTheme.dialog.backgroundColor,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.dialog.border,
      borderRadius: styles.borderRadius || baseTheme.dialog.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.dialog.boxShadow,
      backdropFilter: styles.backdropFilter || baseTheme.dialog.backdropFilter,
      ...(styles.backgroundImage || baseTheme.dialog.backgroundImage
        ? {
            backgroundImage:
              styles.backgroundImage || baseTheme.dialog.backgroundImage,
          }
        : {}),
      maxHeight: styles.maxHeight || baseTheme.dialog.maxHeight,
      maxWidth: styles.maxWidth || baseTheme.dialog.maxWidth,
      minWidth: styles.minWidth || baseTheme.dialog.minWidth,
    },
    content: {
      ...baseTheme.content,
      overflowY:
        styles.enableScrolling === false
          ? 'hidden'
          : baseTheme.content.overflowY,
      ...(styles.scrollbarColor || baseTheme.content.scrollbarColor
        ? {
            scrollbarColor:
              styles.scrollbarColor || baseTheme.content.scrollbarColor,
          }
        : {}),
    },
    scrollbar: {
      ...baseTheme.scrollbar,
      backgroundColor:
        styles.scrollbarTrackColor || baseTheme.scrollbar.backgroundColor,
    },
    scrollbarThumb: {
      ...baseTheme.scrollbarThumb,
      backgroundColor:
        styles.scrollbarThumbColor || baseTheme.scrollbarThumb.backgroundColor,
    },
    scrollbarTrack: {
      ...baseTheme.scrollbarTrack,
      backgroundColor:
        styles.scrollbarTrackColor || baseTheme.scrollbarTrack.backgroundColor,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getDialogStyles = (
  styles?: DialogStyles,
  screenSize?: 'mobile' | 'tablet' | 'desktop'
) => {
  const themeConfig = getDialogTheme(styles)

  // Get responsive dimensions based on screen size
  const getResponsiveMaxWidth = () => {
    if (styles?.maxWidth) return styles.maxWidth

    switch (screenSize) {
      case 'mobile':
        return '95vw'
      case 'tablet':
        return '85vw'
      case 'desktop':
        return '900px'
      default:
        return themeConfig.dialog.maxWidth
    }
  }

  const getResponsiveMargin = () => {
    if (styles?.margin) return styles.margin

    switch (screenSize) {
      case 'mobile':
        return '0.5rem auto'
      case 'tablet':
        return '1rem auto'
      case 'desktop':
        return '1.5rem auto'
      default:
        return '1rem auto'
    }
  }

  const getResponsivePadding = () => {
    if (styles?.padding) return styles.padding

    switch (screenSize) {
      case 'mobile':
        return '0.5rem'
      case 'tablet':
        return '1rem'
      case 'desktop':
        return '1.5rem'
      default:
        return '1rem'
    }
  }

  const backdropStyle: React.CSSProperties = {
    position: themeConfig.backdrop.position as any,
    inset: themeConfig.backdrop.inset as any,
    zIndex: themeConfig.backdrop.zIndex,
    display: themeConfig.backdrop.display as any,
    alignItems: themeConfig.backdrop.alignItems as any,
    justifyContent: themeConfig.backdrop.justifyContent as any,
    backgroundColor: themeConfig.backdrop.backgroundColor,
    backdropFilter: themeConfig.backdrop.backdropFilter,
    padding: getResponsivePadding(),
    overflow: themeConfig.backdrop.overflow as any,
  }

  const dialogStyle: React.CSSProperties = {
    position: themeConfig.dialog.position as any,
    backgroundColor: themeConfig.dialog.backgroundColor,
    borderRadius: themeConfig.dialog.borderRadius,
    boxShadow: themeConfig.dialog.boxShadow,
    border: themeConfig.dialog.border,
    backdropFilter: themeConfig.dialog.backdropFilter,
    backgroundImage: themeConfig.dialog.backgroundImage,
    transition: themeConfig.transition,
    maxHeight: themeConfig.dialog.maxHeight,
    maxWidth: getResponsiveMaxWidth(),
    minWidth: screenSize === 'mobile' ? '280px' : themeConfig.dialog.minWidth,
    display: themeConfig.dialog.display as any,
    flexDirection: themeConfig.dialog.flexDirection as any,
    // Layout and sizing overrides
    width: styles?.width || (styles?.fullWidth ? '100%' : undefined),
    height: styles?.height,
    minHeight: styles?.minHeight,
    padding: undefined, // Let content wrapper handle padding
    margin: getResponsiveMargin(),
  }

  const contentStyle: React.CSSProperties = {
    overflowY: themeConfig.content.overflowY as any,
    overflowX: themeConfig.content.overflowX as any,
    maxHeight: themeConfig.content.maxHeight,
    scrollbarColor: themeConfig.content.scrollbarColor,
    msOverflowStyle: themeConfig.content.msOverflowStyle as any,
    scrollbarWidth: themeConfig.content.WebkitScrollbarWidth as any,
    padding: styles?.padding,
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0, // Important for flex scrolling
  }

  // Generate CSS for webkit scrollbar styling
  const scrollbarCSS = `
    .dialog-content-${styles?.theme || 'sacred'}::-webkit-scrollbar {
      width: ${themeConfig.scrollbar.width};
      background-color: ${themeConfig.scrollbar.backgroundColor};
      border-radius: ${themeConfig.scrollbar.borderRadius};
    }
    
    .dialog-content-${styles?.theme || 'sacred'}::-webkit-scrollbar-thumb {
      background-color: ${themeConfig.scrollbarThumb.backgroundColor};
      border-radius: ${themeConfig.scrollbarThumb.borderRadius};
      ${themeConfig.scrollbarThumb.border ? `border: ${themeConfig.scrollbarThumb.border};` : ''}
      ${themeConfig.scrollbarThumb.backgroundImage ? `background-image: ${themeConfig.scrollbarThumb.backgroundImage};` : ''}
    }
    
    .dialog-content-${styles?.theme || 'sacred'}::-webkit-scrollbar-track {
      background-color: ${themeConfig.scrollbarTrack.backgroundColor};
      border-radius: ${themeConfig.scrollbarTrack.borderRadius};
    }
    
    .dialog-content-${styles?.theme || 'sacred'}::-webkit-scrollbar-thumb:hover {
      opacity: 0.8;
    }
  `

  return {
    backdrop: backdropStyle,
    dialog: dialogStyle,
    content: contentStyle,
    scrollbarCSS,
    contentClassName: `dialog-content-${styles?.theme || 'sacred'}`,
  }
}

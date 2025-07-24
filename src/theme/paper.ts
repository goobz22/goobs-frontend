// --------------------------------------------------------------------------
// PAPER THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface PaperTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    padding?: string
    backgroundImage?: string
    position: React.CSSProperties['position']
    overflow: React.CSSProperties['overflow']
    transition?: string
  }
  containerHover?: {
    transform?: string
    boxShadow?: string
    borderColor?: string
  }
}

export interface PaperStyles {
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

  // Layout and positioning
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  width?: string
  height?: string
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  maxHeight?: string

  // Hover states (for interactive papers)
  hoverTransform?: string
  hoverBoxShadow?: string
  hoverBorderColor?: string
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme: PaperTheme = {
  container: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
  },
}

const darkTheme: PaperTheme = {
  container: {
    background: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
  },
}

const sacredTheme: PaperTheme = {
  container: {
    background: `linear-gradient(135deg, 
      rgba(10, 10, 10, 0.95) 0%, 
      rgba(26, 26, 26, 0.97) 50%,
      rgba(10, 10, 10, 0.95) 100%
    )`,
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.6),
      0 0 20px rgba(255, 215, 0, 0.2),
      inset 0 1px 0 rgba(255, 215, 0, 0.1)
    `,
    backdropFilter: 'blur(20px)',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.7),
      0 0 30px rgba(255, 215, 0, 0.3),
      inset 0 1px 0 rgba(255, 215, 0, 0.15)
    `,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
}

// --------------------------------------------------------------------------
// THEME REGISTRY
// --------------------------------------------------------------------------

export const paperThemes = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
} as const

// --------------------------------------------------------------------------
// THEME GETTER FUNCTION
// --------------------------------------------------------------------------

export function getPaperTheme(
  theme: 'light' | 'dark' | 'sacred' = 'light'
): PaperTheme {
  return paperThemes[theme]
}

// --------------------------------------------------------------------------
// ELEVATION SHADOWS
// --------------------------------------------------------------------------

const getElevationShadow = (
  elevation: number,
  theme: 'light' | 'dark' | 'sacred' = 'light'
) => {
  const baseElevation = Math.max(0, Math.min(24, elevation))

  switch (theme) {
    case 'dark':
      return `0 ${baseElevation * 2}px ${baseElevation * 4}px rgba(0, 0, 0, 0.4), 0 ${baseElevation}px ${baseElevation * 2}px rgba(0, 0, 0, 0.3)`
    case 'sacred':
      return `0 ${baseElevation * 2}px ${baseElevation * 4}px rgba(0, 0, 0, 0.6), 0 0 ${baseElevation * 2}px rgba(255, 215, 0, ${Math.min(0.4, baseElevation * 0.05)})`
    default:
      return `0 ${baseElevation}px ${baseElevation * 2}px rgba(0, 0, 0, ${Math.min(0.15, baseElevation * 0.01)}), 0 ${baseElevation * 0.5}px ${baseElevation}px rgba(0, 0, 0, ${Math.min(0.1, baseElevation * 0.008)})`
  }
}

// --------------------------------------------------------------------------
// STYLES COMPUTATION FUNCTION
// --------------------------------------------------------------------------

export function getPaperStyles(
  customStyles?: PaperStyles,
  elevation: number = 1
): { container: React.CSSProperties } {
  const theme = customStyles?.theme || 'light'
  const baseTheme = getPaperTheme(theme)

  const containerStyles: React.CSSProperties = {
    background: baseTheme.container.background,
    border: baseTheme.container.border,
    borderRadius: baseTheme.container.borderRadius,
    backdropFilter: baseTheme.container.backdropFilter,
    position: baseTheme.container.position,
    overflow: baseTheme.container.overflow,
    transition: baseTheme.container.transition,

    // Apply elevation shadow
    boxShadow: customStyles?.boxShadow || getElevationShadow(elevation, theme),

    // Include background image if present
    ...(baseTheme.container.backgroundImage && {
      backgroundImage: baseTheme.container.backgroundImage,
    }),

    // Custom overrides
    ...(customStyles?.backgroundColor && {
      background: customStyles.backgroundColor,
    }),
    ...(customStyles?.borderColor && { borderColor: customStyles.borderColor }),
    ...(customStyles?.borderRadius && {
      borderRadius: customStyles.borderRadius,
    }),
    ...(customStyles?.borderWidth && { borderWidth: customStyles.borderWidth }),
    ...(customStyles?.backdropFilter && {
      backdropFilter: customStyles.backdropFilter,
    }),
    ...(customStyles?.backgroundImage && {
      backgroundImage: customStyles.backgroundImage,
    }),
    ...(customStyles?.padding && { padding: customStyles.padding }),

    // Layout and positioning
    ...(customStyles?.margin && { margin: customStyles.margin }),
    ...(customStyles?.marginTop && { marginTop: customStyles.marginTop }),
    ...(customStyles?.marginBottom && {
      marginBottom: customStyles.marginBottom,
    }),
    ...(customStyles?.marginLeft && { marginLeft: customStyles.marginLeft }),
    ...(customStyles?.marginRight && { marginRight: customStyles.marginRight }),
    ...(customStyles?.width && { width: customStyles.width }),
    ...(customStyles?.height && { height: customStyles.height }),
    ...(customStyles?.minWidth && { minWidth: customStyles.minWidth }),
    ...(customStyles?.minHeight && { minHeight: customStyles.minHeight }),
    ...(customStyles?.maxWidth && { maxWidth: customStyles.maxWidth }),
    ...(customStyles?.maxHeight && { maxHeight: customStyles.maxHeight }),
  }

  return {
    container: containerStyles,
  }
}

// Helper function to get hover styles for interactive papers
export function getPaperHoverStyles(
  customStyles?: PaperStyles
): React.CSSProperties | undefined {
  const theme = customStyles?.theme || 'light'
  const baseTheme = getPaperTheme(theme)

  if (
    !baseTheme.containerHover &&
    !customStyles?.hoverTransform &&
    !customStyles?.hoverBoxShadow &&
    !customStyles?.hoverBorderColor
  ) {
    return undefined
  }

  return {
    ...(baseTheme.containerHover?.transform && {
      transform: baseTheme.containerHover.transform,
    }),
    ...(baseTheme.containerHover?.boxShadow && {
      boxShadow: baseTheme.containerHover.boxShadow,
    }),
    ...(baseTheme.containerHover?.borderColor && {
      borderColor: baseTheme.containerHover.borderColor,
    }),
    ...(customStyles?.hoverTransform && {
      transform: customStyles.hoverTransform,
    }),
    ...(customStyles?.hoverBoxShadow && {
      boxShadow: customStyles.hoverBoxShadow,
    }),
    ...(customStyles?.hoverBorderColor && {
      borderColor: customStyles.hoverBorderColor,
    }),
  }
}

// Export the Paper styles computation as default
export default getPaperStyles

// --------------------------------------------------------------------------
// ACCORDION THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface AccordionTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
  }
  containerHover: {
    transform: string
    boxShadow: string
    borderColor?: string
  }
  containerExpanded: {
    boxShadow: string
    background: string
    borderColor?: string
    backgroundImage?: string
  }
  summary: {
    background: string
    color: string
    fontFamily: string
    fontSize: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
    borderBottom: string
  }
  summaryHover: {
    backgroundColor: string
    color: string
    transform?: string
    textShadow?: string
  }
  summaryExpanded: {
    backgroundColor: string
    borderBottomColor: string
    color: string
    fontWeight: string | number
    textShadow?: string
  }
  details: {
    background: string
    borderTop: string
    color: string
    fontFamily: string
    fontSize: string
    lineHeight: string | number
    backdropFilter: string
  }
  icon: {
    color: string
    filter?: string
  }
  iconHover: {
    color: string
    transform: string
    filter?: string
  }
  iconExpanded: {
    transform: string
    color: string
    filter?: string
  }
  transition: string
}

export interface AccordionStyles {
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

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string

  // Expanded states
  expandedBackgroundColor?: string
  expandedBorderColor?: string
  expandedBoxShadow?: string
  expandedBackgroundImage?: string

  // Summary styling
  summaryBackgroundColor?: string
  summaryColor?: string
  summaryFontFamily?: string
  summaryFontSize?: string
  summaryFontWeight?: string | number
  summaryLetterSpacing?: string
  summaryTextShadow?: string
  summaryBorderBottom?: string

  // Summary hover
  summaryHoverBackgroundColor?: string
  summaryHoverColor?: string
  summaryHoverTransform?: string
  summaryHoverTextShadow?: string

  // Summary expanded
  summaryExpandedBackgroundColor?: string
  summaryExpandedBorderBottomColor?: string
  summaryExpandedColor?: string
  summaryExpandedFontWeight?: string | number
  summaryExpandedTextShadow?: string

  // Details styling
  detailsBackgroundColor?: string
  detailsBorderTop?: string
  detailsColor?: string
  detailsFontFamily?: string
  detailsFontSize?: string
  detailsLineHeight?: string | number
  detailsBackdropFilter?: string

  // Icon styling
  iconColor?: string
  iconFilter?: string
  iconHoverColor?: string
  iconHoverTransform?: string
  iconHoverFilter?: string
  iconExpandedTransform?: string
  iconExpandedColor?: string
  iconExpandedFilter?: string

  // Layout and spacing
  padding?: string
  summaryPadding?: string
  detailsPadding?: string
  margin?: string
  marginBottom?: string
  minHeight?: string
  summaryMinHeight?: string

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
}

export const accordionThemes: Record<
  'light' | 'dark' | 'sacred',
  AccordionTheme
> = {
  light: {
    container: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(8px)',
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.light.medium,
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    containerExpanded: {
      boxShadow: SHADOWS.light.large,
      background:
        'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
    },
    summary: {
      background: 'rgba(248, 250, 252, 0.5)',
      color: 'rgb(31, 41, 55)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '18px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      borderBottom: '1px solid transparent',
    },
    summaryHover: {
      backgroundColor: 'rgba(239, 246, 255, 0.6)',
      color: 'rgb(29, 78, 216)',
      transform: 'translateX(4px)',
    },
    summaryExpanded: {
      backgroundColor: 'rgba(239, 246, 255, 0.8)',
      borderBottomColor: 'rgba(59, 130, 246, 0.2)',
      color: 'rgb(29, 78, 216)',
      fontWeight: 700,
    },
    details: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderTop: '1px solid rgba(226, 232, 240, 0.5)',
      color: 'rgb(55, 65, 81)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      lineHeight: 1.7,
      backdropFilter: 'blur(4px)',
    },
    icon: {
      color: 'rgb(107, 114, 128)',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    },
    iconHover: {
      color: 'rgb(29, 78, 216)',
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.2))',
    },
    iconExpanded: {
      transform: 'rotate(180deg) scale(1.1)',
      color: 'rgb(29, 78, 216)',
      filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.3))',
    },
    transition: TRANSITIONS.premium,
  },
  dark: {
    container: {
      background:
        'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.2)',
      borderColor: 'rgba(96, 165, 250, 0.4)',
    },
    containerExpanded: {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
      background:
        'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(31, 41, 55, 0.95) 100%)',
    },
    summary: {
      background: 'rgba(17, 24, 39, 0.5)',
      color: 'rgb(243, 244, 246)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '18px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      borderBottom: '1px solid transparent',
    },
    summaryHover: {
      backgroundColor: 'rgba(30, 58, 138, 0.3)',
      color: 'rgb(96, 165, 250)',
      transform: 'translateX(4px)',
    },
    summaryExpanded: {
      backgroundColor: 'rgba(30, 58, 138, 0.4)',
      borderBottomColor: 'rgba(96, 165, 250, 0.3)',
      color: 'rgb(96, 165, 250)',
      fontWeight: 700,
    },
    details: {
      background: 'rgba(17, 24, 39, 0.8)',
      borderTop: '1px solid rgba(75, 85, 99, 0.5)',
      color: 'rgb(209, 213, 219)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      lineHeight: 1.7,
      backdropFilter: 'blur(4px)',
    },
    icon: {
      color: 'rgb(156, 163, 175)',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
    },
    iconHover: {
      color: 'rgb(96, 165, 250)',
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))',
    },
    iconExpanded: {
      transform: 'rotate(180deg) scale(1.1)',
      color: 'rgb(96, 165, 250)',
      filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.4))',
    },
    transition: TRANSITIONS.premium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.95)',
      border: '2px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(4px)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.sacred.medium,
      borderColor: 'rgba(255, 215, 0, 0.6)',
    },
    containerExpanded: {
      boxShadow: SHADOWS.sacred.large,
      background: 'rgba(10, 10, 10, 0.95)',
      borderColor: '#FFD700',
      backgroundImage: `
        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
      `,
    },
    summary: {
      background: 'transparent',
      color: 'rgba(255, 215, 0, 0.9)',
      fontFamily: '"Cinzel", serif',
      fontSize: '20px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textShadow: '0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5)',
      borderBottom: '1px solid transparent',
    },
    summaryHover: {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      textShadow: '0 0 15px #FFD700, 0 0 30px rgba(255, 215, 0, 0.7)',
    },
    summaryExpanded: {
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
      color: '#FFD700',
      fontWeight: 600,
      textShadow: '0 0 20px #FFD700, 0 0 40px rgba(255, 215, 0, 0.8)',
    },
    details: {
      background: 'rgba(0, 0, 0, 0.4)',
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
      color: 'rgba(245, 245, 220, 0.9)',
      fontFamily: '"Merriweather", serif',
      fontSize: '16px',
      lineHeight: 1.6,
      backdropFilter: 'blur(2px)',
    },
    icon: {
      color: '#FFD700',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
    },
    iconHover: {
      color: '#FFD700',
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    },
    iconExpanded: {
      transform: 'rotate(180deg) scale(1.1)',
      color: '#FFD700',
      filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getAccordionTheme = (styles?: AccordionStyles): AccordionTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = accordionThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      borderColor:
        styles.hoverBorderColor || baseTheme.containerHover.borderColor,
    },
    containerExpanded: {
      boxShadow:
        styles.expandedBoxShadow || baseTheme.containerExpanded.boxShadow,
      background:
        styles.expandedBackgroundColor ||
        baseTheme.containerExpanded.background,
      borderColor:
        styles.expandedBorderColor || baseTheme.containerExpanded.borderColor,
      backgroundImage:
        styles.expandedBackgroundImage ||
        baseTheme.containerExpanded.backgroundImage,
    },
    summary: {
      background: styles.summaryBackgroundColor || baseTheme.summary.background,
      color: styles.summaryColor || baseTheme.summary.color,
      fontFamily: styles.summaryFontFamily || baseTheme.summary.fontFamily,
      fontSize: styles.summaryFontSize || baseTheme.summary.fontSize,
      fontWeight: styles.summaryFontWeight || baseTheme.summary.fontWeight,
      letterSpacing:
        styles.summaryLetterSpacing || baseTheme.summary.letterSpacing,
      textShadow: styles.summaryTextShadow || baseTheme.summary.textShadow,
      borderBottom:
        styles.summaryBorderBottom || baseTheme.summary.borderBottom,
    },
    summaryHover: {
      backgroundColor:
        styles.summaryHoverBackgroundColor ||
        baseTheme.summaryHover.backgroundColor,
      color: styles.summaryHoverColor || baseTheme.summaryHover.color,
      transform:
        styles.summaryHoverTransform || baseTheme.summaryHover.transform,
      textShadow:
        styles.summaryHoverTextShadow || baseTheme.summaryHover.textShadow,
    },
    summaryExpanded: {
      backgroundColor:
        styles.summaryExpandedBackgroundColor ||
        baseTheme.summaryExpanded.backgroundColor,
      borderBottomColor:
        styles.summaryExpandedBorderBottomColor ||
        baseTheme.summaryExpanded.borderBottomColor,
      color: styles.summaryExpandedColor || baseTheme.summaryExpanded.color,
      fontWeight:
        styles.summaryExpandedFontWeight ||
        baseTheme.summaryExpanded.fontWeight,
      textShadow:
        styles.summaryExpandedTextShadow ||
        baseTheme.summaryExpanded.textShadow,
    },
    details: {
      background: styles.detailsBackgroundColor || baseTheme.details.background,
      borderTop: styles.detailsBorderTop || baseTheme.details.borderTop,
      color: styles.detailsColor || baseTheme.details.color,
      fontFamily: styles.detailsFontFamily || baseTheme.details.fontFamily,
      fontSize: styles.detailsFontSize || baseTheme.details.fontSize,
      lineHeight: styles.detailsLineHeight || baseTheme.details.lineHeight,
      backdropFilter:
        styles.detailsBackdropFilter || baseTheme.details.backdropFilter,
    },
    icon: {
      color: styles.iconColor || baseTheme.icon.color,
      filter: styles.iconFilter || baseTheme.icon.filter,
    },
    iconHover: {
      color: styles.iconHoverColor || baseTheme.iconHover.color,
      transform: styles.iconHoverTransform || baseTheme.iconHover.transform,
      filter: styles.iconHoverFilter || baseTheme.iconHover.filter,
    },
    iconExpanded: {
      transform:
        styles.iconExpandedTransform || baseTheme.iconExpanded.transform,
      color: styles.iconExpandedColor || baseTheme.iconExpanded.color,
      filter: styles.iconExpandedFilter || baseTheme.iconExpanded.filter,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getAccordionStyles = (
  styles?: AccordionStyles,
  isHovered?: boolean,
  isExpanded?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getAccordionTheme(styles)

  const containerStyle: React.CSSProperties = {
    marginBottom: styles?.marginBottom || '12px',
    margin: styles?.margin,
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    borderRadius: themeConfig.container.borderRadius,
    overflow: 'hidden',
    position: 'relative',
    transition: themeConfig.transition,
    backgroundColor: themeConfig.container.background,
    border: themeConfig.container.border,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    backgroundImage: themeConfig.container.backgroundImage,
    ...(isHovered &&
      !isDisabled && {
        transform: themeConfig.containerHover.transform,
        boxShadow: themeConfig.containerHover.boxShadow,
        borderColor: themeConfig.containerHover.borderColor,
      }),
    ...(isExpanded &&
      !isDisabled && {
        boxShadow: themeConfig.containerExpanded.boxShadow,
        background: themeConfig.containerExpanded.background,
        borderColor: themeConfig.containerExpanded.borderColor,
        backgroundImage: themeConfig.containerExpanded.backgroundImage,
      }),
    ...(isDisabled && { opacity: 0.7 }),
    ...(styles?.outline === false && { border: 'none', boxShadow: 'none' }),
  }

  const summaryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: styles?.summaryPadding || '24px',
    transition: themeConfig.transition,
    position: 'relative',
    backgroundColor: themeConfig.summary.background,
    color: themeConfig.summary.color,
    fontFamily: themeConfig.summary.fontFamily,
    fontWeight: themeConfig.summary.fontWeight,
    fontSize: themeConfig.summary.fontSize,
    letterSpacing: themeConfig.summary.letterSpacing,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    minHeight: styles?.summaryMinHeight || '72px',
    borderBottom: themeConfig.summary.borderBottom,
    textShadow: themeConfig.summary.textShadow,
    ...(isHovered &&
      !isDisabled && {
        backgroundColor: themeConfig.summaryHover.backgroundColor,
        color: themeConfig.summaryHover.color,
        transform: themeConfig.summaryHover.transform,
        textShadow: themeConfig.summaryHover.textShadow,
      }),
    ...(isExpanded &&
      !isDisabled && {
        backgroundColor: themeConfig.summaryExpanded.backgroundColor,
        borderBottomColor: themeConfig.summaryExpanded.borderBottomColor,
        color: themeConfig.summaryExpanded.color,
        fontWeight: themeConfig.summaryExpanded.fontWeight,
        textShadow: themeConfig.summaryExpanded.textShadow,
      }),
  }

  const detailsStyle: React.CSSProperties = {
    padding: styles?.detailsPadding || '24px',
    position: 'relative',
    backgroundColor: themeConfig.details.background,
    borderTop: themeConfig.details.borderTop,
    color: themeConfig.details.color,
    fontFamily: themeConfig.details.fontFamily,
    fontSize: themeConfig.details.fontSize,
    lineHeight: themeConfig.details.lineHeight,
    backdropFilter: themeConfig.details.backdropFilter,
    ...(styles?.outline === false && { borderTop: 'none' }),
  }

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    transition: themeConfig.transition,
    color: themeConfig.icon.color,
    filter: themeConfig.icon.filter,
    ...(isHovered &&
      !isDisabled && {
        color: themeConfig.iconHover.color,
        transform: themeConfig.iconHover.transform,
        filter: themeConfig.iconHover.filter,
      }),
    ...(isExpanded &&
      !isDisabled && {
        transform: themeConfig.iconExpanded.transform,
        color: themeConfig.iconExpanded.color,
        filter: themeConfig.iconExpanded.filter,
      }),
    ...(isDisabled && { color: 'rgb(156, 163, 175)' }),
  }

  return {
    container: containerStyle,
    summary: summaryStyle,
    details: detailsStyle,
    icon: iconStyle,
  }
}

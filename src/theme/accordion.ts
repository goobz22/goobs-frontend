// --------------------------------------------------------------------------
// ACCORDION THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'

export interface AccordionTheme {
  container: {
    backgroundColor: string
    borderWidth: string
    borderStyle: string
    borderColor: string
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
    backgroundColor: string
    borderColor?: string
    backgroundImage?: string
  }
  summary: {
    backgroundColor: string
    color: string
    fontFamily: string
    fontSize: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
    borderBottom: string
    minHeight: string
    height?: string
    maxHeight?: string
    whiteSpace?: string
    overflow?: string
    textOverflow?: string
    minWidth?: string
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
    backgroundColor: string
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
  // Mobile responsive overrides
  mobile: {
    borderRadius: string
    boxShadow: string
    summaryPadding: string
    summaryMinHeight: string
    detailsPadding: string
    summaryFontSize: string
  }
  // Tablet responsive overrides
  tablet: {
    detailsPadding: string
  }
  // Desktop responsive overrides
  desktop: {
    detailsPadding: string
  }
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
  summaryWhiteSpace?: string
  summaryOverflow?: string
  summaryTextOverflow?: string

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
  height?: string
  maxHeight?: string

  // Navigation level (for indentation)
  level?: number
  levelIndentBase?: number
  levelIndentIncrement?: number
}

export const accordionThemes: Record<
  'light' | 'dark' | 'sacred',
  AccordionTheme
> = {
  light: {
    container: {
      backgroundColor: 'white',
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      borderRadius: '8px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'none',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
    },
    containerExpanded: {
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.12)',
      backgroundColor: '#fafafa',
    },
    summary: {
      backgroundColor: '#f5f7fa',
      color: 'inherit',
      fontFamily: 'merriweather',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: 'normal',
      borderBottom: 'none',
      minHeight: '32px',
      height: '32px',
      maxHeight: '32px',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    summaryHover: {
      backgroundColor: '#e8f0fe',
      color: 'inherit',
    },
    summaryExpanded: {
      backgroundColor: '#e3f2fd',
      borderBottomColor: 'rgba(0, 0, 0, 0.12)',
      color: 'inherit',
      fontWeight: 500,
    },
    details: {
      backgroundColor: 'white',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      color: 'inherit',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: 1.6,
      backdropFilter: 'none',
    },
    icon: {
      color: '#000000',
      filter: 'none',
    },
    iconHover: {
      color: '#000000',
      transform: 'scale(1.1)',
      filter: 'none',
    },
    iconExpanded: {
      transform: 'rotate(180deg)',
      color: '#000000',
      filter: 'none',
    },
    transition: 'all 0.2s ease',
    mobile: {
      borderRadius: '6px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      summaryPadding: '4px 16px',
      summaryMinHeight: '32px',
      detailsPadding: '12px 16px',
      summaryFontSize: '14px',
    },
    tablet: {
      detailsPadding: '14px 18px',
    },
    desktop: {
      detailsPadding: '16px 24px',
    },
  },
  dark: {
    container: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      borderRadius: '8px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)',
    },
    containerExpanded: {
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(30, 58, 138, 0.2)',
    },
    summary: {
      backgroundColor: 'rgba(17, 24, 39, 0.5)',
      color: 'rgb(243, 244, 246)',
      fontFamily: 'merriweather',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: 'normal',
      borderBottom: 'none',
      minHeight: '32px',
      height: '32px',
      maxHeight: '32px',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    summaryHover: {
      backgroundColor: 'rgba(30, 58, 138, 0.3)',
      color: 'rgb(96, 165, 250)',
    },
    summaryExpanded: {
      backgroundColor: 'rgba(30, 58, 138, 0.4)',
      borderBottomColor: 'rgba(96, 165, 250, 0.3)',
      color: 'rgb(96, 165, 250)',
      fontWeight: 500,
    },
    details: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      borderTop: '1px solid rgba(75, 85, 99, 0.5)',
      color: 'rgb(209, 213, 219)',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: 1.6,
      backdropFilter: 'blur(4px)',
    },
    icon: {
      color: 'rgb(156, 163, 175)',
      filter: 'none',
    },
    iconHover: {
      color: 'rgb(96, 165, 250)',
      transform: 'scale(1.1)',
      filter: 'none',
    },
    iconExpanded: {
      transform: 'rotate(180deg)',
      color: 'rgb(96, 165, 250)',
      filter: 'none',
    },
    transition: 'all 0.2s ease',
    mobile: {
      borderRadius: '6px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
      summaryPadding: '4px 16px',
      summaryMinHeight: '32px',
      detailsPadding: '12px 16px',
      summaryFontSize: '14px',
    },
    tablet: {
      detailsPadding: '14px 18px',
    },
    desktop: {
      detailsPadding: '16px 24px',
    },
  },
  sacred: {
    container: {
      backgroundColor: '#0a0a0a',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      borderRadius: '8px',
      boxShadow:
        '0 0 15px rgba(255, 215, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      backgroundImage: `
        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
      `,
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow:
        '0 0 25px rgba(255, 215, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.4)',
    },
    containerExpanded: {
      boxShadow:
        '0 0 30px rgba(255, 215, 0, 0.5), 0 6px 12px rgba(0, 0, 0, 0.5)',
      backgroundColor: '#0a0a0a',
      borderColor: '#FFD700',
      backgroundImage: `
        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
      `,
    },
    summary: {
      backgroundColor: 'transparent',
      color: 'rgba(255, 215, 0, 0.9)',
      fontFamily: '"Cinzel", serif',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
      borderBottom: 'none',
      minHeight: '32px',
      height: '32px',
      maxHeight: '32px',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    summaryHover: {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    },
    summaryExpanded: {
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
      color: '#FFD700',
      fontWeight: 600,
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    },
    details: {
      backgroundColor: 'transparent',
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
      color: 'rgba(255, 215, 0, 0.8)',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: 1.6,
      backdropFilter: 'blur(2px)',
    },
    icon: {
      color: '#FFD700',
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
    },
    iconHover: {
      color: '#FFD700',
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
    },
    iconExpanded: {
      transform: 'rotate(180deg)',
      color: '#FFD700',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
    },
    transition: 'all 0.3s ease',
    mobile: {
      borderRadius: '6px',
      boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
      summaryPadding: '4px 16px',
      summaryMinHeight: '32px',
      detailsPadding: '12px 16px',
      summaryFontSize: '14px',
    },
    tablet: {
      detailsPadding: '14px 18px',
    },
    desktop: {
      detailsPadding: '24px 32px',
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getAccordionTheme = (styles?: AccordionStyles): AccordionTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = accordionThemes[theme]

  if (!styles) {
    return baseTheme
  }

  // Avoid assigning explicit undefined to optional props under exactOptionalPropertyTypes
  const hoverBorderColor =
    styles.hoverBorderColor ?? baseTheme.containerHover.borderColor
  const expandedBorderColor =
    styles.expandedBorderColor ?? baseTheme.containerExpanded.borderColor
  const summaryTextShadow =
    styles.summaryTextShadow ?? baseTheme.summary.textShadow
  const summaryHoverTransform =
    styles.summaryHoverTransform ?? baseTheme.summaryHover.transform
  const summaryHoverTextShadow =
    styles.summaryHoverTextShadow ?? baseTheme.summaryHover.textShadow
  const summaryExpandedTextShadow =
    styles.summaryExpandedTextShadow ?? baseTheme.summaryExpanded.textShadow
  const iconFilter = styles.iconFilter ?? baseTheme.icon.filter
  const iconHoverFilter = styles.iconHoverFilter ?? baseTheme.iconHover.filter
  const iconExpandedFilter =
    styles.iconExpandedFilter ?? baseTheme.iconExpanded.filter

  const summaryHeight = styles.height ?? baseTheme.summary.height
  const summaryMaxHeight = styles.maxHeight ?? baseTheme.summary.maxHeight
  const summaryWhiteSpace =
    styles.summaryWhiteSpace ?? baseTheme.summary.whiteSpace
  const summaryOverflow = styles.summaryOverflow ?? baseTheme.summary.overflow
  const summaryTextOverflow =
    styles.summaryTextOverflow ?? baseTheme.summary.textOverflow
  const summaryMinWidth = styles.minWidth ?? baseTheme.summary.minWidth

  return {
    ...baseTheme,
    container: {
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      borderWidth: styles.borderWidth || baseTheme.container.borderWidth,
      borderStyle: styles.borderColor
        ? 'solid'
        : baseTheme.container.borderStyle,
      borderColor: styles.borderColor || baseTheme.container.borderColor,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      ...(styles.backgroundImage || baseTheme.container.backgroundImage
        ? {
            backgroundImage: (styles.backgroundImage ||
              baseTheme.container.backgroundImage) as string,
          }
        : {}),
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      ...(hoverBorderColor !== undefined
        ? { borderColor: hoverBorderColor }
        : {}),
    },
    containerExpanded: {
      boxShadow:
        styles.expandedBoxShadow || baseTheme.containerExpanded.boxShadow,
      backgroundColor:
        styles.expandedBackgroundColor ||
        baseTheme.containerExpanded.backgroundColor,
      ...(expandedBorderColor !== undefined
        ? { borderColor: expandedBorderColor }
        : {}),
      ...(styles.expandedBackgroundImage ||
      baseTheme.containerExpanded.backgroundImage
        ? {
            backgroundImage: (styles.expandedBackgroundImage ||
              baseTheme.containerExpanded.backgroundImage) as string,
          }
        : {}),
    },
    summary: {
      backgroundColor:
        styles.summaryBackgroundColor || baseTheme.summary.backgroundColor,
      color: styles.summaryColor || baseTheme.summary.color,
      fontFamily: styles.summaryFontFamily || baseTheme.summary.fontFamily,
      fontSize: styles.summaryFontSize || baseTheme.summary.fontSize,
      fontWeight: styles.summaryFontWeight || baseTheme.summary.fontWeight,
      letterSpacing:
        styles.summaryLetterSpacing || baseTheme.summary.letterSpacing,
      ...(summaryTextShadow !== undefined
        ? { textShadow: summaryTextShadow }
        : {}),
      borderBottom:
        styles.summaryBorderBottom || baseTheme.summary.borderBottom,
      minHeight: styles.summaryMinHeight || baseTheme.summary.minHeight,
      ...(summaryHeight !== undefined ? { height: summaryHeight } : {}),
      ...(summaryMaxHeight !== undefined
        ? { maxHeight: summaryMaxHeight }
        : {}),
      ...(summaryWhiteSpace !== undefined
        ? { whiteSpace: summaryWhiteSpace }
        : {}),
      ...(summaryOverflow !== undefined ? { overflow: summaryOverflow } : {}),
      ...(summaryTextOverflow !== undefined
        ? { textOverflow: summaryTextOverflow }
        : {}),
      ...(summaryMinWidth !== undefined ? { minWidth: summaryMinWidth } : {}),
    },
    summaryHover: {
      backgroundColor:
        styles.summaryHoverBackgroundColor ||
        baseTheme.summaryHover.backgroundColor,
      color: styles.summaryHoverColor || baseTheme.summaryHover.color,
      ...(summaryHoverTransform !== undefined
        ? { transform: summaryHoverTransform }
        : {}),
      ...(summaryHoverTextShadow !== undefined
        ? { textShadow: summaryHoverTextShadow }
        : {}),
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
      ...(summaryExpandedTextShadow !== undefined
        ? { textShadow: summaryExpandedTextShadow }
        : {}),
    },
    details: {
      backgroundColor:
        styles.detailsBackgroundColor || baseTheme.details.backgroundColor,
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
      ...(iconFilter !== undefined ? { filter: iconFilter } : {}),
    },
    iconHover: {
      color: styles.iconHoverColor || baseTheme.iconHover.color,
      transform: styles.iconHoverTransform || baseTheme.iconHover.transform,
      ...(iconHoverFilter !== undefined ? { filter: iconHoverFilter } : {}),
    },
    iconExpanded: {
      transform:
        styles.iconExpandedTransform || baseTheme.iconExpanded.transform,
      color: styles.iconExpandedColor || baseTheme.iconExpanded.color,
      ...(iconExpandedFilter !== undefined
        ? { filter: iconExpandedFilter }
        : {}),
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Helper function to get responsive styles
const getResponsiveStyles = (
  theme: AccordionTheme,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): Partial<React.CSSProperties> => {
  const responsive = theme[breakpoint]

  switch (breakpoint) {
    case 'mobile':
      return {
        borderRadius: (responsive as any).borderRadius,
        boxShadow: (responsive as any).boxShadow,
      }
    case 'tablet':
    case 'desktop':
      return {}
    default:
      return {}
  }
}

// Helper function to get responsive summary styles
const getResponsiveSummaryStyles = (
  theme: AccordionTheme,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): Partial<React.CSSProperties> => {
  const responsive = theme[breakpoint]

  switch (breakpoint) {
    case 'mobile':
      return {
        padding: (responsive as any).summaryPadding,
        minHeight: (responsive as any).summaryMinHeight,
        fontSize: (responsive as any).summaryFontSize,
      }
    default:
      return {}
  }
}

// Helper function to get responsive details styles
const getResponsiveDetailsStyles = (
  theme: AccordionTheme,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): Partial<React.CSSProperties> => {
  const responsive = theme[breakpoint]

  return {
    padding: responsive.detailsPadding,
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
  const isSacredTheme = styles?.theme === 'sacred'

  // Calculate level-based indentation
  const level = styles?.level || 0
  const indentBase = styles?.levelIndentBase || 0
  const indentIncrement = styles?.levelIndentIncrement || 6
  const levelIndent = indentBase + level * indentIncrement

  // Base container styles
  const containerStyle: React.CSSProperties = {
    marginBottom: styles?.marginBottom || '8px',
    margin: styles?.margin,
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    borderRadius: themeConfig.container.borderRadius,
    overflow: 'hidden',
    position: 'relative',
    transition: themeConfig.transition,
    backgroundColor: themeConfig.container.backgroundColor,
    borderWidth: themeConfig.container.borderWidth,
    borderStyle: themeConfig.container.borderStyle,
    borderColor: themeConfig.container.borderColor,
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
        backgroundColor: themeConfig.containerExpanded.backgroundColor,
        borderColor: themeConfig.containerExpanded.borderColor,
        backgroundImage: themeConfig.containerExpanded.backgroundImage,
      }),
    ...(isDisabled && {
      opacity: isSacredTheme ? 0.6 : 0.8,
      backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.8)' : '#f8f8f8',
      borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.1)' : undefined,
    }),
    ...(styles?.outline === false && {
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      boxShadow: 'none',
    }),
  }

  // Base summary styles with level-based indentation
  const summaryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: styles?.summaryPadding || `4px 16px 4px ${levelIndent}px`,
    height: '32px',
    maxHeight: '32px',
    minWidth: 'fit-content',
    transition: themeConfig.transition,
    position: 'relative',
    backgroundColor: themeConfig.summary.backgroundColor,
    color: themeConfig.summary.color,
    fontFamily: themeConfig.summary.fontFamily,
    fontWeight: themeConfig.summary.fontWeight,
    fontSize: themeConfig.summary.fontSize,
    letterSpacing: themeConfig.summary.letterSpacing,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    minHeight: themeConfig.summary.minHeight,
    borderBottom: themeConfig.summary.borderBottom,
    textShadow: themeConfig.summary.textShadow,
    whiteSpace: 'nowrap',
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
        borderBottom: `1px solid ${themeConfig.summaryExpanded.borderBottomColor}`,
        color: themeConfig.summaryExpanded.color,
        fontWeight: themeConfig.summaryExpanded.fontWeight,
        textShadow: themeConfig.summaryExpanded.textShadow,
      }),
    ...(isDisabled && {
      opacity: 1,
      color: isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#666',
      cursor: 'not-allowed',
    }),
  }

  // Base details styles
  const detailsStyle: React.CSSProperties = {
    padding: styles?.detailsPadding || '16px',
    position: 'relative',
    backgroundColor: themeConfig.details.backgroundColor,
    borderTop: themeConfig.details.borderTop,
    color: themeConfig.details.color,
    fontFamily: themeConfig.details.fontFamily,
    fontSize: themeConfig.details.fontSize,
    lineHeight: themeConfig.details.lineHeight,
    backdropFilter: themeConfig.details.backdropFilter,
    ...(styles?.outline === false && { borderTop: 'none' }),
  }

  // Base icon styles
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
    ...(isDisabled && {
      color: isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#999',
    }),
  }

  return {
    container: containerStyle,
    summary: summaryStyle,
    details: detailsStyle,
    icon: iconStyle,
    responsive: {
      mobile: {
        container: getResponsiveStyles(themeConfig, 'mobile'),
        summary: getResponsiveSummaryStyles(themeConfig, 'mobile'),
        details: getResponsiveDetailsStyles(themeConfig, 'mobile'),
      },
      tablet: {
        container: getResponsiveStyles(themeConfig, 'tablet'),
        summary: getResponsiveSummaryStyles(themeConfig, 'tablet'),
        details: getResponsiveDetailsStyles(themeConfig, 'tablet'),
      },
      desktop: {
        container: getResponsiveStyles(themeConfig, 'desktop'),
        summary: getResponsiveSummaryStyles(themeConfig, 'desktop'),
        details: getResponsiveDetailsStyles(themeConfig, 'desktop'),
      },
    },
  }
}

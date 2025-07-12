// --------------------------------------------------------------------------
// PRICING TABLE THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface PricingTableTheme {
  container: {
    background: string
    border: string
    borderTop: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
  }
  header: {
    background: string
    borderBottom: string
    backgroundImage?: string
  }
  title: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    animation?: string
    textShadow?: string
  }
  price: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
  }
  annualPrice: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    fontStyle: string
    letterSpacing: string
    textShadow?: string
  }
  featureTitle: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
  }
  subFeatureTitle: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
  }
  buttonSection: {
    background: string
    borderTop: string
    backgroundImage?: string
  }
  checkIcon: {
    color: string
    filter?: string
    animation?: string
  }
  glyph: {
    color: string
    fontSize: string
    animation?: string
  }
  transition: string
}

export interface PricingTableStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderTopColor?: string
  borderRadius?: string
  borderWidth?: string
  borderTopWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string

  // Header styling
  headerBackground?: string
  headerBorderBottom?: string
  headerBackgroundImage?: string

  // Title styling
  titleColor?: string
  titleFontSize?: string
  titleFontFamily?: string
  titleFontWeight?: string | number
  titleLetterSpacing?: string
  titleAnimation?: string
  titleTextShadow?: string

  // Price styling
  priceColor?: string
  priceFontSize?: string
  priceFontFamily?: string
  priceFontWeight?: string | number
  priceLetterSpacing?: string
  priceTextShadow?: string

  // Annual price styling
  annualPriceColor?: string
  annualPriceFontSize?: string
  annualPriceFontFamily?: string
  annualPriceFontWeight?: string | number
  annualPriceFontStyle?: string
  annualPriceLetterSpacing?: string
  annualPriceTextShadow?: string

  // Feature styling
  featureTitleColor?: string
  featureTitleFontSize?: string
  featureTitleFontFamily?: string
  featureTitleFontWeight?: string | number
  featureTitleLetterSpacing?: string
  featureTitleTextShadow?: string

  // Sub-feature styling
  subFeatureTitleColor?: string
  subFeatureTitleFontSize?: string
  subFeatureTitleFontFamily?: string
  subFeatureTitleFontWeight?: string | number
  subFeatureTitleLetterSpacing?: string
  subFeatureTitleTextShadow?: string

  // Button section styling
  buttonSectionBackground?: string
  buttonSectionBorderTop?: string
  buttonSectionBackgroundImage?: string

  // Icon styling
  checkIconColor?: string
  checkIconFilter?: string
  checkIconAnimation?: string

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphAnimation?: string

  // Layout and spacing
  padding?: string
  headerPadding?: string
  featuresPadding?: string
  buttonPadding?: string
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
  height?: string
  maxHeight?: string
  minHeight?: string
}

export const pricingTableThemes: Record<
  'light' | 'dark' | 'sacred',
  PricingTableTheme
> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderTop: '12px solid #00B8D4',
      borderRadius: '0.375rem',
      boxShadow: SHADOWS.light.medium,
      backdropFilter: 'blur(8px)',
    },
    header: {
      background: 'rgba(248, 250, 252, 0.8)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    },
    title: {
      color: 'rgb(31, 41, 55)',
      fontSize: '1.125rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    price: {
      color: 'rgb(31, 41, 55)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0',
    },
    annualPrice: {
      color: 'rgb(107, 114, 128)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '400',
      fontStyle: 'italic',
      letterSpacing: '0',
    },
    featureTitle: {
      color: 'rgb(31, 41, 55)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0',
    },
    subFeatureTitle: {
      color: 'rgb(55, 65, 81)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '400',
      letterSpacing: '0',
    },
    buttonSection: {
      background: 'rgba(248, 250, 252, 0.5)',
      borderTop: '1px solid rgba(226, 232, 240, 0.8)',
    },
    checkIcon: {
      color: 'rgb(34, 197, 94)',
      filter: 'drop-shadow(0 1px 2px rgba(34, 197, 94, 0.3))',
    },
    glyph: {
      color: 'rgba(107, 114, 128, 0.3)',
      fontSize: '1.5rem',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      borderTop: '12px solid #00B8D4',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    },
    header: {
      background: 'rgba(17, 24, 39, 0.8)',
      borderBottom: '1px solid rgba(75, 85, 99, 0.8)',
    },
    title: {
      color: 'rgb(243, 244, 246)',
      fontSize: '1.125rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    price: {
      color: 'rgb(209, 213, 219)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0',
    },
    annualPrice: {
      color: 'rgb(156, 163, 175)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '400',
      fontStyle: 'italic',
      letterSpacing: '0',
    },
    featureTitle: {
      color: 'rgb(209, 213, 219)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
      letterSpacing: '0',
    },
    subFeatureTitle: {
      color: 'rgb(156, 163, 175)',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '400',
      letterSpacing: '0',
    },
    buttonSection: {
      background: 'rgba(17, 24, 39, 0.8)',
      borderTop: '1px solid rgba(75, 85, 99, 0.8)',
    },
    checkIcon: {
      color: 'rgb(74, 222, 128)',
      filter: 'drop-shadow(0 1px 2px rgba(74, 222, 128, 0.3))',
    },
    glyph: {
      color: 'rgba(156, 163, 175, 0.3)',
      fontSize: '1.5rem',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(28, 25, 23, 0.95)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderTop: '12px solid #FFD700',
      borderRadius: '0.375rem',
      boxShadow: SHADOWS.sacred.large,
      backdropFilter: 'blur(8px)',
      backgroundImage: `
        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
      `,
    },
    header: {
      background: 'rgba(255, 215, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent)',
    },
    title: {
      color: '#FFD700',
      fontSize: '1.125rem',
      fontFamily: '"Cinzel", serif',
      fontWeight: '600',
      letterSpacing: '0.05em',
      animation: 'sacred-glow 1.5s infinite alternate',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    },
    price: {
      color: '#FFD700',
      fontSize: '1rem',
      fontFamily: '"Cinzel", serif',
      fontWeight: '500',
      letterSpacing: '0.025em',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.5)',
    },
    annualPrice: {
      color: 'rgba(255, 215, 0, 0.8)',
      fontSize: '1rem',
      fontFamily: '"Cinzel", serif',
      fontWeight: '400',
      fontStyle: 'italic',
      letterSpacing: '0.025em',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.4)',
    },
    featureTitle: {
      color: '#FFD700',
      fontSize: '1rem',
      fontFamily: '"Merriweather", serif',
      fontWeight: '500',
      letterSpacing: '0.025em',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.5)',
    },
    subFeatureTitle: {
      color: 'rgba(255, 215, 0, 0.9)',
      fontSize: '1rem',
      fontFamily: '"Merriweather", serif',
      fontWeight: '400',
      letterSpacing: '0.025em',
      textShadow: '0 0 2px rgba(255, 215, 0, 0.3)',
    },
    buttonSection: {
      background: 'rgba(255, 215, 0, 0.05)',
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(to top, rgba(255, 215, 0, 0.05), transparent)',
    },
    checkIcon: {
      color: '#FFD700',
      filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))',
      animation: 'sacred-float 2s infinite',
    },
    glyph: {
      color: 'rgba(255, 215, 0, 0.2)',
      fontSize: '1.5rem',
      animation: 'glyph-rotate 20s linear infinite',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getPricingTableTheme = (
  styles?: PricingTableStyles
): PricingTableTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = pricingTableThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderTop: styles.borderTopColor
        ? `${styles.borderTopWidth || '12px'} solid ${styles.borderTopColor}`
        : baseTheme.container.borderTop,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
    },
    header: {
      background: styles.headerBackground || baseTheme.header.background,
      borderBottom: styles.headerBorderBottom || baseTheme.header.borderBottom,
      backgroundImage:
        styles.headerBackgroundImage || baseTheme.header.backgroundImage,
    },
    title: {
      color: styles.titleColor || baseTheme.title.color,
      fontSize: styles.titleFontSize || baseTheme.title.fontSize,
      fontFamily: styles.titleFontFamily || baseTheme.title.fontFamily,
      fontWeight: styles.titleFontWeight || baseTheme.title.fontWeight,
      letterSpacing: styles.titleLetterSpacing || baseTheme.title.letterSpacing,
      animation: styles.titleAnimation || baseTheme.title.animation,
      textShadow: styles.titleTextShadow || baseTheme.title.textShadow,
    },
    price: {
      color: styles.priceColor || baseTheme.price.color,
      fontSize: styles.priceFontSize || baseTheme.price.fontSize,
      fontFamily: styles.priceFontFamily || baseTheme.price.fontFamily,
      fontWeight: styles.priceFontWeight || baseTheme.price.fontWeight,
      letterSpacing: styles.priceLetterSpacing || baseTheme.price.letterSpacing,
      textShadow: styles.priceTextShadow || baseTheme.price.textShadow,
    },
    annualPrice: {
      color: styles.annualPriceColor || baseTheme.annualPrice.color,
      fontSize: styles.annualPriceFontSize || baseTheme.annualPrice.fontSize,
      fontFamily:
        styles.annualPriceFontFamily || baseTheme.annualPrice.fontFamily,
      fontWeight:
        styles.annualPriceFontWeight || baseTheme.annualPrice.fontWeight,
      fontStyle: styles.annualPriceFontStyle || baseTheme.annualPrice.fontStyle,
      letterSpacing:
        styles.annualPriceLetterSpacing || baseTheme.annualPrice.letterSpacing,
      textShadow:
        styles.annualPriceTextShadow || baseTheme.annualPrice.textShadow,
    },
    featureTitle: {
      color: styles.featureTitleColor || baseTheme.featureTitle.color,
      fontSize: styles.featureTitleFontSize || baseTheme.featureTitle.fontSize,
      fontFamily:
        styles.featureTitleFontFamily || baseTheme.featureTitle.fontFamily,
      fontWeight:
        styles.featureTitleFontWeight || baseTheme.featureTitle.fontWeight,
      letterSpacing:
        styles.featureTitleLetterSpacing ||
        baseTheme.featureTitle.letterSpacing,
      textShadow:
        styles.featureTitleTextShadow || baseTheme.featureTitle.textShadow,
    },
    subFeatureTitle: {
      color: styles.subFeatureTitleColor || baseTheme.subFeatureTitle.color,
      fontSize:
        styles.subFeatureTitleFontSize || baseTheme.subFeatureTitle.fontSize,
      fontFamily:
        styles.subFeatureTitleFontFamily ||
        baseTheme.subFeatureTitle.fontFamily,
      fontWeight:
        styles.subFeatureTitleFontWeight ||
        baseTheme.subFeatureTitle.fontWeight,
      letterSpacing:
        styles.subFeatureTitleLetterSpacing ||
        baseTheme.subFeatureTitle.letterSpacing,
      textShadow:
        styles.subFeatureTitleTextShadow ||
        baseTheme.subFeatureTitle.textShadow,
    },
    buttonSection: {
      background:
        styles.buttonSectionBackground || baseTheme.buttonSection.background,
      borderTop:
        styles.buttonSectionBorderTop || baseTheme.buttonSection.borderTop,
      backgroundImage:
        styles.buttonSectionBackgroundImage ||
        baseTheme.buttonSection.backgroundImage,
    },
    checkIcon: {
      color: styles.checkIconColor || baseTheme.checkIcon.color,
      filter: styles.checkIconFilter || baseTheme.checkIcon.filter,
      animation: styles.checkIconAnimation || baseTheme.checkIcon.animation,
    },
    glyph: {
      color: styles.glyphColor || baseTheme.glyph.color,
      fontSize: styles.glyphFontSize || baseTheme.glyph.fontSize,
      animation: styles.glyphAnimation || baseTheme.glyph.animation,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getPricingTableStyles = (
  styles?: PricingTableStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getPricingTableTheme(styles)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    width: styles?.width || '100%',
    flexDirection: 'column',
    height: styles?.height || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    background: themeConfig.container.background,
    border: themeConfig.container.border,
    borderTop: themeConfig.container.borderTop,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    backgroundImage: themeConfig.container.backgroundImage,
    position: 'relative',
    overflow: 'hidden',
    transition: themeConfig.transition,
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: styles?.headerPadding || '1rem',
    background: themeConfig.header.background,
    borderBottom: themeConfig.header.borderBottom,
    backgroundImage: themeConfig.header.backgroundImage,
  }

  const titleStyle: React.CSSProperties = {
    color: themeConfig.title.color,
    fontSize: themeConfig.title.fontSize,
    fontFamily: themeConfig.title.fontFamily,
    fontWeight: themeConfig.title.fontWeight,
    letterSpacing: themeConfig.title.letterSpacing,
    animation: themeConfig.title.animation,
    textShadow: themeConfig.title.textShadow,
    margin: 0,
  }

  const priceStyle: React.CSSProperties = {
    color: themeConfig.price.color,
    fontSize: themeConfig.price.fontSize,
    fontFamily: themeConfig.price.fontFamily,
    fontWeight: themeConfig.price.fontWeight,
    letterSpacing: themeConfig.price.letterSpacing,
    textShadow: themeConfig.price.textShadow,
  }

  const annualPriceStyle: React.CSSProperties = {
    color: themeConfig.annualPrice.color,
    fontSize: themeConfig.annualPrice.fontSize,
    fontFamily: themeConfig.annualPrice.fontFamily,
    fontWeight: themeConfig.annualPrice.fontWeight,
    fontStyle: themeConfig.annualPrice.fontStyle as any,
    letterSpacing: themeConfig.annualPrice.letterSpacing,
    textShadow: themeConfig.annualPrice.textShadow,
  }

  const featuresSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: styles?.featuresPadding || '1rem',
  }

  const featureItemStyle: React.CSSProperties = {
    marginBottom: '1rem',
  }

  const featureTitleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  }

  const featureTitleStyle: React.CSSProperties = {
    color: themeConfig.featureTitle.color,
    fontSize: themeConfig.featureTitle.fontSize,
    fontFamily: themeConfig.featureTitle.fontFamily,
    fontWeight: themeConfig.featureTitle.fontWeight,
    letterSpacing: themeConfig.featureTitle.letterSpacing,
    textShadow: themeConfig.featureTitle.textShadow,
  }

  const iconContainerStyle: React.CSSProperties = {
    marginLeft: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  }

  const subFeatureContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '1.5rem',
    marginTop: '0.5rem',
  }

  const subFeatureTitleStyle: React.CSSProperties = {
    color: themeConfig.subFeatureTitle.color,
    fontSize: themeConfig.subFeatureTitle.fontSize,
    fontFamily: themeConfig.subFeatureTitle.fontFamily,
    fontWeight: themeConfig.subFeatureTitle.fontWeight,
    letterSpacing: themeConfig.subFeatureTitle.letterSpacing,
    textShadow: themeConfig.subFeatureTitle.textShadow,
  }

  const buttonSectionStyle: React.CSSProperties = {
    padding: styles?.buttonPadding || '1rem',
    background: themeConfig.buttonSection.background,
    borderTop: themeConfig.buttonSection.borderTop,
    backgroundImage: themeConfig.buttonSection.backgroundImage,
  }

  const checkIconStyle: React.CSSProperties = {
    color: themeConfig.checkIcon.color,
    filter: themeConfig.checkIcon.filter,
    animation: themeConfig.checkIcon.animation,
  }

  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    color: themeConfig.glyph.color,
    fontSize: themeConfig.glyph.fontSize,
    animation: themeConfig.glyph.animation,
  }

  const sacredFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.25rem',
    paddingBottom: '0.25rem',
  }

  const sacredFooterGlyphStyle: React.CSSProperties = {
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '0.75rem',
    animation: 'sacred-float 3s infinite ease-in-out',
  }

  return {
    container: containerStyle,
    header: headerStyle,
    title: titleStyle,
    price: priceStyle,
    annualPrice: annualPriceStyle,
    featuresSection: featuresSectionStyle,
    featureItem: featureItemStyle,
    featureTitleContainer: featureTitleContainerStyle,
    featureTitle: featureTitleStyle,
    iconContainer: iconContainerStyle,
    subFeatureContainer: subFeatureContainerStyle,
    subFeatureTitle: subFeatureTitleStyle,
    buttonSection: buttonSectionStyle,
    checkIcon: checkIconStyle,
    glyph: glyphStyle,
    sacredFooter: sacredFooterStyle,
    sacredFooterGlyph: sacredFooterGlyphStyle,
  }
}

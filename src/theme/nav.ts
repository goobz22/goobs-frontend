// --------------------------------------------------------------------------
// NAV THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'

export interface NavTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
    color: string
    minWidth: string
    width: string
    height: string
    padding: string
    overflow: string
  }
  contentContainer: {
    position: string
    height: string
    overflow: string
    minWidth: string
  }
  navList: {
    position: string
    zIndex: number
    height: string
    overflowY: string
    overflowX: string
    padding: string
    boxSizing: string
    minWidth: string
    scrollbarWidth?: string
    scrollbarColor?: string
  }
  titleContainer: {
    textAlign: string
    padding: string
    position: string
    whiteSpace: string
    minWidth: string
  }
  titleLink: {
    textDecoration: string
    color: string
  }
  searchContainer: {
    position: string
    zIndex: number
    minHeight: string
    whiteSpace: string
    marginTop: string
    paddingLeft: string
    minWidth: string
  }
  divider: {
    width: string
    height: string
    backgroundColor: string
    marginTop: string
    marginBottom: string
    minWidth: string
  }
  // Sacred theme specific styles
  sacredTitleContainer: {
    textAlign: string
    padding: string
    position: string
    whiteSpace: string
    minWidth: string
  }
  sacredTitleHeader: {
    display: string
    alignItems: string
    justifyContent: string
    marginBottom: string
    gap: string
  }
  sacredTitleHeaderLine: {
    width: string
    height: string
    background: string
  }
  sacredTitleHeaderGlyph: {
    color: string
    fontSize: string
    animation: string
  }
  sacredTitleMain: {
    color: string
    fontSize: string
    fontWeight: string | number
    letterSpacing: string
    textTransform: string
    animation: string
    fontFamily: string
    cursor: string
    transition: string
    whiteSpace: string
  }
  sacredTitleMainHover: {
    transform: string
    textShadow: string
  }
  sacredSubtitle: {
    color: string
    fontSize: string
    fontStyle: string
    marginTop: string
    letterSpacing: string
    whiteSpace: string
  }
  sacredGlyphsContainer: {
    display: string
    justifyContent: string
    gap: string
    marginTop: string
  }
  sacredGlyph: {
    color: string
    fontSize: string
  }
  sacredDivider: {
    display: string
    alignItems: string
    justifyContent: string
    padding: string
    marginBottom: string
    minWidth: string
  }
  sacredDividerLine: {
    width: string
    height: string
    background: string
  }
  sacredDividerGlyph: {
    color: string
    fontSize: string
    padding: string
    animation: string
  }
  sacredFooter: {
    textAlign: string
    padding: string
  }
  sacredFooterText: {
    color: string
    fontSize: string
    fontStyle: string
    letterSpacing: string
    marginBottom: string
  }
  sacredFooterGlyphs: {
    display: string
    justifyContent: string
    gap: string
  }
  sacredFooterGlyph: {
    color: string
    fontSize: string
  }
  transition: string
}

export interface NavStyles {
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
  color?: string
  minWidth?: string
  width?: string
  height?: string
  padding?: string
  overflow?: string

  // Layout and positioning
  anchor?: 'left' | 'right'
  variant?: 'temporary' | 'permanent'
  spacingFromTopOfScreen?: string

  // Title styling
  showTitle?: boolean
  titleBackgroundColor?: string
  titleColor?: string
  titleFontFamily?: string
  titleFontSize?: string
  titleFontWeight?: string | number
  titleLetterSpacing?: string
  titleTextAlign?: string
  titlePadding?: string
  titleMarginTop?: string
  titleMarginBottom?: string
  titleWhiteSpace?: string
  titleMinWidth?: string
  titleUrl?: string

  // Sacred title styling
  sacredTitle?: string
  sacredSubtitle?: string
  sacredTitleColor?: string
  sacredTitleFontSize?: string
  sacredTitleFontWeight?: string | number
  sacredTitleLetterSpacing?: string
  sacredTitleAnimation?: string
  sacredTitleFontFamily?: string
  sacredSubtitleColor?: string
  sacredSubtitleFontSize?: string
  sacredSubtitleFontStyle?: string
  sacredSubtitleLetterSpacing?: string

  // Search container styling
  showSearchableNav?: boolean
  searchContainerPosition?: string
  searchContainerZIndex?: number
  searchContainerMinHeight?: string
  searchContainerWhiteSpace?: string
  searchContainerMarginTop?: string
  searchContainerPaddingLeft?: string
  searchContainerMinWidth?: string
  searchableNavLabel?: string

  // Divider styling
  showLine?: boolean
  dividerWidth?: string
  dividerHeight?: string
  dividerBackgroundColor?: string
  dividerMarginTop?: string
  dividerMarginBottom?: string
  dividerMinWidth?: string

  // Sacred divider styling
  sacredDividerDisplay?: string
  sacredDividerAlignItems?: string
  sacredDividerJustifyContent?: string
  sacredDividerPadding?: string
  sacredDividerMarginBottom?: string
  sacredDividerMinWidth?: string

  // Navigation list styling
  navListPosition?: string
  navListZIndex?: number
  navListHeight?: string
  navListOverflowY?: string
  navListOverflowX?: string
  navListPadding?: string
  navListBoxSizing?: string
  navListMinWidth?: string
  navListScrollbarWidth?: string
  navListScrollbarColor?: string

  // Sacred footer styling
  sacredFooterDisplay?: boolean
  sacredFooterTextAlign?: string
  sacredFooterPadding?: string
  sacredFooterTextColor?: string
  sacredFooterTextFontSize?: string
  sacredFooterTextFontStyle?: string
  sacredFooterTextLetterSpacing?: string
  sacredFooterTextMarginBottom?: string
  sacredFooterGlyphsDisplay?: string
  sacredFooterGlyphsJustifyContent?: string
  sacredFooterGlyphsGap?: string
  sacredFooterGlyphColor?: string
  sacredFooterGlyphFontSize?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // Mobile responsiveness
  mobileOpen?: boolean
  onClose?: () => void

  // Navigation items
  items?: any[]
  router?: { push: (route: string) => void }
  pathname?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
}

export const navThemes: Record<'light' | 'dark' | 'sacred', NavTheme> = {
  light: {
    container: {
      background: '#F3F4F6',
      border: 'none',
      borderRadius: '0px',
      boxShadow: 'none',
      backdropFilter: 'none',
      color: 'inherit',
      minWidth: '320px',
      width: 'fit-content',
      height: '100vh',
      padding: '17px 0 0 0',
      overflow: 'visible',
    },
    contentContainer: {
      position: 'relative',
      height: '100%',
      overflow: 'visible',
      minWidth: 'fit-content',
    },
    navList: {
      position: 'relative',
      zIndex: 1,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'visible',
      padding: '0 15px',
      boxSizing: 'border-box',
      minWidth: 'fit-content',
    },
    titleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    titleLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    searchContainer: {
      position: 'relative',
      zIndex: 1000,
      minHeight: '40px',
      whiteSpace: 'nowrap',
      marginTop: '0',
      paddingLeft: '10px',
      minWidth: 'fit-content',
    },
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: 'white',
      marginTop: '20px',
      marginBottom: '8px',
      minWidth: '280px',
    },
    sacredTitleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    sacredTitleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      gap: '8px',
    },
    sacredTitleHeaderLine: {
      width: '40px',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
    },
    sacredTitleHeaderGlyph: {
      color: '#FFD700',
      fontSize: '16px',
      animation: 'nav-rotate-glyph 20s linear infinite',
    },
    sacredTitleMain: {
      color: '#FFD700',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      animation: 'nav-glow-pulse 3s ease-in-out infinite',
      fontFamily: '"Cinzel", serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
    },
    sacredTitleMainHover: {
      transform: 'scale(1.05)',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
    },
    sacredSubtitle: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontSize: '12px',
      fontStyle: 'italic',
      marginTop: '4px',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    },
    sacredGlyphsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      marginTop: '4px',
    },
    sacredGlyph: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
    },
    sacredDivider: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      marginBottom: '-12px',
      minWidth: '280px',
    },
    sacredDividerLine: {
      width: '30%',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
    },
    sacredDividerGlyph: {
      color: '#FFD700',
      fontSize: '14px',
      padding: '0 8px',
      animation: 'nav-rotate-glyph 15s linear infinite reverse',
    },
    sacredFooter: {
      textAlign: 'center',
      padding: '24px 16px',
    },
    sacredFooterText: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
      fontStyle: 'italic',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    sacredFooterGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },
    sacredFooterGlyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '12px',
    },
    transition: 'all 0.3s ease',
  },
  dark: {
    container: {
      background: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      color: '#ffffff',
      minWidth: '320px',
      width: 'fit-content',
      height: '100vh',
      padding: '17px 0 0 0',
      overflow: 'visible',
    },
    contentContainer: {
      position: 'relative',
      height: '100%',
      overflow: 'visible',
      minWidth: 'fit-content',
    },
    navList: {
      position: 'relative',
      zIndex: 1,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'visible',
      padding: '0 15px',
      boxSizing: 'border-box',
      minWidth: 'fit-content',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.3)',
    },
    titleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    titleLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    searchContainer: {
      position: 'relative',
      zIndex: 1000,
      minHeight: '40px',
      whiteSpace: 'nowrap',
      marginTop: '0',
      paddingLeft: '10px',
      minWidth: 'fit-content',
    },
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginTop: '20px',
      marginBottom: '8px',
      minWidth: '280px',
    },
    sacredTitleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    sacredTitleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      gap: '8px',
    },
    sacredTitleHeaderLine: {
      width: '40px',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
    },
    sacredTitleHeaderGlyph: {
      color: '#FFD700',
      fontSize: '16px',
      animation: 'nav-rotate-glyph 20s linear infinite',
    },
    sacredTitleMain: {
      color: '#FFD700',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      animation: 'nav-glow-pulse 3s ease-in-out infinite',
      fontFamily: '"Cinzel", serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
    },
    sacredTitleMainHover: {
      transform: 'scale(1.05)',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
    },
    sacredSubtitle: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontSize: '12px',
      fontStyle: 'italic',
      marginTop: '4px',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    },
    sacredGlyphsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      marginTop: '4px',
    },
    sacredGlyph: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
    },
    sacredDivider: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      marginBottom: '-12px',
      minWidth: '280px',
    },
    sacredDividerLine: {
      width: '30%',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
    },
    sacredDividerGlyph: {
      color: '#FFD700',
      fontSize: '14px',
      padding: '0 8px',
      animation: 'nav-rotate-glyph 15s linear infinite reverse',
    },
    sacredFooter: {
      textAlign: 'center',
      padding: '24px 16px',
    },
    sacredFooterText: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
      fontStyle: 'italic',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    sacredFooterGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },
    sacredFooterGlyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '12px',
    },
    transition: 'all 0.3s ease',
  },
  sacred: {
    container: {
      background: '#0a0a0a',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '0px',
      boxShadow:
        '0 0 30px rgba(255, 215, 0, 0.1), inset 0 0 60px rgba(255, 215, 0, 0.03)',
      backdropFilter: 'blur(10px)',
      backgroundImage:
        'linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)), radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
      color: '#FFD700',
      minWidth: '320px',
      width: 'fit-content',
      height: '100vh',
      padding: '17px 0 0 0',
      overflow: 'visible',
    },
    contentContainer: {
      position: 'relative',
      height: '100%',
      overflow: 'visible',
      minWidth: 'fit-content',
    },
    navList: {
      position: 'relative',
      zIndex: 1,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'visible',
      padding: '0 15px',
      boxSizing: 'border-box',
      minWidth: 'fit-content',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 215, 0, 0.5) rgba(0, 0, 0, 0.3)',
    },
    titleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    titleLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    searchContainer: {
      position: 'relative',
      zIndex: 1000,
      minHeight: '40px',
      whiteSpace: 'nowrap',
      marginTop: '0',
      paddingLeft: '10px',
      minWidth: 'fit-content',
    },
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
      marginTop: '20px',
      marginBottom: '8px',
      minWidth: '280px',
    },
    sacredTitleContainer: {
      textAlign: 'center',
      padding: '8px 8px',
      position: 'relative',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content',
    },
    sacredTitleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      gap: '8px',
    },
    sacredTitleHeaderLine: {
      width: '40px',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, #FFD700, transparent)',
    },
    sacredTitleHeaderGlyph: {
      color: '#FFD700',
      fontSize: '16px',
      animation: 'nav-rotate-glyph 20s linear infinite',
    },
    sacredTitleMain: {
      color: '#FFD700',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      animation: 'nav-glow-pulse 3s ease-in-out infinite',
      fontFamily: '"Cinzel", serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
    },
    sacredTitleMainHover: {
      transform: 'scale(1.05)',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
    },
    sacredSubtitle: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontSize: '12px',
      fontStyle: 'italic',
      marginTop: '4px',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    },
    sacredGlyphsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      marginTop: '4px',
    },
    sacredGlyph: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
    },
    sacredDivider: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      marginBottom: '-12px',
      minWidth: '280px',
    },
    sacredDividerLine: {
      width: '30%',
      height: '1px',
      background:
        'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
    },
    sacredDividerGlyph: {
      color: '#FFD700',
      fontSize: '14px',
      padding: '0 8px',
      animation: 'nav-rotate-glyph 15s linear infinite reverse',
    },
    sacredFooter: {
      textAlign: 'center',
      padding: '24px 16px',
    },
    sacredFooterText: {
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '10px',
      fontStyle: 'italic',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    sacredFooterGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },
    sacredFooterGlyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '12px',
    },
    transition: 'all 0.3s ease',
  },
}

// Theme selector function
export const getNavTheme = (styles?: NavStyles): NavTheme => {
  const baseTheme = navThemes[styles?.theme || 'light']
  const computedBackgroundImage =
    styles?.backgroundImage ?? baseTheme.container.backgroundImage

  return {
    ...baseTheme,
    container: {
      ...baseTheme.container,
      background: styles?.backgroundColor || baseTheme.container.background,
      border: styles?.borderColor
        ? `1px solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles?.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles?.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles?.backdropFilter || baseTheme.container.backdropFilter,
      ...(computedBackgroundImage !== undefined
        ? { backgroundImage: computedBackgroundImage }
        : {}),
      color: styles?.color || baseTheme.container.color,
      minWidth: styles?.minWidth || baseTheme.container.minWidth,
      width: styles?.width || baseTheme.container.width,
      height: styles?.height || baseTheme.container.height,
      padding: styles?.padding || baseTheme.container.padding,
      overflow: styles?.overflow || baseTheme.container.overflow,
    },
    // Override specific styles based on the styles prop
    titleContainer: {
      ...baseTheme.titleContainer,
      textAlign:
        (styles?.titleTextAlign as any) || baseTheme.titleContainer.textAlign,
      padding: styles?.titlePadding || baseTheme.titleContainer.padding,
    },
    divider: {
      ...baseTheme.divider,
      backgroundColor:
        styles?.dividerBackgroundColor || baseTheme.divider.backgroundColor,
      width: styles?.dividerWidth || baseTheme.divider.width,
      height: styles?.dividerHeight || baseTheme.divider.height,
      marginTop: styles?.dividerMarginTop || baseTheme.divider.marginTop,
      marginBottom:
        styles?.dividerMarginBottom || baseTheme.divider.marginBottom,
      minWidth: styles?.dividerMinWidth || baseTheme.divider.minWidth,
    },
    sacredTitleMain: {
      ...baseTheme.sacredTitleMain,
      color: styles?.sacredTitleColor || baseTheme.sacredTitleMain.color,
      fontSize:
        styles?.sacredTitleFontSize || baseTheme.sacredTitleMain.fontSize,
      fontWeight:
        styles?.sacredTitleFontWeight || baseTheme.sacredTitleMain.fontWeight,
      letterSpacing:
        styles?.sacredTitleLetterSpacing ||
        baseTheme.sacredTitleMain.letterSpacing,
      animation:
        styles?.sacredTitleAnimation || baseTheme.sacredTitleMain.animation,
      fontFamily:
        styles?.sacredTitleFontFamily || baseTheme.sacredTitleMain.fontFamily,
    },
    sacredSubtitle: {
      ...baseTheme.sacredSubtitle,
      color: styles?.sacredSubtitleColor || baseTheme.sacredSubtitle.color,
      fontSize:
        styles?.sacredSubtitleFontSize || baseTheme.sacredSubtitle.fontSize,
      fontStyle:
        styles?.sacredSubtitleFontStyle || baseTheme.sacredSubtitle.fontStyle,
      letterSpacing:
        styles?.sacredSubtitleLetterSpacing ||
        baseTheme.sacredSubtitle.letterSpacing,
    },
  }
}

// Sacred glyphs for animations
export const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

// Main style generator function
export const getNavStyles = (styles?: NavStyles, titleHover?: boolean) => {
  const themeConfig = getNavTheme(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  // Container styles
  const containerStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: themeConfig.container.background,
    color: themeConfig.container.color,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    backgroundImage: themeConfig.container.backgroundImage,
    minWidth: themeConfig.container.minWidth,
    width: themeConfig.container.width,
    padding: themeConfig.container.padding,
    overflow: themeConfig.container.overflow,
    transition: themeConfig.transition,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
  }

  // Content container styles
  const contentContainerStyle: React.CSSProperties = {
    position: themeConfig.contentContainer.position as any,
    height: themeConfig.contentContainer.height,
    overflow: themeConfig.contentContainer.overflow,
    minWidth: themeConfig.contentContainer.minWidth,
  }

  // Nav list styles
  const navListStyle: React.CSSProperties = {
    position: themeConfig.navList.position as any,
    zIndex: themeConfig.navList.zIndex,
    height: themeConfig.navList.height,
    overflowY: themeConfig.navList.overflowY as any,
    overflowX: themeConfig.navList.overflowX as any,
    padding: themeConfig.navList.padding,
    boxSizing: themeConfig.navList.boxSizing as any,
    minWidth: themeConfig.navList.minWidth,
    ...(isSacredTheme && {
      scrollbarWidth: themeConfig.navList.scrollbarWidth as any,
      scrollbarColor: themeConfig.navList.scrollbarColor as any,
    }),
  }

  // Title container styles
  const titleContainerStyle: React.CSSProperties = {
    textAlign: themeConfig.titleContainer.textAlign as any,
    padding: themeConfig.titleContainer.padding,
    position: themeConfig.titleContainer.position as any,
    whiteSpace: themeConfig.titleContainer.whiteSpace as any,
    minWidth: themeConfig.titleContainer.minWidth,
    marginTop: styles?.titleMarginTop,
    marginBottom: styles?.titleMarginBottom,
  }

  // Title link styles
  const titleLinkStyle: React.CSSProperties = {
    textDecoration: themeConfig.titleLink.textDecoration,
    color: themeConfig.titleLink.color,
  }

  // Search container styles
  const searchContainerStyle: React.CSSProperties = {
    position: themeConfig.searchContainer.position as any,
    zIndex: themeConfig.searchContainer.zIndex,
    minHeight: themeConfig.searchContainer.minHeight,
    whiteSpace: themeConfig.searchContainer.whiteSpace as any,
    marginTop: themeConfig.searchContainer.marginTop,
    paddingLeft: themeConfig.searchContainer.paddingLeft,
    minWidth: themeConfig.searchContainer.minWidth,
  }

  // Divider styles
  const dividerStyle: React.CSSProperties = {
    width: themeConfig.divider.width,
    height: themeConfig.divider.height,
    backgroundColor: themeConfig.divider.backgroundColor,
    marginTop: themeConfig.divider.marginTop,
    marginBottom: themeConfig.divider.marginBottom,
    minWidth: themeConfig.divider.minWidth,
  }

  // Sacred specific styles
  const sacredTitleContainerStyle: React.CSSProperties = {
    textAlign: themeConfig.sacredTitleContainer.textAlign as any,
    padding: themeConfig.sacredTitleContainer.padding,
    position: themeConfig.sacredTitleContainer.position as any,
    whiteSpace: themeConfig.sacredTitleContainer.whiteSpace as any,
    minWidth: themeConfig.sacredTitleContainer.minWidth,
  }

  const sacredTitleHeaderStyle: React.CSSProperties = {
    display: themeConfig.sacredTitleHeader.display,
    alignItems: themeConfig.sacredTitleHeader.alignItems,
    justifyContent: themeConfig.sacredTitleHeader.justifyContent,
    marginBottom: themeConfig.sacredTitleHeader.marginBottom,
    gap: themeConfig.sacredTitleHeader.gap,
  }

  const sacredTitleHeaderLineStyle: React.CSSProperties = {
    width: themeConfig.sacredTitleHeaderLine.width,
    height: themeConfig.sacredTitleHeaderLine.height,
    background: themeConfig.sacredTitleHeaderLine.background,
  }

  const sacredTitleHeaderGlyphStyle: React.CSSProperties = {
    color: themeConfig.sacredTitleHeaderGlyph.color,
    fontSize: themeConfig.sacredTitleHeaderGlyph.fontSize,
    animation: themeConfig.sacredTitleHeaderGlyph.animation,
  }

  const sacredTitleMainStyle: React.CSSProperties = {
    color: themeConfig.sacredTitleMain.color,
    fontSize: themeConfig.sacredTitleMain.fontSize,
    fontWeight: themeConfig.sacredTitleMain.fontWeight,
    letterSpacing: themeConfig.sacredTitleMain.letterSpacing,
    textTransform: themeConfig.sacredTitleMain.textTransform as any,
    animation: themeConfig.sacredTitleMain.animation,
    fontFamily: themeConfig.sacredTitleMain.fontFamily,
    cursor: themeConfig.sacredTitleMain.cursor,
    transition: themeConfig.sacredTitleMain.transition,
    whiteSpace: themeConfig.sacredTitleMain.whiteSpace as any,
    ...(titleHover && {
      transform: themeConfig.sacredTitleMainHover.transform,
      textShadow: themeConfig.sacredTitleMainHover.textShadow,
    }),
  }

  const sacredSubtitleStyle: React.CSSProperties = {
    color: themeConfig.sacredSubtitle.color,
    fontSize: themeConfig.sacredSubtitle.fontSize,
    fontStyle: themeConfig.sacredSubtitle.fontStyle,
    marginTop: themeConfig.sacredSubtitle.marginTop,
    letterSpacing: themeConfig.sacredSubtitle.letterSpacing,
    whiteSpace: themeConfig.sacredSubtitle.whiteSpace as any,
  }

  const sacredGlyphsContainerStyle: React.CSSProperties = {
    display: themeConfig.sacredGlyphsContainer.display,
    justifyContent: themeConfig.sacredGlyphsContainer.justifyContent,
    gap: themeConfig.sacredGlyphsContainer.gap,
    marginTop: themeConfig.sacredGlyphsContainer.marginTop,
  }

  const sacredGlyphStyle: React.CSSProperties = {
    color: themeConfig.sacredGlyph.color,
    fontSize: themeConfig.sacredGlyph.fontSize,
  }

  const sacredDividerStyle: React.CSSProperties = {
    display: themeConfig.sacredDivider.display,
    alignItems: themeConfig.sacredDivider.alignItems,
    justifyContent: themeConfig.sacredDivider.justifyContent,
    padding: themeConfig.sacredDivider.padding,
    marginBottom: themeConfig.sacredDivider.marginBottom,
    minWidth: themeConfig.sacredDivider.minWidth,
  }

  const sacredDividerLineStyle: React.CSSProperties = {
    width: themeConfig.sacredDividerLine.width,
    height: themeConfig.sacredDividerLine.height,
    background: themeConfig.sacredDividerLine.background,
  }

  const sacredDividerGlyphStyle: React.CSSProperties = {
    color: themeConfig.sacredDividerGlyph.color,
    fontSize: themeConfig.sacredDividerGlyph.fontSize,
    padding: themeConfig.sacredDividerGlyph.padding,
    animation: themeConfig.sacredDividerGlyph.animation,
  }

  const sacredFooterStyle: React.CSSProperties = {
    textAlign: themeConfig.sacredFooter.textAlign as any,
    padding: themeConfig.sacredFooter.padding,
  }

  const sacredFooterTextStyle: React.CSSProperties = {
    color: themeConfig.sacredFooterText.color,
    fontSize: themeConfig.sacredFooterText.fontSize,
    fontStyle: themeConfig.sacredFooterText.fontStyle,
    letterSpacing: themeConfig.sacredFooterText.letterSpacing,
    marginBottom: themeConfig.sacredFooterText.marginBottom,
  }

  const sacredFooterGlyphsStyle: React.CSSProperties = {
    display: themeConfig.sacredFooterGlyphs.display,
    justifyContent: themeConfig.sacredFooterGlyphs.justifyContent,
    gap: themeConfig.sacredFooterGlyphs.gap,
  }

  const sacredFooterGlyphStyle: React.CSSProperties = {
    color: themeConfig.sacredFooterGlyph.color,
    fontSize: themeConfig.sacredFooterGlyph.fontSize,
  }

  return {
    container: containerStyle,
    contentContainer: contentContainerStyle,
    navList: navListStyle,
    titleContainer: titleContainerStyle,
    titleLink: titleLinkStyle,
    searchContainer: searchContainerStyle,
    divider: dividerStyle,
    sacredTitleContainer: sacredTitleContainerStyle,
    sacredTitleHeader: sacredTitleHeaderStyle,
    sacredTitleHeaderLine: sacredTitleHeaderLineStyle,
    sacredTitleHeaderGlyph: sacredTitleHeaderGlyphStyle,
    sacredTitleMain: sacredTitleMainStyle,
    sacredSubtitle: sacredSubtitleStyle,
    sacredGlyphsContainer: sacredGlyphsContainerStyle,
    sacredGlyph: sacredGlyphStyle,
    sacredDivider: sacredDividerStyle,
    sacredDividerLine: sacredDividerLineStyle,
    sacredDividerGlyph: sacredDividerGlyphStyle,
    sacredFooter: sacredFooterStyle,
    sacredFooterText: sacredFooterTextStyle,
    sacredFooterGlyphs: sacredFooterGlyphsStyle,
    sacredFooterGlyph: sacredFooterGlyphStyle,
  }
}

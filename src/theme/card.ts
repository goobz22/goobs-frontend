/**
 * @fileoverview Card component theme system with light, dark, and sacred themes.
 * Supports all Card variants: default, task, product, inventory, productsummary, simplepricingsummary, detailedpricingsummary
 */
import React from 'react'
import { SACRED_GLYPHS, TRANSITIONS, SHADOWS } from './shared'

export interface CardTheme {
  /** Main container styling */
  container: React.CSSProperties
  /** Container without outline */
  containerNoOutline: React.CSSProperties
  /** Container hover styling */
  containerHover: React.CSSProperties
  /** Container with image styling */
  containerWithImage: React.CSSProperties
  /** Image styling */
  image: React.CSSProperties
  /** Image overlay for sacred theme */
  imageOverlay: React.CSSProperties
  /** Image top position */
  imageTop: React.CSSProperties
  /** Image left position */
  imageLeft: React.CSSProperties
  /** Content area styling */
  content: React.CSSProperties
  /** Header section styling */
  header: React.CSSProperties
  /** Header without underline */
  headerNoUnderline: React.CSSProperties
  /** Title styling */
  title: React.CSSProperties
  /** Body section styling */
  bodySection: React.CSSProperties
  /** Body text styling */
  bodyText: React.CSSProperties
  /** Footer section styling */
  footer: React.CSSProperties
  /** Breadcrumb styling */
  breadcrumb: React.CSSProperties
  /** Accent bar styling */
  accent: React.CSSProperties
  /** Visible accent styling */
  accentVisible: React.CSSProperties
  /** Sacred glyph styling */
  glyph: React.CSSProperties
  /** Sacred glyph top right position */
  glyphTopRight: React.CSSProperties
  /** Sacred glyph bottom left position */
  glyphBottomLeft: React.CSSProperties
  /** Price display styling */
  price: React.CSSProperties
  /** Toggle control styling */
  toggle: React.CSSProperties
  /** Toggle label styling */
  toggleLabel: React.CSSProperties
  /** Active toggle label styling */
  activeToggleLabel: React.CSSProperties
  /** Task specific styling */
  taskContainer: React.CSSProperties
  /** Task checkbox styling */
  taskCheckbox: React.CSSProperties
  /** Inventory specific styling */
  inventoryContainer: React.CSSProperties
  /** Product specific styling */
  productContainer: React.CSSProperties
  /** Pricing summary styling */
  pricingSummary: React.CSSProperties
}

export interface CardStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Card variant type */
  variant?:
    | 'default'
    | 'task'
    | 'product'
    | 'inventory'
    | 'productsummary'
    | 'simplepricingsummary'
    | 'detailedpricingsummary'
  /** Whether to show outline */
  outline?: boolean
  /** Whether the card is disabled */
  disabled?: boolean
  /** Custom container background color */
  containerBackground?: string
  /** Custom border color */
  borderColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom text color */
  textColor?: string
  /** Custom accent color */
  accentColor?: string
  /** Custom hover effects */
  hoverEffects?: boolean
  /** Custom width */
  width?: string | number
  /** Custom height */
  height?: string | number
  /** Custom padding */
  padding?: string
  /** Custom margin */
  margin?: string
  /** Custom font family */
  fontFamily?: string
  /** Custom font size */
  fontSize?: string
  /** Custom font weight */
  fontWeight?: string | number
  /** Custom box shadow */
  boxShadow?: string
  /** Custom transition duration */
  transitionDuration?: string
  /** Custom backdrop filter */
  backdropFilter?: string
  /** Image position for default variant */
  imagePosition?: 'top' | 'left'
  /** Title underline for default variant */
  titleUnderline?: boolean
  /** Sacred glyph customization */
  sacredGlyphLeft?: string
  /** Sacred glyph customization */
  sacredGlyphRight?: string
}

const lightTheme: CardTheme = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: SHADOWS.light.small,
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
    fontFamily: '"Inter", sans-serif',
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  containerWithImage: {
    flexDirection: 'row',
  },
  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
  },
  imageOverlay: {
    display: 'none',
  },
  imageTop: {
    width: '100%',
    height: '192px',
  },
  imageLeft: {
    width: '192px',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
  },
  headerNoUnderline: {
    borderBottom: 'none',
  },
  title: {
    color: 'rgb(31, 41, 55)',
    fontWeight: 600,
  },
  bodySection: {
    padding: '24px',
  },
  bodyText: {
    color: 'rgb(55, 65, 81)',
    lineHeight: 1.6,
  },
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(226, 232, 240, 0.3)',
    backgroundColor: 'rgba(248, 250, 252, 0.3)',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background:
      'linear-gradient(180deg, rgb(59, 130, 246) 0%, rgb(147, 197, 253) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  accentVisible: {
    opacity: 1,
  },
  glyph: {
    display: 'none',
  },
  glyphTopRight: {
    display: 'none',
  },
  glyphBottomLeft: {
    display: 'none',
  },
  price: {
    color: 'rgb(59, 130, 246)',
    fontWeight: 600,
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  toggleLabel: {
    color: 'rgb(75, 85, 99)',
  },
  activeToggleLabel: {
    color: 'rgb(31, 41, 55)',
    fontWeight: 600,
  },
  taskContainer: {
    padding: '16px',
    cursor: 'pointer',
  },
  taskCheckbox: {
    marginRight: '12px',
  },
  inventoryContainer: {
    padding: '20px',
  },
  productContainer: {
    padding: '20px',
  },
  pricingSummary: {
    padding: '20px',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
}

const darkTheme: CardTheme = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(75, 85, 99, 0.8)',
    borderRadius: '12px',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: SHADOWS.dark.small,
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
    fontFamily: '"Inter", sans-serif',
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
  },
  containerWithImage: {
    flexDirection: 'row',
  },
  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
  },
  imageOverlay: {
    display: 'none',
  },
  imageTop: {
    width: '100%',
    height: '192px',
  },
  imageLeft: {
    width: '192px',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
  headerNoUnderline: {
    borderBottom: 'none',
  },
  title: {
    color: 'rgb(243, 244, 246)',
    fontWeight: 600,
  },
  bodySection: {
    padding: '24px',
  },
  bodyText: {
    color: 'rgb(209, 213, 219)',
    lineHeight: 1.6,
  },
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(75, 85, 99, 0.3)',
    backgroundColor: 'rgba(17, 24, 39, 0.3)',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background:
      'linear-gradient(180deg, rgb(96, 165, 250) 0%, rgb(59, 130, 246) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  accentVisible: {
    opacity: 1,
  },
  glyph: {
    display: 'none',
  },
  glyphTopRight: {
    display: 'none',
  },
  glyphBottomLeft: {
    display: 'none',
  },
  price: {
    color: 'rgb(96, 165, 250)',
    fontWeight: 600,
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  toggleLabel: {
    color: 'rgb(156, 163, 175)',
  },
  activeToggleLabel: {
    color: 'rgb(243, 244, 246)',
    fontWeight: 600,
  },
  taskContainer: {
    padding: '16px',
    cursor: 'pointer',
  },
  taskCheckbox: {
    marginRight: '12px',
  },
  inventoryContainer: {
    padding: '20px',
  },
  productContainer: {
    padding: '20px',
  },
  pricingSummary: {
    padding: '20px',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
}

const sacredTheme: CardTheme = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow: SHADOWS.sacred.medium,
    overflow: 'hidden',
    transition: TRANSITIONS.premium,
    fontFamily: '"Cinzel", serif',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow: SHADOWS.sacred.large,
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
  },
  containerWithImage: {
    flexDirection: 'row',
  },
  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(45deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
  },
  imageTop: {
    width: '100%',
    height: '192px',
  },
  imageLeft: {
    width: '192px',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    padding: '20px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  headerNoUnderline: {
    borderBottom: 'none',
  },
  title: {
    color: '#FFD700',
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  },
  bodySection: {
    padding: '28px',
  },
  bodyText: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontFamily: '"Merriweather", serif',
    lineHeight: 1.6,
    letterSpacing: '0.025em',
  },
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  accent: {
    display: 'none',
  },
  accentVisible: {
    display: 'none',
  },
  glyph: {
    position: 'absolute',
    fontSize: '16px',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    opacity: 0.3,
    animation: 'glyph-rotate 10s linear infinite',
  },
  glyphTopRight: {
    top: '12px',
    right: '12px',
  },
  glyphBottomLeft: {
    bottom: '12px',
    left: '12px',
  },
  price: {
    color: '#FFD700',
    fontWeight: 'bold',
    textShadow: '0 0 5px rgba(255,215,0,0.5)',
    animation: 'sacred-price-pulse 2s infinite alternate',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  toggleLabel: {
    color: 'rgba(255, 215, 0, 0.7)',
  },
  activeToggleLabel: {
    color: '#FFD700',
    textShadow: '0 0 3px rgba(255,215,0,0.5)',
  },
  taskContainer: {
    padding: '20px',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 215, 0, 0.02)',
  },
  taskCheckbox: {
    marginRight: '16px',
  },
  inventoryContainer: {
    padding: '24px',
    backgroundColor: 'rgba(255, 215, 0, 0.02)',
  },
  productContainer: {
    padding: '24px',
    backgroundColor: 'rgba(255, 215, 0, 0.02)',
  },
  pricingSummary: {
    padding: '24px',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)',
  },
}

export const getCardStyles = (
  styles?: CardStyles,
  isHovered?: boolean,
  isDisabled?: boolean
): CardTheme => {
  const baseTheme =
    styles?.theme === 'light'
      ? lightTheme
      : styles?.theme === 'sacred'
        ? sacredTheme
        : darkTheme

  const customStyles: CardTheme = {
    container: {
      ...baseTheme.container,
      ...(styles?.containerBackground && {
        backgroundColor: styles.containerBackground,
      }),
      ...(styles?.borderColor && { borderColor: styles.borderColor }),
      ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
      ...(styles?.width && {
        width:
          typeof styles.width === 'number' ? `${styles.width}px` : styles.width,
      }),
      ...(styles?.height && {
        height:
          typeof styles.height === 'number'
            ? `${styles.height}px`
            : styles.height,
      }),
      ...(styles?.padding && { padding: styles.padding }),
      ...(styles?.margin && { margin: styles.margin }),
      ...(styles?.fontFamily && { fontFamily: styles.fontFamily }),
      ...(styles?.boxShadow && { boxShadow: styles.boxShadow }),
      ...(styles?.backdropFilter && { backdropFilter: styles.backdropFilter }),
      ...(styles?.outline === false && baseTheme.containerNoOutline),
      ...(isHovered &&
        styles?.hoverEffects !== false &&
        baseTheme.containerHover),
      ...(isDisabled && {
        opacity: 0.6,
        pointerEvents: 'none',
        filter: 'grayscale(0.3)',
      }),
    },
    containerNoOutline: baseTheme.containerNoOutline,
    containerHover: baseTheme.containerHover,
    containerWithImage: baseTheme.containerWithImage,
    image: baseTheme.image,
    imageOverlay: baseTheme.imageOverlay,
    imageTop: baseTheme.imageTop,
    imageLeft: baseTheme.imageLeft,
    content: baseTheme.content,
    header: {
      ...baseTheme.header,
      ...(styles?.titleUnderline === false && baseTheme.headerNoUnderline),
    },
    headerNoUnderline: baseTheme.headerNoUnderline,
    title: {
      ...baseTheme.title,
      ...(styles?.textColor && { color: styles.textColor }),
      ...(styles?.fontSize && { fontSize: styles.fontSize }),
      ...(styles?.fontWeight && { fontWeight: styles.fontWeight }),
    },
    bodySection: baseTheme.bodySection,
    bodyText: {
      ...baseTheme.bodyText,
      ...(styles?.textColor && { color: styles.textColor }),
    },
    footer: baseTheme.footer,
    breadcrumb: baseTheme.breadcrumb,
    accent: {
      ...baseTheme.accent,
      ...(styles?.accentColor && {
        background: `linear-gradient(180deg, ${styles.accentColor} 0%, ${styles.accentColor}80 100%)`,
      }),
    },
    accentVisible: baseTheme.accentVisible,
    glyph: baseTheme.glyph,
    glyphTopRight: baseTheme.glyphTopRight,
    glyphBottomLeft: baseTheme.glyphBottomLeft,
    price: baseTheme.price,
    toggle: baseTheme.toggle,
    toggleLabel: baseTheme.toggleLabel,
    activeToggleLabel: baseTheme.activeToggleLabel,
    taskContainer: baseTheme.taskContainer,
    taskCheckbox: baseTheme.taskCheckbox,
    inventoryContainer: baseTheme.inventoryContainer,
    productContainer: baseTheme.productContainer,
    pricingSummary: baseTheme.pricingSummary,
  }

  return customStyles
}

export { SACRED_GLYPHS }

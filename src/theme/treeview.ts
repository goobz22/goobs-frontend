// --------------------------------------------------------------------------
// TREE VIEW THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface TreeViewTheme {
  // Main container styling
  container: {
    backgroundColor: string
    backgroundImage?: string
    backgroundRepeat?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundAttachment?: string
    backgroundOrigin?: string
    backgroundClip?: string
    border?: string
    borderWidth?: string
    borderStyle?: string
    borderColor?: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    color: string
    fontFamily: string
    fontSize: string
    lineHeight: string | number
    padding: string
    width: string
    minWidth: string
    maxWidth?: string
    height: string
    minHeight?: string
    maxHeight?: string
    overflow: string
    position: React.CSSProperties['position']
  }

  // Tree item styling
  item: {
    backgroundColor: string
    backgroundImage?: string
    backgroundRepeat?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundAttachment?: string
    backgroundOrigin?: string
    backgroundClip?: string
    border?: string
    borderWidth?: string
    borderStyle?: string
    borderColor?: string
    borderRadius: string
    color: string
    fontFamily: string
    fontSize: string
    fontWeight: string | number
    letterSpacing: string
    textShadow?: string
    padding: string
    minHeight: string
    margin: string
    cursor: string
    transition: string
    outline: string
    position: React.CSSProperties['position']
    display: string
    alignItems: string
    whiteSpace: string
    textOverflow: string
    overflow: string
  }

  // Tree item hover state
  itemHover: {
    backgroundColor: string
    borderColor?: string
    color: string
    transform?: string
    textShadow?: string
    boxShadow?: string
  }

  // Tree item selected state
  itemSelected: {
    backgroundColor: string
    borderColor?: string
    color: string
    fontWeight: string | number
    textShadow?: string
    boxShadow?: string
    backgroundImage?: string
  }

  // Tree item expanded state
  itemExpanded: {
    backgroundColor: string
    borderColor?: string
    color: string
    fontWeight: string | number
    textShadow?: string
  }

  // Tree item disabled state
  itemDisabled: {
    backgroundColor: string
    color: string
    cursor: string
    opacity: number
    borderColor?: string
  }

  // Tree item focus state
  itemFocused: {
    outline: string
    outlineOffset: string
    boxShadow: string
    backgroundColor?: string
  }

  // Icon container styling
  iconContainer: {
    display: string
    alignItems: string
    justifyContent: string
    width: string
    height: string
    minWidth: string
    marginRight: string
    position: React.CSSProperties['position']
    cursor: string
    transition: string
  }

  // Expand/collapse icon styling
  expandIcon: {
    color: string
    fontSize: string
    transition: string
    filter?: string
    opacity?: number
  }

  // Expand icon hover state
  expandIconHover: {
    color: string
    transform: string
    filter?: string
  }

  // Expand icon expanded state
  expandIconExpanded: {
    transform: string
    color: string
    filter?: string
  }

  // Checkbox styling
  checkbox: {
    width: string
    height: string
    marginRight: string
    accentColor: string
    cursor: string
    transition: string
    borderRadius?: string
    border?: string
    backgroundColor?: string
    backgroundImage?: string
    backgroundRepeat?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundAttachment?: string
    backgroundOrigin?: string
    backgroundClip?: string
  }

  // Content area styling (for children)
  content: {
    paddingLeft: string
    borderLeft?: string
    marginLeft?: string
    position: React.CSSProperties['position']
    transition: string
    overflow: string
  }

  // Label styling
  label: {
    flex: string
    fontSize: string
    fontWeight: string | number
    color: string
    textShadow?: string
    userSelect: React.CSSProperties['userSelect']
    cursor: string
    transition: string
    whiteSpace: string
    textOverflow: string
    overflow: string
  }

  // Sacred theme specific styles
  sacred?: {
    glyph: {
      position: React.CSSProperties['position']
      color: string
      fontSize: string
      zIndex: number
      pointerEvents: string
      transition: string
      opacity: number
      animation?: string
    }
    glyphLeft: {
      left: string
      top: string
      transform: string
    }
    glyphRight: {
      right: string
      top: string
      transform: string
    }
    glyphVisible: {
      opacity: number
      animation?: string
    }
    shimmer: {
      position: string
      top: string
      left: string
      width: string
      height: string
      backgroundColor: string
      backgroundImage: string
      backgroundRepeat: string
      backgroundSize: string
      backgroundPosition: string
      backgroundAttachment: string
      backgroundOrigin: string
      backgroundClip: string
      animation: string
      pointerEvents: string
    }
    backgroundGlyph: {
      position: string
      top: string
      right: string
      color: string
      fontSize: string
      animation: string
      pointerEvents: string
      zIndex: number
    }
  }

  // Transition duration
  transition: string
}

export interface TreeViewStyles {
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
  fontFamily?: string
  fontSize?: string
  lineHeight?: string | number
  padding?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  maxHeight?: string

  // Item styling
  itemBackgroundColor?: string
  itemBorderColor?: string
  itemBorderRadius?: string
  itemColor?: string
  itemFontFamily?: string
  itemFontSize?: string
  itemFontWeight?: string | number
  itemLetterSpacing?: string
  itemTextShadow?: string
  itemPadding?: string
  itemMinHeight?: string
  itemMargin?: string

  // Item hover states
  itemHoverBackgroundColor?: string
  itemHoverBorderColor?: string
  itemHoverColor?: string
  itemHoverTransform?: string
  itemHoverTextShadow?: string
  itemHoverBoxShadow?: string

  // Item selected states
  itemSelectedBackgroundColor?: string
  itemSelectedBorderColor?: string
  itemSelectedColor?: string
  itemSelectedFontWeight?: string | number
  itemSelectedTextShadow?: string
  itemSelectedBoxShadow?: string
  itemSelectedBackgroundImage?: string

  // Item expanded states
  itemExpandedBackgroundColor?: string
  itemExpandedBorderColor?: string
  itemExpandedColor?: string
  itemExpandedFontWeight?: string | number
  itemExpandedTextShadow?: string

  // Item disabled states
  itemDisabledBackgroundColor?: string
  itemDisabledColor?: string
  itemDisabledOpacity?: number
  itemDisabledBorderColor?: string

  // Item focus states
  itemFocusedOutline?: string
  itemFocusedOutlineOffset?: string
  itemFocusedBoxShadow?: string
  itemFocusedBackgroundColor?: string

  // Icon styling
  iconContainerWidth?: string
  iconContainerHeight?: string
  iconContainerMarginRight?: string
  expandIconColor?: string
  expandIconFontSize?: string
  expandIconHoverColor?: string
  expandIconHoverTransform?: string
  expandIconExpandedTransform?: string
  expandIconExpandedColor?: string

  // Checkbox styling
  checkboxWidth?: string
  checkboxHeight?: string
  checkboxMarginRight?: string
  checkboxAccentColor?: string
  checkboxBorderRadius?: string
  checkboxBorder?: string
  checkboxBackground?: string

  // Content area styling
  contentPaddingLeft?: string
  contentBorderLeft?: string
  contentMarginLeft?: string

  // Label styling
  labelFontSize?: string
  labelFontWeight?: string | number
  labelColor?: string
  labelTextShadow?: string

  // Indentation
  itemChildrenIndentation?: string | number
  levelIndentBase?: number
  levelIndentIncrement?: number

  // Sacred theme styling
  sacredGlyphColor?: string
  sacredGlyphFontSize?: string
  sacredGlyphAnimation?: string
  sacredShimmerBackground?: string
  sacredShimmerAnimation?: string
  sacredBackgroundGlyphColor?: string
  sacredBackgroundGlyphAnimation?: string

  // Layout and spacing
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

  // Behavior
  multiSelect?: boolean
  checkboxSelection?: boolean
  disableSelection?: boolean
  expandOnClick?: boolean
}

export const treeViewThemes: Record<
  'light' | 'dark' | 'sacred',
  TreeViewTheme
> = {
  light: {
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(229, 231, 235, 0.8)',
      borderRadius: '12px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(8px)',
      color: 'rgb(17, 24, 39)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      lineHeight: 1.5,
      padding: '8px',
      width: '100%',
      minWidth: '200px',
      height: 'auto',
      overflow: 'hidden',
      position: 'relative',
    },
    item: {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '8px',
      color: 'rgb(55, 65, 81)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.01em',
      padding: '8px 12px',
      minHeight: '36px',
      margin: '1px 0',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      outline: 'none',
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    itemHover: {
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      color: 'rgb(59, 130, 246)',
      transform: 'translateX(2px)',
    },
    itemSelected: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      color: 'rgb(59, 130, 246)',
      fontWeight: '600',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
    },
    itemExpanded: {
      backgroundColor: 'rgba(16, 185, 129, 0.06)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
      color: 'rgb(16, 185, 129)',
      fontWeight: '600',
    },
    itemDisabled: {
      backgroundColor: 'rgba(243, 244, 246, 0.5)',
      color: 'rgb(156, 163, 175)',
      cursor: 'not-allowed',
      opacity: 0.6,
      borderColor: 'rgba(209, 213, 219, 0.3)',
    },
    itemFocused: {
      outline: '2px solid rgba(59, 130, 246, 0.6)',
      outlineOffset: '2px',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      minWidth: '20px',
      marginRight: '8px',
      position: 'relative',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
    },
    expandIcon: {
      color: 'rgb(107, 114, 128)',
      fontSize: '16px',
      transition: TRANSITIONS.fast,
      opacity: 1,
    },
    expandIconHover: {
      color: 'rgb(59, 130, 246)',
      transform: 'scale(1.1)',
    },
    expandIconExpanded: {
      transform: 'rotate(90deg)',
      color: 'rgb(16, 185, 129)',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      accentColor: 'rgb(59, 130, 246)',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
    },
    content: {
      paddingLeft: '24px',
      borderLeft: '1px solid rgba(229, 231, 235, 0.5)',
      marginLeft: '10px',
      position: 'relative',
      transition: TRANSITIONS.medium,
      overflow: 'visible',
    },
    label: {
      flex: '1',
      fontSize: '14px',
      fontWeight: '500',
      color: 'inherit',
      userSelect: 'none',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(75, 85, 99, 0.6)',
      borderRadius: '12px',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(16px)',
      color: 'rgb(243, 244, 246)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      lineHeight: 1.5,
      padding: '8px',
      width: '100%',
      minWidth: '200px',
      height: 'auto',
      overflow: 'hidden',
      position: 'relative',
    },
    item: {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '8px',
      color: 'rgb(209, 213, 219)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.01em',
      padding: '8px 12px',
      minHeight: '36px',
      margin: '1px 0',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      outline: 'none',
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    itemHover: {
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      color: 'rgb(96, 165, 250)',
      transform: 'translateX(2px)',
    },
    itemSelected: {
      backgroundColor: 'rgba(96, 165, 250, 0.15)',
      borderColor: 'rgba(96, 165, 250, 0.5)',
      color: 'rgb(96, 165, 250)',
      fontWeight: '600',
      boxShadow: '0 2px 4px rgba(96, 165, 250, 0.2)',
    },
    itemExpanded: {
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      color: 'rgb(52, 211, 153)',
      fontWeight: '600',
    },
    itemDisabled: {
      backgroundColor: 'rgba(55, 65, 81, 0.5)',
      color: 'rgb(107, 114, 128)',
      cursor: 'not-allowed',
      opacity: 0.6,
      borderColor: 'rgba(75, 85, 99, 0.3)',
    },
    itemFocused: {
      outline: '2px solid rgba(96, 165, 250, 0.6)',
      outlineOffset: '2px',
      boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      minWidth: '20px',
      marginRight: '8px',
      position: 'relative',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
    },
    expandIcon: {
      color: 'rgb(156, 163, 175)',
      fontSize: '16px',
      transition: TRANSITIONS.fast,
      opacity: 1,
    },
    expandIconHover: {
      color: 'rgb(96, 165, 250)',
      transform: 'scale(1.1)',
    },
    expandIconExpanded: {
      transform: 'rotate(90deg)',
      color: 'rgb(52, 211, 153)',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      accentColor: 'rgb(96, 165, 250)',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
    },
    content: {
      paddingLeft: '24px',
      borderLeft: '1px solid rgba(75, 85, 99, 0.5)',
      marginLeft: '10px',
      position: 'relative',
      transition: TRANSITIONS.medium,
      overflow: 'visible',
    },
    label: {
      flex: '1',
      fontSize: '14px',
      fontWeight: '500',
      color: 'inherit',
      userSelect: 'none',
      cursor: 'pointer',
      transition: TRANSITIONS.fast,
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      backgroundColor: 'transparent',
      backgroundImage:
        'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%), radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'scroll',
      backgroundOrigin: 'padding-box',
      backgroundClip: 'border-box',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      borderRadius: '16px',
      boxShadow:
        '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.2), inset 0 2px 4px rgba(255, 215, 0, 0.1)',
      backdropFilter: 'blur(20px)',
      color: 'rgba(255, 215, 0, 0.95)',
      fontFamily: '"Cinzel", serif',
      fontSize: '14px',
      lineHeight: 1.6,
      padding: '12px',
      width: '100%',
      minWidth: '220px',
      height: 'auto',
      overflow: 'hidden',
      position: 'relative',
    },
    item: {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px',
      color: 'rgba(255, 215, 0, 0.9)',
      fontFamily: '"Cinzel", serif',
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
      padding: '6px 16px',
      minHeight: '32px',
      margin: '2px 0',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    itemHover: {
      backgroundColor: 'rgba(255, 215, 0, 0.08)',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      color: 'rgba(255, 215, 0, 1)',
      transform: 'translateX(4px) scale(1.02)',
      textShadow:
        '0 2px 8px rgba(255, 215, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)',
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.25)',
    },
    itemSelected: {
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      borderColor: 'rgba(255, 215, 0, 0.8)',
      color: 'rgba(255, 215, 0, 1)',
      fontWeight: '600',
      textShadow:
        '0 2px 8px rgba(255, 215, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.9)',
      boxShadow:
        '0 4px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
      backgroundImage:
        'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
    },
    itemExpanded: {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      color: 'rgba(255, 215, 0, 1)',
      fontWeight: '600',
      textShadow:
        '0 2px 6px rgba(255, 215, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.8)',
    },
    itemDisabled: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: 'rgba(255, 215, 0, 0.3)',
      cursor: 'not-allowed',
      opacity: 0.5,
      borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    itemFocused: {
      outline: '2px solid rgba(255, 215, 0, 0.8)',
      outlineOffset: '3px',
      boxShadow:
        '0 0 0 4px rgba(255, 215, 0, 0.2), 0 4px 20px rgba(255, 215, 0, 0.3)',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '24px',
      minWidth: '20px',
      marginRight: '8px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    expandIcon: {
      color: 'rgba(255, 215, 0, 0.7)',
      fontSize: '16px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
      opacity: 1,
    },
    expandIconHover: {
      color: 'rgba(255, 215, 0, 1)',
      transform: 'scale(1.2) rotate(10deg)',
      filter:
        'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
    },
    expandIconExpanded: {
      transform: 'rotate(90deg) scale(1.1) translateX(2px)',
      color: 'rgba(255, 215, 0, 1)',
      filter:
        'drop-shadow(0 2px 6px rgba(255, 215, 0, 0.7)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginRight: '12px',
      accentColor: 'rgba(255, 215, 0, 1)',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '3px',
      border: '1px solid rgba(255, 215, 0, 0.5)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
    },
    content: {
      paddingLeft: '32px',
      borderLeft: '2px solid rgba(255, 215, 0, 0.3)',
      marginLeft: '12px',
      position: 'relative',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'visible',
    },
    label: {
      flex: '1',
      fontSize: '14px',
      fontWeight: '500',
      color: 'inherit',
      userSelect: 'none',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      whiteSpace: 'normal',
      textOverflow: 'clip',
      overflow: 'visible',
    },
    sacred: {
      glyph: {
        position: 'absolute',
        color: 'rgba(255, 215, 0, 0.4)',
        fontSize: '16px',
        zIndex: 1,
        pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 0,
      },
      glyphLeft: {
        left: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphRight: {
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      glyphVisible: {
        opacity: 1,
        animation: 'sacredGlyphRotate 20s linear infinite',
      },
      shimmer: {
        position: 'absolute',
        top: '0',
        left: '-100%',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        backgroundImage:
          'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.2) 50%, transparent 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        backgroundOrigin: 'padding-box',
        backgroundClip: 'border-box',
        animation: 'sacredShimmer 3s ease-in-out infinite',
        pointerEvents: 'none',
      },
      backgroundGlyph: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: 'rgba(255, 215, 0, 0.2)',
        fontSize: '12px',
        animation: 'sacredFloat 3s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      },
    },
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const getTreeViewStyles = (
  styles: TreeViewStyles = {},

  isDisabled = false
): React.CSSProperties => {
  const theme = treeViewThemes[styles.theme || 'light']

  return {
    // Base container styles - Use longhand properties only
    backgroundColor: theme.container.backgroundColor,
    backgroundImage: theme.container.backgroundImage || 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'scroll',
    backgroundOrigin: 'padding-box',
    backgroundClip: 'border-box',
    borderWidth: theme.container.borderWidth,
    borderStyle: theme.container.borderStyle,
    borderColor: theme.container.borderColor,
    borderRadius: theme.container.borderRadius,
    boxShadow: theme.container.boxShadow,
    backdropFilter: theme.container.backdropFilter,
    color: theme.container.color,
    fontFamily: theme.container.fontFamily,
    fontSize: theme.container.fontSize,
    lineHeight: theme.container.lineHeight,
    padding: theme.container.padding,
    width: theme.container.width,
    minWidth: theme.container.minWidth,
    maxWidth: theme.container.maxWidth,
    height: theme.container.height,
    minHeight: theme.container.minHeight,
    maxHeight: theme.container.maxHeight,
    overflow: theme.container.overflow,
    position: theme.container.position,

    // Style overrides - Use consistent longhand properties
    ...(styles.backgroundColor && { backgroundColor: styles.backgroundColor }),
    ...(styles.borderColor && { borderColor: styles.borderColor }),
    ...(styles.borderRadius && { borderRadius: styles.borderRadius }),
    ...(styles.borderWidth && { borderWidth: styles.borderWidth }),
    ...(styles.boxShadow && { boxShadow: styles.boxShadow }),
    ...(styles.backdropFilter && { backdropFilter: styles.backdropFilter }),
    ...(styles.backgroundImage && { backgroundImage: styles.backgroundImage }),
    ...(styles.color && { color: styles.color }),
    ...(styles.fontFamily && { fontFamily: styles.fontFamily }),
    ...(styles.fontSize && { fontSize: styles.fontSize }),
    ...(styles.lineHeight && { lineHeight: styles.lineHeight }),
    ...(styles.padding && { padding: styles.padding }),
    ...(styles.width && { width: styles.width }),
    ...(styles.minWidth && { minWidth: styles.minWidth }),
    ...(styles.maxWidth && { maxWidth: styles.maxWidth }),
    ...(styles.height && { height: styles.height }),
    ...(styles.minHeight && { minHeight: styles.minHeight }),
    ...(styles.maxHeight && { maxHeight: styles.maxHeight }),

    // Layout and spacing
    ...(styles.margin && { margin: styles.margin }),
    ...(styles.marginTop && { marginTop: styles.marginTop }),
    ...(styles.marginBottom && { marginBottom: styles.marginBottom }),
    ...(styles.marginLeft && { marginLeft: styles.marginLeft }),
    ...(styles.marginRight && { marginRight: styles.marginRight }),

    // Transitions
    ...(styles.transitionDuration && {
      transitionDuration: styles.transitionDuration,
    }),
    ...(styles.transitionEasing && {
      transitionTimingFunction: styles.transitionEasing,
    }),

    // Disabled state
    ...(isDisabled && { opacity: 0.6, pointerEvents: 'none' }),
  }
}

export const getTreeItemStyles = (
  styles: TreeViewStyles = {},
  isHovered = false,
  isSelected = false,
  isExpanded = false,
  isFocused = false,
  isDisabled = false,
  level = 0
): {
  item: React.CSSProperties
  iconContainer: React.CSSProperties
  expandIcon: React.CSSProperties
  checkbox: React.CSSProperties
  label: React.CSSProperties
  content: React.CSSProperties
} => {
  const theme = treeViewThemes[styles.theme || 'light']

  // Calculate indentation
  const baseIndent = styles.levelIndentBase || 16
  const incrementIndent = styles.levelIndentIncrement || 12
  const totalIndent = baseIndent + level * incrementIndent

  // Base item styles - Use longhand properties only
  const itemStyles: React.CSSProperties = {
    backgroundColor: theme.item.backgroundColor,
    backgroundImage: 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
    backgroundPosition: 'initial',
    backgroundAttachment: 'initial',
    backgroundOrigin: 'initial',
    backgroundClip: 'initial',
    borderWidth: theme.item.borderWidth,
    borderStyle: theme.item.borderStyle,
    borderColor: theme.item.borderColor,
    borderRadius: theme.item.borderRadius,
    color: theme.item.color,
    fontFamily: theme.item.fontFamily,
    fontSize: theme.item.fontSize,
    fontWeight: theme.item.fontWeight,
    letterSpacing: theme.item.letterSpacing,
    textShadow: theme.item.textShadow,
    padding: theme.item.padding,
    minHeight: theme.item.minHeight,
    margin: theme.item.margin,
    cursor: theme.item.cursor,
    transition: theme.item.transition,
    outline: theme.item.outline,
    position: theme.item.position,
    display: theme.item.display,
    alignItems: theme.item.alignItems,
    whiteSpace: theme.item.whiteSpace,
    textOverflow: theme.item.textOverflow,
    overflow: theme.item.overflow,
  }

  // Apply level-based indentation
  itemStyles.paddingLeft = `${totalIndent}px`

  // Apply state-based styles - Ensure hydration consistency
  // Only apply hover styles on client side to prevent hydration mismatch
  const isClient = typeof window !== 'undefined'

  if (isDisabled) {
    itemStyles.backgroundColor = theme.itemDisabled.backgroundColor
    itemStyles.color = theme.itemDisabled.color
    itemStyles.cursor = theme.itemDisabled.cursor
    itemStyles.opacity = theme.itemDisabled.opacity
    if (theme.itemDisabled.borderColor) {
      itemStyles.borderColor = theme.itemDisabled.borderColor
    }
  } else if (isSelected) {
    itemStyles.backgroundColor = theme.itemSelected.backgroundColor
    if (theme.itemSelected.borderColor) {
      itemStyles.borderColor = theme.itemSelected.borderColor
    }
    itemStyles.color = theme.itemSelected.color
    itemStyles.fontWeight = theme.itemSelected.fontWeight
    if (theme.itemSelected.textShadow) {
      itemStyles.textShadow = theme.itemSelected.textShadow
    }
    if (theme.itemSelected.boxShadow) {
      itemStyles.boxShadow = theme.itemSelected.boxShadow
    }
    if (theme.itemSelected.backgroundImage) {
      itemStyles.backgroundImage = theme.itemSelected.backgroundImage
    }
  } else if (isExpanded) {
    itemStyles.backgroundColor = theme.itemExpanded.backgroundColor
    if (theme.itemExpanded.borderColor) {
      itemStyles.borderColor = theme.itemExpanded.borderColor
    }
    itemStyles.color = theme.itemExpanded.color
    itemStyles.fontWeight = theme.itemExpanded.fontWeight
    if (theme.itemExpanded.textShadow) {
      itemStyles.textShadow = theme.itemExpanded.textShadow
    }
  } else if (isClient && isHovered) {
    // Only apply hover styles on client to prevent hydration mismatch
    itemStyles.backgroundColor = theme.itemHover.backgroundColor
    if (theme.itemHover.borderColor) {
      itemStyles.borderColor = theme.itemHover.borderColor
    }
    itemStyles.color = theme.itemHover.color
    if (theme.itemHover.transform) {
      itemStyles.transform = theme.itemHover.transform
    }
    if (theme.itemHover.textShadow) {
      itemStyles.textShadow = theme.itemHover.textShadow
    }
    if (theme.itemHover.boxShadow) {
      itemStyles.boxShadow = theme.itemHover.boxShadow
    }
  }

  if (isFocused) {
    itemStyles.outline = theme.itemFocused.outline
    itemStyles.outlineOffset = theme.itemFocused.outlineOffset
    itemStyles.boxShadow = theme.itemFocused.boxShadow
    if (theme.itemFocused.backgroundColor) {
      itemStyles.backgroundColor = theme.itemFocused.backgroundColor
    }
  }

  // Icon styles
  let expandIconStyles = { ...theme.expandIcon }
  if (isDisabled) {
    expandIconStyles.color = theme.itemDisabled.color
    expandIconStyles.opacity = 0.5
  } else if (isExpanded) {
    expandIconStyles = { ...expandIconStyles, ...theme.expandIconExpanded }
  } else if (isHovered) {
    expandIconStyles = { ...expandIconStyles, ...theme.expandIconHover }
  }

  return {
    item: {
      ...itemStyles,
      // Style overrides
      ...(styles.itemBackgroundColor && {
        backgroundColor: styles.itemBackgroundColor,
      }),
      ...(styles.itemBorderColor && { borderColor: styles.itemBorderColor }),
      ...(styles.itemBorderRadius && { borderRadius: styles.itemBorderRadius }),
      ...(styles.itemColor && { color: styles.itemColor }),
      ...(styles.itemFontFamily && { fontFamily: styles.itemFontFamily }),
      ...(styles.itemFontSize && { fontSize: styles.itemFontSize }),
      ...(styles.itemFontWeight && { fontWeight: styles.itemFontWeight }),
      ...(styles.itemLetterSpacing && {
        letterSpacing: styles.itemLetterSpacing,
      }),
      ...(styles.itemTextShadow && { textShadow: styles.itemTextShadow }),
      ...(styles.itemPadding && { padding: styles.itemPadding }),
      ...(styles.itemMinHeight && { minHeight: styles.itemMinHeight }),
      ...(styles.itemMargin && { margin: styles.itemMargin }),
    },
    iconContainer: {
      ...theme.iconContainer,
      ...(styles.iconContainerWidth && { width: styles.iconContainerWidth }),
      ...(styles.iconContainerHeight && { height: styles.iconContainerHeight }),
      ...(styles.iconContainerMarginRight && {
        marginRight: styles.iconContainerMarginRight,
      }),
      alignSelf: 'center',
    },
    expandIcon: {
      ...expandIconStyles,
      ...(styles.expandIconColor && { color: styles.expandIconColor }),
      ...(styles.expandIconFontSize && { fontSize: styles.expandIconFontSize }),
    },
    checkbox: {
      width: theme.checkbox.width,
      height: theme.checkbox.height,
      marginRight: theme.checkbox.marginRight,
      accentColor: theme.checkbox.accentColor,
      cursor: theme.checkbox.cursor,
      transition: theme.checkbox.transition,
      borderRadius: theme.checkbox.borderRadius,
      border: theme.checkbox.border,
      backgroundColor:
        theme.checkbox.backgroundColor === 'rgba(0, 0, 0, 0.5)'
          ? theme.checkbox.backgroundColor
          : 'transparent',
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundAttachment: 'initial',
      backgroundOrigin: 'initial',
      backgroundClip: 'initial',
      ...(styles.checkboxWidth && { width: styles.checkboxWidth }),
      ...(styles.checkboxHeight && { height: styles.checkboxHeight }),
      ...(styles.checkboxMarginRight && {
        marginRight: styles.checkboxMarginRight,
      }),
      ...(styles.checkboxAccentColor && {
        accentColor: styles.checkboxAccentColor,
      }),
      ...(styles.checkboxBorderRadius && {
        borderRadius: styles.checkboxBorderRadius,
      }),
      ...(styles.checkboxBorder && { border: styles.checkboxBorder }),
      ...(styles.checkboxBackground && {
        backgroundColor: styles.checkboxBackground,
      }),
    },
    label: {
      ...theme.label,
      ...(styles.labelFontSize && { fontSize: styles.labelFontSize }),
      ...(styles.labelFontWeight && { fontWeight: styles.labelFontWeight }),
      ...(styles.labelColor && { color: styles.labelColor }),
      ...(styles.labelTextShadow && { textShadow: styles.labelTextShadow }),
    },
    content: {
      ...theme.content,
      paddingLeft: `${styles.itemChildrenIndentation || 24}px`,
      ...(styles.contentBorderLeft && { borderLeft: styles.contentBorderLeft }),
      ...(styles.contentMarginLeft && { marginLeft: styles.contentMarginLeft }),
    },
  }
}

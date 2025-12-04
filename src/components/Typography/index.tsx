'use client'

import React from 'react'

const SACRED_GOLD = '#FFD700'

export interface TypographyProps {
  text?: string
  children?: React.ReactNode
  variant?: 'h5' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h6' | string
  color?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
  marginBottom?: string
  marginTop?: string
  width?: string
  outline?: string
  gutterBottom?: boolean
  styles?: {
    variant?: string
    color?: string
    fontSize?: string
    fontFamily?: string
    fontWeight?: number | string
    textAlign?: 'left' | 'center' | 'right'
    marginBottom?: string
    marginTop?: string
    marginLeft?: string
    marginRight?: string
    margin?: string
    padding?: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    lineHeight?: string | number
    letterSpacing?: string
    textShadow?: string
    fontStyle?: string
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
    opacity?: number | string
    maxWidth?: string
    minWidth?: string
    backgroundColor?: string
    borderLeft?: string
    flex?: string | number
    alignSelf?: string
    theme?: 'sacred' | 'dark' | 'light' | string
    outline?: string | boolean
    width?: string
    gutterBottom?: boolean
    borderRadius?: string
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | string
    textOverflow?: 'clip' | 'ellipsis' | string
  }
}

const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  variant = 'body1',
  color,
  fontSize,
  fontFamily,
  fontWeight,
  textAlign = 'left',
  marginBottom,
  marginTop,
  width,
  outline,
  gutterBottom,
  styles,
}) => {
  const isSacred = styles?.theme === 'sacred'

  // Extract from styles if provided
  const finalVariant = styles?.variant || variant
  const finalColor =
    styles?.color ||
    color ||
    (isSacred ? SACRED_GOLD : 'rgba(255, 255, 255, 0.9)')
  const finalFontSize = styles?.fontSize || fontSize
  const finalFontFamily =
    styles?.fontFamily || fontFamily || '"Crimson Text", serif'
  const finalFontWeight = styles?.fontWeight || fontWeight
  const finalTextAlign = styles?.textAlign || textAlign
  const finalMarginBottom = styles?.marginBottom || marginBottom || '0'
  const finalMarginTop = styles?.marginTop || marginTop || '0'
  const finalMarginLeft = styles?.marginLeft || '0'
  const finalMarginRight = styles?.marginRight || '0'
  const finalMargin = styles?.margin
  const finalPadding = styles?.padding
  const finalPaddingLeft = styles?.paddingLeft
  const finalPaddingRight = styles?.paddingRight
  const finalPaddingTop = styles?.paddingTop
  const finalPaddingBottom = styles?.paddingBottom
  const finalLineHeight = styles?.lineHeight
  const finalLetterSpacing = styles?.letterSpacing
  const finalTextShadow = styles?.textShadow
  const finalFontStyle = styles?.fontStyle
  const finalTextTransform = styles?.textTransform
  const finalWhiteSpace = styles?.whiteSpace
  const finalOpacity = styles?.opacity
  const finalMaxWidth = styles?.maxWidth
  const finalMinWidth = styles?.minWidth
  const finalBackgroundColor = styles?.backgroundColor
  const finalBorderLeft = styles?.borderLeft
  const finalFlex = styles?.flex
  const finalAlignSelf = styles?.alignSelf
  const finalWidth = styles?.width || width
  const finalBorderRadius = styles?.borderRadius
  const finalOverflow = styles?.overflow
  const finalTextOverflow = styles?.textOverflow
  // Handle outline - convert boolean to string if needed
  const rawOutline = styles?.outline ?? outline
  const finalOutline =
    rawOutline === true ? 'none' : rawOutline === false ? undefined : rawOutline
  const finalGutterBottom = styles?.gutterBottom ?? gutterBottom ?? false

  const getVariantStyles = (): React.CSSProperties => {
    const v = String(finalVariant).toLowerCase()

    // Sacred theme variants
    if (v.includes('cinzel')) {
      if (v.includes('h1')) {
        return {
          fontSize: finalFontSize || '2.5rem',
          fontWeight: 700,
          fontFamily: '"Cinzel", serif',
        }
      }
      if (v.includes('h2')) {
        return {
          fontSize: finalFontSize || '2rem',
          fontWeight: 700,
          fontFamily: '"Cinzel", serif',
        }
      }
      if (v.includes('h3')) {
        return {
          fontSize: finalFontSize || '1.75rem',
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
        }
      }
      if (v.includes('h4')) {
        return {
          fontSize: finalFontSize || '1.5rem',
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
        }
      }
      if (v.includes('h5')) {
        return {
          fontSize: finalFontSize || '1.25rem',
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
        }
      }
      if (v.includes('h6')) {
        return {
          fontSize: finalFontSize || '1.1rem',
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
        }
      }
      return {
        fontSize: finalFontSize || '1rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }

    // Merriweather helper/footer text
    if (v.includes('merri') && (v.includes('helper') || v.includes('footer'))) {
      return {
        fontSize: finalFontSize || '0.85rem',
        fontWeight: 400,
        fontFamily: '"Merriweather", serif',
        color: isSacred ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 255, 255, 0.6)',
      }
    }

    // Standard heading variants
    if (v.includes('h1')) {
      return {
        fontSize: finalFontSize || '2.5rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('h2')) {
      return {
        fontSize: finalFontSize || '2rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('h3')) {
      return {
        fontSize: finalFontSize || '1.75rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('h4')) {
      return {
        fontSize: finalFontSize || '1.5rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('h5')) {
      return {
        fontSize: finalFontSize || '1.25rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('h6')) {
      return {
        fontSize: finalFontSize || '1rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", serif',
      }
    }
    if (v.includes('body2') || v.includes('small')) {
      return { fontSize: finalFontSize || '0.875rem', fontWeight: 400 }
    }

    // body1 and default
    return { fontSize: finalFontSize || '1rem', fontWeight: 400 }
  }

  const variantStyles = getVariantStyles()
  const isHeading = String(finalVariant).toLowerCase().includes('h')
  const content = text || children

  return (
    <p
      style={{
        ...variantStyles,
        color: variantStyles.color || finalColor,
        fontFamily:
          variantStyles.fontFamily ||
          (isHeading ? '"Cinzel", serif' : finalFontFamily),
        fontWeight: finalFontWeight || variantStyles.fontWeight,
        textAlign: finalTextAlign,
        margin: finalMargin,
        marginTop: finalMargin ? undefined : finalMarginTop,
        marginBottom: finalMargin
          ? undefined
          : finalGutterBottom
            ? '0.35em'
            : finalMarginBottom,
        marginLeft: finalMargin ? undefined : finalMarginLeft,
        marginRight: finalMargin ? undefined : finalMarginRight,
        padding: finalPadding,
        paddingLeft: finalPadding ? undefined : finalPaddingLeft,
        paddingRight: finalPadding ? undefined : finalPaddingRight,
        paddingTop: finalPadding ? undefined : finalPaddingTop,
        paddingBottom: finalPadding ? undefined : finalPaddingBottom,
        lineHeight: finalLineHeight,
        letterSpacing: finalLetterSpacing,
        textShadow: finalTextShadow,
        fontStyle: finalFontStyle,
        textTransform: finalTextTransform,
        whiteSpace: finalWhiteSpace,
        opacity: finalOpacity,
        maxWidth: finalMaxWidth,
        minWidth: finalMinWidth,
        backgroundColor: finalBackgroundColor,
        borderLeft: finalBorderLeft,
        flex: finalFlex,
        alignSelf: finalAlignSelf,
        width: finalWidth,
        outline: finalOutline,
        borderRadius: finalBorderRadius,
        overflow: finalOverflow,
        textOverflow: finalTextOverflow,
      }}
    >
      {content}
    </p>
  )
}

export default Typography

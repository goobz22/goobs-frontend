'use client'

import React from 'react'

export interface TypographyProps {
  text?: string
  children?: React.ReactNode
  variant?: 'h5' | 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h6' | string
  color?: string
  fontSize?: string
  fontFamily?: string
  textAlign?: 'left' | 'center' | 'right'
  marginBottom?: string
  styles?: {
    variant?: string
    color?: string
    fontSize?: string
    fontFamily?: string
    textAlign?: 'left' | 'center' | 'right'
    marginBottom?: string
    theme?: string
    [key: string]: any
  }
  sacredtheme?: boolean
}

const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  variant = 'body1',
  color,
  fontSize,
  fontFamily,
  textAlign = 'left',
  marginBottom = '0px',
  styles,
}) => {
  // Extract from styles if provided
  const finalVariant = styles?.variant || variant
  const finalColor = styles?.color || color || 'rgba(255, 255, 255, 0.9)'
  const finalFontSize = styles?.fontSize || fontSize
  const finalFontFamily =
    styles?.fontFamily || fontFamily || '"Crimson Text", serif'
  const finalTextAlign = styles?.textAlign || textAlign
  const finalMarginBottom = styles?.marginBottom || marginBottom

  const getVariantStyles = () => {
    const v = String(finalVariant).toLowerCase()
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
      return {
        fontSize: finalFontSize || '0.875rem',
        fontWeight: 400,
      }
    }
    // body1 and default
    return {
      fontSize: finalFontSize || '1rem',
      fontWeight: 400,
    }
  }

  const variantStyles = getVariantStyles()
  const isHeading = String(finalVariant).toLowerCase().includes('h')

  const content = text || children

  return (
    <p
      style={{
        ...variantStyles,
        color: finalColor,
        fontFamily: isHeading ? variantStyles.fontFamily : finalFontFamily,
        textAlign: finalTextAlign,
        marginBottom: finalMarginBottom,
        margin: finalMarginBottom ? `0 0 ${finalMarginBottom} 0` : '0',
      }}
    >
      {content}
    </p>
  )
}

export default Typography

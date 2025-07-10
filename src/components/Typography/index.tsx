'use client'
import React, { useEffect } from 'react'

export type CustomTypographyVariant =
  | 'merriparagraph'
  | 'merrihelperfooter'
  | 'merrih1'
  | 'merrih2'
  | 'merrih3'
  | 'merrih4'
  | 'merrih5'
  | 'merrih6'

export interface TypographyProps {
  text?: string
  children?: React.ReactNode
  fontvariant?: CustomTypographyVariant
  fontcolor?: string
  align?: 'left' | 'center' | 'right'
  gutterBottom?: boolean
  className?: string
  sacredtheme?: boolean
  outline?: boolean
  style?: React.CSSProperties
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  base: {
    margin: 0,
    padding: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
  } as React.CSSProperties,

  variants: {
    merrih1: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merrih2: {
      fontSize: '1.875rem', // 30px
      fontWeight: '700',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merrih3: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merrih4: {
      fontSize: '1.25rem', // 20px
      fontWeight: '600',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.4',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merrih5: {
      fontSize: '1.125rem', // 18px
      fontWeight: '500',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.4',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merrih6: {
      fontSize: '1rem', // 16px
      fontWeight: '500',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.5',
      color: 'rgb(17, 24, 39)',
    } as React.CSSProperties,

    merriparagraph: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.6',
      color: 'rgb(55, 65, 81)',
    } as React.CSSProperties,

    merrihelperfooter: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      fontFamily: 'Merriweather, serif',
      lineHeight: '1.5',
      color: 'rgb(107, 114, 128)',
    } as React.CSSProperties,
  },

  alignment: {
    left: { textAlign: 'left' } as React.CSSProperties,
    center: { textAlign: 'center' } as React.CSSProperties,
    right: { textAlign: 'right' } as React.CSSProperties,
  },

  gutterBottom: {
    marginBottom: '1rem',
  } as React.CSSProperties,

  outline: {
    textShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  base: {
    margin: 0,
    padding: 0,
    transition: 'all 0.4s ease',
    lineHeight: '1.6',
    letterSpacing: '0.02em',
    position: 'relative',
  } as React.CSSProperties,

  variants: {
    merrih1: {
      fontSize: '2.5rem', // 40px
      fontWeight: '700',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.2',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow:
        '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
      animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
    } as React.CSSProperties,

    merrih2: {
      fontSize: '2rem', // 32px
      fontWeight: '700',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.3',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow:
        '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)',
      animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
    } as React.CSSProperties,

    merrih3: {
      fontSize: '1.75rem', // 28px
      fontWeight: '600',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.3',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow:
        '0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3)',
    } as React.CSSProperties,

    merrih4: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.4',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow:
        '0 0 8px rgba(255, 215, 0, 0.5), 0 0 16px rgba(255, 215, 0, 0.2)',
    } as React.CSSProperties,

    merrih5: {
      fontSize: '1.25rem', // 20px
      fontWeight: '500',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.4',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
    } as React.CSSProperties,

    merrih6: {
      fontSize: '1.125rem', // 18px
      fontWeight: '500',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.5',
      letterSpacing: '0.05em',
      color: '#FFD700',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.3)',
    } as React.CSSProperties,

    merriparagraph: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.6',
      letterSpacing: '0.02em',
      color: 'rgba(255, 215, 0, 0.9)',
      textShadow: '0 0 3px rgba(255, 215, 0, 0.3)',
    } as React.CSSProperties,

    merrihelperfooter: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      fontFamily: 'Cinzel, serif',
      lineHeight: '1.5',
      letterSpacing: '0.02em',
      color: 'rgba(255, 215, 0, 0.7)',
      textShadow: '0 0 2px rgba(255, 215, 0, 0.2)',
    } as React.CSSProperties,
  },

  alignment: {
    left: { textAlign: 'left' } as React.CSSProperties,
    center: { textAlign: 'center' } as React.CSSProperties,
    right: { textAlign: 'right' } as React.CSSProperties,
  },

  gutterBottom: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  outline: {
    textShadow: '0 0 2px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.6)',
    background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), transparent)',
    WebkitBackgroundClip: 'text',
    padding: '2px 4px',
    borderRadius: '4px',
  } as React.CSSProperties,
}

const Typography: React.FC<TypographyProps> = ({
  text,
  children,
  fontvariant = 'merriparagraph',
  fontcolor,
  align = 'left',
  gutterBottom = false,
  sacredtheme = false,
  outline = false,
  style = {},
  ...rest
}) => {
  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredTextGlow {
          0% { 
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3);
            filter: brightness(1);
          }
          100% { 
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.5);
            filter: brightness(1.2);
          }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const combinedStyle: React.CSSProperties = {
    ...styles.base,
    ...styles.variants[fontvariant],
    ...styles.alignment[align],
    ...(gutterBottom && styles.gutterBottom),
    ...(outline && styles.outline),
    ...(fontcolor && !sacredtheme && { color: fontcolor }),
    ...style,
  }

  // Render the appropriate element based on variant
  switch (fontvariant) {
    case 'merrih1':
      return (
        <h1 style={combinedStyle} {...rest}>
          {children || text}
        </h1>
      )
    case 'merrih2':
      return (
        <h2 style={combinedStyle} {...rest}>
          {children || text}
        </h2>
      )
    case 'merrih3':
      return (
        <h3 style={combinedStyle} {...rest}>
          {children || text}
        </h3>
      )
    case 'merrih4':
      return (
        <h4 style={combinedStyle} {...rest}>
          {children || text}
        </h4>
      )
    case 'merrih5':
      return (
        <h5 style={combinedStyle} {...rest}>
          {children || text}
        </h5>
      )
    case 'merrih6':
      return (
        <h6 style={combinedStyle} {...rest}>
          {children || text}
        </h6>
      )
    default:
      return (
        <p style={combinedStyle} {...rest}>
          {children || text}
        </p>
      )
  }
}

export default Typography
export { Typography }

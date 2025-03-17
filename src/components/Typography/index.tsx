'use client'

import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
  useTheme,
} from '@mui/material'
import React, { JSX } from 'react'

export type FontFamily = 'arapey' | 'inter' | 'merri'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'paragraph'
  | 'helperheader'
  | 'helperfooter'

export type CustomTypographyVariant = `${FontFamily}${TypographyVariant}`

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  text?: string
  fontvariant?: CustomTypographyVariant
  fontcolor?: string
  variant?: CustomTypographyVariant | MuiTypographyProps['variant']
  children?: React.ReactNode
}

// MUI's TextTransform type
type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase'

// Define the structure expected for theme typography variants
interface TypographyVariantStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: number
  textTransform?: TextTransform
  lineHeight?: string | number
}

const arapeyStyles: Record<TypographyVariant, React.CSSProperties> = {
  h1: {
    fontFamily: 'Arapey, serif',
    fontSize: '3rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h2: {
    fontFamily: 'Arapey, serif',
    fontSize: '2.5rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h3: {
    fontFamily: 'Arapey, serif',
    fontSize: '2rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h4: {
    fontFamily: 'Arapey, serif',
    fontSize: '1.5rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h5: {
    fontFamily: 'Arapey, serif',
    fontSize: '1.25rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h6: {
    fontFamily: 'Arapey, serif',
    fontSize: '1.1rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  paragraph: {
    fontFamily: 'Arapey, serif',
    fontSize: '1rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperheader: {
    fontFamily: 'Arapey, serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperfooter: {
    fontFamily: 'Arapey, serif',
    fontSize: '0.75rem',
    fontWeight: 400,
    textTransform: 'none',
  },
}

const interStyles: Record<TypographyVariant, React.CSSProperties> = {
  h1: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '3rem',
    fontWeight: 700,
    textTransform: 'none',
  },
  h2: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '2.5rem',
    fontWeight: 700,
    textTransform: 'none',
  },
  h3: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '2rem',
    fontWeight: 600,
    textTransform: 'none',
  },
  h4: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    textTransform: 'none',
  },
  h5: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.25rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  h6: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  paragraph: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperheader: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperfooter: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 400,
    textTransform: 'none',
  },
}

const merriStyles: Record<TypographyVariant, React.CSSProperties> = {
  h1: {
    fontFamily: 'Merriweather, serif',
    fontSize: '3rem',
    fontWeight: 700,
    textTransform: 'none',
  },
  h2: {
    fontFamily: 'Merriweather, serif',
    fontSize: '2.5rem',
    fontWeight: 700,
    textTransform: 'none',
  },
  h3: {
    fontFamily: 'Merriweather, serif',
    fontSize: '2rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h4: {
    fontFamily: 'Merriweather, serif',
    fontSize: '1.5rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h5: {
    fontFamily: 'Merriweather, serif',
    fontSize: '1.25rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  h6: {
    fontFamily: 'Merriweather, serif',
    fontSize: '1.1rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  paragraph: {
    fontFamily: 'Merriweather, serif',
    fontSize: '1rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperheader: {
    fontFamily: 'Merriweather, serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    textTransform: 'none',
  },
  helperfooter: {
    fontFamily: 'Merriweather, serif',
    fontSize: '0.75rem',
    fontWeight: 400,
    textTransform: 'none',
  },
}

const Typography = ({
  text,
  fontcolor,
  fontvariant,
  variant,
  children,
  style,
  ...rest
}: TypographyProps): JSX.Element => {
  const theme = useTheme()
  let variantStyle: Record<string, unknown> = {}
  const actualVariant = fontvariant || variant

  if (typeof actualVariant === 'string' && actualVariant.length > 0) {
    // First, try to get the variant from the theme
    try {
      // Check if we're using a custom font variant (e.g., 'merrih2')
      if (/^(arapey|inter|merri)/.test(actualVariant)) {
        // For custom variants, we need to check if they exist in the theme
        // Use Record to avoid TypeScript errors
        const themeTypography = theme.typography as unknown as Record<
          string,
          unknown
        >

        if (themeTypography && actualVariant in themeTypography) {
          // Custom variant exists in theme, use its properties
          const themeVariant = themeTypography[
            actualVariant
          ] as TypographyVariantStyle

          if (themeVariant) {
            variantStyle = {
              fontFamily: themeVariant.fontFamily,
              fontSize: themeVariant.fontSize,
              fontWeight: themeVariant.fontWeight,
              textTransform: themeVariant.textTransform,
              lineHeight: themeVariant.lineHeight,
            }
          }
        } else {
          // Custom variant not in theme, fallback to hardcoded styles
          const fontFamily = actualVariant.startsWith('arapey')
            ? 'arapey'
            : actualVariant.startsWith('inter')
              ? 'inter'
              : actualVariant.startsWith('merri')
                ? 'merri'
                : null

          if (fontFamily) {
            const variantPart = actualVariant.slice(
              fontFamily.length
            ) as TypographyVariant

            switch (fontFamily) {
              case 'arapey':
                variantStyle = { ...arapeyStyles[variantPart] }
                break
              case 'inter':
                variantStyle = { ...interStyles[variantPart] }
                break
              case 'merri':
                variantStyle = { ...merriStyles[variantPart] }
                break
            }
          }
        }
      } else {
        // Standard MUI variant (h1, h2, etc.)
        // Let MUI handle these by setting the variant prop
      }
    } catch (error) {
      console.error('Error applying typography variant:', error)
    }
  }

  // Combine custom styles with variant-derived styles
  const combinedStyle = {
    ...variantStyle,
    ...(fontcolor ? { color: fontcolor } : {}),
    ...(style || {}),
  }

  return (
    <MuiTypography component="div" style={combinedStyle} {...rest}>
      {text || children}
    </MuiTypography>
  )
}

export { Typography }
export default Typography

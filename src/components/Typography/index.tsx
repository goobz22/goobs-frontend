'use client'

import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'
import React from 'react'

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

type CustomTypographyVariant = `${FontFamily}${TypographyVariant}`

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  text?: string
  fontvariant?: CustomTypographyVariant
  fontcolor?: string
  variant?: CustomTypographyVariant | MuiTypographyProps['variant']
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

export const Typography: React.FC<TypographyProps> = ({
  text,
  fontcolor,
  fontvariant,
  variant,
  ...rest
}) => {
  let variantStyle: React.CSSProperties = {}
  const actualVariant = fontvariant || variant

  if (typeof actualVariant === 'string') {
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
          variantStyle = arapeyStyles[variantPart] || {}
          break
        case 'inter':
          variantStyle = interStyles[variantPart] || {}
          break
        case 'merri':
          variantStyle = merriStyles[variantPart] || {}
          break
      }
    }
  }

  return (
    <MuiTypography
      style={{
        color: fontcolor,
        ...variantStyle,
      }}
      variant={actualVariant as MuiTypographyProps['variant']}
      {...rest}
    >
      {text}
    </MuiTypography>
  )
}

export default Typography

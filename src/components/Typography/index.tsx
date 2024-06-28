import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
  TypographyPropsVariantOverrides as MuiTypographyPropsVariantOverrides,
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

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<`${FontFamily}${TypographyVariant}`, true> {}
}

export type TypographyPropsVariantOverrides =
  MuiTypographyPropsVariantOverrides &
    Record<`${FontFamily}${TypographyVariant}`, true>

export interface TypographyProps {
  text?: string
  fontvariant?: keyof TypographyPropsVariantOverrides
  fontcolor?: string
}

/**
 * arapeyStyles object contains the styles for typography variants using the Arapey font family.
 */
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

/**
 * interStyles object contains the styles for typography variants using the Inter font family.
 */
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

/**
 * merriStyles object contains the styles for typography variants using the Merriweather font family.
 */
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

/**
 * Typography component is a wrapper around MuiTypography that applies custom styles based on the fontvariant prop.
 * It supports different font families (Arapey, Inter, Merriweather) and typography variants (h1, h2, h3, h4, h5, h6, paragraph, helperheader, helperfooter).
 * @param props The props for the Typography component.
 * @returns The rendered Typography component.
 */
export const Typography: React.FC<TypographyProps & MuiTypographyProps> = ({
  text,
  fontcolor,
  fontvariant,
  ...rest
}) => {
  let variantStyle: React.CSSProperties = {}

  if (fontvariant) {
    const fontFamily = fontvariant.startsWith('arapey')
      ? 'arapey'
      : fontvariant.startsWith('inter')
        ? 'inter'
        : fontvariant.startsWith('merri')
          ? 'merri'
          : null

    if (fontFamily) {
      const variant = fontvariant.slice(fontFamily.length) as TypographyVariant
      switch (fontFamily) {
        case 'arapey':
          variantStyle = arapeyStyles[variant] || {}
          break
        case 'inter':
          variantStyle = interStyles[variant] || {}
          break
        case 'merri':
          variantStyle = merriStyles[variant] || {}
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
      variant={fontvariant}
      {...rest}
    >
      {text}
    </MuiTypography>
  )
}

export default Typography

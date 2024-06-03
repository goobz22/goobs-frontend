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

export const Typography: React.FC<TypographyProps & MuiTypographyProps> = ({
  text,
  fontcolor,
  fontvariant,
  ...rest
}) => {
  return (
    <MuiTypography style={{ color: fontcolor }} variant={fontvariant} {...rest}>
      {text}
    </MuiTypography>
  )
}

export default Typography

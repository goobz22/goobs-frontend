import {
  TypographyPropsVariantOverrides,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { columnconfig, cellconfig } from '@/types/grid/customgrid'
import React from 'react'

export type TextTransform =
  | 'none'
  | 'capitalize'
  | 'uppercase'
  | 'lowercase'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'

export interface CustomTypographyVariant {
  fontFamily: string
  fontSize: string
  fontWeight: number
  textTransform?: TextTransform
}

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

export type CustomTypographyOptions = TypographyOptions & {
  // eslint-disable-next-line no-unused-vars
  [key in `${FontFamily}${TypographyVariant}`]?: CustomTypographyVariant
}

declare module '@mui/material/styles' {
  interface TypographyVariants
    extends Record<`${FontFamily}${TypographyVariant}`, React.CSSProperties> {}
  interface TypographyVariantsOptions
    extends Partial<
      Record<`${FontFamily}${TypographyVariant}`, React.CSSProperties>
    > {}
  export type TypographyVariant = keyof TypographyVariants
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<`${FontFamily}${TypographyVariant}`, true> {}
}

export interface TypographyProps extends MuiTypographyProps {
  text?: string
  fontvariant?: keyof TypographyPropsVariantOverrides
  fontcolor?: string
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

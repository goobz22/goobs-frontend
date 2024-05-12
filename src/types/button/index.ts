import React from 'react'
import { ButtonProps, TypographyPropsVariantOverrides } from '@mui/material'
import { ColorPaletteKeys } from '@/themes/palette'
import { HelperFooterMessage } from '@/types/validation'
import { Alignment } from '@/types/content/alignment'
import { columnconfig } from '@/types/grid/customgrid'

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    [key: string]: true
  }
  interface ButtonPropsVariantOverrides {
    [key: string]: true
  }
}

export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  text?: string
  backgroundcolor?: ColorPaletteKeys
  outlinecolor?: ColorPaletteKeys
  fontcolor?: ColorPaletteKeys
  fontlocation?: Alignment
  fontsize?: keyof TypographyPropsVariantOverrides
  icon?: React.ReactNode | false
  iconcolor?: ColorPaletteKeys
  iconsize?: string
  iconlocation?: 'left' | 'top' | 'right'
  variant?: 'text' | 'outlined' | 'contained'
  onClick?: () => void
  helperfooter?: HelperFooterMessage
  columnconfig?: columnconfig
  width?: string
  formname?: string
  name?: string
}

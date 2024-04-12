import { ButtonProps } from '@mui/material'
import { ColorPaletteKeys } from '@/themes/palette'
import { HelperFooterMessage } from '@/types/validation'
import React from 'react'

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
  fontlocation?: 'left' | 'center' | 'right'
  fontsize?:
    | 'merrih1'
    | 'merrih2'
    | 'merrih3'
    | 'merriparagraph'
    | 'merrihelperfooter'
  icon?: React.ReactNode
  iconcolor?: ColorPaletteKeys
  iconlocation?: 'left' | 'top' | 'right'
  variant?: 'text' | 'outlined' | 'contained'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  helperfooter?: HelperFooterMessage
}

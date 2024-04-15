import React from 'react'
import { ButtonProps } from '@mui/material'
import { ColorPaletteKeys } from '@/themes/palette'
import { HelperFooterMessage } from '@/types/validation'

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
  name?: string
  backgroundcolor?: ColorPaletteKeys
  outlinecolor?: ColorPaletteKeys
  fontcolor?: ColorPaletteKeys
  fontlocation?: 'left' | 'center' | 'right'
  fontsize?:
    | 'merrih1'
    | 'merrih2'
    | 'merrih5'
    | 'merriparagraph'
    | 'merrihelperfooter'
  icon?: false | React.ReactNode
  iconcolor?: ColorPaletteKeys
  iconlocation?: 'left' | 'top' | 'right'
  variant?: 'text' | 'outlined' | 'contained'
  onClick?: (
    // eslint-disable-next-line no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ) => void
  helperfooter?: HelperFooterMessage
}

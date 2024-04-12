import { ColorPaletteKeys } from '@/themes/palette'
import React, { RefObject } from 'react'
import { HelperFooterMessage } from '@/types/validation'

declare module '@mui/material/OutlinedInput' {
  interface OutlinedInputPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/FormControl' {
  interface FormControlPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    [key: string]: true
  }
}

// Define your custom props for the styled component
export interface StyledComponentProps {
  name?: string
  outlinecolor?: ColorPaletteKeys
  iconcolor?: ColorPaletteKeys
  backgroundcolor?: ColorPaletteKeys
  combinedfontcolor?: ColorPaletteKeys
  unshrunkfontcolor?: ColorPaletteKeys
  shrunkfontcolor?: ColorPaletteKeys
  autoComplete?: string
  componentvariant:
    | 'multilinetextfield'
    | 'dropdown'
    | 'searchbar'
    | 'textfield'
    | 'phonenumber'
    | 'password'
    | 'ip-address'
    | 'email'
    | 'url'
    | 'credit-card'
    | 'number'
    | 'hostname'
    | 'domain'
    | 'time'
    | 'date'
  options?: readonly string[]
  helperfooter?: HelperFooterMessage
  placeholder?: string
  minRows?: number
  label?: string
  shrunklabellocation?: 'onnotch' | 'above' | 'left'
  value?: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
}

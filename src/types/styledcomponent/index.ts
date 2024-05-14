import React, { RefObject } from 'react'
import { ColorPaletteKeys } from '@/themes/palette'
import { HelperFooterMessage } from '@/types/validation'
import { columnconfig } from '@/types/grid/customgrid'

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

export interface StyledComponentProps {
  name?: string
  outlinecolor?: ColorPaletteKeys
  iconcolor?: ColorPaletteKeys
  backgroundcolor?: ColorPaletteKeys
  combinedfontcolor?: ColorPaletteKeys
  unshrunkfontcolor?: ColorPaletteKeys
  shrunkfontcolor?: ColorPaletteKeys
  endAdornmentMarginRight?: number | string
  autoComplete?: string
  componentvariant?:
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
  formname?: string
  label?: string
  shrunklabellocation?: 'onnotch' | 'above' | 'left'
  value?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
  columnconfig?: columnconfig
  serverActionValidation?: (
    formData: FormData
  ) => Promise<HelperFooterMessage | undefined>
}

export interface AdornmentProps {
  componentvariant: string
  passwordVisible?: boolean
  // eslint-disable-next-line no-unused-vars
  togglePasswordVisibility?: (event: React.MouseEvent<HTMLDivElement>) => void
  // eslint-disable-next-line no-unused-vars
  marginRight?: number | string
}
import { TypographyPropsVariantOverrides } from '@mui/material'
import { columnconfig } from 'goobs-repo'

export interface LinkProps {
  link: string
  text: string
  fontvariant?: keyof TypographyPropsVariantOverrides
  fontcolor: string
  columnconfig: columnconfig
}

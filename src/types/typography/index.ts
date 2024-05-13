import {
  TypographyPropsVariantOverrides,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'
import { columnconfig, cellconfig } from '@/types/grid/customgrid'

export interface TypographyProps extends MuiTypographyProps {
  text?: string
  fontvariant?: keyof TypographyPropsVariantOverrides
  fontcolor?: string
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

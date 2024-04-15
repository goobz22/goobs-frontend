import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'
import React from 'react'
import { theme } from '@/themes/palette'

interface CustomTypographyProps extends MuiTypographyProps {
  fontcolor?: keyof typeof theme.palette
}

export const Typography: React.FC<CustomTypographyProps> = ({
  children,
  fontcolor,
  ...rest
}) => {
  const color = fontcolor ? theme.palette[fontcolor].main : undefined

  return (
    <MuiTypography style={{ color }} {...rest}>
      {children}
    </MuiTypography>
  )
}

export default Typography

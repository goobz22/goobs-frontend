import { Typography as MuiTypography } from '@mui/material'
import { TypographyProps } from '../../types/typography'
import React from 'react'

export const Typography: React.FC<TypographyProps> = ({
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

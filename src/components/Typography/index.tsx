import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'

interface CustomTypographyProps extends MuiTypographyProps {
  fontcolor?: string
}

export const Typography: React.FC<CustomTypographyProps> = ({
  children,
  fontcolor,
  ...rest
}) => {
  return (
    <MuiTypography style={{ color: fontcolor }} {...rest}>
      {children}
    </MuiTypography>
  )
}

export default Typography

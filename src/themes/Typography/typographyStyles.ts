import { CSSObject } from '@emotion/react'

interface TypographyStylesProps {
  fontcolor?: string
}

export const typographyStyles = ({
  fontcolor,
}: TypographyStylesProps): CSSObject => {
  return {
    '&.MuiTypography-root': {
      color: fontcolor,
    },
  }
}

export default typographyStyles

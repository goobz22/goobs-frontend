import { CSSObject } from '@emotion/react'
import { CustomButtonProps } from '@/types/button'
import { theme } from '../palette'

export const buttonStyles = (
  props: Pick<
    CustomButtonProps,
    'outlinecolor' | 'fontlocation' | 'iconcolor' | 'backgroundcolor'
  >
): CSSObject => {
  const { outlinecolor, fontlocation, iconcolor, backgroundcolor } = props

  const height = 'auto'
  let justifyContent = 'center'

  if (fontlocation === 'left') {
    justifyContent = 'flex-start'
  } else if (fontlocation === 'right') {
    justifyContent = 'flex-end'
  }

  return {
    '&.MuiButton-contained': {
      width: '100%',
      height: height,
      justifyContent: justifyContent,
      whiteSpace: 'nowrap',
      backgroundColor: backgroundcolor
        ? theme.palette[backgroundcolor]?.main
        : undefined,
      minWidth: 'max-content',
    },
    '&.MuiButton-outlined': {
      border: outlinecolor
        ? `1px solid ${theme.palette[outlinecolor]?.main} !important`
        : undefined,
      color: iconcolor
        ? `${theme.palette[iconcolor]?.main} !important`
        : undefined,
      width: '100%',
      height: height,
      justifyContent: justifyContent,
      minWidth: 'max-content',
      whiteSpace: 'nowrap',
    },
    '&.MuiButton-text': {
      border: outlinecolor
        ? `1px solid ${theme.palette[outlinecolor]?.main} !important`
        : undefined,
      color: iconcolor
        ? `${theme.palette[iconcolor]?.main} !important`
        : undefined,
      width: '100%',
      height: height,
      justifyContent: justifyContent,
      minWidth: 'max-content',
      whiteSpace: 'nowrap',
    },
  }
}

export default buttonStyles

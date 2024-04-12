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

  const height = 'auto' // Changed to const since it is not reassigned
  let justifyContent = 'center' // This stays 'let' since it's reassigned below

  if (fontlocation === 'left') {
    justifyContent = 'flex-start'
  } else if (fontlocation === 'right') {
    justifyContent = 'flex-end'
  }

  return {
    '&.MuiButton-contained': {
      width: '100%', // Set width to 100% for full width
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
      width: '100%', // Set width to 100% for full width
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
      width: '100%', // Set width to 100% for full width
      height: height,
      justifyContent: justifyContent,
      minWidth: 'max-content',
      whiteSpace: 'nowrap',
    },
  }
}

export default buttonStyles

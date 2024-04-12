import { CSSObject } from '@emotion/react'
import { StyledComponentProps } from '@/types/styledcomponent'
import { Theme } from '@mui/material'

export const formControlStyles = (
  props: Pick<
    StyledComponentProps,
    | 'outlinecolor'
    | 'backgroundcolor'
    | 'componentvariant'
    | 'unshrunkfontcolor'
    | 'shrunkfontcolor'
    | 'combinedfontcolor'
    | 'iconcolor'
    | 'shrunklabellocation'
    | 'helperfooter'
  >,
  theme: Theme
): CSSObject => {
  const { outlinecolor, componentvariant } = props

  const getColorValue = (colorKey: string | undefined) => {
    if (!colorKey) return 'inherit'
    const [colorName, colorVariant = 'main'] = colorKey.split('.')
    const colorPalette = theme.palette[colorName as keyof typeof theme.palette]
    return colorPalette
      ? colorPalette[colorVariant as keyof typeof colorPalette]
      : 'inherit'
  }

  return {
    '& .MuiFormControl-root': {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      border: outlinecolor
        ? `1px solid ${getColorValue(outlinecolor)} !important`
        : 'inherit',
      borderColor: outlinecolor
        ? `1px solid ${getColorValue(outlinecolor)} !important`
        : 'inherit',
      width: '100%',
      position: 'relative',
      cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
      margin: 0,
      padding: 0,
    },
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: `38px`,
      left: `-10px`,
    },
  }
}

export default formControlStyles

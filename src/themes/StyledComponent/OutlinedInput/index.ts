import { CSSObject } from '@emotion/react'
import { StyledComponentProps } from '@/types/styledcomponent'
import { Theme } from '@mui/material'

export const outlinedInputStyles = (
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
  >,
  theme: Theme
): CSSObject => {
  const {
    outlinecolor,
    backgroundcolor,
    componentvariant,
    unshrunkfontcolor,
    combinedfontcolor,
    iconcolor,
  } = props
  const defaultControlHeight = '40px'
  const multilineMinHeight = '85px'
  const inputPadding = '0 0px'
  const searchInputPadding = '0 14px 0 24px'

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

    '& .MuiOutlinedInput-root': {
      backgroundColor: getColorValue(backgroundcolor),
      width: '100%',
      cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
      height:
        componentvariant !== 'multilinetextfield'
          ? defaultControlHeight
          : 'auto',
      boxSizing: 'border-box',

      '&:hover': {
        backgroundColor: backgroundcolor
          ? getColorValue(backgroundcolor.replace('.main', '.dark'))
          : 'inherit',
      },

      '&.Mui-focused': {
        backgroundColor: backgroundcolor
          ? getColorValue(backgroundcolor.replace('.main', '.light'))
          : 'inherit',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: getColorValue(outlinecolor),
        },
      },

      '& fieldset': {
        border: outlinecolor
          ? `1px solid ${getColorValue(outlinecolor)} !important`
          : 'inherit',
      },

      '&:hover fieldset': {
        border: outlinecolor
          ? `1px solid ${getColorValue(outlinecolor.replace('.main', '.dark'))} !important`
          : 'inherit',
      },

      '& .MuiOutlinedInput-input': {
        width: '100%',
        color: combinedfontcolor
          ? getColorValue(combinedfontcolor)
          : unshrunkfontcolor
            ? getColorValue(unshrunkfontcolor)
            : 'inherit',
        padding:
          componentvariant === 'searchbar' ? searchInputPadding : inputPadding,
        height: '100%',
        cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
        ...(componentvariant === 'dropdown' && {
          pointerEvents: 'none',
          userSelect: 'none',
          readOnly: true,
          '&:focus': {
            cursor: 'pointer',
          },
        }),

        '& .MuiInputBase-root': {
          width: '100%',
          padding:
            componentvariant === 'searchbar'
              ? searchInputPadding
              : inputPadding,
          height: '100%',
          border: outlinecolor
            ? `1px solid ${getColorValue(outlinecolor)} !important`
            : 'inherit',
          borderColor: outlinecolor
            ? `1px solid ${getColorValue(outlinecolor)} !important`
            : 'inherit',
          '&.MuiInputBase-inputMultiline': {
            minHeight: multilineMinHeight,
            paddingTop: '0px',
            paddingLeft: '0px',
          },
        },

        '&.MuiInputBase-inputMultiline': {
          minHeight: multilineMinHeight,
          paddingTop: '0px',
          paddingLeft: '0px',
        },

        '&::placeholder': {
          color: combinedfontcolor
            ? getColorValue(combinedfontcolor)
            : unshrunkfontcolor
              ? getColorValue(unshrunkfontcolor)
              : 'inherit',
          opacity: 1,
        },
      },

      '& .MuiInputAdornment-positionStart': {
        margin: 0,
        position: 'absolute',
        left: '10px',
        right: 'auto',
        top: '50%',
        bottom: 'auto',
        transform: 'none',
        '& svg': {
          color: getColorValue(iconcolor),
        },
      },

      '& .MuiInputAdornment-positionEnd': {
        '& svg': {
          color: getColorValue(iconcolor),
        },
      },
    },
  }
}

export default outlinedInputStyles

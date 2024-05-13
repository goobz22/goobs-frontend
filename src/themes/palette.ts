import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    [key: string]: Palette['primary']
  }
  interface PaletteOptions {
    [key: string]: PaletteOptions['primary']
  }
  interface PaletteColorOptions {
    main: string
    light?: string
    dark?: string
  }
}

export const theme = createTheme({
  palette: {
    moss: {
      main: '#21475B',
      light: '#4C7186',
      dark: '#102A36',
    },
    aqua: {
      main: '#9CE4F8',
      light: '#C5F0FB',
      dark: '#6AB6D1',
    },
    madder: {
      main: '#4661A8',
      light: '#7488C1',
      dark: '#2C3E6E',
    },
    woad: {
      main: '#63B3DD',
      light: '#8ECAE6',
      dark: '#3E7DA3',
    },
    marine: {
      main: '#013E89',
      light: '#3367B2',
      dark: '#002756',
    },
    pansy: {
      main: '#7E5A75',
      light: '#A07E9B',
      dark: '#51384C',
    },
    stainlessSteel: {
      main: '#150D22',
      light: '#423753',
      dark: '#08060E',
    },
    coal: {
      main: '#151519',
      light: '#42424A',
      dark: '#0A0A0B',
    },
    ocean: {
      main: '#0E3065',
      light: '#355088',
      dark: '#081E40',
    },
    sky: {
      main: '#47C7FE',
      light: '#7ADAFE',
      dark: '#2D8CC1',
    },
    salmon: {
      main: '#E1A9A7',
      light: '#ECC7C5',
      dark: '#C47D7B',
    },
    lightning: {
      main: '#0880AC',
      light: '#35A7C9',
      dark: '#055A7D',
    },
    sage: {
      main: '#A6D0D6',
      light: '#C5E1E5',
      dark: '#7AA3A9',
    },
    lilac: {
      main: '#BEB9EA',
      light: '#D6D4F1',
      dark: '#8E8AC0',
    },
    gunpowder: {
      main: '#210352',
      light: '#4D337D',
      dark: '#11022A',
    },
    lightMadder: {
      main: '#4661A8',
      light: '#7488C1',
      dark: '#2C3E6E',
    },
    black: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
    },
    white: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#eeeeee',
    },
    none: {
      main: 'transparent',
      light: 'transparent',
      dark: 'transparent',
    },
    semiTransparentWhite: {
      main: 'rgba(255, 255, 255, 0.09)',
      light: 'rgba(255, 255, 255, 0.15)',
      dark: 'rgba(255, 255, 255, 0.05)',
    },
    semiTransparentBlack: {
      main: 'rgba(0, 0, 0, 0.09)',
      light: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(0, 0, 0, 0.05)',
    },
    red: {
      main: '#FF0000',
      light: '#FF4C4C',
      dark: '#B30000',
    },
    green: {
      main: '#00FF00',
      light: '#4CFF4C',
      dark: '#00B300',
    },
    greyborder: {
      main: '#E8E8E8',
      light: '#F5F5F5',
      dark: '#BDBDBD',
    },
  },
})

type ColorPaletteType = (typeof colorPalette)[number]
type ColorVariant = 'main' | 'light' | 'dark' | 'contrast'
export type ColorPaletteKeys =
  | `${ColorPaletteType}`
  | `${ColorPaletteType}.${ColorVariant}`

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/PaginationItem' {
  interface PaginationItemPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsColorOverrides {
    [key: string]: true
  }
}

export const colorPalette = [
  'moss',
  'greyborder',
  'aqua',
  'madder',
  'woad',
  'marine',
  'pansy',
  'stainlessSteel',
  'coal',
  'ocean',
  'sky',
  'salmon',
  'lightning',
  'sage',
  'lilac',
  'gunpowder',
  'lightMadder',
  'black',
  'white',
  'none',
  'red',
  'green',
  'semiTransparentWhite',
  'semiTransparentBlack',
] as const

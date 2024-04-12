import { Arapey, Inter, Merriweather } from 'next/font/google'
import { TypographyOptions } from '@mui/material/styles/createTypography'

// Explicitly define a type for textTransform to match allowed values
type TextTransform =
  | 'none'
  | 'capitalize'
  | 'uppercase'
  | 'lowercase'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'

interface CustomTypographyVariant {
  fontFamily: string
  fontSize: string
  fontWeight: number
  textTransform?: TextTransform
}

type FontFamily = 'arapey' | 'inter' | 'merri'
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'paragraph'
  | 'helperheader'
  | 'helperfooter'

type CustomTypographyOptions = TypographyOptions & {
  [key in `${FontFamily}${TypographyVariant}`]?: CustomTypographyVariant
}

declare module '@mui/material/styles' {
  interface TypographyVariants
    extends Record<`${FontFamily}${TypographyVariant}`, React.CSSProperties> {}
  interface TypographyVariantsOptions
    extends Partial<
      Record<`${FontFamily}${TypographyVariant}`, React.CSSProperties>
    > {}
  export type TypographyVariant = keyof TypographyVariants
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<`${FontFamily}${TypographyVariant}`, true> {}
}

// Define base configurations for each heading level
const h1Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.5rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h2Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.25rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h3Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.0rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h4Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '.9rem',
  fontWeight: 400,
  textTransform: 'none',
}

const paragraphConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '0.8rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperHeaderConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '0.7rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperFooterConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '0.7rem',
  fontWeight: 400,
  textTransform: 'none',
}

const arapey = Arapey({ weight: ['400'], subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })
const merriweather = Merriweather({ weight: ['400'], subsets: ['latin'] })

const typography: CustomTypographyOptions = {
  fontFamily: ['roboto', 'serif', 'sans-serif'].join(','),
  arapeyh1: {
    fontFamily: arapey.style.fontFamily,
    ...h1Config,
  },
  arapeyh2: {
    fontFamily: arapey.style.fontFamily,
    ...h2Config,
  },
  arapeyh3: {
    fontFamily: arapey.style.fontFamily,
    ...h3Config,
  },
  arapeyparagraph: {
    fontFamily: arapey.style.fontFamily,
    ...paragraphConfig,
  },
  interh1: {
    fontFamily: inter.style.fontFamily,
    ...h1Config,
  },
  interh2: {
    fontFamily: inter.style.fontFamily,
    ...h2Config,
  },
  interh3: {
    fontFamily: inter.style.fontFamily,
    ...h3Config,
  },
  interparagraph: {
    fontFamily: inter.style.fontFamily,
    ...paragraphConfig,
  },
  interhelperheader: {
    fontFamily: inter.style.fontFamily,
    ...helperHeaderConfig,
  },
  interhelperfooter: {
    fontFamily: inter.style.fontFamily,
    ...helperFooterConfig,
  },
  merrih1: {
    fontFamily: merriweather.style.fontFamily,
    ...h1Config,
  },
  merrih2: {
    fontFamily: merriweather.style.fontFamily,
    ...h2Config,
  },
  merrih3: {
    fontFamily: merriweather.style.fontFamily,
    ...h3Config,
  },
  merrih4: {
    fontFamily: merriweather.style.fontFamily,
    ...h4Config,
  },
  merriparagraph: {
    fontFamily: merriweather.style.fontFamily,
    ...paragraphConfig,
  },
  merrihelperfooter: {
    fontFamily: merriweather.style.fontFamily,
    ...helperFooterConfig,
  },
}

export default typography

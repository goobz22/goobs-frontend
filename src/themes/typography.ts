import {
  CustomTypographyVariant,
  CustomTypographyOptions,
} from '@/types/typography'

// Define base configurations for each heading level
const h1Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '3rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h2Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '2.5rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h3Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '2rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h4Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.5rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h5Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.25rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h6Config: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '1.1rem',
  fontWeight: 400,
  textTransform: 'none',
}

const paragraphConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '.9rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperHeaderConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '0.8rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperFooterConfig: Omit<CustomTypographyVariant, 'fontFamily'> = {
  fontSize: '0.7rem',
  fontWeight: 400,
  textTransform: 'none',
}

const arapeyFontFamily = 'var(--font-arapey)'
const interFontFamily = 'var(--font-inter)'
const merriweatherFontFamily = 'var(--font-merriweather)'

const arapeyh1: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h1Config,
}

const arapeyh2: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h2Config,
}

const arapeyh3: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h3Config,
}

const arapeyh4: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h4Config,
}

const arapeyh5: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h5Config,
}

const arapeyh6: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h6Config,
}

const arapeyparagraph: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...paragraphConfig,
}

const interh1: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h1Config,
}

const interh2: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h2Config,
}

const interh3: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h3Config,
}

const interh4: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h4Config,
}

const interh5: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h5Config,
}

const interh6: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h6Config,
}

const interparagraph: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...paragraphConfig,
}

const interhelperheader: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...helperHeaderConfig,
}

const interhelperfooter: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...helperFooterConfig,
}

const merrih1: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h1Config,
}

const merrih2: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h2Config,
}

const merrih3: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h3Config,
}

const merrih4: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h4Config,
}

const merrih5: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h5Config,
}

const merrih6: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h6Config,
}

const merriparagraph: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...paragraphConfig,
}

const merrihelperfooter: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...helperFooterConfig,
}

const typography: CustomTypographyOptions = {
  fontFamily: ['roboto', 'serif', 'sans-serif'].join(','),
  arapeyh1,
  arapeyh2,
  arapeyh3,
  arapeyh4,
  arapeyh5,
  arapeyh6,
  arapeyparagraph,
  interh1,
  interh2,
  interh3,
  interh4,
  interh5,
  interh6,
  interparagraph,
  interhelperheader,
  interhelperfooter,
  merrih1,
  merrih2,
  merrih3,
  merrih4,
  merrih5,
  merrih6,
  merriparagraph,
  merrihelperfooter,
}

export default typography

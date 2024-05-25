import { CustomTypographyVariant } from '../components/Typography'

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

export const arapeyh1: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h1Config,
}

export const arapeyh2: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h2Config,
}

export const arapeyh3: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h3Config,
}

export const arapeyh4: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h4Config,
}

export const arapeyh5: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h5Config,
}

export const arapeyh6: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...h6Config,
}

export const arapeyparagraph: CustomTypographyVariant = {
  fontFamily: arapeyFontFamily,
  ...paragraphConfig,
}

export const interh1: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h1Config,
}

export const interh2: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h2Config,
}

export const interh3: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h3Config,
}

export const interh4: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h4Config,
}

export const interh5: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h5Config,
}

export const interh6: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...h6Config,
}

export const interparagraph: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...paragraphConfig,
}

export const interhelperheader: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...helperHeaderConfig,
}

export const interhelperfooter: CustomTypographyVariant = {
  fontFamily: interFontFamily,
  ...helperFooterConfig,
}

export const merrih1: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h1Config,
}

export const merrih2: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h2Config,
}

export const merrih3: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h3Config,
}

export const merrih4: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h4Config,
}

export const merrih5: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h5Config,
}

export const merrih6: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...h6Config,
}

export const merriparagraph: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...paragraphConfig,
}

export const merrihelperfooter: CustomTypographyVariant = {
  fontFamily: merriweatherFontFamily,
  ...helperFooterConfig,
}

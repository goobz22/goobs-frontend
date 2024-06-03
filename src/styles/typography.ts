type TypographyConfig = {
  fontSize: string
  fontWeight: number
  textTransform: string
}

// Define base configurations for each heading level
const h1Config: TypographyConfig = {
  fontSize: '3rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h2Config: TypographyConfig = {
  fontSize: '2.5rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h3Config: TypographyConfig = {
  fontSize: '2rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h4Config: TypographyConfig = {
  fontSize: '1.5rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h5Config: TypographyConfig = {
  fontSize: '1.25rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h6Config: TypographyConfig = {
  fontSize: '1.1rem',
  fontWeight: 400,
  textTransform: 'none',
}

const paragraphConfig: TypographyConfig = {
  fontSize: '.9rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperHeaderConfig: TypographyConfig = {
  fontSize: '0.8rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperFooterConfig: TypographyConfig = {
  fontSize: '0.7rem',
  fontWeight: 400,
  textTransform: 'none',
}

const arapeyFontFamily = 'var(--font-arapey)'
const interFontFamily = 'var(--font-inter)'
const merriweatherFontFamily = 'var(--font-merriweather)'

export const arapeyh1 = {
  fontFamily: arapeyFontFamily,
  ...h1Config,
}

export const arapeyh2 = {
  fontFamily: arapeyFontFamily,
  ...h2Config,
}

export const arapeyh3 = {
  fontFamily: arapeyFontFamily,
  ...h3Config,
}

export const arapeyh4 = {
  fontFamily: arapeyFontFamily,
  ...h4Config,
}

export const arapeyh5 = {
  fontFamily: arapeyFontFamily,
  ...h5Config,
}

export const arapeyh6 = {
  fontFamily: arapeyFontFamily,
  ...h6Config,
}

export const arapeyparagraph = {
  fontFamily: arapeyFontFamily,
  ...paragraphConfig,
}

export const interh1 = {
  fontFamily: interFontFamily,
  ...h1Config,
}

export const interh2 = {
  fontFamily: interFontFamily,
  ...h2Config,
}

export const interh3 = {
  fontFamily: interFontFamily,
  ...h3Config,
}

export const interh4 = {
  fontFamily: interFontFamily,
  ...h4Config,
}

export const interh5 = {
  fontFamily: interFontFamily,
  ...h5Config,
}

export const interh6 = {
  fontFamily: interFontFamily,
  ...h6Config,
}

export const interparagraph = {
  fontFamily: interFontFamily,
  ...paragraphConfig,
}

export const interhelperheader = {
  fontFamily: interFontFamily,
  ...helperHeaderConfig,
}

export const interhelperfooter = {
  fontFamily: interFontFamily,
  ...helperFooterConfig,
}

export const merrih1 = {
  fontFamily: merriweatherFontFamily,
  ...h1Config,
}

export const merrih2 = {
  fontFamily: merriweatherFontFamily,
  ...h2Config,
}

export const merrih3 = {
  fontFamily: merriweatherFontFamily,
  ...h3Config,
}

export const merrih4 = {
  fontFamily: merriweatherFontFamily,
  ...h4Config,
}

export const merrih5 = {
  fontFamily: merriweatherFontFamily,
  ...h5Config,
}

export const merrih6 = {
  fontFamily: merriweatherFontFamily,
  ...h6Config,
}

export const merriparagraph = {
  fontFamily: merriweatherFontFamily,
  ...paragraphConfig,
}

export const merrihelperfooter = {
  fontFamily: merriweatherFontFamily,
  ...helperFooterConfig,
}

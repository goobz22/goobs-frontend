// Components
import CustomButton from './components/Button'
import CustomGrid from './components/Grid'
import StyledComponent from './components/StyledComponent'
import Typography from './components/Typography'

// Actions
import { reusableStore } from './actions/server/form/store/reusableStore'
import { encryptValue, decryptValue } from './actions/server/form/store/crypt'
import getFormData from './actions/server/form/getFormData'

// Colors
import {
  moss,
  aqua,
  madder,
  woad,
  marine,
  pansy,
  stainlessSteel,
  coal,
  ocean,
  sky,
  salmon,
  lightning,
  sage,
  lilac,
  gunpowder,
  lightMadder,
  black,
  white,
  none,
  semiTransparentWhite,
  semiTransparentBlack,
  red,
  green,
  greyborder,
} from './styles/palette'

// Typography
import {
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
} from './styles/typography'

// Named exports
export { default as CustomButton } from './components/Button'
export { default as CustomGrid } from './components/Grid'
export { default as StyledComponent } from './components/StyledComponent'
export { default as Typography } from './components/Typography'
export { reusableStore } from './actions/server/form/store/reusableStore'
export { encryptValue, decryptValue } from './actions/server/form/store/crypt'
export { default as getFormData } from './actions/server/form/getFormData'

// Type exports
export type { CustomButtonProps } from './components/Button'
export type { CustomGridProps, columnconfig, rowconfig, gridconfig } from './components/Grid'
export type {
  StyledComponentProps,
  AdornmentProps,
} from './components/StyledComponent'
export type { TypographyProps } from './components/Typography'
export type { FormStoreProps } from './actions/server/form/store/reusableStore'

export {
  moss,
  aqua,
  madder,
  woad,
  marine,
  pansy,
  stainlessSteel,
  coal,
  ocean,
  sky,
  salmon,
  lightning,
  sage,
  lilac,
  gunpowder,
  lightMadder,
  black,
  white,
  none,
  semiTransparentWhite,
  semiTransparentBlack,
  red,
  green,
  greyborder,
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

// Default export
export default {
  CustomButton,
  CustomGrid,
  StyledComponent,
  Typography,
  reusableStore,
  encryptValue,
  decryptValue,
  getFormData,
  moss,
  aqua,
  madder,
  woad,
  marine,
  pansy,
  stainlessSteel,
  coal,
  ocean,
  sky,
  salmon,
  lightning,
  sage,
  lilac,
  gunpowder,
  lightMadder,
  black,
  white,
  none,
  semiTransparentWhite,
  semiTransparentBlack,
  red,
  green,
  greyborder,
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

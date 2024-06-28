// Components
import CustomButton, { ButtonAlignment } from './components/Button'
import CustomGrid, {
  Alignment,
  BorderProp,
  columnconfig,
  gridconfig,
  cellconfig,
} from './components/Grid'
import StyledComponent, {
  StyledComponentProps,
  AdornmentProps,
} from './components/StyledComponent'
import Typography, {
  FontFamily,
  TypographyVariant,
  TypographyPropsVariantOverrides,
  TypographyProps,
} from './components/Typography'
import ConfirmationCodeInput, {
  ConfirmationCodeInputsProps,
} from './components/ConfirmationCodeInput'
import RadioGroup, {
  RadioOption,
  RadioGroupProps,
} from './components/RadioGroup'
import PopupForm, { PopupFormProps } from './components/Form/Popup'
import ContentSection, { ContentSectionProps } from './components/Content'
import React from 'react'

// Animations
import { Animation } from './components/Content/Structure/animations'

// Actions
import getFormData from './actions/server/form/getFormData'

// Importing ExtendedButtonProps from useButton
import { ExtendedButtonProps } from './components/Content/Structure/button/useButton'

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

// Styles
import { formContainerStyle } from './styles/Form'

import { helperFooterAtom, HelperFooterMessage } from './atoms/helperfooter'

// Type declarations
declare type CustomButtonProps = React.ComponentProps<typeof CustomButton>
declare type CustomGridProps = React.ComponentProps<typeof CustomGrid>
declare type TypographyComponentProps = React.ComponentProps<typeof Typography>
declare type ConfirmationCodeInputProps = React.ComponentProps<
  typeof ConfirmationCodeInput
>
declare type RadioGroupComponentProps = React.ComponentProps<typeof RadioGroup>
declare type PopupFormComponentProps = React.ComponentProps<typeof PopupForm>
declare type ContentSectionComponentProps = React.ComponentProps<
  typeof ContentSection
>

// Named exports
export { CustomButton }
export { CustomGrid }
export { StyledComponent }
export { Typography }
export { ConfirmationCodeInput }
export { RadioGroup }
export { PopupForm }
export { ContentSection }
export { getFormData }
export { formContainerStyle }

// Exporting ExtendedButtonProps
export type { ExtendedButtonProps }

// Exporting helperFooterAtom and HelperFooterMessage
export { helperFooterAtom }
export type { HelperFooterMessage }

// Type exports
export type { CustomButtonProps }
export type { ButtonAlignment }
export type { CustomGridProps }
export type { Alignment, BorderProp, columnconfig, gridconfig, cellconfig }
export type { StyledComponentProps, AdornmentProps }
export type {
  FontFamily,
  TypographyVariant,
  TypographyPropsVariantOverrides,
  TypographyProps,
}
export type { ConfirmationCodeInputsProps }
export type { RadioOption, RadioGroupProps }
export type { PopupFormProps }
export type { ContentSectionProps }

// Additional type exports for the newly declared types
export type { TypographyComponentProps }
export type { ConfirmationCodeInputProps }
export type { RadioGroupComponentProps }
export type { PopupFormComponentProps }
export type { ContentSectionComponentProps }

// Animation type export
export type { Animation }

// Color exports
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
}

// Typography exports
export {
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

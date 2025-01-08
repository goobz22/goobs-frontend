import React from 'react'

// Components
import CustomButton from './components/Button'
import CustomGrid, {
  columnconfig,
  gridconfig,
  cellconfig,
} from './components/Grid'
import Typography, {
  FontFamily,
  TypographyVariant,
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
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from './components/Accordion'
import Card, { CardProps } from './components/Card'
import CodeCopy, { CodeCopyProps } from './components/CodeCopy'
import Nav, { NavProps, NavItem } from './components/Nav' // <-- Vertical-only Nav
import PricingTable, { PricingProps } from './components/PricingTable'
import { CustomStepper, CustomStepperProps } from './components/Stepper'
import CustomToolbar, { CustomToolbarProps } from './components/Toolbar'
import TransferList, { TransferListProps } from './components/TransferList'
import StyledTooltip, { CustomTooltipProps } from './components/Tooltip'
import QRCodeComponent, { QRCodeProps } from './components/QRCode'
import FormProjectBoard, {
  FormProjectBoardProps,
} from './components/Form/ProjectBoard'

// Here is the new horizontal `Tabs` import
import Tabs, { TabsProps } from './components/Tabs'

// New imports
import DateField from './components/DateField'
import Dropdown, { DropdownOption } from './components/Dropdown'
import IncrementNumberField from './components/IncrementNumberField'
import NumberField from './components/NumberField'
import PasswordField from './components/PasswordField'
import PhoneNumberField from './components/PhoneNumberField'
import Searchbar from './components/Searchbar'
import TextField from './components/TextField'

// Add FormDataGrid import
import FormDataGrid from './components/Form/DataGrid'
import type { FormDataGridProps } from './components/Form/DataGrid'

// Animations
import { Animation } from './components/Content/Structure/animations'

// Importing Extended Props
import { ExtendedComplexEditorProps } from './components/Content/Structure/complexeditor/useComplexEditor'
import { ExtendedButtonProps } from './components/Content/Structure/button/useButton'
import { ExtendedTypographyProps } from './components/Content/Structure/typography/useGridTypography'
import { ExtendedTextFieldProps } from './components/Content/Structure/textfield/useTextField'
import { ExtendedQRCodeProps } from './components/Content/Structure/qrcode/useQRCode'
import { ExtendedDropdownProps } from './components/Content/Structure/dropdown/useDropdown'
import { ExtendedDateFieldProps } from './components/Content/Structure/datefield/useDateField'
import { ExtendedNumberFieldProps } from './components/Content/Structure/numberField/useNumberField'
import { ExtendedIncrementNumberFieldProps } from './components/Content/Structure/incremementNumberField/useIncremementNumberField'
import { ExtendedPasswordFieldProps } from './components/Content/Structure/passwordField/usePasswordField'
import { ExtendedSearchbarProps } from './components/Content/Structure/searchbar/useSearchbar'
import { ExtendedCodeCopyProps } from './components/Content/Structure/codecopy/useCodeCopy'
import { ExtendedCardProps } from './components/Content/Structure/card/useCard'
import { ExtendedTransferListProps } from './components/Content/Structure/transferlist/useTransferList'
import { ExtendedStepperProps } from './components/Content/Structure/stepper/useStepper'
import { ExtendedPricingProps } from './components/Content/Structure/pricing/usePricing'
import { ExtendedImageProps } from './components/Content/Structure/image/useImage'
import { ExtendedConfirmationCodeInputsProps } from './components/Content/Structure/confirmationinput/useConfirmationInput'
import { ExtendedRadioGroupProps } from './components/Content/Structure/radiogroup/useRadioGroup'
import { ExtendedPhoneNumberFieldProps } from './components/Content/Structure/phoneNumber/usePhoneNumber'
import { ExtendedProjectBoardProps } from './components/Content/Structure/projectboard/useProjectBoard'
import { ProjectBoardProps } from './components/ProjectBoard'

// Consolidated import of all DataGrid types
import type {
  DatagridProps,
  ColumnDef,
  RowData,
  TableProps,
} from './components/DataGrid/types'

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
  grey,
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

/* -------------------------------------------------------------------------- */
/*                      NEW: ProjectBoard Sub-Components                      */
/* -------------------------------------------------------------------------- */
import AddTask, { AddTaskProps } from './components/ProjectBoard/AddTask/client'
import ShowTask, {
  ShowTaskProps,
} from './components/ProjectBoard/ShowTask/client'
import ManageTask, {
  ManageTaskProps,
} from './components/ProjectBoard/ManageTask/client'

/* -------------------------------------------------------------------------- */
/*                            Type Declarations                               */
/* -------------------------------------------------------------------------- */
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
declare type AccordionProps = React.ComponentProps<typeof Accordion>
declare type AccordionSummaryProps = React.ComponentProps<
  typeof AccordionSummary
>
declare type AccordionDetailsProps = React.ComponentProps<
  typeof AccordionDetails
>
declare type CardComponentProps = React.ComponentProps<typeof Card>
declare type CodeCopyComponentProps = React.ComponentProps<typeof CodeCopy>
declare type NavComponentProps = React.ComponentProps<typeof Nav>
declare type PricingTableComponentProps = React.ComponentProps<
  typeof PricingTable
>
declare type CustomStepperComponentProps = React.ComponentProps<
  typeof CustomStepper
>
declare type CustomToolbarComponentProps = React.ComponentProps<
  typeof CustomToolbar
>
declare type TransferListComponentProps = React.ComponentProps<
  typeof TransferList
>
declare type StyledTooltipComponentProps = React.ComponentProps<
  typeof StyledTooltip
>

// New type declarations
declare type DateFieldProps = React.ComponentProps<typeof DateField>
declare type DropdownProps = React.ComponentProps<typeof Dropdown>
declare type IncrementNumberFieldProps = React.ComponentProps<
  typeof IncrementNumberField
>
declare type NumberFieldProps = React.ComponentProps<typeof NumberField>
declare type PasswordFieldProps = React.ComponentProps<typeof PasswordField>
declare type PhoneNumberFieldProps = React.ComponentProps<
  typeof PhoneNumberField
>
declare type SearchbarProps = React.ComponentProps<typeof Searchbar>
declare type TextFieldProps = React.ComponentProps<typeof TextField>

/* -------------------------------------------------------------------------- */
/*                           Named Component Exports                          */
/* -------------------------------------------------------------------------- */

export { CustomButton }
export { CustomGrid }
export { Typography }
export { ConfirmationCodeInput }
export { RadioGroup }
export { PopupForm }
export { ContentSection }
export { Accordion, AccordionSummary, AccordionDetails }
export { Card }
export { CodeCopy }
export { Nav } // vertical-only Nav
export { PricingTable }
export { CustomStepper }
export { CustomToolbar }
export { TransferList }
export { StyledTooltip }
export { formContainerStyle }
export { QRCodeComponent }

// Horizontal Tabs export
export { Tabs }

// New named exports
export { DateField }
export { Dropdown }
export { IncrementNumberField }
export { NumberField }
export { PasswordField }
export { PhoneNumberField }
export { Searchbar }
export { TextField }

// Add FormDataGrid to named exports
export { FormDataGrid }
export { FormProjectBoard }

// NEW: Export AddTask / ShowTask / ManageTask
export { AddTask, ShowTask, ManageTask }

/* -------------------------------------------------------------------------- */
/*                           Named Type Exports                               */
/* -------------------------------------------------------------------------- */

// 1) Form DataGrid
export type { FormDataGridProps }

// 2) All DataGrid Types
export type { DatagridProps }
export type { ColumnDef, RowData }
export type { TableProps }

// Extended Props
export type { ExtendedButtonProps }
export type { ExtendedTypographyProps }
export type { ExtendedTextFieldProps }
export type { ExtendedNumberFieldProps }
export type { ExtendedIncrementNumberFieldProps }
export type { ExtendedPasswordFieldProps }
export type { ExtendedSearchbarProps }
export type { ExtendedCodeCopyProps }
export type { ExtendedCardProps }
export type { ExtendedTransferListProps }
export type { ExtendedStepperProps }
export type { ExtendedPricingProps }
export type { ExtendedImageProps }
export type { ExtendedConfirmationCodeInputsProps }
export type { ExtendedRadioGroupProps }
export type { ExtendedPhoneNumberFieldProps }
export type { ExtendedComplexEditorProps }
export type { ExtendedProjectBoardProps }

// "Local" type exports for existing components
export type { CustomButtonProps }
export type { CustomGridProps }
export type { columnconfig, gridconfig, cellconfig }
export type { FontFamily, TypographyVariant, TypographyProps }
export type { ConfirmationCodeInputsProps }
export type { RadioOption, RadioGroupProps }
export type { PopupFormProps }
export type { ContentSectionProps }
export type { CardProps }
export type { CodeCopyProps }
export type { NavProps } // vertical-only
export type { PricingProps }
export type { CustomStepperProps }
export type { CustomToolbarProps }
export type { FormProjectBoardProps }
export type { TransferListProps }
export type { CustomTooltipProps }
export type { ProjectBoardProps }
export type { QRCodeProps }
export type { ExtendedQRCodeProps }
export type { ExtendedDropdownProps }
export type { ExtendedDateFieldProps }

// Additional types for newly declared fields
export type { TypographyComponentProps }
export type { ConfirmationCodeInputProps }
export type { RadioGroupComponentProps }
export type { PopupFormComponentProps }
export type { ContentSectionComponentProps }
export type { AccordionProps, AccordionSummaryProps, AccordionDetailsProps }
export type { CardComponentProps }
export type { CodeCopyComponentProps }
export type { NavComponentProps }
export type { PricingTableComponentProps }
export type { CustomStepperComponentProps }
export type { CustomToolbarComponentProps }
export type { TransferListComponentProps }
export type { StyledTooltipComponentProps }
export type { DropdownOption }

// New type exports
export type { DateFieldProps }
export type { DropdownProps }
export type { IncrementNumberFieldProps }
export type { NumberFieldProps }
export type { PasswordFieldProps }
export type { PhoneNumberFieldProps }
export type { SearchbarProps }
export type { TextFieldProps }

// Horizontal Tabs Props
export type { TabsProps }
export type { NavItem }

// NEW: Export prop types for AddTask, ShowTask, ManageTask
export type { AddTaskProps, ShowTaskProps, ManageTaskProps }

/* -------------------------------------------------------------------------- */
/*                             Animation Exports                              */
/* -------------------------------------------------------------------------- */
export type { Animation }

/* -------------------------------------------------------------------------- */
/*                              Color Exports                                 */
/* -------------------------------------------------------------------------- */
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
  grey,
}

/* -------------------------------------------------------------------------- */
/*                           Typography Exports                               */
/* -------------------------------------------------------------------------- */
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

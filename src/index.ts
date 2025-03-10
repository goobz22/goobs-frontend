import CustomButton, { CustomButtonProps } from './components/Button'
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
import Popup, { PopupProps } from './components/Form/Popup'
import CustomDialog, { CustomDialogProps } from './components/Form/Dialog'
import ContentSection, { ContentSectionProps } from './components/Content'
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
import MultiSelectChip, {
  MultiSelectChipProps,
} from './components/Field/Dropdown/MultiSelect'
import ComplexEditor, {
  ComplexTextEditorProps,
} from './components/ComplexTextEditor'
// Import the Accordion component and its props
import Accordion, { AccordionProps } from './components/Accordion'
import { RawCustomer } from './components/ProjectBoard/types'
import AdministratorAddTaskCompanyDropdown from './components/ProjectBoard/forms/AddTask/administrator/companyDropdown'
import AdministratorAddTaskCompanyProvided from './components/ProjectBoard/forms/AddTask/administrator/companyProvided'
import CompanyAddTaskCustomerDropdown from './components/ProjectBoard/forms/AddTask/company/customerDropdown'
import CompanyAddTaskCustomerProvided from './components/ProjectBoard/forms/AddTask/company/customerProvided'
import CustomerAddTask from './components/ProjectBoard/forms/AddTask/customer'
import NoUserAddTask from './components/ProjectBoard/forms/AddTask/noUser'
import { RawSeverityLevel } from './components/ProjectBoard/types'
// Here is the new horizontal `Tabs` import
import Tabs, { TabsProps } from './components/Tabs'
import { Task } from './components/ProjectBoard/types'

// New imports
import DateField, { DateFieldProps } from './components/Field/Date'
import Dropdown, { DropdownProps } from './components/Field/Dropdown/Regular'
import IncrementNumberField from './components/Field/Number/ExternalIncrement'
import InternalIncrementNumberField, {
  InternalIncrementNumberFieldProps,
} from './components/Field/Number/InternalIncrement'
import PasswordField, { PasswordFieldProps } from './components/Field/Password'
import PhoneNumberField from './components/Field/PhoneNumber'
import Searchbar, { SearchbarProps } from './components/Field/Search'
import TextField, { TextFieldProps } from './components/Field/Text'
import SearchableDropdown, {
  SearchableDropdownProps,
  DropdownOption,
} from './components/Field/Dropdown/Searchable'

// Add FormDataGrid import
import FormDataGrid from './components/Form/DataGrid'
import type { FormDataGridProps } from './components/Form/DataGrid'

// Animations
import { Animation } from './components/Content/Structure/animations'

// Importing Extended Props
import { ProjectBoardProps } from './components/ProjectBoard/types'

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
import ShowTask, {
  ShowTaskProps,
} from './components/ProjectBoard/forms/ShowTask/client'

export { CustomButton }
export { Typography }
export { ConfirmationCodeInput }
export { RadioGroup }
export { Popup }
export { ContentSection }
export { Card }
export { CodeCopy }
export { Nav }
export { PricingTable }
export { CustomStepper }
export { CustomToolbar }
export { TransferList }
export { StyledTooltip }
export { formContainerStyle }
export { QRCodeComponent }
export { MultiSelectChip }
export { Tabs }
export { ComplexEditor }
export { Accordion } // <-- Export Accordion here
export { AdministratorAddTaskCompanyDropdown }
export { AdministratorAddTaskCompanyProvided }
export { CompanyAddTaskCustomerDropdown }
export { CompanyAddTaskCustomerProvided }
export { CustomerAddTask }
export { NoUserAddTask }

// New named exports
export { DateField }
export { Dropdown }
export { IncrementNumberField }
export { InternalIncrementNumberField }
export { PasswordField }
export { PhoneNumberField }
export { Searchbar }
export { TextField }
export { CustomDialog }
// Add FormDataGrid to named exports
export { FormDataGrid }
export { FormProjectBoard }
export type { InternalIncrementNumberFieldProps }
export type { PasswordFieldProps }
export type { SearchbarProps }
export type { TextFieldProps }
export type { SearchableDropdownProps }
// NEW: Export AddTask / ShowTask / ManageTask
export { ShowTask }
export type { Task }
export type { RawCustomer }
/* -------------------------------------------------------------------------- */
/*                           Named Type Exports                               */
/* -------------------------------------------------------------------------- */

export { SearchableDropdown }
// 1) Form DataGrid
export type { FormDataGridProps }
export type { CustomDialogProps }

// 2) All DataGrid Types
export type { DatagridProps }
export type { ColumnDef, RowData }
export type { TableProps }
export type { MultiSelectChipProps }
export type { DateFieldProps }
export type { DropdownProps }
// "Local" type exports for existing components
export type { CustomButtonProps }
export type { ComplexTextEditorProps }
export type { FontFamily, TypographyVariant, TypographyProps }
export type { ConfirmationCodeInputsProps }
export type { RadioOption, RadioGroupProps }
export type { PopupProps }
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
export type { DropdownOption }
export type { TabsProps }
export type { NavItem }
export type { ShowTaskProps }
export type { Animation }
export type { AccordionProps } // <-- Export AccordionProps
export type { RawSeverityLevel }

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

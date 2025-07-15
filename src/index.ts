import CustomButton, { ButtonProps, ButtonGroup } from './components/Button'
import Typography, {
  CustomTypographyVariant,
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
import CodeCopy, { CodeCopyProps } from './components/CodeCopy'
import Nav, { NavProps, NavItem } from './components/Nav' // <-- Vertical-only Nav
import PricingTable, { PricingProps } from './components/PricingTable'
import Stepper, { StepperProps } from './components/Stepper'
import CustomToolbar, { CustomToolbarProps } from './components/Toolbar'
import TransferList, { TransferListProps } from './components/TransferList'
import StyledTooltip, { TooltipProps } from './components/Tooltip'
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
import Alert, { AlertProps } from './components/Alert'
import Badge, { BadgeProps } from './components/Badge'
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
import Checkbox, { CheckboxProps } from './components/Checkbox'
import Chip, { type ChipProps } from './components/Chip'
import Switch, { type SwitchProps } from './components/Switch'
import MACAddressField, {
  MACAddressFieldProps,
} from './components/Field/IPAM/MACAddress'
import VLANField, { VLANFieldProps } from './components/Field/IPAM/VLAN'
// New imports
import DateField, { DateFieldProps } from './components/Field/Date/DateField'
import DateRangeComponent, {
  DateRangeProps,
} from './components/Field/Date/DateRange'
import TimeRangeComponent, {
  TimeRangeProps,
  AMERICAN_TIMEZONES,
} from './components/Field/Time/TimeRange'
import Dropdown, { DropdownProps } from './components/Field/Dropdown/Regular'
import IncrementNumberField from './components/Field/Number/ExternalIncrement'
import InternalIncrementNumberField, {
  InternalIncrementNumberFieldProps,
} from './components/Field/Number/InternalIncrement'
import PasswordField, { PasswordFieldProps } from './components/Field/Password'
import PhoneNumberField from './components/Field/PhoneNumber'
import Searchbar, { SearchbarProps } from './components/Field/Search'
import TextField, { TextFieldProps } from './components/Field/Text'
import USDField, { USDFieldProps } from './components/Field/USD'
import SearchableSimple, {
  SearchableSimpleProps,
  DropdownOption,
} from './components/Field/Dropdown/SearchableSimple'
import SearchableHistory, {
  SearchableHistoryProps,
} from './components/Field/Dropdown/SearchableHistory'
import AccountNumber, {
  AccountNumberProps,
} from './components/Field/Number/AccountNumber'
import RoutingNumber, {
  RoutingNumberProps,
} from './components/Field/Number/RoutingNumber'
import CVV, { CVVProps } from './components/Field/Number/CVV'
import CreditCardNumber, {
  CreditCardNumberProps,
  CardType,
} from './components/Field/Number/CreditCardNumber'
import PercentageField, {
  PercentageFieldProps,
} from './components/Field/Percentage'
import ProgressBar, { ProgressBarProps } from './components/ProgressBar'
import Slider, { SliderProps } from './components/Field/Slider'
import Snackbar, { type SnackbarProps } from './components/Snackbar'
import * as Icons from './components/Icons'

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
  DataGridFilter,
  MetricCardData,
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
} from './theme/'

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
} from './theme/'

// Styles
// Note: formContainerStyle was removed as the file './styles/Form' doesn't exist

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
export { CodeCopy }
export { Nav }
export { PricingTable }
export { Stepper }
export { CustomToolbar }
export { TransferList }
export { StyledTooltip }
export { QRCodeComponent }
export { MultiSelectChip }
export { Tabs }
export { ComplexEditor }
export { Accordion } // <-- Export Accordion here
export { Alert }
export { Badge }
export { AdministratorAddTaskCompanyDropdown }
export { AdministratorAddTaskCompanyProvided }
export { CompanyAddTaskCustomerDropdown }
export { CompanyAddTaskCustomerProvided }
export { CustomerAddTask }
export { NoUserAddTask }
export { Checkbox }
export { Chip }
export { Switch }
export { Icons }
export { ButtonGroup }
// New named exports
export { DateField }
export { DateRangeComponent as DateRange }
export { TimeRangeComponent as TimeRange }
export { AMERICAN_TIMEZONES }
export { Dropdown }
export { IncrementNumberField }
export { InternalIncrementNumberField }
export { PasswordField }
export { PhoneNumberField }
export { Searchbar }
export { TextField }
export { USDField }
export { CustomDialog }
export { MACAddressField }
export { VLANField }
// Add FormDataGrid to named exports
export { FormDataGrid }
export { FormProjectBoard }
export type { InternalIncrementNumberFieldProps }
export type { PasswordFieldProps }
export type { SearchbarProps }
export type { TextFieldProps }
export type { USDFieldProps }
export type { SearchableSimpleProps }
export type { SearchableHistoryProps }
export type { MACAddressFieldProps }
export type { VLANFieldProps }
// NEW: Export AddTask / ShowTask / ManageTask
export { ShowTask }
export { PercentageField }
export { ProgressBar }
export { Slider }
export { Snackbar }

export type { Task }
export type { RawCustomer }
export type { CheckboxProps }
export type { AccountNumberProps }
export type { RoutingNumberProps }
export type { CVVProps }
export type { CreditCardNumberProps }
export type { CardType }
export type { DateRangeProps }
export type { TimeRangeProps }
export type { PercentageFieldProps }
export type { ChipProps }
export type { SwitchProps }
export type { ProgressBarProps }
export type { AlertProps }
export type { SnackbarProps }
export type { SliderProps }
export type { BadgeProps }
/* -------------------------------------------------------------------------- */
/*                           Named Type Exports                               */
/* -------------------------------------------------------------------------- */

export { SearchableSimple }
export { SearchableHistory }
export { AccountNumber }
export { RoutingNumber }
export { CVV }
export { CreditCardNumber }
// 1) Form DataGrid
export type { FormDataGridProps }
export type { CustomDialogProps }

// 2) All DataGrid Types
export type { DatagridProps }
export type { ColumnDef, RowData }
export type { TableProps }
export type { DataGridFilter }
export type { MetricCardData }
export type { MultiSelectChipProps }
export type { DateFieldProps }
export type { DropdownProps }
// "Local" type exports for existing components
export type { ButtonProps }
export type { ComplexTextEditorProps }
export type { CustomTypographyVariant, TypographyProps }
export type { ConfirmationCodeInputsProps }
export type { RadioOption, RadioGroupProps }
export type { PopupProps }
export type { ContentSectionProps }
export type { CodeCopyProps }
export type { NavProps } // vertical-only
export type { PricingProps }
export type { StepperProps }
export type { CustomToolbarProps }
export type { FormProjectBoardProps }
export type { TransferListProps }
export type { TooltipProps }
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

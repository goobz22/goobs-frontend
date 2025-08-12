import CustomButton, { ButtonProps, ButtonGroup } from './components/Button'
import IconButton, { IconButtonProps } from './components/IconButton'
import Typography, { TypographyProps } from './components/Typography'
import ConfirmationCodeInput, {
  ConfirmationCodeInputsProps,
} from './components/ConfirmationCodeInput'
import RadioGroup, {
  RadioOption,
  RadioGroupProps,
} from './components/RadioGroup'
import Popup, { PopupProps } from './components/Form/Popup'
import CustomDialog, { CustomDialogProps } from './components/Form/Dialog'
import Dialog, { DialogProps } from './components/Dialog'
import ContentSection, { ContentSectionProps } from './components/Content'
import CodeCopy, { CodeCopyProps } from './components/CodeCopy'
import PricingTable, { PricingProps } from './components/PricingTable'
import Stepper, { StepperProps } from './components/Stepper'
import AppBar, { AppBarProps } from './components/AppBar'
import CustomToolbar, { CustomToolbarProps } from './components/Toolbar'
import TransferList, { TransferListProps } from './components/TransferList'
import StyledTooltip, { TooltipProps } from './components/Tooltip'
import Popover, { PopoverProps } from './components/Popover'
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
import FormControl, {
  FormControlProps,
  FormControlStyles,
} from './components/FormControl'
import InputLabel, {
  InputLabelProps,
  InputLabelStyles,
} from './components/InputLabel'
import Select, { SelectProps, SelectStyles } from './components/Select'
import MenuItem, { MenuItemProps, MenuItemStyles } from './components/MenuItem'
import FormControlLabel, {
  FormControlLabelProps,
  FormControlLabelStyles,
} from './components/FormControlLabel'
// Import the Accordion component and its props
import Accordion, { AccordionProps } from './components/Accordion'
// Import the Breadcrumb component and its props
import Breadcrumb, {
  BreadcrumbProps,
  BreadcrumbItem,
} from './components/Breadcrumb'
// Import the TreeView component and its props
import TreeView, {
  TreeViewProps,
  TreeViewItem,
  TreeViewItemId,
  TreeViewApiRef,
  TreeViewSelectionPropagation,
  useTreeViewApiRef,
  useTreeViewContext,
} from './components/TreeView'
// Import the Drawer component and its props
import Drawer, { DrawerProps } from './components/Drawer'
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
import Tabs, { TabsProps, Tab, TabProps } from './components/Tabs'
import ToggleButton, {
  ToggleButtonProps,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from './components/ToggleButton'
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
import Pagination, { PaginationProps } from './components/Pagination'
import Snackbar, { type SnackbarProps } from './components/Snackbar'
import Paper, { PaperProps } from './components/Paper'
import Card, {
  CardProps,
  CardContent,
  CardContentProps,
  CardActions,
  CardActionsProps,
  CardHeader,
  CardHeaderProps,
} from './components/Card'
import Stack, { StackProps, StackStyles } from './components/Stack'
import Container, { ContainerProps } from './components/Container'
import Avatar, { AvatarProps } from './components/Avatar'
import Divider, { DividerProps } from './components/Divider'
import Fade, { FadeProps } from './components/Fade'
import Slide, { SlideProps } from './components/Slide'
import Zoom, { ZoomProps } from './components/Zoom'
import * as Icons from './components/Icons'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListProps,
  ListItemProps,
  ListItemIconProps,
  ListItemTextProps,
} from './components/List'

// Add FormDataGrid import
import FormDataGrid from './components/Form/DataGrid'
import type { FormDataGridProps } from './components/Form/DataGrid'
import Grid, { GridProps } from './components/Grid'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from './components/Table'
import type { SimpleTableProps, TableStyles } from './components/Table'

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

// Utilities
import { alpha } from './utils/alpha'
import { keyframes, css, commonKeyframes } from './utils/keyframes'

// Styles
// Note: formContainerStyle was removed as the file './styles/Form' doesn't exist

/* -------------------------------------------------------------------------- */
/*                      NEW: ProjectBoard Sub-Components                      */
/* -------------------------------------------------------------------------- */
import ShowTask, {
  ShowTaskProps,
} from './components/ProjectBoard/forms/ShowTask/client'
import BigCalendar, {
  BigCalendarProps,
  CalendarView,
  CalendarEvent,
  CalendarFilterOptions,
} from './components/BigCalendar'
import type { BigCalendarStyles } from './theme/bigcalendar'

export { AppBar }
export { CustomButton }
export { IconButton }
export { Typography }
export { ConfirmationCodeInput }
export { RadioGroup }
export { Popup }
export { ContentSection }
export { CodeCopy }
export { PricingTable }
export { Stepper }
export { CustomToolbar }
export { TransferList }
export { StyledTooltip }
export { Popover }
export { QRCodeComponent }
export { MultiSelectChip }
export { Tabs, Tab }
export { ToggleButton, ToggleButtonGroup }
export { ComplexEditor }
export { FormControl }
export { InputLabel }
export { Select }
export { MenuItem }
export { FormControlLabel }
export { Accordion } // <-- Export Accordion here
export { Breadcrumb } // <-- Export Breadcrumb here
export { TreeView }
export { useTreeViewApiRef, useTreeViewContext }
export { Drawer }
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
export { Dialog }
export { MACAddressField }
export { VLANField }
// Add FormDataGrid to named exports
export { FormDataGrid }
export { FormProjectBoard }
export { Grid }
export { Table, TableContainer, TableHead, TableBody, TableRow, TableCell }
export { List, ListItem, ListItemIcon, ListItemText }
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
export { Pagination }
export { Snackbar }
export { Paper }
export { Card, CardContent, CardActions, CardHeader }
export { Stack }
export { Container }
export { Avatar }
export { Divider }
export { Fade }
export { Slide }
export { Zoom }
export { BigCalendar }

// Export utilities
export { alpha, keyframes, css, commonKeyframes }

export type { Task }
export type { RawCustomer }
// Re-export additional ProjectBoard types for external consumers
export type {
  CommentEditHistory,
  RawCompany,
  CurrentUser,
} from './components/ProjectBoard/types'
export type {
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
} from './components/ProjectBoard/types'
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
export type { PaginationProps }
export type { AlertProps }
export type { SnackbarProps }
export type { SliderProps }
export type { BadgeProps }
export type { PaperProps }
export type { CardProps, CardContentProps, CardActionsProps, CardHeaderProps }
export type { StackProps, StackStyles }
export type { ContainerProps }
export type { AvatarProps }
export type { DividerProps }
export type { FadeProps }
export type { SlideProps }
export type { ZoomProps }
export type { ListProps, ListItemProps, ListItemIconProps, ListItemTextProps }

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
export type { DialogProps }
export type { GridProps }
export type { SimpleTableProps, TableStyles }

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
export type { IconButtonProps }
export type { ComplexTextEditorProps }
export type { FormControlProps, FormControlStyles }
export type { InputLabelProps, InputLabelStyles }
export type { SelectProps, SelectStyles }
export type { MenuItemProps, MenuItemStyles }
export type { FormControlLabelProps, FormControlLabelStyles }
export type { TypographyProps }
export type { ConfirmationCodeInputsProps }
export type { RadioOption, RadioGroupProps }
export type { PopupProps }
export type { ContentSectionProps }
export type { CodeCopyProps }
export type { PricingProps }
export type { StepperProps }
export type { AppBarProps }
export type { CustomToolbarProps }
export type { FormProjectBoardProps }
export type { TransferListProps }
export type { TooltipProps }
export type { PopoverProps }
export type { ProjectBoardProps }
export type { QRCodeProps }
export type { DropdownOption }
export type { TabsProps, TabProps }
export type { ToggleButtonProps, ToggleButtonGroupProps }
export type { ShowTaskProps }
export type { Animation }
export type { AccordionProps } // <-- Export AccordionProps
export type { BreadcrumbProps, BreadcrumbItem } // <-- Export Breadcrumb types
export type {
  TreeViewProps,
  TreeViewItem,
  TreeViewItemId,
  TreeViewApiRef,
  TreeViewSelectionPropagation,
} // <-- Export TreeView types
export type { DrawerProps } // <-- Export Drawer types
export type { RawSeverityLevel }
export type {
  BigCalendarProps,
  CalendarView,
  CalendarEvent,
  BigCalendarStyles,
  CalendarFilterOptions,
}

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

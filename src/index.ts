// Optimized barrel export using re-exports for better tree-shaking
// This allows Vite/Rollup to only bundle what's actually used
// With sideEffects: false in package.json, unused exports will be eliminated

// Components - using re-export syntax for optimal tree-shaking
export {
  default as CustomButton,
  type ButtonProps,
  ButtonGroup,
} from './components/Button'
export {
  default as IconButton,
  type IconButtonProps,
} from './components/IconButton'
export {
  default as Typography,
  type TypographyProps,
} from './components/Typography'
export {
  default as ConfirmationCodeInput,
  type ConfirmationCodeInputsProps,
} from './components/ConfirmationCodeInput'
export {
  default as RadioGroup,
  type RadioOption,
  type RadioGroupProps,
} from './components/RadioGroup'
export { default as Dialog, type DialogProps } from './components/Dialog'
export { default as CodeCopy, type CodeCopyProps } from './components/CodeCopy'
export {
  default as PricingTable,
  type PricingProps,
} from './components/PricingTable'
export { default as Stepper, type StepperProps } from './components/Stepper'
export { default as AppBar, type AppBarProps } from './components/AppBar'
export {
  default as CustomToolbar,
  type CustomToolbarProps,
} from './components/Toolbar'
export {
  default as TransferList,
  type TransferListProps,
} from './components/TransferList'
export {
  default as StyledTooltip,
  type TooltipProps,
} from './components/Tooltip'
export { default as Popover, type PopoverProps } from './components/Popover'
export {
  default as QRCodeComponent,
  type QRCodeProps,
} from './components/QRCode'
export {
  default as FormProjectBoard,
  type FormProjectBoardProps,
} from './components/Form/ProjectBoard'
export {
  default as MultiSelectChip,
  type MultiSelectChipProps,
} from './components/Field/Dropdown/MultiSelect'
export {
  default as ComplexEditor,
  type ComplexTextEditorProps,
} from './components/ComplexTextEditor'
export {
  default as Select,
  type SelectProps,
  type SelectStyles,
} from './components/Select'
export {
  default as MenuItem,
  type MenuItemProps,
  type MenuItemStyles,
} from './components/MenuItem'
export {
  default as Accordion,
  type AccordionProps,
} from './components/Accordion'
export {
  default as Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from './components/Breadcrumb'
export {
  default as TreeView,
  type TreeViewProps,
  type TreeViewItem,
  type TreeViewItemId,
  type TreeViewApiRef,
  type TreeViewSelectionPropagation,
  useTreeViewApiRef,
  useTreeViewContext,
} from './components/TreeView'
export { default as Drawer, type DrawerProps } from './components/Drawer'
export { default as Alert, type AlertProps } from './components/Alert'
export { default as Badge, type BadgeProps } from './components/Badge'
export {
  default as Tabs,
  type TabsProps,
  type TabsItem,
  type TabsItemCapabilities,
  Tab,
  type TabProps,
  TabPanel,
  type TabPanelProps,
  tabPanelId,
} from './components/Tabs'
export {
  default as ToggleButton,
  type ToggleButtonProps,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from './components/ToggleButton'
export { default as Checkbox, type CheckboxProps } from './components/Checkbox'
export { default as Chip, type ChipProps } from './components/Chip'
export { default as Switch, type SwitchProps } from './components/Switch'

// Field Components
export {
  default as TextField,
  type TextFieldProps,
} from './components/Field/Text'
export {
  default as PasswordField,
  type PasswordFieldProps,
} from './components/Field/Password'
export {
  default as PhoneNumberField,
  type PhoneNumberFieldProps,
} from './components/Field/PhoneNumber'
export {
  default as SearchBar,
  type SearchbarProps,
} from './components/Field/Search'
export {
  default as PercentageField,
  type PercentageFieldProps,
} from './components/Field/Percentage'
export { default as USDField, type USDFieldProps } from './components/Field/USD'
export {
  default as InternalIncrementNumberField,
  type InternalIncrementNumberFieldProps,
} from './components/Field/Number/InternalIncrement'
export {
  default as MACAddressField,
  type MACAddressFieldProps,
} from './components/Field/IPAM/MACAddress'
export {
  default as VLANField,
  type VLANFieldProps,
} from './components/Field/IPAM/VLAN'
export {
  default as DateField,
  type DateFieldProps,
} from './components/Field/Date/DateField'
export {
  default as DateRange,
  type DateRangeProps,
} from './components/Field/Date/DateRange'
export {
  default as TimeRange,
  type TimeRangeProps,
  type TimeRange as TimeRangeValue,
} from './components/Field/Time/TimeRange'
export {
  default as TimeField,
  type TimeFieldProps,
} from './components/Field/Time/TimeField'
export {
  default as Dropdown,
  type DropdownProps,
  type DropdownOption,
} from './components/Field/Dropdown/Regular'
export {
  default as SearchableSimple,
  type SearchableSimpleProps,
  type DropdownOption as SearchableSimpleDropdownOption,
} from './components/Field/Dropdown/SearchableSimple'
export {
  default as SearchableHistory,
  type SearchableHistoryProps,
  type NavigationItem,
} from './components/Field/Dropdown/SearchableHistory'

// Layout Components
export { default as Paper } from './components/Paper'
export { default as Divider } from './components/Divider'

// Animation Components
export { default as Fade } from './components/Fade'
export { default as Zoom } from './components/Zoom'
export { default as Slide } from './components/Slide'

// Data Display
export { default as DataGrid } from './components/DataGrid'
export {
  default as Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  type TableContainerProps,
  type TableHeadProps,
  type TableBodyProps,
  type TableRowProps,
  type TableCellProps,
} from './components/Table'
export {
  default as FormDataGrid,
  type FormDataGridProps,
} from './components/Form/DataGrid'
export {
  default as MetricCard,
  type MetricCardProps,
} from './components/DataGrid/MetricCard'
export { default as MetricSection } from './components/DataGrid/MetricSection'
export type {
  ColumnDef,
  CompositeFieldConfig,
  RowData,
  DatagridProps,
  DataGridFilter,
  MetricCardData,
} from './components/DataGrid/types'
export {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  type ListProps,
  type ListItemProps,
  type ListItemIconProps,
  type ListItemTextProps,
} from './components/List'
export { default as Avatar } from './components/Avatar'
export {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  type CardProps,
  type CardContentProps,
  type CardActionsProps,
  type CardHeaderProps,
} from './components/Card'

// Feedback Components
export { default as Snackbar } from './components/Snackbar'
export { default as ProgressBar } from './components/ProgressBar'
export { default as Pagination } from './components/Pagination'

// Calendar Components
export {
  default as BigCalendar,
  type CalendarEvent,
  type CalendarFilterOptions,
} from './components/BigCalendar'

// Slider Component
export { default as Slider, type SliderProps } from './components/Field/Slider'

// Icons - Re-export all as namespace
export * as Icons from './components/Icons'

// Utils
export { alpha } from './utils/alpha'
export * from './utils/keyframes'

// Theme exports
export * from './theme'

// Types
export type {
  RawCustomer,
  RawSeverityLevel,
  Task,
  Comment,
  CommentEditHistory,
  CaseUpdate,
  ColumnData,
  BoardType,
  RawStatus,
  RawSubStatus,
  RawTopic,
  RawQueue,
  RawArticle,
  RawEmployee,
  RawCompany,
  RawProduct,
  RawService,
  RawRegion,
  BoardVariant,
  CurrentUser,
  ProjectBoardProps,
  ViewState,
  AddTaskFormType,
  ProjectBoardStyles,
  TaskMeeting,
  NewMeetingData,
} from './components/ProjectBoard/types'

// Task Management Components
export { default as ProjectBoard } from './components/ProjectBoard'
export { InlineAddTask } from './components/ProjectBoard/forms/AddTask/inline'
export { InlineShowTask } from './components/ProjectBoard/forms/ShowTask/inline'

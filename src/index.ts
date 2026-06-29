// Global stylesheet — static @keyframes + shadow/transition design tokens
// that replaced the old runtime-injected JS theme system (src/theme). Bundled
// into dist/goobs-frontend.css via the package's "*.css" sideEffects entry.
import './styles/global.css'

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
  default as SaveButton,
  type SaveButtonProps,
} from './components/Button/SaveButton'
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
export type { ConfirmationCodeInputStyles } from './components/ConfirmationCodeInput/types'
export {
  default as RadioGroup,
  type RadioOption,
  type RadioGroupProps,
} from './components/RadioGroup'
export { default as Dialog, type DialogProps } from './components/Dialog'
export { default as CodeCopy, type CodeCopyProps } from './components/CodeCopy'
export { default as Markdown, type MarkdownProps } from './components/Markdown'
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
export {
  default as Chip,
  type ChipProps,
  type ChipStyles,
  type ChipVariant,
} from './components/Chip'
export { default as Switch, type SwitchProps } from './components/Switch'

// Field Shell — canonical wrapper used by every Field component
export type { FormFieldStyles } from './components/Field/Shell/types'
export {
  default as FieldShell,
  type FieldShellProps,
  type FieldShellSlot,
  type FieldStyleOverrides,
  type FieldTheme,
  type FieldChangeHandler,
  type FieldValidityHandler,
  type FieldValidator,
  getRequiredProps,
  validateRequired,
  useEscape,
  useArrowKeyNav,
  type ArrowKeyNavOptions,
} from './components/Field/Shell'

// Form — goobs-owned, zod-native controlled form engine (8-method FormEngine
// seam). Fields auto-bind by `name` inside a <Form>; explicit-prop callsites
// outside a form are untouched. See components/Form/context.ts.
export {
  default as Form,
  useFormContext,
  useOptionalFormContext,
  useFormField,
  useFieldArray,
  type FieldArrayBinding,
  useFieldValues,
  type FieldValuesBinding,
  type FormProps,
  type FormEngine,
  type FormContextValue,
} from './components/Form'
export {
  useFieldBinding,
  type FieldBindingAdapter,
} from './components/Field/Shell/useFieldBinding'

// Field Components
export {
  default as TextField,
  type TextFieldProps,
} from './components/Field/Text'
export {
  default as SignatureField,
  type SignatureFieldProps,
} from './components/Field/Signature'
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
  default as MoneyText,
  type MoneyTextProps,
  type MoneyTextTone,
} from './components/Field/USD/MoneyText'
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
export {
  default as FileDropzone,
  type FileDropzoneProps,
  type FileDropzoneVariant,
} from './components/FileDropzone'

// Layout Components
export { default as Paper } from './components/Paper'
export { default as Divider } from './components/Divider'
// FieldGrid — responsive auto-fit field-cluster layout primitive. Lives with
// the layout components since it is a generic grid wrapper, not a Field.
export {
  default as FieldGrid,
  type FieldGridProps,
} from './components/FieldGrid'

// Animation Components
export { default as Fade } from './components/Fade'
export { default as Zoom } from './components/Zoom'
export { default as Slide, type SlideStyles } from './components/Slide'

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
// Metric primitives. Relocated 2026-05-22 from DataGrid-scoped folders to
// `components/Metric/` — the audience is broader than DataGrid (workspaces,
// dashboards, dialogs all show metric cards). MetricSection has been fully
// folded into MetricsAccordion (no separate export; DataGrid passes its
// `metrics` array directly to MetricsAccordion now).
export {
  default as MetricCard,
  type MetricCardProps,
} from './components/Metric/Card'
export {
  default as MetricsAccordion,
  type MetricsAccordionProps,
  type MetricsGroup,
} from './components/Metric/Accordion'
export type { MetricCardData } from './components/Metric/types'

// Filter Section — unified search / dropdown / chip-cluster / date-range /
// toggle / button row. Replaces DataGrid's old FilterSection (now removed
// from there) and the ~10 ad-hoc filter rows hand-rolled across ThothOS
// workspaces. Optional accordion shell mirrors MetricsAccordion but
// defaults to `initiallyOpen={true}` because filters are primary UI.
export {
  default as FilterSection,
  type FilterSectionProps,
  type FilterDropdownDef,
  type FilterChipOption,
  type FilterChipClusterDef,
  type FilterDateRangeDef,
  type FilterToggleDef,
  type FilterButtonDef,
} from './components/Filter/Section'
export type {
  ColumnDef,
  CompositeFieldConfig,
  RowData,
  DatagridProps,
  DataGridFilter,
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
// Card — compositional surface primitive. Replaced the legacy MUI-style
// CardHeader/CardContent/CardActions trio on 2026-05-22 with a slot-
// based compound family (`Card.Header`, `Card.Body`, etc.). The static
// subcomponents are reachable off `Card.*` AND as named exports so test
// utilities / scaffolders can import them directly.
export {
  default as Card,
  CardHeader,
  CardHeaderIcon,
  CardHeaderMeta,
  CardTitle,
  CardSubtitle,
  CardHeaderBadges,
  CardHeaderActions,
  CardSelectionCheckbox,
  CardBody,
  CardDescription,
  CardSection,
  CardBanner,
  CardMetrics,
  CardMetric,
  CardBigValue,
  CardStats,
  CardStatCell,
  CardProgress,
  CardFooter,
  CardFooterActions,
  CardFooterMeta,
  CardConfirmDelete,
  CardDragHandle,
  CardGrid,
  CardEmptyState,
  type CardProps,
  type CardTheme,
  type CardHeaderProps,
  type CardHeaderIconProps,
  type CardHeaderMetaProps,
  type CardTitleProps,
  type CardSubtitleProps,
  type CardHeaderBadgesProps,
  type CardHeaderActionsProps,
  type CardSelectionCheckboxProps,
  type CardBodyProps,
  type CardDescriptionProps,
  type CardSectionProps,
  type CardBannerProps,
  type CardBannerTone,
  type CardMetricsProps,
  type CardMetricProps,
  type CardBigValueProps,
  type CardBigValueTone,
  type CardStatsProps,
  type CardStatCellProps,
  type CardProgressProps,
  type CardFooterProps,
  type CardFooterActionsProps,
  type CardFooterMetaProps,
  type CardConfirmDeleteProps,
  type CardDragHandleProps,
  type CardGridProps,
  type CardEmptyStateProps,
} from './components/Card'
// Panel — full-height shell surface compound primitive (sibling of Card). The
// static region subcomponents are reachable off `Panel.*` AND as named exports.
export {
  default as Panel,
  PanelHeader,
  PanelBody,
  PanelFooter,
  type PanelProps,
  type PanelVariant,
  type PanelHeaderProps,
  type PanelBodyProps,
  type PanelFooterProps,
} from './components/Panel'
// DetailField / DetailGrid — read-only label/value definition-list primitives.
export {
  default as DetailField,
  DetailGrid,
  type DetailFieldProps,
  type DetailGridProps,
  type DetailGridFieldDescriptor,
} from './components/DetailField'
// EmptyState — standalone empty / zero-data placeholder (promoted out of
// Card.EmptyState so it can be used anywhere).
export {
  default as EmptyState,
  type EmptyStateProps,
  type EmptyStateTheme,
} from './components/EmptyState'
// ListItemCard — row primitive for ordered / editable / selectable lists. The
// static slot subcomponents are reachable off `ListItemCard.*` AND as named
// exports.
export {
  default as ListItemCard,
  ListItemCardOrder,
  ListItemCardIcon,
  ListItemCardContent,
  ListItemCardActions,
  type ListItemCardProps,
  type ListItemCardTheme,
  type ListItemCardOrderProps,
  type ListItemCardIconProps,
  type ListItemCardContentProps,
  type ListItemCardActionsProps,
} from './components/ListItemCard'
// SacredGlyphFrame — animated gold-glow + decorative glyph wrapper for sacred
// surfaces.
export {
  default as SacredGlyphFrame,
  type SacredGlyphFrameProps,
} from './components/SacredGlyphFrame'

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
// Per-icon styling contract, also surfaced at top level (was previously
// re-exported via the now-removed `export * from './theme'`).
export type { IconStyles } from './components/Icons/types'
// Egyptian-hieroglyph set, available for opt-in decorative use (no longer
// force-rendered onto sacred-theme icons).
export { SACRED_GLYPHS } from './components/Icons/sacredGlyphs'
export type { SacredGlyph } from './components/Icons/sacredGlyphs'

// Utils
export { alpha } from './utils/alpha'
export * from './utils/keyframes'

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

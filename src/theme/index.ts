// Combined theme file - typography, colors, and sacred glyphs
import { TypographyProps } from '../components/Typography'

// Slim formField theme — the bulk of the helpers were deleted in the
// 2026-05-01 Field overhaul (replaced by CSS modules + the FieldShell
// primitive). The remaining symbols are still consumed by
// `ComplexTextEditor` and `BigCalendar` themes, plus generic
// required-field utilities.
export {
  type FormFieldTheme,
  type FormFieldStyles,
  formFieldThemes,
  getFormFieldTheme,
  getRequiredProps,
  validateRequired,
} from './formField'

// Export accordion theme system
export type { AccordionTheme, AccordionStyles } from './accordion'
export {
  accordionThemes,
  getAccordionTheme,
  getAccordionStyles,
} from './accordion'

// Export breadcrumb theme system
export type { BreadcrumbTheme, BreadcrumbStyles } from './breadcrumb'
export {
  breadcrumbThemes,
  getBreadcrumbTheme,
  getBreadcrumbStyles,
} from './breadcrumb'

// Export appbar theme system
export type { AppBarTheme, AppBarStyles } from './appbar'
export { appBarThemes, getAppBarTheme, getAppBarStyles } from './appbar'

// Export alert theme system
export type { AlertTheme, AlertStyles } from './alert'
export { alertThemes, getAlertTheme, getAlertStyles } from './alert'

// Export button theme system
export type { ButtonTheme, ButtonStyles } from './button'
export { buttonThemes, getButtonTheme, getButtonStyles } from './button'

// Export icon theme system
export type { IconTheme, IconStyles } from './icon'
export {
  iconThemes,
  getIconTheme,
  getIconStyles,
  injectSacredKeyframes,
} from './icon'

// Export container theme system
export type { ContainerTheme, ContainerStyles } from './container'
export {
  containerThemes,
  getContainerTheme,
  getContainerStyles,
} from './container'

// Export avatar theme system
export type { AvatarTheme, AvatarStyles } from './avatar'
export { avatarThemes, getAvatarTheme, getAvatarStyles } from './avatar'

// Export divider theme system
export type { DividerTheme, DividerStyles } from './divider'
export { dividerThemes, getDividerTheme, getDividerStyles } from './divider'

// Export fade theme system
export type { FadeTheme, FadeStyles } from './fade'
export { fadeThemes, getFadeTheme, getFadeStyles } from './fade'

// Export slide theme system
export type { SlideTheme, SlideStyles } from './slide'
export { slideThemes, getSlideTheme, getSlideStyles } from './slide'

// Export zoom theme system
export type { ZoomTheme, ZoomStyles } from './zoom'
export { zoomThemes, getZoomTheme, getZoomStyles } from './zoom'

// Export dropdown theme system
export type { DropdownTheme, DropdownStyles } from './dropdown'
export { dropdownThemes, getDropdownTheme, getDropdownStyles } from './dropdown'

// Export nav theme system
export type { NavTheme, NavStyles } from './nav'
export { navThemes, getNavTheme, getNavStyles } from './nav'

// Chip theme system was removed 2026-05-22 — Chip migrated to
// `components/Chip/Chip.module.css` (matching the redesigned component
// family). `ChipStyles` is now re-exported from the component itself.

// Export checkbox theme system
export type { CheckboxTheme, CheckboxStyles } from './checkbox'
export { checkboxThemes, getCheckboxTheme, getCheckboxStyles } from './checkbox'

// Export codecopy theme system
export type { CodeCopyTheme, CodeCopyStyles } from './codecopy'
export { getCodeCopyStyles } from './codecopy'

// Export datagrid types (CSS-based styling, no JS theme functions)
export type { DataGridTheme, DataGridStyles } from './datagrid'

// Export complex text editor theme system
export type {
  ComplexTextEditorTheme,
  ComplexTextEditorStyles,
} from './complextexteditor'
export {
  complexTextEditorThemes,
  getComplexTextEditorTheme,
  getComplexTextEditorStyles,
} from './complextexteditor'

// Export confirmation code input theme system
export type {
  ConfirmationCodeInputTheme,
  ConfirmationCodeInputStyles,
} from './confirmationcodeinput'
export {
  confirmationCodeInputThemes,
  getConfirmationCodeInputTheme,
  getConfirmationCodeInputStyles,
} from './confirmationcodeinput'

// Export drawer theme system
export type { DrawerTheme, DrawerStyles } from './drawer'
export { drawerThemes, getDrawerTheme, getDrawerStyles } from './drawer'

// Export progress bar theme system
export type { ProgressBarTheme, ProgressBarStyles } from './progressbar'
export {
  progressBarThemes,
  getProgressBarTheme,
  getProgressBarStyles,
} from './progressbar'

// Export paper theme system
export type { PaperTheme, PaperStyles } from './paper'
export { paperThemes, getPaperTheme, getPaperStyles } from './paper'

// Export card theme system
export type { CardTheme, CardStyles } from './card'
export { cardThemes, getCardTheme, getCardStyles } from './card'

// Export pricing table theme system
export type { PricingTableTheme, PricingTableStyles } from './pricingtable'
export {
  pricingTableThemes,
  getPricingTableTheme,
  getPricingTableStyles,
} from './pricingtable'

// Export project board theme system
export type { ProjectBoardTheme, ProjectBoardStyles } from './projectboard'
export {
  projectBoardThemes,
  getProjectBoardTheme,
  getProjectBoardStyles,
} from './projectboard'

// Export toolbar theme system
export type { ToolbarTheme, ToolbarStyles } from './toolbar'
export { toolbarThemes, getToolbarTheme, getToolbarStyles } from './toolbar'

// Export stepper theme system
export type { StepperTheme, StepperStyles } from './stepper'
export { getStepperStyles } from './stepper'

// Export tooltip theme system
export type { TooltipTheme, TooltipStyles } from './tooltip'
export { tooltipThemes, getTooltipTheme, getTooltipStyles } from './tooltip'

// Export switch theme system
export type { SwitchTheme, SwitchStyles } from './switch'
export { getSwitchStyles } from './switch'

// Export tabs theme system
export type { TabsTheme, TabsStyles } from './tabs'
export { tabsThemes, getTabsTheme, getTabsStyles } from './tabs'

// Export treeview theme system
export type { TreeViewTheme, TreeViewStyles } from './treeview'
export {
  treeViewThemes,
  getTreeViewStyles,
  getTreeItemStyles,
} from './treeview'

// Export pagination theme system
export type { PaginationTheme, PaginationStyles } from './pagination'
export {
  paginationThemes,
  getPaginationTheme,
  getPaginationStyles,
} from './pagination'

// Export shared elements
export { TRANSITIONS, SHADOWS } from './shared'

// Export Typography types for use throughout the application
export type { TypographyProps }

// --------------------------------------------------------------------------
// TYPOGRAPHY CONFIGURATIONS
// --------------------------------------------------------------------------

// Define base configurations for each heading level
const h1Config = {
  fontSize: '3rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h2Config = {
  fontSize: '2.5rem',
  fontWeight: 700,
  textTransform: 'none',
}

const h3Config = {
  fontSize: '2rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h4Config = {
  fontSize: '1.5rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h5Config = {
  fontSize: '1.25rem',
  fontWeight: 400,
  textTransform: 'none',
}

const h6Config = {
  fontSize: '1.1rem',
  fontWeight: 400,
  textTransform: 'none',
}

const paragraphConfig = {
  fontSize: '.9rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperHeaderConfig = {
  fontSize: '0.8rem',
  fontWeight: 400,
  textTransform: 'none',
}

const helperFooterConfig = {
  fontSize: '0.7rem',
  fontWeight: 400,
  textTransform: 'none',
}

const arapeyFontFamily = 'var(--font-arapey)'
const interFontFamily = 'var(--font-inter)'
const merriweatherFontFamily = 'var(--font-merriweather)'

// Typography exports
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

// Sacred Glyphs are now imported from shared file

// Color Palette
export const moss = {
  main: '#21475B',
  light: '#4C7186',
  dark: '#102A36',
}

export const aqua = {
  main: '#9CE4F8',
  light: '#C5F0FB',
  dark: '#6AB6D1',
}

export const madder = {
  main: '#4661A8',
  light: '#7488C1',
  dark: '#2C3E6E',
}

export const woad = {
  main: '#63B3DD',
  light: '#8ECAE6',
  dark: '#3E7DA3',
}

export const marine = {
  main: '#013E89',
  light: '#3367B2',
  dark: '#002756',
}

export const pansy = {
  main: '#7E5A75',
  light: '#A07E9B',
  dark: '#51384C',
}

export const stainlessSteel = {
  main: '#150D22',
  light: '#423753',
  dark: '#08060E',
}

export const coal = {
  main: '#151519',
  light: '#42424A',
  dark: '#0A0A0B',
}

export const ocean = {
  main: '#0E3065',
  light: '#355088',
  dark: '#081E40',
}

export const sky = {
  main: '#47C7FE',
  light: '#7ADAFE',
  dark: '#2D8CC1',
}

export const salmon = {
  main: '#E1A9A7',
  light: '#ECC7C5',
  dark: '#C47D7B',
}

export const lightning = {
  main: '#0880AC',
  light: '#35A7C9',
  dark: '#055A7D',
}

export const sage = {
  main: '#A6D0D6',
  light: '#C5E1E5',
  dark: '#7AA3A9',
}

export const lilac = {
  main: '#BEB9EA',
  light: '#D6D4F1',
  dark: '#8E8AC0',
}

export const gunpowder = {
  main: '#210352',
  light: '#4D337D',
  dark: '#11022A',
}

export const lightMadder = {
  main: '#4661A8',
  light: '#7488C1',
  dark: '#2C3E6E',
}

export const black = {
  main: '#000000',
  light: '#333333',
  dark: '#000000',
}

export const white = {
  main: '#ffffff',
  light: '#ffffff',
  dark: '#eeeeee',
}

export const none = {
  main: 'rgba(0, 0, 0, 0)',
  light: 'rgba(0, 0, 0, 0)',
  dark: 'rgba(0, 0, 0, 0)',
}

export const semiTransparentWhite = {
  main: 'rgba(255, 255, 255, 0.09)',
  light: 'rgba(255, 255, 255, 0.15)',
  dark: 'rgba(255, 255, 255, 0.05)',
}

export const semiTransparentBlack = {
  main: 'rgba(0, 0, 0, 0.09)',
  light: 'rgba(0, 0, 0, 0.15)',
  dark: 'rgba(0, 0, 0, 0.05)',
}

export const red = {
  main: '#FF0000',
  light: '#FF4C4C',
  dark: '#B30000',
}

export const green = {
  main: '#00FF00',
  light: '#4CFF4C',
  dark: '#00B300',
}

export const grey = {
  main: '#E8E8E8',
  light: '#F5F5F5',
  dark: '#BDBDBD',
}

export * from './button'
export * from './card'
export * from './checkbox'
export * from './dialog'
export * from './divider'
export * from './drawer'
export * from './list'
export * from './paper'
export * from './popover'
export * from './pricingtable'
export * from './table'

/**
 * Shared type definitions for the Field/Shell primitive and the 27
 * Field components that compose it.
 *
 * Replaces the deleted `src/theme/formField.ts:FormFieldStyles`
 * interface with a much smaller `FieldStyleOverrides` type. Colors,
 * borders, transitions, and pseudo-state styling now live in
 * `FieldShell.module.css` (driven by `[data-theme]` and `[data-state]`
 * attribute selectors); this type only carries per-instance overrides
 * consumers genuinely need to set from JSX.
 */

/**
 * The canonical theme name. Drives the `data-theme` attribute on the
 * shell wrapper, which CSS selectors switch off of. Adding a new
 * theme means adding a `[data-theme="<name>"] { … }` block to
 * `FieldShell.module.css` — no JS change needed.
 */
export type FieldTheme = 'light' | 'dark' | 'sacred'

/**
 * Optional per-instance style overrides. Most consumers pass
 * `{ disabled, required, theme }` and never touch the rest. The
 * layout/color overrides exist for the rare cases where a workspace
 * needs to deviate from the default CSS without forking the component.
 *
 * Color/border overrides are CSS-variable passthroughs: spread them
 * into the shell's `style={}` to override the variable for that
 * instance only (e.g. `style={{ '--field-bg': 'hsl(0,0%,5%)' }}`).
 */
export interface FieldStyleOverrides {
  /**
   * Theme selection. `'sacred'` is the goobs default. `'light'` and
   * `'dark'` are the light/dark variants.
   */
  theme?: FieldTheme

  // ── Per-instance state ────────────────────────────────────────────
  /** Mark the field disabled. Sets `aria-disabled` + native `disabled`. */
  disabled?: boolean
  /**
   * Mark the field required. Renders the required indicator next to
   * the label and sets `aria-required` on the input/trigger.
   */
  required?: boolean
  /**
   * Glyph for the required indicator. Defaults to `' *'`. Common
   * overrides: `' (required)'`, `'  *'` (extra space).
   */
  requiredIndicatorText?: string
  /**
   * Force the helper text region into error-styled colors even when
   * no validation message is set. Mostly used by components that
   * propagate validation state via CSS class. Leave undefined to
   * follow the natural `error` prop.
   */
  helperTextType?: 'error' | 'info'

  // ── Layout overrides ─────────────────────────────────────────────
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  padding?: string
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  borderRadius?: string
  borderWidth?: string

  // ── Typography overrides ─────────────────────────────────────────
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  lineHeight?: string

  // ── Color overrides — friendly aliases for the CSS variables ─────
  // FieldShell translates these into `--field-bg` / `--field-border-default`
  // / `--field-text` CSS variable overrides on the wrapper, so consumers
  // don't have to know the variable names. Use the variable form
  // directly for the rest of the theme tokens (focus border, label
  // colors, helper text, etc.).
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  textColor?: string
  labelColor?: string
  labelFocusedColor?: string
  labelErrorColor?: string
  adornmentColor?: string
  adornmentFocusedColor?: string
  helperTextColor?: string
  helperTextErrorColor?: string

  // ── Color/border overrides via CSS variables ─────────────────────
  // These are spread into the shell's inline style to override the
  // module's defaults for that instance only. Index-signature pattern
  // because TS requires it for arbitrary `--*` keys.
  [cssCustomProperty: `--${string}`]: string | undefined
}

/**
 * Legacy field-styling override contract. Relocated verbatim from the old
 * `src/theme/formField.ts` (removed in the css-modules-theme-removal teardown).
 *
 * Field/Shell itself uses the slimmer `FieldStyleOverrides` above. This larger
 * shape only survives because `MenuItem` and `Select` still `extends` it for
 * their `MenuItemStyles` / `SelectStyles` props — those two select-family
 * components haven't been migrated onto `FieldStyleOverrides` yet. Kept here so
 * the field-styling types live in one place rather than re-introducing a theme
 * module just for a type.
 */
export interface FormFieldStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Custom colors (all must be rgba format)
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  textColor?: string
  labelColor?: string
  labelFocusedColor?: string
  labelErrorColor?: string
  labelShrunkBackgroundColor?: string
  adornmentColor?: string
  adornmentFocusedColor?: string
  footerTextColor?: string
  footerTextErrorColor?: string
  footerTextInfoColor?: string
  fontFamily?: string

  // Required field styling
  requiredIndicatorColor?: string
  requiredIndicatorText?: string

  // Field state
  disabled?: boolean
  required?: boolean
  helperTextType?: 'error' | 'info'

  // Layout and spacing
  padding?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Border and shape
  borderRadius?: string
  borderWidth?: string

  // Typography
  fontSize?: string
  fontWeight?: string | number
  lineHeight?: string

  // Dimensions
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string

  // Adornment positioning (inherited by ComplexTextEditor + dropdown styles)
  startAdornmentOffset?: string
  endAdornmentOffset?: string
  arrowTop?: string
  arrowRight?: string
  arrowBottom?: string
  arrowLeft?: string
  arrowPadding?: string

  // Label positioning
  labelOffset?: string
  labelShrunkOffset?: string

  // Footer spacing
  footerMarginTop?: string
  footerFontSize?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

/**
 * Canonical onChange shape for primitive-value fields. T is `string`
 * for text/dropdown/IPAM, `number` for slider/percentage/increment.
 *
 * Object-payload fields (DateRange, Subnet, etc.) keep their
 * structural type; this alias is for the primitive cases that
 * collapsed to value-only in this overhaul.
 */
export type FieldChangeHandler<T = string> = (value: T) => void

/**
 * Optional side-channel for components that need to surface
 * validation state separately from the value. Replaces the deleted
 * tuple-return onChange shapes (`(value, isValid)` etc.) — consumers
 * who care about validity wire this; consumers who don't, don't.
 */
export type FieldValidityHandler = (isValid: boolean) => void

/**
 * Pure function shape for synchronous validators. Returns an error
 * string (rendered in the helper region) or undefined when valid.
 */
export type FieldValidator<T = string> = (value: T) => string | undefined

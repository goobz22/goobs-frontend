'use client'

/**
 * <FieldShell> — canonical wrapper for every Field component.
 *
 * Provides a single, consistent implementation of:
 *
 *   - <label htmlFor={...}> linked to the input via useId-generated id
 *   - aria-required / aria-disabled / aria-invalid wired from props
 *   - aria-describedby → helper/error region (so screenreaders
 *     announce validation messages)
 *   - data-field / data-field-name / data-state / data-theme
 *     attributes on the wrapper for stable test selectors
 *   - Required indicator span with consistent styling
 *   - Helper / error region with role="alert" when in error state
 *
 * The actual input/button/popover-trigger element is rendered by the
 * consumer via a render-prop (`children`) which receives a slot of
 * `inputId`, `helperId`, and a pre-built `inputAriaProps` bag to spread
 * onto the element:
 *
 *     <FieldShell label="Category" required>
 *       {({ inputId, inputAriaProps }) => (
 *         <input id={inputId} {...inputAriaProps} />
 *       )}
 *     </FieldShell>
 *
 * Visual styling lives in `FieldShell.module.css`. Theme tokens are
 * CSS custom properties switched by the `[data-theme]` attribute on
 * the rendered wrapper. Components don't need `useState(isFocused)`
 * — `:focus-visible` and `[aria-invalid]` selectors handle visual
 * state in CSS, eliminating per-render style allocations and
 * focus/blur re-renders.
 */

import React, { useId, type CSSProperties, type ReactNode } from 'react'
import cssStyles from './FieldShell.module.css'
import type { FieldStyleOverrides, FieldTheme } from './types'

export interface FieldShellSlot {
  /**
   * Stable id from React's useId(). Spread onto the input/button as
   * `id={inputId}` so the auto-rendered <label htmlFor=…> links to it.
   */
  inputId: string
  /**
   * Stable id for the helper/error region. The `inputAriaProps`
   * already wires this via aria-describedby — exposed here for cases
   * where the consumer needs it directly (e.g. multi-element fields
   * like DateRange where two inputs share one helper region).
   */
  helperId: string
  /**
   * Pre-built ARIA prop bag. Spread onto your input/button:
   *
   *     <input {...inputAriaProps} />
   *
   * Sets aria-required, aria-disabled, aria-invalid, and
   * aria-describedby (when error/helperText is present).
   */
  inputAriaProps: {
    'aria-required'?: boolean
    'aria-disabled'?: boolean
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }
}

export interface FieldShellProps {
  /**
   * Visible label. Rendered inside a real `<label htmlFor={inputId}>`
   * so `getByLabel(/foo/i)` and screenreader announcement both work.
   * Pass null/undefined to render no label (rare — bare inputs in
   * data tables, for example).
   */
  label?: ReactNode | undefined

  /**
   * Marks the field required. Renders the required indicator next to
   * the label and sets aria-required on the input via inputAriaProps.
   * Top-level for ergonomic API; mirrored from `styles.required` if
   * present (consumers can set either; top-level wins).
   */
  required?: boolean | undefined

  /**
   * Disabled state. Sets aria-disabled on the wrapper (CSS dims +
   * pointer-events:none). The consumer's input also needs the native
   * `disabled` attribute — pass `disabled` separately to your input.
   */
  disabled?: boolean | undefined

  /**
   * Error state. When a string is set, the helper region renders the
   * error text with role="alert" + aria-live="polite", and the input
   * gets aria-invalid="true" via inputAriaProps. Pass `true` (boolean)
   * for error styling without a message — the helper region collapses
   * to its info text in that case but the field still styles as
   * invalid.
   */
  error?: string | boolean | undefined

  /**
   * Helper text shown below the input. Replaced by `error` when set.
   * The region exists in the DOM at all times (with min-height so the
   * layout doesn't jump on validation flips).
   */
  helperText?: ReactNode | undefined

  /**
   * Stable test selector. Emitted as `data-field="<value>"` on the
   * wrapper — typically the canonical entity name (`"category"`,
   * `"contract"`).
   */
  dataField?: string | undefined

  /**
   * Stable test selector. Emitted as `data-field-name="<value>"` on
   * the wrapper — typically the form-input name (`"customerName"`,
   * `"address1"`). Used by Playwright `[data-field-name="…"]`
   * locators.
   */
  dataFieldName?: string | undefined

  /**
   * Visual state for the data-state attribute. Drives focus/error CSS
   * selectors. Most consumers don't pass this — leave it undefined and
   * CSS pseudo-classes (`:focus-within`, `[aria-invalid]`) do the
   * work. Pass an explicit value for cases CSS can't detect, like
   * `'open'` on a controlled dropdown popover.
   */
  state?: 'idle' | 'focus' | 'open' | 'error' | undefined

  /**
   * Per-instance overrides. Most properties become inline styles on
   * the wrapper; `theme`/`disabled`/`required`/`requiredIndicatorText`/
   * `helperTextType` drive ARIA + data attributes; CSS-variable keys
   * (`--field-bg`, etc.) override the module's theme tokens for that
   * instance.
   */
  styles?: FieldStyleOverrides | undefined

  /**
   * The input/button/popover-trigger element. Receives the slot with
   * inputId, helperId, and inputAriaProps. Spread inputAriaProps onto
   * your element so ARIA wiring doesn't get out of sync.
   */
  children: (slot: FieldShellSlot) => ReactNode
}

/**
 * Convert FieldStyleOverrides into a CSSProperties bag, splitting
 * native CSS properties from CSS-variable keys (which need their own
 * pass-through because TS treats them as additional string-keyed
 * entries).
 */
function styleOverridesToCss(
  styles: FieldStyleOverrides | undefined
): CSSProperties {
  if (!styles) return {}
  const out: Record<string, string | number | undefined> = {}
  // Whitelist of layout/typography keys we forward as inline styles.
  // Theme/state keys (theme, disabled, required, ...) drive ARIA, not CSS.
  const layoutKeys = [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'borderRadius',
    'borderWidth',
    'fontSize',
    'fontWeight',
    'fontFamily',
    'lineHeight',
  ] as const
  for (const key of layoutKeys) {
    const value = styles[key]
    if (value !== undefined) out[key] = value
  }
  // Friendly color aliases → CSS variables. Lets consumers write
  // `styles={{ backgroundColor: 'rgba(0,0,0,0.3)' }}` without knowing
  // the `--field-bg` variable name. The CSS module's selectors then
  // pick these up in the same place they'd pick up an explicit
  // `--field-bg` override.
  if (styles.backgroundColor !== undefined) {
    out['--field-bg'] = styles.backgroundColor
  }
  if (styles.borderColor !== undefined) {
    out['--field-border-default'] = styles.borderColor
  }
  if (styles.borderFocusedColor !== undefined) {
    out['--field-border-focus'] = styles.borderFocusedColor
  }
  if (styles.borderErrorColor !== undefined) {
    out['--field-border-error'] = styles.borderErrorColor
  }
  if (styles.textColor !== undefined) {
    out['--field-text'] = styles.textColor
  }
  if (styles.labelColor !== undefined) {
    out['--field-label-default'] = styles.labelColor
  }
  if (styles.labelFocusedColor !== undefined) {
    out['--field-label-focus'] = styles.labelFocusedColor
  }
  if (styles.labelErrorColor !== undefined) {
    out['--field-label-error'] = styles.labelErrorColor
  }
  if (styles.adornmentColor !== undefined) {
    out['--field-adornment-default'] = styles.adornmentColor
  }
  if (styles.adornmentFocusedColor !== undefined) {
    out['--field-adornment-focus'] = styles.adornmentFocusedColor
  }
  if (styles.helperTextColor !== undefined) {
    out['--field-helper-default'] = styles.helperTextColor
  }
  if (styles.helperTextErrorColor !== undefined) {
    out['--field-helper-error'] = styles.helperTextErrorColor
  }
  // CSS-variable passthrough — any key starting with `--` is a custom
  // property override. The index signature on FieldStyleOverrides
  // permits these.
  for (const key of Object.keys(styles)) {
    if (key.startsWith('--')) {
      const value = (styles as Record<string, unknown>)[key]
      if (typeof value === 'string') out[key] = value
    }
  }
  return out as CSSProperties
}

const FieldShell: React.FC<FieldShellProps> = ({
  label,
  required: requiredProp,
  disabled: disabledProp,
  error,
  helperText,
  dataField,
  dataFieldName,
  state,
  styles,
  children,
}) => {
  // useId gives stable, SSR-safe ids per instance. Two ids: one for
  // the input itself (label htmlFor + aria-controls / etc. anchor),
  // one for the helper region (aria-describedby target).
  const reactId = useId()
  const inputId = `field-${reactId}`
  const helperId = `field-helper-${reactId}`

  // Top-level props win over styles-nested. Most consumers will pass
  // exactly one or the other, but if both are set the explicit
  // top-level prop is the documented winner.
  const required = requiredProp ?? styles?.required ?? false
  const disabled = disabledProp ?? styles?.disabled ?? false
  const theme: FieldTheme = styles?.theme ?? 'sacred'
  const requiredIndicator = styles?.requiredIndicatorText ?? ' *'

  // Error handling: string error sets aria-invalid AND renders the
  // string in the helper region. Boolean true sets aria-invalid AND
  // keeps the helperText (consumer can render their own bespoke
  // error elsewhere). Falsy = no error.
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : null

  // Decide which message to show in the helper region. Error takes
  // precedence; otherwise fall back to helperText.
  const helperContent = errorMessage ?? helperText
  const showHelper = helperContent !== undefined && helperContent !== null
  const helperType: 'error' | 'info' | undefined = hasError
    ? 'error'
    : styles?.helperTextType

  // Resolved data-state: explicit prop > error > undefined (CSS
  // pseudo-classes handle focus on their own).
  const resolvedState = state ?? (hasError ? 'error' : undefined)

  // Build the ARIA prop bag the consumer spreads onto their element.
  // Only include attributes when their values would be meaningful —
  // omitting `aria-required="false"` keeps the AT tree quieter than
  // emitting it everywhere.
  const inputAriaProps: FieldShellSlot['inputAriaProps'] = {}
  if (required) inputAriaProps['aria-required'] = true
  if (disabled) inputAriaProps['aria-disabled'] = true
  if (hasError) inputAriaProps['aria-invalid'] = true
  if (showHelper) inputAriaProps['aria-describedby'] = helperId

  return (
    <div
      className={cssStyles.shell}
      data-theme={theme}
      data-state={resolvedState}
      data-field={dataField}
      data-field-name={dataFieldName}
      aria-disabled={disabled || undefined}
      aria-invalid={hasError || undefined}
      style={styleOverridesToCss(styles)}
    >
      {label !== undefined && label !== null && (
        <label htmlFor={inputId} className={cssStyles.label}>
          {label}
          {required && (
            <span aria-hidden="true" className={cssStyles.requiredIndicator}>
              {requiredIndicator}
            </span>
          )}
        </label>
      )}

      {children({ inputId, helperId, inputAriaProps })}

      {showHelper && (
        <div
          id={helperId}
          className={cssStyles.helper}
          data-helper-type={helperType}
          role={hasError ? 'alert' : undefined}
          aria-live={hasError ? 'polite' : undefined}
        >
          {helperContent}
        </div>
      )}
    </div>
  )
}

FieldShell.displayName = 'FieldShell'

export default FieldShell
export type { FieldStyleOverrides, FieldTheme } from './types'
export {
  type FieldChangeHandler,
  type FieldValidityHandler,
  type FieldValidator,
} from './types'
export { getRequiredProps, validateRequired } from './utils'
export { useEscape, useArrowKeyNav } from './keyboard'
export type { ArrowKeyNavOptions } from './keyboard'

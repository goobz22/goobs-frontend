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

import React, {
  useEffect,
  useId,
  type CSSProperties,
  type ReactNode,
} from 'react'
import cssStyles from './FieldShell.module.css'
import type { FieldStyleOverrides, FieldTheme } from './types'
import { emitDiag } from '../../../utils/diag'
import { useOptionalFormContext } from '../../Form/context'
import { deriveRequiredFromSchema } from '../../Form/schema'

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
   * Form-engine binding key. When the shell is rendered inside a `<Form>` and
   * `name` is set, the shell auto-derives its `error` (from the engine) and
   * `required` (from the schema) for this field — unless the consumer passes
   * an explicit `error`/`required`, which always win. Also emitted as
   * `data-field-name` when `dataFieldName` is not set. Outside a `<Form>` this
   * prop is inert and the shell behaves byte-for-byte as before.
   */
  name?: string | undefined

  /**
   * Marks the field as visually "filled" (has a value) — emitted as
   * `data-filled` on the wrapper for CSS float-label / styling hooks. Purely
   * presentational; defaults to undefined (attribute omitted).
   */
  filled?: boolean | undefined

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
  name,
  filled,
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

  // Optional form-engine context. `null` outside any <Form> — which is the
  // back-compat path every existing explicit-prop callsite takes. When present
  // AND a `name` is set, the shell can derive `error`/`required` for this
  // field; explicit props always override.
  const ctx = useOptionalFormContext()

  // Bound error: an explicit `error` prop always wins (even `false`/`''`).
  // Only when `error` is undefined do we fall back to the engine's error for
  // this field. Outside a form, or without a name, this is always `error`.
  const boundError =
    error !== undefined
      ? error
      : ctx && name
        ? ctx.engine.getError(name)
        : undefined

  // Top-level props win over styles-nested, which win over schema-derived.
  // Most consumers pass exactly one of these; if several are set the explicit
  // top-level prop is the documented winner. The schema-derived fallback only
  // applies inside a <Form> with a `name`.
  const required =
    requiredProp ??
    styles?.required ??
    (ctx && name ? deriveRequiredFromSchema(ctx.schema, name) : false)
  const disabled = disabledProp ?? styles?.disabled ?? false
  const theme: FieldTheme = styles?.theme ?? 'sacred'
  const requiredIndicator = styles?.requiredIndicatorText ?? ' *'

  // Error handling: string error sets aria-invalid AND renders the
  // string in the helper region. Boolean true sets aria-invalid AND
  // keeps the helperText (consumer can render their own bespoke
  // error elsewhere). Falsy = no error.
  const hasError = Boolean(boundError)
  const errorMessage = typeof boundError === 'string' ? boundError : null

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

  // Diagnostic bus — every Field flows through this shell, so emitting here
  // wires form.validation.failed for ALL field types (Text, Dropdown, Date,
  // …) in one place. Edge-triggered on `error` so it fires when validation
  // fails, not on every render. `rule` is a coarse best-effort derived from
  // the error message (the precise zod rule lives in the host's validation
  // layer); the field id is dataFieldName (the form-input name tests target).
  // Deps are `error` + the two STABLE string ids only — never the ReactNode
  // label, whose ref churns per render. No-op when no host bus is present.
  useEffect(() => {
    if (!boundError) return
    const message = typeof boundError === 'string' ? boundError : ''
    const rule = /required/i.test(message)
      ? 'required'
      : /invalid|not a valid|format|match|must be|@/i.test(message)
        ? 'format'
        : 'invalid'
    emitDiag({
      type: 'form.validation.failed',
      formId: dataField ?? '',
      field: dataFieldName ?? name ?? dataField ?? '',
      rule,
      value: message || true,
    })
  }, [boundError, dataField, dataFieldName, name])

  return (
    <div
      className={cssStyles.shell}
      data-component="FieldShell"
      data-theme={theme}
      data-state={resolvedState}
      data-field={dataField}
      data-field-name={dataFieldName ?? name}
      data-filled={filled}
      aria-disabled={disabled || undefined}
      aria-invalid={hasError || undefined}
      style={styleOverridesToCss(styles)}
    >
      {label !== undefined && label !== null && label !== '' && (
        // Empty-string labels render no <label> element — historically
        // the shell allocated a ~25px label slot (font-size 14px + 4px
        // gap + 4px margin) even with `label=""`, dropping bare inputs
        // (e.g. DataGrid footer's page-size selector) visibly below
        // their sibling controls. Fixed 2026-05-22.
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

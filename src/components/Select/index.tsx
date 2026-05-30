'use client'

import React from 'react'
import type { FormFieldStyles } from '../Field/Shell/types'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'
import { useOptionalFormContext } from '../Form/context'
import cssStyles from './Select.module.css'

export interface SelectStyles extends FormFieldStyles {
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  children?: React.ReactNode
  styles?: SelectStyles
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  fullWidth?: boolean
  error?: boolean
  displayEmpty?: boolean
  /**
   * Form-engine binding key (also forwarded to the native `<select name>`).
   * When inside a `<Form>` with no explicit `value`, `useFieldBinding` pulls the
   * value/onChange from the form engine; otherwise the caller's explicit
   * value/onChange pass through unchanged (back-compat).
   */
  name?: string
  /** Stable test selector — emitted as `data-field-name`; defaults to `name`. */
  dataFieldName?: string
}

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

const Select: React.FC<SelectProps> = ({
  children,
  styles,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  error = false,
  disabled = false,
  displayEmpty = false,
  style = {},
  name,
  dataFieldName,
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  ...props
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit value,
  // value/onChange/onBlur come from the form engine; otherwise the caller's
  // explicit value passes through unchanged (back-compat). The caller's native
  // onChange/onBlur take DOM events, not the string the binding forwards, so
  // they are NOT chained inside useFieldBinding (whose originalOnChange is
  // string-typed) — they are invoked from the native handlers below, where the
  // real event is available, preserving behavior.
  const formContext = useOptionalFormContext()
  const { value: boundValue, onChange: boundOnChange, onBlur: boundOnBlur } =
    useFieldBinding<string>({
      name,
      value: valueProp as string | undefined,
    })

  const handleNativeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      // Drive the form-engine binding from the selected string value, then run
      // the caller's native onChange with the real event (preserved behavior).
      boundOnChange?.(event.target.value)
      onChangeProp?.(event)
    },
    [boundOnChange, onChangeProp]
  )

  const handleNativeBlur = React.useCallback(
    (event: React.FocusEvent<HTMLSelectElement>): void => {
      boundOnBlur?.()
      onBlurProp?.(event)
    },
    [boundOnBlur, onBlurProp]
  )

  // When bound to the engine, surface the engine's error presence on the root
  // (the `error` prop still wins when the caller passed it explicitly).
  const engineError =
    formContext && name ? formContext.engine.getError(name) : undefined
  const hasError = error || Boolean(engineError)

  // The value actually rendered by the <select>: the engine/caller-bound value
  // when present, otherwise undefined so the native uncontrolled path is kept.
  const resolvedValue = boundValue

  const theme = styles?.theme || 'sacred'

  const rootClassName = mergeClassNames(
    cssStyles.root,
    fullWidth ? cssStyles.fullWidth : undefined
  )

  const selectClassName = mergeClassNames(
    cssStyles.select,
    cssStyles[variant],
    size === 'small' ? cssStyles.small : undefined
  )

  // Caller-supplied scalar overrides passed through as CSS custom properties.
  // borderRadius only applies to the outlined variant (the only variant with
  // a radius in the old inline logic); fontSize only applies to the medium
  // size (small forces 0.875rem in the .small class). The caller-supplied
  // `style` prop is spread last so it keeps its old override precedence.
  const selectStyle: React.CSSProperties & Record<string, string | number> = {}
  if (variant === 'outlined' && styles?.borderRadius) {
    selectStyle['--select-radius'] = styles.borderRadius
  }
  if (size === 'medium' && styles?.fontSize) {
    selectStyle['--select-font-size'] = styles.fontSize
  }
  // Caller color/font overrides that getFormFieldTheme honored before the
  // CSS-module migration. These feed the same custom properties the theme
  // tokens set, so a caller value overrides the theme default per-key — exactly
  // as `styles.backgroundColor || baseTheme.background` did in the old theme fn.
  if (styles?.backgroundColor) {
    selectStyle['--select-bg'] = styles.backgroundColor
  }
  if (styles?.borderColor) {
    selectStyle['--select-border-default'] = styles.borderColor
  }
  if (styles?.borderFocusedColor) {
    selectStyle['--select-border-focused'] = styles.borderFocusedColor
  }
  if (styles?.textColor) {
    selectStyle['--select-text'] = styles.textColor
  }
  if (styles?.fontFamily) {
    selectStyle['--select-font-family'] = styles.fontFamily
  }
  Object.assign(selectStyle, style)

  // `helperTextType: 'error'` rendered the error border in the old
  // getFormFieldTheme path even when the boolean `error` prop wasn't set.
  // Surface it as a separate data attribute so the CSS can color the border
  // without conflating it with the boolean-error red (#d32f2f) used above.
  const hasHelperError = styles?.helperTextType === 'error'

  // `data-filled` reflects a non-empty current selection (engine/caller value).
  const hasValue =
    typeof resolvedValue === 'string'
      ? resolvedValue.length > 0
      : resolvedValue != null

  return (
    <div
      className={rootClassName}
      data-theme={theme}
      data-component="Select"
      data-field-name={dataFieldName ?? name}
      data-filled={hasValue ? 'true' : undefined}
      data-error={hasError ? 'true' : undefined}
      data-helper-error={hasHelperError ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
    >
      <select
        className={selectClassName}
        style={selectStyle}
        disabled={disabled}
        name={name}
        value={resolvedValue}
        onChange={handleNativeChange}
        onBlur={handleNativeBlur}
        {...props}
      >
        {displayEmpty && (
          <option value="" disabled hidden>
            Select an option
          </option>
        )}
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div className={cssStyles.arrow} aria-hidden="true">
        ▼
      </div>
    </div>
  )
}

export default Select

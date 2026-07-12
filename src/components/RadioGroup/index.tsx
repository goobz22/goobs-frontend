'use client'

import React, { useState } from 'react'
import cssStyles from './RadioGroup.module.css'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'
import { useOptionalFormContext } from '../Form/context'
import { deriveRequiredFromSchema } from '../Form/schema'

/**
 * Interface representing a single radio option
 */
export interface RadioOption {
  label: string
  color?: string
}

/**
 * Custom style overrides for the RadioGroup. Theme selects the palette
 * (light default; sacred/dark are CSS [data-theme] overrides); the remaining
 * keys are caller-supplied overrides applied as CSS custom properties on the
 * root so the selectors stay in CSS while runtime values remain dynamic.
 */
export interface RadioGroupStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Label styling
  /** Group label color. */
  labelColor?: string
  /** Group label font size. */
  labelFontSize?: string
  /** Group label font weight. */
  labelFontWeight?: string | number
  /** Group label font family. */
  labelFontFamily?: string

  // Radio button styling
  /** Diameter of each radio ring. */
  radioSize?: string
  /** Radio ring border color. */
  radioOuterBorderColor?: string
  /** Radio ring border width. */
  radioOuterBorderWidth?: string
  /**
   * Color of the checked inner dot. Passing this opts the group into the
   * ring-and-dot presentation (`data-inner-dot` on the root): the checked
   * outer ring stays hollow and the inner dot renders in this color. When
   * omitted, checked state is the default solid-filled outer ring.
   */
  radioInnerColor?: string
  /** Radio ring border color on hover. */
  radioHoverBorderColor?: string
  /** Radio ring background on hover. */
  radioHoverBackgroundColor?: string

  // Text styling
  /** Option text color. */
  textColor?: string
  /** Option text font size. */
  textFontSize?: string
  /** Option text font family. */
  textFontFamily?: string
  /** Option text color on hover. */
  textHoverColor?: string

  // Layout and spacing
  /** Padding around each option row. */
  padding?: string
  /** Space below the group label. */
  marginBottom?: string

  // Transitions
  /** Replaces the control transition with `all <duration> <easing>`. */
  transitionDuration?: string
  /** Easing used with transitionDuration (default cubic-bezier(0.4, 0, 0.2, 1)); ignored without it. */
  transitionEasing?: string
}

/**
 * Interface for the props of the RadioGroup component
 */
export interface RadioGroupProps {
  /** The group label */
  label?: string
  /** Array of radio options */
  options: RadioOption[]
  /**
   * Controlled selected value. When provided, the group is controlled by the
   * caller (back-compat / explicit control). When omitted, the group manages
   * its own selection via `defaultValue` — OR, inside a `<Form>`, the form
   * engine owns the value (Tier-1 binding).
   */
  value?: string
  /** Default selected value */
  defaultValue?: string
  /** Name for the radio group */
  name: string
  /** Label text to display */
  labelText?: string
  /**
   * Stable test selector. Emitted as `data-field-name` on the root — falls
   * back to `name` when not provided.
   */
  dataFieldName?: string
  /**
   * Marks the group required. Renders a required indicator (` *`) after the
   * group heading and sets `aria-required` on the `role="radiogroup"` element.
   * Inside a `<Form>` this is auto-derived from the schema for this `name` when
   * omitted (an explicit prop always wins). WCAG 3.3.2 Labels or Instructions.
   */
  required?: boolean
  /**
   * Validation state for the whole group. A string renders the message in the
   * error region (`role="alert"` + `aria-live="polite"`, linked to the group
   * via `aria-describedby`) and sets `aria-invalid` on the radiogroup; `true`
   * sets the invalid state/styling without a message. Inside a `<Form>` this is
   * auto-derived from the form engine for this `name` when omitted (an explicit
   * prop — including `false`/`''` — always wins). This is the per-field feedback
   * a bound, required group needs on a failed submit (WCAG 3.3.1 Error
   * Identification / 4.1.2 Name, Role, Value).
   */
  error?: string | boolean
  /**
   * Persistent helper text shown below the group (e.g. an instruction). It is
   * replaced by `error` while an error is present and is linked to the
   * radiogroup via `aria-describedby` so assistive tech announces it.
   */
  helperText?: React.ReactNode
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Custom styles to apply using the theme system */
  styles?: RadioGroupStyles
  /**
   * Forwarded ref to the FIRST radio `<input>` in the group (React 19
   * ref-as-prop) — the group's roving tab-stop entry point, so consumers can
   * move focus into the radiogroup. The wrapping `<div role="radiogroup">` and
   * the per-option `<label>`s are structural; the ref lands on a real control.
   */
  ref?: React.Ref<HTMLInputElement>
}

/**
 * Build the inline CSS custom properties for caller-supplied style overrides.
 * Only keys the caller set are emitted; everything else falls back to the
 * theme token defaults defined in RadioGroup.module.css.
 */
const buildOverrideVars = (styles?: RadioGroupStyles): React.CSSProperties => {
  if (!styles) return {}

  const overrideVars: Record<string, string> = {}

  if (styles.labelColor)
    overrideVars['--rg-label-color-override'] = styles.labelColor
  if (styles.labelFontSize)
    overrideVars['--rg-label-font-size-override'] = styles.labelFontSize
  if (styles.labelFontWeight !== undefined)
    overrideVars['--rg-label-font-weight-override'] = String(
      styles.labelFontWeight
    )
  if (styles.labelFontFamily)
    overrideVars['--rg-label-font-family-override'] = styles.labelFontFamily
  if (styles.marginBottom)
    overrideVars['--rg-label-margin-bottom'] = styles.marginBottom

  if (styles.padding)
    overrideVars['--rg-option-padding-override'] = styles.padding

  if (styles.radioSize)
    overrideVars['--rg-radio-size-override'] = styles.radioSize
  if (styles.radioOuterBorderWidth)
    overrideVars['--rg-radio-border-width-override'] =
      styles.radioOuterBorderWidth
  if (styles.radioOuterBorderColor)
    overrideVars['--rg-radio-border-color-override'] =
      styles.radioOuterBorderColor
  if (styles.radioHoverBorderColor)
    overrideVars['--rg-radio-hover-border-color-override'] =
      styles.radioHoverBorderColor
  if (styles.radioHoverBackgroundColor)
    overrideVars['--rg-radio-hover-bg-override'] =
      styles.radioHoverBackgroundColor
  if (styles.radioInnerColor)
    overrideVars['--rg-radio-inner-color-override'] = styles.radioInnerColor

  if (styles.textColor)
    overrideVars['--rg-text-color-override'] = styles.textColor
  if (styles.textFontSize)
    overrideVars['--rg-text-font-size-override'] = styles.textFontSize
  if (styles.textFontFamily)
    overrideVars['--rg-text-font-family-override'] = styles.textFontFamily
  if (styles.textHoverColor)
    overrideVars['--rg-text-hover-color-override'] = styles.textHoverColor

  // Custom transition (transitionDuration/easing) — mirrors the old
  // getRadioGroupTheme `all <dur> <easing>` string.
  if (styles.transitionDuration) {
    overrideVars['--rg-transition'] =
      `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
  }

  return overrideVars as React.CSSProperties
}

/**
 * RadioGroup component renders a group of radio buttons with customizable options.
 * It allows selecting a single value from a list of options.
 * @param props The props for the RadioGroup component.
 * @returns The rendered RadioGroup component.
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value: controlledValue,
  defaultValue,
  name,
  labelText,
  dataFieldName,
  required: requiredProp,
  error: errorProp,
  helperText,
  onChange,
  styles,
  ref,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  // Tier-1 form binding. Inside a <Form> with a `name` and NO explicit
  // `value`, the selected string + change are owned by the form engine. Outside
  // a form, the caller's controlled `value` (or, absent that, the internal
  // `selectedValue` state) drives the group — byte-for-byte back-compat via the
  // shouldBind gate in useFieldBinding.
  const { value: boundValue, onChange: writeBoundValue } =
    useFieldBinding<string>({
      name,
      value: controlledValue,
    })
  // Precedence: caller-controlled value > form-engine bound value > internal
  // uncontrolled state. `boundValue` is only defined when actually bound.
  const effectiveValue =
    controlledValue ?? (boundValue !== undefined ? boundValue : selectedValue)

  const theme = styles?.theme || 'light'
  const overrideVars = buildOverrideVars(styles)

  // Resolved group heading (labelText wins over label). The radiogroup only
  // advertises `aria-labelledby` when this is non-empty — pointing at an empty
  // element would leave the group with no accessible name (WCAG 4.1.2).
  const groupLabel = labelText || label
  const labelId = `${name}-label`
  const helperId = `${name}-helper`

  // Validation affordance. RadioGroup binds directly (it is not wrapped in
  // FieldShell — a single `<label htmlFor>` can't front a multi-input group),
  // so it derives its own error/required exactly as FieldShell does: an
  // explicit prop always wins (even `false`/`''`); otherwise, when bound inside
  // a `<Form>` with a `name`, it reads the engine error and schema-required for
  // this field. Outside a form (or without a name) both fall back to false.
  const formCtx = useOptionalFormContext()
  const resolvedError =
    errorProp !== undefined
      ? errorProp
      : formCtx && name
        ? formCtx.engine.getError(name)
        : undefined
  const hasError = Boolean(resolvedError)
  const errorMessage =
    typeof resolvedError === 'string' ? resolvedError : null
  const required =
    requiredProp ??
    (formCtx && name ? deriveRequiredFromSchema(formCtx.schema, name) : false)

  // Single region below the group: the error message when invalid, else the
  // persistent helper text. Linked to the radiogroup via `aria-describedby` and
  // announced with `role="alert"` while it carries an error.
  const helperContent = errorMessage ?? helperText
  const showHelper =
    helperContent !== undefined &&
    helperContent !== null &&
    helperContent !== ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep internal state in sync for the uncontrolled path; harmless when
    // controlled/bound (the effectiveValue precedence ignores it).
    setSelectedValue(e.target.value)
    // When bound to the form engine, push the new selection upstream.
    writeBoundValue?.(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div
      className={cssStyles.formControl}
      data-component="RadioGroup"
      data-field-name={dataFieldName ?? name}
      data-filled={effectiveValue !== undefined && effectiveValue !== ''}
      data-inner-dot={styles?.radioInnerColor ? 'true' : undefined}
      data-state={hasError ? 'error' : undefined}
      data-theme={theme}
      style={overrideVars}
    >
      {groupLabel ? (
        <span id={labelId} className={cssStyles.formLabel}>
          {groupLabel}
          {/* Required indicator — decorative `*` beside the heading. It is
              aria-hidden so it never leaks into the group's accessible name
              (aria-required already conveys the state programmatically). */}
          {required ? (
            <span aria-hidden="true" className={cssStyles.requiredIndicator}>
              {' *'}
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={groupLabel ? labelId : undefined}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={showHelper ? helperId : undefined}
      >
        {options.map((option, index) => {
          const isChecked = effectiveValue === option.label

          return (
            <label key={index} className={cssStyles.optionLabel}>
              <input
                // The consumer ref lands on the first radio — the group's
                // roving tab-stop entry point.
                ref={index === 0 ? ref : undefined}
                type="radio"
                name={name}
                value={option.label}
                checked={isChecked}
                className={cssStyles.input}
                onChange={handleChange}
              />
              {/* Purely presentational ring/dot — the native radio above
                  already conveys checked state to assistive tech, so this
                  decorative graphic is hidden from the a11y tree. */}
              <span className={cssStyles.radioSpan} aria-hidden="true">
                <span className={cssStyles.radioOuter} />
                <span className={cssStyles.radioInner} />
              </span>
              <span
                className={cssStyles.text}
                data-has-color={option.color ? 'true' : undefined}
                style={
                  option.color
                    ? ({
                        ['--rg-option-color']: option.color,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
      {/* Error / helper region. Announced with role="alert" + aria-live while
          it carries a validation error; referenced by the radiogroup's
          aria-describedby so screen readers tie the message to the group. */}
      {showHelper ? (
        <div
          id={helperId}
          className={cssStyles.helper}
          data-helper-type={hasError ? 'error' : undefined}
          role={hasError ? 'alert' : undefined}
          aria-live={hasError ? 'polite' : undefined}
        >
          {helperContent}
        </div>
      ) : null}
    </div>
  )
}

export default RadioGroup

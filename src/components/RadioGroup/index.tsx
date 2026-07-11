'use client'

import React, { useState } from 'react'
import cssStyles from './RadioGroup.module.css'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'

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
      data-theme={theme}
      style={overrideVars}
    >
      <label id={`${name}-label`} className={cssStyles.formLabel}>
        {labelText || label}
      </label>
      <div role="radiogroup" aria-labelledby={`${name}-label`}>
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
              <span className={cssStyles.radioSpan}>
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
    </div>
  )
}

export default RadioGroup

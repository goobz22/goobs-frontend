/**
 * @fileoverview Defines the Checkbox component, a custom checkbox with theming.
 * It supports light, dark, and sacred themes with extensive customization options.
 *
 * Migrated from the legacy `theme/checkbox.ts` JS theme system to a
 * `Checkbox.module.css` CSS module. Theme is now a `data-theme` attribute on the
 * wrapper; hover/checked/indeterminate/disabled visual states are expressed as
 * CSS `:hover` + `[data-*]` selectors rather than JS-computed style objects.
 * Caller-supplied style overrides are forwarded as CSS custom properties.
 */
'use client'

import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useId,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
} from 'react'
import cssStyles from './Checkbox.module.css'
import CheckIcon from '../Icons/Check'
import IndeterminateCheckBoxIcon from '../Icons/IndeterminateCheckBox'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

/**
 * Comprehensive styling options. Theme selects the palette (data-theme);
 * every other field is an optional caller override forwarded to CSS as a
 * custom property (consumed via `var(--cb-foo, <theme default>)`).
 */
export interface CheckboxStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  width?: string
  height?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  backgroundColor?: string
  backdropFilter?: string
  boxShadow?: string
  backgroundImage?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string
  hoverBackgroundImage?: string

  // Checked states (checked === indeterminate visually in every theme)
  checkedBackgroundColor?: string
  checkedBorderColor?: string
  checkedBoxShadow?: string
  checkedBackgroundImage?: string

  // Checkmark icon
  iconColor?: string

  // Disabled states
  disabledBackgroundColor?: string
  disabledBorderColor?: string
  disabledBoxShadow?: string
  disabledTransform?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean
}

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'
> {
  /** Whether the checkbox is checked */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Callback when checkbox state changes */
  onChange?: (checked: boolean) => void
  /** Callback when checkbox is focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when checkbox loses focus */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean
  /**
   * Stable test selector. Emitted as `data-field-name` on the root wrapper —
   * falls back to the input `name` when not provided. Lets Playwright
   * `[data-field-name="…"]` locators target the whole control, not just the
   * hidden input.
   */
  dataFieldName?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CheckboxStyles
}

/**
 * Builds the CSS-custom-property style object from caller-supplied overrides.
 * Only keys the caller actually set are emitted; everything unset falls back to
 * the theme default baked into Checkbox.module.css via `var(--cb-foo, default)`.
 * State is NOT computed here — it lives in CSS selectors. Returns undefined when
 * the caller passed no overridable styling, so we don't attach an empty style.
 */
function buildDynamicStyle(styles?: CheckboxStyles): CSSProperties | undefined {
  if (!styles) return undefined

  const dynamicStyle: Record<string, string> = {}

  // Wrapper transition override (old getCheckboxTheme wrapper.transition)
  if (styles.transitionDuration) {
    dynamicStyle['--cb-wrapper-transition'] =
      `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
  }

  // Container size
  if (styles.width) dynamicStyle['--cb-width'] = styles.width
  if (styles.height) dynamicStyle['--cb-height'] = styles.height

  // Box base
  if (styles.borderWidth) dynamicStyle['--cb-border-width'] = styles.borderWidth
  if (styles.borderColor) dynamicStyle['--cb-border-color'] = styles.borderColor
  if (styles.borderRadius)
    dynamicStyle['--cb-border-radius'] = styles.borderRadius
  if (styles.backgroundColor) dynamicStyle['--cb-bg'] = styles.backgroundColor
  if (styles.backdropFilter)
    dynamicStyle['--cb-backdrop-filter'] = styles.backdropFilter
  if (styles.boxShadow) dynamicStyle['--cb-box-shadow'] = styles.boxShadow
  if (styles.backgroundImage)
    dynamicStyle['--cb-bg-image'] = styles.backgroundImage

  // Hover
  if (styles.hoverBackgroundColor)
    dynamicStyle['--cb-hover-bg'] = styles.hoverBackgroundColor
  if (styles.hoverBorderColor)
    dynamicStyle['--cb-hover-border-color'] = styles.hoverBorderColor
  if (styles.hoverBoxShadow)
    dynamicStyle['--cb-hover-box-shadow'] = styles.hoverBoxShadow
  if (styles.hoverTransform)
    dynamicStyle['--cb-hover-transform'] = styles.hoverTransform
  if (styles.hoverBackgroundImage)
    dynamicStyle['--cb-hover-bg-image'] = styles.hoverBackgroundImage

  // Checked / indeterminate (shared)
  if (styles.checkedBackgroundColor)
    dynamicStyle['--cb-checked-bg'] = styles.checkedBackgroundColor
  if (styles.checkedBorderColor)
    dynamicStyle['--cb-checked-border-color'] = styles.checkedBorderColor
  if (styles.checkedBoxShadow)
    dynamicStyle['--cb-checked-box-shadow'] = styles.checkedBoxShadow
  if (styles.checkedBackgroundImage)
    dynamicStyle['--cb-checked-bg-image'] = styles.checkedBackgroundImage

  // Checkmark icon color (caller override; consumed by .icon { color: var(--cb-icon-color, ...) })
  if (styles.iconColor) dynamicStyle['--cb-icon-color'] = styles.iconColor

  // Disabled
  if (styles.disabledBackgroundColor)
    dynamicStyle['--cb-disabled-bg'] = styles.disabledBackgroundColor
  if (styles.disabledBorderColor)
    dynamicStyle['--cb-disabled-border-color'] = styles.disabledBorderColor
  if (styles.disabledBoxShadow)
    dynamicStyle['--cb-disabled-box-shadow'] = styles.disabledBoxShadow
  if (styles.disabledTransform)
    dynamicStyle['--cb-disabled-transform'] = styles.disabledTransform

  // Margins
  if (styles.margin) dynamicStyle['--cb-margin'] = styles.margin
  if (styles.marginTop) dynamicStyle['--cb-margin-top'] = styles.marginTop
  if (styles.marginBottom)
    dynamicStyle['--cb-margin-bottom'] = styles.marginBottom
  if (styles.marginLeft) dynamicStyle['--cb-margin-left'] = styles.marginLeft
  if (styles.marginRight) dynamicStyle['--cb-margin-right'] = styles.marginRight

  if (Object.keys(dynamicStyle).length === 0) return undefined
  return dynamicStyle as CSSProperties
}

// --------------------------------------------------------------------------
// MAIN CHECKBOX COMPONENT
// --------------------------------------------------------------------------

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    indeterminate,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    onFocus,
    onBlur,
    styles,
    id: providedId,
    dataFieldName,
    ...rest
  } = props

  // Tier-1 form binding. When this checkbox is rendered inside a <Form> with a
  // `name` and NO explicit `checked`, the boolean value + change handler are
  // taken over by the form engine. Outside a form, or with an explicit
  // `checked`, this is a pass-through and the control behaves byte-for-byte as
  // before (the gate lives in useFieldBinding).
  const fieldName = typeof rest.name === 'string' ? rest.name : undefined
  const { value: boundChecked, onChange: boundOnChange } =
    useFieldBinding<boolean>({
      name: fieldName,
      value: controlledChecked,
      onChange,
    })

  // Use React's useId for stable IDs across server and client
  const generatedId = useId()
  const stableId = providedId || generatedId
  const internalRef = useRef<HTMLInputElement>(null)

  // State management for controlled/uncontrolled component
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    defaultChecked || false
  )
  const isControlled = boundChecked !== undefined
  const checked = isControlled ? boundChecked : uncontrolledChecked
  const isDisabled = !!(styles?.disabled || rest.disabled)

  const theme = styles?.theme || 'light'
  const isChecked = checked
  const isIndeterminate = indeterminate && !isChecked
  const hasOutline = styles?.outline !== false
  const showPremiumAccent =
    theme !== 'sacred' && hasOutline && (isChecked || !!isIndeterminate)

  const dynamicStyle = buildDynamicStyle(styles)

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked

      if (!isControlled) {
        setUncontrolledChecked(newChecked)
      }

      boundOnChange?.(newChecked)
    },
    [isControlled, boundOnChange]
  )

  useImperativeHandle(ref, () => internalRef.current!)

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate || false
    }
  }, [indeterminate])

  // Data-attribute flags shared by box + icon for CSS state selectors.
  // `true`/undefined so absent attributes don't match `[data-x='true']`.
  const checkedAttr = isChecked ? 'true' : undefined
  const indeterminateAttr = isIndeterminate ? 'true' : undefined
  const disabledAttr = isDisabled ? 'true' : undefined
  const noOutlineAttr = hasOutline ? undefined : 'true'

  return (
    <label
      htmlFor={stableId}
      className={cssStyles.wrapper}
      data-component="Checkbox"
      data-theme={theme}
      data-field-name={dataFieldName ?? fieldName}
      data-filled={!!isChecked}
      {...(showPremiumAccent && { 'data-premium-accent': 'true' })}
      {...(disabledAttr && { 'data-disabled': disabledAttr })}
      {...(dynamicStyle && { style: dynamicStyle })}
    >
      <div className={cssStyles.container}>
        <input
          type="checkbox"
          id={stableId}
          ref={internalRef}
          className={cssStyles.input}
          aria-checked={indeterminate ? 'mixed' : undefined}
          disabled={isDisabled}
          checked={!!isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-field-name={rest.name}
          {...rest}
        />
        <div
          className={cssStyles.box}
          {...(checkedAttr && { 'data-checked': checkedAttr })}
          {...(indeterminateAttr && {
            'data-indeterminate': indeterminateAttr,
          })}
          {...(disabledAttr && { 'data-disabled': disabledAttr })}
          {...(noOutlineAttr && { 'data-no-outline': noOutlineAttr })}
        ></div>
        <div
          className={cssStyles.icon}
          {...(checkedAttr && { 'data-checked': checkedAttr })}
          {...(indeterminateAttr && {
            'data-indeterminate': indeterminateAttr,
          })}
          {...(disabledAttr && { 'data-disabled': disabledAttr })}
          {...(noOutlineAttr && { 'data-no-outline': noOutlineAttr })}
        >
          {indeterminate ? (
            <IndeterminateCheckBoxIcon
              styles={{
                theme: styles?.theme || 'sacred',
                size: styles?.theme === 'sacred' ? 20 : 18,
              }}
            />
          ) : (
            <CheckIcon
              styles={{
                theme: styles?.theme || 'sacred',
                size: styles?.theme === 'sacred' ? 20 : 18,
              }}
            />
          )}
        </div>
      </div>
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox

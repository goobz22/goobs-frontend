'use client'

import React, { type CSSProperties } from 'react'
import cssStyles from './Switch.module.css'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'

// --------------------------------------------------------------------------
// STYLES INTERFACE
// Public styling contract for the `styles` prop. Migrated inline off
// theme/switch.ts as part of the CSS-module migration — the JS theme switch
// (getSwitchStyles) is gone; theme variants are now [data-theme] overrides in
// Switch.module.css and caller overrides ride in as CSS custom properties.
// --------------------------------------------------------------------------

export interface SwitchStyles {
  /** Theme selection: 'light', 'dark' (default), or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'
  /** Whether to show outline. */
  outline?: boolean
  /** Custom track width. */
  trackWidth?: string
  /** Custom track height. */
  trackHeight?: string
  /** Custom track background color. */
  trackBackground?: string
  /** Custom track border color. */
  trackBorderColor?: string
  /** Custom track border radius. */
  trackBorderRadius?: string
  /** Custom thumb size. */
  thumbSize?: string
  /** Custom thumb background color. */
  thumbBackground?: string
  /** Custom thumb border color. */
  thumbBorderColor?: string
  /** Custom label color. */
  labelColor?: string
  /** Custom label font family. */
  labelFontFamily?: string
  /** Custom label font size. */
  labelFontSize?: string
  /** Custom label font weight. */
  labelFontWeight?: string | number
  /** Custom transition duration (e.g. '250ms'). */
  transitionDuration?: string
  /** Custom checked track color. */
  checkedTrackColor?: string
  /** Custom checked thumb color. */
  checkedThumbColor?: string
  /** Set false to suppress the focus-visible ring (data-focus-effects). */
  focusEffects?: boolean
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text to display on the left side of the switch */
  leftLabel?: string
  /** Label text to display on the right side of the switch */
  rightLabel?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: SwitchStyles
}

// --------------------------------------------------------------------------
// MAIN SWITCH COMPONENT
// --------------------------------------------------------------------------

/**
 * Toggle switch with optional left/right labels and light/dark/sacred theming
 * (the sacred variant renders glyph thumb content plus a shimmer). Auto-binds
 * its boolean value by `name` inside a goobs `<Form>`; otherwise controlled via
 * `checked`.
 */
const Switch: React.FC<SwitchProps> = ({
  disabled,
  checked,
  styles,
  onChange,
  leftLabel,
  rightLabel,
  ...props
}) => {
  const theme = styles?.theme ?? 'dark'
  const isSacredTheme = theme === 'sacred'

  // Tier-1 form binding. Inside a <Form> with a `name` and NO explicit
  // `checked`, the boolean value + change are owned by the form engine; the
  // caller's `onChange` (ChangeEvent-based) still fires. Outside a form, or
  // with an explicit `checked`, this is a byte-for-byte pass-through — the
  // shouldBind gate in useFieldBinding guarantees it.
  const fieldName =
    typeof (props as React.InputHTMLAttributes<HTMLInputElement>).name ===
    'string'
      ? (props as React.InputHTMLAttributes<HTMLInputElement>).name
      : undefined
  const { value: boundChecked, onChange: writeBoundValue } =
    useFieldBinding<boolean>({
      name: fieldName,
      value: checked,
    })
  const effectiveChecked = boundChecked

  // Caller-supplied overrides become CSS custom properties consumed by
  // Switch.module.css. Only set a var when the caller actually provided the
  // value, so the per-theme defaults in the CSS keep applying otherwise.
  const dynamicStyle: CSSProperties & Record<string, string> = {}
  if (styles?.trackWidth !== undefined)
    dynamicStyle['--switch-track-width'] = styles.trackWidth
  if (styles?.trackHeight !== undefined)
    dynamicStyle['--switch-track-height'] = styles.trackHeight
  if (styles?.trackBackground !== undefined)
    dynamicStyle['--switch-track-bg'] = styles.trackBackground
  if (styles?.trackBorderColor !== undefined)
    dynamicStyle['--switch-track-border-color'] = styles.trackBorderColor
  if (styles?.trackBorderRadius !== undefined)
    dynamicStyle['--switch-track-radius'] = styles.trackBorderRadius
  if (styles?.checkedTrackColor !== undefined)
    dynamicStyle['--switch-track-checked-bg'] = styles.checkedTrackColor
  if (styles?.thumbSize !== undefined)
    dynamicStyle['--switch-thumb-size'] = styles.thumbSize
  if (styles?.thumbBackground !== undefined)
    dynamicStyle['--switch-thumb-bg'] = styles.thumbBackground
  if (styles?.thumbBorderColor !== undefined)
    dynamicStyle['--switch-thumb-border-color'] = styles.thumbBorderColor
  if (styles?.checkedThumbColor !== undefined)
    dynamicStyle['--switch-thumb-checked-bg'] = styles.checkedThumbColor
  if (styles?.labelColor !== undefined)
    dynamicStyle['--switch-label-color'] = styles.labelColor
  if (styles?.labelFontFamily !== undefined)
    dynamicStyle['--switch-label-font-family'] = styles.labelFontFamily
  if (styles?.labelFontSize !== undefined)
    dynamicStyle['--switch-label-font-size'] = styles.labelFontSize
  if (styles?.labelFontWeight !== undefined)
    dynamicStyle['--switch-label-font-weight'] = String(styles.labelFontWeight)
  if (styles?.transitionDuration !== undefined)
    dynamicStyle['--switch-transition'] =
      `all ${styles.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // When bound to the form engine, push the new boolean upstream first.
    writeBoundValue?.(event.target.checked)
    if (onChange) {
      onChange(event)
    }
  }

  const getThumbContent = () => {
    if (isSacredTheme) {
      return effectiveChecked ? '𓊹' : '𓊨'
    }
    return effectiveChecked ? '✓' : ''
  }

  return (
    <label
      className={cssStyles.container}
      data-component="Switch"
      data-theme={theme}
      data-field-name={fieldName}
      data-filled={!!effectiveChecked}
      {...(disabled && { 'data-disabled': 'true' })}
      {...(effectiveChecked && { 'data-checked': 'true' })}
      {...(styles?.outline === false && { 'data-outline': 'false' })}
      {...(styles?.focusEffects === false && { 'data-focus-effects': 'false' })}
      style={dynamicStyle}
    >
      {leftLabel && <span className={cssStyles.leftLabel}>{leftLabel}</span>}

      <div className={cssStyles.track}>
        <input
          type="checkbox"
          className={cssStyles.input}
          disabled={disabled}
          onChange={handleChange}
          data-field-name={
            (props as React.InputHTMLAttributes<HTMLInputElement>).name
          }
          {...props}
          checked={effectiveChecked}
        />

        {/* Sacred shimmer effect — visibility/animation handled purely in CSS
            (sacred theme + :checked + :hover). */}
        {isSacredTheme && <div className={cssStyles.shimmer} />}

        <div className={cssStyles.thumb}>{getThumbContent()}</div>
      </div>

      {rightLabel && <span className={cssStyles.rightLabel}>{rightLabel}</span>}
    </label>
  )
}

Switch.displayName = 'Switch'

export default Switch

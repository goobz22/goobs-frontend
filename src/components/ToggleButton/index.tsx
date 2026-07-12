/**
 * @fileoverview ToggleButton and ToggleButtonGroup components for goobs-frontend
 * Provides toggleable button functionality with sacred theme support
 */
'use client'

import React, { ReactNode } from 'react'
import cssStyles from './ToggleButton.module.css'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'

// --------------------------------------------------------------------------
// STYLE CONTRACT — ToggleButton now owns its own CSS module. The legacy
// `ButtonStyles` shape from the shared Button theme is replaced by a small
// local prop type covering exactly what these components consumed: a theme
// selector plus the caller-supplied layout/dimension overrides that the old
// getButtonStyles passed straight through to the inline style object.
// --------------------------------------------------------------------------

export type ToggleButtonTheme = 'light' | 'dark' | 'sacred'

export interface ToggleButtonStyles {
  /** Theme selection. Default `'light'` (matches the pre-migration default). */
  theme?: ToggleButtonTheme

  // Caller-supplied layout / spacing / dimension overrides — applied as inline
  // style on the button, exactly as the old getButtonStyles forwarded them.
  /** Button margin shorthand. */
  margin?: string
  /** Button top margin. */
  marginTop?: string
  /** Button bottom margin. */
  marginBottom?: string
  /** Button left margin. */
  marginLeft?: string
  /** Button right margin. */
  marginRight?: string
  /** Button width. */
  width?: string
  /** Button max-width. */
  maxWidth?: string
  /** Button min-width. */
  minWidth?: string
  /** Button height. */
  height?: string
  /** Button max-height. */
  maxHeight?: string
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ToggleButtonProps {
  value: string
  children: ReactNode
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  styles?: ToggleButtonStyles
  isFirst?: boolean
  isLast?: boolean
  'aria-label'?: string
  /**
   * Forwarded ref to the underlying `<button>` element (React 19 ref-as-prop)
   * so consumers can focus or measure an individual toggle. The `<button>` IS
   * the leaf this component renders.
   */
  ref?: React.Ref<HTMLButtonElement>
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ToggleButtonGroupProps {
  /**
   * Currently-selected button value. Optional so the group can be driven by a
   * surrounding `<Form>` (Tier-1 binding) when a `name` is supplied and no
   * explicit `value` is passed. When provided (including `null` for "no
   * selection") the group is caller-controlled — the byte-for-byte back-compat
   * path for the existing callsites.
   */
  value?: string | null
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  styles?: ToggleButtonStyles
  /**
   * Form-engine binding key. Inside a `<Form>` with `name` set and no explicit
   * `value`, the selected value is owned by the form engine.
   */
  name?: string
  /**
   * Stable test selector. Emitted as `data-field-name` on the group root —
   * falls back to `name` when not provided.
   */
  dataFieldName?: string
  /**
   * Accessible name for the group. Supplying this (or `aria-labelledby`) is
   * what promotes the container to `role="group"`, so assistive tech announces
   * the set (e.g. "View mode, group") before its toggle buttons (WCAG 1.3.1 /
   * 4.1.2). Strongly recommended on every group. Without a name the container
   * stays a plain `<div>` (no nameless `role="group"`, which would be a
   * contextless "group" announcement) and its buttons are announced
   * individually — mirrors the sibling `ButtonGroup`.
   */
  'aria-label'?: string
  /**
   * ID reference supplying the group's accessible name — the labelledby
   * alternative to `aria-label` (point it at a visible heading/legend).
   */
  'aria-labelledby'?: string
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON COMPONENT
// --------------------------------------------------------------------------

/**
 * A single toggleable button with selected/disabled states, small/medium/large
 * sizing, and light/dark/sacred theming. Designed to be grouped by the exported
 * `ToggleButtonGroup`, which manages exclusive selection and auto-binds the
 * chosen value by `name` inside a goobs `<Form>`.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  children,
  selected = false,
  onClick,
  disabled = false,
  size = 'medium',
  styles,
  isFirst = false,
  isLast = false,
  'aria-label': ariaLabel,
  ref,
}) => {
  const theme: ToggleButtonTheme = styles?.theme || 'light'

  // Only caller-supplied layout/dimension overrides stay in JS — every visual
  // (theme / selected / size / hover / active / disabled) is now CSS.
  const dynamicStyle: React.CSSProperties = {}
  if (styles?.margin !== undefined) dynamicStyle.margin = styles.margin
  if (styles?.marginTop !== undefined) dynamicStyle.marginTop = styles.marginTop
  if (styles?.marginBottom !== undefined)
    dynamicStyle.marginBottom = styles.marginBottom
  if (styles?.marginLeft !== undefined)
    dynamicStyle.marginLeft = styles.marginLeft
  if (styles?.marginRight !== undefined)
    dynamicStyle.marginRight = styles.marginRight
  if (styles?.width !== undefined) dynamicStyle.width = styles.width
  if (styles?.maxWidth !== undefined) dynamicStyle.maxWidth = styles.maxWidth
  if (styles?.minWidth !== undefined) dynamicStyle.minWidth = styles.minWidth
  if (styles?.height !== undefined) dynamicStyle.height = styles.height
  if (styles?.maxHeight !== undefined) dynamicStyle.maxHeight = styles.maxHeight

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event)
    }
  }

  return (
    <button
      ref={ref}
      className={cssStyles.button}
      {...(Object.keys(dynamicStyle).length > 0 && { style: dynamicStyle })}
      data-theme={theme}
      data-size={size}
      {...(selected && { 'data-selected': 'true' })}
      {...(isFirst && { 'data-first': 'true' })}
      {...(isLast && { 'data-last': 'true' })}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      data-action="toggle"
      data-value={value}
    >
      {children}
    </button>
  )
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP COMPONENT
// --------------------------------------------------------------------------

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  value,
  exclusive = true,
  onChange,
  children,
  size = 'medium',
  styles,
  name,
  dataFieldName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}) => {
  const childrenArray = React.Children.toArray(children)
  const totalChildren = childrenArray.length
  const theme: ToggleButtonTheme = styles?.theme || 'light'

  // Tier-1 form binding. Inside a <Form> with a `name` and NO explicit `value`,
  // the selected string is owned by the form engine. Outside a form, the
  // caller's controlled `value` drives the group — byte-for-byte back-compat
  // via the shouldBind gate in useFieldBinding. `null` (explicit "no
  // selection") counts as a caller-supplied value, so it never auto-binds.
  const { value: boundValue, onChange: writeBoundValue } = useFieldBinding<
    string | null
  >({
    name,
    value,
  })
  const effectiveValue = boundValue ?? null

  // A group boundary is only meaningful with an accessible NAME. An unnamed
  // `role="group"` adds a contextless "group" announcement in assistive tech
  // without telling the user what the set is — noise, and exactly the
  // unlabelled pattern the audit warned against. So emit `role="group"` ONLY
  // when the caller supplies a name (`aria-label` or `aria-labelledby`); an
  // unlabelled group stays a plain `<div>` and its buttons are announced
  // individually (WCAG 1.3.1 / 4.1.2). A named group still resolves
  // `getByRole('group', {name})`. Mirrors the sibling ButtonGroup gate.
  const hasAccessibleName = Boolean(ariaLabel || ariaLabelledby)

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ToggleButtonProps>(child)) {
      const isFirst = index === 0
      const isLast = index === totalChildren - 1
      const isSelected = child.props.value === effectiveValue

      return React.cloneElement(child, {
        ...child.props,
        selected: isSelected,
        size,
        styles: {
          ...styles,
          ...child.props.styles,
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (exclusive) {
            const newValue = isSelected ? null : child.props.value
            writeBoundValue?.(newValue)
            onChange(e, newValue)
          } else {
            writeBoundValue?.(child.props.value)
            onChange(e, child.props.value)
          }

          if (child.props.onClick) {
            child.props.onClick(e)
          }
        },
        isFirst,
        isLast,
      })
    }
    return child
  })

  return (
    <div
      className={cssStyles.group}
      data-component="ToggleButtonGroup"
      data-field-name={dataFieldName ?? name}
      data-filled={effectiveValue !== null && effectiveValue !== ''}
      data-theme={theme}
      {...(hasAccessibleName ? { role: 'group' } : {})}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {enhancedChildren}
    </div>
  )
}

export default ToggleButton

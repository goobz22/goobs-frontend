'use client'

import React, { useMemo, useCallback, forwardRef, type ReactNode } from 'react'
import cssStyles from './Button.module.css'

export interface ButtonGroupProps {
  value: string
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  children: React.ReactNode
  styles?: ButtonStyles
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  value,
  exclusive,
  onChange,
  children,
  styles,
}) => {
  const theme = styles?.theme || 'sacred'

  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement<ButtonProps>(child)) {
      const isSelected =
        ((child.props as { value?: string }).value || '') === value

      return React.cloneElement(child, {
        ...child.props,
        styles: {
          ...child.props.styles,
          ...styles,
          theme,
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (exclusive) {
            onChange(e, (child.props as { value?: string }).value || '')
          }
          if (child.props.onClick) {
            child.props.onClick(e)
          }
        },
        selected: isSelected,
      })
    }
    return child
  })

  return (
    <div className={cssStyles.buttonGroup} data-theme={theme}>
      {enhancedChildren}
    </div>
  )
}

export interface ButtonStyles {
  disabled?: boolean
  theme?: string
  variant?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  padding?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  letterSpacing?: string
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  border?: string
  boxShadow?: string
  iconLocation?: 'left' | 'right' | 'above'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  backgroundColor?: string
  background?: string
  color?: string
  borderRightWidth?: string
  borderRightStyle?: string
  borderRightColor?: string
  outline?: string | boolean
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverTransform?: string
  hoverBoxShadow?: string
  textShadow?: string
  flex?: string | number
  opacity?: number | string
  cursor?: string
  size?: string
}

/**
 * Canonical action verbs the auto-CRUD test scaffolder reasons about.
 * Free-form strings are still accepted (the prop is `string`), but
 * using the canonical set keeps `[data-action="..."]` selectors
 * consistent across the app so a single Playwright helper can locate
 * any "Create" / "Save" / "Delete" button regardless of which
 * workspace it lives in.
 */
export type ButtonAction =
  | 'create'
  | 'save'
  | 'submit'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'confirm'
  | 'close'
  | 'reset'
  | 'apply'
  | 'next'
  | 'back'
  | 'view'

/**
 * Visual variants. Drives the default colors when `styles` doesn't
 * override. `primary` is the affirmative action (Create / Save /
 * Confirm), `secondary` is neutral (Cancel / Close), `destructive`
 * is for irreversible mutations (Delete).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'destructive'

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style'
> {
  text?: string
  icon?: ReactNode
  styles?: ButtonStyles
  selected?: boolean
  value?: string
  /**
   * Action verb — emitted as `data-action="<verb>"` on the rendered
   * `<button>`. Required so test selectors stay stable when label text
   * changes (e.g. "Create" → "Create New" → "+ Add").
   * Tests target via `[data-action="create"][data-subject="contract"]`.
   */
  action?: ButtonAction | string
  /**
   * Singular entity noun the action targets (e.g. `"contract"`,
   * `"category"`, `"employee"`). Emitted as `data-subject="<value>"`.
   * Pairs with `action` so multiple Create buttons on one page
   * disambiguate by entity.
   */
  subject?: string
  /**
   * Visual variant. When set, applies a default color palette unless
   * `styles` overrides specific keys. Also emitted as
   * `data-variant="<value>"` so tests can assert intent
   * (e.g. delete-confirmation modals expect a `destructive` confirm).
   */
  variant?: ButtonVariant
}

/**
 * Variant-driven default colors. Applied BEFORE `styles` so caller
 * overrides win. Sacred theme is the goobs default; these defaults
 * match the visual language already used in ThothOS workspaces:
 *   primary     → gold-on-dark   (Create / Save / Confirm)
 *   secondary   → dim white      (Cancel / Close)
 *   destructive → red            (Delete / irreversible mutations)
 */
function variantDefaults(variant: ButtonVariant | undefined): ButtonStyles {
  if (!variant) return {}
  if (variant === 'destructive') {
    return {
      backgroundColor: 'rgba(220, 53, 69, 0.15)',
      borderColor: 'rgba(220, 53, 69, 0.5)',
      color: '#FF6B6B',
      hoverBackgroundColor: 'rgba(220, 53, 69, 0.25)',
    }
  }
  if (variant === 'secondary') {
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      color: 'rgba(255, 255, 255, 0.85)',
      hoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  }
  return {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.5)',
    color: '#FFD700',
    hoverBackgroundColor: 'rgba(255, 215, 0, 0.25)',
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      icon,
      styles,
      onClick,
      selected,
      action,
      subject,
      variant,
      ...restProps
    },
    ref
  ) => {
    const filteredProps = useMemo(() => {
      const { sacredtheme, ...validProps } = restProps as any
      void sacredtheme
      return validProps
    }, [restProps])

    // Variant defaults applied before user `styles` so caller wins.
    const mergedStyles: ButtonStyles | undefined = variant
      ? { ...variantDefaults(variant), ...styles }
      : styles
    styles = mergedStyles

    const isDisabled = styles?.disabled || filteredProps.disabled
    const iconLocation = styles?.iconLocation || 'left'
    const theme = styles?.theme || 'sacred'

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled && onClick) {
          onClick(event)
        }
      },
      [isDisabled, onClick]
    )

    // Handle outline prop - convert boolean to string
    const outlineValue =
      styles?.outline === true
        ? 'none'
        : styles?.outline === false
          ? undefined
          : styles?.outline || undefined

    // Build dynamic inline styles for customizations that override CSS
    const dynamicStyle: React.CSSProperties = {}

    // Apply custom sizing
    if (styles?.width) dynamicStyle.width = styles.width
    if (styles?.minWidth) dynamicStyle.minWidth = styles.minWidth
    if (styles?.maxWidth) dynamicStyle.maxWidth = styles.maxWidth
    if (styles?.height) dynamicStyle.height = styles.height
    if (styles?.minHeight) dynamicStyle.minHeight = styles.minHeight
    if (styles?.padding) dynamicStyle.padding = styles.padding

    // Apply custom margins
    if (styles?.margin) dynamicStyle.margin = styles.margin
    if (styles?.marginTop) dynamicStyle.marginTop = styles.marginTop
    if (styles?.marginBottom) dynamicStyle.marginBottom = styles.marginBottom
    if (styles?.marginLeft) dynamicStyle.marginLeft = styles.marginLeft
    if (styles?.marginRight) dynamicStyle.marginRight = styles.marginRight

    // Apply custom typography
    if (styles?.fontSize) dynamicStyle.fontSize = styles.fontSize
    if (styles?.fontWeight) dynamicStyle.fontWeight = styles.fontWeight
    if (styles?.fontFamily) dynamicStyle.fontFamily = styles.fontFamily
    if (styles?.letterSpacing) dynamicStyle.letterSpacing = styles.letterSpacing
    if (styles?.textTransform) dynamicStyle.textTransform = styles.textTransform
    if (styles?.whiteSpace) dynamicStyle.whiteSpace = styles.whiteSpace

    // Apply custom colors (only if explicitly set)
    if (styles?.color) dynamicStyle.color = styles.color
    if (styles?.backgroundColor)
      dynamicStyle.backgroundColor = styles.backgroundColor
    if (styles?.background) dynamicStyle.background = styles.background

    // Apply custom border
    if (styles?.border) dynamicStyle.border = styles.border
    if (styles?.borderWidth) dynamicStyle.borderWidth = styles.borderWidth
    if (styles?.borderColor) dynamicStyle.borderColor = styles.borderColor
    if (styles?.borderRadius) dynamicStyle.borderRadius = styles.borderRadius
    if (styles?.borderRightWidth)
      dynamicStyle.borderRightWidth = styles.borderRightWidth
    if (styles?.borderRightStyle)
      dynamicStyle.borderRightStyle =
        styles.borderRightStyle as React.CSSProperties['borderRightStyle']
    if (styles?.borderRightColor)
      dynamicStyle.borderRightColor = styles.borderRightColor

    // Apply custom effects
    if (styles?.boxShadow) dynamicStyle.boxShadow = styles.boxShadow
    if (styles?.textShadow) dynamicStyle.textShadow = styles.textShadow
    if (outlineValue) dynamicStyle.outline = outlineValue

    // Apply custom flex and other
    if (styles?.flex) dynamicStyle.flex = styles.flex
    if (styles?.opacity !== undefined) dynamicStyle.opacity = styles.opacity
    if (styles?.cursor) dynamicStyle.cursor = styles.cursor

    // Build className
    const classNames = [cssStyles.button]
    if (iconLocation === 'above') classNames.push(cssStyles.iconAbove)
    if (selected) classNames.push(cssStyles.selected)

    const iconComponent = useMemo(() => {
      return icon ? <span className={cssStyles.iconWrapper}>{icon}</span> : null
    }, [icon])

    return (
      <button
        ref={ref}
        className={classNames.join(' ')}
        data-theme={theme}
        data-action={action}
        data-subject={subject}
        data-variant={variant}
        style={dynamicStyle}
        disabled={isDisabled}
        onClick={handleClick}
        {...filteredProps}
      >
        {iconLocation === 'above' && iconComponent}
        {iconLocation === 'left' && iconComponent}
        {text && <span>{text}</span>}
        {iconLocation === 'right' && iconComponent}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

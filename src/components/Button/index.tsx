'use client'

import React, { useMemo, useCallback, forwardRef, type ReactNode } from 'react'
import cssStyles from './Button.module.css'
import { emitDiag } from '../../utils/diag'

/** Props for ButtonGroup — a segmented single-select row of Button children. */
export interface ButtonGroupProps {
  /** Currently-selected value. The child Button whose `value` matches renders in the selected state. */
  value: string
  /** When `true`, clicking a child reports that child's `value` through `onChange` (single-select semantics). When unset, clicks only run each child's own `onClick`. */
  exclusive?: boolean
  /** Selection callback. Fires only in `exclusive` mode, with the clicked child's `value` (`''` when the child has none — never `null` in practice, despite the nullable type). */
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  /** Button children. Each valid element is cloned with the group's merged `styles`, theme, and a computed `selected` flag. */
  children: React.ReactNode
  /** Styling forwarded onto every child Button — group keys override each child's own `styles` keys — and applied as the container's `data-theme` (default `'sacred'`). */
  styles?: ButtonStyles
}

/**
 * Segmented control wrapping Button children in one bordered row (rounded
 * outer corners, dividers between children — see `.buttonGroup` in
 * Button.module.css). Clones each child to inject the group's theme/styles
 * and mark the child whose `value` matches the group `value` as `selected`;
 * in `exclusive` mode a click reports the child's value via `onChange`
 * before the child's own `onClick` runs.
 */
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

/**
 * Styling override surface for Button (ButtonGroup forwards the same shape
 * onto every child). `theme` switches the CSS-module palette via
 * `data-theme`; the `hover*` keys travel as `--btn-hover-*` custom
 * properties consumed by the module's hover rule; every other key is applied
 * as an inline style on the `<button>`, overriding the module CSS. "Module
 * default" in the member docs below means the value Button.module.css
 * renders when the key is unset.
 */
export interface ButtonStyles {
  /** Disables the button. OR-ed with the native `disabled` prop; blocks `onClick` and the `action.invoke` diag, and renders the theme's disabled palette. */
  disabled?: boolean
  /** Theme palette: `'sacred'` (default), `'light'`, or `'dark'`. Emitted as `data-theme`; any other string keeps the sacred base styles because no CSS override matches it. */
  theme?: string
  /** @deprecated No-op — Button never reads `styles.variant`. Use the top-level `variant` prop for the primary/secondary/destructive palettes. */
  variant?: string
  /** Inline `width` (module default `auto`). */
  width?: string
  /** Inline `min-width` (module default `fit-content`). */
  minWidth?: string
  /** Inline `max-width`. */
  maxWidth?: string
  /** Inline `height` (module default `auto`). */
  height?: string
  /** Inline `min-height` (module default `var(--goobs-control-height)`, compact ≤768px). */
  minHeight?: string
  /** Inline `padding` (module default `5px 12px`, `4px 10px` ≤768px). */
  padding?: string
  /** Inline `margin` shorthand. */
  margin?: string
  /** Inline `margin-top`. */
  marginTop?: string
  /** Inline `margin-bottom`. */
  marginBottom?: string
  /** Inline `margin-left`. */
  marginLeft?: string
  /** Inline `margin-right`. */
  marginRight?: string
  /** Inline `font-size` (module default `var(--goobs-text-sm)`; the icon slot tracks it at 1.15em). */
  fontSize?: string
  /** Inline `font-weight` (module default `var(--goobs-weight-medium)`). */
  fontWeight?: string | number
  /** Inline `font-family` (module default: Cinzel on sacred, the standard stack on light/dark). */
  fontFamily?: string
  /** Inline `letter-spacing` (module default: sacred tracking, tight on light/dark). */
  letterSpacing?: string
  /** Inline `text-transform` (module default `none`). */
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  /** Inline `border-radius` (module default `var(--goobs-radius-md)`; inside a ButtonGroup the module rounds only the outer corners). */
  borderRadius?: string
  /** Inline `border-width`. */
  borderWidth?: string
  /** Inline `border-color`. Wins over the `variant` prop's default palette. */
  borderColor?: string
  /** Inline `border` shorthand (module default: 1px solid, per-theme color). */
  border?: string
  /** Inline `box-shadow` for the RESTING state — the hover shadow is `hoverBoxShadow`. */
  boxShadow?: string
  /** Where the icon renders relative to the label: `'left'` (default), `'right'`, or `'above'` (stacks icon over label in a column with a larger 1.4em glyph). */
  iconLocation?: 'left' | 'right' | 'above'
  /** Inline `white-space` (module default `nowrap`). */
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  /** Inline `background-color`. Wins over the `variant` prop's default palette. */
  backgroundColor?: string
  /** Inline `background` shorthand (gradients etc.). */
  background?: string
  /** Inline text `color`. Wins over the `variant` prop's default palette. */
  color?: string
  /** Inline `border-right-width`. */
  borderRightWidth?: string
  /** Inline `border-right-style`. */
  borderRightStyle?: string
  /** Inline `border-right-color`. */
  borderRightColor?: string
  /** `true` → visible `1px solid currentcolor` outline; a string passes through verbatim as the CSS `outline` value; `false`/unset → no outline (the module default). */
  outline?: string | boolean
  /** Hover background. Travels as the `--btn-hover-bg` custom property consumed by `.button:hover:not(:disabled)` in Button.module.css; unset falls back to the theme's hover default. The `variant` prop's palette also sets this. */
  hoverBackgroundColor?: string
  /** Hover border color, via `--btn-hover-border` (same custom-property mechanism as `hoverBackgroundColor`). */
  hoverBorderColor?: string
  /** Hover `transform` (e.g. `translateY(-1px)`), via `--btn-hover-transform` (module default `none`). */
  hoverTransform?: string
  /** Hover `box-shadow`, via `--btn-hover-shadow`; unset falls back to the theme's hover glow. */
  hoverBoxShadow?: string
  /** Inline `text-shadow`. */
  textShadow?: string
  /** Inline `flex` shorthand. */
  flex?: string | number
  /** Inline `opacity`. */
  opacity?: number | string
  /** Inline `cursor` (module default `pointer`, `not-allowed` while disabled). */
  cursor?: string
  /** @deprecated No-op — Button never reads `styles.size`. Size the button via `height`/`padding`/`fontSize`. */
  size?: string
  // Layout / typography passthrough — added 2026-05-02 to support
  // workspace conversions from native `<button>` (where these
  // properties are common in inline `style={...}` blocks). Each key
  // below is applied verbatim as the matching inline CSS property on
  // the rendered <button>; consumers that don't set it get the
  // module-CSS default.
  /** Inline `display` (module default `inline-flex`). */
  display?: React.CSSProperties['display']
  /** Inline `position` (module default `relative`). */
  position?: React.CSSProperties['position']
  /** Inline `text-align`. */
  textAlign?: React.CSSProperties['textAlign']
  /** Inline `vertical-align`. */
  verticalAlign?: React.CSSProperties['verticalAlign']
  /** Inline `align-self`. */
  alignSelf?: React.CSSProperties['alignSelf']
  /** Inline `align-items` (module default `center`). */
  alignItems?: React.CSSProperties['alignItems']
  /** Inline `justify-content` (module default `center`). */
  justifyContent?: React.CSSProperties['justifyContent']
  /** Inline `flex-direction` (the module sets `column` when `iconLocation` is `'above'`). */
  flexDirection?: React.CSSProperties['flexDirection']
  /** Inline `flex-shrink`. */
  flexShrink?: React.CSSProperties['flexShrink']
  /** Inline `flex-grow`. */
  flexGrow?: React.CSSProperties['flexGrow']
  /** Inline `flex-basis`. */
  flexBasis?: React.CSSProperties['flexBasis']
  /** Inline `flex-wrap`. */
  flexWrap?: React.CSSProperties['flexWrap']
  /** Inline `gap` between icon and label (module default `6px`). */
  gap?: React.CSSProperties['gap']
  /** Inline `row-gap`. */
  rowGap?: React.CSSProperties['rowGap']
  /** Inline `column-gap`. */
  columnGap?: React.CSSProperties['columnGap']
  /** Inline `transition` (module default: 180ms ease on background/border/shadow/color). */
  transition?: string
  /** Inline `transform` for the RESTING state — the hover transform is `hoverTransform`. */
  transform?: string
  /** Inline `z-index`. */
  zIndex?: React.CSSProperties['zIndex']
  /** Inline `top` (pair with `position`). */
  top?: React.CSSProperties['top']
  /** Inline `right` (pair with `position`). */
  right?: React.CSSProperties['right']
  /** Inline `bottom` (pair with `position`). */
  bottom?: React.CSSProperties['bottom']
  /** Inline `left` (pair with `position`). */
  left?: React.CSSProperties['left']
  /** Inline `overflow`. */
  overflow?: React.CSSProperties['overflow']
  /** Inline `overflow-x`. */
  overflowX?: React.CSSProperties['overflowX']
  /** Inline `overflow-y`. */
  overflowY?: React.CSSProperties['overflowY']
  /** Inline `text-overflow`. */
  textOverflow?: React.CSSProperties['textOverflow']
  /** Inline `line-height` (module default `1.2`). */
  lineHeight?: React.CSSProperties['lineHeight']
  /** Inline `border-style`. */
  borderStyle?: React.CSSProperties['borderStyle']
  /** Inline `border-top` shorthand. */
  borderTop?: React.CSSProperties['borderTop']
  /** Inline `border-bottom` shorthand. */
  borderBottom?: React.CSSProperties['borderBottom']
  /** Inline `border-left` shorthand. */
  borderLeft?: React.CSSProperties['borderLeft']
  /** Inline `border-right` shorthand. */
  borderRight?: React.CSSProperties['borderRight']
  /** Inline `pointer-events`. */
  pointerEvents?: React.CSSProperties['pointerEvents']
  /** Inline `user-select` (module default `none`). */
  userSelect?: React.CSSProperties['userSelect']
  /** Inline `visibility`. */
  visibility?: React.CSSProperties['visibility']
  /** Inline `text-decoration`. */
  textDecoration?: React.CSSProperties['textDecoration']
  /** Inline `text-indent`. */
  textIndent?: React.CSSProperties['textIndent']
  /** Inline `word-break`. */
  wordBreak?: React.CSSProperties['wordBreak']
  /** Inline `word-spacing`. */
  wordSpacing?: React.CSSProperties['wordSpacing']
  /** Inline `font-style` (e.g. `italic`). */
  fontStyle?: React.CSSProperties['fontStyle']
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

/**
 * Props for Button. Extends the native `<button>` attributes (minus `style`
 * — all styling goes through `styles`); unrecognized props pass through to
 * the rendered element.
 */
export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style'
> {
  /** Button label, rendered in a `<span>` beside/below the icon per `styles.iconLocation`. Omit for an icon-only button. */
  text?: string
  /** Icon node, rendered in a sized wrapper (1.15em, tracking the button's font-size) positioned by `styles.iconLocation` (`'left'` default). */
  icon?: ReactNode
  /** Styling overrides — theme, inline-CSS keys, and hover intent. See ButtonStyles. */
  styles?: ButtonStyles
  /** Renders the pressed/selected treatment (gold-tinted on sacred). Set automatically by ButtonGroup on the child whose `value` matches the group's. */
  selected?: boolean
  /** Identity of this button inside a ButtonGroup — compared against the group `value` for selection and reported to the group's `onChange`. Unused outside a group. */
  value?: string
  /**
   * Action verb — emitted as `data-action="<verb>"` on the rendered
   * `<button>` and carried on the `action.invoke` diagnostic (which falls
   * back to `'click'` when this is omitted). Optional, but set it on any
   * button tests target: `[data-action="create"][data-subject="contract"]`
   * selectors stay stable when label text changes
   * (e.g. "Create" → "Create New" → "+ Add").
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

/**
 * Themeable action button rendering a native `<button>` with an optional icon,
 * primary/secondary/destructive variants, and an extensive `styles` override
 * surface (sacred/light/dark themes via `data-theme`). Emits
 * `data-action`/`data-subject`/`data-variant` for stable test selectors and
 * forwards its ref to the underlying element.
 */
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
        if (!isDisabled) {
          emitDiag({
            type: 'action.invoke',
            action: action ?? 'click',
            ...(subject !== undefined && { subject }),
          })
          if (onClick) {
            onClick(event)
          }
        }
      },
      [isDisabled, onClick, action, subject]
    )

    // Handle outline. `outline: true` renders a visible outline matching the
    // button's current text color; `false` explicitly suppresses any outline;
    // a string passes through verbatim as the CSS `outline` value. (The old
    // mapping inverted `true` to 'none' — the same defect class Typography
    // carried; see docs/audits/story-jsdoc-audit-2026-07-01.md §6-A.)
    const outlineValue =
      styles?.outline === true
        ? '1px solid currentcolor'
        : styles?.outline === false
          ? 'none'
          : styles?.outline || undefined

    // Build dynamic inline styles for customizations that override CSS.
    // Hover intent travels via CSS custom properties consumed in
    // Button.module.css `.button:hover:not(:disabled)` so variant-driven
    // (and caller-driven) hover backgrounds/borders/box-shadows actually
    // render instead of being silently dropped.
    const dynamicStyle: React.CSSProperties & Record<string, string> = {}

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

    // Apply hover intent via CSS custom properties. Consumed in
    // Button.module.css `.button:hover:not(:disabled)` with
    // var(--btn-hover-*, <existing default>) so unset values fall back to
    // the sacred-theme defaults.
    if (styles?.hoverBackgroundColor)
      dynamicStyle['--btn-hover-bg'] = styles.hoverBackgroundColor
    if (styles?.hoverBorderColor)
      dynamicStyle['--btn-hover-border'] = styles.hoverBorderColor
    if (styles?.hoverBoxShadow)
      dynamicStyle['--btn-hover-shadow'] = styles.hoverBoxShadow
    if (styles?.hoverTransform)
      dynamicStyle['--btn-hover-transform'] = styles.hoverTransform

    // Apply custom flex and other
    if (styles?.flex) dynamicStyle.flex = styles.flex
    if (styles?.opacity !== undefined) dynamicStyle.opacity = styles.opacity
    if (styles?.cursor) dynamicStyle.cursor = styles.cursor

    // Layout / positioning passthrough — added 2026-05-02 to support
    // workspace conversions from native `<button>` (where these
    // properties are common in inline `style={...}` blocks).
    if (styles?.display) dynamicStyle.display = styles.display
    if (styles?.position) dynamicStyle.position = styles.position
    if (styles?.textAlign) dynamicStyle.textAlign = styles.textAlign
    if (styles?.verticalAlign) dynamicStyle.verticalAlign = styles.verticalAlign
    if (styles?.alignSelf) dynamicStyle.alignSelf = styles.alignSelf
    if (styles?.alignItems) dynamicStyle.alignItems = styles.alignItems
    if (styles?.justifyContent)
      dynamicStyle.justifyContent = styles.justifyContent
    if (styles?.flexDirection) dynamicStyle.flexDirection = styles.flexDirection
    if (styles?.flexShrink !== undefined)
      dynamicStyle.flexShrink = styles.flexShrink
    if (styles?.flexGrow !== undefined) dynamicStyle.flexGrow = styles.flexGrow
    if (styles?.flexBasis !== undefined)
      dynamicStyle.flexBasis = styles.flexBasis
    if (styles?.flexWrap) dynamicStyle.flexWrap = styles.flexWrap
    if (styles?.gap !== undefined) dynamicStyle.gap = styles.gap
    if (styles?.rowGap !== undefined) dynamicStyle.rowGap = styles.rowGap
    if (styles?.columnGap !== undefined)
      dynamicStyle.columnGap = styles.columnGap
    if (styles?.transition) dynamicStyle.transition = styles.transition
    if (styles?.transform) dynamicStyle.transform = styles.transform
    if (styles?.zIndex !== undefined) dynamicStyle.zIndex = styles.zIndex
    if (styles?.top !== undefined) dynamicStyle.top = styles.top
    if (styles?.right !== undefined) dynamicStyle.right = styles.right
    if (styles?.bottom !== undefined) dynamicStyle.bottom = styles.bottom
    if (styles?.left !== undefined) dynamicStyle.left = styles.left
    if (styles?.overflow) dynamicStyle.overflow = styles.overflow
    if (styles?.overflowX) dynamicStyle.overflowX = styles.overflowX
    if (styles?.overflowY) dynamicStyle.overflowY = styles.overflowY
    if (styles?.textOverflow) dynamicStyle.textOverflow = styles.textOverflow
    if (styles?.lineHeight !== undefined)
      dynamicStyle.lineHeight = styles.lineHeight
    if (styles?.borderStyle) dynamicStyle.borderStyle = styles.borderStyle
    if (styles?.borderTop) dynamicStyle.borderTop = styles.borderTop
    if (styles?.borderBottom) dynamicStyle.borderBottom = styles.borderBottom
    if (styles?.borderLeft) dynamicStyle.borderLeft = styles.borderLeft
    if (styles?.borderRight) dynamicStyle.borderRight = styles.borderRight
    if (styles?.pointerEvents) dynamicStyle.pointerEvents = styles.pointerEvents
    if (styles?.userSelect) dynamicStyle.userSelect = styles.userSelect
    if (styles?.visibility) dynamicStyle.visibility = styles.visibility
    if (styles?.textDecoration)
      dynamicStyle.textDecoration = styles.textDecoration
    if (styles?.textIndent !== undefined)
      dynamicStyle.textIndent = styles.textIndent
    if (styles?.wordBreak) dynamicStyle.wordBreak = styles.wordBreak
    if (styles?.wordSpacing !== undefined)
      dynamicStyle.wordSpacing = styles.wordSpacing
    if (styles?.fontStyle) dynamicStyle.fontStyle = styles.fontStyle

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
        data-component="Button"
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

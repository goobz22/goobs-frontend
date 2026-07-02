'use client'

import React, { forwardRef } from 'react'
import cssStyles from './Divider.module.css'

export interface DividerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
  /** Optional label rendered centered on top of the rule. */
  children?: React.ReactNode
  /** Styling options; each scalar override rides in as a `--divider-*` CSS custom property. */
  styles?: {
    /** Rule direction: 'horizontal' (default) or 'vertical'. */
    orientation?: 'horizontal' | 'vertical'
    /**
     * Margin shorthand. Applied only when no per-side margin override below
     * is set; otherwise the per-side values (and their CSS defaults) win.
     */
    margin?: string
    /** Top margin (default: 24px main-axis spacing on horizontal, 0 on vertical). */
    marginTop?: string
    /** Bottom margin (default: 24px main-axis spacing on horizontal, 0 on vertical). */
    marginBottom?: string
    /** Left margin (default: 0 on horizontal, 24px main-axis spacing on vertical). */
    marginLeft?: string
    /** Right margin (default: 0 on horizontal, 24px main-axis spacing on vertical). */
    marginRight?: string
    /** Rule height: the 2px thickness of a horizontal divider, the 100% length of a vertical one. */
    height?: string
    /** Rule width: the 100% length of a horizontal divider, the 2px thickness of a vertical one. */
    width?: string
    /** Text color of the centered label content (theme default otherwise). */
    color?: string
    /** `data-theme` variant: 'sacred' (default, gold gradient), 'light', or 'dark'. */
    theme?: string
    /** Dims the rule (half opacity + weaker gradient alpha). Default false. */
    disabled?: boolean
    /** Replaces the theme gradient with this solid rule color. */
    backgroundColor?: string
  }
}

function mergeClassNames(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/**
 * Thin gradient rule, horizontal (default) or vertical, with an optional
 * label centered on the line. Themed via `data-theme` (sacred gold gradient
 * by default; light/dark remap to neutral border tokens); scalar overrides
 * (width/height/margins/colors) ride in as `--divider-*` CSS custom
 * properties, and `styles.backgroundColor` swaps the gradient for a solid
 * color. All other div attributes (except `style`) pass through to the root.
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, styles, ...restProps }, ref) => {
    const orientation = styles?.orientation || 'horizontal'
    const disabled = styles?.disabled || false
    const theme = styles?.theme || 'sacred'

    const rootClassName = mergeClassNames(
      cssStyles.root,
      orientation === 'vertical' ? cssStyles.vertical : cssStyles.horizontal,
      disabled && cssStyles.disabled,
      styles?.backgroundColor && cssStyles.hasBackground
    )

    // Caller-supplied scalar overrides flow in as CSS custom properties so
    // the selector logic (orientation defaults, disabled alpha) stays in CSS.
    // Margin shorthand vs longhand: the old component picked one or the other
    // to avoid mixing; here the CSS owns per-side longhand fallbacks, so we
    // translate `margin` shorthand into the individual sides only when no
    // explicit per-side override was given (preserving prior precedence).
    const hasIndividualHorizontalMargin =
      styles?.marginTop !== undefined ||
      styles?.marginBottom !== undefined ||
      styles?.marginLeft !== undefined ||
      styles?.marginRight !== undefined
    const hasIndividualVerticalMargin =
      styles?.marginLeft !== undefined || styles?.marginRight !== undefined

    const dynamicStyle: React.CSSProperties = {
      ...(styles?.width !== undefined && {
        ['--divider-width']: styles.width,
      }),
      ...(styles?.height !== undefined && {
        ['--divider-height']: styles.height,
      }),
      ...(styles?.backgroundColor !== undefined && {
        ['--divider-background']: styles.backgroundColor,
      }),
      ...(styles?.color !== undefined && {
        ['--divider-content-color']: styles.color,
      }),
      ...(styles?.marginTop !== undefined && {
        ['--divider-margin-top']: styles.marginTop,
      }),
      ...(styles?.marginBottom !== undefined && {
        ['--divider-margin-bottom']: styles.marginBottom,
      }),
      ...(styles?.marginLeft !== undefined && {
        ['--divider-margin-left']: styles.marginLeft,
      }),
      ...(styles?.marginRight !== undefined && {
        ['--divider-margin-right']: styles.marginRight,
      }),
    } as React.CSSProperties

    // `margin` shorthand only takes effect when no per-side override exists,
    // matching the old getHorizontal/getVerticalMargins() precedence.
    if (styles?.margin !== undefined) {
      if (orientation === 'horizontal' && !hasIndividualHorizontalMargin) {
        ;(dynamicStyle as Record<string, string>).margin = styles.margin
      } else if (orientation === 'vertical' && !hasIndividualVerticalMargin) {
        ;(dynamicStyle as Record<string, string>).margin = styles.margin
      }
    }

    return (
      <div
        ref={ref}
        className={rootClassName}
        data-component="Divider"
        data-theme={theme}
        style={dynamicStyle}
        {...restProps}
      >
        {children && <div className={cssStyles.content}>{children}</div>}
      </div>
    )
  }
)

Divider.displayName = 'Divider'

export default Divider

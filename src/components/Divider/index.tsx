'use client'

import React, { forwardRef } from 'react'
import cssStyles from './Divider.module.css'

export interface DividerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
  children?: React.ReactNode
  styles?: {
    orientation?: 'horizontal' | 'vertical'
    margin?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    height?: string
    width?: string
    color?: string
    theme?: string
    disabled?: boolean
    backgroundColor?: string
  }
}

function mergeClassNames(
  ...names: Array<string | false | undefined>
): string {
  return names.filter(Boolean).join(' ')
}

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

'use client'

import React, { forwardRef, useId } from 'react'
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
 *
 * Renders with `role="separator"` + `aria-orientation` by default so AT
 * announces the thematic break. For a purely decorative rule, pass
 * `role="presentation"` (or `role="none"`): the separator-only ARIA
 * (`aria-orientation`/`aria-labelledby`) is then dropped automatically, so
 * `role="presentation"` alone is sufficient — no extra `aria-hidden` is needed
 * to stay `aria-allowed-attr`-clean.
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, styles, role, ...restProps }, ref) => {
    const orientation = styles?.orientation || 'horizontal'
    const disabled = styles?.disabled || false
    const theme = styles?.theme || 'sacred'

    // A divider is a thematic break, so it DEFAULTS to the ARIA `separator`
    // role (the equivalent of a native `<hr>`). A caller can opt out for a
    // purely decorative rule by passing `role="presentation"` (or `"none"`).
    // We resolve the EFFECTIVE role here because `aria-orientation` and
    // `aria-labelledby` are separator-specific attributes: axe's
    // `aria-allowed-attr` rule forbids them on `presentation`/`none`, so they
    // must be GATED on the separator role rather than emitted unconditionally.
    // `role` is destructured out of `restProps` so the caller's override still
    // wins while we can also see it to drive that gate.
    const effectiveRole = role ?? 'separator'
    const isSeparator = effectiveRole === 'separator'

    // Stable id linking the centered label to the separator's accessible name.
    // `role="separator"` marks its descendants as presentational (ARIA
    // "children presentational: true"), so the visible label text would NOT be
    // exposed on its own; `aria-labelledby` pointing at the label element is
    // what surfaces "OR"/etc. as the separator's accessible name to AT.
    const reactId = useId()
    const contentId = `divider-content-${reactId}`

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
        data-orientation={orientation}
        // Default `separator` (see effectiveRole note); a caller override to
        // `presentation`/`none` for a decorative rule flows through here.
        role={effectiveRole}
        // `aria-orientation` (direction) and `aria-labelledby` (the label as the
        // accessible name — see contentId note) are separator-ONLY attributes.
        // Emit them only when the effective role is `separator`, so a decorative
        // override never yields an invalid `role="presentation" aria-orientation`
        // pair (axe `aria-allowed-attr`). Both sit before `{...restProps}` so a
        // caller can still override them explicitly if they need to.
        aria-orientation={isSeparator ? orientation : undefined}
        aria-labelledby={isSeparator && children ? contentId : undefined}
        style={dynamicStyle}
        {...restProps}
      >
        {children && (
          <div id={contentId} className={cssStyles.content}>
            {children}
          </div>
        )}
      </div>
    )
  }
)

Divider.displayName = 'Divider'

export default Divider

/**
 * @fileoverview This file defines the Avatar component, a circular container for displaying icons, images, or text.
 * It supports light, dark, and sacred themes with extensive customization options for size and styling.
 */
'use client'

import React, { forwardRef, type CSSProperties } from 'react'
import cssStyles from './Avatar.module.css'

// --------------------------------------------------------------------------
// STYLES TYPE
// --------------------------------------------------------------------------

export interface AvatarStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Size options
  /** Named size preset applied via data-size in the CSS module. */
  size?: 'small' | 'medium' | 'large' | 'xl'
  /** Explicit width (overrides the size preset). */
  width?: string
  /** Explicit height (overrides the size preset). */
  height?: string

  // Appearance
  /** Avatar background color. */
  backgroundColor?: string
  /** Content text/icon color. */
  color?: string
  /** Border radius (default circular). */
  borderRadius?: string
  /** Content font size. */
  fontSize?: string
  /** Content font weight. */
  fontWeight?: string | number

  // Border and shadow
  /** Full border shorthand; wins over borderColor/borderWidth. */
  border?: string
  /** Border color; composes `<borderWidth> solid <borderColor>` when `border` is not set. */
  borderColor?: string
  /** Border width used with borderColor (default 1px); ignored without borderColor. */
  borderWidth?: string
  /** Avatar box shadow. */
  boxShadow?: string

  // Layout and spacing
  /** Margin shorthand. */
  margin?: string
  /** Top margin. */
  marginTop?: string
  /** Bottom margin. */
  marginBottom?: string
  /** Left margin. */
  marginLeft?: string
  /** Right margin. */
  marginRight?: string

  // States
  /** Renders the disabled treatment (data-disabled) — purely visual. */
  disabled?: boolean
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AvatarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
  /** The content to be displayed within the avatar (icon, text, or image). */
  children: React.ReactNode
  /**
   * Optional accessible name announced by assistive technology — typically the
   * person's or entity's full name (e.g. `"Matthew Goluba"`). When set, the
   * avatar is exposed as `role="img"` with this `aria-label`, so screen readers
   * announce the meaningful name once instead of spelling out the raw initials
   * ("M G") or reading nothing for a decorative glyph/photo. Omit for purely
   * decorative avatars whose meaning is already conveyed by adjacent visible
   * text (in that case add `aria-hidden` via the spread props to remove it from
   * the accessibility tree entirely).
   */
  label?: string
  /** Comprehensive styling options including theme, size, colors, and layout properties. */
  styles?: AvatarStyles
}

// --------------------------------------------------------------------------
// MAIN AVATAR COMPONENT
// --------------------------------------------------------------------------

/**
 * A circular avatar component with theming support for displaying icons, images, or text.
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, label, styles, ...restProps }, ref) => {
    const theme = styles?.theme || 'light'
    const isDisabled = styles?.disabled || false

    // When a caller supplies an accessible name, expose the disc as a single
    // labeled image so AT announces the name (not the raw initials/glyph). An
    // unlabeled avatar stays a plain container — its text children speak for
    // themselves, and role="img" without a name would be an unnamed-image
    // violation. Placed before {...restProps} so a caller's own role/aria-label
    // still win.
    const accessibleName =
      typeof label === 'string' && label.length > 0 ? label : undefined

    // Caller-supplied scalar overrides layer on top of the CSS defaults.
    // Border precedence: a full `border` shorthand wins; otherwise
    // `borderColor` (with optional `borderWidth`) composes one.
    const resolvedBorder =
      styles?.border ??
      (styles?.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : undefined)

    const dynamicStyle: CSSProperties = {
      ...(styles?.width !== undefined && { width: styles.width }),
      ...(styles?.height !== undefined && { height: styles.height }),
      ...(styles?.borderRadius !== undefined && {
        borderRadius: styles.borderRadius,
      }),
      ...(styles?.backgroundColor !== undefined && {
        backgroundColor: styles.backgroundColor,
      }),
      ...(styles?.color !== undefined && { color: styles.color }),
      ...(styles?.fontSize !== undefined && { fontSize: styles.fontSize }),
      ...(styles?.fontWeight !== undefined && {
        fontWeight: styles.fontWeight,
      }),
      ...(resolvedBorder !== undefined && { border: resolvedBorder }),
      ...(styles?.boxShadow !== undefined && { boxShadow: styles.boxShadow }),
      ...(styles?.margin !== undefined && { margin: styles.margin }),
      ...(styles?.marginTop !== undefined && { marginTop: styles.marginTop }),
      ...(styles?.marginBottom !== undefined && {
        marginBottom: styles.marginBottom,
      }),
      ...(styles?.marginLeft !== undefined && {
        marginLeft: styles.marginLeft,
      }),
      ...(styles?.marginRight !== undefined && {
        marginRight: styles.marginRight,
      }),
    }

    return (
      <div
        ref={ref}
        className={cssStyles.root}
        data-component="Avatar"
        data-theme={theme}
        {...(styles?.size !== undefined && { 'data-size': styles.size })}
        {...(isDisabled && { 'data-disabled': 'true' })}
        {...(accessibleName !== undefined && {
          role: 'img',
          'aria-label': accessibleName,
        })}
        style={dynamicStyle}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar

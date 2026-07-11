import type React from 'react'

// --------------------------------------------------------------------------
// ICON ACCESSIBILITY RESOLUTION
// Shared by every goobs Icon component so the accessible-icon contract lives
// in exactly one place (the icons are otherwise ~261 near-identical files).
// --------------------------------------------------------------------------

/**
 * The resolved accessibility shape for a goobs icon `<svg>`, split so the
 * caller can spread `rest` FIRST (consumer passthrough) then `svgA11y` (the
 * authoritative computed a11y attributes), and render `title` as a child
 * `<title>` element.
 */
export interface ResolvedIconA11y {
  /**
   * The consumer's remaining SVG props with the accessibility-related keys
   * removed. Spread this on the `<svg>` FIRST so the computed a11y attributes
   * below win.
   */
  rest: React.SVGProps<SVGSVGElement>
  /**
   * Computed accessibility attributes. Spread on the `<svg>` AFTER `rest` so
   * they are authoritative over any stale value the consumer passed.
   */
  svgA11y: {
    /** Always `"false"`: an icon SVG must never be a keyboard tab stop (legacy IE/Edge focus). */
    focusable: 'false'
    /** `"img"` for a named icon (unless the consumer set an explicit role); absent for a decorative one. */
    role: React.AriaRole | undefined
    'aria-label': string | undefined
    'aria-labelledby': string | undefined
    /** `true` when the icon is decorative (the default); absent when it carries a name. */
    'aria-hidden': true | undefined
  }
  /** Text alternative to render as a child `<title>` element, when supplied. */
  title: string | undefined
}

/**
 * Resolves the accessible-icon contract for a goobs Icon.
 *
 * goobs icons are **decorative by default**: with no text alternative supplied,
 * the icon renders `aria-hidden="true"` (always with `focusable="false"`) so
 * assistive technology skips it entirely and it adds no noise to the accessible
 * name of the button / link / label that wraps it. This satisfies
 * WCAG 1.1.1 (Non-text Content, Level A) — a purely decorative graphic must
 * expose a null text alternative rather than an unlabelled "graphic"/"image".
 *
 * A consumer opts **into** a meaningful icon by passing any of `aria-label`,
 * `aria-labelledby`, or `title`. That flips the icon to `role="img"` (unless an
 * explicit `role` was given), keeps it exposed to AT, and — for `title` —
 * renders a child `<title>` element (the correct accessible-name mechanism for
 * inline SVG; a `title` *attribute* on `<svg>` is inert).
 *
 * An explicit `aria-hidden` prop always wins, so an icon can be force-hidden
 * even when named, or force-exposed even when unnamed.
 *
 * The transform is purely additive: consumers who pass nothing get correct
 * decorative semantics for free; consumers who already pass `aria-label`/`role`
 * keep their exact behaviour.
 *
 * @param props The SVG props forwarded to the icon (after `styles`/`style` are peeled off).
 * @returns The `rest` passthrough, the computed `svgA11y` attributes, and the `title` text.
 */
export function resolveIconA11y(
  props: React.SVGProps<SVGSVGElement>
): ResolvedIconA11y {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-hidden': ariaHidden,
    role,
    title,
    ...rest
  } = props

  const hasAccessibleName =
    ariaLabel != null || ariaLabelledby != null || title != null

  // Explicit consumer aria-hidden always wins; otherwise hide only when the
  // icon carries no text alternative (the decorative default).
  const resolvedHidden: true | undefined =
    ariaHidden !== undefined
      ? ariaHidden === true || ariaHidden === 'true'
        ? true
        : undefined
      : hasAccessibleName
        ? undefined
        : true

  return {
    rest,
    svgA11y: {
      focusable: 'false',
      role: role ?? (hasAccessibleName ? 'img' : undefined),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-hidden': resolvedHidden,
    },
    title: typeof title === 'string' ? title : undefined,
  }
}
